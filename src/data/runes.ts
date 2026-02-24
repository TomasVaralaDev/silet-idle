import type { Resource } from '../types';

export const RUNES_DATA: Resource[] = [
  // --- MINING ---
  {
    id: 'rune_mining_speed_minor',
    name: 'Minor Mining Speed Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-cyan-400',
    icon: '/assets/items/runes/rune_skilling.png',
    description:
      'Hums with the vibrations of the earth. Decreases mining interval by 10%.',
    slot: 'rune',
    skillModifiers: { miningSpeed: 0.1 },
  },
  {
    id: 'rune_mining_xp_minor',
    name: 'Minor Mining XP Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-cyan-300',
    icon: '/assets/items/runes/rune_skilling.png',
    description:
      'Ancient whispers guide your pickaxe. Increases mining XP gain by 10%.',
    slot: 'rune',
    skillModifiers: { miningXp: 0.1 },
  },

  // --- WOODCUTTING ---
  {
    id: 'rune_woodcutting_speed_minor',
    name: 'Minor Forest Speed Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-emerald-400',
    icon: '/assets/items/runes/rune_skilling.png',
    description:
      'Sharpens your focus against the bark. Decreases woodcutting interval by 10%.',
    slot: 'rune',
    skillModifiers: { woodcuttingSpeed: 0.1 },
  },
  {
    id: 'rune_woodcutting_xp_minor',
    name: 'Minor Forest XP Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-emerald-300',
    icon: '/assets/items/runes/rune_skilling.png',
    description:
      'Teaches you the language of the trees. Increases woodcutting XP gain by 10%.',
    slot: 'rune',
    skillModifiers: { woodcuttingXp: 0.1 },
  },

  // --- FORAGING ---
  {
    id: 'rune_foraging_speed_minor',
    name: 'Minor Foraging Speed Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-lime-400',
    icon: '/assets/items/runes/rune_skilling.png',
    description:
      'Lightens your footsteps in the wild. Decreases foraging interval by 10%.',
    slot: 'rune',
    skillModifiers: { foragingSpeed: 0.1 },
  },
  {
    id: 'rune_foraging_xp_minor',
    name: 'Minor Foraging XP Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-lime-300',
    icon: '/assets/items/runes/rune_skilling.png',
    description:
      'Heightens your senses for rare herbs. Increases foraging XP gain by 10%.',
    slot: 'rune',
    skillModifiers: { foragingXp: 0.1 },
  },

  // --- SMITHING ---
  {
    id: 'rune_smithing_speed_minor',
    name: 'Minor Smithing Speed Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-orange-400',
    icon: '/assets/items/runes/rune_3.png',
    description:
      'Heats the forge to the perfect temp. Decreases smithing interval by 10%.',
    slot: 'rune',
    skillModifiers: { smithingSpeed: 0.1 },
  },
  {
    id: 'rune_smithing_xp_minor',
    name: 'Minor Smithing XP Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-orange-300',
    icon: '/assets/items/runes/rune_3.png',
    description:
      'Reveals the secrets of the hammer. Increases smithing XP gain by 10%.',
    slot: 'rune',
    skillModifiers: { smithingXp: 0.1 },
  },

  // --- CRAFTING ---
  {
    id: 'rune_crafting_speed_minor',
    name: 'Minor Crafting Speed Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-yellow-400',
    icon: '/assets/items/runes/rune_7.png',
    description:
      'Steadies your hands for fine work. Decreases crafting interval by 10%.',
    slot: 'rune',
    skillModifiers: { craftingSpeed: 0.1 },
  },
  {
    id: 'rune_crafting_xp_minor',
    name: 'Minor Crafting XP Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-yellow-300',
    icon: '/assets/items/runes/rune_7.png',
    description:
      'Inspires masterwork creations. Increases crafting XP gain by 10%.',
    slot: 'rune',
    skillModifiers: { craftingXp: 0.1 },
  },

  // --- ALCHEMY ---
  {
    id: 'rune_alchemy_speed_minor',
    name: 'Minor Alchemy Speed Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-purple-400',
    icon: '/assets/items/runes/rune_2.png',
    description:
      'Accelerates the chemical reaction. Decreases alchemy interval by 10%.',
    slot: 'rune',
    skillModifiers: { alchemySpeed: 0.1 },
  },
  {
    id: 'rune_alchemy_xp_minor',
    name: 'Minor Alchemy XP Rune',
    value: 500,
    rarity: 'uncommon',
    color: 'text-purple-300',
    icon: '/assets/items/runes/rune_2.png',
    description:
      'Deepens your chemical understanding. Increases alchemy XP gain by 10%.',
    slot: 'rune',
    skillModifiers: { alchemyXp: 0.1 },
  },
];
