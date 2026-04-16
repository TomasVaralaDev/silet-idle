import { processCombatTick } from "./combatSystem";
import { calculateXpGain, getSpeedMultiplier } from "../utils/gameUtils";
import { GAME_DATA } from "../data";
import type { GameState, SkillType, Resource, Ingredient } from "../types";
import { calculateTowerCombatTick } from "./towerCombatSystem";

export interface OfflineSummary {
  seconds: number;
  xpGained: Partial<Record<SkillType, number>>;
  itemsGained: Record<string, number>;
}

/**
 * calculateOfflineProgress
 * Simulates game progression that occurred while the user was logged off or away.
 * Efficiently computes queue completion and endless task repetition without running
 * a full tick-by-tick simulation (except for combat, which requires tight iterative processing).
 *
 * @param initialState - The GameState exactly as it was when the user logged off
 * @param elapsedSeconds - The total time the user was away
 * @returns Object containing the updated GameState and a summary of all gains for the UI
 */
export const calculateOfflineProgress = (
  initialState: GameState,
  elapsedSeconds: number,
): { updatedState: GameState; summary: OfflineSummary } => {
  // Determine offline time limit based on base allowance + premium expansions
  const baseOfflineHours = 12;
  const extraOfflineHours = initialState.maxOfflineHoursIncrement || 0;
  const maxSeconds = (baseOfflineHours + extraOfflineHours) * 3600;

  // Cap elapsed time to prevent infinite grinding exploits
  let remainingSeconds = Math.min(elapsedSeconds, maxSeconds);
  const simulatedSeconds = remainingSeconds;

  const currentState: GameState = JSON.parse(JSON.stringify(initialState));

  // SAFETY: Ensure queue array exists to prevent legacy saves from crashing
  currentState.queue = currentState.queue || [];

  const summary: OfflineSummary = {
    seconds: simulatedSeconds,
    xpGained: {},
    itemsGained: {},
  };

  // If the player left with no active tasks, return immediately with empty summary
  if (!currentState.activeAction && currentState.queue.length === 0) {
    return { updatedState: currentState, summary };
  }
  // =====================================================================
  // SCENARIO 0: TOWER COMBAT SIMULATION
  // Player left the game while actively fighting in the Endless Tower.
  // We simulate the fight tick-by-tick until victory, defeat, or time runs out.
  // =====================================================================
  if (
    currentState.tower?.combat?.isActive &&
    currentState.tower?.combat?.status === "fighting"
  ) {
    for (let i = 0; i < remainingSeconds; i++) {
      // Abort simulation if the fight ended
      if (
        currentState.tower.combat.status !== "fighting" ||
        !currentState.tower.combat.isActive
      ) {
        break;
      }

      // Simulate 1 full second (1000ms) of combat
      // Note: calculateTowerCombatTick expects the full GameState and ms.
      const updates = calculateTowerCombatTick(currentState, 1000);

      if (updates) {
        currentState.tower.combat = {
          ...currentState.tower.combat,
          ...updates,
        };
      }
    }

    // Finalize the clock so the rest of the offline system can process other things if needed
    currentState.lastTimestamp = Date.now();
    return { updatedState: currentState, summary };
  }

  // If the player left with no active tasks, return immediately with empty summary
  if (!currentState.activeAction && currentState.queue.length === 0) {
    return { updatedState: currentState, summary };
  }
  // =====================================================================
  // SCENARIO 1: QUEUE PROCESSING
  // Player left tasks in the automated sequence queue.
  // =====================================================================
  if (currentState.queue.length > 0) {
    while (remainingSeconds > 0 && currentState.queue.length > 0) {
      const currentItem = currentState.queue[0];
      const skillData = GAME_DATA[currentItem.skill as keyof typeof GAME_DATA];
      const resource = skillData?.find(
        (r: Resource) => r.id === currentItem.resourceId,
      );

      if (!resource) {
        currentState.queue.shift(); // Invalid item in queue, drop it and proceed
        continue;
      }

      // --- RESOURCE VALIDATION ---
      let maxByMaterials = Infinity;
      if (resource.inputs && resource.inputs.length > 0) {
        resource.inputs.forEach((input: Ingredient) => {
          const available = currentState.inventory[input.id] || 0;
          const possibleWithThisInput = Math.floor(available / input.count);
          maxByMaterials = Math.min(maxByMaterials, possibleWithThisInput);
        });
      }

      if (maxByMaterials === 0 && resource.inputs) {
        // Out of materials. Halt the queue processing but leave the item in the queue
        // so the player can see exactly where the automation stopped.
        break;
      }

      const speedMult = getSpeedMultiplier(
        currentItem.skill,
        currentState.upgrades,
      );
      const intervalSeconds = (resource.interval || 3000) / speedMult / 1000;

      const todoCount = currentItem.amount - currentItem.completed;
      const possibleByTime = Math.floor(remainingSeconds / intervalSeconds);

      // Determine actual number of crafts completed by comparing constraints
      const actualCompletions = Math.min(
        todoCount,
        possibleByTime,
        maxByMaterials,
      );

      if (actualCompletions > 0) {
        // 1. DEDUCT MATERIALS
        if (resource.inputs) {
          resource.inputs.forEach((input: Ingredient) => {
            currentState.inventory[input.id] -= input.count * actualCompletions;
          });
        }

        const xpReward = actualCompletions * (resource.xpReward || 0);
        const skillId = currentItem.skill;

        // 2. UPDATE XP
        const sd = currentState.skills[skillId];
        currentState.skills[skillId] = calculateXpGain(
          sd.level,
          sd.xp,
          xpReward,
        );
        summary.xpGained[skillId] = (summary.xpGained[skillId] || 0) + xpReward;

        // 3. ADD CRAFTED ITEMS
        currentState.inventory[resource.id] =
          (currentState.inventory[resource.id] || 0) + actualCompletions;
        summary.itemsGained[resource.id] =
          (summary.itemsGained[resource.id] || 0) + actualCompletions;

        // 4. CONSUME TIME
        remainingSeconds -= actualCompletions * intervalSeconds;
        currentItem.completed += actualCompletions;
      }

      // Advance queue if current task is fully complete
      if (currentItem.completed >= currentItem.amount) {
        currentState.queue.shift();
      } else {
        break; // Out of time or materials
      }
    }

    // Synchronize activeAction to reflect the final state of the queue
    if (currentState.queue.length > 0) {
      const next = currentState.queue[0];
      const skillData = GAME_DATA[next.skill as keyof typeof GAME_DATA];
      const res = skillData?.find((r: Resource) => r.id === next.resourceId);
      const speedMult = getSpeedMultiplier(next.skill, currentState.upgrades);

      currentState.activeAction = {
        skill: next.skill,
        resourceId: next.resourceId,
        progress: 0,
        targetTime: (res?.interval || 3000) / speedMult,
      };
    } else {
      currentState.activeAction = null;
    }
  }
  // =====================================================================
  // SCENARIO 2: ENDLESS ACTION (Player clicked "START" manually, no queue)
  // =====================================================================
  else if (currentState.activeAction) {
    const { skill, resourceId } = currentState.activeAction;

    if (skill !== "combat") {
      // Gather/Craft calculation via simple math multiplication
      const skillData = GAME_DATA[skill as keyof typeof GAME_DATA];
      const resource = skillData?.find((r: Resource) => r.id === resourceId);

      if (resource) {
        const speedMult = getSpeedMultiplier(
          skill as SkillType,
          currentState.upgrades,
        );
        const intervalSeconds = (resource.interval || 3000) / speedMult / 1000;
        const completions = Math.floor(remainingSeconds / intervalSeconds);

        if (completions > 0) {
          const totalXpReward = completions * (resource.xpReward || 0);
          const sd = currentState.skills[skill as SkillType];

          currentState.skills[skill as SkillType] = calculateXpGain(
            sd.level,
            sd.xp,
            totalXpReward,
          );
          currentState.inventory[resource.id] =
            (currentState.inventory[resource.id] || 0) + completions;

          summary.xpGained[skill as SkillType] = totalXpReward;
          summary.itemsGained[resource.id] = completions;
        }
      }
    } else {
      // COMBAT SIMULATION
      // Combat requires iterative tick processing because drops are randomized
      // and death interrupts the loop based on live health tracking.
      const xpAtStart = { ...initialState.skills };

      for (let i = 0; i < remainingSeconds; i++) {
        if (!currentState.activeAction) break;
        // Simulate 1 second of combat at a time
        const updates = processCombatTick(currentState, 1000);
        Object.assign(currentState, updates);

        if (updates.combatStats)
          currentState.combatStats = {
            ...currentState.combatStats,
            ...updates.combatStats,
          };
        if (updates.inventory)
          currentState.inventory = {
            ...currentState.inventory,
            ...updates.inventory,
          };
        if (updates.skills)
          currentState.skills = { ...currentState.skills, ...updates.skills };
      }

      summary.xpGained = calculateXpDifference(xpAtStart, currentState.skills);
      summary.itemsGained = calculateItemDifference(
        initialState.inventory,
        currentState.inventory,
      );
    }
  }

  // Finalize processing by updating the clock
  currentState.lastTimestamp = Date.now();
  return { updatedState: currentState, summary };
};

// --- HELPER FUNCTIONS ---

function calculateXpDifference(
  oldSkills: GameState["skills"],
  newSkills: GameState["skills"],
) {
  const diff: Partial<Record<SkillType, number>> = {};
  (Object.keys(oldSkills) as SkillType[]).forEach((skillId) => {
    const xpDiff = newSkills[skillId].xp - oldSkills[skillId].xp;
    if (xpDiff > 0) diff[skillId] = xpDiff;
  });
  return diff;
}

function calculateItemDifference(
  oldInv: GameState["inventory"],
  newInv: GameState["inventory"],
) {
  const diff: Record<string, number> = {};
  for (const itemId in newInv) {
    const countDiff = (newInv[itemId] || 0) - (oldInv[itemId] || 0);
    if (countDiff > 0) diff[itemId] = countDiff;
  }
  return diff;
}
