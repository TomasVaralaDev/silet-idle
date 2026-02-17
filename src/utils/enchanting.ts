import type { Resource } from '../types';

export const MAX_ENCHANT_LEVEL = 10;

export const getEnchantLevel = (itemId: string): number => {
  if (!itemId) return 0;
  const parts = itemId.split('_e');
  if (parts.length < 2) return 0;
  const level = parseInt(parts[parts.length - 1]);
  return isNaN(level) ? 0 : level;
};

export const getBaseId = (itemId: string): string => {
  if (!itemId) return '';
  const currentLevel = getEnchantLevel(itemId);
  if (currentLevel === 0) return itemId;
  return itemId.substring(0, itemId.lastIndexOf(`_e${currentLevel}`));
};

export const getNextEnchantId = (itemId: string): string => {
  const baseId = getBaseId(itemId);
  const currentLevel = getEnchantLevel(itemId);
  if (currentLevel >= MAX_ENCHANT_LEVEL) return itemId;
  return `${baseId}_e${currentLevel + 1}`;
};

export const getEnchantCost = (level: number, itemValue: number) => {
  const baseCost = Math.max(100, itemValue * 10);
  return Math.floor(baseCost * (1 + level * 0.75 + Math.pow(level, 1.5) * 0.2));
};

/**
 * UUSI KAAVA: Scroll on pakollinen ja määrittää onnistumisen.
 * @param currentLevel Itemin nykyinen taso (Vaikeusaste)
 * @param scrollTier Scrollin voimakkuus 1-8 (0 = ei scrollia)
 */
export const getSuccessChance = (currentLevel: number, scrollTier: number): number => {
  // 1. Jos ei scrollia, ei voi onnistua.
  if (!scrollTier || scrollTier < 1) return 0;

  // 2. Määritellään scrollin "voima" (Base Chance)
  const baseChance = 30 + (scrollTier * 10); 

  // 3. Määritellään vaikeusaste per level.
  const difficultyPenalty = currentLevel * 10;

  // 4. Lasketaan lopullinen (KORJAUS: const)
  const chance = baseChance - difficultyPenalty;

  // 5. Asetetaan rajat (min 5%, max 100%)
  if (chance < 5) return 5; 
  if (chance > 100) return 100;

  return chance;
};

export const applyEnchantStats = (item: Resource, level: number): Resource => {
  if (level === 0 || !item.stats) return item;
  const multiplier = 1 + (level * 0.10);
  return {
    ...item,
    name: `${item.name} +${level}`,
    stats: {
      ...item.stats,
      attack: item.stats.attack ? Math.floor(item.stats.attack * multiplier) : undefined,
      defense: item.stats.defense ? Math.floor(item.stats.defense * multiplier) : undefined,
    },
    rarity: level >= 10 ? 'legendary' : level >= 5 ? 'rare' : level >= 3 ? 'uncommon' : item.rarity
  };
};