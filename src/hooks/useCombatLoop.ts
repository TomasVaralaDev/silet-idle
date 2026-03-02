import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { processCombatTick } from "../systems/combatSystem";
import type { GameState } from "../types";

/**
 * useCombatLoop: Erillinen hook taistelun tikitykselle,
 * joka pyörii nyt nopealla 100ms syklillä itsenäisten hyökkäysnopeuksien tukemiseksi.
 */
export const useCombatLoop = () => {
  const setState = useGameStore((s) => s.setState);
  const activeAction = useGameStore((s) => s.activeAction);
  const currentMapId = useGameStore((s) => s.combatStats.currentMapId);

  useEffect(() => {
    let intervalId: number | undefined;
    const TICK_RATE = 100; // UUSI: 100ms välein, jotta progress bar ja speed toimivat sileästi!

    if (activeAction?.skill === "combat" && currentMapId) {
      intervalId = window.setInterval(() => {
        setState((prev: GameState) => {
          const updates = processCombatTick(prev, TICK_RATE);

          return {
            ...prev,
            ...updates,
          };
        });
      }, TICK_RATE);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [activeAction, currentMapId, setState]);
};
