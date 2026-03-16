import type { Resource } from "../types";

export const SCROLLS_DATA: Resource[] = [
  {
    id: "scroll_enchant_1",
    name: "Basic Scroll",
    category: "misc",
    rarity: "common",
    value: 500,
    color: "text-slate-400",
    icon: "/assets/items/enchantingscroll/enchanting_tier1.png",
    description: "Standard enchanting scroll. Max 5% success on final level.",
  },
  {
    id: "scroll_enchant_2",
    name: "Advanced Scroll",
    category: "misc",
    rarity: "uncommon",
    value: 2000,
    color: "text-green-400",
    icon: "/assets/items/enchantingscroll/enchanting_tier2.png",
    description: "Better quality scroll. Max 12% success on final level.",
  },
  {
    id: "scroll_enchant_3",
    name: "Expert Scroll",
    category: "misc",
    rarity: "rare",
    value: 8000,
    color: "text-blue-400",
    icon: "/assets/items/enchantingscroll/enchanting_tier3.png",
    description: "High quality magical scroll. Max 20% success on final level.",
  },
  {
    id: "scroll_enchant_4",
    name: "Divine Scroll",
    category: "misc",
    rarity: "legendary",
    value: 25000,
    color: "text-yellow-400",
    icon: "/assets/items/enchantingscroll/enchanting_tier4.png",
    description:
      "The ultimate catalyst. Guarantees 30% success on final level.",
  },
];

/**
 * SRP: Puhdas apufunktio tierin hakemiseen.
 */
export const getScrollTier = (scrollId: string): number => {
  if (!scrollId || !scrollId.startsWith("scroll_enchant_")) return 0;
  const tier = parseInt(scrollId.replace("scroll_enchant_", ""), 10);
  return isNaN(tier) ? 0 : tier;
};
