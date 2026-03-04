import { useState, useEffect, useCallback, useRef } from "react";
import { useGameStore, type FullStoreState } from "../store/useGameStore"; // Tuodaan FullStoreState täältä
import { saveGameData } from "../services/gameService";
import { updateLeaderboardEntry } from "../services/leaderboardService";
import type { User } from "firebase/auth";
// Poistettu GameState, koska sitä ei käytetä ja FullStoreState riittää

export const useGameSync = (user: User | null, isDataLoaded: boolean) => {
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const state = useGameStore();
  const setState = useGameStore((s) => s.setState);

  const stateRef = useRef(state);

  const lastSyncedMapRef = useRef<number>(0);

  useEffect(() => {
    stateRef.current = state;

    if (isDataLoaded && lastSyncedMapRef.current === 0) {
      lastSyncedMapRef.current = state.combatStats?.maxMapCompleted || 0;
    }
  }, [state, isDataLoaded]);

  const handleForceSave = useCallback(async () => {
    if (!user || !isDataLoaded) return;

    setSaveStatus("saving");
    const now = Date.now();

    // Käytetään FullStoreState-tyyppiä tässä
    setState((prev: FullStoreState) => ({ ...prev, lastTimestamp: now }));

    const currentState = {
      ...JSON.parse(JSON.stringify(stateRef.current)),
      lastTimestamp: now,
    };

    const success = await saveGameData(user.uid, currentState);

    const currentMaxMap = currentState.combatStats?.maxMapCompleted || 0;

    if (success && currentMaxMap > lastSyncedMapRef.current) {
      const lbUpdated = await updateLeaderboardEntry(
        user.uid,
        currentState.username,
        currentState.avatar,
        currentMaxMap,
      );

      if (lbUpdated) {
        lastSyncedMapRef.current = currentMaxMap;
      }
    }

    setSaveStatus(success ? "saved" : "error");
    if (success) {
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }, [user, isDataLoaded, setState]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;

    const handleExit = () => {
      handleForceSave();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handleForceSave();
      }
    };

    window.addEventListener("beforeunload", handleExit);
    window.addEventListener("pagehide", handleExit);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", handleExit);
      window.removeEventListener("pagehide", handleExit);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user, isDataLoaded, handleForceSave]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;

    const autoSaveInterval = setInterval(() => {
      handleForceSave();
    }, 120000);

    const timestampInterval = setInterval(() => {
      setState((prev: FullStoreState) => ({
        ...prev,
        lastTimestamp: Date.now(),
      }));
    }, 10000);

    return () => {
      clearInterval(autoSaveInterval);
      clearInterval(timestampInterval);
    };
  }, [user, isDataLoaded, handleForceSave, setState]);

  return { saveStatus, handleForceSave };
};
