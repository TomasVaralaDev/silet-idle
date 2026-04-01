import { useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { GAME_DATA, getItemDetails } from "../data";
import { calculateQueueTimeLeft } from "../utils/queueUtils";

/**
 * useQueueTimer Hook
 * Calculates the total estimated time remaining for all tasks currently
 * in the action queue. Reads directly from the store to avoid dependency loops.
 */
export const useQueueTimer = () => {
  const [totalTimeLeftMs, setTotalTimeLeftMs] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      // Fetching state directly bypasses React's render cycle dependencies,
      // preventing infinite loops caused by rapid queue updates.
      const state = useGameStore.getState();

      const ms = calculateQueueTimeLeft(
        state.queue,
        state.activeAction,
        state.upgrades,
        state.equipment,
        GAME_DATA,
        getItemDetails,
      );

      setTotalTimeLeftMs(ms);
    };

    // Initial execution
    updateTimer();

    // Update the UI timer every 1 second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures timer runs independently

  return totalTimeLeftMs;
};
