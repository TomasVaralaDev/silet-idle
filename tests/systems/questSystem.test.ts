import { describe, it, expect } from 'vitest';
import { processQuestProgress, shouldResetQuests, rollDailyQuests } from '../../src/systems/questSystem';
import type { ActiveQuest, SkillType, SkillData } from '../../src/types';

describe('QuestSystem: Logic & Progress', () => {

  const mockQuests: ActiveQuest[] = [
    {
      id: 'q_kill_slime',
      title: 'Slime Slayer',
      description: 'Defeat 20 Harmless Slimes.',
      type: 'KILL',
      targetId: '1',
      targetAmount: 20,
      progress: 0,
      isCompleted: false,
      isClaimed: false,
      requiredLevel: 1,
      requiredSkill: 'combat',
      reward: { coins: 200 }
    },
    {
      id: 'q_chop_pine',
      title: 'Lumberjack',
      description: 'Chop 50 Pine Logs.',
      type: 'GATHER',
      targetId: 'pine_log',
      targetAmount: 50,
      progress: 10,
      isCompleted: false,
      isClaimed: false,
      requiredLevel: 1,
      requiredSkill: 'woodcutting',
      reward: { coins: 100 }
    }
  ];

  describe('processQuestProgress', () => {
    it('should increment progress correctly for a matching KILL quest', () => {
      const updated = processQuestProgress(mockQuests, 'KILL', '1', 5);
      expect(updated[0].progress).toBe(5);
      expect(updated[0].isCompleted).toBe(false);
      expect(updated[1].progress).toBe(10);
    });

    it('should mark quest as completed when target is reached', () => {
      const updated = processQuestProgress(mockQuests, 'KILL', '1', 20);
      expect(updated[0].progress).toBe(20);
      expect(updated[0].isCompleted).toBe(true);
    });

    it('should handle multi-progress overshoot', () => {
      const updated = processQuestProgress(mockQuests, 'GATHER', 'pine_log', 100);
      expect(updated[1].progress).toBe(50);
      expect(updated[1].isCompleted).toBe(true);
    });

    it('should NOT change progress if targetId does not match', () => {
      const updated = processQuestProgress(mockQuests, 'KILL', '99', 1);
      expect(updated).toBe(mockQuests);
    });
  });

  describe('Daily Reset Logic', () => {
    it('should return true if last reset was yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(shouldResetQuests(yesterday.getTime())).toBe(true);
    });
  });

  describe('rollDailyQuests', () => {
    // Luodaan mockSkills ilman any-tyyppiä
    const mockSkills: Record<SkillType, SkillData> = {
      mining: { level: 1, xp: 0 },
      woodcutting: { level: 20, xp: 0 },
      combat: { level: 1, xp: 0 },
      fishing: { level: 1, xp: 0 },
      foraging: { level: 1, xp: 0 },
      crafting: { level: 1, xp: 0 },
      smithing: { level: 1, xp: 0 },
      alchemy: { level: 1, xp: 0 },
      hitpoints: { level: 10, xp: 0 },
      attack: { level: 1, xp: 0 },
      defense: { level: 1, xp: 0 },
      melee: { level: 1, xp: 0 },
      ranged: { level: 1, xp: 0 },
      magic: { level: 1, xp: 0 },
      scavenging: { level: 1, xp: 0 },
    };

    it('should only roll quests that the player has levels for', () => {
      const rolled = rollDailyQuests(mockSkills);
      expect(rolled.length).toBeGreaterThan(0);
      rolled.forEach(quest => {
        const playerLevel = mockSkills[quest.requiredSkill].level;
        expect(playerLevel).toBeGreaterThanOrEqual(quest.requiredLevel);
      });
    });
  });
});