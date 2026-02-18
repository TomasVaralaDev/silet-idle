import { COMBAT_DATA, getItemDetails } from '../data';
import { getEnemyStats, getPlayerStats, calculateHit } from '../utils/combatMechanics';
import { calculateXpGain, getXpMultiplier } from '../utils/gameUtils';
import { rollWeightedDrop } from '../utils/loot'; 
import type { GameState, Resource, CombatStyle, CombatState, SkillType, Enemy } from '../types';

interface CombatStatsInternal {
  attackDamage: number;
  armor: number;
}

interface ExtendedCombatState extends CombatState {
  attackTimer?: number;
}

export const processCombatTick = (state: GameState, tickMs: number): Partial<GameState> => {
  const { combatStats, activeAction, inventory, skills, equipment, equippedFood, upgrades, combatSettings } = state;

  if (activeAction?.skill !== 'combat' || !combatStats.currentMapId) return {};

  const map = COMBAT_DATA.find(m => m.id === combatStats.currentMapId);
  if (!map) return {};

  const currentLog = [...(combatStats.combatLog || [])];
  const addLog = (msg: string) => {
    currentLog.unshift(msg);
    if (currentLog.length > 30) currentLog.splice(30);
  };

  const extendedStats = { ...combatStats } as ExtendedCombatState;
  const newInventory = { ...inventory };
  let newEquippedFood = equippedFood ? { ...equippedFood } : null;

  // ------------------------------------------------------------------
  // APUFUNKTIO: INVENTORYN SIIVOUS
  // ------------------------------------------------------------------
  const cleanInventory = (inv: Record<string, number>) => {
    const cleaned = { ...inv };
    Object.keys(cleaned).forEach(k => {
      if (cleaned[k] <= 0) delete cleaned[k];
    });
    return cleaned;
  };

  // ------------------------------------------------------------------
  // 1. AUTO-EAT LOGIIKKA (HEALING)
  // ------------------------------------------------------------------
  let bonusHp = 0;
  Object.values(equipment).forEach(itemId => {
    if (itemId) {
      const item = getItemDetails(itemId);
      if (item && item.stats) {
        const itemStats = item.stats as Record<string, number | undefined>;
        if (itemStats.hp) bonusHp += itemStats.hp;
      }
    }
  });
  const maxHp = 100 + (skills.hitpoints.level * 10) + bonusHp;

  extendedStats.foodTimer = Math.max(0, (extendedStats.foodTimer || 0) - tickMs);
  let pHP = extendedStats.hp;

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
      const actualHeal = pHP - oldHp;

      extendedStats.hp = pHP; 
      extendedStats.foodTimer = 3000; 

      newEquippedFood.count -= 1;
      if (newEquippedFood.count <= 0) {
        newEquippedFood = null;
        addLog(`Consumed last ${foodItem.name}!`);
      } else {
        addLog(`Healed +${actualHeal} HP (${foodItem.name})`);
      }
    }
  }

  // ------------------------------------------------------------------
  // 2. RESPAWN JA TAUKO-LOGIIKKA
  // ------------------------------------------------------------------
  if (extendedStats.respawnTimer > 0) {
    const nextTimer = Math.max(0, extendedStats.respawnTimer - tickMs);
    
    if (nextTimer === 0) {
      const currentMapNow = COMBAT_DATA.find(m => m.id === extendedStats.currentMapId) || map;

      if (currentMapNow.isBoss && currentMapNow.keyRequired) {
        const keyCount = newInventory[currentMapNow.keyRequired] || 0;
        if (keyCount < 1) {
          addLog(`Out of keys! Combat stopped.`);
          return {
            activeAction: null,
            enemy: null,
            combatStats: { ...extendedStats, hp: pHP, currentMapId: null, respawnTimer: 0, combatLog: currentLog },
            equippedFood: newEquippedFood,
            inventory: cleanInventory(newInventory)
          };
        }
        
        newInventory[currentMapNow.keyRequired]--;
        addLog(`Used 1x ${getItemDetails(currentMapNow.keyRequired)?.name}`);
      }

      const enemyStats = getEnemyStats({ hp: currentMapNow.enemyHp, attack: currentMapNow.enemyAttack }, currentMapNow.id);
      
      const newEnemy: Enemy = {
        id: `enemy_${currentMapNow.id}_${Date.now()}`,
        name: currentMapNow.enemyName,
        icon: currentMapNow.image || '', 
        maxHp: currentMapNow.enemyHp,
        currentHp: enemyStats.hp,
        level: currentMapNow.id,
        attack: currentMapNow.enemyAttack,
        defense: Math.floor(currentMapNow.enemyAttack * 0.1),
        xpReward: currentMapNow.xpReward
      };

      return {
        inventory: cleanInventory(newInventory),
        enemy: newEnemy,
        equippedFood: newEquippedFood,
        combatStats: { ...extendedStats, hp: pHP, respawnTimer: 0, enemyCurrentHp: enemyStats.hp, attackTimer: 1000, combatLog: currentLog }
      };
    }
    return { 
      combatStats: { ...extendedStats, hp: pHP, respawnTimer: nextTimer, combatLog: currentLog },
      equippedFood: newEquippedFood,
      inventory: cleanInventory(newInventory)
    };
  }

  if ((extendedStats.attackTimer || 0) > 0) {
    return { 
      combatStats: { ...extendedStats, hp: pHP, attackTimer: Math.max(0, (extendedStats.attackTimer || 0) - tickMs), combatLog: currentLog },
      equippedFood: newEquippedFood,
      inventory: cleanInventory(newInventory)
    };
  }

  // ------------------------------------------------------------------
  // 3. TAISTELU
  // ------------------------------------------------------------------
  extendedStats.attackTimer = 1000;
  let currentEnemyHp = extendedStats.enemyCurrentHp;
  const newSkills = { ...skills };

  if (currentEnemyHp <= 0) {
    return { 
      combatStats: { ...extendedStats, hp: pHP, respawnTimer: 2000, enemyCurrentHp: 0, combatLog: currentLog },
      equippedFood: newEquippedFood,
      inventory: cleanInventory(newInventory)
    };
  }

  const gearStats = (Object.values(equipment) as (string | null)[]).reduce((acc: CombatStatsInternal, itemId) => {
    if (!itemId) return acc;
    const item = getItemDetails(itemId) as Resource;
    if (item?.stats) {
      acc.attackDamage += (item.stats.attack || 0);
      acc.armor += (item.stats.defense || 0);
    }
    return acc;
  }, { attackDamage: 0, armor: 0 });

  const weaponItem = equipment.weapon ? getItemDetails(equipment.weapon) as Resource : null;
  const combatStyle: CombatStyle = weaponItem?.combatStyle || 'melee';
  const playerStats = getPlayerStats(skills, combatStyle, gearStats as unknown as CombatStatsInternal);
  const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);

  const playerHit = calculateHit(playerStats, enemyStats);
  currentEnemyHp = Math.max(0, currentEnemyHp - playerHit.finalDamage);
  addLog(`Hit ${map.enemyName}: ${playerHit.finalDamage}${playerHit.isCrit ? "!" : ""}`);

  if (currentEnemyHp <= 0) {
    addLog(`Victory over ${map.enemyName}!`);
    
    const skillList: SkillType[] = ['hitpoints', 'attack', 'defense', combatStyle];
    skillList.forEach(s => {
      const mult = getXpMultiplier(s, upgrades);
      const res = calculateXpGain(newSkills[s].level, newSkills[s].xp, Math.ceil(map.xpReward / 4) * mult);
      newSkills[s] = { level: res.level, xp: res.xp };
    });

    const dropResult = rollWeightedDrop(map.drops);
    if (dropResult) {
      const { itemId, amount } = dropResult;
      newInventory[itemId] = (newInventory[itemId] || 0) + amount;
      addLog(`Loot: ${amount}x ${getItemDetails(itemId)?.name || itemId}`);
    }

    const newMaxMapCompleted = Math.max(extendedStats.maxMapCompleted, map.id);
    let nextMapId = extendedStats.currentMapId;
    
    if (combatSettings.autoProgress) {
      const nextMap = COMBAT_DATA.find(m => m.id === map.id + 1);
      if (nextMap) {
        const hasKey = !nextMap.keyRequired || (newInventory[nextMap.keyRequired] || 0) > 0;
        if (nextMap.isBoss && !hasKey) {
          addLog(`Next: Key required!`);
        } else {
          if (nextMap.isBoss && nextMap.keyRequired) {
            newInventory[nextMap.keyRequired]--;
          }
          nextMapId = nextMap.id;
        }
      }
    }

    return {
      inventory: cleanInventory(newInventory),
      skills: newSkills,
      enemy: null, 
      equippedFood: newEquippedFood,
      combatStats: { 
        ...extendedStats, 
        hp: pHP, 
        enemyCurrentHp: 0, 
        respawnTimer: 2000, 
        attackTimer: 0,
        combatLog: currentLog,
        maxMapCompleted: newMaxMapCompleted,
        currentMapId: nextMapId
      }
    };
  }

  const enemyHit = calculateHit(enemyStats, playerStats);
  pHP = Math.max(0, pHP - enemyHit.finalDamage);
  
  if (enemyHit.finalDamage > 0) {
    addLog(`${map.enemyName} hit: ${enemyHit.finalDamage}`);
  } else {
    addLog(`${map.enemyName} missed!`);
  }

  if (pHP <= 0) {
    addLog("Defeated! Returning to safety.");
    return {
      activeAction: null,
      enemy: null,
      combatStats: { ...extendedStats, hp: 0, currentMapId: null, enemyCurrentHp: 0, combatLog: currentLog },
      equippedFood: newEquippedFood,
      inventory: cleanInventory(newInventory)
    };
  }

  return {
    inventory: cleanInventory(newInventory),
    equippedFood: newEquippedFood,
    combatStats: { 
      ...extendedStats, 
      hp: pHP, 
      enemyCurrentHp: currentEnemyHp, 
      combatLog: currentLog 
    }
  };
};