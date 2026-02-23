import type { GameState, CombatStyle } from '../types';

export interface CombatStats {
  hp: number;
  maxHp: number;
  mainStat: number;      // Taso/Skill level
  weaponBase: number;    // Varusteiden damage
  bonusDamage: number;   // Esim. potionit (+20%)
  armor: number;         // Varusteiden armor
  penetration: number;   // Armor penetration
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
}

export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number; // Tieto siitä, paljonko armor vähensi
}

/**
 * Laskee vihollisen HP:n ja vahingon maailman skaalauksen mukaan.
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
 * UUSI LASKENTAKAAVA (Diminishing returns + Armor penetration)
 */
export const calculateHit = (attacker: CombatStats, defender: CombatStats): CombatResult => {
  // 1. Perusvahinko: (Weapon + 0.5 * MainStat) * (1 + BonusDamage)
  const baseHit = (attacker.weaponBase + (0.5 * attacker.mainStat)) * (1 + attacker.bonusDamage);

  // 2. Panssarin vaikutus: EffectiveArmor = EnemyArmor - Penetration
  const effectiveArmor = Math.max(0, defender.armor - attacker.penetration);
  const mitigationFactor = 1 + (effectiveArmor / 100);

  // 3. Vahinko panssarin jälkeen
  let rawDamage = baseHit / mitigationFactor;

  // 4. Kriittinen osuma (Expected value tai satunnainen)
  const isCrit = Math.random() < attacker.critChance;
  if (isCrit) {
    rawDamage *= attacker.critMultiplier;
  } else {
    // 50-100% iskuvarianssi (ei aina sama isku)
    rawDamage *= (0.5 + Math.random() * 0.5);
  }

  return {
    finalDamage: Math.max(1, Math.floor(rawDamage)),
    isCrit,
    mitigationPercent: Math.floor((1 - (1 / mitigationFactor)) * 100)
  };
};

/**
 * Muuntaa pelaajan tilan taistelustateiksi
 */
export const getPlayerStats = (
  skills: GameState['skills'],
  combatStyle: CombatStyle,
  gear: { damage: number; armor: number }
): CombatStats => {
  const styleLevel = skills[combatStyle]?.level || 1;
  const baseAttackLevel = skills.attack.level || 1;
  const totalDamageLevel = baseAttackLevel + styleLevel;

  return {
    hp: skills.hitpoints.level * 10,
    maxHp: skills.hitpoints.level * 10,
    mainStat: totalDamageLevel,
    weaponBase: gear.damage || 1, // Jos ei asetta, lyö 1
    bonusDamage: 0, // Laajennetaan myöhemmin
    armor: gear.armor || 0,
    penetration: 0, // Laajennetaan myöhemmin
    attackSpeed: 1.0,
    critChance: 0.05 + (totalDamageLevel * 0.001),
    critMultiplier: 1.5,
  };
};

/**
 * Skaalaa vihollisen statsit
 */
export const getEnemyStats = (enemy: { 
  level: number; // Mappi/World level
  attack: number; // Määritelty base attack
  maxHp?: number; 
  currentHp?: number;
  worldId?: number;
}): CombatStats => {
  // Oletetaan, että vihollisen armor on n. 10% sen hyökkäyksestä
  const estimatedArmor = Math.floor(enemy.attack * 0.1);

  return {
    hp: enemy.currentHp || 10,
    maxHp: enemy.maxHp || 10,
    mainStat: 0,
    weaponBase: enemy.attack,
    bonusDamage: 0,
    armor: estimatedArmor,
    penetration: 0,
    attackSpeed: 1.2,
    critChance: 0.02,
    critMultiplier: 1.2,
  };
};