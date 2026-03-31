import type { WeightedDrop, Resource } from "../types";

export const MYSTERY_POUCHES: Resource[] = [
  {
    id: "pouch_mystery_minor",
    name: "Minor Mystery Pouch",
    category: "consumable",
    rarity: "uncommon",
    value: 1000,
    icon: "./assets/items/pouch_basic.png",
    color: "text-green-400",
    description:
      "A small, tightly tied pouch. Might contain basic resources or a rare surprise.",
  },
  {
    id: "pouch_mystery_major",
    name: "Major Mystery Pouch",
    category: "consumable",
    rarity: "rare",
    value: 5000,
    icon: "./assets/items/pouch_major.png",
    color: "text-blue-400",
    description:
      "A heavy velvet pouch humming with magic. High chance for valuable loot.",
  },
  {
    id: "pouch_mystery_legendary",
    name: "Legendary Mystery Pouch",
    category: "consumable",
    rarity: "legendary",
    value: 20000,
    icon: "./assets/items/pouch_legendary.png",
    color: "text-yellow-400",
    description:
      "An ethereal bag radiating immense power. Guaranteed to hold something extraordinary.",
  },
];

// SRP: Loottitaulukot erillään esinedatasta
export const POUCH_LOOT_TABLES: Record<string, WeightedDrop[]> = {
  pouch_mystery_minor: [
    { itemId: "greenvale_basic", weight: 60, amount: [20, 50] },
    { itemId: "stonefall_basic", weight: 40, amount: [10, 30] },
    // Scrollit: Painoarvoa laskettu (15 -> 8), max määrä pidetty pienenä alkupelissä
    { itemId: "scroll_enchant_1", weight: 8, amount: [1, 3] },
    { itemId: "scroll_enchant_2", weight: 3, amount: [1, 2] },
    // Lisätty valikoima Minor-riimuja (hyvin harvinaisia minor-pussista)
    { itemId: "rune_mining_speed_minor", weight: 1, amount: [1, 1] },
    { itemId: "rune_woodcutting_speed_minor", weight: 1, amount: [1, 1] },
    { itemId: "rune_smithing_speed_minor", weight: 1, amount: [1, 1] },
  ],

  pouch_mystery_major: [
    { itemId: "ashridge_basic", weight: 45, amount: [30, 70] },
    { itemId: "frostreach_basic", weight: 35, amount: [20, 50] },
    // Scrollit: Painoarvoa laskettu (20 -> 10), määrä max 4
    { itemId: "scroll_enchant_3", weight: 10, amount: [1, 4] },
    // Lisätty laajempi valikoima Major ja Minor riimuja
    { itemId: "rune_mining_xp_major", weight: 3, amount: [1, 1] },
    { itemId: "rune_woodcutting_xp_major", weight: 3, amount: [1, 1] },
    { itemId: "rune_smithing_xp_major", weight: 3, amount: [1, 1] },
    { itemId: "rune_alchemy_speed_major", weight: 2, amount: [1, 1] },
    { itemId: "rune_crafting_speed_major", weight: 2, amount: [1, 1] },
    { itemId: "rune_mining_speed_legendary", weight: 1, amount: [1, 1] },
  ],

  pouch_mystery_legendary: [
    { itemId: "voidexpanse_basic", weight: 40, amount: [50, 100] },
    { itemId: "eternalnexus_basic", weight: 30, amount: [40, 80] },
    // Scrollit: Painoarvoa laskettu reilusti (20 -> 12), määrä max 5
    { itemId: "scroll_enchant_4", weight: 12, amount: [1, 5] },
    // Lisätty Legendary-tason riimuja eri taidoista
    { itemId: "rune_mining_speed_legendary", weight: 4, amount: [1, 1] },
    { itemId: "rune_woodcutting_speed_legendary", weight: 4, amount: [1, 1] },
    { itemId: "rune_smithing_speed_legendary", weight: 4, amount: [1, 1] },
    { itemId: "rune_crafting_xp_legendary", weight: 3, amount: [1, 1] },
    { itemId: "rune_alchemy_xp_legendary", weight: 3, amount: [1, 1] },
    { itemId: "rune_foraging_speed_legendary", weight: 3, amount: [1, 1] },
  ],
};
