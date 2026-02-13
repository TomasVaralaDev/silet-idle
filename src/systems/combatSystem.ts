import { COMBAT_DATA, WORLD_LOOT, getItemDetails } from '../data';
import { getEnemyStats, getPlayerStats, calculateHit } from '../utils/combatMechanics';
import { calculateXpGain, getXpMultiplier, pickWeightedItem } from '../utils/gameUtils';
import type { GameState, Resource, CombatStyle, CombatStats, SkillType } from '../types';

/**
 * CombatSystem: Laskee yhden "tikin" (sekunnin) tapahtumat taistelussa.
 * Puhdas funktio, joka palauttaa muuttuneet tilan osat.
 */
export const processCombatTick = (state: GameState): Partial<GameState & { notification: { message: string; icon: string } | null }> => {
  const { combatStats, activeAction, inventory, skills, equipment, settings, upgrades, equippedFood } = state;

  if (activeAction?.skill !== 'combat' || !combatStats.currentMapId) {
    return {};
  }

  let map = COMBAT_DATA.find(m => m.id === combatStats.currentMapId);
  if (!map) return {};

  const { hp, enemyCurrentHp, maxMapCompleted, respawnTimer, foodTimer, currentMapId: stateMapId, combatLog } = combatStats;
  const currentLog = [...(combatLog || [])];
  
  const addLog = (msg: string) => {
    currentLog.unshift(msg);
    if (currentLog.length > 50) currentLog.splice(50);
  };

  const newInventory = { ...inventory };
  const newSkills = { ...skills };
  let newEquippedFood = equippedFood ? { ...equippedFood } : null;
  let currentHp = hp;
  let currentEnemyHp = enemyCurrentHp;
  let currentMapId = stateMapId;
  let currentMaxMap = maxMapCompleted;

  // --- 1. RESPAWN JA PROGRESSIO ---
  if (respawnTimer > 0) {
    const nextRespawn = respawnTimer - 1;
    if (nextRespawn === 0) {
      if (state.combatSettings.autoProgress) {
        const nextMap = COMBAT_DATA.find(m => m.id === (currentMapId || 0) + 1);
        if (nextMap && (!nextMap.keyRequired || (newInventory[nextMap.keyRequired] || 0) > 0)) {
          currentMapId = nextMap.id;
          map = nextMap;
          addLog(`>> MOVING TO: ${map.name} <<`);
        }
      }
      const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
      return {
        combatStats: { ...combatStats, respawnTimer: 0, enemyCurrentHp: enemyStats.hp, currentMapId, combatLog: currentLog }
      };
    }
    return { combatStats: { ...combatStats, respawnTimer: nextRespawn, combatLog: currentLog } };
  }

  // --- 2. STATSIEN LASKENTA ---
  const weaponItem = equipment.weapon ? getItemDetails(equipment.weapon) as Resource : null;
  const combatStyle: CombatStyle = weaponItem?.combatStyle || 'melee';
  
  const gearStats = (Object.values(equipment) as (string | null)[]).reduce((acc: Partial<CombatStats>, itemId) => {
    if (!itemId) return acc;
    const item = getItemDetails(itemId) as Resource;
    if (item?.stats) {
      acc.attackDamage = (acc.attackDamage || 0) + (item.stats.attack || 0);
      acc.armor = (acc.armor || 0) + (item.stats.defense || 0);
    }
    return acc;
  }, { attackDamage: 0, armor: 0 });

  const playerStats = getPlayerStats(skills, combatStyle, gearStats);
  playerStats.hp = currentHp;
  const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
  enemyStats.hp = currentEnemyHp;

  // --- 3. HYÖKKÄYKSET ---
  const actualPlayerHits = Math.floor(playerStats.attackSpeed) + (Math.random() < (playerStats.attackSpeed % 1) ? 1 : 0);
  for (let i = 0; i < actualPlayerHits; i++) {
    const hit = calculateHit(playerStats, enemyStats);
    currentEnemyHp -= hit.finalDamage;
    addLog(`Player hit: ${hit.finalDamage}${hit.isCrit ? " (CRIT!)" : ""}`);
  }

  if (currentEnemyHp > 0) {
    const actualEnemyHits = Math.floor(enemyStats.attackSpeed) + (Math.random() < (enemyStats.attackSpeed % 1) ? 1 : 0);
    for (let i = 0; i < actualEnemyHits; i++) {
      const hit = calculateHit(enemyStats, playerStats);
      currentHp -= hit.finalDamage;
      addLog(`Enemy hit: ${hit.finalDamage}${hit.isCrit ? " (CRIT!)" : ""}`);
    }

    const maxHp = skills.hitpoints.level * 10;
    const threshold = maxHp * (state.combatSettings.autoEatThreshold / 100);
    if (currentHp <= threshold && newEquippedFood && newEquippedFood.count > 0 && foodTimer === 0) {
      const food = getItemDetails(newEquippedFood.itemId) as Resource;
      if (food?.healing) {
        currentHp = Math.min(maxHp, currentHp + food.healing);
        newEquippedFood.count -= 1;
        if (newEquippedFood.count <= 0) newEquippedFood = null;
        return {
          combatStats: { ...combatStats, hp: currentHp, enemyCurrentHp: currentEnemyHp, foodTimer: 10, combatLog: currentLog },
          equippedFood: newEquippedFood
        };
      }
    }
  }

  // --- 4. KUOLEMAN KÄSITTELY (ENEMY) ---
  if (currentEnemyHp <= 0) {
    addLog(`Enemy Defeated!`);
    
    // XP
    const splitXp = Math.ceil(map.xpReward / 4);
    const combatSkills: SkillType[] = ['hitpoints', 'attack', 'defense', combatStyle];
    
    combatSkills.forEach(s => {
      const targetSkill = s as keyof typeof newSkills;
      const mult = getXpMultiplier(s, upgrades);
      const { level, xp } = calculateXpGain(newSkills[targetSkill].level, newSkills[targetSkill].xp, splitXp * mult);
      newSkills[targetSkill] = { level, xp };
    });

    // Loot
    let notifyData: { message: string, icon: string } | null = null;
    map.drops.forEach(drop => {
      if (Math.random() <= drop.chance) {
        const safe = drop.amount || [1, 1];
        const amount = Math.floor(Math.random() * (safe[1] - safe[0] + 1)) + safe[0];
        newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
        addLog(`Loot: ${amount}x ${getItemDetails(drop.itemId)?.name}`);
      }
    });

    // Rare Loot
    const worldTable = WORLD_LOOT[map.world];
    if (worldTable && Math.random() <= 0.3) {
      const drop = pickWeightedItem(worldTable);
      if (drop) {
        const safe = drop.amount || [1, 1];
        const amount = Math.floor(Math.random() * (safe[1] - safe[0] + 1)) + safe[0];
        newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
        const item = getItemDetails(drop.itemId);
        addLog(`** Rare: ${item?.name} **`);
        if (settings.notifications && (drop.itemId.includes('key') || drop.weight <= 50)) {
          notifyData = { message: `Rare: ${item?.name}`, icon: item?.icon || "" };
        }
      }
    }

    if (map.id > currentMaxMap) currentMaxMap = map.id;

    return {
      inventory: newInventory,
      skills: newSkills,
      equippedFood: newEquippedFood,
      notification: notifyData,
      combatStats: { ...combatStats, hp: currentHp, enemyCurrentHp: 0, respawnTimer: 2, maxMapCompleted: currentMaxMap, combatLog: currentLog }
    };
  }

  // PLAYER DIES
  if (currentHp <= 0) {
    addLog("PLAYER DIED - Returning to base.");
    return {
      activeAction: null,
      combatStats: { ...combatStats, hp: 0, currentMapId: null, enemyCurrentHp: 0, combatLog: currentLog }
    };
  }

  return {
    combatStats: { 
      ...combatStats, 
      hp: currentHp, 
      enemyCurrentHp: currentEnemyHp, 
      foodTimer: Math.max(0, foodTimer - 1), 
      combatLog: currentLog 
    },
    equippedFood: newEquippedFood
  };
};