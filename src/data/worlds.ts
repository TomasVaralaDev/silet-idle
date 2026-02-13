import type { WeightedDrop } from '../types';

export const WORLD_INFO: Record<number, { name: string; image: string; description: string }> = {
  1: { name: "Greenvale", image: "/assets/backgrounds/bg_greenvale.png", description: "A lush forest teeming with basic life." },
  2: { name: "Stonefall", image: "/assets/backgrounds/bg_stonefall.png", description: "Rocky terrain and deep mines." },
  3: { name: "Ashridge", image: "/assets/backgrounds/bg_ashbridge.png", description: "Volcanic lands filled with fire." },
  4: { name: "Frostreach", image: "/assets/backgrounds/bg_frostreach.png", description: "Frozen wastelands and icy peaks." },
  5: { name: "Duskwood", image: "/assets/backgrounds/bg_duskwood.png", description: "A cursed forest consumed by shadow." },
  6: { name: "Stormcoast", image: "/assets/backgrounds/bg_stormcoast.png", description: "Treacherous cliffs and raging seas." },
  7: { name: "Void Expanse", image: "/assets/backgrounds/bg_voidexpanse.png", description: "The fabric of reality is thin here." },
  8: { name: "Eternal Nexus", image: "/assets/backgrounds/bg_eternalnexus.png", description: "The center of all timelines." }
};

export const WORLD_LOOT: Record<number, WeightedDrop[]> = {
  1: [
    { itemId: 'greenvale_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'bosskey_w1', weight: 10, amount: [1, 1] }
  ],
  2: [
    { itemId: 'stonefall_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'stonefall_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w2', weight: 10, amount: [1, 1] }
  ],
  3: [
    { itemId: 'ashridge_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'ashridge_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w3', weight: 10, amount: [1, 1] }
  ],
  4: [
    { itemId: 'frostreach_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'frostreach_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w4', weight: 10, amount: [1, 1] }
  ],
  5: [
    { itemId: 'duskwood_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'duskwood_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w5', weight: 10, amount: [1, 1] }
  ],
  6: [
    { itemId: 'stormcoast_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'stormcoast_rare', weight: 300, amount: [1, 1] },
    { itemId: 'stormcoast_exotic', weight: 50, amount: [1, 1] },
    { itemId: 'bosskey_w6', weight: 10, amount: [1, 1] }
  ],
  7: [
    { itemId: 'voidexpanse_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'voidexpanse_rare', weight: 300, amount: [1, 1] },
    { itemId: 'voidexpanse_exotic', weight: 50, amount: [1, 1] },
    { itemId: 'bosskey_w7', weight: 10, amount: [1, 1] }
  ],
  8: [
    { itemId: 'eternalnexus_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'eternalnexus_rare', weight: 300, amount: [1, 1] },
    { itemId: 'eternalnexus_exotic', weight: 50, amount: [1, 1] },
    { itemId: 'bosskey_w8', weight: 10, amount: [1, 1] }
  ]
};