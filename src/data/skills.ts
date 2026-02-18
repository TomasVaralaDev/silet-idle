import type { Resource } from '../types';

export const GAME_DATA: Record<string, Resource[]> = {
  woodcutting: [
    { 
      id: 'pine_log', name: 'Pine Tree', rarity: 'common', level: 1, xpReward: 10, interval: 3000, value: 1, 
      icon: '/assets/resources/tree/pine_log.png', 
      actionImage: '/assets/resources/tree/pine_tree.png', 
      color: 'text-emerald-600', description: 'Common pine wood.', area: undefined 
    },
    { 
      id: 'oak_log', name: 'Oak Tree', rarity: 'common', level: 15, xpReward: 25, interval: 4500, value: 5, 
      icon: '/assets/resources/tree/oak_log.png', 
      actionImage: '/assets/resources/tree/oak_tree.png', 
      color: 'text-amber-700', description: 'Sturdy oak wood.', area: 2 
    },
    { 
      id: 'willow_log', name: 'Willow Tree', rarity: 'uncommon', level: 30, xpReward: 45, interval: 6000, value: 10, 
      icon: '/assets/resources/tree/willow_log.png', 
      actionImage: '/assets/resources/tree/willow_tree.png', 
      color: 'text-emerald-800', description: 'Flexible willow wood.', area: 4 
    },
    { 
      id: 'yew_log', name: 'Yew Tree', rarity: 'uncommon', level: 45, xpReward: 70, interval: 7500, value: 25, 
      icon: '/assets/resources/tree/yew_log.png', 
      actionImage: '/assets/resources/tree/yew_tree.png', 
      color: 'text-lime-900', description: 'Strong and dark wood.', area: 6 
    },
    { 
      id: 'sunwood_log', name: 'Sunwood Tree', rarity: 'rare', level: 60, xpReward: 100, interval: 9000, value: 60, 
      icon: '/assets/resources/tree/sunwood_log.png', 
      actionImage: '/assets/resources/tree/sunwood_tree.png', 
      color: 'text-orange-500', description: 'Radiates a warm glow.', area: 7 
    },
    { 
      id: 'frostbark_log', name: 'Frostbark Tree', rarity: 'rare', level: 75, xpReward: 150, interval: 11000, value: 120, 
      icon: '/assets/resources/tree/frostbark_log.png', 
      actionImage: '/assets/resources/tree/frostbark_tree.png', 
      color: 'text-cyan-300', description: 'Cold to the touch.', area: 8 
    },
    { 
      id: 'heartwood_log', name: 'Heartwood Tree', rarity: 'legendary', level: 85, xpReward: 220, interval: 13000, value: 250, 
      icon: '/assets/resources/tree/heartwood_log.png', 
      actionImage: '/assets/resources/tree/heartwood_tree.png', 
      color: 'text-purple-500', description: 'Pulsating with energy.', area: 9 
    },
    { 
      id: 'bloodwood_log', name: 'Bloodwood Tree', rarity: 'legendary', level: 99, xpReward: 350, interval: 16000, value: 500, 
      icon: '/assets/resources/tree/bloodwood_log.png', 
      actionImage: '/assets/resources/tree/bloodwood_tree.png', 
      color: 'text-red-700', description: 'Crimson red ancient wood.', area: 10 
    },
  ],
  mining: [
    { id: 'ore_copper', name: 'Copper Ore', rarity: 'common', level: 1, xpReward: 10, interval: 3000, value: 2, icon: '/assets/resources/ore/ore_copper.png', color: 'text-orange-500', description: 'Basic conductive metal.' },
    { id: 'ore_iron', name: 'Iron Ore', rarity: 'common', level: 10, xpReward: 20, interval: 4500, value: 5, icon: '/assets/resources/ore/ore_iron.png', color: 'text-slate-400', description: 'Strong structural metal.', area: 3 },
    { id: 'ore_gold', name: 'Gold Ore', rarity: 'uncommon', level: 25, xpReward: 35, interval: 6000, value: 15, icon: '/assets/resources/ore/ore_gold.png', color: 'text-yellow-400', description: 'Highly conductive and valuable.', area: 5 },
    { id: 'ore_mithril', name: 'Mithril Ore', rarity: 'uncommon', level: 40, xpReward: 55, interval: 8000, value: 30, icon: '/assets/resources/ore/ore_mithril.png', color: 'text-cyan-400', description: 'Lightweight and durable.', area: 7 },
    { id: 'ore_adamantite', name: 'Adamantite Ore', rarity: 'rare', level: 55, xpReward: 80, interval: 10000, value: 60, icon: '/assets/resources/ore/ore_adamantite.png', color: 'text-purple-400', description: 'Extremely hard alloy source.', area: 8 },
    { id: 'ore_emerald', name: 'Emerald Ore', rarity: 'rare', level: 70, xpReward: 110, interval: 12000, value: 100, icon: '/assets/resources/ore/ore_emerald.png', color: 'text-emerald-400', description: 'Crystalline metal structure.', area: 9 },
    { id: 'ore_eternium', name: 'Eternium Ore', rarity: 'legendary', level: 85, xpReward: 150, interval: 15000, value: 200, icon: '/assets/resources/ore/ore_eternium.png', color: 'text-red-500', description: 'Resonates with time.', area: 10 },
    { id: 'ore_starfallalloy', name: 'Starfall Ore', rarity: 'legendary', level: 99, xpReward: 250, interval: 20000, value: 500, icon: '/assets/resources/ore/ore_starfallalloy.png', color: 'text-indigo-400', description: 'Material from the cosmos.' }
  ],
foraging: [
    // TIER 1
    {
      id: 'red_mushroom', name: 'Red Mushroom', level: 1, xpReward: 10, interval: 2500, value: 5, rarity: 'common',
      icon: '/assets/resources/foraging/tier1_mushroom.png', description: 'A common red mushroom.',
      drops: [{ itemId: 'red_mushroom', chance: 100, amountMin: 1, amountMax: 1 }, { itemId: 'red_stick', chance: 100, amountMin: 1, amountMax: 1 }]
    },
    // TIER 2
    {
      id: 'white_stick', name: 'White Stick', level: 10, xpReward: 20, interval: 3500, value: 10, rarity: 'common',
      icon: '/assets/resources/foraging/tier2_stick.png', description: 'A pale, sturdy stick.',
      drops: [{ itemId: 'white_stick', chance: 100, amountMin: 1, amountMax: 1 }]
    },
    // TIER 3: Flame Flower & Big Leaf (LISÄTTY DROP)
    {
      id: 'flame_flower', name: 'Flame Flower', level: 25, xpReward: 35, interval: 4500, value: 25, rarity: 'uncommon',
      icon: '/assets/resources/foraging/tier3_flower.png', description: 'Warm to the touch.',
      drops: [
        { itemId: 'flame_flower', chance: 100, amountMin: 1, amountMax: 1 },
        { itemId: 'tier3_bigleaf', chance: 100, amountMin: 1, amountMax: 1 } // LISÄTTY
      ]
    },
    // TIER 4
    {
      id: 'dark_leaf', name: 'Dark Leaf', level: 40, xpReward: 55, interval: 6000, value: 40, rarity: 'uncommon',
      icon: '/assets/resources/foraging/tier4_leaf.png', description: 'A leaf from shadow groves.',
      drops: [{ itemId: 'dark_leaf', chance: 100, amountMin: 1, amountMax: 1 }]
    },
    // TIER 5
    {
      id: 'golden_flower', name: 'Golden Flower', level: 55, xpReward: 80, interval: 7500, value: 75, rarity: 'rare',
      icon: '/assets/resources/foraging/tier5_bigleaf.png', description: 'Shimmers with light.',
      drops: [{ itemId: 'golden_flower', chance: 100, amountMin: 1, amountMax: 1 }]
    },
    // TIER 6
    {
      id: 'green_leaf', name: 'Green Leaf', level: 70, xpReward: 120, interval: 9000, value: 100, rarity: 'rare',
      icon: '/assets/resources/foraging/tier6_bigleaf.png', description: 'A large vibrant leaf.',
      drops: [{ itemId: 'green_leaf', chance: 100, amountMin: 1, amountMax: 1 }, { itemId: 'green_mushroom', chance: 100, amountMin: 1, amountMax: 1 }]
    },
    // TIER 7
    {
      id: 'eternal_flower', name: 'Eternal Flower', level: 85, xpReward: 200, interval: 12000, value: 250, rarity: 'epic',
      icon: '/assets/resources/foraging/tier7_bigflower.png', description: 'Never wilts.',
      drops: [{ itemId: 'eternal_flower', chance: 100, amountMin: 1, amountMax: 1 }]
    },
    // TIER 8
    {
      id: 'dragon_flower', name: 'Dragon Flower', level: 99, xpReward: 350, interval: 15000, value: 500, rarity: 'legendary',
      icon: '/assets/resources/foraging/tier8_flower.png', description: 'Forged in dragonfire.',
      drops: [{ itemId: 'dragon_flower', chance: 100, amountMin: 1, amountMax: 1 }]
    }
  ],

  // ---------------------------------------------------------
  // ALCHEMY (Potions)
  // ---------------------------------------------------------
  alchemy: [
    // POTION TIER 1: Stick + Mushroom
    { 
      id: 'potion_tier1', name: 'Weak Potion', level: 1, xpReward: 20, interval: 2000, value: 15, rarity: 'common',
      icon: '/assets/items/alchemy/potion_tier1.png', description: 'A basic brew.', category: 'potion',
      slot: 'food',
      healing: 20,
      inputs: [
        { id: 'red_stick', count: 1 }, 
        { id: 'red_mushroom', count: 1 }
      ] 
    },
    // POTION TIER 2: Mushroom + T2 Stick
    { 
      id: 'potion_tier2', name: 'Minor Potion', level: 10, xpReward: 40, interval: 3000, value: 30, rarity: 'common',
      icon: '/assets/items/alchemy/potion_tier2.png', description: 'Slightly better taste.', category: 'potion',
      slot: 'food',
      healing: 50,
      inputs: [
        { id: 'red_mushroom', count: 1 }, 
        { id: 'white_stick', count: 1 }
      ] 
    },
    // POTION TIER 3: T3 Flower + T3 Bigleaf (Simuloitu White Stickillä, koska T3 bigleaf puuttui datasta)
    { 
      id: 'potion_tier3', name: 'Lesser Potion', level: 25, xpReward: 70, interval: 4000, value: 60, rarity: 'uncommon',
      icon: '/assets/items/alchemy/potion_tier3.png', description: 'Bubbles with heat.', category: 'potion',
      slot: 'food',
      healing: 120,
      inputs: [
        { id: 'flame_flower', count: 1 }, 
        { id: 'white_stick', count: 1 } // Käytetään tätä täytteenä
      ] 
    },
    // POTION TIER 4: T4 Leaf + T2 Stick
    { 
      id: 'potion_tier4', name: 'Medium Potion', level: 40, xpReward: 110, interval: 5000, value: 120, rarity: 'uncommon',
      icon: '/assets/items/alchemy/potion_tier4.png', description: 'Standard adventurer brew.', category: 'potion',
      slot: 'food',
      healing: 250,
      inputs: [
        { id: 'dark_leaf', count: 1 }, 
        { id: 'white_stick', count: 1 }
      ] 
    },
    // POTION TIER 5: T5 Bigleaf + T4 Leaf + T3 Bigleaf (simuloitu Flame Flowerilla)
    { 
      id: 'potion_tier5', name: 'Greater Potion', level: 55, xpReward: 160, interval: 6500, value: 250, rarity: 'rare',
      icon: '/assets/items/alchemy/potion_tier5.png', description: 'Radiates power.', category: 'potion',
      slot: 'food',
      healing: 500,
      inputs: [
        { id: 'golden_flower', count: 1 }, 
        { id: 'dark_leaf', count: 1 },
        { id: 'flame_flower', count: 1 }
      ] 
    },
    // POTION TIER 6: T6 Bigleaf + T6 Mushroom
    { 
      id: 'potion_tier6', name: 'Super Potion', level: 70, xpReward: 240, interval: 8000, value: 500, rarity: 'rare',
      icon: '/assets/items/alchemy/potion_tier6.png', description: 'Vitality in a bottle.', category: 'potion',
      slot: 'food',
      healing: 1000,
      inputs: [
        { id: 'green_leaf', count: 1 }, 
        { id: 'green_mushroom', count: 1 }
      ] 
    },
    // POTION TIER 7: T7 Bigflower + T6 Mushroom
    { 
      id: 'potion_tier7', name: 'Master Potion', level: 85, xpReward: 350, interval: 10000, value: 1000, rarity: 'epic',
      icon: '/assets/items/alchemy/potion_tier7.png', description: ' brewed by masters.', category: 'potion',
      slot: 'food',
      healing: 2500,
      inputs: [
        { id: 'eternal_flower', count: 1 }, 
        { id: 'green_mushroom', count: 1 }
      ] 
    },
    // POTION TIER 8: T8 Flower + T7 Bigflower + T6 Mushroom
    { 
      id: 'potion_tier8', name: 'Divine Potion', level: 99, xpReward: 500, interval: 15000, value: 2500, rarity: 'legendary',
      icon: '/assets/items/alchemy/potion_tier8.png', description: 'Drink of the gods.', category: 'potion',
      slot: 'food',
      healing: 10000,
      inputs: [
        { id: 'dragon_flower', count: 1 }, 
        { id: 'eternal_flower', count: 1 },
        { id: 'green_mushroom', count: 1 }
      ] 
    }
  ],

  // ---------------------------------------------------------
  // LOOT (Sivutuotteet jotta inventory ja kuvat toimivat)
  // ---------------------------------------------------------
  foraging_loot: [
    {
      // TIER 1
      id: 'red_stick',
      name: 'Red Stick',
      value: 2,
      rarity: 'common',
      icon: '/assets/resources/foraging/tier1_stick.png',
      description: 'A simple red stick.',
      level: 1, interval: 0
    },
    // Tier 3
    {
      id: 'tier3_bigleaf',
      name: 'Big Leaf',
      value: 15,
      rarity: 'uncommon',
      icon: '/assets/resources/foraging/tier3_bigleaf.png',
      description: 'A large, sturdy leaf.',
      level: 25, interval: 0
    },
    // TIER 6
    {
      id: 'green_mushroom',
      name: 'Green Mushroom',
      value: 50,
      rarity: 'rare',
      icon: '/assets/resources/foraging/tier6_mushroom.png',
      description: 'A rare green mushroom.',
      level: 1, interval: 0
    }
  ],
  smithing: [
    { id: 'ore_copper_smelted', name: 'Copper Ingot', rarity: 'common', level: 1, xpReward: 5, interval: 2000, value: 5, icon: '/assets/resources/ore/ore_copper_smelted.png', color: 'text-orange-500', description: 'Smelted copper ingot.', inputs: [{ id: 'ore_copper', count: 1 }] },
    { id: 'ore_iron_smelted', name: 'Iron Ingot', rarity: 'common', level: 10, xpReward: 10, interval: 3000, value: 15, icon: '/assets/resources/ore/ore_iron_smelted.png', color: 'text-slate-400', description: 'Smelted iron ingot.', inputs: [{ id: 'ore_iron', count: 1 }] },
    { id: 'ore_gold_smelted', name: 'Gold Ingot', rarity: 'uncommon', level: 25, xpReward: 20, interval: 4000, value: 45, icon: '/assets/resources/ore/ore_gold_smelted.png', color: 'text-yellow-400', description: 'Refined gold ingot.', inputs: [{ id: 'ore_gold', count: 1 }] },
    { id: 'ore_mithril_smelted', name: 'Mithril Ingot', rarity: 'uncommon', level: 40, xpReward: 35, interval: 5000, value: 90, icon: '/assets/resources/ore/ore_mithril_smelted.png', color: 'text-cyan-400', description: 'Refined mithril alloy.', inputs: [{ id: 'ore_mithril', count: 1 }] },
    { id: 'ore_adamantite_smelted', name: 'Adamantite Ingot', rarity: 'rare', level: 55, xpReward: 50, interval: 6000, value: 180, icon: '/assets/resources/ore/ore_adamantite_smelted.png', color: 'text-purple-400', description: 'Hardened adamantite ingot.', inputs: [{ id: 'ore_adamantite', count: 1 }] },
    { id: 'ore_emerald_smelted', name: 'Emerald Refined', rarity: 'rare', level: 70, xpReward: 70, interval: 7000, value: 300, icon: '/assets/resources/ore/ore_emerald_smelted.png', color: 'text-emerald-400', description: 'Pure energy crystal.', inputs: [{ id: 'ore_emerald', count: 1 }] },
    { id: 'ore_eternium_smelted', name: 'Eternium Ingot', rarity: 'legendary', level: 85, xpReward: 100, interval: 8000, value: 600, icon: '/assets/resources/ore/ore_eternium_smelted.png', color: 'text-red-500', description: 'Temporal alloy ingot.', inputs: [{ id: 'ore_eternium', count: 1 }] },
    { id: 'ore_starfallalloy_smelted', name: 'Starfall Ingot', rarity: 'legendary', level: 99, xpReward: 150, interval: 10000, value: 1500, icon: '/assets/resources/ore/ore_starfallalloy_smelted.png', color: 'text-indigo-400', description: 'Cosmic alloy ingot.', inputs: [{ id: 'ore_starfallalloy', count: 1 }] },
    { id: 'armor_bronze_helm', name: 'Bronze Helm', rarity: 'common', level: 1, xpReward: 20, interval: 3000, value: 10, icon: '/assets/items/armor/armor_head_bronze.png', color: 'text-orange-700', description: 'Basic protection.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'head', stats: { defense: 2 }, category: 'armor' },
    { id: 'armor_bronze_body', name: 'Bronze Chestplate', rarity: 'common', level: 1, xpReward: 40, interval: 4000, value: 25, icon: '/assets/items/armor/armor_chest_bronze.png', color: 'text-orange-700', description: 'Covers the chest.', inputs: [{ id: 'ore_copper_smelted', count: 4 }], slot: 'body', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_bronze_legs', name: 'Bronze Greaves', rarity: 'common', level: 1, xpReward: 30, interval: 3500, value: 20, icon: '/assets/items/armor/armor_legs_bronze.png', color: 'text-orange-700', description: 'Protects legs.', inputs: [{ id: 'ore_copper_smelted', count: 3 }], slot: 'legs', stats: { defense: 4 }, category: 'armor' },
    { id: 'armor_iron_helm', name: 'Iron Helm', rarity: 'common', level: 15, xpReward: 50, interval: 4500, value: 40, icon: '/assets/items/armor/armor_head_iron.png', color: 'text-slate-400', description: 'Sturdy iron helm.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'head', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_iron_body', name: 'Iron Chestplate', rarity: 'common', level: 15, xpReward: 100, interval: 6000, value: 100, icon: '/assets/items/armor/armor_chest_iron.png', color: 'text-slate-400', description: 'Heavy iron armor.', inputs: [{ id: 'ore_iron_smelted', count: 5 }], slot: 'body', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_iron_legs', name: 'Iron Greaves', rarity: 'common', level: 15, xpReward: 80, interval: 5000, value: 80, icon: '/assets/items/armor/armor_legs_iron.png', color: 'text-slate-400', description: 'Iron leg guards.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'legs', stats: { defense: 9 }, category: 'armor' },
    { id: 'armor_gold_helm', name: 'Gold Helm', rarity: 'uncommon', level: 25, xpReward: 80, interval: 6000, value: 150, icon: '/assets/items/armor/armor_head_gold.png', color: 'text-yellow-400', description: 'Ornamental but soft.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'head', stats: { defense: 8 }, category: 'armor' },
    { id: 'armor_gold_body', name: 'Gold Chestplate', rarity: 'uncommon', level: 25, xpReward: 160, interval: 8000, value: 350, icon: '/assets/items/armor/armor_chest_gold.png', color: 'text-yellow-400', description: 'Status symbol.', inputs: [{ id: 'ore_gold_smelted', count: 5 }], slot: 'body', stats: { defense: 18 }, category: 'armor' },
    { id: 'armor_gold_legs', name: 'Gold Greaves', rarity: 'uncommon', level: 25, xpReward: 120, interval: 7000, value: 250, icon: '/assets/items/armor/armor_legs_gold.png', color: 'text-yellow-400', description: 'Shiny leg guards.', inputs: [{ id: 'ore_gold_smelted', count: 3 }], slot: 'legs', stats: { defense: 14 }, category: 'armor' },
    { id: 'armor_mithril_helm', name: 'Mithril Helm', rarity: 'uncommon', level: 40, xpReward: 150, interval: 7500, value: 300, icon: '/assets/items/armor/armor_head_mithril.png', color: 'text-cyan-400', description: 'Lightweight protection.', inputs: [{ id: 'ore_mithril_smelted', count: 2 }], slot: 'head', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_mithril_body', name: 'Mithril Chestplate', rarity: 'uncommon', level: 40, xpReward: 300, interval: 10000, value: 750, icon: '/assets/items/armor/armor_chest_mithril.png', color: 'text-cyan-400', description: 'Durable mithril plate.', inputs: [{ id: 'ore_mithril_smelted', count: 5 }], slot: 'body', stats: { defense: 28 }, category: 'armor' },
    { id: 'armor_mithril_legs', name: 'Mithril Greaves', rarity: 'uncommon', level: 40, xpReward: 220, interval: 8500, value: 500, icon: '/assets/items/armor/armor_legs_mithril.png', color: 'text-cyan-400', description: 'Mithril leg plates.', inputs: [{ id: 'ore_mithril_smelted', count: 3 }], slot: 'legs', stats: { defense: 22 }, category: 'armor' },
    { id: 'armor_adamantite_helm', name: 'Adamantite Helm', rarity: 'rare', level: 55, xpReward: 250, interval: 9000, value: 600, icon: '/assets/items/armor/armor_head_adamantite.png', color: 'text-purple-400', description: 'Hardened alloy helm.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'head', stats: { defense: 18 }, category: 'armor' },
    { id: 'armor_adamantite_body', name: 'Adamantite Chest', rarity: 'rare', level: 55, xpReward: 500, interval: 12000, value: 1500, icon: '/assets/items/armor/armor_chest_adamantite.png', color: 'text-purple-400', description: 'Superior protection.', inputs: [{ id: 'ore_adamantite_smelted', count: 5 }], slot: 'body', stats: { defense: 42 }, category: 'armor' },
    { id: 'armor_adamantite_legs', name: 'Adamantite Greaves', rarity: 'rare', level: 55, xpReward: 375, interval: 10500, value: 1000, icon: '/assets/items/armor/armor_legs_adamantite.png', color: 'text-purple-400', description: 'Heavy leg guards.', inputs: [{ id: 'ore_adamantite_smelted', count: 3 }], slot: 'legs', stats: { defense: 32 }, category: 'armor' },
    { id: 'armor_emerald_helm', name: 'Emerald Helm', rarity: 'rare', level: 70, xpReward: 400, interval: 11000, value: 1200, icon: '/assets/items/armor/armor_head_emerald.png', color: 'text-emerald-400', description: 'Crystalline helm.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'head', stats: { defense: 28 }, category: 'armor' },
    { id: 'armor_emerald_body', name: 'Emerald Chestplate', rarity: 'rare', level: 70, xpReward: 800, interval: 15000, value: 3000, icon: '/assets/items/armor/armor_chest_emerald.png', color: 'text-emerald-400', description: 'Resonates energy.', inputs: [{ id: 'ore_emerald_smelted', count: 5 }], slot: 'body', stats: { defense: 65 }, category: 'armor' },
    { id: 'armor_emerald_legs', name: 'Emerald Greaves', rarity: 'rare', level: 70, xpReward: 600, interval: 13000, value: 2000, icon: '/assets/items/armor/armor_legs_emerald.png', color: 'text-emerald-400', description: 'Crystal leg guards.', inputs: [{ id: 'ore_emerald_smelted', count: 3 }], slot: 'legs', stats: { defense: 48 }, category: 'armor' },
    { id: 'armor_eternium_helm', name: 'Eternium Helm', rarity: 'legendary', level: 85, xpReward: 600, interval: 14000, value: 2500, icon: '/assets/items/armor/armor_head_eternium.png', color: 'text-red-500', description: 'Forged from time.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'head', stats: { defense: 40 }, category: 'armor' },
    { id: 'armor_eternium_body', name: 'Eternium Chestplate', rarity: 'legendary', level: 85, xpReward: 1200, interval: 18000, value: 6000, icon: '/assets/items/armor/armor_chest_eternium.png', color: 'text-red-500', description: 'Temporal defense.', inputs: [{ id: 'ore_eternium_smelted', count: 5 }], slot: 'body', stats: { defense: 95 }, category: 'armor' },
    { id: 'armor_eternium_legs', name: 'Eternium Greaves', rarity: 'legendary', level: 85, xpReward: 900, interval: 16000, value: 4000, icon: '/assets/items/armor/armor_legs_eternium.png', color: 'text-red-500', description: 'Timeless durability.', inputs: [{ id: 'ore_eternium_smelted', count: 3 }], slot: 'legs', stats: { defense: 70 }, category: 'armor' },
    { id: 'armor_starfall_helm', name: 'Starfall Helm', rarity: 'legendary', level: 99, xpReward: 1000, interval: 20000, value: 5000, icon: '/assets/items/armor/armor_head_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic power.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'head', stats: { defense: 60 }, category: 'armor' },
    { id: 'armor_starfall_body', name: 'Starfall Chestplate', rarity: 'legendary', level: 99, xpReward: 2000, interval: 25000, value: 12000, icon: '/assets/items/armor/armor_chest_starfallalloy.png', color: 'text-indigo-400', description: 'Starlight forged.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 5 }], slot: 'body', stats: { defense: 140 }, category: 'armor' },
    { id: 'armor_starfall_legs', name: 'Starfall Greaves', rarity: 'legendary', level: 99, xpReward: 1500, interval: 22000, value: 8000, icon: '/assets/items/armor/armor_legs_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic protection.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }], slot: 'legs', stats: { defense: 100 }, category: 'armor' },
    { id: 'ring_iron', name: 'Iron Ring', rarity: 'common', level: 15, xpReward: 35, interval: 4000, value: 50, icon: '/assets/items/ring/ring_iron.png', color: 'text-slate-400', description: 'Simple iron band.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'ring', stats: { attack: 1, defense: 1 }, category: 'rings' },
    { id: 'ring_gold', name: 'Gold Ring', rarity: 'uncommon', level: 25, xpReward: 55, interval: 5000, value: 120, icon: '/assets/items/ring/ring_gold.png', color: 'text-yellow-400', description: 'Precious gold band.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'ring', stats: { attack: 3, defense: 3 }, category: 'rings' },
    { id: 'ring_adamantite', name: 'Adamantite Ring', rarity: 'rare', level: 55, xpReward: 110, interval: 7000, value: 500, icon: '/assets/items/ring/ring_adamantite.png', color: 'text-purple-400', description: 'Hardened alloy ring.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'ring', stats: { attack: 6, defense: 6 }, category: 'rings' },
    { id: 'ring_emerald', name: 'Emerald Ring', rarity: 'rare', level: 70, xpReward: 160, interval: 9000, value: 1000, icon: '/assets/items/ring/ring_emerald.png', color: 'text-emerald-400', description: 'Infused with energy.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'ring', stats: { attack: 10, defense: 10 }, category: 'rings' },
    { id: 'ring_eternium', name: 'Eternium Ring', rarity: 'legendary', level: 85, xpReward: 230, interval: 12000, value: 2500, icon: '/assets/items/ring/ring_eternium.png', color: 'text-red-500', description: 'Vibrates with power.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'ring', stats: { attack: 15, defense: 15 }, category: 'rings' },
    { id: 'ring_starfallalloy', name: 'Starfall Ring', rarity: 'legendary', level: 99, xpReward: 380, interval: 15000, value: 5000, icon: '/assets/items/ring/ring_starfallalloy.png', color: 'text-indigo-400', description: 'Forged from stars.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'ring', stats: { attack: 20, defense: 20 }, category: 'rings' },
    { id: 'shield_copper', name: 'Copper Shield', rarity: 'common', level: 5, xpReward: 25, interval: 3500, value: 60, icon: '/assets/items/shields/shield_copper.png', color: 'text-orange-400', description: 'A basic defensive buckler.', inputs: [{ id: 'ore_copper_smelted', count: 3 }], slot: 'shield', stats: { defense: 8 }, category: 'shields' },
    { id: 'shield_iron', name: 'Iron Shield', rarity: 'common', level: 15, xpReward: 45, interval: 4500, value: 150, icon: '/assets/items/shields/shield_iron.png', color: 'text-slate-400', description: 'Standard infantry shield.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'shield', stats: { defense: 18 }, category: 'shields' },
    { id: 'shield_gold', name: 'Gold Shield', rarity: 'uncommon', level: 25, xpReward: 70, interval: 5500, value: 350, icon: '/assets/items/shields/shield_gold.png', color: 'text-yellow-400', description: 'Heavy and ceremonial.', inputs: [{ id: 'ore_gold_smelted', count: 3 }], slot: 'shield', stats: { defense: 28 }, category: 'shields' },
    { id: 'shield_mithril', name: 'Mithril Shield', rarity: 'uncommon', level: 40, xpReward: 100, interval: 6500, value: 900, icon: '/assets/items/shields/shield_mithril.png', color: 'text-blue-300', description: 'Lightweight elven metal.', inputs: [{ id: 'ore_mithril_smelted', count: 3 }], slot: 'shield', stats: { defense: 42, attack: 2 }, category: 'shields' },
    { id: 'shield_adamantite', name: 'Adamantite Shield', rarity: 'rare', level: 55, xpReward: 140, interval: 8000, value: 2000, icon: '/assets/items/shields/shield_adamantite.png', color: 'text-purple-400', description: 'Impenetrable alloy plating.', inputs: [{ id: 'ore_adamantite_smelted', count: 3 }], slot: 'shield', stats: { defense: 60, attack: 4 }, category: 'shields' },
    { id: 'shield_emerald', name: 'Emerald Shield', rarity: 'rare', level: 70, xpReward: 200, interval: 10000, value: 4000, icon: '/assets/items/shields/shield_emerald.png', color: 'text-emerald-400', description: 'Radiates protective energy.', inputs: [{ id: 'ore_emerald_smelted', count: 3 }], slot: 'shield', stats: { defense: 85, attack: 6 }, category: 'shields' },
    { id: 'shield_eternium', name: 'Eternium Shield', rarity: 'legendary', level: 85, xpReward: 300, interval: 13000, value: 7500, icon: '/assets/items/shields/shield_eternium.png', color: 'text-red-500', description: 'Forged in dragonfire.', inputs: [{ id: 'ore_eternium_smelted', count: 3 }], slot: 'shield', stats: { defense: 110, attack: 10 }, category: 'shields' },
    { id: 'shield_starfall', name: 'Starfall Shield', rarity: 'legendary', level: 99, xpReward: 500, interval: 18000, value: 15000, icon: '/assets/items/shields/shield_starfall.png', color: 'text-indigo-400', description: 'Deflects the cosmos itself.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }], slot: 'shield', stats: { defense: 150, attack: 20 }, category: 'shields' },
  ],
  crafting: [
    { id: 'pine_plank', name: 'Pine Plank', rarity: 'common', level: 1, xpReward: 5, interval: 1500, value: 2, icon: '/assets/resources/tree/pine_plank.png', color: 'text-amber-200', description: 'Refined pine wood.', inputs: [{ id: 'pine_log', count: 1 }], category: 'wood_refining' },
    { id: 'oak_plank', name: 'Oak Plank', rarity: 'common', level: 15, xpReward: 12, interval: 2200, value: 10, icon: '/assets/resources/tree/oak_plank.png', color: 'text-amber-600', description: 'Refined oak wood.', inputs: [{ id: 'oak_log', count: 1 }], category: 'wood_refining' },
    { id: 'willow_plank', name: 'Willow Plank', rarity: 'uncommon', level: 30, xpReward: 22, interval: 3000, value: 20, icon: '/assets/resources/tree/willow_plank.png', color: 'text-emerald-700', description: 'Refined willow wood.', inputs: [{ id: 'willow_log', count: 1 }], category: 'wood_refining' },
    { id: 'yew_plank', name: 'Yew Plank', rarity: 'uncommon', level: 45, xpReward: 35, interval: 4000, value: 50, icon: '/assets/resources/tree/yew_plank.png', color: 'text-lime-800', description: 'Refined yew wood.', inputs: [{ id: 'yew_log', count: 1 }], category: 'wood_refining' },
    { id: 'sunwood_plank', name: 'Sunwood Plank', rarity: 'rare', level: 60, xpReward: 50, interval: 5000, value: 120, icon: '/assets/resources/tree/sunwood_plank.png', color: 'text-orange-400', description: 'Refined sunwood.', inputs: [{ id: 'sunwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'frostbark_plank', name: 'Frostbark Plank', rarity: 'rare', level: 75, xpReward: 75, interval: 6500, value: 240, icon: '/assets/resources/tree/frostbark_plank.png', color: 'text-cyan-200', description: 'Refined frostbark.', inputs: [{ id: 'frostbark_log', count: 1 }], category: 'wood_refining' },
    { id: 'heartwood_plank', name: 'Heartwood Plank', rarity: 'legendary', level: 85, xpReward: 110, interval: 8000, value: 500, icon: '/assets/resources/tree/heartwood_plank.png', color: 'text-purple-400', description: 'Refined heartwood.', inputs: [{ id: 'heartwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'bloodwood_plank', name: 'Bloodwood Plank', rarity: 'legendary', level: 99, xpReward: 175, interval: 10000, value: 1000, icon: '/assets/resources/tree/bloodwood_plank.png', color: 'text-red-600', description: 'Refined bloodwood.', inputs: [{ id: 'bloodwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'weapon_sword_bronze', name: 'Bronze Sword', rarity: 'common', level: 1, xpReward: 20, interval: 3000, value: 15, icon: '/assets/items/weapons/weapon_sword_bronze.png', color: 'text-orange-600', description: 'Basic sword.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'weapon', stats: { attack: 8 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_iron', name: 'Iron Sword', rarity: 'common', level: 15, xpReward: 50, interval: 5000, value: 50, icon: '/assets/items/weapons/weapon_sword_iron.png', color: 'text-slate-400', description: 'Sharp and reliable.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'weapon', stats: { attack: 18 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_gold', name: 'Gold Sword', rarity: 'uncommon', level: 25, xpReward: 70, interval: 6500, value: 120, icon: '/assets/items/weapons/weapon_sword_gold.png', color: 'text-yellow-400', description: 'Shiny and heavy.', inputs: [{ id: 'ore_gold_smelted', count: 3 }], slot: 'weapon', stats: { attack: 30 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_mithril', name: 'Mithril Sword', rarity: 'uncommon', level: 40, xpReward: 100, interval: 8000, value: 250, icon: '/assets/items/weapons/weapon_sword_mithril.png', color: 'text-cyan-400', description: 'Lightweight blade.', inputs: [{ id: 'ore_mithril_smelted', count: 3 }], slot: 'weapon', stats: { attack: 50 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_adamantite', name: 'Adamantite Sword', rarity: 'rare', level: 55, xpReward: 150, interval: 9500, value: 500, icon: '/assets/items/weapons/weapon_sword_adamantite.png', color: 'text-purple-400', description: 'Extremely hard edge.', inputs: [{ id: 'ore_adamantite_smelted', count: 3 }], slot: 'weapon', stats: { attack: 80 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_emerald', name: 'Emerald Sword', rarity: 'rare', level: 70, xpReward: 220, interval: 11000, value: 1000, icon: '/assets/items/weapons/weapon_sword_emerald.png', color: 'text-emerald-400', description: 'Crystalline power.', inputs: [{ id: 'ore_emerald_smelted', count: 3 }], slot: 'weapon', stats: { attack: 120 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_eternium', name: 'Eternium Sword', rarity: 'legendary', level: 85, xpReward: 350, interval: 13000, value: 2500, icon: '/assets/items/weapons/weapon_sword_eternium.png', color: 'text-red-500', description: 'Blade out of time.', inputs: [{ id: 'ore_eternium_smelted', count: 3 }], slot: 'weapon', stats: { attack: 180 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_starfallalloy', name: 'Starfall Sword', rarity: 'legendary', level: 99, xpReward: 500, interval: 16000, value: 5000, icon: '/assets/items/weapons/weapon_sword_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic destruction.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }], slot: 'weapon', stats: { attack: 250 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_excalibur', name: 'Excalibur', rarity: 'legendary', level: 1, xpReward: 20, interval: 3000, value: 15, icon: '/assets/items/weapons/weapon_sword_excalibur.png', color: 'text-red-500', description: 'super duper dev ultra makee miekka.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'weapon', stats: { attack: 100000000000000000 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'necklace_iron', name: 'Iron Necklace', rarity: 'common', level: 15, xpReward: 40, interval: 4000, value: 60, icon: '/assets/items/necklace/necklace_iron.png', color: 'text-slate-400', description: 'Basic iron chain.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'necklace', stats: { attack: 2, defense: 2 }, category: 'jewelry' },
    { id: 'necklace_gold', name: 'Gold Necklace', rarity: 'uncommon', level: 25, xpReward: 60, interval: 5000, value: 150, icon: '/assets/items/necklace/necklace_gold.png', color: 'text-yellow-400', description: 'Shiny gold chain.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'necklace', stats: { attack: 4, defense: 4 }, category: 'jewelry' },
    { id: 'necklace_adamantite', name: 'Adamantite Necklace', rarity: 'rare', level: 55, xpReward: 120, interval: 7000, value: 600, icon: '/assets/items/necklace/necklace_adamantite.png', color: 'text-purple-400', description: 'Strong adamantite link.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'necklace', stats: { attack: 8, defense: 8 }, category: 'jewelry' },
    { id: 'necklace_emerald', name: 'Emerald Necklace', rarity: 'rare', level: 70, xpReward: 180, interval: 9000, value: 1200, icon: '/assets/items/necklace/necklace_emerald.png', color: 'text-emerald-400', description: 'Glowing emerald pendant.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'necklace', stats: { attack: 12, defense: 12 }, category: 'jewelry' },
    { id: 'necklace_eternium', name: 'Eternium Necklace', rarity: 'legendary', level: 85, xpReward: 250, interval: 12000, value: 3000, icon: '/assets/items/necklace/necklace_eternium.png', color: 'text-red-500', description: 'Timeless eternium charm.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'necklace', stats: { attack: 18, defense: 18 }, category: 'jewelry' },
    { id: 'necklace_starfallalloy', name: 'Starfall Necklace', rarity: 'legendary', level: 99, xpReward: 400, interval: 15000, value: 6000, icon: '/assets/items/necklace/necklace_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic starfall relic.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'necklace', stats: { attack: 25, defense: 25 }, category: 'jewelry' },
    { id: 'bow_copper', name: 'Copper Bow', rarity: 'common', level: 1, xpReward: 25, interval: 2500, value: 40, icon: '/assets/items/bows/bow_copper.png', color: 'text-orange-400', description: 'A flexible copper-reinforced bow.', inputs: [{ id: 'pine_plank', count: 3 }, { id: 'ore_copper_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 6 }, category: 'bows' },
    { id: 'bow_iron', name: 'Iron Bow', rarity: 'common', level: 10, xpReward: 50, interval: 3000, value: 100, icon: '/assets/items/bows/bow_iron.png', color: 'text-slate-400', description: 'Sturdy iron-limbed bow.', inputs: [{ id: 'oak_plank', count: 3 }, { id: 'ore_iron_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 14 }, category: 'bows' },
    { id: 'bow_gold', name: 'Gold Bow', rarity: 'uncommon', level: 25, xpReward: 90, interval: 3500, value: 250, icon: '/assets/items/bows/bow_gold.png', color: 'text-yellow-400', description: 'Heavy draw weight, high impact.', inputs: [{ id: 'willow_plank', count: 3 }, { id: 'ore_gold_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 22 }, category: 'bows' },
    { id: 'bow_mithril', name: 'Mithril Bow', rarity: 'uncommon', level: 40, xpReward: 150, interval: 4000, value: 600, icon: '/assets/items/bows/bow_mithril.png', color: 'text-blue-300', description: 'Lightweight and deadly accurate.', inputs: [{ id: 'yew_plank', count: 3 }, { id: 'ore_mithril_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 35 }, category: 'bows' },
    { id: 'bow_adamantite', name: 'Adamantite Bow', rarity: 'rare', level: 55, xpReward: 250, interval: 5000, value: 1500, icon: '/assets/items/bows/bow_adamantite.png', color: 'text-purple-400', description: 'Powerful compound construction.', inputs: [{ id: 'sunwood_plank', count: 3 }, { id: 'ore_adamantite_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 50 }, category: 'bows' },
    { id: 'bow_emerald', name: 'Emerald Bow', rarity: 'rare', level: 70, xpReward: 400, interval: 6000, value: 3000, icon: '/assets/items/bows/bow_emerald.png', color: 'text-emerald-400', description: 'Infused with nature energy.', inputs: [{ id: 'frostbark_plank', count: 3 }, { id: 'ore_emerald_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 70 }, category: 'bows' },
    { id: 'bow_eternium', name: 'Eternium Bow', rarity: 'legendary', level: 85, xpReward: 650, interval: 7500, value: 6000, icon: '/assets/items/bows/bow_eternium.png', color: 'text-red-500', description: 'Fires arrows at supersonic speeds.', inputs: [{ id: 'bloodwood_plank', count: 3 }, { id: 'ore_eternium_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 95 }, category: 'bows' },
    { id: 'bow_starfall', name: 'Starfall Bow', rarity: 'legendary', level: 99, xpReward: 1000, interval: 10000, value: 15000, icon: '/assets/items/bows/bow_starfall.png', color: 'text-indigo-400', description: 'Forged from starlight itself.', inputs: [{ id: 'heartwood_plank', count: 3 }, { id: 'ore_starfallalloy_smelted', count: 1 }], slot: 'weapon', combatStyle: 'ranged', stats: { attack: 130 }, category: 'bows' },
    { id: 'staff_copper', name: 'Copper Staff', rarity: 'common', level: 1, xpReward: 25, interval: 2500, value: 45, icon: '/assets/items/staffs/staff_copper.png', color: 'text-orange-400', description: 'Channels basic magical energy.', inputs: [{ id: 'pine_plank', count: 3 }, { id: 'ore_copper_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 5 }, category: 'staffs' },
    { id: 'staff_iron', name: 'Iron Staff', rarity: 'common', level: 10, xpReward: 50, interval: 3000, value: 110, icon: '/assets/items/staffs/staff_iron.png', color: 'text-slate-400', description: 'A sturdy focus for spellcasting.', inputs: [{ id: 'oak_plank', count: 3 }, { id: 'ore_iron_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 12 }, category: 'staffs' },
    { id: 'staff_gold', name: 'Gold Staff', rarity: 'uncommon', level: 25, xpReward: 90, interval: 3500, value: 280, icon: '/assets/items/staffs/staff_gold.png', color: 'text-yellow-400', description: 'Highly conductive to mana.', inputs: [{ id: 'willow_plank', count: 3 }, { id: 'ore_gold_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 20 }, category: 'staffs' },
    { id: 'staff_mithril', name: 'Mithril Staff', rarity: 'uncommon', level: 40, xpReward: 150, interval: 4000, value: 650, icon: '/assets/items/staffs/staff_mithril.png', color: 'text-blue-300', description: 'Lightweight and powerful.', inputs: [{ id: 'yew_plank', count: 3 }, { id: 'ore_mithril_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 32 }, category: 'staffs' },
    { id: 'staff_adamantite', name: 'Adamantite Staff', rarity: 'rare', level: 55, xpReward: 250, interval: 5000, value: 1600, icon: '/assets/items/staffs/staff_adamantite.png', color: 'text-purple-400', description: 'Amplifies spells significantly.', inputs: [{ id: 'sunwood_plank', count: 3 }, { id: 'ore_adamantite_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 48 }, category: 'staffs' },
    { id: 'staff_emerald', name: 'Emerald Staff', rarity: 'rare', level: 70, xpReward: 400, interval: 6000, value: 3200, icon: '/assets/items/staffs/staff_emerald.png', color: 'text-emerald-400', description: 'Pulsates with nature magic.', inputs: [{ id: 'frostbark_plank', count: 3 }, { id: 'ore_emerald_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 65 }, category: 'staffs' },
    { id: 'staff_eternium', name: 'Eternium Staff', rarity: 'legendary', level: 85, xpReward: 650, interval: 7500, value: 6200, icon: '/assets/items/staffs/staff_eternium.png', color: 'text-red-500', description: 'Forged from dragonfire and magic.', inputs: [{ id: 'bloodwood_plank', count: 3 }, { id: 'ore_eternium_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 90 }, category: 'staffs' },
    { id: 'staff_starfall', name: 'Starfall Staff', rarity: 'legendary', level: 99, xpReward: 1000, interval: 10000, value: 15500, icon: '/assets/items/staffs/staff_starfall.png', color: 'text-indigo-400', description: 'Controls the fabric of the cosmos.', inputs: [{ id: 'heartwood_plank', count: 3 }, { id: 'ore_starfallalloy_smelted', count: 1 }], slot: 'weapon', combatStyle: 'magic', stats: { attack: 125 }, category: 'staffs' },
  ],
  fishing: [
    { 
      id: 'fish_riverminnow', name: 'River Minnow', rarity: 'common', level: 1, xpReward: 10, interval: 2500, value: 2, 
      icon: '/assets/resources/fish/fish_riverminnow.png', 
      color: 'text-blue-300', description: 'Small freshwater fish.', area: undefined 
    },
    { 
      id: 'fish_redfinsalmon', name: 'Redfin Salmon', rarity: 'common', level: 15, xpReward: 25, interval: 4000, value: 5, 
      icon: '/assets/resources/fish/fish_redfinsalmon.png', 
      color: 'text-red-400', description: 'Strong swimmer.', area: 2 
    },
    { 
      id: 'fish_silvercarp', name: 'Silver Carp', rarity: 'uncommon', level: 30, xpReward: 45, interval: 5500, value: 12, 
      icon: '/assets/resources/fish/fish_silvercarp.png', 
      color: 'text-slate-300', description: 'Shimmers in the light.', area: 4 
    },
    { 
      id: 'fish_brineshrimp', name: 'Brine Shrimp', rarity: 'uncommon', level: 45, xpReward: 70, interval: 7000, value: 25, 
      icon: '/assets/resources/fish/fish_brineshrimp.png', 
      color: 'text-pink-400', description: 'Salty crustacean.', area: 5 
    },
    { 
      id: 'fish_sandstar', name: 'Sand Star', rarity: 'rare', level: 60, xpReward: 100, interval: 8500, value: 50, 
      icon: '/assets/resources/fish/fish_sandstar.png', 
      color: 'text-amber-200', description: 'Found on the ocean floor.', area: 7 
    },
    { 
      id: 'fish_stormcrab', name: 'Storm Crab', rarity: 'rare', level: 75, xpReward: 150, interval: 10000, value: 100, 
      icon: '/assets/resources/fish/fish_stormcrab.png', 
      color: 'text-indigo-400', description: 'Crackling with energy.', area: 8 
    },
    { 
      id: 'fish_deepwatereel', name: 'Deepwater Eel', rarity: 'legendary', level: 85, xpReward: 220, interval: 12000, value: 200, 
      icon: '/assets/resources/fish/fish_deepwatereel.png', 
      color: 'text-cyan-600', description: 'Lurks in the abyss.', area: 9 
    },
    { 
      id: 'fish_eternalcthulhu', name: 'Eternal Cthulhu', rarity: 'legendary', level: 99, xpReward: 350, interval: 15000, value: 500, 
      icon: '/assets/resources/fish/fish_eternalcthulhu.png', 
      color: 'text-purple-600', description: 'The old one sleeps no more.', area: 10 
    },
  ],
  farming: [
    { id: 'crop_potato', name: 'Raw Potato', rarity: 'common', level: 1, xpReward: 10, interval: 10000, value: 3, icon: '/assets/resources/crop_potato.png', color: 'text-yellow-600', description: 'Basic raw food.', area: undefined }
  ],
  cooking: [
    { 
      id: 'food_minnow_cooked', name: 'Cooked Minnow', rarity: 'common', level: 1, xpReward: 15, interval: 2000, value: 5, 
      icon: '/assets/items/food_minnow.png', 
      color: 'text-blue-200', description: 'Heals 10 HP.', healing: 10, slot: 'food',
      inputs: [{ id: 'fish_riverminnow', count: 1 }] 
    },
    { 
      id: 'food_potato_baked', name: 'Baked Potato', rarity: 'common', level: 5, xpReward: 20, interval: 3000, value: 8, 
      icon: '/assets/items/food_potato.png', 
      color: 'text-yellow-500', description: 'Heals 15 HP.', healing: 15, slot: 'food',
      inputs: [{ id: 'crop_potato', count: 1 }] 
    },
    { 
      id: 'food_salmon_cooked', name: 'Smoked Salmon', rarity: 'common', level: 15, xpReward: 35, interval: 3500, value: 15, 
      icon: '/assets/items/food_salmon.png', 
      color: 'text-red-300', description: 'Heals 30 HP.', healing: 30, slot: 'food',
      inputs: [{ id: 'fish_redfinsalmon', count: 1 }] 
    },
    { 
      id: 'food_carp_cooked', name: 'Roasted Carp', rarity: 'uncommon', level: 30, xpReward: 60, interval: 4500, value: 30, 
      icon: '/assets/items/food_carp.png', 
      color: 'text-slate-200', description: 'Heals 50 HP.', healing: 50, slot: 'food',
      inputs: [{ id: 'fish_silvercarp', count: 1 }] 
    },
    { 
      id: 'food_shrimp_cooked', name: 'Grilled Shrimp', rarity: 'uncommon', level: 45, xpReward: 90, interval: 5500, value: 60, 
      icon: '/assets/items/food_shrimp.png', 
      color: 'text-pink-300', description: 'Heals 80 HP.', healing: 80, slot: 'food',
      inputs: [{ id: 'fish_brineshrimp', count: 1 }] 
    },
    { 
      id: 'food_crab_cooked', name: 'Steamed Crab', rarity: 'rare', level: 60, xpReward: 130, interval: 6500, value: 120, 
      icon: '/assets/items/food_crab.png', 
      color: 'text-indigo-300', description: 'Heals 120 HP.', healing: 120, slot: 'food',
      inputs: [{ id: 'fish_stormcrab', count: 1 }] 
    },
    { 
      id: 'food_eel_cooked', name: 'Eel Stew', rarity: 'legendary', level: 75, xpReward: 180, interval: 8000, value: 250, 
      icon: '/assets/items/food_eel.png', 
      color: 'text-cyan-400', description: 'Heals 200 HP.', healing: 200, slot: 'food',
      inputs: [{ id: 'fish_deepwatereel', count: 1 }] 
    },
    { 
      id: 'food_cthulhu_cooked', name: 'Cosmic Soup', rarity: 'legendary', level: 90, xpReward: 300, interval: 10000, value: 600, 
      icon: '/assets/items/food_cthulhu.png', 
      color: 'text-purple-400', description: 'Heals 500 HP.', healing: 500, slot: 'food',
      inputs: [{ id: 'fish_eternalcthulhu', count: 1 }] 
    },
  ],
};