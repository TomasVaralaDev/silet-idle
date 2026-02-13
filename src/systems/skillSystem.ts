import { GAME_DATA } from '../data';
import { calculateXpGain, getXpMultiplier } from '../utils/gameUtils';
import type { GameState, Resource, SkillType, Ingredient } from '../types';

/**
 * Laskee taitojen edistymisen.
 * @param state Nykyinen pelitila
 * @param deltaTime Aika millisekunteina edellisestä päivityksestä (esim. 100ms)
 */
export const processSkillTick = (state: GameState, deltaTime: number): Partial<GameState> => {
  const { activeAction, inventory, skills, upgrades } = state;

  // Varmistetaan että toiminto on käynnissä ja se on taitopohjainen
  if (!activeAction || activeAction.skill === 'combat') return {};

  // 1. PÄIVITETÄÄN EDISTYMINEN
  const newProgress = (activeAction.progress || 0) + deltaTime;
  
  // Jos tavoiteaikaa ei ole vielä saavutettu, palautetaan vain päivitetty progress
  if (newProgress < activeAction.targetTime) {
    return {
      activeAction: { ...activeAction, progress: newProgress }
    };
  }

  // 2. TAITO VALMISTUI (Yksi sykli täynnä)
  const skill = activeAction.skill as SkillType;
  const resourceId = activeAction.resourceId;
  
  const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
    (r: Resource) => r.id === resourceId
  );
  
  if (!resource) return { activeAction: null };

  const newInventory = { ...inventory };
  const newSkills = { ...skills };

  // 3. MATERIAALITARKISTUS (Production: Smithing, Cooking, jne.)
  if (resource.inputs && resource.inputs.length > 0) {
    const canAfford = resource.inputs.every((req: Ingredient) => (newInventory[req.id] || 0) >= req.count);
    
    if (!canAfford) {
      // Pysäytetään toiminto, jos raaka-aineet loppuvat
      return { activeAction: null };
    }
    
    // Kulutetaan raaka-aineet
    resource.inputs.forEach((req: Ingredient) => {
      newInventory[req.id] -= req.count;
      if (newInventory[req.id] <= 0) delete newInventory[req.id];
    });
  }

  // 4. PALKINNOT (Loot & XP)
  newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;

  const xpMult = Math.max(1, getXpMultiplier(skill, upgrades));
  const baseXP = resource.xpReward ?? 0;

  const currentSkillData = newSkills[skill];
  const { level, xp } = calculateXpGain(
    currentSkillData.level, 
    currentSkillData.xp, 
    baseXP * xpMult
  );
  
  newSkills[skill] = { level, xp };

  // 5. NOLLATAAN PROGRESS JA JATKETAAN
  // (Käytetään moduloa, jotta ylimääräinen aika ei valu hukkaan)
  return {
    inventory: newInventory,
    skills: newSkills,
    activeAction: { 
      ...activeAction, 
      progress: newProgress % activeAction.targetTime 
    }
  };
};