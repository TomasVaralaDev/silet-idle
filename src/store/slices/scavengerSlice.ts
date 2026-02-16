import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import type { Expedition, RewardEntry } from '../../types'; // Varmista RewardEntry
import { rollWeightedDrop } from '../../utils/loot';
import { WORLD_LOOT } from '../../data/worlds';

export interface ScavengerSlice {
  startExpedition: (worldId: number, durationMinutes: number) => void;
  claimExpedition: (expeditionId: string) => void;
  cancelExpedition: (expeditionId: string) => void;
  processScavengerTick: () => void;
}

export const createScavengerSlice: StateCreator<FullStoreState, [], [], ScavengerSlice> = (set, get) => ({
  
  startExpedition: (worldId, durationMinutes) => {
    // ... (sama kuin aiemmin) ...
    const { scavenger } = get();
    if (scavenger.activeExpeditions.length >= scavenger.unlockedSlots) return;

    const newExpedition: Expedition = {
      id: `exp_${Date.now()}_${Math.random()}`,
      mapId: worldId,
      startTime: Date.now(),
      duration: durationMinutes * 60 * 1000, 
    };

    set((state) => ({
      scavenger: {
        ...state.scavenger,
        activeExpeditions: [...state.scavenger.activeExpeditions, newExpedition]
      }
    }));
  },

  claimExpedition: (expeditionId) => {
    const { scavenger, inventory, openRewardModal } = get(); // Haetaan openRewardModal storesta
    const expedition = scavenger.activeExpeditions.find(e => e.id === expeditionId);
    if (!expedition) return;

    const elapsed = Date.now() - expedition.startTime;
    if (elapsed < expedition.duration) return;

    const worldLootTable = WORLD_LOOT[expedition.mapId];
    const newInventory = { ...inventory };
    const minutes = Math.floor(expedition.duration / 1000 / 60);
    const rolls = Math.max(1, minutes); 

    // Kerätään lootit listaan modaalia varten
    const rewardsMap: Record<string, number> = {};

    if (worldLootTable) {
      for (let i = 0; i < rolls; i++) {
        const result = rollWeightedDrop(worldLootTable);
        if (result) {
          // Lisätään inventaarioon
          newInventory[result.itemId] = (newInventory[result.itemId] || 0) + result.amount;
          
          // Lisätään palkintolistaan (yhdistetään samat itemit)
          rewardsMap[result.itemId] = (rewardsMap[result.itemId] || 0) + result.amount;
        }
      }
    }

    // Muutetaan Map -> Array modaalia varten
    const rewardEntries: RewardEntry[] = Object.entries(rewardsMap).map(([itemId, amount]) => ({
      itemId,
      amount
    }));

    // Päivitetään tila
    set((state) => ({
      inventory: newInventory,
      scavenger: {
        ...state.scavenger,
        activeExpeditions: state.scavenger.activeExpeditions.filter(e => e.id !== expeditionId)
      }
    }));

    // AVATAAN MODAALI
    if (rewardEntries.length > 0) {
      openRewardModal(`Expedition W${expedition.mapId} Complete`, rewardEntries);
    } else {
      // Jos tyhjä expedition (harvinaista mutta mahdollista)
      openRewardModal(`Expedition W${expedition.mapId} Failed`, []);
    }
  },

  cancelExpedition: (expeditionId) => {
    set((state) => ({
      scavenger: {
        ...state.scavenger,
        activeExpeditions: state.scavenger.activeExpeditions.filter(e => e.id !== expeditionId)
      }
    }));
  },

  processScavengerTick: () => {}
});