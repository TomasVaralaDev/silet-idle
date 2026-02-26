import { describe, it, expect } from 'vitest';
import { calculateXpGain, getRequiredXpForLevel } from '../../src/utils/gameUtils';

describe('GameUtils: Leveling & XP Logic', () => {

  it('should require exactly 40 XP for level 1 -> 2', () => {
    expect(getRequiredXpForLevel(1)).toBe(40);
  });

  it('should require exactly 392,040 XP for level 99', () => {
    // 40 * 99^2 = 392040
    expect(getRequiredXpForLevel(99)).toBe(392040);
  });

  it('should level up and keep remaining XP', () => {
    const result = calculateXpGain(1, 0, 100);
    expect(result.level).toBe(2);
    expect(result.xp).toBe(60); 
  });

  it('should handle multi-level jumps correctly', () => {
    const result = calculateXpGain(1, 0, 500);
    expect(result.level).toBe(3);
    expect(result.xp).toBe(300);
  });

  it('should enforce the Level 99 Cap and not over-accumulate XP', () => {
    // Yritetään nousta yli 99 massiivisella XP:llä
    const result = calculateXpGain(98, 0, 1000000);
    
    expect(result.level).toBe(99);
    expect(result.xp).toBe(392040); // Lukitaan tason 99 vaatimukseen
  });

  it('should automatically fix stuck levels or overflow (e.g. 1 000 000 / 392 040)', () => {
    const result = calculateXpGain(99, 1000000, 0);
    expect(result.level).toBe(99);
    expect(result.xp).toBe(392040);
  });

  it('should safely handle string and NaN inputs', () => {
    const result = calculateXpGain("10", "50", "100");
    expect(typeof result.level).toBe('number');
    expect(result.level).toBe(10);
  });
});