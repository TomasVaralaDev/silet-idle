import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { DEFAULT_STATE } from '../useGameStore';
// KORJAUS: Tuodaan ScavengerState suoraan tyyppeistä circular dependency -virheen välttämiseksi
import type { Expedition, ScavengerState } from '../../types';

export interface ScavengerSlice {
  scavenger: ScavengerState;
  startExpedition: (worldId: number, durationMinutes: number) => void;
  claimExpedition: (expeditionId: string) => void;
  cancelExpedition: (expeditionId: string) => void;
}

export const createScavengerSlice: StateCreator<FullStoreState, [], [], ScavengerSlice> = (set) => ({
  scavenger: DEFAULT_STATE.scavenger,

  startExpedition: (worldId, durationMinutes) => set((state: FullStoreState) => {
    if (state.scavenger.activeExpeditions.length >= state.scavenger.unlockedSlots) return {};
    
    const newExp: Expedition = { 
      id: Date.now().toString(), 
      mapId: worldId, 
      startTime: Date.now(), 
      duration: durationMinutes * 60 * 1000, 
      completed: false 
    };

    return { 
      scavenger: { 
        ...state.scavenger, 
        activeExpeditions: [...state.scavenger.activeExpeditions, newExp] 
      } 
    } as Partial<FullStoreState>;
  }),

  claimExpedition: (expeditionId) => set((state: FullStoreState) => {
    const expedition = state.scavenger.activeExpeditions.find((e: Expedition) => e.id === expeditionId);
    if (!expedition || !expedition.completed) return {};
    
    return { 
      scavenger: { 
        ...state.scavenger, 
        activeExpeditions: state.scavenger.activeExpeditions.filter((e: Expedition) => e.id !== expeditionId) 
      } 
    } as Partial<FullStoreState>;
  }),

  cancelExpedition: (id) => set((state: FullStoreState) => ({
    scavenger: { 
      ...state.scavenger, 
      activeExpeditions: state.scavenger.activeExpeditions.filter((e: Expedition) => e.id !== id) 
    }
  }) as Partial<FullStoreState>),
});