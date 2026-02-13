import type { GameState } from '../types';
import { processSkillTick } from './skillSystem';
import { processCombatTick } from './combatSystem';
import { getSpeedMultiplier } from '../utils/gameUtils';
import { GAME_DATA } from '../data';

export interface OfflineResults {
  secondsPassed: number;
  itemsGained: Record<string, number>;
  xpGained: Record<string, number>;
}

export const calculateOfflineProgress = (state: GameState): { newState: GameState, results: OfflineResults } => {
  const now = Date.now();
  const lastTime = state.lastTimestamp || now;
  const totalSecondsPassed = Math.floor((now - lastTime) / 1000);
  
  // Rajoitetaan simulointi max 12 tuntiin
  const secondsToProcess = Math.min(totalSecondsPassed, 12 * 60 * 60); 

  let currentState = { ...state };
  const itemsBefore = { ...state.inventory };
  const xpBefore = Object.fromEntries(Object.entries(state.skills).map(([k, v]) => [k, v.xp]));

  if (secondsToProcess < 10) {
    return { newState: { ...state, lastTimestamp: now }, results: { secondsPassed: 0, itemsGained: {}, xpGained: {} } };
  }

  // --- LOGIIKKA ---
  if (state.activeAction && state.activeAction.skill !== 'combat') {
    const skill = state.activeAction.skill;
    const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(r => r.id === state.activeAction?.resourceId);
    
    if (resource) {
      const speedMult = getSpeedMultiplier(skill, state.upgrades);
      const baseInterval = resource.interval || 3000;
      const targetTime = Math.max(200, baseInterval / speedMult);
      const totalTicks = Math.floor((secondsToProcess * 1000) / targetTime);

      // Simuloidaan tikit
      const safeTicks = Math.min(totalTicks, 20000);
      for (let i = 0; i < safeTicks; i++) {
        // KORJAUS: Syötetään targetTime toisena argumenttina (deltaTime), 
        // jotta taito valmistuu jokaisella kierroksella.
        const updates = processSkillTick(currentState, targetTime);
        
        if (!updates.activeAction && updates.activeAction !== undefined) {
            break; // Materiaalit loppuivat
        }
        currentState = { ...currentState, ...updates };
      }
    }
  } else if (state.activeAction?.skill === 'combat') {
    // Combat simulaatio (käytetään 1s askellusta offline-ajassa)
    const combatTicks = Math.min(secondsToProcess, 10000); 
    for (let i = 0; i < combatTicks; i++) {
        const updates = processCombatTick(currentState);
        if (!updates.activeAction && updates.activeAction !== undefined) {
            break;
        }
        currentState = { ...currentState, ...updates };
    }
  }

  // --- TULOSTEN LASKENTA ---
  const itemsGained: Record<string, number> = {};
  Object.keys(currentState.inventory).forEach(id => {
    const diff = (currentState.inventory[id] || 0) - (itemsBefore[id] || 0);
    if (diff > 0) itemsGained[id] = diff;
  });

  const xpGained: Record<string, number> = {};
  Object.keys(currentState.skills).forEach(s => {
    const diff = currentState.skills[s as keyof typeof state.skills].xp - (xpBefore[s] || 0);
    if (diff > 0) xpGained[s] = Math.floor(diff);
  });

  return {
    newState: { ...currentState, lastTimestamp: now },
    results: {
      secondsPassed: totalSecondsPassed,
      itemsGained,
      xpGained
    }
  };
};