export type SkillType = 
  | 'woodcutting' | 'mining' | 'fishing' | 'farming' 
  | 'crafting' | 'smithing' | 'cooking' 
  | 'hitpoints' | 'attack' | 'defense' 
  | 'melee' | 'ranged' | 'magic' | 'combat'
  | 'scavenging';

export type ViewType = SkillType | 'inventory' | 'shop' | 'gamble' | 'achievements' | 'scavenger';

export type EquipmentSlot = 'head' | 'body' | 'legs' | 'weapon' | 'shield' | 'necklace' | 'ring' | 'rune' | 'skill' | 'food';

export type CombatStyle = 'melee' | 'ranged' | 'magic';

export interface GameSettings {
  notifications: boolean;
  sound: boolean;
  music: boolean;
  particles: boolean;
}

export interface ActiveAction {
  skill: SkillType;
  resourceId: string;
}

export interface CombatState {
  hp: number;
  currentMapId: number | null;
  maxMapCompleted: number;
  enemyCurrentHp: number;
  respawnTimer: number;
  foodTimer: number;
  maxHp?: number; 
}

export interface Ingredient {
  id: string;
  count: number;
}

export interface Resource {
  id: string;
  name: string;
  levelRequired: number;
  xpReward: number;
  interval: number; // ms
  value: number;
  icon: string;
  color: string;
  description?: string;
  actionImage?: string; 
  inputs?: Ingredient[];
  slot?: EquipmentSlot;
  stats?: {
    attack?: number;
    defense?: number;
    strength?: number;
  };
  healing?: number;
  combatStyle?: CombatStyle; 
  requiresMapCompletion?: number; 
  category?: string;
}

// Tämä on vihollisten omille dropeille (prosenttiperustainen)
export interface Drop {
  itemId: string;
  chance: number; // 0.0 - 1.0
  amount: [number, number]; 
}

// UUSI: Tämä on World Loottia varten (painoperustainen)
export interface WeightedDrop {
  itemId: string;
  weight: number; // Esim. 1000, 500, 10
  amount: [number, number]; 
}

export interface CombatMap {
  id: number;
  world: number;
  name: string;
  enemyName: string;
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
  drops: Drop[]; // Vihollisen omat dropit
  isBoss?: boolean;
  keyRequired?: string; 
  image?: string; 
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  multiplier: number; 
  skill: SkillType;
  icon: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (state: GameState) => boolean;
}

export interface Expedition {
  id: string;
  mapId: number;
  startTime: number;
  duration: number;
  completed: boolean;
}

export interface ScavengerState {
  activeExpeditions: Expedition[];
  unlockedSlots: number;
}

export interface CombatSettings {
  autoEatThreshold: number; 
  autoProgress: boolean;    
}

export interface WeightedDrop {
  itemId: string;
  weight: number;
  amount: [number, number];
}

export interface GameState {
  username: string; 
  settings: GameSettings;
  inventory: Record<string, number>;
  skills: Record<SkillType, { xp: number, level: number }>;
  equipment: Record<Exclude<EquipmentSlot, 'food'>, string | null>;
  equippedFood: { itemId: string, count: number } | null;
  combatSettings: CombatSettings;
  scavenger: ScavengerState;
  activeAction: ActiveAction | null;
  coins: number;
  upgrades: string[]; 
  unlockedAchievements: string[];
  combatStats: CombatState;
}