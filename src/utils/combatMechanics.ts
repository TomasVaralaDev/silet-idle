import type { GameState, CombatStyle } from "../types";

export interface CombatStats {
  hp: number;
  maxHp: number;
  mainStat: number; // Taso/Skill level
  weaponBase: number; // Varusteiden damage
  bonusDamage: number; // Esim. potionit (+20%)
  armor: number; // Varusteiden armor
  penetration: number; // Armor penetration
  attackSpeed: number; // Hyökkäysnopeus ms (esim 2400)
  critChance: number; // Esim 0.05
  critMultiplier: number; // Esim 1.5
}

export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number; // Tieto siitä, paljonko armor vähensi
}

/**
 * Laskee hahmon tai vihollisen kokonaisvoiman (Combat Power).
 * Perustuu DPS-potentiaaliin ja kestävyyteen.
 */
export const calculateCombatPower = (stats: {
  maxHit: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
  maxHp: number;
  armor: number;
}): number => {
  // 1. DPS Pisteet: (Keskimääräinen osuma / Nopeus sekunteina) * Crit-vaikutus
  // Keskiarvo 50-100% varianssista on 0.75x max hit
  const avgHit = stats.maxHit * 0.75;
  const speedInSeconds = stats.attackSpeed / 1000;

  // Crit-kerroin huomioi kuinka usein ja kuinka kovaa critit osuvat
  const critFactor = 1 + stats.critChance * (stats.critMultiplier - 1);
  const dpsScore = (avgHit / speedInSeconds) * critFactor;

  // 2. Tankki Pisteet: (HP / 10) + Armor
  const tankScore = stats.maxHp / 10 + stats.armor;

  // 3. Lopullinen Combat Power
  return Math.floor(dpsScore + tankScore);
};

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
 * LASKENTAKAAVA (Diminishing returns + Armor penetration)
 */
export const calculateHit = (
  attacker: CombatStats,
  defender: CombatStats,
): CombatResult => {
  // 1. Perusvahinko: (Weapon + 0.5 * MainStat) * (1 + BonusDamage)
  const baseHit =
    (attacker.weaponBase + 0.5 * attacker.mainStat) *
    (1 + attacker.bonusDamage);

  // 2. Panssarin vaikutus: EffectiveArmor = EnemyArmor - Penetration
  const effectiveArmor = Math.max(0, defender.armor - attacker.penetration);
  const mitigationFactor = 1 + effectiveArmor / 100;

  // 3. Vahinko panssarin jälkeen
  let rawDamage = baseHit / mitigationFactor;

  // 4. Kriittinen osuma
  const isCrit = Math.random() < attacker.critChance;
  if (isCrit) {
    rawDamage *= attacker.critMultiplier;
  } else {
    // 50-100% iskuvarianssi (ei aina sama isku)
    rawDamage *= 0.5 + Math.random() * 0.5;
  }

  return {
    finalDamage: Math.max(1, Math.floor(rawDamage)),
    isCrit,
    mitigationPercent: Math.floor((1 - 1 / mitigationFactor) * 100),
  };
};

/**
 * Muuntaa pelaajan tilan taistelustateiksi lukien gearStats-objektin turvallisesti
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
  // MUUTETTU: Base HP on nyt aina vähintään 100, plus taso * 10
  const baseHp = 100 + hitpointsLevel * 10;
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
 * Skaalaa vihollisen statsit
 */
export const getEnemyStats = (enemy: {
  level: number;
  attack: number;
  maxHp?: number;
  currentHp?: number;
}): CombatStats => {
  // KORJAUS: Armor ei enää skaalaudu loputtomiin Attackin mukana.
  // Nyt se perustuu vihollisen "leveliin" (esim. map.id eli 1-80).
  // Max level 80 * 4 = 320 Armoria (n. 4.2x vahingon vaimennus).
  // Pelaajan valtavat end-game iskut menevät vihdoin läpi!
  const estimatedArmor = enemy.level * 4;

  return {
    hp: enemy.currentHp || 10,
    maxHp: enemy.maxHp || 10,
    mainStat: 0,
    weaponBase: enemy.attack,
    bonusDamage: 0,
    armor: estimatedArmor,
    penetration: 0,
    attackSpeed: 2400,
    critChance: 0.02,
    critMultiplier: 1.2,
  };
};
