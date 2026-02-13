import { processSkillTick } from './skillSystem';
import { processCombatTick } from './combatSystem';
import type { GameState, SkillType } from '../types';

/**
 * Määritellään tyyppi offline-yhteenvedolle ilman any-tyyppejä.
 */
export interface OfflineSummary {
  seconds: number;
  xpGained: Partial<Record<SkillType, number>>;
  itemsGained: Record<string, number>;
}

/**
 * OfflineSystem: Laskee edistyksen ajalta, jolloin peli on ollut suljettuna.
 */
export const calculateOfflineProgress = (
  initialState: GameState,
  elapsedSeconds: number
): { updatedState: GameState; summary: OfflineSummary } => {
  // Luodaan kopio tilasta, jota muokataan simuloinnin aikana
  let currentState: GameState = { ...initialState };
  
  // Rajoitetaan offline-aika max 12 tuntiin (43200s) suorituskyvyn vuoksi
  const maxSeconds = 43200;
  const simulatedSeconds = Math.min(elapsedSeconds, maxSeconds);

  // Simuloidaan sekunti kerrallaan
  for (let i = 0; i < simulatedSeconds; i++) {
    if (!currentState.activeAction) break;

    let updates: Partial<GameState> = {};

    if (currentState.activeAction.skill === 'combat') {
      // Offline-taistelu etenee 1000ms (1s) askelissa
      updates = processCombatTick(currentState, 1000);
    } else {
      // Skill-tikitys etenee myös 1000ms askelissa
      updates = processSkillTick(currentState, 1000);
    }

    // Päivitetään simuloitu tila. 
    // TÄRKEÄÄ: Mergetään combatStats syvältä, jotta respawnTimer säilyy!
    currentState = {
      ...currentState,
      ...updates,
      combatStats: updates.combatStats 
        ? { ...currentState.combatStats, ...updates.combatStats } 
        : currentState.combatStats,
      inventory: updates.inventory 
        ? { ...currentState.inventory, ...updates.inventory } 
        : currentState.inventory,
      skills: updates.skills 
        ? { ...currentState.skills, ...updates.skills } 
        : currentState.skills
    };
  }

  // Luodaan yhteenveto erotuksista
  const summary: OfflineSummary = {
    seconds: simulatedSeconds,
    xpGained: calculateXpDifference(initialState.skills, currentState.skills),
    itemsGained: calculateItemDifference(initialState.inventory, currentState.inventory)
  };

  return { updatedState: currentState, summary };
};

/**
 * Laskee XP-eron taitojen välillä
 */
function calculateXpDifference(
  oldSkills: GameState['skills'], 
  newSkills: GameState['skills']
): Partial<Record<SkillType, number>> {
  const diff: Partial<Record<SkillType, number>> = {};
  
  (Object.keys(oldSkills) as SkillType[]).forEach((skillId) => {
    const xpDiff = newSkills[skillId].xp - oldSkills[skillId].xp;
    if (xpDiff > 0) {
      diff[skillId] = xpDiff;
    }
  });
  
  return diff;
}

/**
 * Laskee tavaraerot varaston välillä
 */
function calculateItemDifference(
  oldInv: GameState['inventory'], 
  newInv: GameState['inventory']
): Record<string, number> {
  const diff: Record<string, number> = {};
  
  // Käydään läpi uuden varaston kaikki avaimet
  for (const itemId in newInv) {
    const oldCount = oldInv[itemId] || 0;
    const newCount = newInv[itemId] || 0;
    const countDiff = newCount - oldCount;
    
    if (countDiff > 0) {
      diff[itemId] = countDiff;
    }
  }
  
  return diff;
}