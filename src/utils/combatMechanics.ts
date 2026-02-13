import type { CombatStats, CombatResult, GameState } from '../types';

// VAKIOT
const ARMOR_CONSTANT = 300; 
const ACCURACY_CONSTANT = 0.5; 

export const calculateHit = (attacker: CombatStats, defender: CombatStats): CombatResult => {
  // 1. OSUMATARKKUUS
  const hitChance = attacker.attackLevel / (attacker.attackLevel + (defender.defenseLevel * ACCURACY_CONSTANT));
  const rollsHit = Math.random() < hitChance;

  if (!rollsHit) {
    return { finalDamage: 0, isCrit: false, mitigationPercent: 0 };
  }

  // 2. MAX HIT LASKENTA
  const maxHit = 1 + (attacker.strengthLevel * 0.8) + attacker.attackDamage;

  // 3. KRITTIINEN OSUMA
  const isCrit = Math.random() < attacker.critChance;
  let rawDamage = 0;

  if (isCrit) {
    rawDamage = maxHit * attacker.critMultiplier;
  } else {
    rawDamage = Math.floor(Math.random() * maxHit) + 1;
  }

  // 4. VAHINGON VÄHENNYS (ARMOR)
  const damageReduction = defender.defenseLevel / (defender.defenseLevel + ARMOR_CONSTANT);
  const mitigationPercent = damageReduction;
  const mitigatedDamage = rawDamage * (1 - damageReduction);

  // 5. SATUNNAISVAIHTELU (+/- 10%)
  const variance = 0.9 + (Math.random() * 0.2);
  const damageWithVariance = mitigatedDamage * variance;

  return {
    finalDamage: Math.max(1, Math.floor(damageWithVariance)),
    isCrit,
    mitigationPercent
  };
};

/**
 * Rakentaa pelaajan statsit
 */
export const getPlayerStats = (
  skills: GameState['skills'],
  combatStyle: 'melee' | 'ranged' | 'magic',
  equipmentBonus: Partial<CombatStats>
): CombatStats => {
  
  const strengthLevel = skills[combatStyle]?.level || 1; 

  return {
    hp: skills.hitpoints.level * 10,
    maxHp: skills.hitpoints.level * 10,
    attackLevel: skills.attack.level,
    strengthLevel: strengthLevel,
    defenseLevel: skills.defense.level,
    attackDamage: equipmentBonus.attackDamage || 0, 
    armor: equipmentBonus.armor || 0,
    attackSpeed: equipmentBonus.attackSpeed || 1.0, 
    critChance: 0.05 + (skills.attack.level * 0.0001),
    critMultiplier: 1.5,
    // Varmistetaan että equipmentBonus ei ylikirjoita kriittisiä tyyppejä väärin
    ...equipmentBonus
  } as CombatStats;
};

/**
 * Rakentaa vihollisen statsit
 */
export const getEnemyStats = (
  baseStats: { hp: number; attack: number }, 
  level: number
): CombatStats => {
  const growth = 1.1; 
  
  const scaledHp = Math.floor(baseStats.hp * Math.pow(growth, level * 0.5));
  const scaledDmg = Math.floor(baseStats.attack * Math.pow(growth, level * 0.5));
  const scaledDef = Math.floor(level * 2); 
  const scaledAcc = Math.floor(level * 2);

  return {
    hp: scaledHp,
    maxHp: scaledHp,
    attackDamage: scaledDmg, 
    attackLevel: scaledAcc,
    strengthLevel: scaledDmg,
    defenseLevel: scaledDef,
    armor: 0,
    attackSpeed: 0.8,
    critChance: 0.05,
    critMultiplier: 1.5
  };
};