import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { processCombatTick } from '../systems/combatSystem';
import type { GameState } from '../types';

export const useCombatLoop = () => {
  const setState = useGameStore((s) => s.setState);
  const activeAction = useGameStore((s) => s.activeAction);
  const currentMapId = useGameStore((s) => s.combatStats.currentMapId);

  useEffect(() => {
    let intervalId: number | undefined;

    if (activeAction?.skill === 'combat' && currentMapId) {
      intervalId = window.setInterval(() => {
        // Dependency Inversion: Hook kutsuu Systemiä
        setState((prev: GameState) => {
          const updates = processCombatTick(prev);
          return { ...prev, ...updates };
        });
      }, 1000);
    } 

    return () => clearInterval(intervalId);
  }, [activeAction, currentMapId, setState]);
};