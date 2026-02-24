import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { FullStoreState } from '../store/useGameStore'; 
import { processCombatTick } from '../systems/combatSystem';
import { GAME_DATA, getItemDetails } from '../data'; 
import { calculateXpGain } from '../utils/gameUtils';
import type { GameState } from '../types';

export const useGameEngine = () => {
  const setState = useGameStore((s) => s.setState);

  useEffect(() => {
    const TICK_RATE = 100;

    const interval = setInterval(() => {
      setState((state: FullStoreState) => {
        if (!state.activeAction) return {};

        if (state.activeAction.skill === 'combat') {
          return processCombatTick(state as unknown as GameState, TICK_RATE) as Partial<FullStoreState>;
        } 
        
        else {
          const { skill, resourceId, progress, targetTime } = state.activeAction;
          const skillResources = GAME_DATA[skill];
          const resource = skillResources?.find(r => r.id === resourceId);

          if (!resource) return { activeAction: null };

          // 1. Materiaalitarkistus
          if (resource.inputs) {
            for (const input of resource.inputs) {
              const currentAmount = state.inventory[input.id] || 0;
              if (currentAmount < input.count) return { activeAction: null };
            }
          }

          // --- DYNAAMINEN NOPEUSBONUS ---
          let speedMultiplier = 1;
          let runeXpBonus = 0;

          if (state.equipment.rune) {
            const runeDetails = getItemDetails(state.equipment.rune);
            if (runeDetails?.skillModifiers) {
              const speedKey = `${skill}Speed` as keyof typeof runeDetails.skillModifiers;
              const xpKey = `${skill}Xp` as keyof typeof runeDetails.skillModifiers;
              
              speedMultiplier += (runeDetails.skillModifiers[speedKey] || 0);
              runeXpBonus = (runeDetails.skillModifiers[xpKey] || 0);
            }
          }

          const newProgress = progress + (TICK_RATE * speedMultiplier);

          // 2. Onko toiminto valmis?
          if (newProgress >= targetTime) {
            const newInventory = { ...state.inventory };

            // A) Materiaalien kulutus
            if (resource.inputs) {
              resource.inputs.forEach(input => {
                newInventory[input.id] = Math.max(0, (newInventory[input.id] || 0) - input.count);
              });
            }

            // B) XP JA LEVEL UP (SRP: Delegoidaan laskenta calculateXpGainille)
            const currentSkillData = state.skills[skill] || { xp: 0, level: 1 };
            const totalXpGain = (resource.xpReward || 0) * (1 + runeXpBonus);
            
            const { level: newLevel, xp: newXp } = calculateXpGain(
              currentSkillData.level, 
              currentSkillData.xp, 
              totalXpGain
            );

            // C) Palkinto
            if (resource.drops && resource.drops.length > 0) {
              resource.drops.forEach(drop => {
                if (Math.random() * 100 <= drop.chance) {
                  const amount = Math.floor(Math.random() * (drop.amountMax - drop.amountMin + 1)) + drop.amountMin;
                  newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
                }
              });
            } else {
              newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;
            }

            return {
              skills: { ...state.skills, [skill]: { xp: newXp, level: newLevel } },
              inventory: newInventory,
              activeAction: { ...state.activeAction, progress: 0 }
            } as Partial<FullStoreState>;
          }

          return {
            activeAction: { ...state.activeAction, progress: newProgress }
          } as Partial<FullStoreState>;
        }
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState]);
};