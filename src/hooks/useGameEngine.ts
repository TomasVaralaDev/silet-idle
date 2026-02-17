import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { FullStoreState } from '../store/useGameStore'; 
import { processCombatTick } from '../systems/combatSystem';
import { GAME_DATA } from '../data'; 
import type { GameState } from '../types';

export const useGameEngine = () => {
  const setState = useGameStore((s) => s.setState);

  useEffect(() => {
    const TICK_RATE = 100; // 100ms syke

    const interval = setInterval(() => {
      setState((state: FullStoreState) => {
        if (!state.activeAction) return {};

        // --- COMBAT ---
        if (state.activeAction.skill === 'combat') {
          return processCombatTick(state as unknown as GameState, TICK_RATE) as Partial<FullStoreState>;
        } 
        
        // --- SKILLS (Gathering & Production) ---
        else {
          const { skill, resourceId, progress, targetTime } = state.activeAction;
          
          let newProgress = progress + TICK_RATE;

          // Onko toiminto valmis?
          if (newProgress >= targetTime) {
            
            const skillResources = GAME_DATA[skill];
            const resource = skillResources?.find(r => r.id === resourceId);

            if (resource) {
              // TURVAVERKKO: Jos skill puuttuu vanhasta savesta (esim. foraging), käytetään oletusarvoja.
              const currentSkillData = state.skills[skill] || { xp: 0, level: 1 };
              
              const newXp = currentSkillData.xp + (resource.xpReward || 0);
              let newLevel = currentSkillData.level;

              // Level up tarkistus (Yksinkertainen kaava: level * 150)
              const xpForNext = newLevel * 150; 
              if (newXp >= xpForNext) newLevel++;

              // --- DROP LOGIIKKA (UUSI) ---
              const newInventory = { ...state.inventory };

              if (resource.drops && resource.drops.length > 0) {
                // Jos resurssilla on määritelty drops-lista, käytetään sitä
                resource.drops.forEach(drop => {
                  const roll = Math.random() * 100;
                  if (roll <= drop.chance) {
                    const amount = Math.floor(Math.random() * (drop.amountMax - drop.amountMin + 1)) + drop.amountMin;
                    newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
                  }
                });
              } else {
                // FALLBACK: Vanha tapa (jos drops ei ole määritelty, käytetään resurssin ID:tä)
                newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;
              }

              // Nollataan progress loopia varten
              newProgress = 0;

              return {
                skills: {
                  ...state.skills,
                  // Varmistetaan että tallennamme skillin objektina
                  [skill]: { xp: newXp, level: newLevel }
                },
                inventory: newInventory,
                activeAction: {
                  ...state.activeAction,
                  progress: newProgress
                }
              } as Partial<FullStoreState>;

            } else {
              // Jos resurssia ei löydy datasta
              console.error(`Resource ${resourceId} not found in skill ${skill}`);
              return { activeAction: null };
            }
          }

          // Jos ei valmis, päivitetään vain progress
          return {
            activeAction: {
              ...state.activeAction,
              progress: newProgress
            }
          } as Partial<FullStoreState>;
        }
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState]);
};