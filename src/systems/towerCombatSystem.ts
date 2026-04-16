import {
  getPlayerStats,
  getEnemyStats,
  calculateHit,
} from "../utils/combatMechanics";
import { TOWER_FLOORS } from "../data/tower";
// KORJATTU: Tuodaan getItemById
import { getItemById } from "../utils/itemUtils";
import type {
  GameState,
  TowerCombatStats,
  CombatStyle,
  Resource,
} from "../types";

export const calculateTowerCombatTick = (
  state: GameState,
  tickMs: number,
): Partial<TowerCombatStats> | null => {
  const { combat } = state.tower;
  const { skills, equipment } = state;

  if (!combat.isActive || combat.status !== "fighting" || !combat.floorNumber)
    return null;

  const floorData = TOWER_FLOORS.find(
    (f) => f.floorNumber === combat.floorNumber,
  );
  if (!floorData) return null;

  const newCombat = { ...combat };
  const now = Date.now();

  // Siivotaan vanhat damage pop-upit
  newCombat.damagePopUps = newCombat.damagePopUps.filter(
    (p) => now - p.createdAt < 500,
  );

  // Pelaajan statsit
  // KORJATTU: Käytetään getItemById
  const weaponItem = equipment.weapon
    ? (getItemById(equipment.weapon) as Resource)
    : null;
  const combatStyle: CombatStyle = weaponItem?.combatStyle || "melee";

  const gearStats = (Object.values(equipment) as (string | null)[]).reduce(
    (acc, itemId) => {
      if (!itemId) return acc;
      // KORJATTU: Käytetään getItemById
      const item = getItemById(itemId) as Resource;
      if (item?.stats) {
        acc.damage += item.stats.attack || 0;
        acc.armor += item.stats.defense || 0;
        acc.hpBonus += item.stats.hpBonus || 0;
        acc.critChance += item.stats.critChance || 0;
        if (item.stats.critMulti && item.stats.critMulti > acc.critMulti)
          acc.critMulti = item.stats.critMulti;
        if (item.slot === "weapon" && item.stats.attackSpeed)
          acc.attackSpeed = item.stats.attackSpeed;
      }
      return acc;
    },
    {
      damage: 0,
      armor: 0,
      hpBonus: 0,
      critChance: 0,
      critMulti: 1.5,
      attackSpeed: 2400,
    },
  );

  const playerStats = getPlayerStats(skills, combatStyle, gearStats);
  const enemyStats = getEnemyStats({
    level: floorData.enemy.level,
    currentHp: newCombat.enemyCurrentHp,
    maxHp: floorData.enemy.maxHp,
    attack: floorData.enemy.attack,
  });

  newCombat.playerAttackTimer = Math.max(
    0,
    newCombat.playerAttackTimer - tickMs,
  );
  newCombat.enemyAttackTimer = Math.max(0, newCombat.enemyAttackTimer - tickMs);

  // ⏳ VÄHÄNNETÄÄN AIKAA JA TARKISTETAAN AUTO-DEFEAT
  // Käytetään varmuuden vuoksi nollaa oletuksena, ettei undefined riko laskutoimitusta vanhoilla tallennuksilla
  newCombat.combatTimer = Math.max(0, (newCombat.combatTimer || 0) - tickMs);

  if (newCombat.combatTimer <= 0 && newCombat.status === "fighting") {
    newCombat.status = "defeat";
    newCombat.combatLog = [
      "Time's up! You couldn't defeat the enemy fast enough.",
      ...newCombat.combatLog,
    ].slice(0, 10);
    return newCombat;
  }

  // 1. PELAAJA LYÖ
  if (newCombat.playerAttackTimer <= 0 && newCombat.enemyCurrentHp > 0) {
    const hit = calculateHit(playerStats, enemyStats);
    newCombat.enemyCurrentHp = Math.max(
      0,
      newCombat.enemyCurrentHp - hit.finalDamage,
    );
    newCombat.playerAttackTimer = playerStats.attackSpeed;

    newCombat.damagePopUps.push({
      id: `p_hit_${now}_${Math.random()}`,
      amount: hit.finalDamage,
      isCrit: hit.isCrit,
      type: "enemy",
      createdAt: now,
    });
    newCombat.combatLog = [
      `You hit for ${hit.finalDamage} DMG!`,
      ...newCombat.combatLog,
    ].slice(0, 10);
  }

  // 2. TARKISTETAAN VOITTO
  if (newCombat.enemyCurrentHp <= 0) {
    newCombat.status = "victory";
    newCombat.combatLog = [
      "Victory! The enemy is defeated.",
      ...newCombat.combatLog,
    ].slice(0, 10);
    return newCombat;
  }

  // 3. VIHOLLINEN LYÖ
  if (newCombat.enemyAttackTimer <= 0 && newCombat.playerHp > 0) {
    const hit = calculateHit(enemyStats, playerStats);
    newCombat.playerHp = Math.max(0, newCombat.playerHp - hit.finalDamage);
    newCombat.enemyAttackTimer = enemyStats.attackSpeed;

    newCombat.damagePopUps.push({
      id: `e_hit_${now}_${Math.random()}`,
      amount: hit.finalDamage,
      isCrit: false,
      type: "player",
      createdAt: now,
    });
    newCombat.combatLog = [
      `Enemy hit you for ${hit.finalDamage} DMG!`,
      ...newCombat.combatLog,
    ].slice(0, 10);
  }

  // 4. TARKISTETAAN HÄVIÖ
  if (newCombat.playerHp <= 0) {
    newCombat.status = "defeat";
    newCombat.combatLog = [
      "You were defeated...",
      ...newCombat.combatLog,
    ].slice(0, 10);
    return newCombat;
  }

  return newCombat;
};
