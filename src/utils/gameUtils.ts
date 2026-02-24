import type { SkillType, WeightedDrop } from '../types';

/**
 * Laskee vaaditun XP-määrän tietylle tasolle.
 * UUSI KAAVA: 40 * Level^2
 * Esim: Lvl 10 -> 4000 XP, Lvl 100 -> 400 000 XP
 */
export const getRequiredXpForLevel = (level: number): number => {
  return Math.floor(40 * Math.pow(level, 2));
};

/**
 * Laskee uuden tason ja XP:n annetun palkinnon perusteella.
 * Tukee useita tasonnousuja kerralla (esim. jos pelaaja saa paljon XP:tä).
 */
export const calculateXpGain = (currentLevel: number, currentXp: number, xpReward: number) => {
  let newXp = currentXp + xpReward;
  let newLevel = currentLevel;
  
  let nextLevelReq = getRequiredXpForLevel(newLevel);
  
  // Nousee niin monta tasoa kuin XP riittää
  while (newXp >= nextLevelReq) {
    newXp -= nextLevelReq;
    newLevel++;
    nextLevelReq = getRequiredXpForLevel(newLevel);
  }
  
  return { level: newLevel, xp: newXp };
};

/**
 * Laskee nopeuskertoimen (Speed Multiplier)
 */
export const getSpeedMultiplier = (skill: SkillType, upgrades: string[]) => {
  let multiplier = 1.0;

  upgrades.forEach(upgradeId => {
    if (upgradeId.includes('speed') && upgradeId.includes(skill)) {
      multiplier += 0.2; 
    }
  });

  return Math.min(multiplier, 5.0); 
};

/**
 * Laskee XP-kertoimen (XP Multiplier)
 */
export const getXpMultiplier = (skill: SkillType, upgrades: string[]) => {
  const hasTome = upgrades.includes(`xp_tome_${skill}`);
  return hasTome ? 1.5 : 1; 
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

export const isEquipmentSlot = (slot: string): slot is 'head' | 'body' | 'legs' | 'weapon' | 'shield' | 'necklace' | 'ring' | 'rune' | 'skill' => {
  return ['head', 'body', 'legs', 'weapon', 'shield', 'necklace', 'ring', 'rune', 'skill'].includes(slot);
};

export const sanitizeInventory = (inventory: Record<string, number>): Record<string, number> => {
  const cleanInv = { ...inventory };
  Object.keys(cleanInv).forEach(key => {
    if (cleanInv[key] <= 0) {
      delete cleanInv[key];
    }
  });
  return cleanInv;
};