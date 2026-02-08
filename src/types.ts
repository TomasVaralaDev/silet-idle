export type SkillType = 
  | 'woodcutting' | 'mining' | 'fishing' | 'farming' | 'crafting' | 'cooking'
  | 'hitpoints' | 'melee' | 'ranged' | 'magic' | 'defense' | 'attack';

export interface Ingredient {
  id: string;
  count: number;
}

export type EquipmentSlot = 'head' | 'body' | 'legs' | 'weapon' | 'shield';

export type CombatStyle = 'melee' | 'ranged' | 'magic';

export interface Resource {
  id: string;
  name: string;
  levelRequired: number;
  xpReward: number;
  interval: number;
  value: number;
  icon: string;
  color: string;
  description: string;
  inputs?: Ingredient[];
  slot?: EquipmentSlot | 'food';
  healing?: number;
  stats?: { attack?: number; defense?: number; strength?: number };
  category?: string;
  requiresMapCompletion?: number; 
  combatStyle?: CombatStyle;
}

export interface MapDrop {
  itemId: string;
  chance: number; 
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
  drops: MapDrop[];
  isBoss?: boolean;
  keyRequired?: string;
}

export interface CombatState {
  hp: number;
  maxHp?: number;
  currentMapId: number | null;
  maxMapCompleted: number;
  enemyCurrentHp: number;
  respawnTimer: number;
  foodTimer: number;
}

export type ActiveAction = { skill: SkillType | 'combat'; resourceId: string };

export interface GameState {
  inventory: Record<string, number>;
  skills: Record<SkillType, { xp: number; level: number }>;
  equipment: {
    head: string | null;
    body: string | null;
    legs: string | null;
    weapon: string | null;
    shield: string | null;
  };
  equippedFood: { itemId: string; count: number } | null;
  combatSettings: {
    autoEatThreshold: number;
  };
  activeAction: ActiveAction | null;
  coins: number;
  upgrades: string[];
  unlockedAchievements: string[];
  combatStats: CombatState;
}

export type ViewType = SkillType | 'inventory' | 'shop' | 'gamble' | 'achievements' | 'combat';

export type ShopItem = { 
  id: string; 
  name: string; 
  cost: number; 
  multiplier: number; 
  skill: SkillType; 
  icon: string; 
  description: string; 
};

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string; // TÄMÄ PUUTTUI
  condition: (state: GameState) => boolean;
}