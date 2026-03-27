import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  query as firestoreQuery,
  where,
  onSnapshot,
  serverTimestamp as firestoreTimestamp,
  deleteDoc,
} from "firebase/firestore";

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

import { db, rtdb } from "../firebase";
import type {
  Friend,
  ChatMessage,
  FriendRequest,
  GlobalChatMessage,
} from "../types";

// ==========================================
// --- KAVEREIDEN HALLINTA (FIRESTORE) ---
// ==========================================

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

    // Päivitetään oma kaverilista Firebasessa
    await updateDoc(myRef, { "social.friends": arrayUnion(newFriend) });

    // Merkataan pyyntö hyväksytyksi, jotta vastapuoli voi viimeistellä sen
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

    // Lisätään kaveri omaan dokumenttiin
    await updateDoc(myRef, { "social.friends": arrayUnion(newFriend) });

    // Poistetaan pyyntö, kun se on käsitelty molemmin puolin
    await deleteDoc(doc(db, "friend_requests", request.id));

    return newFriend;
  } catch (error) {
    console.error("Error finalizing friendship:", error);
    return null;
  }
};
export const removeFriend = async (myUid: string, targetUid: string) => {
  try {
    const myRef = doc(db, "users", myUid);
    const mySnap = await getDoc(myRef);

    if (!mySnap.exists()) return;

    // Haetaan nykyinen lista, jotta saamme tarkan objektin poistoa varten
    const myFriends: Friend[] = mySnap.data().social?.friends || [];
    const friendToRemove = myFriends.find((f) => f.uid === targetUid);

    // Poistetaan kohde omalta listalta arrayRemove-komennolla
    if (friendToRemove) {
      await updateDoc(myRef, {
        "social.friends": arrayRemove(friendToRemove),
      });
    }
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

/**
 * Kuuntelee kaveripyyntöjä.
 * onFriendAdded on kriittinen: se päivittää storen heti kun vastapuoli hyväksyy pyynnön.
 */
export const subscribeToFriendRequests = (
  myUid: string,
  onIncoming: (reqs: FriendRequest[]) => void,
  onOutgoing: (reqs: FriendRequest[]) => void,
  onFriendAdded: (friend: Friend) => void, // UUSI CALLBACK
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

  const unsubOutgoing = onSnapshot(outgoingQ, async (snap) => {
    const reqs = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as FriendRequest,
    );

    for (const req of reqs) {
      if (req.status === "accepted") {
        // Viimeistellään kaveruus Firebasessa ja poistetaan pyyntö
        const newFriend = await finalizeFriendship(myUid, req);

        // Päivitetään paikallinen store VÄLITTÖMÄSTI, jotta automaattitallennus ei poista kaveria
        if (newFriend) {
          onFriendAdded(newFriend);
        }
      }
    }

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
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

  await push(messagesRef, {
    senderId: senderUid,
    text: text.trim(),
    timestamp: rtdbTimestamp(),
  });
};

export const subscribeToChat = (
  uid1: string,
  uid2: string,
  callback: (msgs: ChatMessage[]) => void,
) => {
  const chatId = getChatId(uid1, uid2);
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const q = rtdbQuery(messagesRef, orderByChild("timestamp"), limitToLast(100));

  onValue(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val(),
      });
    });
    callback(messages);
  });

  return () => off(messagesRef);
};

// ==========================================
// --- TAVERN / GLOBAL CHAT (REALTIME DATABASE) ---
// ==========================================

export const sendGlobalMessage = async (
  uid: string,
  username: string,
  text: string,
  chatColor: string, // UUSI PARAMETRI
  channel: "global" | "beginner" = "global",
) => {
  if (!text.trim()) return;

  const path = channel === "beginner" ? "beginner_chat" : "global_chat";
  const chatRef = ref(rtdb, path);

  await push(chatRef, {
    senderUid: uid,
    senderUsername: username,
    senderColor: chatColor, // Tallennetaan väri-ID viestiin
    text: text.trim(),
    timestamp: rtdbTimestamp(),
  });
};

export const subscribeToGlobalChat = (
  channel: "global" | "beginner",
  callback: (msgs: GlobalChatMessage[]) => void,
) => {
  const path = channel === "beginner" ? "beginner_chat" : "global_chat";
  const chatRef = ref(rtdb, path);
  const q = rtdbQuery(chatRef, orderByChild("timestamp"), limitToLast(50));

  onValue(q, (snapshot) => {
    const messages: GlobalChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val(),
      });
    });
    callback(messages);
  });

  return () => off(chatRef);
};
