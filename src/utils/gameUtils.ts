import type { SkillType, WeightedDrop } from '../types';

/**
 * UUSI: XP Laskenta (Hitaampi eteneminen, BaseXP 100, Level^1.6)
 */
export const calculateXpGain = (currentLevel: number, currentXp: number, xpReward: number) => {
  let newXp = currentXp + xpReward;
  let newLevel = currentLevel;
  
  // XP Required = BaseXP * Level^1.6
  const getRequiredXp = (lvl: number) => Math.floor(100 * Math.pow(lvl, 1.6));
  
  let nextLevelReq = getRequiredXp(newLevel);
  
  while (newXp >= nextLevelReq) {
    newXp -= nextLevelReq;
    newLevel++;
    nextLevelReq = getRequiredXp(newLevel);
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