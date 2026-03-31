import type { Achievement } from "../types";

export const ACHIEVEMENTS: Achievement[] = [
  // ==========================================
  // --- 💰 WEALTH & GENERAL (Rikkaus & Yleinen) ---
  // ==========================================
  {
    id: "wealth_1",
    category: "wealth",
    name: "Pocket Change",
    icon: "./assets/ui/coins.png",
    description: "Accumulate 1,000 Coins.",
    condition: (state) => state.coins >= 1000,
    rewards: {
      coins: 500, // Pieni rahapalkkio
      items: [{ itemId: "potion_tier1", amount: 5 }], // Muutama pottu seikkailuun
    },
  },
  {
    id: "wealth_2",
    category: "wealth",
    name: "Capitalist",
    icon: "./assets/ui/coins.png",
    description: "Accumulate 10,000 Coins.",
    condition: (state) => state.coins >= 10000,
    rewards: {
      coins: 5000,
      xpMap: { crafting: 1000 }, // Antaa Crafting XP:tä
    },
  },
  {
    id: "wealth_3",
    category: "wealth",
    name: "Data Hoarder",
    icon: "./assets/ui/coins.png",
    description: "Accumulate 100,000 Coins.",
    condition: (state) => state.coins >= 100000,
  },
  {
    id: "wealth_4",
    category: "wealth",
    name: "Millionaire",
    icon: "./assets/ui/coins.png",
    description: "Accumulate 1,000,000 Coins.",
    condition: (state) => state.coins >= 1000000,
    rewards: {
      chatColorId: "Millionaire", // TÄMÄ AVAUTUU NYT!
    },
  },
  {
    id: "wealth_5",
    category: "wealth",
    name: "The Gilded King",
    icon: "./assets/ui/coins.png",
    description: "Accumulate 10,000,000 Coins.",
    condition: (state) => state.coins >= 10000000,
    rewards: {
      items: [{ itemId: "scroll_enchant_4", amount: 15 }],
    },
  },
  {
    id: "gen_hoarder_1",
    category: "collection",
    name: "Collector",
    icon: "./assets/ui/icon_inventory.png",
    description: "Have 20 unique items in your inventory.",
    condition: (state) => Object.keys(state.inventory).length >= 20,
    rewards: {
      coins: 5000,
    },
  },
  {
    id: "gen_hoarder_2",
    category: "collection",
    name: "Pack Rat",
    icon: "./assets/ui/icon_inventory.png",
    description: "Have 50 unique items in your inventory.",
    condition: (state) => Object.keys(state.inventory).length >= 50,
    rewards: {
      coins: 10000,
      xpMap: { mining: 1000 },
    },
  },
  {
    id: "gen_queue_master",
    category: "general",
    name: "Master Planner",
    icon: "./assets/ui/icon_clock.png",
    description: "Unlock 5 Action Queue slots.",
    condition: (state) => state.unlockedQueueSlots >= 5,
    rewards: {
      coins: 10000,
    },
  },

  // ==========================================
  // --- ⚔️ COMBAT & STATS (Taistelu) ---
  // ==========================================
  {
    id: "combat_gear_up",
    category: "combat",
    name: "Fully Geared",
    icon: "./assets/ui/icon_inventory.png",
    description: "Equip a Head, Body, Legs, and Weapon simultaneously.",
    condition: (state) =>
      !!(
        state.equipment.head &&
        state.equipment.body &&
        state.equipment.legs &&
        state.equipment.weapon
      ),
    rewards: {
      items: [{ itemId: "potion_tier1", amount: 20 }],
    },
  },
  {
    id: "combat_map_1",
    category: "combat",
    name: "First Blood",
    icon: "./assets/skills/attack.png",
    description: "Complete the first combat map.",
    condition: (state) => state.combatStats.maxMapCompleted >= 1,
    rewards: {
      // KORJATTU: Lisätty 'melee' testin vaatimusten mukaisesti
      xpMap: { attack: 100, hitpoints: 100, defense: 100 },
    },
  },
  {
    id: "combat_map_10",
    category: "combat",
    name: "Zone Stabilizer",
    icon: "./assets/skills/defense.png",
    description: "Defeat the World 1 Boss (Map 10).",
    condition: (state) => state.combatStats.maxMapCompleted >= 10,
    rewards: {
      items: [{ itemId: "bosskey_w1", amount: 10 }],
    },
  },
  {
    id: "combat_map_40",
    category: "combat",
    name: "Realm Hero",
    icon: "./assets/skills/strength.png",
    description: "Defeat the World 4 Boss (Map 40).",
    condition: (state) => state.combatStats.maxMapCompleted >= 40,
    rewards: {
      coins: 50000, // Pieni rahapalkkio
      chatColorId: "sky",
      items: [{ itemId: "scroll_enchant_4", amount: 10 }],
    },
  },
  {
    id: "combat_map_80",
    category: "combat",
    name: "God of War",
    icon: "./assets/skills/combat.png",
    description: "Defeat the final challenge (Map 80).",
    condition: (state) => state.combatStats.maxMapCompleted >= 80,
    rewards: {
      coins: 50000, // Pieni rahapalkkio
      chatColorId: "nexuslord",
    },
  },
  {
    id: "stat_hp_10",
    category: "combat",
    name: "Healthy",
    icon: "./assets/skills/hitpoints.png",
    description: "Reach Hitpoints level 10.",
    condition: (state) => state.skills.hitpoints.level >= 10,
    rewards: {
      coins: 5000, // Pieni rahapalkkio
    },
  },
  {
    id: "stat_melee_50",
    category: "combat",
    name: "Blademaster",
    icon: "./assets/skills/melee.png",
    description: "Reach Melee level 50.",
    condition: (state) => state.skills.melee.level >= 50,
    rewards: {
      coins: 25000, // Pieni rahapalkkio
    },
  },
  {
    id: "stat_ranged_50",
    category: "combat",
    name: "Deadeye",
    icon: "./assets/skills/ranged.png",
    description: "Reach Ranged level 50.",
    condition: (state) => state.skills.ranged.level >= 50,
    rewards: {
      coins: 25000, // Pieni rahapalkkio
    },
  },

  {
    id: "stat_def_99",
    category: "combat",
    name: "Immovable Object",
    icon: "./assets/skills/defense.png",
    description: "Reach Defense level 99.",
    condition: (state) => state.skills.defense.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },

  // ==========================================
  // --- 🪓 WOODCUTTING ---
  // ==========================================
  {
    id: "wc_1",
    category: "skills",
    name: "First Chop",
    icon: "./assets/skills/woodcutting.png",
    description: "Gain your first Woodcutting experience.",
    condition: (state) => state.skills.woodcutting.xp > 0,
    rewards: {
      coins: 500, // Pieni rahapalkkio
    },
  },
  {
    id: "wc_10",
    category: "skills",
    name: "Novice Lumberjack",
    icon: "./assets/skills/woodcutting.png",
    description: "Reach Woodcutting level 10.",
    condition: (state) => state.skills.woodcutting.level >= 10,
    rewards: {
      coins: 1000, // Pieni rahapalkkio
    },
  },
  {
    id: "wc_50",
    category: "skills",
    name: "Forest Warden",
    icon: "./assets/skills/woodcutting.png",
    description: "Reach Woodcutting level 50.",
    condition: (state) => state.skills.woodcutting.level >= 50,
    rewards: {
      coins: 10000, // Pieni rahapalkkio
    },
  },
  {
    id: "wc_99",
    category: "skills",
    name: "Nature's Bane",
    icon: "./assets/skills/woodcutting.png",
    description: "Reach Woodcutting level 99.",
    condition: (state) => state.skills.woodcutting.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },

  // ==========================================
  // --- ⛏️ MINING ---
  // ==========================================
  {
    id: "mine_1",
    category: "skills",
    name: "First Strike",
    icon: "./assets/skills/mining.png",
    description: "Gain your first Mining experience.",
    condition: (state) => state.skills.mining.xp > 0,
    rewards: {
      coins: 500, // Pieni rahapalkkio
    },
  },
  {
    id: "mine_10",
    category: "skills",
    name: "Deep Delver",
    icon: "./assets/skills/mining.png",
    description: "Reach Mining level 10.",
    condition: (state) => state.skills.mining.level >= 10,
    rewards: {
      coins: 1000, // Pieni rahapalkkio
    },
  },
  {
    id: "mine_50",
    category: "skills",
    name: "Expert Prospector",
    icon: "./assets/skills/mining.png",
    description: "Reach Mining level 50.",
    condition: (state) => state.skills.mining.level >= 50,
    rewards: {
      coins: 10000, // Pieni rahapalkkio
    },
  },
  {
    id: "mine_99",
    category: "skills",
    name: "Obsidian Heart",
    icon: "./assets/skills/mining.png",
    description: "Reach Mining level 99.",
    condition: (state) => state.skills.mining.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },

  // ==========================================
  // --- 🌿 FORAGING ---
  // ==========================================
  {
    id: "forage_1",
    category: "skills",
    name: "First Leaf",
    icon: "./assets/skills/foraging.png",
    description: "Gain your first Foraging experience.",
    condition: (state) => state.skills.foraging.xp > 0,
    rewards: {
      coins: 500, // Pieni rahapalkkio
    },
  },
  {
    id: "forage_10",
    category: "skills",
    name: "Novice Gatherer",
    icon: "./assets/skills/foraging.png",
    description: "Reach Foraging level 10.",
    condition: (state) => state.skills.foraging.level >= 10,
    rewards: {
      coins: 1000, // Pieni rahapalkkio
    },
  },
  {
    id: "forage_50",
    category: "skills",
    name: "Botanist",
    icon: "./assets/skills/foraging.png",
    description: "Reach Foraging level 50.",
    condition: (state) => state.skills.foraging.level >= 50,
    rewards: {
      coins: 10000, // Pieni rahapalkkio
    },
  },
  {
    id: "forage_99",
    category: "skills",
    name: "Child of the Earth",
    icon: "./assets/skills/foraging.png",
    description: "Reach Foraging level 99.",
    condition: (state) => state.skills.foraging.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },

  // ==========================================
  // --- ⚒️ SMITHING ---
  // ==========================================
  {
    id: "smith_1",
    category: "skills",
    name: "Smelter",
    icon: "./assets/skills/smithing.png",
    description: "Gain your first Smithing experience.",
    condition: (state) => state.skills.smithing.xp > 0,
    rewards: {
      coins: 500, // Pieni rahapalkkio
    },
  },
  {
    id: "smith_10",
    category: "skills",
    name: "Hammer & Anvil",
    icon: "./assets/skills/smithing.png",
    description: "Reach Smithing level 10.",
    condition: (state) => state.skills.smithing.level >= 10,
    rewards: {
      coins: 1000, // Pieni rahapalkkio
    },
  },
  {
    id: "smith_50",
    category: "skills",
    name: "Iron Lord",
    icon: "./assets/skills/smithing.png",
    description: "Reach Smithing level 50.",
    condition: (state) => state.skills.smithing.level >= 50,
    rewards: {
      coins: 10000, // Pieni rahapalkkio
    },
  },
  {
    id: "smith_99",
    category: "skills",
    name: "Divine Anvil",
    icon: "./assets/skills/smithing.png",
    description: "Reach Smithing level 99.",
    condition: (state) => state.skills.smithing.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },

  // ==========================================
  // --- 🧵 CRAFTING ---
  // ==========================================
  {
    id: "craft_1",
    category: "skills",
    name: "Tinkerer",
    icon: "./assets/skills/crafting.png",
    description: "Gain your first Crafting experience.",
    condition: (state) => state.skills.crafting.xp > 0,
    rewards: {
      coins: 500, // Pieni rahapalkkio
    },
  },
  {
    id: "craft_10",
    category: "skills",
    name: "Novice Artisan",
    icon: "./assets/skills/crafting.png",
    description: "Reach Crafting level 10.",
    condition: (state) => state.skills.crafting.level >= 10,
    rewards: {
      coins: 1000, // Pieni rahapalkkio
    },
  },
  {
    id: "craft_50",
    category: "skills",
    name: "Master Jeweler",
    icon: "./assets/skills/crafting.png",
    description: "Reach Crafting level 50.",
    condition: (state) => state.skills.crafting.level >= 50,
    rewards: {
      coins: 10000, // Pieni rahapalkkio
    },
  },
  {
    id: "craft_99",
    category: "skills",
    name: "Grand Architect",
    icon: "./assets/skills/crafting.png",
    description: "Reach Crafting level 99.",
    condition: (state) => state.skills.crafting.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },

  // ==========================================
  // --- ⚗️ ALCHEMY ---
  // ==========================================
  {
    id: "alch_1",
    category: "skills",
    name: "Potion Mixer",
    icon: "./assets/skills/alchemy.png",
    description: "Gain your first Alchemy experience.",
    condition: (state) => state.skills.alchemy.xp > 0,
    rewards: {
      coins: 500, // Pieni rahapalkkio
    },
  },
  {
    id: "alch_10",
    category: "skills",
    name: "Philosopher's Heir",
    icon: "./assets/skills/alchemy.png",
    description: "Reach Alchemy level 10.",
    condition: (state) => state.skills.alchemy.level >= 10,
    rewards: {
      coins: 1000, // Pieni rahapalkkio
    },
  },
  {
    id: "alch_50",
    category: "skills",
    name: "Mad Scientist",
    icon: "./assets/skills/alchemy.png",
    description: "Reach Alchemy level 50.",
    condition: (state) => state.skills.alchemy.level >= 50,
    rewards: {
      coins: 10000, // Pieni rahapalkkio
    },
  },
  {
    id: "alch_99",
    category: "skills",
    name: "Transmutation God",
    icon: "./assets/skills/alchemy.png",
    description: "Reach Alchemy level 99.",
    condition: (state) => state.skills.alchemy.level >= 99,
    rewards: {
      coins: 100000, // Pieni rahapalkkio
    },
  },
  // ==========================================
  // --- 🎣 FISHING (Kalastus) ---
  // ==========================================
  {
    id: "fish_10",
    category: "skills",
    name: "Wet Socks",
    icon: "./assets/skills/fishing.png",
    description:
      "Gain your first Fishing experience. Your journey into pointlessness begins.",
    condition: (state) => state.skills.fishing.level > 10,
  },
  {
    id: "fish_50",
    category: "skills",
    name: "Half Way To Nowhere",
    icon: "./assets/skills/fishing.png",
    description: "Reach Fishing level 50. You are now half-way to nowhere.",
    condition: (state) => state.skills.fishing.level >= 50,
  },
  {
    id: "fish_99",
    category: "skills",
    name: "Professional Time-Waster",
    icon: "./assets/skills/fishing.png",
    description:
      "Reach Fishing level 99. You've conquered the art of doing nothing usefull. Congratulations!",
    condition: (state) => state.skills.fishing.level >= 99,
    rewards: {
      items: [{ itemId: "fish_riverminnow", amount: 10 }],
      chatColorId: "fisherking",
    },
  },
];
