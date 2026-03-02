import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type { FullStoreState } from "../store/useGameStore";
import { processCombatTick } from "../systems/combatSystem";
import { checkNewAchievements } from "../systems/achievementSystem";
import { ACHIEVEMENTS } from "../data/achievements";
import { GAME_DATA, getItemDetails } from "../data";
import { calculateXpGain, MAX_LEVEL } from "../utils/gameUtils";
import type { GameState, SkillType, Resource } from "../types";

export const useGameEngine = () => {
  const { setState, checkDailyReset, emitEvent } = useGameStore();

  useEffect(() => {
    const TICK_RATE = 100;

    const interval = setInterval(() => {
      setState((state: FullStoreState) => {
        const now = Date.now();
        const last = state.lastTimestamp || now;
        const deltaMs = now - last;

        // Lasketaan kuinka monta tickiä on jäänyt välistä (esim. välilehti taustalla)
        const ticksToProcess = Math.floor(deltaMs / TICK_RATE);

        // Jos aikaa on kulunut liian vähän yhteenkään tickiin, odotetaan
        if (ticksToProcess <= 0) return {};

        let updates: Partial<FullStoreState> = { lastTimestamp: now };

        let nextUnlockedAchievements = [...state.unlockedAchievements];
        let hasNewAchievements = false;

        // --- 0. HARVEMMIN TEHTÄVÄT TARKISTUKSET (Kerran sekunnissa) ---
        // Tarkistetaan onko sekunti vaihtunut edellisestä tickistä
        if (Math.floor(last / 1000) !== Math.floor(now / 1000)) {
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

          // B) JUMIUTUNEIDEN TASOJEN KORJAUS
          let needsFix = false;
          const healedSkills = { ...state.skills };
          (Object.keys(healedSkills) as SkillType[]).forEach((skill) => {
            const skillData = healedSkills[skill];
            if (skillData && skillData.level > MAX_LEVEL) {
              needsFix = true;
              healedSkills[skill] = { level: MAX_LEVEL, xp: 0 };
            }
          });
          if (needsFix) updates.skills = healedSkills;

          // C) SAAVUTUKSET & QUESTIT
          const newUnlockIds = checkNewAchievements(
            state as unknown as GameState,
          );
          if (newUnlockIds.length > 0) {
            newUnlockIds.forEach((id: string) => {
              const ach = ACHIEVEMENTS.find((a) => a.id === id);
              if (ach)
                emitEvent(
                  "success",
                  `Milestone Reached: ${ach.name}`,
                  ach.icon,
                );
            });
            nextUnlockedAchievements = [
              ...nextUnlockedAchievements,
              ...newUnlockIds,
            ];
            updates.unlockedAchievements = nextUnlockedAchievements;
            hasNewAchievements = true;
          }
          checkDailyReset();
        }

        // --- 1. AKTIIVISEN TOIMINNON PROSESSOINTI (Catch-up tuki) ---
        if (state.activeAction) {
          const totalElapsedMs = ticksToProcess * TICK_RATE;

          if (state.activeAction.skill === "combat") {
            const combatUpdates = processCombatTick(
              state as unknown as GameState,
              totalElapsedMs,
            );
            updates = { ...updates, ...combatUpdates };
          } else {
            const { skill, resourceId, progress, targetTime } =
              state.activeAction;
            const resource = GAME_DATA[skill]?.find((r) => r.id === resourceId);

            if (!resource) {
              updates.activeAction = null;
            } else {
              let speedMultiplier = 1;
              let runeXpBonus = 0;
              if (state.equipment.rune) {
                const runeDetails = getItemDetails(state.equipment.rune);
                if (runeDetails?.skillModifiers) {
                  const speedKey =
                    `${skill}Speed` as keyof typeof runeDetails.skillModifiers;
                  const xpKey =
                    `${skill}Xp` as keyof typeof runeDetails.skillModifiers;
                  speedMultiplier += runeDetails.skillModifiers[speedKey] || 0;
                  runeXpBonus = runeDetails.skillModifiers[xpKey] || 0;
                }
              }

              const addedProgress = totalElapsedMs * speedMultiplier;
              const totalProgress = progress + addedProgress;

              if (totalProgress >= targetTime) {
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
                  if (resource.inputs) {
                    resource.inputs.forEach((input) => {
                      const cost = input.count * possibleCompletions;
                      newInventory[input.id] =
                        (newInventory[input.id] || 0) - cost;
                      if (newInventory[input.id] <= 0)
                        delete newInventory[input.id];
                    });
                  }

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
                  updates.activeAction = null;
                }
              } else {
                updates.activeAction = {
                  ...state.activeAction,
                  progress: totalProgress,
                };
              }
            }
          }
        }

        if (hasNewAchievements && !updates.unlockedAchievements) {
          updates.unlockedAchievements = nextUnlockedAchievements;
        }

        return Object.keys(updates).length > 0 ? updates : {};
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState, checkDailyReset, emitEvent]);
};
