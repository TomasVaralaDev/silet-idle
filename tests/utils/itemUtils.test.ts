import { describe, it, expect } from "vitest";
import { getPlayerStats } from "../../src/utils/combatMechanics";
import { sanitizeInventory } from "../../src/utils/gameUtils";
import type { SkillType, SkillData } from "../../src/types";

describe("Inventory & Item Utilities", () => {
  describe("sanitizeInventory", () => {
    it("should remove items with quantity 0 or less", () => {
      const inventory = {
        pine_log: 10,
        oak_log: 0,
        stone: -5,
      };
      const cleaned = sanitizeInventory(inventory);
      expect(cleaned).toHaveProperty("pine_log");
      expect(cleaned).not.toHaveProperty("oak_log");
      expect(cleaned).not.toHaveProperty("stone");
    });
  });

  describe("getPlayerStats Calculation", () => {
    // Määritellään mockSkills tyypitettynä ilman any-hakkerointia
    const mockSkills: Record<SkillType, SkillData> = {
      hitpoints: { level: 10, xp: 0 },
      attack: { level: 5, xp: 0 },
      melee: { level: 5, xp: 0 },
      defense: { level: 1, xp: 0 },
      woodcutting: { level: 1, xp: 0 },
      mining: { level: 1, xp: 0 },
      fishing: { level: 1, xp: 0 },
      foraging: { level: 1, xp: 0 },
      crafting: { level: 1, xp: 0 },
      smithing: { level: 1, xp: 0 },
      alchemy: { level: 1, xp: 0 },
      ranged: { level: 1, xp: 0 },
      magic: { level: 1, xp: 0 },
      combat: { level: 1, xp: 0 },
      scavenging: { level: 1, xp: 0 },
    };

    it("should calculate base HP correctly (100 + Level * 10)", () => {
      const stats = getPlayerStats(mockSkills, "melee", {
        damage: 0,
        armor: 0,
      });
      expect(stats.hp).toBe(200); // 100 base + (10 level * 10) = 200
    });

    it("should correctly integrate weapon damage into weaponBase", () => {
      const gear = { damage: 8, armor: 0 };
      const stats = getPlayerStats(mockSkills, "melee", gear);
      expect(stats.weaponBase).toBe(8);
    });

    it("should calculate mainStat correctly (Attack level + Combat style level)", () => {
      const stats = getPlayerStats(mockSkills, "melee", {
        damage: 1,
        armor: 0,
      });
      expect(stats.mainStat).toBe(10);
    });
  });
});
