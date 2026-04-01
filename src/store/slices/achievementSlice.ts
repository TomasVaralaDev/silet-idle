import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { DEFAULT_STATE } from "../useGameStore";
import { ACHIEVEMENTS } from "../../data/achievements";
import { calculateXpGain } from "../../utils/gameUtils";
import type { SkillType, RewardEntry } from "../../types";

export interface AchievementSlice {
  unlockedAchievements: string[];
  claimedAchievements: string[];
  claimAchievement: (id: string) => void;
}

/**
 * createAchievementSlice
 * Manages the state and logic for claiming achievements.
 * Evaluates the rewards associated with the achievement and safely injects them
 * into the player's inventory, skills, or cosmetic unlocks.
 */
export const createAchievementSlice: StateCreator<
  FullStoreState,
  [],
  [],
  AchievementSlice
> = (set, get) => ({
  unlockedAchievements: DEFAULT_STATE.unlockedAchievements || [],
  claimedAchievements: DEFAULT_STATE.claimedAchievements || [],

  claimAchievement: (id: string) => {
    const state = get();

    // Validations: Prevent double-claiming and ensure the achievement is actually unlocked
    if (state.claimedAchievements.includes(id)) return;
    if (!state.unlockedAchievements.includes(id)) return;

    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (!achievement) return;

    const rewards = achievement.rewards;
    const updates: Partial<FullStoreState> = {
      claimedAchievements: [...state.claimedAchievements, id],
    };

    // 1. Process Coin Rewards
    if (rewards?.coins) {
      updates.coins = state.coins + rewards.coins;
    }

    // 2. Process Item/Material Rewards
    if (rewards?.items && rewards.items.length > 0) {
      updates.inventory = { ...state.inventory };
      rewards.items.forEach((item: { itemId: string; amount: number }) => {
        updates.inventory![item.itemId] =
          (updates.inventory![item.itemId] || 0) + item.amount;
      });
    }

    // 3. Process Direct XP Rewards (Calculates dynamic level-ups safely)
    if (rewards?.xpMap) {
      updates.skills = { ...state.skills };
      Object.entries(rewards.xpMap).forEach(([skillStr, xpAmount]) => {
        const skill = skillStr as SkillType;
        const amount = xpAmount as number;

        if (updates.skills![skill]) {
          const currentLevel = updates.skills![skill].level;
          const currentXp = updates.skills![skill].xp;

          // Safe calculation ensuring we don't accidentally bypass level caps
          const { level: newLevel, xp: newXp } = calculateXpGain(
            currentLevel,
            currentXp,
            amount,
          );

          updates.skills![skill] = {
            ...updates.skills![skill],
            level: newLevel,
            xp: newXp,
          };

          // Trigger a global UI notification if a level up occurred
          if (newLevel > currentLevel) {
            get().emitEvent(
              "levelUp",
              `${skill.toUpperCase()} reached level ${newLevel}!`,
              "./assets/ui/icon_star.png",
            );
          }
        }
      });
    }

    // 4. Process Cosmetic Rewards (Chat Colors)
    if (rewards?.chatColorId) {
      const currentColors = state.social?.unlockedChatColors || ["default"];
      // Ensure idempotency to prevent duplicating the color array
      if (!currentColors.includes(rewards.chatColorId)) {
        updates.social = {
          ...state.social,
          unlockedChatColors: [...currentColors, rewards.chatColorId],
        };
      }
    }

    // Commit all calculated state changes atomically
    set(updates);

    // Global Notification
    get().emitEvent(
      "success",
      `Claimed reward for: ${achievement.name}`,
      "./assets/ui/icon_achievements.png",
    );

    // 5. Trigger the visual UI Reward Modal
    // Ensures the modal opens even if the only reward was a cosmetic chat color
    if (
      rewards &&
      (rewards.coins || rewards.items || rewards.xpMap || rewards.chatColorId)
    ) {
      const displayRewards: RewardEntry[] = [];

      if (rewards.coins) {
        displayRewards.push({ itemId: "coins", amount: rewards.coins });
      }

      if (rewards.items) {
        displayRewards.push(...rewards.items);
      }

      if (rewards.xpMap) {
        Object.entries(rewards.xpMap).forEach(([skill, xp]) => {
          displayRewards.push({
            itemId: `${skill}_xp`,
            amount: xp as number,
          });
        });
      }

      if (rewards.chatColorId) {
        displayRewards.push({
          itemId: `color_${rewards.chatColorId}`,
          amount: 1, // Visual placeholder required by the modal's prop interface
        });
      }

      get().openRewardModal(`Achievement: ${achievement.name}`, displayRewards);
    }
  },
});
