import { describe, it, expect } from 'vitest';
import { 
  getEnchantLevel, 
  getBaseId, 
  getNextEnchantId, 
  getSuccessChance, 
  applyEnchantStats,
  getEnchantCost
} from '../../src/utils/enchanting';
import { autoScaleResource } from '../../src/utils/skillScaling';
import type { Resource } from '../../src/types';

describe('Enchanting & Scaling System', () => {

  describe('ID & Level Parsing', () => {
    it('should parse enchant level correctly from ID', () => {
      expect(getEnchantLevel('iron_sword')).toBe(0);
      expect(getEnchantLevel('iron_sword_e1')).toBe(1);
      expect(getEnchantLevel('iron_sword_e10')).toBe(10);
    });

    it('should extract base ID correctly', () => {
      expect(getBaseId('iron_sword_e1')).toBe('iron_sword');
      expect(getBaseId('iron_sword_e10')).toBe('iron_sword');
      expect(getBaseId('iron_sword')).toBe('iron_sword');
    });

    it('should generate next enchant ID correctly', () => {
      expect(getNextEnchantId('iron_sword')).toBe('iron_sword_e1');
      expect(getNextEnchantId('iron_sword_e1')).toBe('iron_sword_e2');
      // Max level check
      expect(getNextEnchantId('iron_sword_e10')).toBe('iron_sword_e10');
    });
  });

  describe('Success Rates & Costs', () => {
    it('should return 0% chance if no scroll is used', () => {
      expect(getSuccessChance(0, 0)).toBe(0);
      expect(getSuccessChance(5, 0)).toBe(0);
    });

    it('should calculate success chance based on scroll tier and level', () => {
      // Tier 1 scroll (40 base) - Level 0 = 40%
      expect(getSuccessChance(0, 1)).toBe(40);
      // Tier 5 scroll (80 base) - Level 3 (30 penalty) = 50%
      expect(getSuccessChance(3, 5)).toBe(50);
    });

    it('should enforce min (5%) and max (100%) bounds', () => {
      // High level, low scroll
      expect(getSuccessChance(9, 1)).toBe(5); 
      // High tier scroll, low level
      expect(getSuccessChance(0, 8)).toBe(100);
    });

    it('should increase cost as level and item value rise', () => {
      const baseValue = 100;
      const costLvl0 = getEnchantCost(0, baseValue);
      const costLvl5 = getEnchantCost(5, baseValue);
      
      expect(costLvl5).toBeGreaterThan(costLvl0);
    });
  });

  describe('Stat Scaling (applyEnchantStats)', () => {
    const mockItem: Resource = {
      id: 'bronze_dagger',
      name: 'Bronze Dagger',
      rarity: 'common',
      value: 10,
      icon: '',
      stats: { attack: 10, defense: 5 }
    };

    it('should scale stats by 10% per level', () => {
      const plus1 = applyEnchantStats(mockItem, 1);
      const plus5 = applyEnchantStats(mockItem, 5);

      expect(plus1.stats?.attack).toBe(11);
      expect(plus5.stats?.attack).toBe(15);
      expect(plus5.stats?.defense).toBe(7); 
    });

    it('should update name and rarity based on level', () => {
      const plus3 = applyEnchantStats(mockItem, 3);
      const plus10 = applyEnchantStats(mockItem, 10);

      expect(plus3.name).toBe('Bronze Dagger +3');
      expect(plus3.rarity).toBe('uncommon');
      expect(plus10.rarity).toBe('legendary');
    });
  });

  describe('Resource Auto-Scaling (skillScaling)', () => {
    it('should fill missing resource fields based on its level', () => {
      // KORJAUS: 'any' vaihdettu 'as unknown as Resource'
      const rawResource = { id: 'oak_log', level: 10 } as unknown as Resource;
      const scaled = autoScaleResource(rawResource);

      expect(scaled.xpReward).toBe(25);
      expect(scaled.interval).toBe(4000);
      expect(scaled.value).toBe(16);
    });
  });
});