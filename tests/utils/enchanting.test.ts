import { describe, it, expect } from "vitest";
import {
  getEnchantLevel,
  getBaseId,
  getNextEnchantId,
  getSuccessChance,
  getEnchantCost,
  applyEnchantStats,
  fillMissingResourceFields,
} from "../../src/utils/enchanting";
import type { Resource } from "../../src/types";

describe("Enchanting & Scaling System", () => {
  describe("ID Parsers", () => {
    it("should parse enchant level correctly from ID", () => {
      expect(getEnchantLevel("iron_sword")).toBe(0);
      expect(getEnchantLevel("iron_sword_e1")).toBe(1);
      expect(getEnchantLevel("iron_sword_e5")).toBe(5);
    });

    it("should extract base ID correctly", () => {
      expect(getBaseId("iron_sword")).toBe("iron_sword");
      expect(getBaseId("iron_sword_e2")).toBe("iron_sword");
    });

    it("should generate next enchant ID correctly", () => {
      expect(getNextEnchantId("iron_sword")).toBe("iron_sword_e1");
      expect(getNextEnchantId("iron_sword_e2")).toBe("iron_sword_e3");
      // Maksimitaso on nyt 5, joten se ei saa nousta sen yli
      expect(getNextEnchantId("iron_sword_e5")).toBe("iron_sword_e5");
    });
  });

  describe("Success Rates & Costs", () => {
    it("should return 0% chance if no scroll is used", () => {
      expect(getSuccessChance(0, 0)).toBe(0);
    });

    it("should calculate success chance based on scroll tier and level", () => {
      // UUSI KAAVA: T1 (65 Base) - (Level * 15 Penalty)

      // Tier 1 scroll (65 base) - Level 0 (0 penalty) = 65%
      expect(getSuccessChance(0, 1)).toBe(65);

      // Tier 4 scroll (90 base) - Level 4 (60 penalty) = 30% (Divine Scroll last enchant!)
      expect(getSuccessChance(4, 4)).toBe(30);
    });

    it("should enforce min (5%) and max (100%) bounds", () => {
      // Tier 1 (65 base) - Level 4 (60 penalty) = 5% (Basic Scroll last enchant!)
      expect(getSuccessChance(4, 1)).toBe(5);

      // Tier 1 (65 base) - Level 5 (75 penalty) = -10%, mutta pitäisi rajoittua 5%
      expect(getSuccessChance(5, 1)).toBe(5);

      // Tier 5/6 (OutOfBounds, mutta fallbackaa 65 baseen) -> Testataan max bounds toisella tavalla
      // Nykykaavalla max chance on 90 (T4 lvl 0). Emme voi saavuttaa 100% normaalisti,
      // mutta jos syötämme negatiivisen tason (esim. virheellinen syöte), boundsien tulee katkaista se 100%.
      expect(getSuccessChance(-3, 4)).toBe(100);
    });

    it("should increase cost as level and item value rise", () => {
      // Uusi hintakaava: BaseValue * (Level + 1) * 15
      expect(getEnchantCost(1, 100)).toBe(3000); // 100 * 2 * 15 = 3000
      expect(getEnchantCost(5, 100)).toBe(9000); // 100 * 6 * 15 = 9000
    });
  });

  describe("Stat Scaling (applyEnchantStats)", () => {
    const mockItem: Resource = {
      id: "dagger_bronze",
      name: "Bronze Dagger",
      rarity: "common",
      icon: "./assets/items/weapons/dagger_bronze.png",
      value: 100,
      stats: { attack: 10, defense: 5 },
    };

    it("should scale stats by 20% per level", () => {
      const plus1 = applyEnchantStats(mockItem, 1);
      const plus5 = applyEnchantStats(mockItem, 5);

      // Level 1 = +20% (10 * 1.2 = 12)
      expect(plus1.stats?.attack).toBe(12);
      // Defense 5 * 1.2 = 6
      expect(plus1.stats?.defense).toBe(6);

      // Level 5 = +100% (10 * 2.0 = 20)
      expect(plus5.stats?.attack).toBe(20);
      expect(plus5.stats?.defense).toBe(10);
    });

    it("should update name and rarity based on level", () => {
      const plus3 = applyEnchantStats(mockItem, 3);
      const plus5 = applyEnchantStats(mockItem, 5);

      expect(plus3.name).toBe("Bronze Dagger +3");
      // Taso 3 on uudessa järjestelmässä 'rare'
      expect(plus3.rarity).toBe("rare");

      // Taso 5 (Max) on uudessa järjestelmässä 'legendary'
      expect(plus5.rarity).toBe("legendary");
    });

    it("should fill missing resource fields based on its level", () => {
      const result = fillMissingResourceFields(mockItem);
      expect(result.category).toBe("misc");
      expect(result.description).toBe("");
    });
  });
});
