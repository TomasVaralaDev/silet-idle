import type { PremiumShopItem } from "../types";

export const PREMIUM_SHOP_ITEMS: PremiumShopItem[] = [
  {
    id: "boost_xp_24h",
    name: "Tome of Insight (24h)",
    description: "Double all XP gained for 24 hours.",
    priceGems: 100,
    icon: "/assets/items/book_blue.png",
    category: "Boosts",
    // Boostien logiikka käsitellään usein erillisen buff-järjestelmän kautta,
    // joten niille ei välttämättä tarvita tässä rewards-objektia.
  },
  {
    id: "utility_bag_slot",
    name: "Extra Inventory Space",
    description: "Permanently unlock +20 inventory slots.",
    priceGems: 250,
    icon: "/assets/ui/icon_inventory.png",
    category: "Utility",
    isOneTime: true,
    rewards: {
      stats: { inventorySlots: 20 },
    },
  },
  {
    id: "cosmetic_crown",
    name: "Golden Crown",
    description: "A cosmetic crown to show off your wealth.",
    priceGems: 500,
    icon: "/assets/items/armor/armor_head_gold.png",
    category: "Cosmetics",
    isOneTime: true,
    rewards: {
      items: { cosmetic_crown: 1 },
    },
  },
  {
    id: "bundle_starter",
    name: "Starter Bundle",
    description:
      "Requires 800 Gems to unlock. Refunds 800 Gems instantly! Grants +2 Expedition Slots, unlocks all 5 Queue Slots, and 15x T4 Enchant Scrolls.",
    priceGems: 800,
    icon: "/assets/ui/icon_bundle_starter.png",
    category: "Bundles",
    isOneTime: true,
    rewards: {
      rewardGems: 800,
      stats: { expeditionSlotsIncrement: 2, queueSlotsSet: 5 },
      items: { scroll_enchant_4: 15 },
    },
  },
  {
    id: "bundle_explorer_pack",
    name: "Explorer's Starter Pack",
    description: "Grants +1 Expedition Slot, 500 Wood, and 5 Mystical Keys.",
    priceGems: 1500,
    icon: "/assets/ui/icon_bundle_explorer.png", // Muista lisätä tämä kuva assets-kansioon
    category: "Bundles",
    isOneTime: true,
    rewards: {
      stats: { expeditionSlotsIncrement: 1 },
      items: { wood: 500, mystic_key: 5 },
    },
  },
  // Lisää PREMIUM_SHOP_ITEMS listaan:
  {
    id: "bundle_legendary_runes",
    name: "Master Artisan's Rune Bundle",
    description:
      "A divine collection of every Legendary Speed Rune. Become the ultimate master of all gathering and crafting skills instantly.",
    priceGems: 800,
    icon: "/assets/items/runes/rune_7.png", // Käytetään hienointa riimun ikonia paketin kuvana
    category: "Bundles",
    isOneTime: true,
    rewards: {
      items: {
        rune_mining_speed_legendary: 1,
        rune_woodcutting_speed_legendary: 1,
        rune_foraging_speed_legendary: 1,
        rune_smithing_speed_legendary: 1,
        rune_crafting_speed_legendary: 1,
        rune_alchemy_speed_legendary: 1,
      },
    },
  },
];
