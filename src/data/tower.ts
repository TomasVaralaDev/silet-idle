import type { Enemy, RewardEntry } from "../types";

export interface TowerFloor {
  floorNumber: number;
  enemy: Enemy;
  firstClearRewards: RewardEntry[];
  sweepRewards: RewardEntry[];
}

export const TOWER_FLOORS: TowerFloor[] = [
  {
    floorNumber: 1,
    enemy: {
      id: "tower_guard_1",
      name: "Thorn Crawler",
      icon: "./assets/enemies/world1_greenvale/enemy_crawler_thorn.png", // Varmista että sinulla on joku ikoni
      maxHp: 250,
      currentHp: 250,
      level: 5,
      attack: 15,
      defense: 5,
      xpReward: 100,
    },
    firstClearRewards: [
      { itemId: "armor_adamantite_body_e5", amount: 10 }, // Esimerkki uniikista dropista
      { itemId: "coins", amount: 100 },
    ],
    sweepRewards: [
      { itemId: "iron_ore", amount: 10 },
      { itemId: "coins", amount: 500 },
    ],
  },
  {
    floorNumber: 2,
    enemy: {
      id: "tower_guard_2",
      name: "Woodland Stalker",
      icon: "./assets/enemies/world1_greenvale/enemy_stalker_woodland.png",
      maxHp: 500,
      currentHp: 500,
      level: 10,
      attack: 25,
      defense: 10,
      xpReward: 250,
    },
    firstClearRewards: [
      { itemId: "iron_armor_e1", amount: 1 },
      { itemId: "coins", amount: 50 },
    ],
    sweepRewards: [
      { itemId: "iron_ingot", amount: 5 },
      { itemId: "coins", amount: 100 },
    ],
  },
  {
    floorNumber: 3,
    enemy: {
      id: "tower_boss_1",
      name: "Lava Beetle",
      icon: "./assets/enemies/world3_ashridge/enemy_beetle_lava.png",
      maxHp: 1200,
      currentHp: 1200,
      level: 15,
      attack: 45,
      defense: 20,
      xpReward: 600,
    },
    firstClearRewards: [
      { itemId: "steel_sword_e1", amount: 1 },
      { itemId: "coins", amount: 100 },
    ],
    sweepRewards: [
      { itemId: "steel_ingot", amount: 3 },
      { itemId: "coins", amount: 250 },
    ],
  },
];
