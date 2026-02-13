import type { GameState } from '../types';

/**
 * Määritellään tarvittavat rajapinnat tässä, jotta ne ovat synkrossa 
 * laskentalogiikan kanssa ja poistavat import-virheet.
 */
export interface CombatStats {
  hp: number;
  maxHp: number;
  attackLevel: number;
  strengthLevel: number;
  defenseLevel: number;
  attackDamage: number;
  armor: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
}

export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number;
}

// VAKIOT
const ARMOR_CONSTANT = 300; 
const ACCURACY_CONSTANT = 0.5; 

/**
 * Laskee yhden hyökkäyksen lopputuloksen
 */
export const calculateHit = (attacker: CombatStats, defender: CombatStats): CombatResult => {
  // 1. OSUMATARKKUUS (Accuracy vs Defense)
  const hitChance = attacker.attackLevel / (attacker.attackLevel + (defender.defenseLevel * ACCURACY_CONSTANT));
  const rollsHit = Math.random() < hitChance;

  if (!rollsHit) {
    return { finalDamage: 0, isCrit: false, mitigationPercent: 0 };
  }

  // 2. MAX HIT LASKENTA
  // Peruskaava: 1 + voima-kerroin + varusteiden bonus
  const maxHit = 1 + (attacker.strengthLevel * 0.8) + attacker.attackDamage;

  // 3. KRIITTINEN OSUMA
  const isCrit = Math.random() < attacker.critChance;
  let rawDamage = 0;

  if (isCrit) {
    rawDamage = maxHit * attacker.critMultiplier;
  } else {
    // Satunnainen luku väliltä 1 - maxHit
    rawDamage = Math.floor(Math.random() * maxHit) + 1;
  }

  // 4. VAHINGON VÄHENNYS (Armor / Defense Level)
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
 * Muuntaa pelaajan taidot ja varusteet taistelustasiksi
 */
export const getPlayerStats = (
  skills: GameState['skills'],
  combatStyle: 'melee' | 'ranged' | 'magic',
  equipmentBonus: Partial<CombatStats>
): CombatStats => {
  
  // Valitaan voimataso tyylin mukaan (tässä yksinkertaistettu melee-attackiin)
  const strengthLevel = skills[combatStyle]?.level || skills.attack.level; 

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
    // Sallitaan varusteiden ylikirjoittaa arvot (esim. attackSpeed)
    ...equipmentBonus
  } as CombatStats;
};

/**
 * Laskee vihollisen statsit skaalattuna tason mukaan
 */
export const getEnemyStats = (
  baseStats: { hp: number; attack: number }, 
  level: number
): CombatStats => {
  const growth = 1.1; 
  
  // Skaalaus nousee tason mukaan eksponentiaalisesti
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