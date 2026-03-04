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
 * Hakee TOP 50 pelaajaa korkeimman suoritetun kartan mukaan.
 */
export const getTopPlayersByMap = async (): Promise<LeaderboardEntry[]> => {
  try {
    const lbRef = collection(db, "leaderboard");
    const q = query(lbRef, orderBy("maxMapCompleted", "desc"), limit(50));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap, index) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        username: data.username || "Unknown Restorer",
        avatar: data.avatar || "/assets/ui/icon_user_avatar.png",
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
 * Hakee nykyisen pelaajan sijoitustiedot kaikista rekisteröityneistä pelaajista.
 * SRP: Tämä funktio vastaa vain yksittäisen sijoituksen laskemisesta.
 */
export const getMyRankData = async (
  uid: string,
): Promise<LeaderboardEntry | null> => {
  try {
    const myDocRef = doc(db, "leaderboard", uid);
    const myDoc = await getDoc(myDocRef);

    if (!myDoc.exists()) return null;
    const myData = myDoc.data();

    // Lasketaan sijoitus: kuinka monella pelaajalla on korkeampi maxMapCompleted
    const lbRef = collection(db, "leaderboard");
    const qCount = query(
      lbRef,
      where("maxMapCompleted", ">", myData.maxMapCompleted),
    );

    // getCountFromServer on optimoitu kutsu, joka palauttaa vain numeron (halpa ja nopea)
    const snapshot = await getCountFromServer(qCount);
    const higherRankedCount = snapshot.data().count;

    return {
      uid: myDoc.id,
      username: myData.username || "You",
      avatar: myData.avatar || "/assets/ui/icon_user_avatar.png",
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
 * Päivittää pelaajan tiedot leaderboard-kokoelmaan.
 */
export const updateLeaderboardEntry = async (
  uid: string,
  username: string,
  avatar: string,
  maxMapCompleted: number,
) => {
  try {
    const lbRef = doc(db, "leaderboard", uid);
    await setDoc(
      lbRef,
      {
        username,
        avatar,
        maxMapCompleted,
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
