import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type { FullStoreState } from "../store/useGameStore";
import { processCombatTick } from "../systems/combatSystem";
import { checkNewAchievements } from "../systems/achievementSystem";
import { ACHIEVEMENTS } from "../data/achievements";
import { GAME_DATA, getItemDetails } from "../data";
import { calculateXpGain } from "../utils/gameUtils";
import type { GameState, Resource } from "../types";

export const useGameEngine = () => {
  const { setState, checkDailyReset, emitEvent } = useGameStore();

  useEffect(() => {
    const TICK_RATE = 100;

    const interval = setInterval(() => {
      setState((state: FullStoreState) => {
        const now = Date.now();
        const last = state.lastTimestamp || now;
        const deltaMs = now - last;

        // Jos aikaa on kulunut liian vähän, ei päivitetä tilaa turhaan
        if (deltaMs <= 0) return {};

        let updates: Partial<FullStoreState> = { lastTimestamp: now };

        // --- 0. HARVEMMIN TEHTÄVÄT TARKISTUKSET (Kerran sekunnissa) ---
        const isNewSecond = Math.floor(last / 1000) !== Math.floor(now / 1000);

        if (isNewSecond) {
          // A) HP & STATS
          const gearHpBonus = (
            Object.values(state.equipment) as (string | null)[]
          ).reduce((acc, itemId) => {
            if (!itemId) return acc;
            const item = getItemDetails(itemId) as Resource;
            return acc + (item?.stats?.hpBonus || 0);
          }, 0);

          const currentHpLevel = state.skills.hitpoints?.level || 1;
          const maxHp = 100 + currentHpLevel * 10 + gearHpBonus;

          if (state.combatStats.hp > maxHp) {
            updates.combatStats = { ...state.combatStats, hp: maxHp };
          } else if (
            (!state.activeAction || state.activeAction.skill !== "combat") &&
            state.combatStats.hp < maxHp
          ) {
            updates.combatStats = {
              ...(updates.combatStats || state.combatStats),
              hp: maxHp,
            };
          }

          // B) TASOJEN KORJAUS & SAAVUTUKSET
          const newUnlockIds = checkNewAchievements(
            state as unknown as GameState,
          );
          if (newUnlockIds.length > 0) {
            newUnlockIds.forEach((id: string) => {
              const ach = ACHIEVEMENTS.find((a) => a.id === id);
              if (ach) emitEvent("success", `Milestone: ${ach.name}`, ach.icon);
            });
            updates.unlockedAchievements = [
              ...state.unlockedAchievements,
              ...newUnlockIds,
            ];
          }
          checkDailyReset();
        }

        // --- 1. AKTIIVISEN TOIMINNON PROSESSOINTI ---
        if (state.activeAction) {
          // Taistelu käyttää omaa tick-logiikkaansa
          if (state.activeAction.skill === "combat") {
            const combatUpdates = processCombatTick(
              state as unknown as GameState,
              deltaMs,
            );
            updates = { ...updates, ...combatUpdates };
          } else {
            const { skill, resourceId, progress, targetTime } =
              state.activeAction;
            const resource = GAME_DATA[skill]?.find((r) => r.id === resourceId);

            if (!resource) {
              updates.activeAction = null;
            } else {
              // Lasketaan bonukset
              let speedMultiplier = 1;
              let runeXpBonus = 0;
              if (state.equipment.rune) {
                const runeDetails = getItemDetails(state.equipment.rune);
                if (runeDetails?.skillModifiers) {
                  speedMultiplier +=
                    runeDetails.skillModifiers[
                      `${skill}Speed` as keyof typeof runeDetails.skillModifiers
                    ] || 0;
                  runeXpBonus =
                    runeDetails.skillModifiers[
                      `${skill}Xp` as keyof typeof runeDetails.skillModifiers
                    ] || 0;
                }
              }

              // KORJAUS: Käytetään deltaMs suoraan progressiin.
              // Tämä tekee liikkeestä täysin sulavan riippumatta TICK_RATEsta.
              const addedProgress = deltaMs * speedMultiplier;
              const totalProgress = progress + addedProgress;

              if (totalProgress >= targetTime) {
                // Tehtävän valmistuminen (pysyy samana)
                const completions = Math.floor(totalProgress / targetTime);
                const remainingProgress = totalProgress % targetTime;

                const newInventory = { ...state.inventory };
                let possibleCompletions = completions;

                if (resource.inputs) {
                  for (const input of resource.inputs) {
                    const available = state.inventory[input.id] || 0;
                    const maxByInput = Math.floor(available / input.count);
                    possibleCompletions = Math.min(
                      possibleCompletions,
                      maxByInput,
                    );
                  }
                }

                if (possibleCompletions > 0) {
                  // Materiaalien kulutus
                  if (resource.inputs) {
                    resource.inputs.forEach((input) => {
                      newInventory[input.id] =
                        (newInventory[input.id] || 0) -
                        input.count * possibleCompletions;
                      if (newInventory[input.id] <= 0)
                        delete newInventory[input.id];
                    });
                  }

                  // XP ja tasot
                  const currentSkillData = state.skills[skill] || {
                    xp: 0,
                    level: 1,
                  };
                  const totalXpGain =
                    (resource.xpReward || 0) *
                    (1 + runeXpBonus) *
                    possibleCompletions;
                  const { level: newLevel, xp: newXp } = calculateXpGain(
                    currentSkillData.level,
                    currentSkillData.xp,
                    totalXpGain,
                  );

                  // Lootin generointi
                  for (let i = 0; i < possibleCompletions; i++) {
                    if (resource.drops && resource.drops.length > 0) {
                      resource.drops.forEach((drop) => {
                        if (Math.random() * 100 <= drop.chance) {
                          const amount =
                            Math.floor(
                              Math.random() *
                                (drop.amountMax - drop.amountMin + 1),
                            ) + drop.amountMin;
                          newInventory[drop.itemId] =
                            (newInventory[drop.itemId] || 0) + amount;
                        }
                      });
                    } else {
                      newInventory[resource.id] =
                        (newInventory[resource.id] || 0) + 1;
                    }
                  }

                  // Questit
                  const isCrafting = [
                    "crafting",
                    "smithing",
                    "alchemy",
                  ].includes(skill);
                  state.updateQuestProgress(
                    isCrafting ? "CRAFT" : "GATHER",
                    resource.id,
                    possibleCompletions,
                  );

                  updates.inventory = newInventory;
                  updates.skills = {
                    ...state.skills,
                    [skill]: { xp: newXp, level: newLevel },
                  };
                  updates.activeAction = {
                    ...state.activeAction,
                    progress: remainingProgress,
                  };
                } else {
                  updates.activeAction = null; // Materiaalit loppuivat
                }
              } else {
                // Jatkuva progress-päivitys (tämä on se sulava osa)
                updates.activeAction = {
                  ...state.activeAction,
                  progress: totalProgress,
                };
              }
            }
          }
        }

        return updates;
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState, checkDailyReset, emitEvent]);
};
