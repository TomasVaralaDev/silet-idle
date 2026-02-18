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
          
          const skillResources = GAME_DATA[skill];
          const resource = skillResources?.find(r => r.id === resourceId);

          if (!resource) return { activeAction: null };

          // 1. TARKISTUS: Materiaalit
          if (resource.inputs) {
            for (const input of resource.inputs) {
              const currentAmount = state.inventory[input.id] || 0;
              if (currentAmount < input.count) {
                return { activeAction: null };
              }
            }
          }

          const newProgress = progress + TICK_RATE;

          // 2. Onko toiminto valmis?
          if (newProgress >= targetTime) {
            
            const newInventory = { ...state.inventory };

            // A) VÄHENNYS (Materiaalien kulutus)
            if (resource.inputs) {
              resource.inputs.forEach(input => {
                newInventory[input.id] = (newInventory[input.id] || 0) - input.count;
                if (newInventory[input.id] < 0) newInventory[input.id] = 0;
              });
            }

            // B) XP JA LEVEL UP LOGIIKKA (KORJATTU)
            // Haetaan nykyinen data turvallisesti
            const currentSkillData = state.skills[skill] || { xp: 0, level: 1 };
            
            // HUOM: Käytämme 'let', koska näitä arvoja muutetaan silmukassa
            let currentXp = currentSkillData.xp + (resource.xpReward || 0);
            let currentLevel = currentSkillData.level;
            
            // Lasketaan paljonko XP:tä tarvitaan seuraavaan tasoon nykyisellä tasolla
            let xpRequired = currentLevel * 150; 

            // WHILE-silmukka varmistaa, että XP "nollautuu" (vähenee) ja level nousee,
            // vaikka saisit kerralla enemmän XP:tä kuin yksi level vaatii.
            while (currentXp >= xpRequired) {
              currentXp = currentXp - xpRequired; // VÄHENNETÄÄN vaadittu määrä -> XP alkaa alusta
              currentLevel++;                     // LEVEL UP
              xpRequired = currentLevel * 150;    // Lasketaan uusi vaatimus seuraavalle tasolle
            }

            // C) PALKINTO (Drops)
            if (resource.drops && resource.drops.length > 0) {
              resource.drops.forEach(drop => {
                const roll = Math.random() * 100;
                if (roll <= drop.chance) {
                  const amount = Math.floor(Math.random() * (drop.amountMax - drop.amountMin + 1)) + drop.amountMin;
                  newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
                }
              });
            } else {
              newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;
            }

            // D) Loop
            return {
              skills: {
                ...state.skills,
                // Tallennetaan uudet arvot: currentXp on nyt vähennetty arvo (esim. 10/300)
                [skill]: { xp: currentXp, level: currentLevel }
              },
              inventory: newInventory,
              activeAction: {
                ...state.activeAction,
                progress: 0
              }
            } as Partial<FullStoreState>;
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