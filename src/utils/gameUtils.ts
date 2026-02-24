import type { SkillType, WeightedDrop } from '../types';

/**
 * Laskee vaaditun XP-määrän tietylle tasolle.
 * UUSI KAAVA: 40 * Level^2
 */
export const getRequiredXpForLevel = (level: number): number => {
  const numLevel = Number(level);
  if (isNaN(numLevel) || numLevel < 1) return 40;
  return Math.floor(40 * Math.pow(numLevel, 2));
};

/**
 * POMMINKESTÄVÄ XP-LASKURI.
 * Korjaa automaattisesti "1500 / 1000" -tyyppiset jumiutumiset.
 */
export const calculateXpGain = (currentLevel: number | string, currentXp: number | string, xpReward: number | string) => {
  // 1. Pakotetaan kaikki arvot puhtaiksi numeroiksi, estetään NaN-korruptio
  let cLevel = Number(currentLevel);
  if (isNaN(cLevel) || cLevel < 1) cLevel = 1;

  let cXp = Number(currentXp);
  if (isNaN(cXp) || cXp < 0) cXp = 0;

  const reward = Number(xpReward);
  if (isNaN(reward) || reward < 0) return { level: cLevel, xp: cXp };

  // 2. Lasketaan uusi kokonais-XP yhteen (säilyttää desimaalit)
  let totalXp = cXp + reward;
  let newLevel = cLevel;
  
  // 3. Haetaan vaatimus
  let reqXp = getRequiredXpForLevel(newLevel);
  
  // 4. Tämä on ydin: Niin kauan kuin XP on yli vaatimuksen, taso NOUSEE.
  // Suoritetaan heti, jos peli on ladattu jumitilassa (esim. 1500 XP vs 1000 Req)
  while (totalXp >= reqXp) {
    if (newLevel >= 120) {
      newLevel = 120;
      break; // Pysäytetään, jos tasokatto saavutetaan
    }
    totalXp -= reqXp;     // Vähennetään kulunut XP
    newLevel++;           // Nostetaan tasoa
    reqXp = getRequiredXpForLevel(newLevel); // Uusi raja
  }
  
  // 5. Palautetaan taso ja nollataan mahdolliset bugiset negatiiviset luvut
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