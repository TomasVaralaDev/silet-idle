import type { PremiumShopItem } from "../types";

export const PREMIUM_SHOP_ITEMS: PremiumShopItem[] = [
  {
    id: "boost_xp_24h",
    name: "Tome of Insight (24h)",
    description: "Double all XP gained for 24 hours.",
    priceGems: 100,
    icon: "/assets/items/book_blue.png",
    category: "Boosts",
  },
  {
    id: "utility_bag_slot",
    name: "Extra Inventory Space",
    description: "Permanently unlock +20 inventory slots.",
    priceGems: 250,
    icon: "/assets/ui/icon_inventory.png",
    category: "Utility",
    isOneTime: true,
  },
  {
    id: "cosmetic_crown",
    name: "Golden Crown",
    description: "A cosmetic crown to show off your wealth.",
    priceGems: 500,
    icon: "/assets/items/armor/armor_head_gold.png",
    category: "Cosmetics",
    isOneTime: true,
  },
  {
    id: "bundle_starter",
    name: "Starter Bundle",
    description: "Includes 5x T1 Scrolls, 1000 Coins, and a 1h XP Boost.",
    priceGems: 50,
    icon: "/assets/ui/icon_quest.png",
    category: "Bundles",
  },
];
