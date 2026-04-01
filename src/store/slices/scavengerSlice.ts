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

/**
 * createScavengerSlice
 * Handles the logic for sending background scouts on long-term missions.
 * Generates highly randomized drop tables heavily skewed by mission duration.
 */
export const createScavengerSlice: StateCreator<
  FullStoreState,
  [],
  [],
  ScavengerSlice
> = (set, get) => ({
  startExpedition: (worldId, durationMinutes) => {
    const { scavenger } = get();
    // Prevent deployment if player has exhausted their allowed slots
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
    if (elapsed < expedition.duration) return; // Prevent early claims

    const worldLootTable = WORLD_LOOT[expedition.mapId];
    const newInventory = { ...inventory };

    // Scale drops dynamically: 1 loot roll per real-world minute elapsed
    const minutes = Math.floor(expedition.duration / 1000 / 60);
    const rolls = Math.max(1, minutes);

    const rewardsMap: Record<string, number> = {};
    let coinsGained = 0;

    if (worldLootTable) {
      for (let i = 0; i < rolls; i++) {
        // 1. STANDARD REGIONAL LOOT ROLL
        const result = rollWeightedDrop(worldLootTable);
        if (result) {
          if (result.itemId === "coins") {
            coinsGained += result.amount;
          } else {
            newInventory[result.itemId] =
              (newInventory[result.itemId] || 0) + result.amount;
          }

          // Buffer drops for UI presentation
          rewardsMap[result.itemId] =
            (rewardsMap[result.itemId] || 0) + result.amount;
        }

        // 2. RARE SYSTEM: ANCIENT RUNES
        // Expeditions are the sole source of runes. 0.5% base chance per minute.
        if (Math.random() < 0.005 && RUNES_DATA.length > 0) {
          // Secondary roll determining the tier quality of the spawned rune
          const rarityRoll = Math.random();
          let targetTier = "minor";

          if (rarityRoll < 0.02) {
            targetTier = "legendary"; // 2% chance for highest tier
          } else if (rarityRoll < 0.12) {
            targetTier = "major"; // 10% chance for middle tier
          } else {
            targetTier = "minor"; // 88% chance for basic tier
          }

          const availableRunes = RUNES_DATA.filter((r) =>
            r.id.endsWith(`_${targetTier}`),
          );

          // Fallback preventing errors if filter returns empty
          const pool = availableRunes.length > 0 ? availableRunes : RUNES_DATA;

          const randomRune = pool[Math.floor(Math.random() * pool.length)];
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
      coins: state.coins + coinsGained,
      inventory: newInventory,
      scavenger: {
        ...state.scavenger,
        activeExpeditions: state.scavenger.activeExpeditions.filter(
          (e) => e.id !== expeditionId, // Remove completed mission from tracker
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

  // Retained for interface compliance, logic shifted elsewhere
  processScavengerTick: () => {},
});
