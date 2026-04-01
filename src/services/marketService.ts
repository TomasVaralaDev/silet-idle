import {
  collection,
  doc,
  runTransaction,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase";
import { useGameStore } from "../store/useGameStore";
import type { MarketListing } from "../types";

/**
 * getActiveListings
 * Fetches the global pool of currently active player market listings.
 *
 * @param limitCount - Max number of results to fetch (default 50)
 * @returns Promise resolving to an array of MarketListing objects
 */
export const getActiveListings = async (limitCount = 50) => {
  const q = query(
    collection(db, "listings"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as MarketListing,
  );
};

/**
 * createListing
 * Validates inventory capacity and listing limits before committing
 * a new market listing via a Firestore Transaction.
 *
 * @param sellerUid - User ID of the listing creator
 * @param sellerName - Display name of the creator
 * @param itemId - The ID of the resource being sold
 * @param amount - Quantity being listed
 * @param pricePerItem - Cost per unit in coins
 */
export const createListing = async (
  sellerUid: string,
  sellerName: string,
  itemId: string,
  amount: number,
  pricePerItem: number,
) => {
  // 1. LIMIT VALIDATION: Count existing active listings for this user
  const activeListings = await getMyActiveListings(sellerUid);

  const userRef = doc(db, "users", sellerUid);
  const listingRef = doc(collection(db, "listings"));

  return await runTransaction(db, async (transaction) => {
    // ALL READS MUST PRECEED WRITES
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();

    // 2. CAPACITY CHECK
    const currentLimit = userData.marketListingLimit ?? 5;
    if (activeListings.length >= currentLimit) {
      throw new Error(
        `Market capacity reached. You can only have ${currentLimit} active listings.`,
      );
    }

    // 3. INVENTORY CHECK
    const inv = userData.inventory || {};
    const currentAmount = inv[itemId] || 0;
    if (currentAmount < amount) throw new Error("Not enough items");

    const newAmount = currentAmount - amount;

    // ALL WRITES
    transaction.update(userRef, { [`inventory.${itemId}`]: newAmount });
    transaction.set(listingRef, {
      sellerUid,
      sellerName,
      itemId,
      amount,
      pricePerItem,
      totalPrice: amount * pricePerItem,
      status: "active",
      createdAt: Date.now(),
    });

    // Synchronize local store immediately
    const store = useGameStore.getState();
    store.setState({ inventory: { ...store.inventory, [itemId]: newAmount } });
  });
};

interface PurchaseResponse {
  success: boolean;
  itemId: string;
  amount: number;
  totalPrice: number;
}

/**
 * purchaseListing
 * Executes a marketplace purchase via a secure Firebase Cloud Function.
 * The backend handles all tax calculations and safe data transfer.
 *
 * @param _buyerUid - Retained for API compatibility, backend extracts UID from auth token
 * @param listingId - The document ID of the target listing
 */
export const purchaseListing = async (_buyerUid: string, listingId: string) => {
  const functions = getFunctions();
  const purchaseFn = httpsCallable<{ listingId: string }, PurchaseResponse>(
    functions,
    "purchaseListing",
  );

  try {
    // Execute secure backend transaction
    const result = await purchaseFn({ listingId });
    const data = result.data;

    // Sync local store using the validated data returned from the server
    if (data.success) {
      const store = useGameStore.getState();
      const currentInvAmount = store.inventory[data.itemId] || 0;

      store.setState({
        coins: Math.max(0, store.coins - data.totalPrice),
        inventory: {
          ...store.inventory,
          [data.itemId]: currentInvAmount + data.amount,
        },
      });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during purchase.";
    console.error("Purchase failed:", errorMessage);

    // Bubble error to UI for user feedback
    throw new Error(errorMessage);
  }
};

/**
 * cancelListing
 * Aborts an active market listing via a Firestore Transaction,
 * returning the held inventory to the seller.
 *
 * @param listingId - The document ID to cancel
 * @param sellerUid - The UID of the requesting user (must match listing owner)
 */
export const cancelListing = async (listingId: string, sellerUid: string) => {
  const listingRef = doc(db, "listings", listingId);
  const sellerRef = doc(db, "users", sellerUid);

  return await runTransaction(db, async (transaction) => {
    // READS
    const listSnap = await transaction.get(listingRef);
    const sellerSnap = await transaction.get(sellerRef);

    if (!listSnap.exists()) throw new Error("Not found");
    const listing = listSnap.data() as MarketListing;

    // Security validation
    if (listing.sellerUid !== sellerUid || listing.status !== "active")
      throw new Error("Invalid");

    // WRITES
    const newAmount =
      (sellerSnap.data()?.inventory?.[listing.itemId] || 0) + listing.amount;

    transaction.update(sellerRef, {
      [`inventory.${listing.itemId}`]: newAmount,
    });
    transaction.update(listingRef, { status: "cancelled" });

    // Synchronize local store
    const store = useGameStore.getState();
    store.setState({
      inventory: { ...store.inventory, [listing.itemId]: newAmount },
    });
  });
};

/**
 * getMyActiveListings
 * Fetches all currently active listings owned by a specific user.
 *
 * @param uid - The Firebase UID of the target seller
 * @returns Promise resolving to an array of MarketListing objects
 */
export const getMyActiveListings = async (uid: string) => {
  const q = query(
    collection(db, "listings"),
    where("sellerUid", "==", uid),
    where("status", "==", "active"),
  );

  const snapshot = await getDocs(q);
  const listings = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as MarketListing,
  );

  // Local sorting avoids requiring complex composite indexes in Firestore
  return listings.sort((a, b) => b.createdAt - a.createdAt);
};
