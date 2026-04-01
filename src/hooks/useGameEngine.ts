import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type { FullStoreState } from "../store/useGameStore";
import { processCombatTick } from "../systems/combatSystem";
import { checkNewAchievements } from "../systems/achievementSystem";
import { ACHIEVEMENTS } from "../data/achievements";
import { GAME_DATA, getItemDetails } from "../data";
import { calculateXpGain, getSpeedMultiplier } from "../utils/gameUtils";
import { processQuestProgress } from "../systems/questSystem";
import type { GameState, Resource, SkillType } from "../types";

/**
 * useGameEngine Hook
 * The core heartbeat of the idle game. This hook manages the master 100ms tick,
 * handling health regeneration, offline catch-up validation, achievement tracking,
 * queue processing, and active skill progression.
 */
export const useGameEngine = () => {
  const { setState, emitEvent } = useGameStore();

  useEffect(() => {
    // Global engine tick rate (100ms)
    const TICK_RATE = 100;

    const interval = setInterval(() => {
      setState((state: FullStoreState) => {
        const now = Date.now();
        const last = state.lastTimestamp || now;

        // Calculate delta time to handle minor lag spikes gracefully
        const deltaMs = now - last;

        if (deltaMs <= 0) return {};

        let updates: Partial<FullStoreState> = { lastTimestamp: now };

        // 1-Second boundary checks: Events that only need to run once per second
        const isNewSecond = Math.floor(last / 1000) !== Math.floor(now / 1000);

        if (isNewSecond) {
          // Calculate dynamic Max HP including gear bonuses
          const gearHpBonus = (
            Object.values(state.equipment) as (string | null)[]
          ).reduce((acc, itemId) => {
            if (!itemId) return acc;
            const item = getItemDetails(itemId) as Resource;
            return acc + (item?.stats?.hpBonus || 0);
          }, 0);

          const currentHpLevel = state.skills.hitpoints?.level || 1;
          const maxHp = 100 + currentHpLevel * 10 + gearHpBonus;

          // Cap health at max, or fully heal if out of combat
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

          // Hardcap skills at level 99 to prevent overflow bugs
          let needsFix = false;
          const healedSkills = { ...state.skills };
          (Object.keys(healedSkills) as SkillType[]).forEach((skill) => {
            const skillData = healedSkills[skill];
            if (skillData && skillData.level > 99) {
              needsFix = true;
              healedSkills[skill] = { level: 99, xp: 0 };
            }
          });
          if (needsFix) updates.skills = healedSkills;

          // Achievement Validation
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
        }

        // Queue Management: Auto-start next task if idle
        let currentAction = state.activeAction;
        const currentQueue = [...state.queue];

        if (!currentAction && currentQueue.length > 0) {
          const nextTask = currentQueue[0];
          const resource = GAME_DATA[nextTask.skill]?.find(
            (r) => r.id === nextTask.resourceId,
          );

          if (resource) {
            // Apply speed multipliers for the new queued task
            const speedMult = getSpeedMultiplier(
              nextTask.skill,
              state.upgrades,
            );
            const targetTime = Math.max(
              200,
              (resource.interval || 3000) / speedMult,
            );

            currentAction = {
              skill: nextTask.skill,
              resourceId: nextTask.resourceId,
              progress: 0,
              targetTime,
            };
            updates.activeAction = currentAction;
          } else {
            // Remove invalid tasks from queue
            currentQueue.shift();
            updates.queue = currentQueue;
          }
        }

        // Active Action Processing (Gathering / Crafting / Combat)
        if (currentAction) {
          // Combat delegates to its own subsystem
          if (currentAction.skill === "combat") {
            const combatUpdates = processCombatTick(
              state as unknown as GameState,
              deltaMs,
            );
            updates = { ...updates, ...combatUpdates };
          } else {
            // Skill Processing (Woodcutting, Smithing, etc.)
            const { skill, resourceId, progress, targetTime } = currentAction;
            const resource = GAME_DATA[skill]?.find((r) => r.id === resourceId);

            if (!resource) {
              updates.activeAction = null;
            } else {
              // Apply dynamic multipliers from Runes and Upgrades
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

              // Calculate progress added during this tick
              const addedProgress = deltaMs * speedMultiplier;
              const totalProgress = progress + addedProgress;

              // Action Completion Logic
              if (totalProgress >= targetTime) {
                // Determine how many completions occurred (handles offline catchup)
                const completions = Math.floor(totalProgress / targetTime);
                let remainingProgress = totalProgress % targetTime;

                const newInventory = updates.inventory
                  ? { ...updates.inventory }
                  : { ...state.inventory };

                let possibleCompletions = completions;

                // Validate crafting material requirements
                if (resource.inputs) {
                  for (const input of resource.inputs) {
                    const available = newInventory[input.id] || 0;
                    const maxByInput = Math.floor(available / input.count);
                    possibleCompletions = Math.min(
                      possibleCompletions,
                      maxByInput,
                    );
                  }
                }

                // Check against Queue limitations
                let isQueueTask = false;
                if (
                  currentQueue.length > 0 &&
                  currentQueue[0].resourceId === resourceId &&
                  currentQueue[0].skill === skill
                ) {
                  isQueueTask = true;
                  const queueRemaining =
                    currentQueue[0].amount - currentQueue[0].completed;
                  possibleCompletions = Math.min(
                    possibleCompletions,
                    queueRemaining,
                  );
                }

                // Execute valid completions
                if (possibleCompletions > 0) {
                  // Deduct required inputs
                  if (resource.inputs) {
                    resource.inputs.forEach((input) => {
                      newInventory[input.id] =
                        (newInventory[input.id] || 0) -
                        input.count * possibleCompletions;
                      if (newInventory[input.id] <= 0)
                        delete newInventory[input.id];
                    });
                  }

                  // Calculate and apply XP
                  const currentSkillData = updates.skills?.[skill] ||
                    state.skills[skill] || { xp: 0, level: 1 };

                  const totalXpGain =
                    (resource.xpReward || 0) *
                    (1 + runeXpBonus) *
                    possibleCompletions;

                  const { level: newLevel, xp: newXp } = calculateXpGain(
                    currentSkillData.level,
                    currentSkillData.xp,
                    totalXpGain,
                  );

                  // Distribute Loot/Drops
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

                  updates.inventory = newInventory;
                  updates.skills = {
                    ...(updates.skills || state.skills),
                    [skill]: { xp: newXp, level: newLevel },
                  };

                  // Update Daily Quests
                  const questType =
                    resource.inputs && resource.inputs.length > 0
                      ? "CRAFT"
                      : "GATHER";
                  const currentQuests =
                    updates.quests?.dailyQuests || state.quests.dailyQuests;

                  const updatedDailyQuests = processQuestProgress(
                    currentQuests,
                    questType,
                    resource.id,
                    possibleCompletions,
                  );

                  updates.quests = {
                    ...(updates.quests || state.quests),
                    dailyQuests: updatedDailyQuests,
                  };

                  // Finalize Queue progression
                  if (isQueueTask) {
                    currentQueue[0].completed += possibleCompletions;
                    if (currentQueue[0].completed >= currentQueue[0].amount) {
                      currentQueue.shift();
                      updates.activeAction = null;
                      remainingProgress = 0;
                    } else {
                      updates.activeAction = {
                        ...currentAction,
                        progress: remainingProgress,
                      };
                    }
                    updates.queue = currentQueue;
                  } else {
                    updates.activeAction = {
                      ...currentAction,
                      progress: remainingProgress,
                    };
                  }
                } else {
                  // Out of materials or reached queue limit, stop action
                  updates.activeAction = null;
                  if (isQueueTask) {
                    currentQueue.shift();
                    updates.queue = currentQueue;
                  }
                }
              } else {
                // Action still in progress, just update the bar
                updates.activeAction = {
                  ...currentAction,
                  progress: totalProgress,
                };
              }
            }
          }
        }

        return Object.keys(updates).length > 0 ? updates : {};
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [setState, emitEvent]);
};
