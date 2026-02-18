import { GAME_DATA } from '../data';
import { calculateXpGain, getXpMultiplier } from '../utils/gameUtils';
import type { GameState, Resource, SkillType, Ingredient } from '../types';

/**
 * Laskee taitojen edistymisen ja hoitaa materiaalien kulutuksen.
 */
export const processSkillTick = (state: GameState, deltaTime: number): Partial<GameState> => {
  const { activeAction, inventory, skills, upgrades } = state;

  if (!activeAction || activeAction.skill === 'combat') return {};

  const newProgress = (activeAction.progress || 0) + deltaTime;
  
  if (newProgress < activeAction.targetTime) {
    return {
      activeAction: { ...activeAction, progress: newProgress }
    };
  }

  const skill = activeAction.skill as SkillType;
  const resourceId = activeAction.resourceId;
  
  const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
    (r: Resource) => r.id === resourceId
  );
  
  if (!resource) return { activeAction: null };

  const newInventory = { ...inventory };
  const newSkills = { ...skills };

  // 1. MATERIAALITARKISTUS (Smithing, Cooking, Alchemy jne.)
  if (resource.inputs && resource.inputs.length > 0) {
    const canAfford = resource.inputs.every((req: Ingredient) => (newInventory[req.id] || 0) >= req.count);
    
    if (!canAfford) {
      return { activeAction: null }; 
    }
    
    // KULUTETAAN RAAKA-AINEET
    resource.inputs.forEach((req: Ingredient) => {
      newInventory[req.id] -= req.count;
    });
  }

  // 2. PALKINNOT
  newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;

  // ------------------------------------------------------------------
  // VARMUUSSIIVOUS: Poistetaan kaikki nollat inventorysta ennen palautusta
  // ------------------------------------------------------------------
  Object.keys(newInventory).forEach(key => {
    if (newInventory[key] <= 0) {
      delete newInventory[key];
    }
  });

  const xpMult = Math.max(1, getXpMultiplier(skill, upgrades));
  const baseXP = resource.xpReward ?? 0;

  const currentSkillData = newSkills[skill];
  const { level, xp } = calculateXpGain(
    currentSkillData.level, 
    currentSkillData.xp, 
    baseXP * xpMult
  );
  
  newSkills[skill] = { level, xp };

  return {
    inventory: newInventory,
    skills: newSkills,
    activeAction: { 
      ...activeAction, 
      progress: newProgress % activeAction.targetTime 
    }
  };
};