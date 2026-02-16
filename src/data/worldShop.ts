import type { WorldShopItem } from '../types';

export const WORLD_SHOP_DATA: WorldShopItem[] = [
  // --- WORLD 1: GREENVALE (Forest themed) ---
  {
    id: 'w1_potion',
    name: 'Forest Elixir',
    description: 'Restores health. Brewed from Greenvale dust.',
    icon: '/assets/items/potion_red.png',
    costCoins: 250,
    costMaterials: [{ itemId: 'greenvale_basic', amount: 20 }],
    worldId: 1, resultItemId: 'potion_basic', resultAmount: 5
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
    worldId: 1, resultItemId: 'bosskey_w1', resultAmount: 1
  },

  // --- WORLD 2: STONEFALL (Mountain/Ore themed) ---
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
  // Voit jatkaa tätä muihin maailmoihin samalla kaavalla...
];