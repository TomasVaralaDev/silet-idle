import type { SkillType, WeightedDrop } from '../types';

/**
 * Laskee uuden tason ja XP:n
 */
export const calculateXpGain = (currentLevel: number, currentXp: number, xpReward: number) => {
  let newXp = currentXp + xpReward;
  let newLevel = currentLevel;
  let nextLevelReq = newLevel * 150;
  
  while (newXp >= nextLevelReq) {
    newXp -= nextLevelReq;
    newLevel++;
    nextLevelReq = newLevel * 150;
  }
  return { level: newLevel, xp: newXp };
};

/**
 * Laskee nopeuskertoimen (Speed Multiplier)
 * 1.0 = normaali nopeus
 * 5.0 = 5 kertaa nopeampi (maksimi)
 */
export const getSpeedMultiplier = (skill: SkillType, upgrades: string[]) => {
  let multiplier = 1.0;

  // Lasketaan kaupan päivitykset (esim. 10% per päivitys)
  upgrades.forEach(upgradeId => {
    // Tarkistetaan onko kyseessä tähän taitoon liittyvä nopeuspäivitys
    if (upgradeId.includes('speed') && upgradeId.includes(skill)) {
      multiplier += 0.2; // 20% nopeuslisä per esine
    }
  });

  // TÄRKEÄÄ: Asetetaan ehdoton katto 5.0x nopeudelle.
  // Tämä estää 99% tai muut "rikkinäiset" bonukset sotkemasta peliä.
  return Math.min(multiplier, 5.0); 
};

/**
 * Laskee XP-kertoimen (XP Multiplier)
 */
export const getXpMultiplier = (skill: SkillType, upgrades: string[]) => {
  const hasTome = upgrades.includes(`xp_tome_${skill}`);
  return hasTome ? 1.5 : 1; // Kohtuullisempi 50% bonus
};

/**
 * Valitsee satunnaisen esineen painotetusta listasta
 */
export const pickWeightedItem = (drops: WeightedDrop[]): WeightedDrop | null => {
  if (!drops || drops.length === 0) return null;

  const totalWeight = drops.reduce((sum, item) => sum + item.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const drop of drops) {
    if (randomWeight < drop.weight) {
      return drop;
    }
    randomWeight -= drop.weight;
  }
  return drops[0];
};

/**
 * Tarkistaa onko annettu string validi equipment slot
 */
export const isEquipmentSlot = (slot: string): slot is 'head' | 'body' | 'legs' | 'weapon' | 'shield' | 'necklace' | 'ring' | 'rune' | 'skill' => {
  return ['head', 'body', 'legs', 'weapon', 'shield', 'necklace', 'ring', 'rune', 'skill'].includes(slot);
};

// inventory siivous
export const sanitizeInventory = (inventory: Record<string, number>): Record<string, number> => {
  const cleanInv = { ...inventory };
  Object.keys(cleanInv).forEach(key => {
    if (cleanInv[key] <= 0) {
      delete cleanInv[key];
    }
  });
  return cleanInv;
};