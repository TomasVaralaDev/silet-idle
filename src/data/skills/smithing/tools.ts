import type { Resource } from '../../../types';

export const tools: Resource[] = [
  // RINGS (Smithing can craft basic ones)
  { id: 'ring_iron', name: 'Iron Ring', category: 'ring', rarity: 'common', level: 15, xpReward: 35, interval: 4000, value: 50, icon: '/assets/items/ring/ring_iron.png', slot: 'ring', stats: { attack: 1, defense: 1 }, inputs: [{ id: 'ore_iron_smelted', count: 2 }] },
  { id: 'ring_gold', name: 'Gold Ring', category: 'ring', rarity: 'uncommon', level: 25, xpReward: 55, interval: 5000, value: 120, icon: '/assets/items/ring/ring_gold.png', slot: 'ring', stats: { attack: 3, defense: 3 }, inputs: [{ id: 'ore_gold_smelted', count: 2 }] },
  
  // SHIELDS
  { id: 'shield_copper', name: 'Copper Shield', category: 'shield', rarity: 'common', level: 5, xpReward: 25, interval: 3500, value: 60, icon: '/assets/items/shields/shield_copper.png', slot: 'shield', stats: { defense: 8 }, inputs: [{ id: 'ore_copper_smelted', count: 3 }] },
  { id: 'shield_iron', name: 'Iron Shield', category: 'shield', rarity: 'common', level: 15, xpReward: 45, interval: 4500, value: 150, icon: '/assets/items/shields/shield_iron.png', slot: 'shield', stats: { defense: 18 }, inputs: [{ id: 'ore_iron_smelted', count: 3 }] },
  { id: 'shield_gold', name: 'Gold Shield', category: 'shield', rarity: 'uncommon', level: 25, xpReward: 70, interval: 5500, value: 350, icon: '/assets/items/shields/shield_gold.png', slot: 'shield', stats: { defense: 28 }, inputs: [{ id: 'ore_gold_smelted', count: 3 }] },
  { id: 'shield_mithril', name: 'Mithril Shield', category: 'shield', rarity: 'uncommon', level: 40, xpReward: 100, interval: 6500, value: 900, icon: '/assets/items/shields/shield_mithril.png', slot: 'shield', stats: { defense: 42 }, inputs: [{ id: 'ore_mithril_smelted', count: 3 }] },
  { id: 'shield_adamantite', name: 'Adamantite Shield', category: 'shield', rarity: 'rare', level: 55, xpReward: 140, interval: 8000, value: 2000, icon: '/assets/items/shields/shield_adamantite.png', slot: 'shield', stats: { defense: 60 }, inputs: [{ id: 'ore_adamantite_smelted', count: 3 }] },
  { id: 'shield_emerald', name: 'Emerald Shield', category: 'shield', rarity: 'rare', level: 70, xpReward: 200, interval: 10000, value: 4000, icon: '/assets/items/shields/shield_emerald.png', slot: 'shield', stats: { defense: 85 }, inputs: [{ id: 'ore_emerald_smelted', count: 3 }] },
  { id: 'shield_eternium', name: 'Eternium Shield', category: 'shield', rarity: 'legendary', level: 85, xpReward: 300, interval: 13000, value: 7500, icon: '/assets/items/shields/shield_eternium.png', slot: 'shield', stats: { defense: 110 }, inputs: [{ id: 'ore_eternium_smelted', count: 3 }] },
  { id: 'shield_starfall', name: 'Starfall Shield', category: 'shield', rarity: 'legendary', level: 99, xpReward: 500, interval: 18000, value: 15000, icon: '/assets/items/shields/shield_starfall.png', slot: 'shield', stats: { defense: 150 }, inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }] },
];