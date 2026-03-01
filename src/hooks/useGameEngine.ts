import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type { FullStoreState } from "../store/useGameStore";
import { processCombatTick } from "../systems/combatSystem";
import { checkNewAchievements } from "../systems/achievementSystem";
import { ACHIEVEMENTS } from "../data/achievements";
import { GAME_DATA, getItemDetails } from "../data";
import { calculateXpGain, getRequiredXpForLevel } from "../utils/gameUtils";
import type { GameState, SkillType, Resource } from "../types";

export const useGameEngine = () => {
  const { setState, checkDailyReset, emitEvent } = useGameStore();

  useEffect(() => {
    const TICK_RATE = 100;
    let ticks = 0;

    const interval = setInterval(() => {
      ticks++;

      setState((state: FullStoreState) => {
        let nextUnlockedAchievements = [...state.unlockedAchievements];
        let hasNewAchievements = false;

        // --- 0. HP:N JA STATSIEN JATKUVA TARKISTUS (Kerran sekunnissa) ---
        if (ticks % 10 === 0) {
          const gearHpBonus = (
            Object.values(state.equipment) as (string | null)[]
          ).reduce((acc, itemId) => {
            if (!itemId) return acc;
            const item = getItemDetails(itemId) as Resource;
            return acc + (item?.stats?.hpBonus || 0);
          }, 0);

          const currentHpLevel = state.skills.hitpoints?.level || 10;
          const maxHp = currentHpLevel * 10 + gearHpBonus;

          // 1. Jos HP on yli maksimin (esim. varuste otettiin pois), tiputetaan se maksimiin.
          if (state.combatStats.hp > maxHp) {
            return {
              combatStats: {
                ...state.combatStats,
                hp: maxHp,
              },
            } as Partial<FullStoreState>;
          }

          // 2. AUTO-HEAL: Jos pelaaja EI ole taistelussa ja HP on alle maksimin,
          // parannetaan hänet automaattisesti täyteen uuteen maksimiin!
          if (
            (!state.activeAction || state.activeAction.skill !== "combat") &&
            state.combatStats.hp < maxHp
          ) {
            return {
              combatStats: {
                ...state.combatStats,
                hp: maxHp,
              },
            } as Partial<FullStoreState>;
          }
        }

        // --- 1. JUMIUTUNEIDEN TASOJEN KORJAUS (MAX 99) ---
        if (ticks % 10 === 0) {
          let needsFix = false;
          const healedSkills = { ...state.skills };

          (Object.keys(healedSkills) as SkillType[]).forEach((skill) => {
            const skillData = healedSkills[skill];
            if (
              skillData &&
              (skillData.level > 99 ||
                skillData.xp >= getRequiredXpForLevel(skillData.level))
            ) {
              needsFix = true;
              healedSkills[skill] = calculateXpGain(
                skillData.level,
                skillData.xp,
                0,
              );
            }
          });

          if (needsFix) {
            return { skills: healedSkills } as Partial<FullStoreState>;
          }
        }

        // --- 2. SAAVUTUSTEN JA QUESTIEN TARKISTUS ---
        if (ticks % 10 === 0) {
          const newUnlockIds = checkNewAchievements(
            state as unknown as GameState,
          );

          if (newUnlockIds.length > 0) {
            newUnlockIds.forEach((id: string) => {
              const ach = ACHIEVEMENTS.find((a) => a.id === id);
              if (ach) {
                emitEvent(
                  "success",
                  `Milestone Reached: ${ach.name}`,
                  ach.icon,
                );
              }
            });
            nextUnlockedAchievements = [
              ...nextUnlockedAchievements,
              ...newUnlockIds,
            ];
            hasNewAchievements = true;
          }
          checkDailyReset();
        }

        // --- 3. AKTIIVISEN TOIMINNON PROSESSOINTI ---
        if (!state.activeAction) {
          return hasNewAchievements
            ? { unlockedAchievements: nextUnlockedAchievements }
            : {};
        }

        if (state.activeAction.skill === "combat") {
          const combatUpdates = processCombatTick(
            state as unknown as GameState,
            TICK_RATE,
          );
          return {
            ...combatUpdates,
            unlockedAchievements: nextUnlockedAchievements,
          } as Partial<FullStoreState>;
        } else {
          const { skill, resourceId, progress, targetTime } =
            state.activeAction;
          const skillResources = GAME_DATA[skill];
          const resource = skillResources?.find((r) => r.id === resourceId);

          if (!resource)
            return {
              activeAction: null,
              unlockedAchievements: nextUnlockedAchievements,
            };

          if (resource.inputs) {
            for (const input of resource.inputs) {
              const currentAmount = state.inventory[input.id] || 0;
              if (currentAmount < input.count) {
                return {
                  activeAction: null,
                  unlockedAchievements: nextUnlockedAchievements,
                };
              }
            }
          }

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

          const newProgress = progress + TICK_RATE * speedMultiplier;

          if (newProgress >= targetTime) {
            const newInventory = { ...state.inventory };

            if (resource.inputs) {
              resource.inputs.forEach((input) => {
                const current = newInventory[input.id] || 0;
                const result = current - input.count;
                if (result <= 0) {
                  delete newInventory[input.id];
                } else {
                  newInventory[input.id] = result;
                }
              });
            }

            const currentSkillData = state.skills[skill] || { xp: 0, level: 1 };
            const totalXpGain = (resource.xpReward || 0) * (1 + runeXpBonus);

            const { level: newLevel, xp: newXp } = calculateXpGain(
              currentSkillData.level,
              currentSkillData.xp,
              totalXpGain,
            );

            if (resource.drops && resource.drops.length > 0) {
              resource.drops.forEach((drop) => {
                if (Math.random() * 100 <= drop.chance) {
                  const amount =
                    Math.floor(
                      Math.random() * (drop.amountMax - drop.amountMin + 1),
                    ) + drop.amountMin;
                  newInventory[drop.itemId] =
                    (newInventory[drop.itemId] || 0) + amount;
                }
              });
            } else {
              newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;
            }

            const isCrafting = ["crafting", "smithing", "alchemy"].includes(
              skill,
            );
            state.updateQuestProgress(
              isCrafting ? "CRAFT" : "GATHER",
              resource.id,
              1,
            );

            return {
              skills: {
                ...state.skills,
                [skill]: { xp: newXp, level: newLevel },
              },
              inventory: newInventory,
              activeAction: { ...state.activeAction, progress: 0 },
              unlockedAchievements: nextUnlockedAchievements,
            } as Partial<FullStoreState>;
          }

          return {
            activeAction: { ...state.activeAction, progress: newProgress },
            unlockedAchievements: nextUnlockedAchievements,
          } as Partial<FullStoreState>;
        }
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState, checkDailyReset, emitEvent]);
};
