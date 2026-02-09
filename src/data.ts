import type { Resource, ShopItem, Achievement, CombatMap } from './types';

// --- COMBAT DATA (WORLD 1) ---
export const COMBAT_DATA: CombatMap[] = [
  { 
    id: 1, world: 1, name: "Slime Fields (1-1)", enemyName: "Green Slime", 
    enemyHp: 20, enemyAttack: 2, xpReward: 10,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [2, 5] }] 
  },
  { 
    id: 2, world: 1, name: "Rat Cave (1-2)", enemyName: "Giant Rat", 
    enemyHp: 35, enemyAttack: 4, xpReward: 15,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [5, 10] }] 
  },
  { 
    id: 3, world: 1, name: "Goblin Outpost (1-3)", enemyName: "Goblin Scout", 
    enemyHp: 50, enemyAttack: 6, xpReward: 20,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [10, 15] }] 
  },
  { 
    id: 4, world: 1, name: "Spider Nest (1-4)", enemyName: "Cave Spider", 
    enemyHp: 65, enemyAttack: 8, xpReward: 30,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [12, 20] }] 
  },
  { 
    id: 5, world: 1, name: "Deep Woods (1-5)", enemyName: "Dire Wolf", 
    enemyHp: 80, enemyAttack: 12, xpReward: 40,
    drops: [
      { itemId: 'coins', chance: 1.0, amount: [15, 30] },
      { itemId: 'frozen_key', chance: 0.05, amount: [1, 1] } 
    ]
  },
  { 
    id: 6, world: 1, name: "Bandit Camp (1-6)", enemyName: "Bandit", 
    enemyHp: 100, enemyAttack: 15, xpReward: 50,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [20, 40] }, { itemId: 'frozen_key', chance: 0.1, amount: [1, 1] }] 
  },
  { 
    id: 7, world: 1, name: "Old Ruins (1-7)", enemyName: "Skeleton", 
    enemyHp: 120, enemyAttack: 18, xpReward: 60,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [25, 50] }, { itemId: 'frozen_key', chance: 0.1, amount: [1, 1] }] 
  },
  { 
    id: 8, world: 1, name: "Cursed Lake (1-8)", enemyName: "Water Spirit", 
    enemyHp: 150, enemyAttack: 22, xpReward: 75,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [30, 60] }, { itemId: 'frozen_key', chance: 0.15, amount: [1, 1] }] 
  },
  { 
    id: 9, world: 1, name: "Ice Gate (1-9)", enemyName: "Gatekeeper", 
    enemyHp: 200, enemyAttack: 25, xpReward: 100,
    drops: [{ itemId: 'coins', chance: 1.0, amount: [50, 80] }, { itemId: 'frozen_key', chance: 0.2, amount: [1, 1] }] 
  },
  { 
    id: 10, world: 1, name: "Ice Cavern (BOSS)", enemyName: "Ice Golem King", 
    enemyHp: 500, enemyAttack: 40, xpReward: 1000,
    isBoss: true, keyRequired: 'frozen_key',
    drops: [{ itemId: 'coins', chance: 1.0, amount: [1000, 2000] }]
  }
];

// --- GAME DATA ---
export const GAME_DATA: Record<string, Resource[]> = {
  // --- WOODCUTTING ---
  woodcutting: [
    { 
      id: 'pine_log', name: 'Pine Tree', levelRequired: 1, xpReward: 10, interval: 3000, value: 1, 
      icon: '/assets/resources/tree/pine_log.png', 
      actionImage: '/assets/resources/tree/pine_tree.png', 
      color: 'text-emerald-600', description: 'Common pine wood.', requiresMapCompletion: undefined 
    },
    { 
      id: 'oak_log', name: 'Oak Tree', levelRequired: 15, xpReward: 25, interval: 4500, value: 5, 
      icon: '/assets/resources/tree/oak_log.png', 
      actionImage: '/assets/resources/tree/oak_tree.png', 
      color: 'text-amber-700', description: 'Sturdy oak wood.', requiresMapCompletion: 2 
    },
    { 
      id: 'willow_log', name: 'Willow Tree', levelRequired: 30, xpReward: 45, interval: 6000, value: 10, 
      icon: '/assets/resources/tree/willow_log.png', 
      actionImage: '/assets/resources/tree/willow_tree.png', 
      color: 'text-emerald-800', description: 'Flexible willow wood.', requiresMapCompletion: 4 
    },
    { 
      id: 'yew_log', name: 'Yew Tree', levelRequired: 45, xpReward: 70, interval: 7500, value: 25, 
      icon: '/assets/resources/tree/yew_log.png', 
      actionImage: '/assets/resources/tree/yew_tree.png', 
      color: 'text-lime-900', description: 'Strong and dark wood.', requiresMapCompletion: 6 
    },
    { 
      id: 'sunwood_log', name: 'Sunwood Tree', levelRequired: 60, xpReward: 100, interval: 9000, value: 60, 
      icon: '/assets/resources/tree/sunwood_log.png', 
      actionImage: '/assets/resources/tree/sunwood_tree.png', 
      color: 'text-orange-500', description: 'Radiates a warm glow.', requiresMapCompletion: 7 
    },
    { 
      id: 'frostbark_log', name: 'Frostbark Tree', levelRequired: 75, xpReward: 150, interval: 11000, value: 120, 
      icon: '/assets/resources/tree/frostbark_log.png', 
      actionImage: '/assets/resources/tree/frostbark_tree.png', 
      color: 'text-cyan-300', description: 'Cold to the touch.', requiresMapCompletion: 8 
    },
    { 
      id: 'heartwood_log', name: 'Heartwood Tree', levelRequired: 85, xpReward: 220, interval: 13000, value: 250, 
      icon: '/assets/resources/tree/heartwood_log.png', 
      actionImage: '/assets/resources/tree/heartwood_tree.png', 
      color: 'text-purple-500', description: 'Pulsating with energy.', requiresMapCompletion: 9 
    },
    { 
      id: 'bloodwood_log', name: 'Bloodwood Tree', levelRequired: 99, xpReward: 350, interval: 16000, value: 500, 
      icon: '/assets/resources/tree/bloodwood_log.png', 
      actionImage: '/assets/resources/tree/bloodwood_tree.png', 
      color: 'text-red-700', description: 'Crimson red ancient wood.', requiresMapCompletion: 10 
    },
  ],
  
  // --- MINING ---
  mining: [
    { id: 'ore_copper', name: 'Copper Ore', levelRequired: 1, xpReward: 10, interval: 3000, value: 2, icon: '/assets/resources/ore/ore_copper.png', color: 'text-orange-500', description: 'Basic conductive metal.' },
    { id: 'ore_iron', name: 'Iron Ore', levelRequired: 10, xpReward: 20, interval: 4500, value: 5, icon: '/assets/resources/ore/ore_iron.png', color: 'text-slate-400', description: 'Strong structural metal.', requiresMapCompletion: 3 },
    { id: 'ore_gold', name: 'Gold Ore', levelRequired: 25, xpReward: 35, interval: 6000, value: 15, icon: '/assets/resources/ore/ore_gold.png', color: 'text-yellow-400', description: 'Highly conductive and valuable.', requiresMapCompletion: 5 },
    { id: 'ore_mithril', name: 'Mithril Ore', levelRequired: 40, xpReward: 55, interval: 8000, value: 30, icon: '/assets/resources/ore/ore_mithril.png', color: 'text-cyan-400', description: 'Lightweight and durable.', requiresMapCompletion: 7 },
    { id: 'ore_adamantite', name: 'Adamantite Ore', levelRequired: 55, xpReward: 80, interval: 10000, value: 60, icon: '/assets/resources/ore/ore_adamantite.png', color: 'text-purple-400', description: 'Extremely hard alloy source.', requiresMapCompletion: 8 },
    { id: 'ore_emerald', name: 'Emerald Ore', levelRequired: 70, xpReward: 110, interval: 12000, value: 100, icon: '/assets/resources/ore/ore_emerald.png', color: 'text-emerald-400', description: 'Crystalline metal structure.', requiresMapCompletion: 9 },
    { id: 'ore_eternium', name: 'Eternium Ore', levelRequired: 85, xpReward: 150, interval: 15000, value: 200, icon: '/assets/resources/ore/ore_eternium.png', color: 'text-red-500', description: 'Resonates with time.', requiresMapCompletion: 10 },
    { id: 'ore_starfallalloy', name: 'Starfall Ore', levelRequired: 99, xpReward: 250, interval: 20000, value: 500, icon: '/assets/resources/ore/ore_starfallalloy.png', color: 'text-indigo-400', description: 'Material from the cosmos.' }
  ],

  // --- SMITHING (FOUNDRY PROTOCOL) ---
  smithing: [
    // INGOTS
    { id: 'ore_copper_smelted', name: 'Copper Ingot', levelRequired: 1, xpReward: 5, interval: 2000, value: 5, icon: '/assets/resources/ore/ore_copper_smelted.png', color: 'text-orange-500', description: 'Smelted copper ingot.', inputs: [{ id: 'ore_copper', count: 1 }] },
    { id: 'ore_iron_smelted', name: 'Iron Ingot', levelRequired: 10, xpReward: 10, interval: 3000, value: 15, icon: '/assets/resources/ore/ore_iron_smelted.png', color: 'text-slate-400', description: 'Smelted iron ingot.', inputs: [{ id: 'ore_iron', count: 1 }] },
    { id: 'ore_gold_smelted', name: 'Gold Ingot', levelRequired: 25, xpReward: 20, interval: 4000, value: 45, icon: '/assets/resources/ore/ore_gold_smelted.png', color: 'text-yellow-400', description: 'Refined gold ingot.', inputs: [{ id: 'ore_gold', count: 1 }] },
    { id: 'ore_mithril_smelted', name: 'Mithril Ingot', levelRequired: 40, xpReward: 35, interval: 5000, value: 90, icon: '/assets/resources/ore/ore_mithril_smelted.png', color: 'text-cyan-400', description: 'Refined mithril alloy.', inputs: [{ id: 'ore_mithril', count: 1 }] },
    { id: 'ore_adamantite_smelted', name: 'Adamantite Ingot', levelRequired: 55, xpReward: 50, interval: 6000, value: 180, icon: '/assets/resources/ore/ore_adamantite_smelted.png', color: 'text-purple-400', description: 'Hardened adamantite ingot.', inputs: [{ id: 'ore_adamantite', count: 1 }] },
    { id: 'ore_emerald_smelted', name: 'Emerald Refined', levelRequired: 70, xpReward: 70, interval: 7000, value: 300, icon: '/assets/resources/ore/ore_emerald_smelted.png', color: 'text-emerald-400', description: 'Pure energy crystal.', inputs: [{ id: 'ore_emerald', count: 1 }] },
    { id: 'ore_eternium_smelted', name: 'Eternium Ingot', levelRequired: 85, xpReward: 100, interval: 8000, value: 600, icon: '/assets/resources/ore/ore_eternium_smelted.png', color: 'text-red-500', description: 'Temporal alloy ingot.', inputs: [{ id: 'ore_eternium', count: 1 }] },
    { id: 'ore_starfallalloy_smelted', name: 'Starfall Ingot', levelRequired: 99, xpReward: 150, interval: 10000, value: 1500, icon: '/assets/resources/ore/ore_starfallalloy_smelted.png', color: 'text-indigo-400', description: 'Cosmic alloy ingot.', inputs: [{ id: 'ore_starfallalloy', count: 1 }] },

    // ARMOR: BRONZE
    { id: 'armor_bronze_helm', name: 'Bronze Helm', levelRequired: 1, xpReward: 20, interval: 3000, value: 10, icon: '/assets/items/armor/armor_head_bronze.png', color: 'text-orange-700', description: 'Basic protection.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'head', stats: { defense: 2 }, category: 'armor' },
    { id: 'armor_bronze_body', name: 'Bronze Chestplate', levelRequired: 1, xpReward: 40, interval: 4000, value: 25, icon: '/assets/items/armor/armor_chest_bronze.png', color: 'text-orange-700', description: 'Covers the chest.', inputs: [{ id: 'ore_copper_smelted', count: 4 }], slot: 'body', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_bronze_legs', name: 'Bronze Greaves', levelRequired: 1, xpReward: 30, interval: 3500, value: 20, icon: '/assets/items/armor/armor_legs_bronze.png', color: 'text-orange-700', description: 'Protects legs.', inputs: [{ id: 'ore_copper_smelted', count: 3 }], slot: 'legs', stats: { defense: 4 }, category: 'armor' },

    // ARMOR: IRON
    { id: 'armor_iron_helm', name: 'Iron Helm', levelRequired: 15, xpReward: 50, interval: 4500, value: 40, icon: '/assets/items/armor/armor_head_iron.png', color: 'text-slate-400', description: 'Sturdy iron helm.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'head', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_iron_body', name: 'Iron Chestplate', levelRequired: 15, xpReward: 100, interval: 6000, value: 100, icon: '/assets/items/armor/armor_chest_iron.png', color: 'text-slate-400', description: 'Heavy iron armor.', inputs: [{ id: 'ore_iron_smelted', count: 5 }], slot: 'body', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_iron_legs', name: 'Iron Greaves', levelRequired: 15, xpReward: 80, interval: 5000, value: 80, icon: '/assets/items/armor/armor_legs_iron.png', color: 'text-slate-400', description: 'Iron leg guards.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'legs', stats: { defense: 9 }, category: 'armor' },

    // ARMOR: GOLD
    { id: 'armor_gold_helm', name: 'Gold Helm', levelRequired: 25, xpReward: 80, interval: 6000, value: 150, icon: '/assets/items/armor/armor_head_gold.png', color: 'text-yellow-400', description: 'Ornamental but soft.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'head', stats: { defense: 8 }, category: 'armor' },
    { id: 'armor_gold_body', name: 'Gold Chestplate', levelRequired: 25, xpReward: 160, interval: 8000, value: 350, icon: '/assets/items/armor/armor_chest_gold.png', color: 'text-yellow-400', description: 'Status symbol.', inputs: [{ id: 'ore_gold_smelted', count: 5 }], slot: 'body', stats: { defense: 18 }, category: 'armor' },
    { id: 'armor_gold_legs', name: 'Gold Greaves', levelRequired: 25, xpReward: 120, interval: 7000, value: 250, icon: '/assets/items/armor/armor_legs_gold.png', color: 'text-yellow-400', description: 'Shiny leg guards.', inputs: [{ id: 'ore_gold_smelted', count: 3 }], slot: 'legs', stats: { defense: 14 }, category: 'armor' },

    // ARMOR: MITHRIL
    { id: 'armor_mithril_helm', name: 'Mithril Helm', levelRequired: 40, xpReward: 150, interval: 7500, value: 300, icon: '/assets/items/armor/armor_head_mithril.png', color: 'text-cyan-400', description: 'Lightweight protection.', inputs: [{ id: 'ore_mithril_smelted', count: 2 }], slot: 'head', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_mithril_body', name: 'Mithril Chestplate', levelRequired: 40, xpReward: 300, interval: 10000, value: 750, icon: '/assets/items/armor/armor_chest_mithril.png', color: 'text-cyan-400', description: 'Durable mithril plate.', inputs: [{ id: 'ore_mithril_smelted', count: 5 }], slot: 'body', stats: { defense: 28 }, category: 'armor' },
    { id: 'armor_mithril_legs', name: 'Mithril Greaves', levelRequired: 40, xpReward: 220, interval: 8500, value: 500, icon: '/assets/items/armor/armor_legs_mithril.png', color: 'text-cyan-400', description: 'Mithril leg plates.', inputs: [{ id: 'ore_mithril_smelted', count: 3 }], slot: 'legs', stats: { defense: 22 }, category: 'armor' },

    // ARMOR: ADAMANTITE
    { id: 'armor_adamantite_helm', name: 'Adamantite Helm', levelRequired: 55, xpReward: 250, interval: 9000, value: 600, icon: '/assets/items/armor/armor_head_adamantite.png', color: 'text-purple-400', description: 'Hardened alloy helm.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'head', stats: { defense: 18 }, category: 'armor' },
    { id: 'armor_adamantite_body', name: 'Adamantite Chest', levelRequired: 55, xpReward: 500, interval: 12000, value: 1500, icon: '/assets/items/armor/armor_chest_adamantite.png', color: 'text-purple-400', description: 'Superior protection.', inputs: [{ id: 'ore_adamantite_smelted', count: 5 }], slot: 'body', stats: { defense: 42 }, category: 'armor' },
    { id: 'armor_adamantite_legs', name: 'Adamantite Greaves', levelRequired: 55, xpReward: 375, interval: 10500, value: 1000, icon: '/assets/items/armor/armor_legs_adamantite.png', color: 'text-purple-400', description: 'Heavy leg guards.', inputs: [{ id: 'ore_adamantite_smelted', count: 3 }], slot: 'legs', stats: { defense: 32 }, category: 'armor' },

    // ARMOR: EMERALD
    { id: 'armor_emerald_helm', name: 'Emerald Helm', levelRequired: 70, xpReward: 400, interval: 11000, value: 1200, icon: '/assets/items/armor/armor_head_emerald.png', color: 'text-emerald-400', description: 'Crystalline helm.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'head', stats: { defense: 28 }, category: 'armor' },
    { id: 'armor_emerald_body', name: 'Emerald Chestplate', levelRequired: 70, xpReward: 800, interval: 15000, value: 3000, icon: '/assets/items/armor/armor_chest_emerald.png', color: 'text-emerald-400', description: 'Resonates energy.', inputs: [{ id: 'ore_emerald_smelted', count: 5 }], slot: 'body', stats: { defense: 65 }, category: 'armor' },
    { id: 'armor_emerald_legs', name: 'Emerald Greaves', levelRequired: 70, xpReward: 600, interval: 13000, value: 2000, icon: '/assets/items/armor/armor_legs_emerald.png', color: 'text-emerald-400', description: 'Crystal leg guards.', inputs: [{ id: 'ore_emerald_smelted', count: 3 }], slot: 'legs', stats: { defense: 48 }, category: 'armor' },

    // ARMOR: ETERNIUM
    { id: 'armor_eternium_helm', name: 'Eternium Helm', levelRequired: 85, xpReward: 600, interval: 14000, value: 2500, icon: '/assets/items/armor/armor_head_eternium.png', color: 'text-red-500', description: 'Forged from time.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'head', stats: { defense: 40 }, category: 'armor' },
    { id: 'armor_eternium_body', name: 'Eternium Chestplate', levelRequired: 85, xpReward: 1200, interval: 18000, value: 6000, icon: '/assets/items/armor/armor_chest_eternium.png', color: 'text-red-500', description: 'Temporal defense.', inputs: [{ id: 'ore_eternium_smelted', count: 5 }], slot: 'body', stats: { defense: 95 }, category: 'armor' },
    { id: 'armor_eternium_legs', name: 'Eternium Greaves', levelRequired: 85, xpReward: 900, interval: 16000, value: 4000, icon: '/assets/items/armor/armor_legs_eternium.png', color: 'text-red-500', description: 'Timeless durability.', inputs: [{ id: 'ore_eternium_smelted', count: 3 }], slot: 'legs', stats: { defense: 70 }, category: 'armor' },

    // ARMOR: STARFALL
    { id: 'armor_starfall_helm', name: 'Starfall Helm', levelRequired: 99, xpReward: 1000, interval: 20000, value: 5000, icon: '/assets/items/armor/armor_head_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic power.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'head', stats: { defense: 60 }, category: 'armor' },
    { id: 'armor_starfall_body', name: 'Starfall Chestplate', levelRequired: 99, xpReward: 2000, interval: 25000, value: 12000, icon: '/assets/items/armor/armor_chest_starfallalloy.png', color: 'text-indigo-400', description: 'Starlight forged.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 5 }], slot: 'body', stats: { defense: 140 }, category: 'armor' },
    { id: 'armor_starfall_legs', name: 'Starfall Greaves', levelRequired: 99, xpReward: 1500, interval: 22000, value: 8000, icon: '/assets/items/armor/armor_legs_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic protection.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }], slot: 'legs', stats: { defense: 100 }, category: 'armor' },
  ],

  // --- CRAFTING (ASSEMBLY PROTOCOL) ---
  crafting: [
    // WOOD REFINING (Planks)
    { id: 'pine_plank', name: 'Pine Plank', levelRequired: 1, xpReward: 5, interval: 1500, value: 2, icon: '/assets/resources/tree/pine_plank.png', color: 'text-amber-200', description: 'Refined pine wood.', inputs: [{ id: 'pine_log', count: 1 }], category: 'wood_refining' },
    { id: 'oak_plank', name: 'Oak Plank', levelRequired: 15, xpReward: 12, interval: 2200, value: 10, icon: '/assets/resources/tree/oak_plank.png', color: 'text-amber-600', description: 'Refined oak wood.', inputs: [{ id: 'oak_log', count: 1 }], category: 'wood_refining' },
    { id: 'willow_plank', name: 'Willow Plank', levelRequired: 30, xpReward: 22, interval: 3000, value: 20, icon: '/assets/resources/tree/willow_plank.png', color: 'text-emerald-700', description: 'Refined willow wood.', inputs: [{ id: 'willow_log', count: 1 }], category: 'wood_refining' },
    { id: 'yew_plank', name: 'Yew Plank', levelRequired: 45, xpReward: 35, interval: 4000, value: 50, icon: '/assets/resources/tree/yew_plank.png', color: 'text-lime-800', description: 'Refined yew wood.', inputs: [{ id: 'yew_log', count: 1 }], category: 'wood_refining' },
    { id: 'sunwood_plank', name: 'Sunwood Plank', levelRequired: 60, xpReward: 50, interval: 5000, value: 120, icon: '/assets/resources/tree/sunwood_plank.png', color: 'text-orange-400', description: 'Refined sunwood.', inputs: [{ id: 'sunwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'frostbark_plank', name: 'Frostbark Plank', levelRequired: 75, xpReward: 75, interval: 6500, value: 240, icon: '/assets/resources/tree/frostbark_plank.png', color: 'text-cyan-200', description: 'Refined frostbark.', inputs: [{ id: 'frostbark_log', count: 1 }], category: 'wood_refining' },
    { id: 'heartwood_plank', name: 'Heartwood Plank', levelRequired: 85, xpReward: 110, interval: 8000, value: 500, icon: '/assets/resources/tree/heartwood_plank.png', color: 'text-purple-400', description: 'Refined heartwood.', inputs: [{ id: 'heartwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'bloodwood_plank', name: 'Bloodwood Plank', levelRequired: 99, xpReward: 175, interval: 10000, value: 1000, icon: '/assets/resources/tree/bloodwood_plank.png', color: 'text-red-600', description: 'Refined bloodwood.', inputs: [{ id: 'bloodwood_log', count: 1 }], category: 'wood_refining' },

    // WEAPONS
    { id: 'weapon_sword_bronze', name: 'Bronze Sword', levelRequired: 1, xpReward: 20, interval: 3000, value: 15, icon: '/assets/items/sword_bronze.png', color: 'text-orange-600', description: 'Basic sword.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'weapon', stats: { attack: 8 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_iron', name: 'Iron Sword', levelRequired: 15, xpReward: 50, interval: 5000, value: 50, icon: '/assets/items/sword_iron.png', color: 'text-slate-400', description: 'Sharp and reliable.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'weapon', stats: { attack: 18 }, category: 'weapons', combatStyle: 'melee' },
    
    // Bows now use new logs
    { id: 'weapon_shortbow_normal', name: 'Pine Shortbow', levelRequired: 1, xpReward: 20, interval: 2000, value: 10, icon: '/assets/items/bow_normal.png', color: 'text-amber-600', description: 'Simple pine bow.', inputs: [{ id: 'pine_log', count: 2 }], slot: 'weapon', stats: { attack: 6 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_shortbow_oak', name: 'Oak Shortbow', levelRequired: 15, xpReward: 40, interval: 3000, value: 30, icon: '/assets/items/bow_oak.png', color: 'text-amber-700', description: 'Sturdy oak bow.', inputs: [{ id: 'oak_log', count: 2 }], slot: 'weapon', stats: { attack: 14 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_shortbow_willow', name: 'Willow Shortbow', levelRequired: 30, xpReward: 80, interval: 4000, value: 80, icon: '/assets/items/bow_willow.png', color: 'text-emerald-800', description: 'High quality bow.', inputs: [{ id: 'willow_log', count: 3 }], slot: 'weapon', stats: { attack: 24 }, category: 'weapons', combatStyle: 'ranged' },
    
    // Wands now use new logs
    { id: 'weapon_wand_basic', name: 'Pine Wand', levelRequired: 1, xpReward: 25, interval: 2500, value: 20, icon: '/assets/items/wand_basic.png', color: 'text-blue-300', description: 'Channels weak magic.', inputs: [{ id: 'pine_log', count: 3 }], slot: 'weapon', stats: { attack: 5 }, category: 'weapons', combatStyle: 'magic' },
    { id: 'weapon_wand_oak', name: 'Oak Wand', levelRequired: 15, xpReward: 50, interval: 3500, value: 45, icon: '/assets/items/wand_oak.png', color: 'text-amber-600', description: 'Focused magic power.', inputs: [{ id: 'oak_log', count: 3 }], slot: 'weapon', stats: { attack: 12 }, category: 'weapons', combatStyle: 'magic' },
    { id: 'weapon_staff_willow', name: 'Willow Staff', levelRequired: 30, xpReward: 90, interval: 5000, value: 100, icon: '/assets/items/staff_willow.png', color: 'text-emerald-600', description: 'Powerful magical staff.', inputs: [{ id: 'willow_log', count: 4 }], slot: 'weapon', stats: { attack: 22 }, category: 'weapons', combatStyle: 'magic' },
  ],

  // --- FISHING: Updated Fish List ---
  fishing: [
    { 
      id: 'fish_riverminnow', name: 'River Minnow', levelRequired: 1, xpReward: 10, interval: 2500, value: 2, 
      icon: '/assets/resources/fish/fish_riverminnow.png', 
      color: 'text-blue-300', description: 'Small freshwater fish.', requiresMapCompletion: undefined 
    },
    { 
      id: 'fish_redfinsalmon', name: 'Redfin Salmon', levelRequired: 15, xpReward: 25, interval: 4000, value: 5, 
      icon: '/assets/resources/fish/fish_redfinsalmon.png', 
      color: 'text-red-400', description: 'Strong swimmer.', requiresMapCompletion: 2 
    },
    { 
      id: 'fish_silvercarp', name: 'Silver Carp', levelRequired: 30, xpReward: 45, interval: 5500, value: 12, 
      icon: '/assets/resources/fish/fish_silvercarp.png', 
      color: 'text-slate-300', description: 'Shimmers in the light.', requiresMapCompletion: 4 
    },
    { 
      id: 'fish_brineshrimp', name: 'Brine Shrimp', levelRequired: 45, xpReward: 70, interval: 7000, value: 25, 
      icon: '/assets/resources/fish/fish_brineshrimp.png', 
      color: 'text-pink-400', description: 'Salty crustacean.', requiresMapCompletion: 5 
    },
    { 
      id: 'fish_sandstar', name: 'Sand Star', levelRequired: 60, xpReward: 100, interval: 8500, value: 50, 
      icon: '/assets/resources/fish/fish_sandstar.png', 
      color: 'text-amber-200', description: 'Found on the ocean floor.', requiresMapCompletion: 7 
    },
    { 
      id: 'fish_stormcrab', name: 'Storm Crab', levelRequired: 75, xpReward: 150, interval: 10000, value: 100, 
      icon: '/assets/resources/fish/fish_stormcrab.png', 
      color: 'text-indigo-400', description: 'Crackling with energy.', requiresMapCompletion: 8 
    },
    { 
      id: 'fish_deepwatereel', name: 'Deepwater Eel', levelRequired: 85, xpReward: 220, interval: 12000, value: 200, 
      icon: '/assets/resources/fish/fish_deepwatereel.png', 
      color: 'text-cyan-600', description: 'Lurks in the abyss.', requiresMapCompletion: 9 
    },
    { 
      id: 'fish_eternalcthulhu', name: 'Eternal Cthulhu', levelRequired: 99, xpReward: 350, interval: 15000, value: 500, 
      icon: '/assets/resources/fish/fish_eternalcthulhu.png', 
      color: 'text-purple-600', description: 'The old one sleeps no more.', requiresMapCompletion: 10 
    },
  ],

  farming: [
    { id: 'crop_potato', name: 'Raw Potato', levelRequired: 1, xpReward: 10, interval: 10000, value: 3, icon: '/assets/resources/crop_potato.png', color: 'text-yellow-600', description: 'Basic raw food.', requiresMapCompletion: undefined }
  ],

  // --- COOKING: Updated to use new fish ---
  cooking: [
    { 
      id: 'food_minnow_cooked', name: 'Cooked Minnow', levelRequired: 1, xpReward: 15, interval: 2000, value: 5, 
      icon: '/assets/items/food_minnow.png', 
      color: 'text-blue-200', description: 'Heals 10 HP.', healing: 10, slot: 'food',
      inputs: [{ id: 'fish_riverminnow', count: 1 }] 
    },
    { 
      id: 'food_potato_baked', name: 'Baked Potato', levelRequired: 5, xpReward: 20, interval: 3000, value: 8, 
      icon: '/assets/items/food_potato.png', 
      color: 'text-yellow-500', description: 'Heals 15 HP.', healing: 15, slot: 'food',
      inputs: [{ id: 'crop_potato', count: 1 }] 
    },
    { 
      id: 'food_salmon_cooked', name: 'Smoked Salmon', levelRequired: 15, xpReward: 35, interval: 3500, value: 15, 
      icon: '/assets/items/food_salmon.png', 
      color: 'text-red-300', description: 'Heals 30 HP.', healing: 30, slot: 'food',
      inputs: [{ id: 'fish_redfinsalmon', count: 1 }] 
    },
    { 
      id: 'food_carp_cooked', name: 'Roasted Carp', levelRequired: 30, xpReward: 60, interval: 4500, value: 30, 
      icon: '/assets/items/food_carp.png', 
      color: 'text-slate-200', description: 'Heals 50 HP.', healing: 50, slot: 'food',
      inputs: [{ id: 'fish_silvercarp', count: 1 }] 
    },
    { 
      id: 'food_shrimp_cooked', name: 'Grilled Shrimp', levelRequired: 45, xpReward: 90, interval: 5500, value: 60, 
      icon: '/assets/items/food_shrimp.png', 
      color: 'text-pink-300', description: 'Heals 80 HP.', healing: 80, slot: 'food',
      inputs: [{ id: 'fish_brineshrimp', count: 1 }] 
    },
    { 
      id: 'food_crab_cooked', name: 'Steamed Crab', levelRequired: 60, xpReward: 130, interval: 6500, value: 120, 
      icon: '/assets/items/food_crab.png', 
      color: 'text-indigo-300', description: 'Heals 120 HP.', healing: 120, slot: 'food',
      inputs: [{ id: 'fish_stormcrab', count: 1 }] 
    },
    { 
      id: 'food_eel_cooked', name: 'Eel Stew', levelRequired: 75, xpReward: 180, interval: 8000, value: 250, 
      icon: '/assets/items/food_eel.png', 
      color: 'text-cyan-400', description: 'Heals 200 HP.', healing: 200, slot: 'food',
      inputs: [{ id: 'fish_deepwatereel', count: 1 }] 
    },
    { 
      id: 'food_cthulhu_cooked', name: 'Cosmic Soup', levelRequired: 90, xpReward: 300, interval: 10000, value: 600, 
      icon: '/assets/items/food_cthulhu.png', 
      color: 'text-purple-400', description: 'Heals 500 HP.', healing: 500, slot: 'food',
      inputs: [{ id: 'fish_eternalcthulhu', count: 1 }] 
    },
  ],
};

// --- SHOP ITEMS ---
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'axe_steel', name: 'Steel Axe', cost: 100, multiplier: 0.9, skill: 'woodcutting', icon: '/assets/items/axe_steel.png', description: '10% faster chopping.' },
  { id: 'axe_mithril', name: 'Mithril Axe', cost: 500, multiplier: 0.75, skill: 'woodcutting', icon: '/assets/items/axe_mithril.png', description: '25% faster chopping.' },
  { id: 'pickaxe_steel', name: 'Steel Pickaxe', cost: 150, multiplier: 0.9, skill: 'mining', icon: '/assets/items/pickaxe_steel.png', description: '10% faster mining.' },
  { id: 'pickaxe_mithril', name: 'Mithril Pickaxe', cost: 750, multiplier: 0.75, skill: 'mining', icon: '/assets/items/pickaxe_mithril.png', description: '25% faster mining.' },
  { id: 'test_money', name: 'Dev Money', cost: 0, multiplier: 1, skill: 'woodcutting', icon: '/assets/ui/coins.png', description: 'Get 1000 coins (Test).' }
];

// --- ACHIEVEMENTS ---
export const ACHIEVEMENTS: Achievement[] = [
  // Updated condition to check for 'pine_log' since 'log_normal' no longer exists
  { id: 'first_log', name: 'First Chop', icon: '/assets/resources/tree/pine_log.png', description: 'Chop your first pine log.', condition: (state) => (state.inventory['pine_log'] || 0) >= 1 },
  { id: 'rich_noob', name: 'Rich Noob', icon: '/assets/ui/coins.png', description: 'Accumulate 1000 coins.', condition: (state) => state.coins >= 1000 },
  { id: 'novice_woodcutter', name: 'Novice Woodcutter', icon: '/assets/skills/woodcutting.png', description: 'Reach Woodcutting Level 10.', condition: (state) => state.skills.woodcutting.level >= 10 },
  { id: 'combat_initiate', name: 'First Blood', icon: '/assets/skills/attack.png', description: 'Complete the first combat map.', condition: (state) => state.combatStats.maxMapCompleted >= 1 }
];

// --- HELPER ---
export const getItemDetails = (id: string) => {
  if (id === 'coins') return { name: 'Coins', value: 1, icon: '/assets/ui/coins.png' };
  if (id === 'frozen_key') return { name: 'Frozen Key', value: 100, icon: '/assets/items/key_frozen.png', description: 'Opens the Boss door.' };
  
  for (const skill of Object.keys(GAME_DATA)) {
    const item = GAME_DATA[skill].find(i => i.id === id);
    if (item) return item;
  }
  return null;
};