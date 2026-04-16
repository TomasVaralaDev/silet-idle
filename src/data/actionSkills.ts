import type { Resource } from "../types";

export const ACTION_SKILLS: Resource[] = [
  {
    id: "skill_fireball",
    name: "Fireball",
    description:
      "Casts a fireball every 10 seconds, dealing bonus damage equal to 50% of your total Attack.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/fireball.png",
    rarity: "rare",
    value: 2000,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 10000,
      damageScaling: 0.5,
    },
  },
  {
    id: "skill_freeze",
    name: "Frost Strike",
    description:
      "20% chance on hit to freeze the enemy, reducing their attack speed by 30% for 10 seconds.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/freeze.png",
    rarity: "epic",
    value: 5000,
    skillEffect: {
      trigger: "on_hit",
      procChance: 0.2,
      debuff: {
        name: "freeze",
        durationMs: 10000,
        effectValue: 0.3,
      },
    },
  },
  {
    id: "skill_heal",
    name: "Divine Light",
    description: "Every 20 seconds, restores 30% of your maximum health.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/heal.png",
    rarity: "rare",
    value: 3000,
    skillEffect: {
      trigger: "cooldown",
      cooldownMs: 20000,
      healPercent: 0.3,
    },
  },
  {
    id: "skill_poison",
    name: "Toxic Blade",
    description:
      "10% chance on hit to poison the enemy. While poisoned, your attacks deal an extra 2% of their Max HP as damage.",
    category: "equipment",
    slot: "skill",
    icon: "./assets/items/skills/poison.png",
    rarity: "legendary",
    value: 10000,
    skillEffect: {
      trigger: "on_hit",
      procChance: 0.1,
      debuff: {
        name: "poison",
        effectValue: 0.02,
      },
    },
  },
];
