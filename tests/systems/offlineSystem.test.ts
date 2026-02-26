import { describe, it, expect } from 'vitest';
import { calculateOfflineProgress } from '../../src/systems/offlineSystem';
import { getRequiredXpForLevel } from '../../src/utils/gameUtils';
import type { GameState, SkillType } from '../../src/types';

describe('OfflineSystem: Progress Simulation', () => {
  
  const getMockState = (skill: SkillType, resourceId: string): GameState => ({
    activeAction: {
      skill: skill,
      resourceId: resourceId,
      progress: 0,
      targetTime: 3000
    },
    skills: {
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
    },
    inventory: {},
    upgrades: [],
    equipment: { weapon: null, shield: null, body: null, head: null, legs: null, necklace: null, ring: null, rune: null, skill: null },
    combatStats: { hp: 100, currentMapId: null, enemyCurrentHp: 0, respawnTimer: 0, combatLog: [], foodTimer: 0, maxMapCompleted: 0, cooldownUntil: 0 },
  } as unknown as GameState);

  it('should calculate 1 hour of Pine Tree gathering correctly', () => {
    const initialState = getMockState('woodcutting', 'pine_log');
    const { summary } = calculateOfflineProgress(initialState, 3600);
    expect(summary.xpGained['woodcutting']).toBe(12000);
  });

  it('should respect the Level 99 cap during offline progress', () => {
    const initialState = getMockState('woodcutting', 'pine_log');
    // Alkutaso 98 ja paljon XP:tä
    initialState.skills.woodcutting = { level: 98, xp: 350000 };
    
    const { updatedState } = calculateOfflineProgress(initialState, 43200);

    expect(updatedState.skills.woodcutting.level).toBe(99);
    expect(updatedState.skills.woodcutting.xp).toBe(getRequiredXpForLevel(99));
  });

  it('should handle multi-level jumps during offline time', () => {
    const initialState = getMockState('woodcutting', 'pine_log');
    const { updatedState } = calculateOfflineProgress(initialState, 14400);
    expect(updatedState.skills.woodcutting.level).toBeGreaterThan(10);
  });

  it('should strictly enforce the 12-hour limit', () => {
    const initialState = getMockState('woodcutting', 'pine_log');
    const { summary } = calculateOfflineProgress(initialState, 86400);
    expect(summary.seconds).toBe(43200);
  });

  it('should return original state if no active action', () => {
    const initialState = getMockState('woodcutting', 'pine_log');
    initialState.activeAction = null;
    const { summary } = calculateOfflineProgress(initialState, 3600);
    expect(Object.keys(summary.itemsGained).length).toBe(0);
  });
});