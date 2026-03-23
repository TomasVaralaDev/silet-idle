import type { PremiumShopItem } from "../types";

export const PREMIUM_SHOP_ITEMS: PremiumShopItem[] = [
  {
    id: "bundle_starter",
    name: "Starter Bundle",
    description:
      "Requires 800 Gems to unlock. Refunds 400 Gems instantly! Grants +2 Expedition Slots, unlocks all 5 Queue Slots, and 15x T4 Enchant Scrolls.",
    priceGems: 800,
    icon: "/assets/ui/icon_bundle_starter.png",
    category: "Bundles",
    isOneTime: true,
    rewards: {
      rewardGems: 400,
      stats: { expeditionSlotsIncrement: 2, queueSlotsSet: 5 },
      items: { scroll_enchant_4: 15 },
    },
  },
  {
    id: "bundle_explorer_pack",
    name: "Explorer's Starter Pack",
    description: "Grants +1 Expedition Slot.",
    priceGems: 200,
    icon: "/assets/skills/scavenging.png", // Muista lisätä tämä kuva assets-kansioon
    category: "Bundles",
    isOneTime: false,
    maxPurchases: 10,
    rewards: {
      stats: { expeditionSlotsIncrement: 1 },
    },
  },
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
  {
    id: "bundle_offline_time",
    name: "Time Crystal",
    description:
      "Increases your Maximum Offline Progress Time by +2 Hours. (Base is 12 Hours)",
    priceGems: 300,
    icon: "/assets/items/rune_1.png", // Muista lisätä tai vaihtaa tämä kuva
    category: "Utility",
    maxPurchases: 6,
    isOneTime: false,
    rewards: {
      stats: { offlineHoursIncrement: 2 },
    },
  },
];
