import { GAME_DATA } from '../data';
import { calculateXpGain, getXpMultiplier } from '../utils/gameUtils';
import type { GameState, Resource, SkillType, Ingredient } from '../types';

export const processSkillTick = (state: GameState): Partial<GameState> => {
  const { activeAction, inventory, skills, upgrades } = state;

  if (!activeAction || activeAction.skill === 'combat') return {};

  const skill = activeAction.skill as SkillType;
  const resourceId = activeAction.resourceId;
  
  // Etsitään resurssi (varmistetaan case-insensitive haku varmuuden vuoksi)
  const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
    (r: Resource) => r.id === resourceId || r.name === resourceId
  );
  
  if (!resource) return {};

  const newInventory = { ...inventory };
  const newSkills = { ...skills };

  // 1. Materiaalien tarkistus (Production)
  if (resource.inputs && resource.inputs.length > 0) {
    const canAfford = resource.inputs.every((req: Ingredient) => (newInventory[req.id] || 0) >= req.count);
    if (!canAfford) return { activeAction: null };
    
    resource.inputs.forEach((req: Ingredient) => {
      newInventory[req.id] -= req.count;
      if (newInventory[req.id] <= 0) delete newInventory[req.id];
    });
  }

  // 2. Palkinnot
  newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;

  // 3. XP-laskenta
  // Varmistetaan että kerroin on vähintään 1 (base)
  const xpMult = Math.max(1, getXpMultiplier(skill, upgrades));
  const baseXP = resource.xpReward ?? 0;

  const { level, xp } = calculateXpGain(
    newSkills[skill].level, 
    newSkills[skill].xp, 
    baseXP * xpMult
  );
  
  newSkills[skill] = { level, xp };

  return {
    inventory: newInventory,
    skills: newSkills
  };
};