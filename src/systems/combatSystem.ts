import { COMBAT_DATA, getItemDetails } from '../data';
import { getEnemyStats, getPlayerStats, calculateHit } from '../utils/combatMechanics';
import { calculateXpGain, getXpMultiplier } from '../utils/gameUtils';
import type { GameState, Resource, CombatStyle, CombatState, SkillType } from '../types';

interface CombatStatsInternal {
  attackDamage: number;
  armor: number;
}

interface ExtendedCombatState extends CombatState {
  attackTimer?: number;
}

export const processCombatTick = (state: GameState, tickMs: number): Partial<GameState> => {
  const { combatStats, activeAction, inventory, skills, equipment, upgrades } = state;

  if (activeAction?.skill !== 'combat' || !combatStats.currentMapId) return {};

  const map = COMBAT_DATA.find(m => m.id === combatStats.currentMapId);
  if (!map) return {};

  const currentLog = [...(combatStats.combatLog || [])];
  const addLog = (msg: string) => {
    currentLog.unshift(msg);
    if (currentLog.length > 20) currentLog.splice(20);
  };

  // 1. RESPAWN-AJASTIN
  if (combatStats.respawnTimer > 0) {
    const nextTimer = Math.max(0, combatStats.respawnTimer - tickMs);
    if (nextTimer === 0) {
      const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
      return {
        combatStats: { 
          ...combatStats, 
          respawnTimer: 0, 
          enemyCurrentHp: enemyStats.hp, 
          combatLog: currentLog 
        }
      };
    }
    return { combatStats: { ...combatStats, respawnTimer: nextTimer, combatLog: currentLog } };
  }

  // 2. HYÖKKÄYSAJASTIN (1000ms sykli)
  const extendedStats = combatStats as ExtendedCombatState;
  let attackTimer = extendedStats.attackTimer || 0;
  attackTimer -= tickMs;

  if (attackTimer > 0) {
    return { combatStats: { ...combatStats, attackTimer } as ExtendedCombatState };
  }

  // Jos timer loppui, suoritetaan iskut
  attackTimer = 1000;
  let currentEnemyHp = combatStats.enemyCurrentHp;
  let currentHp = combatStats.hp; // Tämä on 'let', koska pelaaja voi ottaa vahinkoa
  const newInventory = { ...inventory };
  const newSkills = { ...skills };

  if (currentEnemyHp <= 0) return { combatStats: { ...combatStats, respawnTimer: 2000 } };

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

  // PELAAJA LYÖ
  const playerHit = calculateHit(playerStats, enemyStats);
  currentEnemyHp = Math.max(0, currentEnemyHp - playerHit.finalDamage);
  addLog(`Hit ${map.enemyName}: ${playerHit.finalDamage}${playerHit.isCrit ? " (CRIT!)" : ""}`);

  // VIHULLINEN LYÖ (vain jos se jäi henkiin)
  if (currentEnemyHp > 0) {
    const enemyHit = calculateHit(enemyStats, playerStats);
    currentHp = Math.max(0, currentHp - enemyHit.finalDamage); // Tässä tapahtuu uudelleensijoitus
    addLog(`Take: ${enemyHit.finalDamage}`);
  } else {
    // Jos vihollinen kuoli, hoidetaan XP ja respawn
    addLog(`Victory!`);
    const skillList: SkillType[] = ['hitpoints', 'attack', 'defense', combatStyle];
    
    skillList.forEach(s => {
      const mult = getXpMultiplier(s, upgrades);
      const res = calculateXpGain(newSkills[s].level, newSkills[s].xp, Math.ceil(map.xpReward / 4) * mult);
      newSkills[s] = { level: res.level, xp: res.xp };
    });

    return {
      inventory: newInventory,
      skills: newSkills,
      combatStats: { 
        ...combatStats, 
        hp: currentHp, 
        enemyCurrentHp: 0, 
        respawnTimer: 2000, 
        attackTimer: 0,
        combatLog: currentLog 
      } as ExtendedCombatState
    };
  }

  // TARKISTETAAN PELAAJAN KUOLEMA
  if (currentHp <= 0) {
    addLog("K.O. - Retreating...");
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
      attackTimer,
      combatLog: currentLog 
    } as ExtendedCombatState
  };
};