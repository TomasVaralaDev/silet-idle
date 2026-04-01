import type { Resource, SkillType } from "../types";

export interface TabConfig {
  id: string;
  label: string;
  // Predicate function to determine if a resource belongs to this tab
  filter: (item: Resource) => boolean;
}

export const SKILL_TABS: Partial<Record<SkillType, TabConfig[]>> = {
  // SMITHING TABS
  smithing: [
    {
      id: "all",
      label: "All",
      filter: () => true,
    },
    {
      id: "smelting",
      label: "Smelting",
      // Match smelted materials/ingots by ID
      filter: (r) => r.id.includes("smelted"),
    },
    {
      id: "armors",
      label: "Armors",
      filter: (r) => ["head", "body", "legs"].includes(r.slot || ""),
    },
    {
      id: "shields",
      label: "Shields",
      filter: (r) => r.slot === "shield",
    },
    {
      id: "rings",
      label: "Rings",
      filter: (r) => r.slot === "ring",
    },
  ],

  // CRAFTING TABS
  crafting: [
    {
      id: "all",
      label: "All",
      filter: () => true,
    },
    {
      id: "refining",
      label: "Wood Refining",
      // Filter for wood planks
      filter: (r) => r.id.includes("plank"),
    },
    {
      id: "swords",
      label: "Swords",
      // Filter for sword-type items
      filter: (r) => r.id.includes("sword"),
    },
    {
      id: "bows",
      label: "Bows",
      // Filter for all bow variants
      filter: (r) => r.id.includes("bow"),
    },
    {
      id: "necklaces",
      label: "Necklaces",
      // Use equipment slot for precise identification
      filter: (r) => r.slot === "necklace",
    },
  ],
};
