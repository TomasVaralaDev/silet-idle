import { GAME_DATA, getItemDetails } from "../data";
import { calculateXpGain, getXpMultiplier } from "../utils/gameUtils";
import { MAX_LEVEL } from "../utils/skillScaling";
import { processQuestProgress } from "./questSystem";
import type { GameState, Resource, SkillType, Ingredient } from "../types";

/**
 * processSkillTick
 * Evaluates skill progression over time (for non-combat actions).
 * Consumes crafting inputs, awards items/XP, applies rune multipliers,
 * and updates daily quests.
 *
 * @param state - Current GameState
 * @param deltaTime - Time passed since last execution tick
 * @returns Partial GameState containing updates
 */
export const processSkillTick = (
  state: GameState,
  deltaTime: number,
): Partial<GameState> => {
  const { activeAction, inventory, skills, upgrades, equipment, quests } =
    state;

  if (!activeAction || activeAction.skill === "combat") return {};

  const skill = activeAction.skill as SkillType;

  // 1. EVALUATE RUNE BONUSES
  // Checks equipped accessory rune for flat speed or XP multipliers for this specific skill
  let speedBonus = 0;
  let runeXpBonus = 0;

  if (equipment.rune) {
    const runeItem = getItemDetails(equipment.rune);
    if (runeItem?.skillModifiers) {
      const speedKey = `${skill}Speed` as keyof typeof runeItem.skillModifiers;
      const xpKey = `${skill}Xp` as keyof typeof runeItem.skillModifiers;

      speedBonus = runeItem.skillModifiers[speedKey] || 0;
      runeXpBonus = runeItem.skillModifiers[xpKey] || 0;
    }
  }

  // 2. PROGRESS CALCULATION
  const bonusMultiplier = 1 + speedBonus;
  const newProgress =
    (activeAction.progress || 0) + deltaTime * bonusMultiplier;

  // Not enough time has passed to finish the action; return updated progress bar state
  if (newProgress < activeAction.targetTime) {
    return {
      activeAction: { ...activeAction, progress: newProgress },
    };
  }

  // 3. ACTION COMPLETION LOGIC
  const resourceId = activeAction.resourceId;
  const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
    (r: Resource) => r.id === resourceId,
  );

  if (!resource) return { activeAction: null };

  const newInventory = { ...inventory };
  const newSkills = { ...skills };

  // A) Material Consumption Check (for Crafting/Smithing/Alchemy)
  if (resource.inputs && resource.inputs.length > 0) {
    const canAfford = resource.inputs.every(
      (req: Ingredient) => (newInventory[req.id] || 0) >= req.count,
    );

    if (!canAfford) {
      return { activeAction: null }; // Abort action if materials depleted
    }

    resource.inputs.forEach((req: Ingredient) => {
      newInventory[req.id] -= req.count;
    });
  }

  // B) Award Primary Yield
  newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;

  // C) Update Daily Quests
  const questType =
    resource.inputs && resource.inputs.length > 0 ? "CRAFT" : "GATHER";
  const updatedDailyQuests = processQuestProgress(
    quests.dailyQuests,
    questType,
    resource.id,
    1,
  );

  // Strip empty values to keep the database footprint small
  Object.keys(newInventory).forEach((key) => {
    if (newInventory[key] <= 0) {
      delete newInventory[key];
    }
  });

  // 4. XP AND LEVEL PROGRESSION
  const currentSkillData = newSkills[skill] || { level: 1, xp: 0 };

  if (currentSkillData.level < MAX_LEVEL) {
    const xpMult = Math.max(1, getXpMultiplier(skill, upgrades)) + runeXpBonus;
    const baseXP = resource.xpReward ?? 0;

    const { level, xp } = calculateXpGain(
      currentSkillData.level,
      currentSkillData.xp,
      baseXP * xpMult,
    );

    // Hardcap logic
    if (level >= MAX_LEVEL) {
      newSkills[skill] = { level: MAX_LEVEL, xp: 0 };
    } else {
      newSkills[skill] = { level, xp };
    }
  } else {
    // Ensures clean data for level 99 players
    newSkills[skill] = { level: MAX_LEVEL, xp: 0 };
  }

  return {
    inventory: newInventory,
    skills: newSkills,
    quests: { ...quests, dailyQuests: updatedDailyQuests },
    activeAction: {
      ...activeAction,
      progress: newProgress % activeAction.targetTime, // Carry over leftover time to next craft
    },
  };
};
