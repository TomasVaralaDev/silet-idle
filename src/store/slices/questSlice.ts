import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import type { RewardEntry, SkillType, ActiveQuest } from "../../types";
import {
  rollDailyQuests,
  processQuestProgress,
} from "../../systems/questSystem";
import { calculateXpGain } from "../../utils/gameUtils";

export interface QuestSlice {
  // Päivitetty funktio ottamaan palvelimen reset-aika vastaan
  syncQuestsWithServer: (serverResetTime: number) => void;
  updateQuestProgress: (
    type: "GATHER" | "KILL" | "CRAFT",
    targetId: string,
    amount: number,
  ) => void;
  claimQuestReward: (questId: string) => void;
}

export const createQuestSlice: StateCreator<
  FullStoreState,
  [],
  [],
  QuestSlice
> = (set, get) => ({
  /**
   * Synkronoi päivittäiset tehtävät palvelimen reset-aikataulun kanssa.
   * Arpoo uudet tehtävät vain, jos palvelimen reset-aika on uudempi kuin pelaajan tallennus.
   */
  syncQuestsWithServer: (serverResetTime: number) => {
    const { quests, skills, emitEvent } = get();

    if (!serverResetTime) return;

    //  console.log(
    //    "🔍 [QUEST-SYNC] Tarkistetaan reset: Server:",
    //   "Player:",
    //    quests.lastResetTime,
    //  );

    if (serverResetTime > quests.lastResetTime) {
      ////  "🔥 [QUEST-SYNC] Uusi päivä havaittu! Arvotaan uudet tehtävät.",
      //  );

      // Arvotaan uudet tehtävät pelaajan taitotasojen perusteella
      const newQuests = rollDailyQuests(skills);

      set({
        quests: {
          dailyQuests: newQuests,
          lastResetTime: serverResetTime, // Päivitetään pelaajan reset-aika palvelimen aikaan
        },
      });

      emitEvent(
        "info",
        "New Daily Quests available!",
        "./assets/ui/icon_quest.png",
      );
    } else {
      //   console.log("✅ [QUEST-SYNC] Tehtävät ovat jo ajan tasalla.");
    }
  },

  /**
   * Päivittää aktiivisten tehtävien edistymistä.
   */
  updateQuestProgress: (type, targetId, amount) => {
    const state = get();
    const updatedQuests = processQuestProgress(
      state.quests.dailyQuests,
      type,
      targetId,
      amount,
    );

    // Päivitetään tila vain, jos edistymistä tapahtui
    if (updatedQuests !== state.quests.dailyQuests) {
      set({ quests: { ...state.quests, dailyQuests: updatedQuests } });
    }
  },

  /**
   * Lunastaa tehtävän palkinnon ja päivittää pelaajan resurssit/taidot.
   */
  claimQuestReward: (questId) => {
    const state = get();
    const quest = state.quests.dailyQuests.find(
      (q: ActiveQuest) => q.id === questId,
    );

    if (!quest || !quest.isCompleted || quest.isClaimed) return;

    // --- PALKINTOJEN LASKENTA ---
    const newCoins = state.coins + (quest.reward.coins || 0);
    const newInventory = { ...state.inventory };
    const newSkills = { ...state.skills };

    const modalRewards: RewardEntry[] = [];

    // 1. Kolikot
    if (quest.reward.coins) {
      modalRewards.push({ itemId: "coins", amount: quest.reward.coins });
    }

    // 2. Esineet (Inventory)
    if (quest.reward.items) {
      quest.reward.items.forEach((item: { itemId: string; amount: number }) => {
        newInventory[item.itemId] =
          (newInventory[item.itemId] || 0) + item.amount;
        modalRewards.push({ itemId: item.itemId, amount: item.amount });
      });
    }

    // 3. Kokemuspisteet (XP)
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

    // Päivitetään tehtävälistan tila (merkitään lunastetuksi)
    const updatedQuests = state.quests.dailyQuests.map((q: ActiveQuest) =>
      q.id === questId ? { ...q, isClaimed: true } : q,
    );

    set({
      coins: newCoins,
      inventory: newInventory,
      skills: newSkills,
      quests: { ...state.quests, dailyQuests: updatedQuests },
    });

    // Avataan palkintoikkuna pelaajalle
    get().openRewardModal(`Quest Completed: ${quest.title}`, modalRewards);
  },
});
