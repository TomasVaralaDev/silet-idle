import type { Resource } from "../../../types";

export const jewelry: Resource[] = [
  {
    id: "necklace_iron",
    name: "Iron Necklace",
    rarity: "common",
    level: 15,
    xpReward: 120,
    interval: 4000,
    value: 60,
    icon: "/assets/items/necklace/necklace_iron.png",
    color: "text-slate-400",
    description: "Basic iron chain.",
    inputs: [{ id: "ore_iron_smelted", count: 5 }],
    slot: "necklace",
    stats: { attack: 5, defense: 5 },
    category: "necklace",
    isUnique: false,
  },
  {
    id: "necklace_gold",
    name: "Gold Necklace",
    rarity: "common",
    level: 25,
    xpReward: 250,
    interval: 5000,
    value: 150,
    icon: "/assets/items/necklace/necklace_gold.png",
    color: "text-yellow-400",
    description: "Shiny gold chain.",
    inputs: [{ id: "ore_gold_smelted", count: 15 }],
    slot: "necklace",
    stats: { attack: 12, defense: 12 },
    category: "necklace",
    isUnique: false,
  },
  {
    id: "necklace_adamantite",
    name: "Adamantite Necklace",
    rarity: "common",
    level: 55,
    xpReward: 800,
    interval: 7000,
    value: 600,
    icon: "/assets/items/necklace/necklace_adamantite.png",
    color: "text-purple-400",
    description: "Strong adamantite link.",
    inputs: [{ id: "ore_adamantite_smelted", count: 60 }],
    slot: "necklace",
    stats: { attack: 35, defense: 35 },
    category: "necklace",
    isUnique: false,
  },
  {
    id: "necklace_emerald",
    name: "Emerald Necklace",
    rarity: "common",
    level: 70,
    xpReward: 2000,
    interval: 9000,
    value: 1200,
    icon: "/assets/items/necklace/necklace_emerald.png",
    color: "text-emerald-400",
    description: "Glowing emerald pendant.",
    inputs: [{ id: "ore_emerald_smelted", count: 120 }],
    slot: "necklace",
    stats: { attack: 75, defense: 75 },
    category: "necklace",
    isUnique: false,
  },
  {
    id: "necklace_starfallalloy",
    name: "Starfall Necklace",
    rarity: "common",
    level: 85, // LASKETTU 99 -> 85
    xpReward: 5000, // LASKETTU 12k -> 5k
    interval: 12000, // NOPEUTETTU
    value: 3000, // LASKETTU 6k -> 3k
    icon: "/assets/items/necklace/necklace_starfallalloy.png",
    color: "text-indigo-400",
    description: "Cosmic starfall relic.",
    inputs: [
      { id: "ore_starfallalloy_smelted", count: 350 }, // MÄÄRÄ LASKETTU
      { id: "ore_emerald_smelted", count: 5 }, // SMALDI-MÄÄRÄ LASKETTU
    ],
    slot: "necklace",
    stats: { attack: 150, defense: 150 }, // STATIT VAIHDETTU
    category: "necklace",
    isUnique: false,
  },
  {
    id: "necklace_eternium",
    name: "Eternium Necklace",
    rarity: "common",
    level: 99, // NOSTETTU 85 -> 99
    xpReward: 12000, // NOSTETTU 5k -> 12k
    interval: 15000, // HIDASTETTU
    value: 6000, // NOSTETTU 3k -> 6k
    icon: "/assets/items/necklace/necklace_eternium.png",
    color: "text-red-500",
    description: "Timeless eternium charm.",
    inputs: [
      { id: "ore_eternium_smelted", count: 1200 }, // MÄÄRÄ NOSTETTU
      { id: "ore_emerald_smelted", count: 15 }, // SMALDI-MÄÄRÄ NOSTETTU
    ],
    slot: "necklace",
    stats: { attack: 350, defense: 350 }, // STATIT VAIHDETTU
    category: "necklace",
    isUnique: false,
  },
];
