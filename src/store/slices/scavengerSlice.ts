import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import type { Expedition, RewardEntry } from "../../types";
import { rollWeightedDrop } from "../../utils/loot";
import { WORLD_LOOT, RUNES_DATA } from "../../data";

export interface ScavengerSlice {
  startExpedition: (worldId: number, durationMinutes: number) => void;
  claimExpedition: (expeditionId: string) => void;
  cancelExpedition: (expeditionId: string) => void;
  processScavengerTick: () => void;
}

export const createScavengerSlice: StateCreator<
  FullStoreState,
  [],
  [],
  ScavengerSlice
> = (set, get) => ({
  startExpedition: (worldId, durationMinutes) => {
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
        activeExpeditions: [
          ...state.scavenger.activeExpeditions,
          newExpedition,
        ],
      },
    }));
  },

  claimExpedition: (expeditionId) => {
    const { scavenger, inventory, openRewardModal } = get();
    const expedition = scavenger.activeExpeditions.find(
      (e) => e.id === expeditionId,
    );
    if (!expedition) return;

    const elapsed = Date.now() - expedition.startTime;
    if (elapsed < expedition.duration) return;

    const worldLootTable = WORLD_LOOT[expedition.mapId];
    const newInventory = { ...inventory };
    const minutes = Math.floor(expedition.duration / 1000 / 60);
    const rolls = Math.max(1, minutes);

    const rewardsMap: Record<string, number> = {};

    if (worldLootTable) {
      for (let i = 0; i < rolls; i++) {
        // 1. Normaali maailman lootti
        const result = rollWeightedDrop(worldLootTable);
        if (result) {
          newInventory[result.itemId] =
            (newInventory[result.itemId] || 0) + result.amount;
          rewardsMap[result.itemId] =
            (rewardsMap[result.itemId] || 0) + result.amount;
        }

        // 2. --- HARVINAINEN RUNE DROP ---
        // Laskettu 0.5% mahdollisuuteen per minuutti (0.005)
        // 60min expeditionilla saat keskimäärin 0.3 runea (eli joka kolmas tunti)
        if (Math.random() < 0.005 && RUNES_DATA.length > 0) {
          const randomRune =
            RUNES_DATA[Math.floor(Math.random() * RUNES_DATA.length)];
          const runeId = randomRune.id;

          newInventory[runeId] = (newInventory[runeId] || 0) + 1;
          rewardsMap[runeId] = (rewardsMap[runeId] || 0) + 1;
        }
      }
    }

    const rewardEntries: RewardEntry[] = Object.entries(rewardsMap).map(
      ([itemId, amount]) => ({
        itemId,
        amount,
      }),
    );

    set((state) => ({
      inventory: newInventory,
      scavenger: {
        ...state.scavenger,
        activeExpeditions: state.scavenger.activeExpeditions.filter(
          (e) => e.id !== expeditionId,
        ),
      },
    }));

    if (rewardEntries.length > 0) {
      openRewardModal(
        `Expedition W${expedition.mapId} Complete`,
        rewardEntries,
      );
    } else {
      openRewardModal(`Expedition W${expedition.mapId} Finished`, []);
    }
  },

  cancelExpedition: (expeditionId) => {
    set((state) => ({
      scavenger: {
        ...state.scavenger,
        activeExpeditions: state.scavenger.activeExpeditions.filter(
          (e) => e.id !== expeditionId,
        ),
      },
    }));
  },

  processScavengerTick: () => {},
});
