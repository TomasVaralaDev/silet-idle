import { describe, it, expect } from 'vitest';
import { customMerge, DEFAULT_STATE } from '../../src/store/useGameStore';
import type { FullStoreState } from '../../src/store/useGameStore';

describe('Store Persistence & Migration', () => {

  // Apumuuttuja, jolla muutetaan DEFAULT_STATE testiyhteensopivaksi
  const mockCurrentState = DEFAULT_STATE as unknown as FullStoreState;

  it('should merge new skills into an old save file', () => {
    // 1. Simuloidaan vanha tallennus, josta puuttuu "scavenging"
    const oldPersistedState = {
      skills: {
        woodcutting: { level: 50, xp: 100000 },
        mining: { level: 10, xp: 500 }
      },
      coins: 1000
    };

    // 2. Kutsutaan merge-funktiota
    const mergedResult = customMerge(oldPersistedState, mockCurrentState);

    // 3. TARKISTUKSET:
    expect(mergedResult.skills.woodcutting.level).toBe(50);
    expect(mergedResult.coins).toBe(1000);
    expect(mergedResult.skills).toHaveProperty('scavenging');
    expect(mergedResult.skills.scavenging.level).toBe(1);
    expect(mergedResult.skills.hitpoints.level).toBe(10);
  });

  it('should handle deeply nested combatStats merge', () => {
    const oldSave = {
      combatStats: {
        maxMapCompleted: 5
      }
    };

    const merged = customMerge(oldSave, mockCurrentState);

    expect(merged.combatStats.maxMapCompleted).toBe(5);
    expect(merged.combatStats.hp).toBe(100); // Tuli DEFAULT_STATEsta
  });

  it('should recover gracefully from a null save', () => {
    const merged = customMerge(null, mockCurrentState);
    
    expect(merged.username).toBe('Player');
    expect(merged.skills.woodcutting.level).toBe(1);
  });

});