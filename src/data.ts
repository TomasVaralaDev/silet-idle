import type { SkillType, Resource, ShopItem, Achievement, CombatMap } from './types';

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

// --- SKILL RESOURCES ---
// Huom: Poistetaan 'cooking' Excludesta, jotta se sallitaan tässä objektissa
export const GAME_DATA: Record<Exclude<SkillType, 'hitpoints' | 'melee' | 'ranged' | 'magic' | 'defense' | 'attack'>, Resource[]> = {
  woodcutting: [
    { id: 'log_normal', name: 'Normal Log', levelRequired: 1, xpReward: 10, interval: 3000, value: 1, icon: '🌲', color: 'text-emerald-400', description: 'Common wood.', requiresMapCompletion: undefined },
    { id: 'log_oak', name: 'Oak Log', levelRequired: 15, xpReward: 25, interval: 4500, value: 5, icon: '🌳', color: 'text-amber-700', description: 'Sturdy wood.', requiresMapCompletion: 5 },
    { id: 'log_willow', name: 'Willow Log', levelRequired: 30, xpReward: 45, interval: 6000, value: 10, icon: '🎋', color: 'text-emerald-800', description: 'Flexible wood.', requiresMapCompletion: 8 },
  ],
  mining: [
    { id: 'ore_copper', name: 'Copper Ore', levelRequired: 1, xpReward: 15, interval: 3000, value: 3, icon: '🟤', color: 'text-orange-400', description: 'Soft metal.', requiresMapCompletion: undefined },
    { id: 'ore_tin', name: 'Tin Ore', levelRequired: 1, xpReward: 15, interval: 3000, value: 3, icon: '⚪', color: 'text-slate-300', description: 'Shiny metal.', requiresMapCompletion: 5 },
    { id: 'ore_iron', name: 'Iron Ore', levelRequired: 15, xpReward: 35, interval: 5000, value: 10, icon: '⚫', color: 'text-slate-500', description: 'Strong metal.', requiresMapCompletion: 7 },
  ],
  fishing: [
    { id: 'fish_shrimp', name: 'Raw Shrimp', levelRequired: 1, xpReward: 10, interval: 2500, value: 2, icon: '🦐', color: 'text-pink-400', description: 'Small raw shrimp.', requiresMapCompletion: undefined },
    { id: 'fish_sardine', name: 'Raw Sardine', levelRequired: 10, xpReward: 20, interval: 4000, value: 5, icon: '🐟', color: 'text-blue-300', description: 'Common raw fish.', requiresMapCompletion: 4 }
  ],
  farming: [
    { id: 'crop_potato', name: 'Raw Potato', levelRequired: 1, xpReward: 10, interval: 10000, value: 3, icon: '🥔', color: 'text-yellow-600', description: 'Basic raw food.', requiresMapCompletion: undefined }
  ],
  
  // UUSI: COOKING SKILL
  cooking: [
    { 
      id: 'food_shrimp_cooked', name: 'Cooked Shrimp', levelRequired: 1, xpReward: 15, interval: 2000, value: 5, icon: '🍤', color: 'text-orange-400', description: 'Heals 10 HP.',
      inputs: [{ id: 'fish_shrimp', count: 1 }], slot: 'food', healing: 10
    },
    { 
      id: 'food_potato_baked', name: 'Baked Potato', levelRequired: 5, xpReward: 20, interval: 3000, value: 8, icon: '🥔', color: 'text-yellow-500', description: 'Heals 15 HP.',
      inputs: [{ id: 'crop_potato', count: 1 }], slot: 'food', healing: 15
    },
    { 
      id: 'food_sardine_cooked', name: 'Cooked Sardine', levelRequired: 10, xpReward: 30, interval: 4000, value: 12, icon: '🐟', color: 'text-slate-400', description: 'Heals 25 HP.',
      inputs: [{ id: 'fish_sardine', count: 1 }], slot: 'food', healing: 25
    }
  ],

  crafting: [
    // --- WEAPONS ---
    { id: 'weapon_sword_bronze', name: 'Bronze Sword', levelRequired: 1, xpReward: 20, interval: 3000, value: 15, icon: '⚔️', color: 'text-orange-600', description: 'Basic sword.', inputs: [{ id: 'ore_copper', count: 2 }, { id: 'ore_tin', count: 1 }], slot: 'weapon', stats: { attack: 8 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_iron', name: 'Iron Sword', levelRequired: 15, xpReward: 50, interval: 5000, value: 50, icon: '🗡️', color: 'text-slate-400', description: 'Sharp and reliable.', inputs: [{ id: 'ore_iron', count: 3 }], slot: 'weapon', stats: { attack: 18 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_shortbow_normal', name: 'Shortbow', levelRequired: 1, xpReward: 20, interval: 2000, value: 10, icon: '🏹', color: 'text-amber-600', description: 'Simple wooden bow.', inputs: [{ id: 'log_normal', count: 2 }], slot: 'weapon', stats: { attack: 6 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_shortbow_oak', name: 'Oak Shortbow', levelRequired: 15, xpReward: 40, interval: 3000, value: 30, icon: '🏹', color: 'text-amber-700', description: 'Sturdy oak bow.', inputs: [{ id: 'log_oak', count: 2 }], slot: 'weapon', stats: { attack: 14 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_shortbow_willow', name: 'Willow Shortbow', levelRequired: 30, xpReward: 80, interval: 4000, value: 80, icon: '🏹', color: 'text-emerald-800', description: 'High quality bow.', inputs: [{ id: 'log_willow', count: 3 }], slot: 'weapon', stats: { attack: 24 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_wand_basic', name: 'Basic Wand', levelRequired: 1, xpReward: 25, interval: 2500, value: 20, icon: '✨', color: 'text-blue-300', description: 'Channels weak magic.', inputs: [{ id: 'log_normal', count: 3 }], slot: 'weapon', stats: { attack: 5 }, category: 'weapons', combatStyle: 'magic' },
    { id: 'weapon_wand_oak', name: 'Oak Wand', levelRequired: 15, xpReward: 50, interval: 3500, value: 45, icon: '🔮', color: 'text-amber-600', description: 'Focused magic power.', inputs: [{ id: 'log_oak', count: 3 }], slot: 'weapon', stats: { attack: 12 }, category: 'weapons', combatStyle: 'magic' },
    { id: 'weapon_staff_willow', name: 'Willow Staff', levelRequired: 30, xpReward: 90, interval: 5000, value: 100, icon: '🔱', color: 'text-emerald-600', description: 'Powerful magical staff.', inputs: [{ id: 'log_willow', count: 4 }], slot: 'weapon', stats: { attack: 22 }, category: 'weapons', combatStyle: 'magic' },

    // --- ARMOR ---
    { id: 'armor_bronze_helm', name: 'Bronze Helm', levelRequired: 1, xpReward: 20, interval: 3000, value: 10, icon: '🪖', color: 'text-orange-700', description: 'Simple bronze protection.', inputs: [{ id: 'ore_copper', count: 1 }, { id: 'ore_tin', count: 1 }], slot: 'head', stats: { defense: 2 }, category: 'armor' },
    { id: 'armor_bronze_body', name: 'Bronze Platebody', levelRequired: 1, xpReward: 40, interval: 4000, value: 25, icon: '👕', color: 'text-orange-700', description: 'Covers the chest.', inputs: [{ id: 'ore_copper', count: 3 }, { id: 'ore_tin', count: 1 }], slot: 'body', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_bronze_legs', name: 'Bronze Platelegs', levelRequired: 1, xpReward: 30, interval: 3500, value: 20, icon: '👖', color: 'text-orange-700', description: 'Protects legs.', inputs: [{ id: 'ore_copper', count: 2 }, { id: 'ore_tin', count: 1 }], slot: 'legs', stats: { defense: 4 }, category: 'armor' },
    { id: 'armor_bronze_shield', name: 'Bronze Shield', levelRequired: 1, xpReward: 25, interval: 3000, value: 15, icon: '🛡️', color: 'text-orange-700', description: 'Blocks weak attacks.', inputs: [{ id: 'ore_copper', count: 2 }, { id: 'ore_tin', count: 1 }], slot: 'shield', stats: { defense: 3 }, category: 'armor' },
    { id: 'armor_iron_helm', name: 'Iron Helm', levelRequired: 15, xpReward: 50, interval: 4500, value: 40, icon: '🪖', color: 'text-slate-400', description: 'Sturdy iron helm.', inputs: [{ id: 'ore_iron', count: 2 }], slot: 'head', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_iron_body', name: 'Iron Platebody', levelRequired: 15, xpReward: 100, interval: 6000, value: 100, icon: '👕', color: 'text-slate-400', description: 'Heavy iron armor.', inputs: [{ id: 'ore_iron', count: 5 }], slot: 'body', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_iron_legs', name: 'Iron Platelegs', levelRequired: 15, xpReward: 80, interval: 5000, value: 80, icon: '👖', color: 'text-slate-400', description: 'Iron leg guards.', inputs: [{ id: 'ore_iron', count: 3 }], slot: 'legs', stats: { defense: 9 }, category: 'armor' },
    { id: 'armor_iron_shield', name: 'Iron Shield', levelRequired: 15, xpReward: 60, interval: 4500, value: 60, icon: '🛡️', color: 'text-slate-400', description: 'Solid iron shield.', inputs: [{ id: 'ore_iron', count: 3 }], slot: 'shield', stats: { defense: 7 }, category: 'armor' },
  ]
};

// --- SHOP ITEMS ---
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'axe_steel', name: 'Steel Axe', cost: 100, multiplier: 0.9, skill: 'woodcutting', icon: '🪓', description: '10% faster chopping.' },
  { id: 'axe_mithril', name: 'Mithril Axe', cost: 500, multiplier: 0.75, skill: 'woodcutting', icon: '🪓', description: '25% faster chopping.' },
  { id: 'pickaxe_steel', name: 'Steel Pickaxe', cost: 150, multiplier: 0.9, skill: 'mining', icon: '⛏️', description: '10% faster mining.' },
  { id: 'pickaxe_mithril', name: 'Mithril Pickaxe', cost: 750, multiplier: 0.75, skill: 'mining', icon: '⛏️', description: '25% faster mining.' },
  { id: 'test_money', name: 'Dev Money', cost: 0, multiplier: 1, skill: 'woodcutting', icon: '💰', description: 'Get 1000 coins (Test).' }
];

// --- ACHIEVEMENTS ---
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_log', name: 'First Chop', icon: '🪵', condition: (state) => (state.inventory['log_normal'] || 0) >= 1 },
  { id: 'rich_noob', name: 'Rich Noob', icon: '💰', condition: (state) => state.coins >= 1000 },
  { id: 'novice_woodcutter', name: 'Novice Woodcutter', icon: '🌲', condition: (state) => state.skills.woodcutting.level >= 10 },
  { id: 'combat_initiate', name: 'First Blood', icon: '⚔️', condition: (state) => state.combatStats.maxMapCompleted >= 1 }
];

// --- HELPER ---
export const getItemDetails = (id: string) => {
  if (id === 'coins') return { name: 'Coins', value: 1, icon: '🟡' };
  if (id === 'frozen_key') return { name: 'Frozen Key', value: 100, icon: '🗝️', description: 'Opens the Boss door.' };
  
  for (const skill of Object.keys(GAME_DATA)) {
    // @ts-expect-error: Iteroidaan dynaamisesti
    const item = GAME_DATA[skill].find(i => i.id === id);
    if (item) return item;
  }
  return null;
};