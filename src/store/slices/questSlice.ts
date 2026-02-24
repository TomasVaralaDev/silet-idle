import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import type { RewardEntry, SkillType, ActiveQuest } from '../../types';
import { rollDailyQuests, processQuestProgress, shouldResetQuests } from '../../systems/questSystem';
import { calculateXpGain } from '../../utils/gameUtils';

export interface QuestSlice {
  checkDailyReset: () => void;
  updateQuestProgress: (type: 'GATHER' | 'KILL' | 'CRAFT', targetId: string, amount: number) => void;
  claimQuestReward: (questId: string) => void;
}

export const createQuestSlice: StateCreator<FullStoreState, [], [], QuestSlice> = (set, get) => ({
  
  checkDailyReset: () => {
    const state = get();
    if (shouldResetQuests(state.quests.lastResetTime)) {
      set({
        quests: {
          dailyQuests: rollDailyQuests(state.skills),
          lastResetTime: Date.now()
        }
      });
      get().emitEvent('info', 'New Daily Quests available!', '/assets/ui/quest_icon.png');
    }
  },

  updateQuestProgress: (type, targetId, amount) => {
    const state = get();
    const updatedQuests = processQuestProgress(state.quests.dailyQuests, type, targetId, amount);
    
    // Vain jos array muuttui (joku progress kasvoi), päivitetään tila
    if (updatedQuests !== state.quests.dailyQuests) {
      set({ quests: { ...state.quests, dailyQuests: updatedQuests } });
    }
  },

  claimQuestReward: (questId) => {
    const state = get();
    const quest = state.quests.dailyQuests.find((q: ActiveQuest) => q.id === questId);
    
    if (!quest || !quest.isCompleted || quest.isClaimed) return;

    // --- PALKINTOJEN LASKENTA ---
    const newCoins = state.coins + (quest.reward.coins || 0);
    const newInventory = { ...state.inventory };
    const newSkills = { ...state.skills };

    const modalRewards: RewardEntry[] = [];

    // Rahat
    if (quest.reward.coins) {
      modalRewards.push({ itemId: 'coins', amount: quest.reward.coins });
    }

    // Itemit
    if (quest.reward.items) {
      quest.reward.items.forEach((item: { itemId: string; amount: number }) => {
        newInventory[item.itemId] = (newInventory[item.itemId] || 0) + item.amount;
        modalRewards.push({ itemId: item.itemId, amount: item.amount });
      });
    }

    // XP (Skaalataan oikein käyttäen utils-funktiota)
    if (quest.reward.xpMap) {
      Object.entries(quest.reward.xpMap).forEach(([skill, xp]) => {
        const s = skill as SkillType;
        const currentData = newSkills[s] || { level: 1, xp: 0 };
        const result = calculateXpGain(currentData.level, currentData.xp, xp as number);
        newSkills[s] = { level: result.level, xp: result.xp };
      });
    }

    // Päivitetään questin tila
    const updatedQuests = state.quests.dailyQuests.map((q: ActiveQuest) => 
      q.id === questId ? { ...q, isClaimed: true } : q
    );

    set({
      coins: newCoins,
      inventory: newInventory,
      skills: newSkills,
      quests: { ...state.quests, dailyQuests: updatedQuests }
    });

    get().openRewardModal(`Quest Completed: ${quest.title}`, modalRewards);
  }
});