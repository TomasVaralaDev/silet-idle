import type { Resource, Rarity } from "../types";

/**
 * The absolute maximum tier an item can be enchanted to.
 * Lowered to 5 to create a faster, more volatile progression loop.
 */
export const MAX_ENCHANT_LEVEL = 5;

/**
 * Strips the enchantment suffix from an item ID (e.g., "iron_sword_e1" -> "iron_sword")
 */
export const getBaseId = (id: string): string => {
  return id.replace(/_e\d+$/, "");
};

/**
 * Extracts the current enchantment level from an item ID (e.g., "iron_sword_e2" -> 2)
 */
export const getEnchantLevel = (id: string): number => {
  const match = id.match(/_e(\d+)$/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Generates the ID for the next enchantment tier, capped at MAX_ENCHANT_LEVEL.
 */
export const getNextEnchantId = (id: string): string => {
  const baseId = getBaseId(id);
  const currentLevel = getEnchantLevel(id);

  if (currentLevel >= MAX_ENCHANT_LEVEL) return id;

  return `${baseId}_e${currentLevel + 1}`;
};

/**
 * getSuccessChance
 * Determines the probability of a successful enchantment based on the item's current level
 * and the quality (tier) of the scroll used.
 *
 * Base Chances by Scroll Tier:
 * T1: 65% | T2: 73% | T3: 81% | T4: 90%
 * Penalty: -15% chance per existing enchantment level.
 */
export const getSuccessChance = (level: number, scrollTier: number): number => {
  if (scrollTier <= 0) return 0;

  const baseChances = [0, 65, 73, 81, 90];
  const baseChance = baseChances[scrollTier] || 65;

  const penalty = level * 15;
  const chance = baseChance - penalty;

  // Hard limits: never drops below 5%, never exceeds 100%
  return Math.max(5, Math.min(100, chance));
};

/**
 * getEnchantCost
 * Calculates the gold required to attempt an enchantment.
 * Scales aggressively with the item's base value and current enchantment level.
 */
export const getEnchantCost = (level: number, baseValue: number): number => {
  return Math.floor(baseValue * (level + 1) * 15);
};

/**
 * applyEnchantStats
 * Generates a new Resource object representing the enchanted item.
 * Applies a 20% stat boost per enchantment level and upgrades the visual rarity.
 */
export const applyEnchantStats = (item: Resource, level: number): Resource => {
  if (level <= 0 || !item.stats) return item;

  const enchantedStats = { ...item.stats };
  // Multiplier scales linearly: +20% per level (+1 = 1.2x, +5 = 2.0x)
  const multiplier = 1 + level * 0.2;

  if (enchantedStats.attack) {
    enchantedStats.attack = Math.floor(enchantedStats.attack * multiplier);
  }
  if (enchantedStats.defense) {
    enchantedStats.defense = Math.floor(enchantedStats.defense * multiplier);
  }
  if (enchantedStats.hpBonus) {
    enchantedStats.hpBonus = Math.floor(enchantedStats.hpBonus * multiplier);
  }

  // Escalate the visual rarity color based on the enchantment power
  let newRarity: Rarity = item.rarity;
  if (level >= 5) newRarity = "legendary";
  else if (level >= 4) newRarity = "epic";
  else if (level >= 3) newRarity = "rare";
  else if (level >= 2) newRarity = "uncommon";

  return {
    ...item,
    name: `${item.name} +${level}`,
    rarity: newRarity,
    stats: enchantedStats,
  };
};

/**
 * Helper to ensure dynamically generated enchanted items have required baseline fields.
 */
export const fillMissingResourceFields = (item: Resource): Resource => {
  return {
    description: "",
    category: "misc",
    ...item,
  };
};
