import type { WorldShopItem } from "../types";
import { SCROLLS_DATA } from "./scrolls";
// HUOM! Varmista, että tämä polku osoittaa oikeaan tiedostoon, jossa miningResources on!
import { miningResources } from "./skills/mining";
// HUOM! Varmista myös pussukoiden polku
import { MYSTERY_POUCHES } from "./pouches";
import { alchemyResources } from "./skills/alchemy";

// --- 1. KÄÄRÖJEN ASETUKSET ---
const WORLD_SHOP_CONFIG = [
  { worldId: 1, tiers: [1], matName: "greenvale" },
  { worldId: 2, tiers: [1, 2], matName: "stonefall" },
  { worldId: 3, tiers: [1, 2, 3], matName: "ashridge" },
  { worldId: 4, tiers: [2, 3, 4], matName: "frostreach" },
  { worldId: 5, tiers: [3, 4, 5], matName: "duskwood" },
  { worldId: 6, tiers: [3, 4], matName: "stormcoast" },
  { worldId: 7, tiers: [1, 2, 3, 4], matName: "voidexpanse" },
  { worldId: 8, tiers: [4], matName: "eternalnexus" },
];

const DAILY_LIMITS: Record<number, number> = {
  1: 50,
  2: 15,
  3: 5,
  4: 1,
};

// --- 2. MALMIEN ASETUKSET ---
const WORLD_ORE_CONFIG = [
  { worldId: 1, oreId: "ore_copper", matName: "greenvale" },
  { worldId: 2, oreId: "ore_iron", matName: "stonefall" },
  { worldId: 3, oreId: "ore_gold", matName: "ashridge" },
  { worldId: 4, oreId: "ore_mithril", matName: "frostreach" },
  { worldId: 5, oreId: "ore_adamantite", matName: "duskwood" },
  { worldId: 6, oreId: "ore_emerald", matName: "stormcoast" },
  { worldId: 7, oreId: "ore_starfallalloy", matName: "voidexpanse" },
  { worldId: 8, oreId: "ore_eternium", matName: "eternalnexus" },
];

// --- 3. PUSSUKOIDEN ASETUKSET ---
const WORLD_POUCH_CONFIG = [
  { worldId: 1, pouchId: "pouch_mystery_minor", matName: "greenvale" },
  { worldId: 2, pouchId: "pouch_mystery_minor", matName: "stonefall" },
  { worldId: 3, pouchId: "pouch_mystery_minor", matName: "ashridge" },
  { worldId: 4, pouchId: "pouch_mystery_major", matName: "frostreach" },
  { worldId: 5, pouchId: "pouch_mystery_major", matName: "duskwood" },
  { worldId: 6, pouchId: "pouch_mystery_major", matName: "stormcoast" },
  { worldId: 7, pouchId: "pouch_mystery_legendary", matName: "voidexpanse" },
  { worldId: 8, pouchId: "pouch_mystery_legendary", matName: "eternalnexus" },
];

// Pussukoiden hinnat ja päivärajat
const POUCH_COSTS: Record<
  string,
  { coins: number; mats: number; limit: number }
> = {
  pouch_mystery_minor: { coins: 5000, mats: 500, limit: 3 }, // 3 kpl / päivä
  pouch_mystery_major: { coins: 25000, mats: 1500, limit: 2 }, // 2 kpl / päivä
  pouch_mystery_legendary: { coins: 100000, mats: 5000, limit: 1 }, // 1 kpl / päivä
};

const DYNAMIC_SHOP_ITEMS: WorldShopItem[] = [];

// Generoidaan kääröt (Scrolls)
WORLD_SHOP_CONFIG.forEach(({ worldId, tiers, matName }) => {
  tiers.forEach((tier) => {
    const targetScrollId = `scroll_enchant_${tier}`;
    const scrollItem = SCROLLS_DATA.find((s) => s.id === targetScrollId);

    if (scrollItem) {
      // Määritetään materiaalin tyyppi tierin mukaan
      let materialSuffix = "basic";
      let matAmount = tier * 12;

      if (tier >= 5) {
        materialSuffix = "exotic";
        matAmount = 10; // Exoticit ovat kalliita, 1 kpl riittää
      } else if (tier >= 3) {
        materialSuffix = "rare";
        matAmount = Math.max(10, tier - 30); // Esim. Tier 3 vaatii 1kpl, Tier 4 vaatii 2kpl
      }

      const coinCost = Math.floor(500 * Math.pow(2, tier - 1)); // Nostettu kerrointa hieman (1.5 -> 2)
      const dailyLimit = DAILY_LIMITS[tier] || 1;

      DYNAMIC_SHOP_ITEMS.push({
        id: `shop_w${worldId}_scroll_t${tier}`,
        name: scrollItem.name,
        description: scrollItem.description || "A powerful magical scroll.",
        icon: scrollItem.icon || "",
        costCoins: coinCost,
        // Käytetään dynaamisesti oikeaa materiaalia (basic, rare tai exotic)
        costMaterials: [
          {
            itemId: `${matName}_${materialSuffix}`,
            amount: matAmount,
          },
        ],
        worldId: worldId,
        resultItemId: scrollItem.id,
        resultAmount: 1,
        dailyLimit: dailyLimit,
      });
    }
  });
});
// Generoidaan malminiput (Ores)
WORLD_ORE_CONFIG.forEach(({ worldId, oreId, matName }) => {
  const oreItem = miningResources.find((o) => o.id === oreId);

  if (oreItem) {
    // Hinnan laskenta: Oletetaan että nippu maksaa kolikossa tuplasti sen mitä 100x malmia olisi arvoltaan
    // Materiaalikuluna pidetään 10x maailman omaa perusmateriaalia. Voit vapaasti hienosäätää näitä!
    const baseOreValue = oreItem.value || 1;
    const coinCost = baseOreValue * 100 * 2;
    const matAmount = 1000;

    DYNAMIC_SHOP_ITEMS.push({
      id: `shop_w${worldId}_ore_bundle`,
      name: `${oreItem.name} Shipment`, // Näyttää kaupassa esim. "Copper Ore Shipment"
      description: `A heavy crate containing 100x ${oreItem.name}.`,
      icon: oreItem.icon || "",
      costCoins: coinCost,
      costMaterials: [{ itemId: `${matName}_basic`, amount: matAmount }],
      worldId: worldId,
      resultItemId: oreItem.id,
      resultAmount: 100, // Antaa 100 kpl
      dailyLimit: 1, // Vain 1 setti (eli 100 kpl) päivässä per maailma
    });
  }
});

// Generoidaan Mysteeripussukat (Pouches)
WORLD_POUCH_CONFIG.forEach(({ worldId, pouchId, matName }) => {
  const pouchItem = MYSTERY_POUCHES.find((p) => p.id === pouchId);

  if (pouchItem) {
    const costs = POUCH_COSTS[pouchId];

    DYNAMIC_SHOP_ITEMS.push({
      id: `shop_w${worldId}_${pouchId}`,
      name: pouchItem.name,
      description: pouchItem.description || "A mysterious pouch.",
      icon: pouchItem.icon || "",
      costCoins: costs.coins,
      costMaterials: [{ itemId: `${matName}_basic`, amount: costs.mats }],
      worldId: worldId,
      resultItemId: pouchItem.id,
      resultAmount: 1,
      dailyLimit: costs.limit,
    });
  }
});

// D. Generoidaan Bossi-avaimet (Boss Keys) - UUSI OSIO
WORLD_SHOP_CONFIG.forEach(({ worldId, matName }) => {
  const bossKeyId = `bosskey_w${worldId}`;

  // Hinnan skaalaus: W1 = 10k, W8 = 80k. Materiaalit W1 = 250, W8 = 2000.
  const coinCost = 10000 * worldId;
  const matAmount = 250 * worldId;

  DYNAMIC_SHOP_ITEMS.push({
    id: `shop_w${worldId}_bosskey`,
    name: `World ${worldId} Boss Key`,
    description: "Provides access to the regional boss. Rare and heavy.",
    icon: `/assets/items/bosskey/${bossKeyId}.png`,
    costCoins: coinCost,
    costMaterials: [{ itemId: `${matName}_basic`, amount: matAmount }],
    worldId: worldId,
    resultItemId: bossKeyId,
    resultAmount: 1,
    dailyLimit: 1, // Vain 1 kpl päivässä
  });
});

// E. Generoidaan Potion-niput (Potions) - UUSI OSIO
WORLD_SHOP_CONFIG.forEach(({ worldId, matName }) => {
  const targetPotionId = `potion_tier${worldId}`;
  const potionItem = alchemyResources.find((p) => p.id === targetPotionId);

  if (potionItem) {
    // Hinta 10 potionin nipulle: tuplahinta perusarvoon nähden (gold sink)
    const basePotionValue = potionItem.value || 10;
    const coinCost = basePotionValue * 10 * 2;

    // Vaatii hieman perusmateriaalia, esim. 50 kpl per World-taso per nippu
    const matAmount = 50 * worldId;

    DYNAMIC_SHOP_ITEMS.push({
      id: `shop_w${worldId}_potion_bundle`,
      name: `${potionItem.name} x10`,
      description: `A bundle of 10 ${potionItem.name}s for combat.`,
      icon: potionItem.icon || "",
      costCoins: coinCost,
      costMaterials: [{ itemId: `${matName}_basic`, amount: matAmount }],
      worldId: worldId,
      resultItemId: potionItem.id,
      resultAmount: 10, // Antaa 10 potiona kerralla
      dailyLimit: 5, // Pelaaja voi ostaa näitä max 5 nippua (50 potiona) päivässä
    });
  }
});

// --- 4. EXPORT ---
export const WORLD_SHOP_DATA: WorldShopItem[] = DYNAMIC_SHOP_ITEMS.sort(
  (a, b) => a.worldId - b.worldId || a.costCoins - b.costCoins,
);
