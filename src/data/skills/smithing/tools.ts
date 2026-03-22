import type { Resource } from "../../../types";

export const tools: Resource[] = [
  // ==========================================
  // --- RINGS ---
  // ==========================================
  {
    id: "ring_iron",
    name: "Iron Ring",
    category: "ring",
    rarity: "common",
    level: 15,
    xpReward: 80,
    interval: 4000,
    value: 50,
    icon: "/assets/items/ring/ring_iron.png",
    color: "text-slate-400",
    description: "A simple iron band.",
    slot: "ring",
    stats: { attack: 3, defense: 3 },
    inputs: [{ id: "ore_iron_smelted", count: 5 }],
    isUnique: false,
  },
  {
    id: "ring_gold",
    name: "Gold Ring",
    category: "ring",
    rarity: "common",
    level: 25,
    xpReward: 200,
    interval: 5000,
    value: 120,
    icon: "/assets/items/ring/ring_gold.png",
    color: "text-yellow-400",
    description: "A valuable gold ring.",
    slot: "ring",
    stats: { attack: 8, defense: 8 },
    inputs: [{ id: "ore_gold_smelted", count: 12 }],
    isUnique: false,
  },
  {
    id: "ring_adamantite",
    name: "Adamantite Ring",
    category: "ring",
    rarity: "common",
    level: 55,
    xpReward: 700,
    interval: 7000,
    value: 500,
    icon: "/assets/items/ring/ring_adamantite.png",
    color: "text-purple-400",
    description: "A highly durable combat ring.",
    slot: "ring",
    stats: { attack: 25, defense: 25 },
    inputs: [{ id: "ore_adamantite_smelted", count: 50 }],
    isUnique: false,
  },
  {
    id: "ring_emerald",
    name: "Emerald Ring",
    category: "ring",
    rarity: "common",
    level: 70,
    xpReward: 1800,
    interval: 9000,
    value: 1000,
    icon: "/assets/items/ring/ring_emerald.png",
    color: "text-emerald-400",
    description: "An enchanted emerald ring.",
    slot: "ring",
    stats: { attack: 50, defense: 50 },
    inputs: [{ id: "ore_emerald_smelted", count: 100 }],
    isUnique: false,
  },
  {
    id: "ring_starfallalloy",
    name: "Starfall Ring",
    category: "ring",
    rarity: "common",
    level: 85, // LASKETTU 99 -> 85
    xpReward: 4500, // LASKETTU 10000 -> 4500
    interval: 12000, // NOPEUTETTU
    value: 2500, // LASKETTU 5000 -> 2500
    icon: "/assets/items/ring/ring_starfallalloy.png",
    color: "text-indigo-400",
    description: "Forged from the core of a fallen star.",
    slot: "ring",
    stats: { attack: 100, defense: 100 }, // STATIT VAIHDETTU
    inputs: [{ id: "ore_starfallalloy_smelted", count: 300 }], // MÄÄRÄ LASKETTU
    isUnique: false,
  },
  {
    id: "ring_eternium",
    name: "Eternium Ring",
    category: "ring",
    rarity: "common",
    level: 99, // NOSTETTU 85 -> 99
    xpReward: 10000, // NOSTETTU 4500 -> 10000
    interval: 15000, // HIDASTETTU
    value: 5000, // NOSTETTU 2500 -> 5000
    icon: "/assets/items/ring/ring_eternium.png",
    color: "text-red-500",
    description: "A ring pulsing with eternal power.",
    slot: "ring",
    stats: { attack: 250, defense: 250 }, // STATIT VAIHDETTU
    inputs: [{ id: "ore_eternium_smelted", count: 1000 }], // MÄÄRÄ NOSTETTU
    isUnique: false,
  },

  // ==========================================
  // --- SHIELDS ---
  // ==========================================
  {
    id: "shield_copper",
    name: "Copper Shield",
    category: "shield",
    rarity: "common",
    level: 5,
    xpReward: 40,
    interval: 3500,
    value: 60,
    icon: "/assets/items/shields/shield_copper.png",
    color: "text-orange-300",
    description: "A flimsy but functional copper shield.",
    slot: "shield",
    stats: { defense: 12 },
    inputs: [{ id: "ore_copper_smelted", count: 5 }],
    isUnique: false,
  },
  {
    id: "shield_iron",
    name: "Iron Shield",
    category: "shield",
    rarity: "common",
    level: 15,
    xpReward: 140,
    interval: 4500,
    value: 150,
    icon: "/assets/items/shields/shield_iron.png",
    color: "text-slate-400",
    description: "A sturdy iron shield for beginners.",
    slot: "shield",
    stats: { defense: 28 },
    inputs: [{ id: "ore_iron_smelted", count: 12 }],
    isUnique: false,
  },
  {
    id: "shield_gold",
    name: "Gold Shield",
    category: "shield",
    rarity: "common",
    level: 25,
    xpReward: 300,
    interval: 5500,
    value: 300,
    icon: "/assets/items/shields/shield_gold.png",
    color: "text-yellow-400",
    description: "Heavy and glamorous.",
    slot: "shield",
    stats: { defense: 55 },
    inputs: [{ id: "ore_gold_smelted", count: 25 }],
    isUnique: false,
  },
  {
    id: "shield_mithril",
    name: "Mithril Shield",
    category: "shield",
    rarity: "common",
    level: 40,
    xpReward: 600,
    interval: 6500,
    value: 600,
    icon: "/assets/items/shields/shield_mithril.png",
    color: "text-blue-400",
    description: "Lightweight yet incredibly strong.",
    slot: "shield",
    stats: { defense: 120 },
    inputs: [{ id: "ore_mithril_smelted", count: 45 }],
    isUnique: false,
  },
  {
    id: "shield_adamantite",
    name: "Adamantite Shield",
    category: "shield",
    rarity: "common",
    level: 55,
    xpReward: 1200,
    interval: 8000,
    value: 1200,
    icon: "/assets/items/shields/shield_adamantite.png",
    color: "text-purple-400",
    description: "A massive, unyielding bulwark.",
    slot: "shield",
    stats: { defense: 250 },
    inputs: [{ id: "ore_adamantite_smelted", count: 90 }],
    isUnique: false,
  },
  {
    id: "shield_emerald",
    name: "Emerald Shield",
    category: "shield",
    rarity: "common",
    level: 70,
    xpReward: 2500,
    interval: 10000,
    value: 2500,
    icon: "/assets/items/shields/shield_emerald.png",
    color: "text-emerald-400",
    description: "Radiates protective natural magic.",
    slot: "shield",
    stats: { defense: 500 },
    inputs: [{ id: "ore_emerald_smelted", count: 180 }],
    isUnique: false,
  },
  {
    id: "shield_starfall",
    name: "Starfall Shield",
    category: "shield",
    rarity: "common",
    level: 85, // LASKETTU 99 -> 85
    xpReward: 6000, // LASKETTU 45000 -> 6000
    interval: 13000, // NOPEUTETTU
    value: 6000, // LASKETTU 15000 -> 6000
    icon: "/assets/items/shields/shield_starfall.png",
    color: "text-indigo-400",
    description: "An impenetrable cosmic barrier.",
    slot: "shield",
    stats: { defense: 1100 }, // STATIT VAIHDETTU
    inputs: [{ id: "ore_starfallalloy_smelted", count: 450 }], // MÄÄRÄ LASKETTU
    isUnique: false,
  },
  {
    id: "shield_eternium",
    name: "Eternium Shield",
    category: "shield",
    rarity: "common",
    level: 99, // NOSTETTU 85 -> 99
    xpReward: 45000, // NOSTETTU 6000 -> 45000
    interval: 18000, // HIDASTETTU
    value: 15000, // NOSTETTU 6000 -> 15000
    icon: "/assets/items/shields/shield_eternium.png",
    color: "text-red-500",
    description: "An ancient shield that deflects destruction.",
    slot: "shield",
    stats: { defense: 2500 }, // STATIT VAIHDETTU
    inputs: [{ id: "ore_eternium_smelted", count: 3500 }], // MÄÄRÄ NOSTETTU
    isUnique: false,
  },
];
