import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  getCountFromServer,
  where,
} from "firebase/firestore";
import type { LeaderboardEntry } from "../types";

const db = getFirestore();

/**
 * getTopPlayersByLevel
 * Fetches the top 50 players globally, ranked strictly by their Total Level.
 *
 * @returns Promise resolving to an array of LeaderboardEntry objects
 */
export const getTopPlayersByLevel = async (): Promise<LeaderboardEntry[]> => {
  try {
    const lbRef = collection(db, "leaderboard");
    const q = query(lbRef, orderBy("totalLevel", "desc"), limit(50));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap, index) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        username: data.username || "Unknown Restorer",
        avatar: data.avatar || "./assets/ui/icon_user_avatar.png",
        maxMapCompleted: data.maxMapCompleted || 0,
        totalLevel: data.totalLevel || 0,
        rank: index + 1,
      };
    });
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
  }
};

/**
 * getMyRankData
 * Retrieves the current player's global ranking by counting how many
 * players in the database have a strictly higher totalLevel.
 *
 * @param uid - The Firebase UID of the requesting player
 * @returns Promise resolving to the player's specific LeaderboardEntry, or null
 */
export const getMyRankData = async (
  uid: string,
): Promise<LeaderboardEntry | null> => {
  try {
    const myDocRef = doc(db, "leaderboard", uid);
    const myDoc = await getDoc(myDocRef);

    if (!myDoc.exists()) return null;
    const myData = myDoc.data();

    // Calculate rank: Count how many documents have a higher totalLevel
    const lbRef = collection(db, "leaderboard");
    const qCount = query(
      lbRef,
      where("totalLevel", ">", myData.totalLevel || 0),
    );

    const snapshot = await getCountFromServer(qCount);
    const higherRankedCount = snapshot.data().count;

    return {
      uid: myDoc.id,
      username: myData.username || "You",
      avatar: myData.avatar || "./assets/ui/icon_user_avatar.png",
      maxMapCompleted: myData.maxMapCompleted || 0,
      totalLevel: myData.totalLevel || 0,
      rank: higherRankedCount + 1, // Rank is # of players above you + 1
    };
  } catch (error) {
    console.error("Failed to fetch personal rank:", error);
    return null;
  }
};

/**
 * updateLeaderboardEntry
 * Upserts the player's stats into the dedicated leaderboard collection.
 * This is separated from the main user document to optimize query performance.
 *
 * @param uid - The Firebase UID of the player
 * @param username - Player's display name
 * @param avatar - Player's portrait URL
 * @param maxMapCompleted - Highest zone cleared
 * @param totalLevel - Sum of all skill levels
 */
export const updateLeaderboardEntry = async (
  uid: string,
  username: string,
  avatar: string,
  maxMapCompleted: number,
  totalLevel: number,
) => {
  try {
    const lbRef = doc(db, "leaderboard", uid);
    await setDoc(
      lbRef,
      {
        username,
        avatar,
        maxMapCompleted,
        totalLevel,
        lastUpdated: Date.now(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error("Leaderboard update failed:", error);
    return false;
  }
};
