import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useGameStore, DEFAULT_STATE } from "../store/useGameStore";
import { calculateOfflineProgress } from "../systems/offlineSystem";
import type { GameState } from "../types";
import type { User } from "firebase/auth";

/**
 * useGameInitialization Hook
 * Handles the initial load sequence when a user logs in.
 * Fetches data from Firestore, synchronizes daily resets (Quests/Shop),
 * and triggers the offline progression calculation if the user was away.
 */
export const useGameInitialization = (user: User | null) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { setState, syncWorldShopWithServer, syncQuestsWithServer } =
    useGameStore();

  useEffect(() => {
    const initializeGame = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const globalDocRef = doc(db, "global", "status");

        // Fetch user data and global server status simultaneously
        const [userSnap, globalSnap] = await Promise.all([
          getDoc(userDocRef),
          getDoc(globalDocRef),
        ]);

        const serverResetTime = globalSnap.exists()
          ? globalSnap.data().lastWorldShopReset
          : 0;

        if (userSnap.exists()) {
          // Existing user: Merge saved data with default settings to prevent crashes from missing fields
          const rawSavedData = userSnap.data() as GameState;

          const savedData = {
            ...rawSavedData,
            settings: {
              ...DEFAULT_STATE.settings,
              ...(rawSavedData.settings || {}),
            },
          };

          // 1. Inject data into global store
          setState(savedData);

          // 2. Execute midnight reset validations based on server timestamp
          syncWorldShopWithServer(serverResetTime);
          syncQuestsWithServer(serverResetTime);

          // 3. Process Offline Progression if away for > 1 minute
          const lastSave = savedData.lastTimestamp || Date.now();
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - lastSave) / 1000);

          if (elapsedSeconds > 60) {
            const { updatedState, summary } = calculateOfflineProgress(
              useGameStore.getState(),
              elapsedSeconds,
            );
            setState(updatedState);
            useGameStore.getState().setOfflineSummary(summary);
          }
        } else {
          // New user: Create fresh document with default state
          await setDoc(userDocRef, DEFAULT_STATE);
          setState(DEFAULT_STATE);
        }
      } catch (error) {
        console.error("[INIT] ERR:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeGame();
  }, [user, setState, syncWorldShopWithServer, syncQuestsWithServer]);

  return { isDataLoaded };
};
