import { WORLD_INFO, WORLD_LOOT } from "./worlds";
import { COMBAT_DATA } from "./combat";
import { GAME_DATA } from "./skills";
import { SHOP_ITEMS } from "./shop";
import { ACHIEVEMENTS } from "./achievements";
import { RUNES_DATA } from "./runes";
import { SCROLLS_DATA } from "./scrolls"; // UUSI IMPORT
import {
  getBaseId,
  getEnchantLevel,
  applyEnchantStats,
} from "../utils/enchanting";
import type { Resource } from "../types";

export {
  WORLD_INFO,
  WORLD_LOOT,
  COMBAT_DATA,
  GAME_DATA,
  SHOP_ITEMS,
  ACHIEVEMENTS,
  RUNES_DATA,
  SCROLLS_DATA,
};

/**
 * 1. Määritellään Factory-rajapinta.
 */
interface ItemSubFactory {
  canHandle: (id: string) => boolean;
  create: (id: string) => Partial<Resource>;
}

/**
 * 2. Rune Factory (DYNAAMINEN)
 */
const RuneFactory: ItemSubFactory = {
  canHandle: (id) => id.startsWith("rune_"),
  create: (id) => {
    const rune = RUNES_DATA.find((r) => r.id === id);
    return rune || {};
  },
};

/**
 * 3. World Loot Factory
 */
const WorldLootFactory: ItemSubFactory = {
  canHandle: (id) =>
    !id.startsWith("rune_") &&
    (id.includes("_basic") || id.includes("_rare") || id.includes("_exotic")),
  create: (id) => {
    const parts = id.split("_");
    const worldNameRaw = parts[0];
    const type = parts[parts.length - 1];

    const worldDisplay =
      worldNameRaw.charAt(0).toUpperCase() + worldNameRaw.slice(1);

    const configs: Record<
      string,
      { suffix: string; val: number; rar: Resource["rarity"]; col: string }
    > = {
      basic: { suffix: "Dust", val: 10, rar: "common", col: "text-slate-400" },
      rare: { suffix: "Gem", val: 100, rar: "rare", col: "text-cyan-400" },
      exotic: {
        suffix: "Elite",
        val: 1000,
        rar: "legendary",
        col: "text-orange-500",
      },
    };

    const config = configs[type];
    if (!config) return { name: id, value: 0, rarity: "common" };

    return {
      name: `${worldDisplay} ${config.suffix}`,
      value: config.val,
      rarity: config.rar,
      color: config.col,
      icon: `/assets/lootpoolszones/${id}.png`,
      description: `${config.rar} energy source from ${worldDisplay}.`,
    };
  },
};

/**
 * 4. Key Factory
 */
const KeyFactory: ItemSubFactory = {
  canHandle: (id) => id.startsWith("bosskey_w"),
  create: (id) => {
    const worldNum = id.replace("bosskey_w", "");
    return {
      name: `World ${worldNum} Key`,
      value: 500,
      color: "text-yellow-500",
      icon: `/assets/items/bosskey/${id}.png`,
      description: "Provides access to the regional boss.",
      rarity: "rare",
      isUnique: false,
    };
  },
};

/**
 * 5. Enchant Scroll Factory
 * OCP: Hakee nyt puhtaasti SCROLLS_DATA -taulukosta!
 */
const EnchantScrollFactory: ItemSubFactory = {
  canHandle: (id) => id.startsWith("scroll_enchant_"),
  create: (id) => {
    const scroll = SCROLLS_DATA.find((s) => s.id === id);
    return scroll || {};
  },
};

/**
 * 6. Skill Resource Factory
 */
const SkillResourceFactory: ItemSubFactory = {
  canHandle: (id: string) => {
    const categories = Object.values(GAME_DATA) as Resource[][];
    return categories.some((skillList) =>
      skillList.some((item) => item.id === id),
    );
  },
  create: (id: string) => {
    const categories = Object.values(GAME_DATA) as Resource[][];
    for (const skillList of categories) {
      const found = skillList.find((item) => item.id === id);
      if (found) return found;
    }
    return {};
  },
};

/**
 * 7. PÄÄTEHDAS (The Master Factory)
 */
export const getItemDetails = (id: string): Resource | null => {
  if (!id) return null;

  if (id === "coins") {
    return {
      id: "coins",
      name: "Coins",
      value: 1,
      icon: "/assets/ui/coins.png",
      rarity: "common",
    } as Resource;
  }

  const baseId = getBaseId(id);
  const enchantLevel = getEnchantLevel(id);

  const factories = [
    RuneFactory,
    KeyFactory,
    EnchantScrollFactory, // Nyt täysin puhdas
    WorldLootFactory,
    SkillResourceFactory,
  ];

  const factory = factories.find((f) => f.canHandle(baseId));

  if (!factory) return null;

  const baseItem = factory.create(baseId);
  const finalItem = { ...baseItem, id: id } as Resource;

  return enchantLevel > 0
    ? applyEnchantStats(finalItem, enchantLevel)
    : finalItem;
};
