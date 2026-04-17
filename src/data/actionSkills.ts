import type { Resource } from "../types";

export const ACTION_SKILLS: Resource[] = [
  // --- COMMON (Helppoja saada, tasainen mutta pieni hyöty) ---
  {
    id: "skill_quick_strike",
    name: "Quick Strike",
    description:
      "A fast secondary attack every 4 seconds, dealing 20% of your total Attack as bonus damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_quick_strike.png",
    rarity: "common",
    value: 500,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 4000,
      damageScaling: 0.2,
    },
  },
  {
    id: "skill_minor_bandage",
    name: "Minor Bandage",
    description:
      "Applies basic first aid every 15 seconds, restoring 10% of your maximum health.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_minor_bandage.png",
    rarity: "common",
    value: 500,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 15000,
      healPercent: 0.1,
    },
  },

  // --- UNCOMMON (Hieman vahvempia, tuovat efektiivisyyttä) ---
  {
    id: "skill_chilling_touch",
    name: "Chilling Touch",
    description:
      "15% chance on hit to apply frostbite, reducing enemy attack speed by 15% for 6 seconds.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_chilling_touch.png",
    rarity: "uncommon",
    value: 1200,
    skillEffect: {
      trigger: "on_hit",
      procChance: 0.15,
      debuff: {
        name: "freeze",
        durationMs: 6000,
        effectValue: 0.15,
      },
    },
  },
  {
    id: "skill_venom_spit",
    name: "Venom Spit",
    description:
      "5% chance on hit to slightly poison the target. Your attacks deal an extra 0.5% of their Max HP as damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_venom_spit.png",
    rarity: "uncommon",
    value: 1500,
    skillEffect: {
      trigger: "on_hit",
      procChance: 0.05,
      debuff: {
        name: "poison",
        effectValue: 0.005,
      },
    },
  },

  // --- RARE (Aiempien Fireball ja Heal lisäksi uusia Rarea) ---
  {
    id: "skill_savage_rend",
    name: "Savage Rend",
    description:
      "Tears into the enemy every 8 seconds, dealing 65% of your total Attack as damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_savage_rend.png",
    rarity: "rare",
    value: 2500,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 8000,
      damageScaling: 0.65,
    },
  },

  // --- EPIC (Tehokkaita taktisesti, pidemmät cooldownit mutta kovemmat iskut) ---
  {
    id: "skill_meteor",
    name: "Meteor Strike",
    description:
      "Calls down a meteor every 25 seconds, dealing a massive 200% of your total Attack as damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_meteor.png",
    rarity: "epic",
    value: 6500,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 25000,
      damageScaling: 2.0,
    },
  },
  {
    id: "skill_glacial_prison",
    name: "Glacial Prison",
    description:
      "25% chance on hit to encase the enemy in ice, severely reducing their attack speed by 50% for 8 seconds.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_glacial_prison.png",
    rarity: "epic",
    value: 7000,
    skillEffect: {
      trigger: "on_hit",
      procChance: 0.25,
      debuff: {
        name: "freeze",
        durationMs: 8000,
        effectValue: 0.5,
      },
    },
  },

  // --- LEGENDARY (Pelin parhaat, muuttavat taistelun kulkua täysin) ---
  {
    id: "skill_phoenix_rebirth",
    name: "Phoenix Rebirth",
    description:
      "Channel the power of the phoenix every 45 seconds, restoring a massive 80% of your maximum health.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_phoenix_rebirth.png",
    rarity: "legendary",
    value: 15000,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 45000,
      healPercent: 0.8,
    },
  },
  {
    id: "skill_cataclysm",
    name: "Cataclysm",
    description:
      "Unleashes pure destruction every 35 seconds, obliterating the target for 350% of your total Attack as damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_cataclysm.png",
    rarity: "legendary",
    value: 18000,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 35000,
      damageScaling: 3.5,
    },
  },
  {
    id: "skill_plague_strike",
    name: "Plaguebringer",
    description:
      "15% chance on hit to infect the enemy with a deadly plague. Your attacks deal an extra 3.5% of their Max HP as damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/skill_plague_strike.png",
    rarity: "legendary",
    value: 20000,
    skillEffect: {
      trigger: "on_hit",
      procChance: 0.15,
      debuff: {
        name: "poison",
        effectValue: 0.035, // 3.5% vihollisen maksimi-HP:sta joka lyönnillä on valtava damage bossia vastaan
      },
    },
  },
];
