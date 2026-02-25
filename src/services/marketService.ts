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
import { db } from "../firebase";
import { useGameStore } from "../store/useGameStore";
import type { MarketListing } from "../types";

export const getActiveListings = async (limitCount = 50) => {
  const q = query(
    collection(db, "listings"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as MarketListing)
  );
};

export const createListing = async (
  sellerUid: string,
  sellerName: string,
  itemId: string,
  amount: number,
  pricePerItem: number
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

export const purchaseListing = async (buyerUid: string, listingId: string) => {
  const listingRef = doc(db, "listings", listingId);
  const buyerRef = doc(db, "users", buyerUid);

  return await runTransaction(db, async (transaction) => {
    // 1. KAIKKI READIT ALUKSI
    const listSnap = await transaction.get(listingRef);
    const buyerSnap = await transaction.get(buyerRef);

    if (!listSnap.exists() || listSnap.data().status !== "active")
      throw new Error("Listing gone");
    const listing = listSnap.data() as MarketListing;

    const sellerRef = doc(db, "users", listing.sellerUid);
    const sellerSnap = await transaction.get(sellerRef);

    if (!buyerSnap.exists()) throw new Error("Buyer not found");
    const buyerData = buyerSnap.data();

    if (buyerData.coins < listing.totalPrice)
      throw new Error("Not enough coins");

    // 2. KAIKKI WRITET LOPUKSI
    const newBuyerCoins = buyerData.coins - listing.totalPrice;
    const newInvAmount =
      (buyerData.inventory?.[listing.itemId] || 0) + listing.amount;

    transaction.update(buyerRef, {
      coins: newBuyerCoins,
      [`inventory.${listing.itemId}`]: newInvAmount,
    });

    if (sellerSnap.exists()) {
      // --- UUSI MAILBOX LOGIIKKA ---
      // Sen sijaan, että päivitettäisiin myyjän kolikoita (mikä aiheuttaa sync-ongelman),
      // luodaan uusi viesti myyjän postilaatikkoon.
      const mailboxRef = doc(
        collection(db, "users", listing.sellerUid, "mailbox")
      );

      transaction.set(mailboxRef, {
        type: "market_sale",
        title: "Marketplace Sale",
        message: `Your listing for ${listing.amount}x item sold!`,
        coinsAttached: listing.totalPrice,
        timestamp: Date.now(),
        isClaimed: false,
      });
    }

    transaction.update(listingRef, { status: "sold" });

    // Päivitä store (Vain ostajalle, koska tämä ajetaan ostajan clientissä)
    const store = useGameStore.getState();
    store.setState({
      coins: newBuyerCoins,
      inventory: { ...store.inventory, [listing.itemId]: newInvAmount },
    });
  });
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
    // Huomio: Jos myyjä peruuttaa listauksen toisella laitteella, tämäkin voisi
    // teoriassa aiheuttaa sync-ongelman itemien palautuksessa.
    // Nyt palautamme itemit suoraan inventoryyn. Jos tämä tuottaa ongelmia,
    // voit myöhemmin muuttaa myös tämän lähettämään itemit postilaatikkoon!

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
