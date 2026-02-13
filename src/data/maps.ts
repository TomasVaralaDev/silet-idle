// src/data/maps.ts

export interface GameMap {
  id: string;
  name: string;
  levelRequirement: number;
  enemies: string[]; // Enemy ID:t
  worldId: number; // Lisätään worldId jotta filtteröinti toimii
}

export const CAMPAIGN_MAPS: GameMap[] = [
  // WORLD 1: Greenvale
  { id: 'zone_1_1', name: 'Slime Fields', levelRequirement: 1, enemies: ['slime_green'], worldId: 1 },
  { id: 'zone_1_2', name: 'Rat Cellar', levelRequirement: 3, enemies: ['giant_rat'], worldId: 1 },
  { id: 'zone_1_3', name: 'Goblin Camp', levelRequirement: 5, enemies: ['goblin_grunt'], worldId: 1 },

  // WORLD 2: Stonefall
  { id: 'zone_2_1', name: 'Rocky Pass', levelRequirement: 10, enemies: ['rock_crab'], worldId: 2 },
  { id: 'zone_2_2', name: 'Deep Mine', levelRequirement: 12, enemies: ['bat', 'miner_ghost'], worldId: 2 },

  // Lisää lisää tarpeen mukaan...
];