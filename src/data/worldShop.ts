import type { WorldShopItem } from '../types';

// 1. Konfiguraatio: Enchant Scrollien tasot ja ominaisuudet
const ENCHANT_SCROLL_TIERS = [
  { w: 1, name: 'Minor Enchantment', chance: 5, limit: 100, matName: 'greenvale' },
  { w: 2, name: 'Lesser Enchantment', chance: 8, limit: 80, matName: 'stonefall' },
  { w: 3, name: 'Scroll of Binding', chance: 12, limit: 60, matName: 'tideshelf' }, // Oletusnimi
  { w: 4, name: 'Scroll of Infusion', chance: 15, limit: 50, matName: 'sunfire' },  // Oletusnimi
  { w: 5, name: 'Greater Enchantment', chance: 20, limit: 40, matName: 'void' },    // Oletusnimi
  { w: 6, name: 'Master Enchantment', chance: 25, limit: 30, matName: 'iron' },    // Oletusnimi
  { w: 7, name: 'Ancient Scroll', chance: 30, limit: 20, matName: 'crimson' }, // Oletusnimi
  { w: 8, name: 'Celestial Scroll', chance: 40, limit: 10, matName: 'celestial' } // Oletusnimi
];

// 2. Helper-funktio scrollien luomiseen kauppaan
const generateEnchantScroll = (config: typeof ENCHANT_SCROLL_TIERS[0]): WorldShopItem => {
  const { w, name, chance, limit, matName } = config;
  
  // Lasketaan hinta dynaamisesti: (500, 750, 1125...)
  const coinCost = Math.floor(500 * Math.pow(1.5, w - 1));
  const matAmount = 1 * w;

  return {
    id: `shop_scroll_enchant_w${w}`, // Uniikki ID kaupalle
    name: name,
    description: `Increases enchanting success chance by +${chance}%.`,
    icon: `/assets/items/enchantingscroll/enchanting_tier${w}.png`,
    costCoins: coinCost,
    costMaterials: [
      { itemId: `${matName}_basic`, amount: matAmount }
    ],
    worldId: w,
    resultItemId: `scroll_enchant_w${w}`, // Tämä ID menee inventoryyn (ja ItemFactory tunnistaa tämän)
    resultAmount: 1,
    dailyLimit: limit
  };
};

// 3. Generoidaan dynaamiset scrollit
const DYNAMIC_SCROLLS = ENCHANT_SCROLL_TIERS.map(generateEnchantScroll);

// 4. Manuaaliset esineet
const MANUAL_ITEMS: WorldShopItem[] = [
  // --- WORLD 1: GREENVALE ---
  {
    id: 'w1_potion',
    name: 'Forest Elixir',
    description: 'Restores health. Brewed from Greenvale dust.',
    icon: '/assets/items/potion_red.png',
    costCoins: 250,
    costMaterials: [{ itemId: 'greenvale_basic', amount: 20 }],
    worldId: 1, resultItemId: 'potion_basic', resultAmount: 5,
    dailyLimit: 10
  },
  {
    id: 'w1_bundle',
    name: 'Woodcutters Bundle',
    description: 'A pack of high-quality logs and twigs.',
    icon: '/assets/items/wood_bundle.png',
    costCoins: 500,
    costMaterials: [{ itemId: 'greenvale_basic', amount: 50 }],
    worldId: 1, resultItemId: 'oak_log', resultAmount: 25
  },
  {
    id: 'w1_key',
    name: 'Ancient Greenvale Key',
    description: 'Guaranteed access to the Forest Guardian.',
    icon: '/assets/items/bosskey/bosskey_w1.png',
    costCoins: 2500,
    costMaterials: [{ itemId: 'greenvale_basic', amount: 5 }], 
    worldId: 1, resultItemId: 'bosskey_w1', resultAmount: 1,
    dailyLimit: 10
  },

  // --- WORLD 2: STONEFALL ---
  {
    id: 'w2_stone',
    name: 'Refined Whetstone',
    description: 'Used for high-level smithing and enchanting.',
    icon: '/assets/items/stone_upgrade.png',
    costCoins: 1000,
    costMaterials: [{ itemId: 'stonefall_basic', amount: 40 }],
    worldId: 2, resultItemId: 'upgrade_shard', resultAmount: 2
  },
  {
    id: 'w2_ore',
    name: 'Iron Consignment',
    description: 'Bulk shipment of raw iron ore.',
    icon: '/assets/items/iron_ore.png',
    costCoins: 800,
    costMaterials: [{ itemId: 'stonefall_basic', amount: 60 }],
    worldId: 2, resultItemId: 'iron_ore', resultAmount: 30
  },
  {
    id: 'w2_pendant',
    name: 'Stonefall Emblem',
    description: 'A rare emblem that boosts defense slightly.',
    icon: '/assets/items/emblem_stone.png',
    costCoins: 5000,
    costMaterials: [{ itemId: 'stonefall_rare', amount: 10 }, { itemId: 'stonefall_exotic', amount: 1 }],
    worldId: 2, resultItemId: 'stone_pendant', resultAmount: 1
  }
];

// 5. Yhdistetään ja exportataan
export const WORLD_SHOP_DATA: WorldShopItem[] = [
  ...MANUAL_ITEMS,
  ...DYNAMIC_SCROLLS
].sort((a, b) => a.worldId - b.worldId || a.costCoins - b.costCoins);