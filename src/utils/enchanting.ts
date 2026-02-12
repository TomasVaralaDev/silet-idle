import type { Resource } from '../types';

// MÄÄRITELLÄÄN MAKSIMITASO TÄHÄN
export const MAX_ENCHANT_LEVEL = 10;

// Hakee itemin tason ID:n perusteella (esim. 'sword_iron_e2' -> 2)
export const getEnchantLevel = (itemId: string): number => {
  const parts = itemId.split('_e');
  if (parts.length < 2) return 0;
  const level = parseInt(parts[parts.length - 1]);
  return isNaN(level) ? 0 : level;
};

// Hakee itemin alkuperäisen ID:n
export const getBaseId = (itemId: string): string => {
  const parts = itemId.split('_e');
  if (parts.length < 2) return itemId;
  const potentialLevel = parseInt(parts[parts.length - 1]);
  if (isNaN(potentialLevel)) return itemId;
  
  return parts.slice(0, -1).join('_e');
};

// Luo uuden ID:n seuraavalle tasolle
export const getNextEnchantId = (itemId: string): string => {
  const baseId = getBaseId(itemId);
  const currentLevel = getEnchantLevel(itemId);
  
  // Estetään ID:n luonti jos maksimi on jo saavutettu (varotoimi)
  if (currentLevel >= MAX_ENCHANT_LEVEL) return itemId;

  return `${baseId}_e${currentLevel + 1}`;
};

// Laskee hinnan (Nyt progressiivisempi hinta)
export const getEnchantCost = (level: number, itemValue: number) => {
  const baseCost = Math.max(100, itemValue * 10);
  // Hinta nousee jyrkemmin korkeammilla tasoilla
  return Math.floor(baseCost * (1 + level * 0.75 + Math.pow(level, 1.5) * 0.2));
};

// Laskee uudet statit
export const applyEnchantStats = (item: Resource, level: number): Resource => {
  if (level === 0 || !item.stats) return item;

  const multiplier = 1 + (level * 0.10); // +10% per level

  return {
    ...item,
    name: `${item.name} +${level}`,
    stats: {
      ...item.stats,
      attack: item.stats.attack ? Math.floor(item.stats.attack * multiplier) : undefined,
      defense: item.stats.defense ? Math.floor(item.stats.defense * multiplier) : undefined,
    },
    // Visuaalinen rarity muutos
    rarity: level >= 10 ? 'legendary' : level >= 5 ? 'rare' : level >= 3 ? 'uncommon' : item.rarity
  };
};