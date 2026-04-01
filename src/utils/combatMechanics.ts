import type { GameState, CombatStyle } from "../types";

export interface CombatStats {
  hp: number;
  maxHp: number;
  mainStat: number; // Attack or specific Combat Style level
  weaponBase: number; // Base damage from equipped weapon
  bonusDamage: number; // Multipliers (e.g., from potions)
  armor: number; // Total defense from equipped armor
  penetration: number; // Armor penetration (future-proofing)
  attackSpeed: number; // Attack interval in milliseconds (e.g., 2400)
  critChance: number; // Decimal representation (e.g., 0.05 for 5%)
  critMultiplier: number; // Decimal representation (e.g., 1.5 for 150%)
}

export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number; // The percentage of raw damage absorbed by armor
}

/**
 * calculateCombatPower
 * Computes an arbitrary "Combat Power" score for UI display and matchmaking.
 * Blends theoretical DPS output with survivability (Tank Score).
 */
export const calculateCombatPower = (stats: {
  maxHit: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
  maxHp: number;
  armor: number;
}): number => {
  // 1. DPS Score: (Average Hit / Attack Speed in seconds) * Crit Factor
  // Assuming damage rolls between 50-100%, average hit is 75% of max
  const avgHit = stats.maxHit * 0.75;
  const speedInSeconds = stats.attackSpeed / 1000;

  // Crit factor mathematically accounts for the probability and severity of critical strikes
  const critFactor = 1 + stats.critChance * (stats.critMultiplier - 1);
  const dpsScore = (avgHit / speedInSeconds) * critFactor;

  // 2. Tank Score: Base HP weighted down + Raw Armor
  const tankScore = stats.maxHp / 10 + stats.armor;

  // 3. Final Composite Score
  return Math.floor(dpsScore + tankScore);
};

/**
 * getScaledMobStats
 * Dynamically scales enemy HP and Damage based on the current World and Zone.
 * Bosses (Zone 10) receive a massive, non-linear multiplier to act as progression blockers.
 */
export const getScaledMobStats = (worldId: number, isBoss: boolean = false) => {
  const mobHp = Math.floor(100 * Math.pow(4, worldId - 1));
  const mobDamage = Math.floor(10 * Math.pow(3.2, worldId - 1));

  if (isBoss) {
    return {
      hp: Math.floor(mobHp * (25 + 5 * worldId)),
      damage: Math.floor(mobDamage * (2 + 0.4 * worldId)),
    };
  }
  return { hp: mobHp, damage: mobDamage };
};

/**
 * calculateHit
 * The core damage calculation formula. Processes offensive stats against defensive stats,
 * factoring in armor mitigation, critical hits, and damage variance.
 */
export const calculateHit = (
  attacker: CombatStats,
  defender: CombatStats,
): CombatResult => {
  // 1. Base Damage: (Weapon Damage + 50% of Main Stat) * Global Multipliers
  const baseHit =
    (attacker.weaponBase + 0.5 * attacker.mainStat) *
    (1 + attacker.bonusDamage);

  // 2. Armor Mitigation: Effective Armor = Defender Armor - Attacker Penetration
  const effectiveArmor = Math.max(0, defender.armor - attacker.penetration);
  const mitigationFactor = 1 + effectiveArmor / 100;

  // 3. Raw Damage after mitigation is applied
  let rawDamage = baseHit / mitigationFactor;

  // 4. Critical Strike & Variance Calculation
  const isCrit = Math.random() < attacker.critChance;
  if (isCrit) {
    // Crits deal maximum possible damage multiplied by the crit stat
    rawDamage *= attacker.critMultiplier;
  } else {
    // Normal attacks deal between 50% and 100% of the raw damage
    rawDamage *= 0.5 + Math.random() * 0.5;
  }

  return {
    finalDamage: Math.max(1, Math.floor(rawDamage)), // Always deal at least 1 damage
    isCrit,
    mitigationPercent: Math.floor((1 - 1 / mitigationFactor) * 100),
  };
};

/**
 * getPlayerStats
 * Aggregates the player's skills and currently equipped gear into a usable CombatStats object.
 */
export const getPlayerStats = (
  skills: GameState["skills"],
  combatStyle: CombatStyle,
  gear: {
    damage?: number;
    armor?: number;
    attackSpeed?: number;
    critChance?: number;
    critMulti?: number;
    hpBonus?: number;
  },
): CombatStats => {
  const styleLevel = skills[combatStyle]?.level || 1;
  const baseAttackLevel = skills.attack?.level || 1;
  const totalDamageLevel = baseAttackLevel + styleLevel;

  const hitpointsLevel = skills.hitpoints?.level || 1;
  const baseHp = 100 + hitpointsLevel * 10;

  // Base 5% crit chance, scaling very slowly with levels
  const baseCritChance = 0.05 + totalDamageLevel * 0.001;
  const baseCritMulti = 1.5;

  return {
    hp: baseHp + (gear.hpBonus || 0),
    maxHp: baseHp + (gear.hpBonus || 0),
    mainStat: totalDamageLevel,
    weaponBase: gear.damage || 1,
    bonusDamage: 0,
    armor: gear.armor || 0,
    penetration: 0,
    attackSpeed: gear.attackSpeed || 2400,
    critChance: baseCritChance + (gear.critChance || 0),
    critMultiplier: Math.max(baseCritMulti, gear.critMulti || 1.5),
  };
};

/**
 * getEnemyStats
 * Converts flat map data into a valid CombatStats object for the combat engine.
 */
export const getEnemyStats = (enemy: {
  level: number;
  attack: number;
  maxHp?: number;
  currentHp?: number;
}): CombatStats => {
  // Armor scales linearly with the zone/world level, ensuring high-end player attacks can penetrate
  // Max Level 80 * 4 = 320 Armor (~4.2x damage mitigation)
  const estimatedArmor = enemy.level * 4;

  return {
    hp: enemy.currentHp || 10,
    maxHp: enemy.maxHp || 10,
    mainStat: 0,
    weaponBase: enemy.attack,
    bonusDamage: 0,
    armor: estimatedArmor,
    penetration: 0,
    attackSpeed: 2400, // Standardized enemy attack speed
    critChance: 0.02, // Enemies have a flat 2% crit chance
    critMultiplier: 1.2,
  };
};
