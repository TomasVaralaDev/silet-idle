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
// --- FRIEND MANAGEMENT (FIRESTORE) ---
// ==========================================

/**
 * sendFriendRequest
 * Creates a pending friend request document in Firestore.
 */
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

/**
 * acceptFriendRequest
 * Updates the user's friend array and flags the request as accepted
 * so the sender's client can finalize the connection.
 */
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

    // Update local Firebase array
    await updateDoc(myRef, { "social.friends": arrayUnion(newFriend) });

    // Mark as accepted for the other party to process
    const reqRef = doc(db, "friend_requests", request.id);
    await updateDoc(reqRef, { status: "accepted" });
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

/**
 * rejectFriendRequest
 * Deletes the pending request document.
 */
export const rejectFriendRequest = async (requestId: string) => {
  await deleteDoc(doc(db, "friend_requests", requestId));
};

/**
 * finalizeFriendship
 * Called by the sender once the receiver accepts the request.
 * Adds the receiver to the sender's list and deletes the request document.
 */
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

    // Append to local friends array
    await updateDoc(myRef, { "social.friends": arrayUnion(newFriend) });

    // Clean up the completed request
    await deleteDoc(doc(db, "friend_requests", request.id));

    return newFriend;
  } catch (error) {
    console.error("Error finalizing friendship:", error);
    return null;
  }
};

/**
 * removeFriend
 * Removes a specific friend from the user's Firestore document.
 */
export const removeFriend = async (myUid: string, targetUid: string) => {
  try {
    const myRef = doc(db, "users", myUid);
    const mySnap = await getDoc(myRef);

    if (!mySnap.exists()) return;

    // Fetch exact object reference for arrayRemove
    const myFriends: Friend[] = mySnap.data().social?.friends || [];
    const friendToRemove = myFriends.find((f) => f.uid === targetUid);

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
 * subscribeToFriendRequests
 * Attaches real-time listeners to incoming and outgoing friend requests.
 * Handles the auto-finalization of accepted outgoing requests.
 */
export const subscribeToFriendRequests = (
  myUid: string,
  onIncoming: (reqs: FriendRequest[]) => void,
  onOutgoing: (reqs: FriendRequest[]) => void,
  onFriendAdded: (friend: Friend) => void,
) => {
  // Listen for requests sent TO the user
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

  // Listen for requests sent BY the user
  const outgoingQ = firestoreQuery(
    collection(db, "friend_requests"),
    where("fromUid", "==", myUid),
  );

  const unsubOutgoing = onSnapshot(outgoingQ, async (snap) => {
    const reqs = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as FriendRequest,
    );

    // Process accepted requests to finalize the link
    for (const req of reqs) {
      if (req.status === "accepted") {
        const newFriend = await finalizeFriendship(myUid, req);

        // Update Zustand store immediately to prevent auto-save overwrites
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
// --- PRIVATE MESSAGES (REALTIME DATABASE) ---
// ==========================================

// Generates a consistent, unique chat ID between two users
const getChatId = (uid1: string, uid2: string) => [uid1, uid2].sort().join("_");

/**
 * sendMessage
 * Pushes a new private message to the Realtime Database.
 */
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

/**
 * subscribeToChat
 * Attaches a listener to a specific private chat node, retrieving the last 100 messages.
 */
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
// --- GLOBAL TAVERN CHAT (REALTIME DATABASE) ---
// ==========================================

/**
 * sendGlobalMessage
 * Broadcasts a message to the specified public channel.
 */
export const sendGlobalMessage = async (
  uid: string,
  username: string,
  text: string,
  chatColor: string,
  channel: "global" | "beginner" = "global",
) => {
  if (!text.trim()) return;

  const path = channel === "beginner" ? "beginner_chat" : "global_chat";
  const chatRef = ref(rtdb, path);

  await push(chatRef, {
    senderUid: uid,
    senderUsername: username,
    senderColor: chatColor,
    text: text.trim(),
    timestamp: rtdbTimestamp(),
  });
};

/**
 * subscribeToGlobalChat
 * Streams the 50 most recent messages from the selected public channel.
 */
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
