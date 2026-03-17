import type { Resource } from "../types";

export const WORLD_BOSS_DROPS: Record<number, Resource[]> = {
  // --- WORLD 1: GREENVALE (Oakroot Guardian) ---
  // Target: Iron Sword +4 (Attack: 22 * 1.8 = 39.6)
  1: [
    {
      id: "weapon_boss_w1_sword",
      name: "Guardian's Oak-Blade",
      icon: "/assets/items/weapons/boss_w1_sword.png",
      value: 2500,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "melee",
      isUnique: true,
      nonEnchantable: true,

      description:
        "A blade grown from the ancient roots of the Oakroot Guardian. It hums with primal energy.",
      stats: {
        attack: 40,
        attackSpeed: 2300,
        critChance: 0.06,
        critMulti: 1.6,
      },
      color: "text-purple-400",
    },
  ],

  // --- WORLD 2: STONEFALL (The Stone Colossus) ---
  // Target: Gold Bow +4 (Attack: 35 * 1.8 = 63)
  2: [
    {
      id: "weapon_boss_w2_bow",
      name: "Colossus Greatbow",
      icon: "/assets/items/bows/boss_w2_bow.png",
      value: 6000,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "ranged",
      isUnique: true,
      nonEnchantable: true,

      description:
        "Heavy and uncompromising. Only those who have faced the Stone Colossus can draw its string.",
      stats: {
        attack: 63,
        attackSpeed: 3000,
        critChance: 0.16,
        critMulti: 2.3,
      },
      color: "text-purple-400",
    },
  ],

  // --- WORLD 3: ASHRIDGE (Inferno Ward) ---
  // Target: Mithril Sword +4 (Attack: 85 * 1.8 = 153)
  3: [
    {
      id: "weapon_boss_w3_sword",
      name: "Inferno Ward's Slicer",
      icon: "/assets/items/weapons/boss_w3_sword.png",
      value: 12500,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "melee",
      isUnique: true,
      nonEnchantable: true,

      description:
        "Carries the internal fire of the Inferno Ward. The blade glows orange even outside of Ashridge.",
      stats: {
        attack: 153,
        attackSpeed: 2200,
        critChance: 0.12,
        critMulti: 1.8,
      },
      color: "text-purple-400",
    },
  ],

  // --- WORLD 4: FROSTREACH (The Icebound Sorcerer) ---
  // Target: Adamantite Bow +4 (Attack: 140 * 1.8 = 252)
  4: [
    {
      id: "weapon_boss_w4_bow",
      name: "Sorcerer's Frost-Stinger",
      icon: "/assets/items/bows/boss_w4_bow.png",
      value: 25000,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "ranged",
      isUnique: true,
      nonEnchantable: true,

      description:
        "Born from the spells of the Icebound Sorcerer. Arrows fired from it freeze the air around them.",
      stats: {
        attack: 252,
        attackSpeed: 2800,
        critChance: 0.22,
        critMulti: 2.7,
      },
      color: "text-yellow-400",
    },
  ],

  // --- WORLD 5: DUSKWOOD (The Dreadwood King) ---
  // Target: Emerald Sword +4 (Attack: 350 * 1.8 = 630)
  5: [
    {
      id: "weapon_boss_w5_sword",
      name: "Dreadwood King's Shadow",
      icon: "/assets/items/weapons/boss_w5_sword.png",
      value: 55000,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "melee",
      isUnique: true,
      nonEnchantable: true,

      description:
        "A cursed and dark blade belonging to the ruler of Duskwood. It seems to absorb the surrounding light.",
      stats: {
        attack: 630,
        attackSpeed: 2100,
        critChance: 0.18,
        critMulti: 2.2,
      },
      color: "text-yellow-400",
    },
  ],

  // --- WORLD 6: STORMCOAST (Ruler of the sea) ---
  // Target: Eternium Bow +4 (Attack: 650 * 1.8 = 1170)
  6: [
    {
      id: "weapon_boss_w6_bow",
      name: "Tide-Ruler's Thunder",
      icon: "/assets/items/bows/boss_w6_bow.png",
      value: 120000,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "ranged",
      isUnique: true,
      nonEnchantable: true,

      description:
        "Taken from the Ruler of the Sea. Its string sounds like a raging storm and strikes like lightning.",
      stats: {
        attack: 1170,
        attackSpeed: 2400,
        critChance: 0.32,
        critMulti: 3.2,
      },
      color: "text-yellow-400",
    },
  ],

  // --- WORLD 7: VOID EXPANSE (The Void Architect) ---
  // Target: Starfall Sword +4 (Attack: 2000 * 1.8 = 3600)
  7: [
    {
      id: "weapon_boss_w7_sword",
      name: "Architect's Reality-Cutter",
      icon: "/assets/items/weapons/boss_w7_sword.png",
      value: 300000,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "melee",
      isUnique: true,
      nonEnchantable: true,

      description:
        "The masterpiece of The Void Architect. It doesn't cut flesh, but the threads of reality itself.",
      stats: {
        attack: 3600,
        attackSpeed: 1900,
        critChance: 0.28,
        critMulti: 2.8,
      },
      color: "text-yellow-400",
    },
  ],

  // --- WORLD 8: ETERNAL NEXUS (Nexus Lord) ---
  // Target: Ultimate Tier (Beyond Starfall +4)
  8: [
    {
      id: "weapon_boss_w8_sword",
      name: "Nexus Lord's Chrono-Blade",
      icon: "/assets/items/weapons/boss_w8_sword.png",
      value: 1000000,
      rarity: "legendary",
      category: "weapon",
      slot: "weapon",
      combatStyle: "melee",
      isUnique: true,
      nonEnchantable: true,
      description:
        "Once held by the Nexus Lord, this blade vibrates at the frequency of every existing timeline.",
      stats: {
        attack: 7500,
        attackSpeed: 1800,
        critChance: 0.35,
        critMulti: 3.5,
      },
      color: "text-yellow-400",
    },
  ],
};
