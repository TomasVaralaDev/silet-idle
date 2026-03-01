import type { Resource, Rarity } from "../types";

/**
 * Maksimitaso, jolle esineen voi lumota.
 * Exportataan tämä, jotta enchantingSlice.ts löytää sen.
 */
export const MAX_ENCHANT_LEVEL = 10;

/**
 * Poistaa tasomerkinnän ID:stä (Esim. "iron_sword_e1" -> "iron_sword")
 */
export const getBaseId = (id: string): string => {
  return id.replace(/_e\d+$/, "");
};

/**
 * Palauttaa esineen lumoustason (Esim. "item_e1" -> 1)
 */
export const getEnchantLevel = (id: string): number => {
  const match = id.match(/_e(\d+)$/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Luo seuraavan tason ID:n. Rajoitettu MAX_ENCHANT_LEVEL -vakioon.
 */
export const getNextEnchantId = (id: string): string => {
  const baseId = getBaseId(id);
  const currentLevel = getEnchantLevel(id);

  if (currentLevel >= MAX_ENCHANT_LEVEL) return id;

  return `${baseId}_e${currentLevel + 1}`;
};

/**
 * Laskee onnistumistodennäköisyyden (Testien kaavan mukaan)
 * Kaava: (Käärön Tier * 10 + 30) - (Esineen nykyinen taso * 10)
 */
export const getSuccessChance = (level: number, scrollTier: number): number => {
  if (scrollTier <= 0) return 0;
  const baseChance = scrollTier * 10 + 30;
  const penalty = level * 10;
  const chance = baseChance - penalty;
  return Math.max(5, Math.min(100, chance));
};

/**
 * Laskee lumoamisen hinnan
 */
export const getEnchantCost = (level: number, baseValue: number): number => {
  // Perushinta nousee tason mukaan
  return Math.floor(baseValue * (level + 1) * 10);
};

/**
 * Laskee ja asettaa esineelle lumotut statsit, nimen ja harvinaisuuden.
 */
export const applyEnchantStats = (item: Resource, level: number): Resource => {
  if (level <= 0 || !item.stats) return item;

  const enchantedStats = { ...item.stats };
  const multiplier = 1 + level * 0.1;

  if (enchantedStats.attack) {
    enchantedStats.attack = Math.floor(enchantedStats.attack * multiplier);
  }
  if (enchantedStats.defense) {
    enchantedStats.defense = Math.floor(enchantedStats.defense * multiplier);
  }
  if (enchantedStats.hpBonus) {
    enchantedStats.hpBonus = Math.floor(enchantedStats.hpBonus * multiplier);
  }

  // Päivitetään harvinaisuus tason mukaan
  let newRarity: Rarity = item.rarity;
  if (level >= 9) newRarity = "legendary";
  else if (level >= 7) newRarity = "epic";
  else if (level >= 5) newRarity = "rare";
  else if (level >= 3) newRarity = "uncommon";

  return {
    ...item,
    name: `${item.name} +${level}`,
    rarity: newRarity,
    stats: enchantedStats,
  };
};

/**
 * Apufunktio, joka varmistaa että resurssilla on kaikki tarvittavat kentät
 */
export const fillMissingResourceFields = (item: Resource): Resource => {
  return {
    description: "",
    category: "misc",
    ...item,
  };
};
