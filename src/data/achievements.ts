import type { Achievement } from "../types";

export const ACHIEVEMENTS: Achievement[] = [
  // --- 💰 WEALTH (Rikkaudet) ---
  {
    id: "rich_noob",
    category: "wealth",
    name: "Rich Noob",
    icon: "/assets/ui/coins.png",
    description: "Accumulate 1,000 gold pieces.",
    condition: (state) => state.coins >= 1000,
  },
  {
    id: "fragment_hoarder",
    category: "wealth",
    name: "Data Hoarder",
    icon: "/assets/ui/coins.png",
    description: "Accumulate 100,000 gold pieces.",
    condition: (state) => state.coins >= 100000,
  },
  {
    id: "wealth_legend",
    category: "wealth",
    name: "The Gilded King",
    icon: "/assets/ui/coins.png",
    description: "Accumulate 10,000,000 gold pieces.",
    condition: (state) => state.coins >= 10000000,
  },

  // --- 🪓 WOODCUTTING (Puunkaato) ---
  {
    id: "first_chop",
    category: "skills",
    name: "First Chop",
    icon: "/assets/resources/tree/pine_log.png",
    description: "Chop your first pine log.",
    condition: (state) => (state.inventory["pine_log"] || 0) >= 1,
  },
  {
    id: "novice_woodcutter",
    category: "skills",
    name: "Novice Woodcutter",
    icon: "/assets/skills/woodcutting.png",
    description: "Reach Woodcutting level 10.",
    condition: (state) => state.skills.woodcutting.level >= 10,
  },
  {
    id: "master_woodcutter",
    category: "skills",
    name: "Nature's Bane",
    icon: "/assets/skills/woodcutting.png",
    description: "Reach Woodcutting level 99.",
    condition: (state) => state.skills.woodcutting.level >= 99,
  },

  // --- ⛏️ MINING (Kaivostyö) ---
  {
    id: "first_ore",
    category: "skills",
    name: "First Strike",
    icon: "/assets/resources/ore/copper_ore.png",
    description: "Mine your first piece of ore.",
    condition: (state) => (state.inventory["ore_copper"] || 0) >= 1,
  },
  {
    id: "novice_miner",
    category: "skills",
    name: "Deep Delver",
    icon: "/assets/skills/mining.png",
    description: "Reach Mining level 10.",
    condition: (state) => state.skills.mining.level >= 10,
  },
  {
    id: "master_miner",
    category: "skills",
    name: "Obsidian Heart",
    icon: "/assets/skills/mining.png",
    description: "Reach Mining level 99.",
    condition: (state) => state.skills.mining.level >= 99,
  },

  // --- ⚒️ SMITHING (Sepän työt) ---
  {
    id: "first_bar",
    category: "skills",
    name: "Smelter",
    icon: "/assets/skills/smithing.png",
    description: "Smelt your first metal bar.",
    condition: (state) => (state.inventory["ore_copper_smelted"] || 0) >= 1,
  },
  {
    id: "novice_smith",
    category: "skills",
    name: "Hammer & Anvil",
    icon: "/assets/skills/smithing.png",
    description: "Reach Smithing level 10.",
    condition: (state) => state.skills.smithing.level >= 10,
  },
  {
    id: "master_smith",
    category: "skills",
    name: "Divine Anvil",
    icon: "/assets/skills/smithing.png",
    description: "Reach Smithing level 99.",
    condition: (state) => state.skills.smithing.level >= 99,
  },

  // --- 🧵 CRAFTING (Käsityö) ---
  {
    id: "first_craft",
    category: "skills",
    name: "Tinkerer",
    icon: "/assets/skills/crafting.png",
    description: "Craft your first item.",
    condition: (state) => state.skills.crafting.level >= 2, // Taso 2 yleensä tarkoittaa että jotain on tehty
  },
  {
    id: "novice_crafter",
    category: "skills",
    name: "Master Artisan",
    icon: "/assets/skills/crafting.png",
    description: "Reach Crafting level 10.",
    condition: (state) => state.skills.crafting.level >= 10,
  },
  {
    id: "master_crafter",
    category: "skills",
    name: "Grand Architect",
    icon: "/assets/skills/crafting.png",
    description: "Reach Crafting level 99.",
    condition: (state) => state.skills.crafting.level >= 99,
  },

  // --- ⚗️ ALCHEMY (Alkemian salat) ---
  {
    id: "first_potion",
    category: "skills",
    name: "Potion Mixer",
    icon: "/assets/skills/alchemy.png",
    description: "Brew your first potion.",
    condition: (state) => state.skills.alchemy.level >= 2,
  },
  {
    id: "novice_alchemist",
    category: "skills",
    name: "Philosopher's Heir",
    icon: "/assets/skills/alchemy.png",
    description: "Reach Alchemy level 10.",
    condition: (state) => state.skills.alchemy.level >= 10,
  },
  {
    id: "master_alchemist",
    category: "skills",
    name: "Transmutation God",
    icon: "/assets/skills/alchemy.png",
    description: "Reach Alchemy level 99.",
    condition: (state) => state.skills.alchemy.level >= 99,
  },

  // --- ⚔️ COMBAT (Taistelu ja maailmat) ---
  {
    id: "combat_initiate",
    category: "combat",
    name: "First Blood",
    icon: "/assets/skills/attack.png",
    description: "Complete the first combat map.",
    condition: (state) => state.combatStats.maxMapCompleted >= 1,
  },
  {
    id: "combat_veteran",
    category: "combat",
    name: "Zone Stabilizer",
    icon: "/assets/skills/defense.png",
    description: "Complete 10 combat zones.",
    condition: (state) => state.combatStats.maxMapCompleted >= 10,
  },
  {
    id: "combat_elite",
    category: "combat",
    name: "Realm Hero",
    icon: "/assets/skills/strength.png",
    description: "Complete 40 combat zones.",
    condition: (state) => state.combatStats.maxMapCompleted >= 40,
  },
  {
    id: "combat_god",
    category: "combat",
    name: "God of War",
    icon: "/assets/skills/hitpoints.png",
    description: "Defeat the final challenge (Map 80).",
    condition: (state) => state.combatStats.maxMapCompleted >= 80,
  },
];
