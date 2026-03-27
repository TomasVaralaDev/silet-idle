import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { saveGameData } from "../services/gameService";
import { updateLeaderboardEntry } from "../services/leaderboardService";
import { calculateTotalLevel } from "../utils/gameUtils"; // LISÄTTY: Tuodaan laskentatyökalu
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

    const currentTotalLevel = calculateTotalLevel(currentStateSnapshot.skills);

    // Päivitetään aikaleima storeen
    setState((prev: GameState) => ({ ...prev, lastTimestamp: now }));

    // 1. POIMITAAN DATA JA EROTETAAN FUNKTIOT
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      setState: _ss,
      emitEvent: _ee,
      clearEvent: _ce,
      updateQuestProgress: _uqp,
      updateUserProfile: _uup, // Lisätty tämä uusi funktio poistolistalle
      ...dataToSave
    } = currentStateSnapshot;

    // 2. PUHDISTETAAN SOCIAL-OBJEKTI (Kriittinen vaihe!)
    // Emme halua tallentaa globalMessages-listaa pelaajan dokumenttiin.
    const sanitizedSocial = {
      ...dataToSave.social,
      globalMessages: [], // Pakotetaan tyhjäksi ennen lähetystä
    };

    // 3. MUODOSTETAAN LOPULLINEN PAYLOAD
    const finalPayload = {
      ...dataToSave,
      social: sanitizedSocial, // Käytetään puhdistettua versiota
      lastTimestamp: now,
    };

    try {
      await Promise.all([
        saveGameData(user.uid, finalPayload),
        updateLeaderboardEntry(
          user.uid,
          currentStateSnapshot.username,
          currentStateSnapshot.avatar || "/assets/ui/icon_user_avatar.png",
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
