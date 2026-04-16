import {
  getPlayerStats,
  getEnemyStats,
  calculateHit,
} from "../utils/combatMechanics";
import { TOWER_FLOORS } from "../data/tower";
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

  // KORJATTU: Haetaan varusteiden Skill-esine
  const skillItem = equipment.skill
    ? (getItemById(equipment.skill) as Resource)
    : null;
  const skillEffect = skillItem?.skillEffect;

  const weaponItem = equipment.weapon
    ? (getItemById(equipment.weapon) as Resource)
    : null;
  const combatStyle: CombatStyle = weaponItem?.combatStyle || "melee";

  const gearStats = (Object.values(equipment) as (string | null)[]).reduce(
    (acc, itemId) => {
      if (!itemId) return acc;
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

  // Lasketaan maksimi HP (esim. Heal-skilliä varten)
  const playerMaxHp =
    100 + (skills.hitpoints?.level || 1) * 10 + gearStats.hpBonus;

  // AIKAJASTIMET (Attack & Auto-Defeat)
  newCombat.playerAttackTimer = Math.max(
    0,
    newCombat.playerAttackTimer - tickMs,
  );
  newCombat.enemyAttackTimer = Math.max(0, newCombat.enemyAttackTimer - tickMs);
  newCombat.combatTimer = Math.max(0, (newCombat.combatTimer || 0) - tickMs);

  if (newCombat.combatTimer <= 0 && newCombat.status === "fighting") {
    newCombat.status = "defeat";
    newCombat.combatLog = [
      "Time's up! You couldn't defeat the enemy fast enough.",
      ...newCombat.combatLog,
    ].slice(0, 10);
    return newCombat;
  }

  // --- SKILL & DEBUFF TARKISTUKSET ---
  newCombat.skillCooldownTimer = Math.max(
    0,
    (newCombat.skillCooldownTimer || 0) - tickMs,
  );
  newCombat.enemyDebuffs = newCombat.enemyDebuffs || [];

  // Pienennetään debuffien kestoja
  newCombat.enemyDebuffs.forEach((d) => {
    if (d.durationMs !== undefined) d.durationMs -= tickMs;
  });
  // Poistetaan vanhentuneet
  newCombat.enemyDebuffs = newCombat.enemyDebuffs.filter(
    (d) => d.durationMs === undefined || d.durationMs > 0,
  );

  const hasFreeze = newCombat.enemyDebuffs.find((d) => d.name === "freeze");
  const hasPoison = newCombat.enemyDebuffs.find((d) => d.name === "poison");

  // === MANUAL SKILL TRIGGER (Esim. Fireball tai Heal) ===
  if (
    newCombat.manualSkillQueue &&
    skillEffect?.trigger === "cooldown" &&
    newCombat.skillCooldownTimer <= 0
  ) {
    if (skillEffect.damageScaling) {
      // Fireball
      // Oletetaan, että playerStats sisältää total attackin, fallback gear damage
      const baseAtk =
        (playerStats as { attack?: number }).attack || gearStats.damage || 50;
      const bonusDmg = Math.floor(baseAtk * skillEffect.damageScaling);

      newCombat.enemyCurrentHp = Math.max(
        0,
        newCombat.enemyCurrentHp - bonusDmg,
      );
      newCombat.damagePopUps.push({
        id: `skill_dmg_${now}`,
        amount: bonusDmg,
        isCrit: true,
        type: "enemy",
        createdAt: now,
      });
      newCombat.combatLog = [
        `🔥 Cast ${skillItem?.name}! Dealt ${bonusDmg} DMG!`,
        ...newCombat.combatLog,
      ].slice(0, 10);
    }

    if (skillEffect.healPercent) {
      // Heal
      const healAmt = Math.floor(playerMaxHp * skillEffect.healPercent);
      newCombat.playerHp = Math.min(playerMaxHp, newCombat.playerHp + healAmt);
      newCombat.damagePopUps.push({
        id: `skill_heal_${now}`,
        amount: `+${healAmt}`,
        isCrit: false,
        type: "player",
        createdAt: now,
      });
      newCombat.combatLog = [
        `✨ Cast ${skillItem?.name}! Restored ${healAmt} HP!`,
        ...newCombat.combatLog,
      ].slice(0, 10);
    }

    newCombat.skillCooldownTimer = skillEffect.cooldownMs || 10000; // Reset Cooldown
    newCombat.manualSkillQueue = false; // Tyhjennetään jono

    // Pikavoittotarkistus (jos vihollinen kuoli Fireballiin)
    if (newCombat.enemyCurrentHp <= 0) {
      newCombat.status = "victory";
      newCombat.combatLog = [
        "Victory! The enemy is defeated.",
        ...newCombat.combatLog,
      ].slice(0, 10);
      return newCombat;
    }
  }

  // Tyhjennetään jono, vaikka taito ei olisikaan laennut (suoja)
  newCombat.manualSkillQueue = false;

  // 1. PELAAJA LYÖ
  if (newCombat.playerAttackTimer <= 0 && newCombat.enemyCurrentHp > 0) {
    const hit = calculateHit(playerStats, enemyStats);
    let finalDamage = hit.finalDamage;

    // --- Myrkky (Poison) vahinko osuessa ---
    if (hasPoison) {
      const poisonDmg = Math.floor(
        floorData.enemy.maxHp * hasPoison.effectValue,
      );
      finalDamage += poisonDmg;
      newCombat.damagePopUps.push({
        id: `poison_tick_${now}`,
        amount: poisonDmg,
        isCrit: false,
        type: "enemy",
        createdAt: now,
      });
    }

    // --- On-Hit -kyvyt (esim. Freeze ja Poison levitys) ---
    if (skillEffect?.trigger === "on_hit" && skillEffect.procChance) {
      if (Math.random() < skillEffect.procChance && skillEffect.debuff) {
        const existing = newCombat.enemyDebuffs.find(
          (d) => d.name === skillEffect.debuff!.name,
        );
        if (!existing) {
          newCombat.enemyDebuffs.push({ ...skillEffect.debuff });
          newCombat.combatLog = [
            `Target is afflicted with ${skillEffect.debuff.name.toUpperCase()}!`,
            ...newCombat.combatLog,
          ].slice(0, 10);
        } else {
          existing.durationMs = skillEffect.debuff.durationMs; // Virkistää aikarajan
        }
      }
    }

    newCombat.enemyCurrentHp = Math.max(
      0,
      newCombat.enemyCurrentHp - finalDamage,
    );
    newCombat.playerAttackTimer = playerStats.attackSpeed;

    newCombat.damagePopUps.push({
      id: `p_hit_${now}_${Math.random()}`,
      amount: finalDamage,
      isCrit: hit.isCrit,
      type: "enemy",
      createdAt: now,
    });
    newCombat.combatLog = [
      `You hit for ${finalDamage} DMG!`,
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

    // --- Freeze (Jäädytys) hidastaa hyökkäystä ---
    let actualEnemySpeed = enemyStats.attackSpeed;
    if (hasFreeze) {
      // Hidastus: esim. 0.30 tekee nopeudesta 30% hitaamman (aika pitenee)
      actualEnemySpeed = Math.floor(
        actualEnemySpeed * (1 + hasFreeze.effectValue),
      );
    }
    newCombat.enemyAttackTimer = actualEnemySpeed;

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
