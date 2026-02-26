import type { SkillType, WeightedDrop } from '../types';

export const getRequiredXpForLevel = (level: number): number => {
  const numLevel = Number(level);
  if (isNaN(numLevel) || numLevel < 1) return 40;
  return Math.floor(40 * Math.pow(numLevel, 2));
};

/**
 * POMMINKESTÄVÄ XP-LASKURI.
 * RAJOITETTU TASOLLE 99.
 */
export const calculateXpGain = (currentLevel: number | string, currentXp: number | string, xpReward: number | string) => {
  let cLevel = Number(currentLevel);
  if (isNaN(cLevel) || cLevel < 1) cLevel = 1;

  let cXp = Number(currentXp);
  if (isNaN(cXp) || cXp < 0) cXp = 0;

  const reward = Number(xpReward);
  if (isNaN(reward) || reward < 0) return { level: cLevel, xp: cXp };

  let totalXp = cXp + reward;
  let newLevel = cLevel;
  
  // 1. Jos taso on jo valmiiksi yli 99, pakotetaan se 99:ään ja korjataan XP maksimiin.
  if (newLevel >= 99) {
    return { level: 99, xp: getRequiredXpForLevel(99) };
  }

  let reqXp = getRequiredXpForLevel(newLevel);
  
  // 2. XP:n "syönti" ja tasojen nosto
  while (totalXp >= reqXp) {
    totalXp -= reqXp;
    newLevel++;

    // 3. Pysäytys heti, kun saavutetaan 99
    if (newLevel >= 99) {
      newLevel = 99;
      totalXp = getRequiredXpForLevel(99); // Lukitaan XP maksimiin
      break;
    }

    reqXp = getRequiredXpForLevel(newLevel);
  }
  
  return { 
    level: newLevel, 
    xp: Math.max(0, totalXp) 
  };
};

export const getSpeedMultiplier = (skill: SkillType, upgrades: string[]) => {
  let multiplier = 1.0;
  if (upgrades && upgrades.length > 0) {
    upgrades.forEach(upgradeId => {
      if (upgradeId.includes('speed') && upgradeId.includes(skill)) {
        multiplier += 0.2; 
      }
    });
  }
  return Math.min(multiplier, 5.0); 
};

export const getXpMultiplier = (skill: SkillType, upgrades: string[]) => {
  const hasTome = upgrades?.includes(`xp_tome_${skill}`);
  return hasTome ? 1.5 : 1; 
};

export const pickWeightedItem = (drops: WeightedDrop[]): WeightedDrop | null => {
  if (!drops || drops.length === 0) return null;
  const totalWeight = drops.reduce((sum, item) => sum + item.weight, 0);
  let randomWeight = Math.random() * totalWeight;
  for (const drop of drops) {
    if (randomWeight < drop.weight) return drop;
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
    if (cleanInv[key] <= 0) delete cleanInv[key];
  });
  return cleanInv;
};