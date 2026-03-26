// src/hooks/useGameInitialization.ts
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useGameStore, DEFAULT_STATE } from "../store/useGameStore";
import { calculateOfflineProgress } from "../systems/offlineSystem";
import type { GameState } from "../types";
import type { User } from "firebase/auth";

export const useGameInitialization = (user: User | null) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // KORJAUS 1: Tuodaan myös syncQuestsWithServer storesta!
  const { setState, syncWorldShopWithServer, syncQuestsWithServer } =
    useGameStore();

  useEffect(() => {
    const initializeGame = async () => {
      console.log(
        "[INIT] Alustus käynnistyy. User:",
        user?.uid || "Ei käyttäjää",
      );
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const globalDocRef = doc(db, "global", "status");

        console.log("[INIT] Haetaan dokumentteja Firebasesta...");
        const [userSnap, globalSnap] = await Promise.all([
          getDoc(userDocRef),
          getDoc(globalDocRef),
        ]);

        const serverResetTime = globalSnap.exists()
          ? globalSnap.data().lastWorldShopReset
          : 0;

        console.log("[INIT] Palvelimen reset-aika haettu:", serverResetTime);

        if (userSnap.exists()) {
          console.log("[INIT] Pelaajan tallennus löytyi.");
          const rawSavedData = userSnap.data() as GameState;

          const savedData = {
            ...rawSavedData,
            settings: {
              ...DEFAULT_STATE.settings,
              ...(rawSavedData.settings || {}),
            },
          };

          // 1. Asetetaan tila storeen
          setState(savedData);
          console.log("[INIT] Tila asetettu storeen.");

          // 2. Kutsutaan reset-tarkistuksia
          console.log("[INIT] Synkronoidaan World Shop ja Daily Quests...");
          syncWorldShopWithServer(serverResetTime);

          // KORJAUS 2: Kutsutaan questien reset-tarkistusta!
          syncQuestsWithServer(serverResetTime);

          // 3. Offline progress
          const lastSave = savedData.lastTimestamp || Date.now();
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - lastSave) / 1000);

          if (elapsedSeconds > 60) {
            console.log(
              "[INIT] Lasketaan offline-progress:",
              elapsedSeconds,
              "sekuntia.",
            );
            const { updatedState, summary } = calculateOfflineProgress(
              useGameStore.getState(),
              elapsedSeconds,
            );
            setState(updatedState);
            useGameStore.getState().setOfflineSummary(summary);
          }
        } else {
          console.log("[INIT] Pelaajalla ei tallennusta. Luodaan uusi.");
          await setDoc(userDocRef, DEFAULT_STATE);
          setState(DEFAULT_STATE);
        }
      } catch (error) {
        console.error("[INIT] VIRHE alustuksessa:", error);
      } finally {
        console.log("[INIT] Alustus valmis.");
        setIsDataLoaded(true);
      }
    };

    initializeGame();
  }, [user, setState, syncWorldShopWithServer, syncQuestsWithServer]); // KORJAUS 3: Lisätty riippuvuuksiin

  return { isDataLoaded };
};
