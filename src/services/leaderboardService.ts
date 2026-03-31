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
 * Hakee TOP 50 pelaajaa KORKEIMMAN KOKONAISTASON (Total Level) mukaan.
 */
export const getTopPlayersByLevel = async (): Promise<LeaderboardEntry[]> => {
  try {
    const lbRef = collection(db, "leaderboard");
    // Vaihdettu orderBy maxMapCompleted -> totalLevel
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
 * Hakee nykyisen pelaajan sijoitustiedot Total Levelin perusteella.
 */
export const getMyRankData = async (
  uid: string,
): Promise<LeaderboardEntry | null> => {
  try {
    const myDocRef = doc(db, "leaderboard", uid);
    const myDoc = await getDoc(myDocRef);

    if (!myDoc.exists()) return null;
    const myData = myDoc.data();

    // Lasketaan sijoitus: kuinka monella pelaajalla on korkeampi totalLevel
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
      rank: higherRankedCount + 1,
    };
  } catch (error) {
    console.error("Failed to fetch personal rank:", error);
    return null;
  }
};

/**
 * PÄIVITETTY: Tallentaa nyt myös totalLevel-tiedon Firebaseen.
 */
export const updateLeaderboardEntry = async (
  uid: string,
  username: string,
  avatar: string,
  maxMapCompleted: number,
  totalLevel: number, // LISÄTTY
) => {
  try {
    const lbRef = doc(db, "leaderboard", uid);
    await setDoc(
      lbRef,
      {
        username,
        avatar,
        maxMapCompleted,
        totalLevel, // LISÄTTY
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
