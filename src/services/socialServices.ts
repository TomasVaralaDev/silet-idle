import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  query as firestoreQuery, // Nimetään uusiksi konfliktien välttämiseksi
  where,
  onSnapshot,
  serverTimestamp as firestoreTimestamp,
  deleteDoc,
} from "firebase/firestore";
// UUDET RTDB IMPORTIT:
import {
  ref,
  push,
  onValue,
  query as rtdbQuery,
  orderByChild,
  limitToLast,
  serverTimestamp as rtdbTimestamp,
  off,
} from "firebase/database";

import { db, rtdb } from "../firebase"; // TUODAAN RTDB
import type {
  Friend,
  ChatMessage,
  FriendRequest,
  GlobalChatMessage,
} from "../types";

// ==========================================
// --- KAVEREIDEN HALLINTA (FIRESTORE) ---
// ==========================================
// TÄMÄ OSA PYSYY TÄYSIN SAMANA!

export const sendFriendRequest = async (
  myUid: string,
  myUsername: string,
  targetUid: string,
) => {
  if (myUid === targetUid) throw new Error(`You can't add yourself.`);
  const targetRef = doc(db, "users", targetUid);
  const targetSnap = await getDoc(targetRef);
  if (!targetSnap.exists()) throw new Error("Operative not found.");

  await addDoc(collection(db, "friend_requests"), {
    fromUid: myUid,
    fromUsername: myUsername || "Unknown Hero",
    toUid: targetUid,
    status: "pending",
    timestamp: firestoreTimestamp(),
  });
};

export const acceptFriendRequest = async (
  myUid: string,
  request: FriendRequest,
) => {
  try {
    const newFriend: Friend = {
      uid: request.fromUid,
      username: request.fromUsername,
      addedAt: Date.now(),
    };
    const myRef = doc(db, "users", myUid);
    await updateDoc(myRef, { "social.friends": arrayUnion(newFriend) });
    const reqRef = doc(db, "friend_requests", request.id);
    await updateDoc(reqRef, { status: "accepted" });
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

export const rejectFriendRequest = async (requestId: string) => {
  await deleteDoc(doc(db, "friend_requests", requestId));
};

export const finalizeFriendship = async (
  myUid: string,
  request: FriendRequest,
) => {
  try {
    const targetRef = doc(db, "users", request.toUid);
    const targetSnap = await getDoc(targetRef);
    const targetName = targetSnap.exists()
      ? targetSnap.data().username
      : "Unknown";
    const newFriend: Friend = {
      uid: request.toUid,
      username: targetName,
      addedAt: Date.now(),
    };

    const myRef = doc(db, "users", myUid);
    await updateDoc(myRef, { "social.friends": arrayUnion(newFriend) });
    await deleteDoc(doc(db, "friend_requests", request.id));
  } catch (error) {
    console.error("Error finalizing friendship:", error);
  }
};

export const subscribeToFriendRequests = (
  myUid: string,
  onIncoming: (reqs: FriendRequest[]) => void,
  onOutgoing: (reqs: FriendRequest[]) => void,
) => {
  const incomingQ = firestoreQuery(
    collection(db, "friend_requests"),
    where("toUid", "==", myUid),
    where("status", "==", "pending"),
  );
  const unsubIncoming = onSnapshot(incomingQ, (snap) => {
    onIncoming(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FriendRequest),
    );
  });

  const outgoingQ = firestoreQuery(
    collection(db, "friend_requests"),
    where("fromUid", "==", myUid),
  );
  const unsubOutgoing = onSnapshot(outgoingQ, (snap) => {
    const reqs = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as FriendRequest,
    );
    reqs.forEach((req) => {
      if (req.status === "accepted") finalizeFriendship(myUid, req);
    });
    onOutgoing(reqs.filter((r) => r.status === "pending"));
  });

  return () => {
    unsubIncoming();
    unsubOutgoing();
  };
};

// ==========================================
// --- YKSITYISVIESTIT (REALTIME DATABASE) ---
// ==========================================

const getChatId = (uid1: string, uid2: string) => [uid1, uid2].sort().join("_");

export const sendMessage = async (
  senderUid: string,
  receiverUid: string,
  text: string,
) => {
  if (!text.trim()) return;
  const chatId = getChatId(senderUid, receiverUid);

  // RTDB: Luodaan viite oikeaan polkuun
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

  // RTDB: push() luo uuden uniikin ID:n ja tallentaa datan
  await push(messagesRef, {
    senderId: senderUid,
    text: text.trim(),
    timestamp: rtdbTimestamp(), // RTDB:n oma aikaleima
  });
};

export const subscribeToChat = (
  uid1: string,
  uid2: string,
  callback: (msgs: ChatMessage[]) => void,
) => {
  const chatId = getChatId(uid1, uid2);
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

  // Rajoitetaan hakemaan esim. viimeiset 100 viestiä
  const q = rtdbQuery(messagesRef, orderByChild("timestamp"), limitToLast(100));

  // RTDB: onValue kuuntelee muutoksia livenä
  onValue(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      messages.push({
        id: childSnapshot.key as string,
        ...data,
      });
    });
    callback(messages);
  });

  // Palautetaan unsubscriber-funktio, joka irrottaa kuuntelijan
  return () => off(messagesRef);
};

// ==========================================
// --- TAVERN / GLOBAL CHAT (REALTIME DATABASE) ---
// ==========================================

export const sendGlobalMessage = async (
  uid: string,
  username: string,
  text: string,
) => {
  if (!text.trim()) return;

  const globalRef = ref(rtdb, "global_chat");
  await push(globalRef, {
    senderUid: uid,
    senderUsername: username,
    text: text.trim(),
    timestamp: rtdbTimestamp(),
  });
};

export const subscribeToGlobalChat = (
  callback: (msgs: GlobalChatMessage[]) => void,
) => {
  const globalRef = ref(rtdb, "global_chat");

  // Haetaan viimeiset 50 viestiä ajan mukaan järjestettynä
  const q = rtdbQuery(globalRef, orderByChild("timestamp"), limitToLast(50));

  onValue(q, (snapshot) => {
    const messages: GlobalChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      messages.push({
        id: childSnapshot.key as string,
        ...data,
      });
    });

    // RTDB palauttaa vanhimmasta uusimpaan (normaali luku).
    // Komponenttisi odottaa niitä samassa järjestyksessä, jotta scrollaus menee alas.
    callback(messages);
  });

  return () => off(globalRef);
};
