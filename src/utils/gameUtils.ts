import type { SkillType, WeightedDrop } from "../types";

export const MAX_LEVEL = 99;

export const getRequiredXpForLevel = (level: number): number => {
  const numLevel = Number(level);
  if (isNaN(numLevel) || numLevel < 1) return 40;
  // Tasolla 99 ei tarvita enää lisää XP:tä seuraavaan tasoon,
  // mutta pidetään kaava vakaana UI-palkkia varten.
  return Math.floor(40 * Math.pow(numLevel, 2));
};

/**
 * POMMINKESTÄVÄ XP-LASKURI.
 * Korjattu Level 99 "Ping-Pong" looppi ja estetty turhat state-päivitykset.
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

  // 1. Jos ollaan jo katossa, palautetaan vakioarvot.
  if (cLevel >= MAX_LEVEL) {
    return { level: MAX_LEVEL, xp: getRequiredXpForLevel(MAX_LEVEL) };
  }

  // Jos palkintoa ei ole, palautetaan nykyiset, jotta vältytään NaN-virheiltä.
  if (isNaN(reward) || reward <= 0) return { level: cLevel, xp: cXp };

  let totalXp = cXp + reward;
  let newLevel = cLevel;
  let reqXp = getRequiredXpForLevel(newLevel);

  // 2. XP:n laskenta loopilla, mutta VAIN jos ollaan alle maksimitason.
  // Tämä estää ikuisen loopin tason 99 kohdalla.
  while (totalXp >= reqXp && newLevel < MAX_LEVEL) {
    totalXp -= reqXp;
    newLevel++;

    if (newLevel >= MAX_LEVEL) {
      newLevel = MAX_LEVEL;
      totalXp = getRequiredXpForLevel(MAX_LEVEL); // Lukitaan XP maksimiin
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
 * Laskee pelaajan kokonaistason (Account Level) summaamalla kaikkien taitojen tasot.
 * @param skills Pelaajan skills-objekti
 * @returns Kokonaistaso numerona
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
 * Optimoitu Speed Multiplier.
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
      multiplier += 0.2;
    }
  }

  return Math.min(multiplier, 5.0);
};

export const getXpMultiplier = (skill: SkillType, upgrades: string[]) => {
  if (!upgrades) return 1;
  const hasTome = upgrades.includes(`xp_tome_${skill}`);
  return hasTome ? 1.5 : 1;
};

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

  return drops[0];
};

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
 * Optimoitu inventorion siivous.
 * Käyttää 'changed' muuttujaa välttääkseen turhat renderöinnit.
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

  // Jos mitään ei muutettu, palautetaan alkuperäinen objekti-viittaus (Shallow comparison benefit)
  return changed ? cleanInv : inventory;
};
