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

export const createListing = async (
  sellerUid: string,
  sellerName: string,
  itemId: string,
  amount: number,
  pricePerItem: number,
) => {
  const userRef = doc(db, "users", sellerUid);
  const listingRef = doc(collection(db, "listings"));

  return await runTransaction(db, async (transaction) => {
    // KAIKKI READIT ALUKSI
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const inv = userSnap.data().inventory || {};
    const currentAmount = inv[itemId] || 0;
    if (currentAmount < amount) throw new Error("Not enough items");

    const newAmount = currentAmount - amount;

    // SITTEN KAIKKI WRITET
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

    // Päivitä store
    const store = useGameStore.getState();
    store.setState({ inventory: { ...store.inventory, [itemId]: newAmount } });
  });
};

// --- UUSI TYYPPI CLOUD FUNCTIONIN VASTAUKSELLE (ESLint-turvallinen) ---
interface PurchaseResponse {
  success: boolean;
  itemId: string;
  amount: number;
  totalPrice: number;
}

// --- PÄIVITETTY: CLOUD FUNCTION -KUTSU ---
export const purchaseListing = async (buyerUid: string, listingId: string) => {
  // buyerUid-parametri pidetään tallella, jotta UI-komponenttiesi kutsut
  // eivät mene rikki, vaikka backend hakeekin UID:n turvallisesti auth-tokenista.

  const functions = getFunctions();
  const purchaseFn = httpsCallable<{ listingId: string }, PurchaseResponse>(
    functions,
    "purchaseListing",
  );

  try {
    // Kutsutaan backendia
    const result = await purchaseFn({ listingId });
    const data = result.data;

    // Jos osto onnistui, päivitetään lokaali store backendin palauttamilla tiedoilla
    if (data.success) {
      const store = useGameStore.getState();
      const currentInvAmount = store.inventory[data.itemId] || 0;

      store.setState({
        // Varmistetaan, ettei UI väläytä miinusmerkkisiä rahoja vahingossa
        coins: Math.max(0, store.coins - data.totalPrice),
        inventory: {
          ...store.inventory,
          [data.itemId]: currentInvAmount + data.amount,
        },
      });
    }
  } catch (error: unknown) {
    // Napataan Firebase HttpsErrorit tai verkkoyhteysvirheet tyyppiturvallisesti
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during purchase.";
    console.error("Purchase failed:", errorMessage);

    // Heitetään virhe eteenpäin, jotta esim. MarketplaceView osaa näyttää punaisen virheilmoituksen pelaajalle
    throw new Error(errorMessage);
  }
};

export const cancelListing = async (listingId: string, sellerUid: string) => {
  const listingRef = doc(db, "listings", listingId);
  const sellerRef = doc(db, "users", sellerUid);

  return await runTransaction(db, async (transaction) => {
    // READS
    const listSnap = await transaction.get(listingRef);
    const sellerSnap = await transaction.get(sellerRef);

    if (!listSnap.exists()) throw new Error("Not found");
    const listing = listSnap.data() as MarketListing;
    if (listing.sellerUid !== sellerUid || listing.status !== "active")
      throw new Error("Invalid");

    // WRITES
    const newAmount =
      (sellerSnap.data()?.inventory?.[listing.itemId] || 0) + listing.amount;

    transaction.update(sellerRef, {
      [`inventory.${listing.itemId}`]: newAmount,
    });
    transaction.update(listingRef, { status: "cancelled" });

    // Store sync
    const store = useGameStore.getState();
    store.setState({
      inventory: { ...store.inventory, [listing.itemId]: newAmount },
    });
  });
};

export const getMyActiveListings = async (uid: string) => {
  // Haemme vain omat aktiiviset ilmoitukset
  const q = query(
    collection(db, "listings"),
    where("sellerUid", "==", uid),
    where("status", "==", "active"),
  );

  const snapshot = await getDocs(q);
  const listings = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as MarketListing,
  );

  // Lajitellaan lokaalisti, jottei Firebasessa tarvita uutta composite indexiä
  return listings.sort((a, b) => b.createdAt - a.createdAt);
};
