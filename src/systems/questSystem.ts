import { QUEST_DATABASE } from '../data/quests';
import type { GameState, ActiveQuest } from '../types';

/**
 * Tarkistaa, pitäisikö daily questit nollata.
 */
export const shouldResetQuests = (lastResetTime: number): boolean => {
  const now = new Date();
  const last = new Date(lastResetTime);
  return now.getDate() !== last.getDate() || now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
};

/**
 * Arpoo 3 uutta tehtävää pelaajan taitotasojen perusteella.
 */
export const rollDailyQuests = (skills: GameState['skills']): ActiveQuest[] => {
  // Suodata vain ne questit, joihin pelaajalla on riittävä taso
  const availableQuests = QUEST_DATABASE.filter(q => {
    const playerLevel = skills[q.requiredSkill]?.level || 1;
    return playerLevel >= q.requiredLevel;
  });

  // Arvotaan 3 satunnaista
  const selected: ActiveQuest[] = [];
  const pool = [...availableQuests];

  for (let i = 0; i < 3; i++) {
    if (pool.length === 0) break; // Jos ei ole tarpeeksi questeja tehty vielä
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool.splice(randomIndex, 1)[0];
    selected.push({ ...chosen, progress: 0, isCompleted: false, isClaimed: false });
  }

  return selected;
};

/**
 * Käsittelee actionin (esim item saatu tai vihollinen tapettu) ja päivittää questit.
 */
export const processQuestProgress = (
  quests: ActiveQuest[], 
  type: 'GATHER' | 'KILL' | 'CRAFT', 
  targetId: string, 
  amount: number = 1
): ActiveQuest[] => {
  let changed = false;

  const updatedQuests = quests.map(quest => {
    if (!quest.isCompleted && quest.type === type && quest.targetId === targetId) {
      changed = true;
      const newProgress = Math.min(quest.targetAmount, quest.progress + amount);
      return {
        ...quest,
        progress: newProgress,
        isCompleted: newProgress >= quest.targetAmount
      };
    }
    return quest;
  });

  return changed ? updatedQuests : quests; // Palautetaan alkuperäinen jos mikään ei muuttunut (Zustand optimointi)
};