import { processSkillTick } from './skillSystem';
import { processCombatTick } from './combatSystem';
import { calculateXpGain, getSpeedMultiplier } from '../utils/gameUtils';
import { GAME_DATA } from '../data';
import type { GameState, SkillType, Resource } from '../types';

export interface OfflineSummary {
  seconds: number;
  xpGained: Partial<Record<SkillType, number>>;
  itemsGained: Record<string, number>;
}

export const calculateOfflineProgress = (
  initialState: GameState,
  elapsedSeconds: number
): { updatedState: GameState; summary: OfflineSummary } => {
  const maxSeconds = 43200; // 12h
  const simulatedSeconds = Math.min(elapsedSeconds, maxSeconds);
  
  // Tehdään kopio tilasta muokattavaksi
  let currentState: GameState = JSON.parse(JSON.stringify(initialState));

  // TARKISTUS 1: Tarkistetaan suoraan currentState:sta, jotta TypeScript ymmärtää sen olevan olemassa
  if (!currentState.activeAction) {
    return { updatedState: currentState, summary: { seconds: simulatedSeconds, xpGained: {}, itemsGained: {} } };
  }

  // Nyt TypeScript tietää varmasti, ettei tämä ole null
  const { skill, resourceId } = currentState.activeAction;

  // --- BULK LASKENTA (Elämäntaidot / Non-Combat) ---
  if (skill !== 'combat') {
    const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find((r: Resource) => r.id === resourceId);
    
    if (resource) {
      const speedMult = getSpeedMultiplier(skill as SkillType, currentState.upgrades);
      const intervalSeconds = (resource.interval || 3000) / speedMult / 1000;
      const completions = Math.floor(simulatedSeconds / intervalSeconds);
      
      if (completions > 0) {
        const totalXpReward = completions * (resource.xpReward || 0);
        const skillData = currentState.skills[skill as SkillType];
        
        // Päivitetään tila (calculateXpGain hoitaa 99 katon automaattisesti)
        const newSkillData = calculateXpGain(skillData.level, skillData.xp, totalXpReward);
        currentState.skills[skill as SkillType] = newSkillData;
        currentState.inventory[resource.id] = (currentState.inventory[resource.id] || 0) + completions;
        currentState.lastTimestamp = Date.now();

        // PALAUTETAAN TARKKA SUMMA (bulk-laskennassa ei vertailla erotuksia)
        return { 
          updatedState: currentState, 
          summary: { 
            seconds: simulatedSeconds, 
            xpGained: { [skill as SkillType]: totalXpReward }, 
            itemsGained: { [resource.id]: completions } 
          } 
        };
      }
    }
  }

  // --- SIMULAATIO (Combat tai tilanteet joissa bulk epäonnistuu) ---
  const xpAtStart = { ...initialState.skills }; // Tallennetaan alkutilanne vertailua varten

  for (let i = 0; i < simulatedSeconds; i++) {
    if (!currentState.activeAction) break;
    
    // TARKISTUS 2: Vaihdettiin let -> const, kuten ESLint pyysi
    const updates = currentState.activeAction.skill === 'combat' 
      ? processCombatTick(currentState, 1000) 
      : processSkillTick(currentState, 1000);

    currentState = {
      ...currentState,
      ...updates,
      combatStats: updates.combatStats ? { ...currentState.combatStats, ...updates.combatStats } : currentState.combatStats,
      inventory: updates.inventory ? { ...currentState.inventory, ...updates.inventory } : currentState.inventory,
      skills: updates.skills ? { ...currentState.skills, ...updates.skills } : currentState.skills
    };
  }

  return { 
    updatedState: currentState, 
    summary: { 
      seconds: simulatedSeconds, 
      xpGained: calculateXpDifference(xpAtStart, currentState.skills), 
      itemsGained: calculateItemDifference(initialState.inventory, currentState.inventory) 
    } 
  };
};

/**
 * Laskee XP-eron taitojen välillä (Käytetään vain simulaatiossa, esim. Combat)
 */
function calculateXpDifference(oldSkills: GameState['skills'], newSkills: GameState['skills']): Partial<Record<SkillType, number>> {
  const diff: Partial<Record<SkillType, number>> = {};
  (Object.keys(oldSkills) as SkillType[]).forEach((skillId) => {
    const xpDiff = newSkills[skillId].xp - oldSkills[skillId].xp;
    // Jos taso on noussut simulaation aikana, pelkkä xp-erotus näyttää vain jämän.
    // Tämän takia elämäntaidoille käytetään yllä olevaa Bulk-laskentaa, joka on 100% tarkka.
    if (xpDiff > 0) diff[skillId] = xpDiff;
  });
  return diff;
}

/**
 * Laskee tavaraerot varaston välillä (Käytetään vain simulaatiossa)
 */
function calculateItemDifference(oldInv: GameState['inventory'], newInv: GameState['inventory']): Record<string, number> {
  const diff: Record<string, number> = {};
  for (const itemId in newInv) {
    const countDiff = (newInv[itemId] || 0) - (oldInv[itemId] || 0);
    if (countDiff > 0) diff[itemId] = countDiff;
  }
  return diff;
}