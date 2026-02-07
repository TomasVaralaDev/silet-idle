// KORJAUS: Poistettu 'GameState' ja lisätty 'type'
import type { Resource, ShopItem, SkillType, Achievement } from './types';

export const GAME_DATA: Record<SkillType, Resource[]> = {
  woodcutting: [
    { id: 'log_normal', name: 'Normal Log', levelRequired: 1, xpReward: 10, interval: 2000, value: 2, icon: '🌳', color: 'text-emerald-500', description: 'Standard wood.' },
    { id: 'log_oak', name: 'Oak Log', levelRequired: 15, xpReward: 25, interval: 3000, value: 5, icon: '🌳', color: 'text-emerald-700', description: 'Harder wood.' },
    { id: 'log_willow', name: 'Willow Log', levelRequired: 30, xpReward: 45, interval: 4000, value: 12, icon: '🌿', color: 'text-lime-500', description: 'Flexible wood.' },
    { id: 'log_yew', name: 'Yew Log', levelRequired: 60, xpReward: 100, interval: 6000, value: 40, icon: '🌲', color: 'text-green-900', description: 'Magical wood.' },
  ],
  mining: [
    { id: 'ore_copper', name: 'Copper Ore', levelRequired: 1, xpReward: 15, interval: 2500, value: 4, icon: '🟤', color: 'text-orange-400', description: 'Basic ore.' },
    { id: 'ore_tin', name: 'Tin Ore', levelRequired: 1, xpReward: 15, interval: 2500, value: 4, icon: '⚪', color: 'text-slate-300', description: 'Mix with copper for bronze.' },
    { id: 'ore_iron', name: 'Iron Ore', levelRequired: 15, xpReward: 35, interval: 4000, value: 15, icon: '🌑', color: 'text-slate-500', description: 'Strong metal.' },
    { id: 'ore_coal', name: 'Coal', levelRequired: 30, xpReward: 50, interval: 5000, value: 25, icon: '⚫', color: 'text-slate-800', description: 'Fuel for smelting.' },
    { id: 'ore_gold', name: 'Gold Ore', levelRequired: 50, xpReward: 80, interval: 7000, value: 100, icon: '🟡', color: 'text-yellow-400', description: 'Shiny and valuable.' },
  ],
  fishing: [
    { id: 'fish_shrimp', name: 'Shrimp', levelRequired: 1, xpReward: 10, interval: 1500, value: 3, icon: '🦐', color: 'text-rose-400', description: 'Small crustacean.' },
    { id: 'fish_sardine', name: 'Sardine', levelRequired: 10, xpReward: 20, interval: 2500, value: 8, icon: '🐟', color: 'text-blue-300', description: 'Salty small fish.' },
    { id: 'fish_trout', name: 'Trout', levelRequired: 20, xpReward: 40, interval: 3500, value: 18, icon: '🐠', color: 'text-slate-400', description: 'Freshwater fish.' },
    { id: 'fish_salmon', name: 'Salmon', levelRequired: 30, xpReward: 70, interval: 5000, value: 35, icon: '🐡', color: 'text-red-400', description: 'Prized food fish.' },
    { id: 'fish_lobster', name: 'Lobster', levelRequired: 40, xpReward: 120, interval: 7000, value: 80, icon: '🦞', color: 'text-orange-500', description: 'Delicacy.' },
  ],
  farming: [
    { id: 'crop_potato', name: 'Potato', levelRequired: 1, xpReward: 12, interval: 3000, value: 3, icon: '🥔', color: 'text-yellow-600', description: 'Basic food.' },
    { id: 'crop_onion', name: 'Onion', levelRequired: 10, xpReward: 28, interval: 4000, value: 7, icon: '🧅', color: 'text-yellow-700', description: 'Makes you cry.' },
    { id: 'crop_cabbage', name: 'Cabbage', levelRequired: 25, xpReward: 50, interval: 5500, value: 15, icon: '🥬', color: 'text-lime-400', description: 'Green and healthy.' },
    { id: 'crop_tomato', name: 'Tomato', levelRequired: 40, xpReward: 85, interval: 7000, value: 30, icon: '🍅', color: 'text-red-500', description: 'Juicy red treat.' },
    { id: 'crop_corn', name: 'Corn', levelRequired: 55, xpReward: 130, interval: 9000, value: 55, icon: '🌽', color: 'text-yellow-400', description: 'Sweet gold.' },
    { id: 'crop_strawberry', name: 'Strawberry', levelRequired: 70, xpReward: 200, interval: 12000, value: 120, icon: '🍓', color: 'text-pink-500', description: 'Best berry of summer.' },
  ],
    crafting: [
    { 
      id: 'weapon_shortbow', name: 'Shortbow', levelRequired: 1, xpReward: 20, interval: 2000, value: 10, icon: '🏹', color: 'text-amber-600', description: 'Simple bow.',
      inputs: [{ id: 'log_normal', count: 2 }],
      slot: 'weapon', stats: { attack: 5, strength: 0, defense: 0 },
      category: 'weapons' // UUSI
    },
    { 
      id: 'ammo_arrows', name: 'Arrows (10x)', levelRequired: 5, xpReward: 15, interval: 1500, value: 5, icon: '🗡️', color: 'text-slate-400', description: 'Basic ammo.',
      inputs: [{ id: 'log_normal', count: 1 }, { id: 'ore_copper', count: 1 }],
      slot: 'ammo', stats: { attack: 0, strength: 2, defense: 0 },
      category: 'combat' // UUSI
    },
    { 
      id: 'weapon_longbow', name: 'Longbow', levelRequired: 15, xpReward: 45, interval: 3000, value: 25, icon: '🏹', color: 'text-amber-800', description: 'Strong oak bow.',
      inputs: [{ id: 'log_oak', count: 3 }],
      slot: 'weapon', stats: { attack: 12, strength: 0, defense: 0 },
      category: 'weapons' // UUSI
    },
    { 
      id: 'armor_copper', name: 'Copper Armor', levelRequired: 20, xpReward: 100, interval: 5000, value: 60, icon: '🛡️', color: 'text-orange-500', description: 'Protects from hits.',
      inputs: [{ id: 'ore_copper', count: 5 }, { id: 'ore_tin', count: 1 }],
      slot: 'body', stats: { attack: 0, strength: 0, defense: 10 },
      category: 'armor' // UUSI
    },
    { 
      id: 'weapon_iron_sword', name: 'Iron Sword', levelRequired: 30, xpReward: 150, interval: 6000, value: 80, icon: '⚔️', color: 'text-slate-300', description: 'Sharp and reliable.',
      inputs: [{ id: 'ore_iron', count: 4 }, { id: 'log_oak', count: 1 }],
      slot: 'weapon', stats: { attack: 20, strength: 5, defense: 0 },
      category: 'weapons' // UUSI
    },
  ]
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'axe_iron', name: 'Iron Axe', skill: 'woodcutting', cost: 50, multiplier: 0.9, description: '10% faster chopping.', icon: '🪓' },
  { id: 'axe_steel', name: 'Steel Axe', skill: 'woodcutting', cost: 250, multiplier: 0.8, description: '20% faster chopping.', icon: '🪓' },
  { id: 'axe_mithril', name: 'Mithril Axe', skill: 'woodcutting', cost: 1000, multiplier: 0.6, description: '40% faster chopping.', icon: '✨' },
  { id: 'pick_iron', name: 'Iron Pickaxe', skill: 'mining', cost: 75, multiplier: 0.9, description: '10% faster mining.', icon: '⛏️' },
  { id: 'pick_steel', name: 'Steel Pickaxe', skill: 'mining', cost: 300, multiplier: 0.8, description: '20% faster mining.', icon: '⛏️' },
  { id: 'net_big', name: 'Big Net', skill: 'fishing', cost: 100, multiplier: 0.85, description: '15% faster fishing.', icon: '🕸️' },
  { id: 'rod_good', name: 'Fiberglass Rod', skill: 'fishing', cost: 500, multiplier: 0.7, description: '30% faster fishing.', icon: '🎣' },
  { id: 'rake_basic', name: 'Basic Rake', skill: 'farming', cost: 60, multiplier: 0.9, description: '10% faster farming.', icon: '🍂' },
  { id: 'hoe_iron', name: 'Iron Hoe', skill: 'farming', cost: 200, multiplier: 0.8, description: '20% faster farming.', icon: '👨‍🌾' },
  { id: 'hammer_iron', name: 'Iron Hammer', skill: 'crafting', cost: 150, multiplier: 0.85, description: '15% faster crafting.', icon: '🔨' },
];

export const getAllItems = () => [
  ...GAME_DATA.woodcutting,
  ...GAME_DATA.mining,
  ...GAME_DATA.fishing,
  ...GAME_DATA.farming,
  ...GAME_DATA.crafting
];

export const getItemDetails = (id: string) => getAllItems().find(item => item.id === id);

export const ACHIEVEMENTS: Achievement[] = [
  // --- LEVELS ---
  { 
    id: 'lvl_wood_10', name: 'Novice Logger', description: 'Reach Woodcutting Level 10', icon: '🪓', 
    condition: (s) => s.skills.woodcutting.level >= 10 
  },
  { 
    id: 'lvl_all_5', name: 'Jack of All Trades', description: 'Reach Level 5 in all skills', icon: '🎓', 
    condition: (s) => Object.values(s.skills).every(skill => skill.level >= 5)
  },
  { 
    id: 'lvl_mining_30', name: 'Deep Delver', description: 'Reach Mining Level 30', icon: '⛏️', 
    condition: (s) => s.skills.mining.level >= 30
  },

  // --- WEALTH ---
  { 
    id: 'coins_1000', name: 'Piggy Bank', description: 'Have 1,000 Coins', icon: '💰', 
    condition: (s) => s.coins >= 1000 
  },
  { 
    id: 'coins_10000', name: 'Big Spender', description: 'Have 10,000 Coins', icon: '💎', 
    condition: (s) => s.coins >= 10000 
  },

  // --- ITEMS / INVENTORY ---
  { 
    id: 'have_yew', name: 'Magic Touch', description: 'Possess a Yew Log', icon: '🌲', 
    condition: (s) => (s.inventory['log_yew'] || 0) > 0 
  },
  { 
    id: 'have_diamond_gear', name: 'Iron Man', description: 'Craft an Iron Sword', icon: '⚔️', 
    condition: (s) => (s.inventory['weapon_iron_sword'] || 0) > 0 || s.equipment.weapon === 'weapon_iron_sword'
  },
  
  // --- UPGRADES ---
  { 
    id: 'upgrades_3', name: 'Gear Head', description: 'Own at least 3 tool upgrades', icon: '⚙️', 
    condition: (s) => s.upgrades.length >= 3 
  }
];