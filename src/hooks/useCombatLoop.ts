import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { processCombatTick } from "../systems/combatSystem";
import type { GameState } from "../types";

/**
 * useCombatLoop Hook
 * Separated dedicated loop specifically for handling combat mechanics.
 * Runs on a fast 100ms interval to ensure smooth progress bar animations
 * and accurate execution of fast attack speeds.
 */
export const useCombatLoop = () => {
  const setState = useGameStore((s) => s.setState);
  const activeAction = useGameStore((s) => s.activeAction);
  const currentMapId = useGameStore((s) => s.combatStats.currentMapId);

  useEffect(() => {
    let intervalId: number | undefined;

    // Fast tick rate (100ms) for high-resolution combat updates
    const TICK_RATE = 100;

    // Only start the loop if combat is the currently active action
    if (activeAction?.skill === "combat" && currentMapId) {
      intervalId = window.setInterval(() => {
        setState((prev: GameState) => {
          // Process a single combat frame
          const updates = processCombatTick(prev, TICK_RATE);

          // Apply calculated updates to the global store
          return {
            ...prev,
            ...updates,
          };
        });
      }, TICK_RATE);
    }

    // Cleanup interval when combat stops or component unmounts
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [activeAction, currentMapId, setState]);
};
