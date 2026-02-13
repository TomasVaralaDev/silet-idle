import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameState, Expedition } from '../types';

export const useScavengerLoop = () => {
  // Haetaan setState storesta (emme tarvitse statea tässä, koska päivitämme funktiolla)
  const setState = useGameStore((s) => s.setState);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev: GameState) => {
        const now = Date.now();
        const updated = prev.scavenger.activeExpeditions.map((exp: Expedition) => {
          if (!exp.completed && now - exp.startTime >= exp.duration) {
            return { ...exp, completed: true };
          }
          return exp;
        });

        return { 
          scavenger: { 
            ...prev.scavenger, 
            activeExpeditions: updated 
          } 
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [setState]);
};