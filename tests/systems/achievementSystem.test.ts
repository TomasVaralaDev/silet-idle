import { describe, it, expect } from 'vitest';
import { checkNewAchievements } from '../../src/systems/achievementSystem';
import type { GameState, SkillType, SkillData } from '../../src/types';

describe('AchievementSystem: Trigger Logic', () => {

  // Apufunktio täydellisen mock-tilan luomiseen ilman 'any'-tyyppiä
  const getMockState = (overrides: Partial<GameState> = {}): GameState => {
    const defaultSkills: Record<SkillType, SkillData> = {
      woodcutting: { level: 1, xp: 0 },
      mining: { level: 1, xp: 0 },
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
      combat: { level: 1, xp: 0 },
      scavenging: { level: 1, xp: 0 },
    };

    return {
      username: 'TestPlayer',
      avatar: '',
      settings: { notifications: true, sound: true, music: true, particles: true },
      inventory: {},
      skills: defaultSkills,
      equipment: { head: null, body: null, legs: null, weapon: null, shield: null, necklace: null, ring: null, rune: null, skill: null },
      equippedFood: null,
      combatSettings: { autoEatThreshold: 50, autoProgress: false },
      scavenger: { activeExpeditions: [], unlockedSlots: 1 },
      activeAction: null,
      coins: 0,
      upgrades: [],
      unlockedAchievements: [],
      combatStats: {
        hp: 100, currentMapId: null, maxMapCompleted: 0, enemyCurrentHp: 0,
        respawnTimer: 0, foodTimer: 0, combatLog: [], cooldownUntil: 0
      },
      enemy: null,
      lastTimestamp: Date.now(),
      events: [],
      social: { friends: [], incomingRequests: [], outgoingRequests: [], globalMessages: [], activeChatFriendId: null, unreadMessages: {} },
      quests: { dailyQuests: [], lastResetTime: 0 },
      ...overrides
    } as GameState;
  };

  it('should detect a wealth achievement (Rich Noob)', () => {
    const state = getMockState({ coins: 1500 });
    const newAchievements = checkNewAchievements(state);

    expect(newAchievements).toContain('rich_noob');
    expect(newAchievements).not.toContain('fragment_hoarder'); // 1500 ei riitä 100k:oon
  });

  it('should detect an inventory-based achievement (First Chop)', () => {
    const state = getMockState({ inventory: { 'pine_log': 1 } });
    const newAchievements = checkNewAchievements(state);

    expect(newAchievements).toContain('first_log');
  });

  it('should detect a skill-level achievement (Novice Woodcutter)', () => {
    const state = getMockState();
    state.skills.woodcutting.level = 10;
    
    const newAchievements = checkNewAchievements(state);
    expect(newAchievements).toContain('novice_woodcutter');
  });

  it('should detect combat progress (First Blood)', () => {
    const state = getMockState();
    state.combatStats.maxMapCompleted = 1;
    
    const newAchievements = checkNewAchievements(state);
    expect(newAchievements).toContain('combat_initiate');
  });

  it('should NOT return achievements that are already unlocked', () => {
    const state = getMockState({ 
      coins: 2000, 
      unlockedAchievements: ['rich_noob'] 
    });
    
    const newAchievements = checkNewAchievements(state);
    
    // Pelaajalla on 2000 kolikkoa, mutta koska 'rich_noob' on jo listassa, se ei saa tulla uudestaan
    expect(newAchievements).not.toContain('rich_noob');
  });

  it('should detect multiple achievements at once', () => {
    const state = getMockState({ 
      coins: 1000,
      inventory: { 'pine_log': 1 }
    });

    const newAchievements = checkNewAchievements(state);
    
    expect(newAchievements).toContain('rich_noob');
    expect(newAchievements).toContain('first_log');
    expect(newAchievements.length).toBe(2);
  });
});