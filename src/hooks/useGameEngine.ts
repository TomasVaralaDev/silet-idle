import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { processSkillTick } from '../systems/skillSystem';
import { processCombatTick } from '../systems/combatSystem';

export const useGameEngine = () => {
  const setState = useGameStore((s) => s.setState);

  useEffect(() => {
    const TICK_RATE = 100; // 10 kertaa sekunnissa

    const interval = setInterval(() => {
      setState((state) => {
        if (!state.activeAction) return {};

        let updates = {};

        // Jos taistelu
        if (state.activeAction.skill === 'combat') {
          updates = processCombatTick(state); // Combat-systeemi hoitaa omat sisäiset ajastimensa
        } 
        // Jos taito (Woodcutting, jne)
        else {
          updates = processSkillTick(state, TICK_RATE);
        }

        return updates;
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState]);
};