import { describe, it, expect } from 'vitest';
import { rollWeightedDrop } from '../../src/utils/loot';
import type { WeightedDrop } from '../../src/types';

describe('LootSystem: Weighted Randomness', () => {

  it('should return null for empty or null drops', () => {
    expect(rollWeightedDrop([])).toBe(null);
    // KORJAUS: 'any' vaihdettu 'as unknown as WeightedDrop[]'
    expect(rollWeightedDrop(null as unknown as WeightedDrop[])).toBe(null);
  });

  it('should always return the only item if only one drop exists', () => {
    const drops: WeightedDrop[] = [{ itemId: 'solo_item', weight: 1, amount: [1, 1] }];
    for (let i = 0; i < 100; i++) {
      const result = rollWeightedDrop(drops);
      expect(result?.itemId).toBe('solo_item');
      expect(result?.amount).toBe(1);
    }
  });

  it('should respect amount ranges [min, max]', () => {
    const drops: WeightedDrop[] = [{ itemId: 'test', weight: 1, amount: [5, 10] }];
    for (let i = 0; i < 100; i++) {
      const result = rollWeightedDrop(drops);
      expect(result?.amount).toBeGreaterThanOrEqual(5);
      expect(result?.amount).toBeLessThanOrEqual(10);
    }
  });

  it('should distribute loot according to weights (Monte Carlo 10k rolls)', () => {
    const drops: WeightedDrop[] = [
      { itemId: 'common', weight: 900, amount: [1, 1] },
      { itemId: 'rare', weight: 90, amount: [1, 1] },
      { itemId: 'legendary', weight: 10, amount: [1, 1] }
    ];

    const iterations = 10000;
    const results: Record<string, number> = { common: 0, rare: 0, legendary: 0 };

    for (let i = 0; i < iterations; i++) {
      const drop = rollWeightedDrop(drops);
      if (drop) results[drop.itemId]++;
    }

    expect(results.common).toBeGreaterThan(8800);
    expect(results.common).toBeLessThan(9200);

    expect(results.rare).toBeGreaterThan(800);
    expect(results.rare).toBeLessThan(1000);

    expect(results.legendary).toBeGreaterThan(70);
    expect(results.legendary).toBeLessThan(130);
  });

  it('should handle zero-weight items by never dropping them', () => {
    const drops: WeightedDrop[] = [
      { itemId: 'always', weight: 100, amount: [1, 1] },
      { itemId: 'never', weight: 0, amount: [1, 1] }
    ];

    for (let i = 0; i < 1000; i++) {
      const result = rollWeightedDrop(drops);
      expect(result?.itemId).not.toBe('never');
    }
  });
});