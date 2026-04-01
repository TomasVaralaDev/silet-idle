import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { saveGameData } from "../services/gameService";
import { updateLeaderboardEntry } from "../services/leaderboardService";
import { calculateTotalLevel } from "../utils/gameUtils";
import type { User } from "firebase/auth";
import type { GameState } from "../types";

/**
 * useGameSync Hook
 * Manages all Cloud Save operations. Includes manual force saves,
 * 2-minute auto-saves, and triggers saves on page exit/visibility loss.
 * Also cleans up transient data (like active chat messages) before uploading.
 */
export const useGameSync = (user: User | null, isDataLoaded: boolean) => {
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const setState = useGameStore((s) => s.setState);

  const handleForceSave = useCallback(async () => {
    if (!user || !isDataLoaded) return;

    const currentStateSnapshot = useGameStore.getState();
    setSaveStatus("saving");
    const now = Date.now();

    const currentTotalLevel = calculateTotalLevel(currentStateSnapshot.skills);

    // Update the last saved timestamp in the local store
    setState((prev: GameState) => ({ ...prev, lastTimestamp: now }));

    // 1. STRIP FUNCTIONS FROM PAYLOAD
    // Zustand store contains action functions, we must remove them before JSON serialization
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      setState: _ss,
      emitEvent: _ee,
      clearEvent: _ce,
      updateQuestProgress: _uqp,
      updateUserProfile: _uup,
      ...dataToSave
    } = currentStateSnapshot;

    // 2. SANITIZE TRANSIENT DATA
    // We do not save live chat feeds to the user's permanent save file
    const sanitizedSocial = {
      ...dataToSave.social,
      globalMessages: [],
    };

    // 3. CONSTRUCT FINAL PAYLOAD
    const finalPayload = {
      ...dataToSave,
      social: sanitizedSocial,
      lastTimestamp: now,
    };

    try {
      // Execute Cloud Save and Leaderboard update concurrently
      await Promise.all([
        saveGameData(user.uid, finalPayload),
        updateLeaderboardEntry(
          user.uid,
          currentStateSnapshot.username,
          currentStateSnapshot.avatar || "./assets/ui/icon_user_avatar.png",
          currentStateSnapshot.combatStats.maxMapCompleted,
          currentTotalLevel,
        ),
      ]);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Sync failure:", error);
      setSaveStatus("error");
    }
  }, [user, isDataLoaded, setState]);

  // Window Lifecycle Event Listeners (Emergency Saves)
  useEffect(() => {
    if (!user || !isDataLoaded) return;

    const handleExit = () => handleForceSave();
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") handleForceSave();
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

  // Automated Background Intervals
  useEffect(() => {
    if (!user || !isDataLoaded) return;

    // Full Cloud Save every 2 minutes
    const autoSaveInterval = setInterval(() => {
      handleForceSave();
    }, 120000);

    // Update local timestamp every 10s to ensure accurate offline calculations
    const timestampInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        setState((prev: GameState) => ({ ...prev, lastTimestamp: Date.now() }));
      }
    }, 10000);

    return () => {
      clearInterval(autoSaveInterval);
      clearInterval(timestampInterval);
    };
  }, [user, isDataLoaded, handleForceSave, setState]);

  return { saveStatus, handleForceSave };
};
