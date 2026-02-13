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
  const { combatStats, activeAction, inventory, skills, equipment, upgrades, combatSettings } = state;

  if (activeAction?.skill !== 'combat' || !combatStats.currentMapId) return {};

  const map = COMBAT_DATA.find(m => m.id === combatStats.currentMapId);
  if (!map) return {};

  const currentLog = [...(combatStats.combatLog || [])];
  const addLog = (msg: string) => {
    currentLog.unshift(msg);
    if (currentLog.length > 20) currentLog.splice(20);
  };

  const extendedStats = combatStats as ExtendedCombatState;
  const newInventory = { ...inventory };

  // --- RESPAWN JA AVAIMEN KULUTUS ---
  if (combatStats.respawnTimer > 0) {
    const nextTimer = Math.max(0, combatStats.respawnTimer - tickMs);
    
    if (nextTimer === 0) {
      const currentMapNow = COMBAT_DATA.find(m => m.id === combatStats.currentMapId) || map;

      // Jos tappelet Bossia uudestaan, tarkista ja vie uusi avain
      if (currentMapNow.isBoss && currentMapNow.keyRequired) {
        const keyCount = newInventory[currentMapNow.keyRequired] || 0;
        if (keyCount < 1) {
          addLog(`Out of keys! Combat stopped.`);
          return {
            activeAction: null,
            enemy: null,
            combatStats: { ...combatStats, currentMapId: null, respawnTimer: 0, combatLog: currentLog }
          };
        }
        newInventory[currentMapNow.keyRequired]--;
        addLog(`Used 1x ${getItemDetails(currentMapNow.keyRequired)?.name || 'Boss Key'}`);
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
        inventory: newInventory,
        enemy: newEnemy,
        combatStats: { ...combatStats, respawnTimer: 0, enemyCurrentHp: enemyStats.hp, attackTimer: 1000, combatLog: currentLog } as ExtendedCombatState
      };
    }
    return { combatStats: { ...combatStats, respawnTimer: nextTimer, combatLog: currentLog } as ExtendedCombatState };
  }

  // --- ATTACK TIMER ---
  let attackTimer = extendedStats.attackTimer || 0;
  if (attackTimer > 0) {
    return { combatStats: { ...combatStats, attackTimer: Math.max(0, attackTimer - tickMs) } as ExtendedCombatState };
  }

  // --- BATTLE ---
  attackTimer = 1000;
  let currentEnemyHp = combatStats.enemyCurrentHp;
  let currentHp = combatStats.hp;
  const newSkills = { ...skills };

  if (currentEnemyHp <= 0) return { combatStats: { ...combatStats, respawnTimer: 2000, enemyCurrentHp: 0 } as ExtendedCombatState };

  const weaponItem = equipment.weapon ? getItemDetails(equipment.weapon) as Resource : null;
  const combatStyle: CombatStyle = weaponItem?.combatStyle || 'melee';
  
  const gearStats = (Object.values(equipment) as (string | null)[]).reduce((acc: CombatStatsInternal, itemId) => {
    if (!itemId) return acc;
    const item = getItemDetails(itemId) as Resource;
    if (item?.stats) {
      acc.attackDamage += (item.stats.attack || 0);
      acc.armor += (item.stats.defense || 0);
    }
    return acc;
  }, { attackDamage: 0, armor: 0 });

  const playerStats = getPlayerStats(skills, combatStyle, gearStats as unknown as CombatStatsInternal);
  const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);

  const playerHit = calculateHit(playerStats, enemyStats);
  currentEnemyHp = Math.max(0, currentEnemyHp - playerHit.finalDamage);
  addLog(`Hit ${map.enemyName}: ${playerHit.finalDamage}${playerHit.isCrit ? " (CRIT!)" : ""}`);

  // --- VICTORY & AUTO-PROGRESS AVAIMELLA ---
  if (currentEnemyHp <= 0) {
    addLog(`Victory!`);
    
    // XP
    const skillList: SkillType[] = ['hitpoints', 'attack', 'defense', combatStyle];
    skillList.forEach(s => {
      const mult = getXpMultiplier(s, upgrades);
      const res = calculateXpGain(newSkills[s].level, newSkills[s].xp, Math.ceil(map.xpReward / 4) * mult);
      newSkills[s] = { level: res.level, xp: res.xp };
    });

    // Loot
    const dropResult = rollWeightedDrop(map.drops);
    if (dropResult) {
      const { itemId, amount } = dropResult;
      newInventory[itemId] = (newInventory[itemId] || 0) + amount;
      addLog(`Loot: ${amount}x ${getItemDetails(itemId)?.name || itemId}`);
    }

    const newMaxMapCompleted = Math.max(combatStats.maxMapCompleted, map.id);
    let nextMapId = combatStats.currentMapId;
    
    if (combatSettings.autoProgress) {
      const nextMap = COMBAT_DATA.find(m => m.id === map.id + 1);
      if (nextMap) {
        // TARKISTETAAN AVAIN AUTO-PROGRESSIA VARTEN
        const hasKey = !nextMap.keyRequired || (newInventory[nextMap.keyRequired] || 0) > 0;
        
        if (nextMap.isBoss && !hasKey) {
            addLog(`Stopped: ${getItemDetails(nextMap.keyRequired || '')?.name || 'Key'} required!`);
        } else {
            // Jos siirrytään bossiin, kulutetaan sen avain heti
            if (nextMap.isBoss && nextMap.keyRequired) {
                newInventory[nextMap.keyRequired]--;
                addLog(`Auto-advancing: Used 1x ${getItemDetails(nextMap.keyRequired)?.name}`);
            }
            nextMapId = nextMap.id;
        }
      }
    }

    return {
      inventory: newInventory,
      skills: newSkills,
      enemy: null, 
      combatStats: { 
        ...combatStats, 
        hp: currentHp, 
        enemyCurrentHp: 0, 
        respawnTimer: 2000, 
        attackTimer: 0,
        combatLog: currentLog,
        maxMapCompleted: newMaxMapCompleted,
        currentMapId: nextMapId
      } as ExtendedCombatState
    };
  }

  // Enemy turn
  const enemyHit = calculateHit(enemyStats, playerStats);
  currentHp = Math.max(0, currentHp - enemyHit.finalDamage);
  addLog(`Take: ${enemyHit.finalDamage}`);

  if (currentHp <= 0) {
    addLog("K.O. - Retreating...");
    return {
      activeAction: null,
      enemy: null,
      combatStats: { ...combatStats, hp: 0, currentMapId: null, enemyCurrentHp: 0, combatLog: currentLog }
    };
  }

  return {
    combatStats: { ...combatStats, hp: currentHp, enemyCurrentHp: currentEnemyHp, attackTimer, combatLog: currentLog } as ExtendedCombatState
  };
};