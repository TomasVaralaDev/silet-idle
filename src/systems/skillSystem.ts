import { GAME_DATA, getItemDetails } from '../data';
import { calculateXpGain, getXpMultiplier } from '../utils/gameUtils';
import type { GameState, Resource, SkillType, Ingredient } from '../types';

/**
 * Laskee taitojen edistymisen ja hoitaa materiaalien kulutuksen.
 * Sisältää tuen nopeus- ja XP-runeille kaikille elämäntaidoille.
 */
export const processSkillTick = (state: GameState, deltaTime: number): Partial<GameState> => {
  const { activeAction, inventory, skills, upgrades, equipment } = state;

  if (!activeAction || activeAction.skill === 'combat') return {};

  const skill = activeAction.skill as SkillType;

  // --- 1. RUNE BONUKSET (SPEED & XP) ---
  let speedBonus = 0;
  let runeXpBonus = 0;

  if (equipment.rune) {
    const runeItem = getItemDetails(equipment.rune);
    if (runeItem?.skillModifiers) {
      // Haetaan dynaamisesti oikea modifier-avain (esim. "miningSpeed" tai "miningXp")
      const speedKey = `${skill}Speed` as keyof typeof runeItem.skillModifiers;
      const xpKey = `${skill}Xp` as keyof typeof runeItem.skillModifiers;

      speedBonus = runeItem.skillModifiers[speedKey] || 0;
      runeXpBonus = runeItem.skillModifiers[xpKey] || 0;
    }
  }

  // --- 2. EDISTYMISEN LASKENTA (SPEED) ---
  const bonusMultiplier = 1 + speedBonus;
  const newProgress = (activeAction.progress || 0) + (deltaTime * bonusMultiplier);
  
  if (newProgress < activeAction.targetTime) {
    return {
      activeAction: { ...activeAction, progress: newProgress }
    };
  }

  // --- 3. TOIMINNON VALMISTUMINEN ---
  const resourceId = activeAction.resourceId;
  const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
    (r: Resource) => r.id === resourceId
  );
  
  if (!resource) return { activeAction: null };

  const newInventory = { ...inventory };
  const newSkills = { ...skills };

  // A) Materiaalitarkistus
  if (resource.inputs && resource.inputs.length > 0) {
    const canAfford = resource.inputs.every((req: Ingredient) => (newInventory[req.id] || 0) >= req.count);
    
    if (!canAfford) {
      return { activeAction: null }; 
    }
    
    resource.inputs.forEach((req: Ingredient) => {
      newInventory[req.id] -= req.count;
    });
  }

  // B) Palkinnon lisääminen
  newInventory[resource.id] = (newInventory[resource.id] || 0) + 1;

  // Siivotaan nollat inventorysta
  Object.keys(newInventory).forEach(key => {
    if (newInventory[key] <= 0) {
      delete newInventory[key];
    }
  });

  // --- 4. XP JA LEVEL UP (XP RUNE) ---
  // Yhdistetään perus XP-multiplikaattori ja runesta saatu bonus
  const xpMult = Math.max(1, getXpMultiplier(skill, upgrades)) + runeXpBonus;
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