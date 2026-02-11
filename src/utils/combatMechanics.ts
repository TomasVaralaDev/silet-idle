// src/utils/combatMechanics.ts
import type { CombatStats, CombatResult } from '../types';

// VAKIOT
const ARMOR_CONSTANT_K = 200; // Vakio K hyperboliseen kaavaan

/**
 * Laskee yhden iskun vahingon.
 */
export const calculateHit = (attacker: CombatStats, defender: CombatStats): CombatResult => {
  // 1. Kriittinen osuma
  const isCrit = Math.random() < attacker.critChance;
  
  let rawDamage = attacker.attackDamage;
  if (isCrit) {
    rawDamage *= attacker.critMultiplier;
  }

  // 2. Vahingon vähennys (Hyperbolinen panssari)
  const damageMultiplier = ARMOR_CONSTANT_K / (ARMOR_CONSTANT_K + defender.armor);
  
  // Lasketaan vahinko panssarin jälkeen (mutta ei vielä pyöristetä)
  const mitigatedDamage = rawDamage * damageMultiplier;

  // --- UUSI LISÄYS: SATUNNAISVAIHTELU (+/- 10%) ---
  // Math.random() antaa luvun 0.0 - 1.0.
  // Kerrotaan se 0.2:lla (tulos 0.0 - 0.2).
  // Lisätään 0.9 (tulos 0.9 - 1.1).
  const variance = 0.9 + (Math.random() * 0.2);
  
  // Kerrotaan vahinko satunnaisuudella
  const damageWithVariance = mitigatedDamage * variance;
  // ------------------------------------------------

  // 3. Lopullinen vahinko (pyöristys alaspäin, vähintään 1)
  const finalDamage = Math.max(1, Math.floor(damageWithVariance));

  const mitigationPercent = 1 - damageMultiplier;

  return {
    finalDamage,
    isCrit,
    mitigationPercent
  };
};

/**
 * Skaalaa pelaajan statsit tason mukaan.
 * Kaava: Base * Level^1.5
 */
export const getPlayerStats = (
  level: number, 
  equipmentBonus: Partial<CombatStats>
): CombatStats => {
  const baseHp = 100;
  const baseDmg = 10;
  
  // Core Stats Levelin mukaan
  const scaledHp = Math.floor(baseHp + (level * 10)); // Yksinkertaisempi HP kaava aluksi
  // Tai promptin mukainen: const scaledDmg = Math.floor(baseDmg * Math.pow(level, 1.5));
  
  // Tässä esimerkissä käytän hieman loivempaa skaalausta pelattavuuden vuoksi,
  // mutta voit vaihtaa Math.pow(level, 1.5) jos haluat jyrkän nousun.
  const scaledDmg = Math.floor(baseDmg + (level * 2)); 

  return {
    hp: scaledHp + (equipmentBonus.hp || 0),
    maxHp: scaledHp + (equipmentBonus.hp || 0),
    attackDamage: scaledDmg + (equipmentBonus.attackDamage || 0),
    armor: (equipmentBonus.armor || 0), // Pelaajan armor tulee yleensä kamoista
    attackSpeed: 1.0, // Perusnopeus
    critChance: 0.05, // 5% base crit
    critMultiplier: 1.5,
    ...equipmentBonus // Ylikirjoita jos kamoissa on speciaaleja
  };
};

/**
 * Skaalaa vihollisen statsit tason (World ID / Map ID) mukaan.
 * Kaava: Base * 1.12^Level
 */
export const getEnemyStats = (
  baseStats: { hp: number; attack: number }, 
  level: number
): CombatStats => {
  const growthFactor = 1.12; // 12% kasvu per level
  
  const scaledHp = Math.floor(baseStats.hp * Math.pow(growthFactor, level));
  const scaledDmg = Math.floor(baseStats.attack * Math.pow(growthFactor, level));
  
  // Vihollisen armor kasvaa myös hieman levelin myötä
  const scaledArmor = Math.floor(level * 5); 

  return {
    hp: scaledHp,
    maxHp: scaledHp,
    attackDamage: scaledDmg,
    armor: scaledArmor,
    attackSpeed: 0.8, // Viholliset lyövät hieman hitaammin oletuksena
    critChance: 0.05 + (level * 0.005), // Vaarallisemmat viholliset crittaavat useammin
    critMultiplier: 1.5
  };
};