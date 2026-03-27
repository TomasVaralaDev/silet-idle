import { COMBAT_DATA, getItemDetails } from "../data";
import {
  getEnemyStats,
  getPlayerStats,
  calculateHit,
} from "../utils/combatMechanics";
import { calculateXpGain, getXpMultiplier } from "../utils/gameUtils";
import { rollWeightedDrop } from "../utils/loot";
import type {
  GameState,
  Resource,
  CombatStyle,
  SkillType,
  Enemy,
  CombatState,
} from "../types";
import { useGameStore } from "../store/useGameStore";

const DEFAULT_ATTACK_SPEED = 2400;

export const processCombatTick = (
  state: GameState,
  tickMs: number,
): Partial<GameState> => {
  const {
    combatStats,
    activeAction,
    inventory,
    skills,
    equipment,
    equippedFood,
    upgrades,
    combatSettings,
    coins,
  } = state;

  if (activeAction?.skill !== "combat" || !combatStats.currentMapId) return {};

  const map = COMBAT_DATA.find((m) => m.id === combatStats.currentMapId);
  if (!map) return {};

  const currentLog = [...(combatStats.combatLog || [])];
  const addLog = (msg: string) => {
    currentLog.unshift(msg);
    if (currentLog.length > 50) currentLog.splice(50);
  };

  const extendedStats = { ...combatStats } as CombatState;
  const newInventory = { ...inventory };
  let newEquippedFood = equippedFood ? { ...equippedFood } : null;
  let newCoins = coins || 0;

  // Cleanup old damage pop-ups (> 500ms)
  const now = Date.now();
  extendedStats.damagePopUps = (extendedStats.damagePopUps || []).filter(
    (p) => now - p.createdAt < 500,
  );

  const cleanInventory = (inv: Record<string, number>) => {
    const cleaned = { ...inv };
    Object.keys(cleaned).forEach((k) => {
      if (cleaned[k] <= 0) delete cleaned[k];
    });
    return cleaned;
  };

  // 1. GATHER EQUIPMENT STATS
  const gearStats = (Object.values(equipment) as (string | null)[]).reduce(
    (acc, itemId) => {
      if (!itemId) return acc;
      const item = getItemDetails(itemId) as Resource;
      if (item?.stats) {
        acc.damage += item.stats.attack || 0;
        acc.armor += item.stats.defense || 0;
        acc.hpBonus += item.stats.hpBonus || 0;
        acc.critChance += item.stats.critChance || 0;
        if (item.stats.critMulti && item.stats.critMulti > acc.critMulti) {
          acc.critMulti = item.stats.critMulti;
        }
        if (item.slot === "weapon" && item.stats.attackSpeed) {
          acc.attackSpeed = item.stats.attackSpeed;
        }
      }
      return acc;
    },
    {
      damage: 0,
      armor: 0,
      hpBonus: 0,
      critChance: 0,
      critMulti: 1.5,
      attackSpeed: DEFAULT_ATTACK_SPEED,
    },
  );

  // 2. HEALTH & AUTO-EAT LOGIC
  const currentHpLevel = skills.hitpoints?.level || 1;
  const maxHp = 100 + currentHpLevel * 10 + gearStats.hpBonus;

  let pHP = Math.min(maxHp, extendedStats.hp);
  extendedStats.hp = pHP;

  extendedStats.foodTimer = Math.max(
    0,
    (extendedStats.foodTimer || 0) - tickMs,
  );

  const hpPercent = (pHP / maxHp) * 100;
  const threshold = combatSettings.autoEatThreshold || 0;

  if (
    newEquippedFood &&
    pHP > 0 &&
    pHP < maxHp &&
    hpPercent <= threshold &&
    extendedStats.foodTimer <= 0
  ) {
    const foodItem = getItemDetails(newEquippedFood.itemId);
    if (foodItem && foodItem.healing) {
      const oldHp = pHP;
      pHP = Math.min(maxHp, pHP + foodItem.healing);
      extendedStats.hp = pHP;
      extendedStats.foodTimer = 10000;
      newEquippedFood.count -= 1;

      extendedStats.damagePopUps.push({
        id: `heal_${now}`,
        amount: `+${pHP - oldHp}`,
        isCrit: false,
        type: "player",
        createdAt: now,
      });

      if (newEquippedFood.count <= 0) {
        newEquippedFood = null;
        addLog(`Consumed last ${foodItem.name}! (10s CD)`);
      } else {
        addLog(`Healed +${pHP - oldHp} HP. Potion on cooldown (10s).`);
      }
    }
  }

  // 3. RESPAWN LOGIC
  if (extendedStats.respawnTimer > 0) {
    const nextTimer = Math.max(0, extendedStats.respawnTimer - tickMs);
    if (nextTimer === 0) {
      const currentMapNow =
        COMBAT_DATA.find((m) => m.id === extendedStats.currentMapId) || map;

      if (currentMapNow.isBoss && currentMapNow.keyRequired) {
        const keyCount = newInventory[currentMapNow.keyRequired] || 0;
        if (keyCount < 1) {
          addLog(`Out of keys! Combat stopped.`);
          return {
            activeAction: null,
            enemy: null,
            coins: newCoins,
            combatStats: {
              ...extendedStats,
              hp: pHP,
              currentMapId: null,
              respawnTimer: 0,
              combatLog: currentLog,
            },
            equippedFood: newEquippedFood,
            inventory: cleanInventory(newInventory),
          };
        }
        newInventory[currentMapNow.keyRequired]--;
      }

      const enemyStatsInit = getEnemyStats({
        attack: currentMapNow.enemyAttack,
        level: currentMapNow.id,
        maxHp: currentMapNow.enemyHp,
        currentHp: currentMapNow.enemyHp,
      });

      const newEnemy: Enemy = {
        id: `enemy_${currentMapNow.id}_${Date.now()}`,
        name: currentMapNow.enemyName,
        icon: currentMapNow.image || "",
        maxHp: currentMapNow.enemyHp,
        currentHp: enemyStatsInit.hp,
        level: currentMapNow.id,
        attack: currentMapNow.enemyAttack,
        defense: Math.floor(currentMapNow.enemyAttack * 0.1),
        xpReward: currentMapNow.xpReward,
      };

      return {
        inventory: cleanInventory(newInventory),
        enemy: newEnemy,
        equippedFood: newEquippedFood,
        coins: newCoins,
        combatStats: {
          ...extendedStats,
          hp: pHP,
          respawnTimer: 0,
          enemyCurrentHp: enemyStatsInit.hp,
          playerAttackTimer: Math.min(1000, gearStats.attackSpeed),
          enemyAttackTimer: Math.min(1500, enemyStatsInit.attackSpeed),
          combatLog: currentLog,
        },
      };
    }
    return {
      combatStats: {
        ...extendedStats,
        hp: pHP,
        respawnTimer: nextTimer,
        combatLog: currentLog,
      },
      coins: newCoins,
      equippedFood: newEquippedFood,
      inventory: cleanInventory(newInventory),
    };
  }

  // 4. COMBAT EXECUTION
  extendedStats.playerAttackTimer = Math.max(
    0,
    (extendedStats.playerAttackTimer || 0) - tickMs,
  );
  extendedStats.enemyAttackTimer = Math.max(
    0,
    (extendedStats.enemyAttackTimer || 0) - tickMs,
  );

  let currentEnemyHp = extendedStats.enemyCurrentHp;
  const newSkills = JSON.parse(JSON.stringify(skills)) as GameState["skills"];

  const weaponItem = equipment.weapon
    ? (getItemDetails(equipment.weapon) as Resource)
    : null;
  const combatStyle: CombatStyle = weaponItem?.combatStyle || "melee";

  const playerStats = getPlayerStats(skills, combatStyle, gearStats);
  const enemyStats = getEnemyStats({
    level: map.id,
    currentHp: currentEnemyHp,
    maxHp: map.enemyHp,
    attack: map.enemyAttack,
  });

  // PLAYER STRIKES ENEMY
  if (extendedStats.playerAttackTimer <= 0 && currentEnemyHp > 0) {
    const playerHit = calculateHit(playerStats, enemyStats);
    currentEnemyHp = Math.max(0, currentEnemyHp - playerHit.finalDamage);
    extendedStats.playerAttackTimer = playerStats.attackSpeed;

    if (playerHit.finalDamage > 0) {
      extendedStats.damagePopUps.push({
        id: `p_hit_${now}_${Math.random()}`,
        amount: playerHit.finalDamage,
        isCrit: playerHit.isCrit,
        type: "enemy",
        createdAt: now,
      });
      addLog(
        `Hit ${map.enemyName} for ${playerHit.finalDamage} DMG${playerHit.isCrit ? " (Critical!)" : ""}`,
      );
    } else {
      extendedStats.damagePopUps.push({
        id: `p_miss_${now}`,
        amount: "MISS",
        isCrit: false,
        type: "enemy",
        createdAt: now,
      });
    }
  }

  // ENEMY DEFEATED -> LOOT & XP
  if (currentEnemyHp <= 0) {
    addLog(`Victory! Defeated ${map.enemyName}.`);
    const safeXpReward = map.xpReward || 1;
    const skillList: SkillType[] = [
      "hitpoints",
      "attack",
      "defense",
      combatStyle,
    ];

    skillList.forEach((s) => {
      if (!newSkills[s]) newSkills[s] = { level: 1, xp: 0 };
      const mult = getXpMultiplier(s, upgrades);
      const rawReward = s === "hitpoints" ? safeXpReward * 0.4 : safeXpReward;
      const res = calculateXpGain(
        newSkills[s].level,
        newSkills[s].xp,
        rawReward * mult,
      );
      newSkills[s].level = res.level;
      newSkills[s].xp = res.xp;
    });

    const dropResult = rollWeightedDrop(map.drops);
    if (dropResult) {
      if (dropResult.itemId === "coins") {
        newCoins += dropResult.amount;
        addLog(`Loot: Acquired ${dropResult.amount} coins`);
      } else {
        newInventory[dropResult.itemId] =
          (newInventory[dropResult.itemId] || 0) + dropResult.amount;
        const droppedItem = getItemDetails(dropResult.itemId);
        if (droppedItem)
          addLog(`Loot: Acquired ${dropResult.amount}x ${droppedItem.name}`);
      }
    }

    const store = useGameStore.getState();
    store.updateQuestProgress("KILL", map.id.toString(), 1);

    const newMaxMapCompleted = Math.max(extendedStats.maxMapCompleted, map.id);

    let nextMapId: number | null = extendedStats.currentMapId;
    let nextActiveAction: GameState["activeAction"] = activeAction;
    let nextRespawnTimer = 2000;
    let nextDamagePopUps = extendedStats.damagePopUps;

    // Handle Automation Settings
    if (combatSettings.autoRetreat) {
      // 1-Kill Farming: Automatically stop combat cleanly after victory
      nextMapId = null;
      nextActiveAction = null;
      nextRespawnTimer = 0; // CLEAR TIMER SO UI REMOVES BADGE
      nextDamagePopUps = []; // CLEAR FLOATING NUMBERS
      addLog("Auto-Retreat successful. Returning to camp.");
    } else if (combatSettings.autoProgress) {
      // Auto Push: Proceed to next level if available
      const nextMap = COMBAT_DATA.find((m) => m.id === map.id + 1);
      if (
        nextMap &&
        (!nextMap.isBoss || (newInventory[nextMap.keyRequired || ""] || 0) > 0)
      ) {
        if (nextMap.isBoss && nextMap.keyRequired)
          newInventory[nextMap.keyRequired]--;
        nextMapId = nextMap.id;
      }
    }

    return {
      activeAction: nextActiveAction,
      inventory: cleanInventory(newInventory),
      skills: newSkills,
      enemy: null,
      coins: newCoins,
      equippedFood: newEquippedFood,
      combatStats: {
        ...extendedStats,
        hp: pHP,
        enemyCurrentHp: 0,
        respawnTimer: nextRespawnTimer,
        playerAttackTimer: 0,
        enemyAttackTimer: 0,
        combatLog: currentLog,
        maxMapCompleted: newMaxMapCompleted,
        currentMapId: nextMapId,
        damagePopUps: nextDamagePopUps,
      },
    };
  }

  // ENEMY STRIKES PLAYER
  if (extendedStats.enemyAttackTimer <= 0 && pHP > 0) {
    const enemyHit = calculateHit(enemyStats, playerStats);
    pHP = Math.max(0, pHP - enemyHit.finalDamage);
    extendedStats.enemyAttackTimer = enemyStats.attackSpeed;

    if (enemyHit.finalDamage > 0) {
      extendedStats.damagePopUps.push({
        id: `e_hit_${now}_${Math.random()}`,
        amount: enemyHit.finalDamage,
        isCrit: false,
        type: "player",
        createdAt: now,
      });

      let logMsg = `Took ${enemyHit.finalDamage} DMG from ${map.enemyName}`;
      if (enemyHit.mitigationPercent > 0)
        logMsg += ` (${enemyHit.mitigationPercent}% mitigated)`;
      addLog(logMsg);
    } else {
      extendedStats.damagePopUps.push({
        id: `e_miss_${now}`,
        amount: "BLOCK",
        isCrit: false,
        type: "player",
        createdAt: now,
      });
      addLog(`${map.enemyName}'s attack was fully blocked!`);
    }
  }

  // DEATH PENALTY
  if (pHP <= 0) {
    addLog("Defeated! Returning to safety. 1 min to heal up...");
    return {
      activeAction: null,
      enemy: null,
      coins: newCoins,
      combatStats: {
        ...extendedStats,
        hp: 0,
        currentMapId: null,
        enemyCurrentHp: 0,
        playerAttackTimer: 0,
        enemyAttackTimer: 0,
        combatLog: currentLog,
        cooldownUntil: Date.now() + 60000,
        damagePopUps: [],
        cooldownReason: "death",
        respawnTimer: 0, // CLEAR ON DEATH AS WELL
      },
      equippedFood: newEquippedFood,
      inventory: cleanInventory(newInventory),
    };
  }

  // NORMAL STATE (Combat continues)
  return {
    inventory: cleanInventory(newInventory),
    equippedFood: newEquippedFood,
    coins: newCoins,
    combatStats: {
      ...extendedStats,
      hp: pHP,
      enemyCurrentHp: currentEnemyHp,
      combatLog: currentLog,
    },
  };
};
