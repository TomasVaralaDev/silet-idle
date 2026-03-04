import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { saveGameData } from "../services/gameService";
import { updateLeaderboardEntry } from "../services/leaderboardService"; // LISÄTTY
import type { User } from "firebase/auth";
import type { GameState } from "../types";

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

    // Päivitetään aikaleima storeen
    setState((prev: GameState) => ({ ...prev, lastTimestamp: now }));

    // Puhdistetaan data tallennusta varten
    const {
      setState: _ss,
      emitEvent: _ee,
      clearEvent: _ce,
      updateQuestProgress: _uqp, // Varmista että poistat kaikki funktiot
      ...dataToSave
    } = currentStateSnapshot;

    const finalPayload = {
      ...dataToSave,
      lastTimestamp: now,
    };

    try {
      // Suoritetaan molemmat tallennukset rinnakkain
      await Promise.all([
        saveGameData(user.uid, finalPayload),
        updateLeaderboardEntry(
          user.uid,
          currentStateSnapshot.username,
          currentStateSnapshot.avatar || "/assets/ui/icon_user_avatar.png",
          currentStateSnapshot.combatStats.maxMapCompleted,
        ),
      ]);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Sync failure:", error);
      setSaveStatus("error");
    }
  }, [user, isDataLoaded, setState]);

  // Tapahtumakuuntelijat (Exit & Visibility)
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

  // Intervallit
  useEffect(() => {
    if (!user || !isDataLoaded) return;

    const autoSaveInterval = setInterval(() => {
      handleForceSave();
    }, 120000);

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
