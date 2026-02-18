import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  Friend,
  ChatMessage,
  FriendRequest,
  GlobalChatMessage,
} from '../types';
import { limit, orderBy } from 'firebase/firestore';
// --- KAVEREIDEN HALLINTA ---

/**
 * 1. LÄHETÄ PYYNTÖ
 * Luo dokumentin 'friend_requests' kokoelmaan.
 */
export const sendFriendRequest = async (
  myUid: string,
  myUsername: string,
  targetUid: string,
) => {
  if (myUid === targetUid) throw new Error('Et voi lisätä itseäsi.');

  // Tarkista onko käyttäjä olemassa
  const targetRef = doc(db, 'users', targetUid);
  const targetSnap = await getDoc(targetRef);

  if (!targetSnap.exists()) {
    throw new Error('Käyttäjää ei löytynyt.');
  }

  // Luo pyyntö
  await addDoc(collection(db, 'friend_requests'), {
    fromUid: myUid,
    fromUsername: myUsername || 'Unknown Hero',
    toUid: targetUid,
    status: 'pending',
    timestamp: serverTimestamp(),
  });
};

/**
 * 2. HYVÄKSY PYYNTÖ
 * Lisää lähettäjän kaveriksi JA päivittää pyynnön statuksen 'accepted'.
 */
export const acceptFriendRequest = async (
  myUid: string,
  request: FriendRequest,
) => {
  try {
    // A. Lisää kaveri minun (vastaanottajan) listaan
    const newFriend: Friend = {
      uid: request.fromUid,
      username: request.fromUsername,
      addedAt: Date.now(),
    };

    const myRef = doc(db, 'users', myUid);
    await updateDoc(myRef, {
      'social.friends': arrayUnion(newFriend),
    });

    // B. Päivitä pyyntö hyväksytyksi, jotta lähettäjä tietää
    const reqRef = doc(db, 'friend_requests', request.id);
    await updateDoc(reqRef, { status: 'accepted' });
  } catch (error) {
    console.error('Error accepting request:', error);
    throw error;
  }
};

/**
 * 3. HYLKÄÄ PYYNTÖ
 * Poistaa pyynnön kokonaan.
 */
export const rejectFriendRequest = async (requestId: string) => {
  await deleteDoc(doc(db, 'friend_requests', requestId));
};

/**
 * 4. PÄIVITÄ LÄHETTÄJÄN LISTA (Handshake part 2)
 * Kun lähettäjä huomaa pyynnön muuttuneen 'accepted', hän lisää kaverin ja poistaa pyynnön.
 */
export const finalizeFriendship = async (
  myUid: string,
  request: FriendRequest,
) => {
  try {
    // Hae kaverin nimi (koska pyynnössä on vain minun nimeni lähettäjänä)
    const targetRef = doc(db, 'users', request.toUid);
    const targetSnap = await getDoc(targetRef);
    const targetName = targetSnap.exists()
      ? targetSnap.data().username
      : 'Unknown';

    const newFriend: Friend = {
      uid: request.toUid,
      username: targetName,
      addedAt: Date.now(),
    };

    // Lisää kaveri minun (lähettäjän) listaan
    const myRef = doc(db, 'users', myUid);
    await updateDoc(myRef, {
      'social.friends': arrayUnion(newFriend),
    });

    // Poista pyyntö, koska se on nyt käsitelty molemmin puolin
    await deleteDoc(doc(db, 'friend_requests', request.id));
  } catch (error) {
    console.error('Error finalizing friendship:', error);
  }
};

// --- KUUNTELIJAT (LISTENERS) ---

/**
 * Kuuntelee saapuvia ja lähteviä pyyntöjä.
 */
export const subscribeToFriendRequests = (
  myUid: string,
  onIncoming: (reqs: FriendRequest[]) => void,
  onOutgoing: (reqs: FriendRequest[]) => void,
) => {
  // 1. Saapuvat (Minulle)
  const incomingQ = query(
    collection(db, 'friend_requests'),
    where('toUid', '==', myUid),
    where('status', '==', 'pending'),
  );

  const unsubIncoming = onSnapshot(incomingQ, (snap) => {
    const reqs = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as FriendRequest,
    );
    onIncoming(reqs);
  });

  // 2. Lähtevät (Minulta) - Tässä kuuntelemme myös 'accepted' tilaa
  const outgoingQ = query(
    collection(db, 'friend_requests'),
    where('fromUid', '==', myUid),
  );

  const unsubOutgoing = onSnapshot(outgoingQ, (snap) => {
    const reqs = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as FriendRequest,
    );

    // TARKISTUS: Onko joku pyyntö hyväksytty?
    reqs.forEach((req) => {
      if (req.status === 'accepted') {
        finalizeFriendship(myUid, req); // Viimeistele kaveruus
      }
    });

    // Filtteröidään näkymään vain pending, ettei UI vilku
    onOutgoing(reqs.filter((r) => r.status === 'pending'));
  });

  return () => {
    unsubIncoming();
    unsubOutgoing();
  };
};

// ... sendMessage ja subscribeToChat pysyvät samoina ...
const getChatId = (uid1: string, uid2: string) => [uid1, uid2].sort().join('_');

export const sendMessage = async (
  senderUid: string,
  receiverUid: string,
  text: string,
) => {
  if (!text.trim()) return;
  const chatId = getChatId(senderUid, receiverUid);
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    senderId: senderUid,
    text: text,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToChat = (
  uid1: string,
  uid2: string,
  callback: (msgs: ChatMessage[]) => void,
) => {
  const chatId = getChatId(uid1, uid2);
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc')); // Varmista että 'orderBy' on importattu

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis() || Date.now(),
    })) as ChatMessage[];
    callback(messages);
  });
};

// --- GLOBAL CHAT ---

export const sendGlobalMessage = async (
  uid: string,
  username: string,
  text: string,
) => {
  if (!text.trim()) return;

  await addDoc(collection(db, 'global_chat'), {
    senderUid: uid,
    senderUsername: username,
    text: text.trim(),
    timestamp: serverTimestamp(),
  });
};

export const subscribeToGlobalChat = (
  callback: (msgs: GlobalChatMessage[]) => void,
) => {
  const q = query(
    collection(db, 'global_chat'),
    orderBy('timestamp', 'desc'), // Uusimmat ensin (käännetään UI:ssa)
    limit(50),
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis() || Date.now(),
    })) as GlobalChatMessage[];

    // Palautetaan viestit käänteisessä järjestyksessä (vanhin ylhäällä, uusin alhaalla)
    callback(messages.reverse());
  });
};
