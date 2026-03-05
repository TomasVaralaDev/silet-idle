import { useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { GAME_DATA, getItemDetails } from "../data";
import { calculateQueueTimeLeft } from "../utils/queueUtils";

export const useQueueTimer = () => {
  const [totalTimeLeftMs, setTotalTimeLeftMs] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      // Haetaan tila tässä hetkessä suoraan, estää loopin kaatumisen!
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

    updateTimer(); // Ajetaan kerran heti komponentin latautuessa
    const interval = setInterval(updateTimer, 1000); // Päivitetään tasan sekunnin välein

    return () => clearInterval(interval);
  }, []); // Tyhjä array on kriittinen! Se takaa, että ajastinta ei nollata 100ms välein.

  return totalTimeLeftMs;
};
