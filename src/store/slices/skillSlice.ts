import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { DEFAULT_STATE } from '../useGameStore';
import { GAME_DATA } from '../../data';
// KORJAUS: Tuodaan SkillData suoraan circular dependency -virheen välttämiseksi
import type { SkillType, ActiveAction, Resource, Ingredient, SkillData } from '../../types';

export interface SkillSlice {
  skills: Record<SkillType, SkillData>;
  activeAction: ActiveAction | null;
  toggleAction: (skill: SkillType, resourceId: string) => void;
}

export const createSkillSlice: StateCreator<FullStoreState, [], [], SkillSlice> = (set) => ({
  skills: DEFAULT_STATE.skills,
  activeAction: DEFAULT_STATE.activeAction,

  toggleAction: (skill, resourceId) => set((state: FullStoreState) => {
    // Jos klikataan jo aktiivista toimintoa, pysäytetään se
    if (state.activeAction?.resourceId === resourceId) {
      return { activeAction: null };
    }

    // Etsitään resurssin tiedot datasta
    const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find((r: Resource) => r.id === resourceId);
    
    // Tarkistetaan raaka-aineet jos kyseessä on crafting/smithing/cooking
    if (resource?.inputs) {
      const canAfford = resource.inputs.every((req: Ingredient) => (state.inventory[req.id] || 0) >= req.count);
      if (!canAfford) { 
        alert("Not enough materials!"); 
        return {}; 
      }
    }

    return { 
      activeAction: { skill, resourceId } 
    } as Partial<FullStoreState>;
  }),
});