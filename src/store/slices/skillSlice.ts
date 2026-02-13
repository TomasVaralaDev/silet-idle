import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { DEFAULT_STATE } from '../useGameStore';
import { GAME_DATA } from '../../data';
import { getSpeedMultiplier } from '../../utils/gameUtils';
import type { SkillType, Resource, Ingredient, SkillData, ActiveAction } from '../../types';

export interface SkillSlice {
  skills: Record<SkillType, SkillData>;
  activeAction: ActiveAction | null; // KORJAUS: 'any' vaihdettu tyyppiin
  toggleAction: (skill: SkillType, resourceId: string) => void;
}

export const createSkillSlice: StateCreator<FullStoreState, [], [], SkillSlice> = (set) => ({
  skills: DEFAULT_STATE.skills,
  activeAction: DEFAULT_STATE.activeAction,

  toggleAction: (skill, resourceId) => set((state: FullStoreState) => {
    if (state.activeAction?.resourceId === resourceId) {
      return { activeAction: null };
    }

    const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
      (r: Resource) => r.id === resourceId
    );
    
    if (!resource) return {};

    if (resource.inputs) {
      const canAfford = resource.inputs.every(
        (req: Ingredient) => (state.inventory[req.id] || 0) >= req.count
      );
      
      if (!canAfford) { 
        // Käytetään uutta Event-järjestelmää
        state.emitEvent(
          'warning', 
          `Missing materials for ${resource.name}`, 
          '/assets/ui/icon_warning.png'
        );
        return {}; 
      }
    }

    const speedMult = getSpeedMultiplier(skill, state.upgrades);
    const baseInterval = resource.interval || 3000;
    const finalTargetTime = Math.max(200, baseInterval / speedMult);

    return { 
      activeAction: { 
        skill, 
        resourceId,
        progress: 0,
        targetTime: finalTargetTime
      } 
    } as Partial<FullStoreState>;
  }),
});