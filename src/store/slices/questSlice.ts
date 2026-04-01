import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import type { RewardEntry, SkillType, ActiveQuest } from "../../types";
import {
  rollDailyQuests,
  processQuestProgress,
} from "../../systems/questSystem";
import { calculateXpGain } from "../../utils/gameUtils";

export interface QuestSlice {
  syncQuestsWithServer: (serverResetTime: number) => void;
  updateQuestProgress: (
    type: "GATHER" | "KILL" | "CRAFT",
    targetId: string,
    amount: number,
  ) => void;
  claimQuestReward: (questId: string) => void;
}

/**
 * createQuestSlice
 * Manages the logic for daily quests, including generation, tracking, and claiming.
 */
export const createQuestSlice: StateCreator<
  FullStoreState,
  [],
  [],
  QuestSlice
> = (set, get) => ({
  /**
   * syncQuestsWithServer
   * Executed on initial login. Compares the global server timestamp with the player's
   * local save to determine if the midnight wipe has occurred.
   */
  syncQuestsWithServer: (serverResetTime: number) => {
    const { quests, skills, emitEvent } = get();

    if (!serverResetTime) return;

    if (serverResetTime > quests.lastResetTime) {
      // The day has rolled over. Generate 3 new quests tailored to player levels.
      const newQuests = rollDailyQuests(skills);

      set({
        quests: {
          dailyQuests: newQuests,
          lastResetTime: serverResetTime, // Sync local clock
        },
      });

      emitEvent(
        "info",
        "New Daily Quests available!",
        "./assets/ui/icon_quest.png",
      );
    }
  },

  /**
   * updateQuestProgress
   * Dispatched continuously during gameplay by the skill and combat systems.
   * Modifies the local progress integer without querying the database.
   */
  updateQuestProgress: (type, targetId, amount) => {
    const state = get();
    const updatedQuests = processQuestProgress(
      state.quests.dailyQuests,
      type,
      targetId,
      amount,
    );

    // Strict equality check optimizes React render loops
    if (updatedQuests !== state.quests.dailyQuests) {
      set({ quests: { ...state.quests, dailyQuests: updatedQuests } });
    }
  },

  /**
   * claimQuestReward
   * Marks a finished quest as claimed and parses the complex reward object into local state variables.
   */
  claimQuestReward: (questId) => {
    const state = get();
    const quest = state.quests.dailyQuests.find(
      (q: ActiveQuest) => q.id === questId,
    );

    if (!quest || !quest.isCompleted || quest.isClaimed) return;

    // --- PARSE AND APPLY REWARDS ---
    const newCoins = state.coins + (quest.reward.coins || 0);
    const newInventory = { ...state.inventory };
    const newSkills = { ...state.skills };

    const modalRewards: RewardEntry[] = [];

    // 1. Generic Currency
    if (quest.reward.coins) {
      modalRewards.push({ itemId: "coins", amount: quest.reward.coins });
    }

    // 2. Physical Item Injections
    if (quest.reward.items) {
      quest.reward.items.forEach((item: { itemId: string; amount: number }) => {
        newInventory[item.itemId] =
          (newInventory[item.itemId] || 0) + item.amount;
        modalRewards.push({ itemId: item.itemId, amount: item.amount });
      });
    }

    // 3. Base Experience Injection
    if (quest.reward.xpMap) {
      Object.entries(quest.reward.xpMap).forEach(([skill, xp]) => {
        const s = skill as SkillType;
        const currentData = newSkills[s] || { level: 1, xp: 0 };
        const result = calculateXpGain(
          currentData.level,
          currentData.xp,
          xp as number,
        );
        newSkills[s] = { level: result.level, xp: result.xp };
      });
    }

    // Flag the object to prevent duplicate claims
    const updatedQuests = state.quests.dailyQuests.map((q: ActiveQuest) =>
      q.id === questId ? { ...q, isClaimed: true } : q,
    );

    set({
      coins: newCoins,
      inventory: newInventory,
      skills: newSkills,
      quests: { ...state.quests, dailyQuests: updatedQuests },
    });

    get().openRewardModal(`Quest Completed: ${quest.title}`, modalRewards);
  },
});
