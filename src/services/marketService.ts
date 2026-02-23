import {
  collection,
  doc,
  runTransaction,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useGameStore } from '../store/useGameStore';
import type { MarketListing } from '../types';

// TÄMÄ ON EXPORT JOTA TYPESCRIPT ETSII
export const getActiveListings = async (limitCount = 50) => {
  const q = query(
    collection(db, 'listings'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
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
  const userRef = doc(db, 'users', sellerUid);

  return await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error('User profile not found');

    const inv = userSnap.data().inventory || {};
    const currentAmount = inv[itemId] || 0;
    if (currentAmount < amount) throw new Error('Not enough items in storage');

    const newAmount = currentAmount - amount;

    // 1. Päivitä Firebase
    transaction.update(userRef, {
      [`inventory.${itemId}`]: newAmount,
    });

    const listingRef = doc(collection(db, 'listings'));
    transaction.set(listingRef, {
      sellerUid,
      sellerName,
      itemId,
      amount,
      pricePerItem,
      totalPrice: amount * pricePerItem,
      status: 'active',
      createdAt: Date.now(),
    });

    // 2. Päivitä paikallinen Store HETI (Estää duplikaation)
    const store = useGameStore.getState();
    const updatedInventory = { ...store.inventory, [itemId]: newAmount };
    store.setState({ inventory: updatedInventory });
  });
};

export const purchaseListing = async (buyerUid: string, listingId: string) => {
  const listingRef = doc(db, 'listings', listingId);
  const buyerRef = doc(db, 'users', buyerUid);

  return await runTransaction(db, async (transaction) => {
    const listSnap = await transaction.get(listingRef);
    const buyerSnap = await transaction.get(buyerRef);

    if (!listSnap.exists() || listSnap.data().status !== 'active')
      throw new Error('Listing sold or removed');
    if (!buyerSnap.exists()) throw new Error('Buyer profile not found');

    const listing = listSnap.data() as MarketListing;
    const buyerData = buyerSnap.data();

    if (buyerData.coins < listing.totalPrice)
      throw new Error('Not enough fragments');

    const newCoins = buyerData.coins - listing.totalPrice;
    const newInventoryAmount =
      (buyerData.inventory?.[listing.itemId] || 0) + listing.amount;

    transaction.update(buyerRef, {
      coins: newCoins,
      [`inventory.${listing.itemId}`]: newInventoryAmount,
    });

    const sellerRef = doc(db, 'users', listing.sellerUid);
    const sellerSnap = await transaction.get(sellerRef);
    if (sellerSnap.exists()) {
      transaction.update(sellerRef, {
        coins: (sellerSnap.data().coins || 0) + listing.totalPrice,
      });
    }

    transaction.update(listingRef, { status: 'sold' });

    // Päivitä Store
    const store = useGameStore.getState();
    store.setState({
      coins: newCoins,
      inventory: { ...store.inventory, [listing.itemId]: newInventoryAmount },
    });
  });
};

export const cancelListing = async (listingId: string, sellerUid: string) => {
  const listingRef = doc(db, 'listings', listingId);
  const sellerRef = doc(db, 'users', sellerUid);

  return await runTransaction(db, async (transaction) => {
    const listSnap = await transaction.get(listingRef);
    const sellerSnap = await transaction.get(sellerRef);

    if (!listSnap.exists()) throw new Error('Listing not found');
    const listing = listSnap.data() as MarketListing;

    if (listing.sellerUid !== sellerUid) throw new Error('Unauthorized');
    if (listing.status !== 'active')
      throw new Error('Listing no longer active');

    const currentInventory = sellerSnap.data()?.inventory || {};
    const newAmount = (currentInventory[listing.itemId] || 0) + listing.amount;

    transaction.update(sellerRef, {
      [`inventory.${listing.itemId}`]: newAmount,
    });
    transaction.update(listingRef, { status: 'cancelled' });

    // Päivitä Store (Palauta tavarat)
    const store = useGameStore.getState();
    store.setState({
      inventory: { ...store.inventory, [listing.itemId]: newAmount },
    });
  });
};
