import { QUEST_DATABASE } from "../data/quests";
import type { GameState, ActiveQuest } from "../types";

/**
 * shouldResetQuests
 * Determines if the daily quests need to be wiped and regenerated
 * by comparing the calendar date of the last reset against current time.
 *
 * @param lastResetTime - Timestamp of the previous reset event
 */
export const shouldResetQuests = (lastResetTime: number): boolean => {
  const now = new Date();
  const last = new Date(lastResetTime);
  return (
    now.getDate() !== last.getDate() ||
    now.getMonth() !== last.getMonth() ||
    now.getFullYear() !== last.getFullYear()
  );
};

/**
 * rollDailyQuests
 * Generates 3 random daily tasks tailored to the player's current progression.
 * Filters out high-level quests that the player physically cannot complete yet.
 *
 * @param skills - The player's current skill levels
 * @returns Array of new, uncompleted ActiveQuest objects
 */
export const rollDailyQuests = (skills: GameState["skills"]): ActiveQuest[] => {
  // Filter pool to only include quests matching player proficiency
  const availableQuests = QUEST_DATABASE.filter((q) => {
    const playerLevel = skills[q.requiredSkill]?.level || 1;
    return playerLevel >= q.requiredLevel;
  });

  // Select 3 unique quests randomly
  const selected: ActiveQuest[] = [];
  const pool = [...availableQuests];

  for (let i = 0; i < 3; i++) {
    if (pool.length === 0) break;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool.splice(randomIndex, 1)[0];
    selected.push({
      ...chosen,
      progress: 0,
      isCompleted: false,
      isClaimed: false,
    });
  }

  return selected;
};

/**
 * processQuestProgress
 * Scans active quests and increments progress if the player performs a matching action.
 * Pure function returning a new array only if mutations occurred.
 *
 * @param quests - Current list of active daily quests
 * @param type - Action type ('GATHER' | 'KILL' | 'CRAFT')
 * @param targetId - ID of the item gathered/crafted or monster killed
 * @param amount - Quantity completed
 */
export const processQuestProgress = (
  quests: ActiveQuest[],
  type: "GATHER" | "KILL" | "CRAFT",
  targetId: string,
  amount: number = 1,
): ActiveQuest[] => {
  let changed = false;

  const updatedQuests = quests.map((quest) => {
    if (
      !quest.isCompleted &&
      quest.type === type &&
      quest.targetId === targetId
    ) {
      changed = true;
      const newProgress = Math.min(quest.targetAmount, quest.progress + amount);
      return {
        ...quest,
        progress: newProgress,
        isCompleted: newProgress >= quest.targetAmount,
      };
    }
    return quest;
  });

  // Returning the original array reference prevents unnecessary re-renders in Zustand
  return changed ? updatedQuests : quests;
};
