import type { SkillType, WeightedDrop } from "../types";

export const MAX_LEVEL = 99;

/**
 * getRequiredXpForLevel
 * Mathematical curve dictating the experience required for the *next* level.
 */
export const getRequiredXpForLevel = (level: number): number => {
  const numLevel = Number(level);
  if (isNaN(numLevel) || numLevel < 1) return 40;
  // Keeps formula intact even past 99 to ensure UI progress bars calculate properly
  return Math.floor(40 * Math.pow(numLevel, 2));
};

/**
 * calculateXpGain
 * Robust XP calculator that safely resolves multiple level-ups from massive XP injections
 * (e.g., from long offline progress). Prevents infinite loops at the level cap.
 */
export const calculateXpGain = (
  currentLevel: number | string,
  currentXp: number | string,
  xpReward: number | string,
) => {
  let cLevel = Number(currentLevel);
  if (isNaN(cLevel) || cLevel < 1) cLevel = 1;

  let cXp = Number(currentXp);
  if (isNaN(cXp) || cXp < 0) cXp = 0;

  const reward = Number(xpReward);

  // Return maxed values immediately if already at the level cap
  if (cLevel >= MAX_LEVEL) {
    return { level: MAX_LEVEL, xp: getRequiredXpForLevel(MAX_LEVEL) };
  }

  if (isNaN(reward) || reward <= 0) return { level: cLevel, xp: cXp };

  let totalXp = cXp + reward;
  let newLevel = cLevel;
  let reqXp = getRequiredXpForLevel(newLevel);

  // Iteratively deduct required XP and increment level until remaining XP cannot trigger a level up
  while (totalXp >= reqXp && newLevel < MAX_LEVEL) {
    totalXp -= reqXp;
    newLevel++;

    if (newLevel >= MAX_LEVEL) {
      newLevel = MAX_LEVEL;
      totalXp = getRequiredXpForLevel(MAX_LEVEL); // Lock XP at the required threshold
      break;
    }

    reqXp = getRequiredXpForLevel(newLevel);
  }

  return {
    level: newLevel,
    xp: Math.max(0, totalXp),
  };
};

/**
 * calculateTotalLevel
 * Aggregates all individual skill levels into a single Account Level score.
 */
export const calculateTotalLevel = (
  skills: Record<string, { level: number }>,
): number => {
  if (!skills) return 0;

  return Object.values(skills).reduce(
    (acc, skill) => acc + (skill?.level || 1),
    0,
  );
};

/**
 * getSpeedMultiplier
 * Calculates action interval reductions based on unlocked permanent upgrades.
 * Capped at 5.0x speed.
 */
export const getSpeedMultiplier = (skill: SkillType, upgrades: string[]) => {
  if (!upgrades || upgrades.length === 0) return 1.0;

  let multiplier = 1.0;
  const speedPrefix = `speed_${skill}`;

  for (let i = 0; i < upgrades.length; i++) {
    const upgrade = upgrades[i];
    if (
      upgrade.startsWith(speedPrefix) ||
      (upgrade.includes("speed") && upgrade.includes(skill))
    ) {
      multiplier += 0.2; // 20% speed increase per upgrade
    }
  }

  return Math.min(multiplier, 5.0);
};

export const getXpMultiplier = (skill: SkillType, upgrades: string[]) => {
  if (!upgrades) return 1;
  const hasTome = upgrades.includes(`xp_tome_${skill}`);
  return hasTome ? 1.5 : 1;
};

/**
 * pickWeightedItem
 * RNG generator that selects a single item from a loot pool based on individual item weights.
 */
export const pickWeightedItem = (
  drops: WeightedDrop[],
): WeightedDrop | null => {
  if (!drops || drops.length === 0) return null;

  const totalWeight = drops.reduce((sum, item) => sum + item.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const drop of drops) {
    if (randomWeight < drop.weight) return drop;
    randomWeight -= drop.weight;
  }

  return drops[0]; // Fallback
};

// Type guard for ensuring a string represents a valid equipment slot
export const isEquipmentSlot = (
  slot: string,
): slot is
  | "head"
  | "body"
  | "legs"
  | "weapon"
  | "shield"
  | "necklace"
  | "ring"
  | "rune"
  | "skill" => {
  return [
    "head",
    "body",
    "legs",
    "weapon",
    "shield",
    "necklace",
    "ring",
    "rune",
    "skill",
  ].includes(slot);
};

/**
 * sanitizeInventory
 * Optimized garbage collection for the inventory object. Removes keys with a value of 0.
 * Utilizes a 'changed' flag to return the original reference if no mutations occurred, preventing unnecessary React renders.
 */
export const sanitizeInventory = (
  inventory: Record<string, number>,
): Record<string, number> => {
  const cleanInv = { ...inventory };
  let changed = false;

  Object.keys(cleanInv).forEach((key) => {
    if (cleanInv[key] <= 0) {
      delete cleanInv[key];
      changed = true;
    }
  });

  return changed ? cleanInv : inventory;
};
