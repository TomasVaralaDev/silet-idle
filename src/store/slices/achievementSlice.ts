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

    if (state.claimedAchievements.includes(id)) return;
    if (!state.unlockedAchievements.includes(id)) return;

    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (!achievement) return;

    const rewards = achievement.rewards;
    const updates: Partial<FullStoreState> = {
      claimedAchievements: [...state.claimedAchievements, id],
    };

    if (rewards?.coins) {
      updates.coins = state.coins + rewards.coins;
    }

    if (rewards?.items && rewards.items.length > 0) {
      updates.inventory = { ...state.inventory };
      rewards.items.forEach((item: { itemId: string; amount: number }) => {
        updates.inventory![item.itemId] =
          (updates.inventory![item.itemId] || 0) + item.amount;
      });
    }

    if (rewards?.xpMap) {
      updates.skills = { ...state.skills };
      Object.entries(rewards.xpMap).forEach(([skillStr, xpAmount]) => {
        const skill = skillStr as SkillType;
        const amount = xpAmount as number;

        if (updates.skills![skill]) {
          const currentLevel = updates.skills![skill].level;
          const currentXp = updates.skills![skill].xp;

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

          if (newLevel > currentLevel) {
            get().emitEvent(
              "levelUp",
              `${skill.toUpperCase()} reached level ${newLevel}!`,
              "/assets/ui/icon_star.png",
            );
          }
        }
      });
    }

    // UUSI: Chat Color logiikka
    if (rewards?.chatColorId) {
      const currentColors = state.social?.unlockedChatColors || ["default"];
      // Varmistetaan ettei väriä ole jo lisätty
      if (!currentColors.includes(rewards.chatColorId)) {
        updates.social = {
          ...state.social,
          unlockedChatColors: [...currentColors, rewards.chatColorId],
        };
      }
    }

    set(updates);

    get().emitEvent(
      "success",
      `Claimed reward for: ${achievement.name}`,
      "/assets/ui/icon_achievements.png",
    );

    // KORJATTU: Lisätty chatColorId ehtoon, jotta modaali aukeaa myös silloin kun ainoa palkinto on väri
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

      // UUSI: Lisätään väri modaaliin näytettäväksi
      if (rewards.chatColorId) {
        displayRewards.push({
          itemId: `color_${rewards.chatColorId}`,
          amount: 1, // Määrällä ei ole visuaalista merkitystä värille, mutta vaaditaan tyypin vuoksi
        });
      }

      get().openRewardModal(`Achievement: ${achievement.name}`, displayRewards);
    }
  },
});
