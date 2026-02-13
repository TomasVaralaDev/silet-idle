import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { FullStoreState } from '../store/useGameStore'; 
import { processSkillTick } from '../systems/skillSystem';
import { processCombatTick } from '../systems/combatSystem';
import type { GameState } from '../types';

export const useGameEngine = () => {
  const setState = useGameStore((s) => s.setState);

  useEffect(() => {
    const TICK_RATE = 1000; // 100ms syke

    const interval = setInterval(() => {
      // Käytetään FullStoreState-tyyppiä, koska setState antaa sen meille
      setState((state: FullStoreState) => {
        if (!state.activeAction) return {};

        // Systeemit palauttavat Partial<GameState>, joka on Partial<FullStoreState> ali-joukko
        let updates: Partial<GameState> = {};

        if (state.activeAction.skill === 'combat') {
          // state as unknown as GameState irrottaa actionit datasta laskennan ajaksi
          updates = processCombatTick(state as unknown as GameState, TICK_RATE);
        } else {
          updates = processSkillTick(state as unknown as GameState, TICK_RATE);
        }

        // Palautetaan päivitykset (Zustand mergaa nämä automaattisesti)
        return updates as Partial<FullStoreState>;
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState]);
};