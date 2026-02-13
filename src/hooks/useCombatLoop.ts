import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { processCombatTick } from '../systems/combatSystem';
import type { GameState } from '../types';

/**
 * useCombatLoop: Erillinen hook taistelun tikitykselle, 
 * jos sitä ei ajeta globaalin pelimoottorin kautta.
 */
export const useCombatLoop = () => {
  const setState = useGameStore((s) => s.setState);
  const activeAction = useGameStore((s) => s.activeAction);
  const currentMapId = useGameStore((s) => s.combatStats.currentMapId);

  useEffect(() => {
    let intervalId: number | undefined;
    const TICK_RATE = 1000; // 1 sekunnin välein

    if (activeAction?.skill === 'combat' && currentMapId) {
      intervalId = window.setInterval(() => {
        setState((prev: GameState) => {
          // KORJATTU: Lisätty TICK_RATE (1000) toiseksi argumentiksi
          const updates = processCombatTick(prev, TICK_RATE);
          
          return { 
            ...prev, 
            ...updates 
          };
        });
      }, TICK_RATE);
    } 

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [activeAction, currentMapId, setState]);
};