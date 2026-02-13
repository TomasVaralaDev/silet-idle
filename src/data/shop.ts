import type { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // --- WOODCUTTING UPGRADES ---
  {
    id: 'speed_woodcutting_1',
    name: 'Rusty Hatchet',
    description: 'A bit better than your hands. +20% Woodcutting speed.',
    price: 500,
    category: 'Upgrades',
    icon: '/assets/items/axe_rusty.png'
  },
  {
    id: 'speed_woodcutting_2',
    name: 'Iron Hatchet',
    description: 'Standard issue tool. +20% Woodcutting speed.',
    price: 5000,
    category: 'Upgrades',
    icon: '/assets/items/axe_iron.png',
    requires: 'speed_woodcutting_1'
  },
  {
    id: 'speed_woodcutting_3',
    name: 'Steel Hatchet',
    description: 'Polished steel edge. +20% Woodcutting speed.',
    price: 50000,
    category: 'Upgrades',
    icon: '/assets/items/axe_steel.png',
    requires: 'speed_woodcutting_2'
  },
  {
    id: 'speed_woodcutting_4',
    name: 'Mithril Hatchet',
    description: 'Lightweight and deadly sharp. +20% Woodcutting speed.',
    price: 250000,
    category: 'Upgrades',
    icon: '/assets/items/axe_mithril.png',
    requires: 'speed_woodcutting_3'
  },

  // --- MINING UPGRADES ---
  {
    id: 'speed_mining_1',
    name: 'Stone Pickaxe',
    description: '+20% Mining speed.',
    price: 500,
    category: 'Upgrades',
    icon: '/assets/items/pick_stone.png'
  },
  {
    id: 'speed_mining_2',
    name: 'Iron Pickaxe',
    description: '+20% Mining speed.',
    price: 5000,
    category: 'Upgrades',
    icon: '/assets/items/pick_iron.png',
    requires: 'speed_mining_1'
  },
  {
    id: 'speed_mining_3',
    name: 'Steel Pickaxe',
    description: '+20% Mining speed.',
    price: 50000,
    category: 'Upgrades',
    icon: '/assets/items/pick_steel.png',
    requires: 'speed_mining_2'
  },
  {
    id: 'speed_mining_4',
    name: 'Mithril Pickaxe',
    description: '+20% Mining speed.',
    price: 250000,
    category: 'Upgrades',
    icon: '/assets/items/pick_mithril.png',
    requires: 'speed_mining_3'
  },

  // --- XP TOMES ---
  {
    id: 'xp_tome_woodcutting',
    name: 'Manual of Forestry',
    description: 'Learn better techniques. +50% Woodcutting XP.',
    price: 15000,
    category: 'Upgrades',
    icon: '/assets/items/book_green.png'
  },
  {
    id: 'xp_tome_mining',
    name: 'Salvaging Guide',
    description: 'Maximize your yield. +50% Mining XP.',
    price: 15000,
    category: 'Upgrades',
    icon: '/assets/items/book_blue.png'
  }
];