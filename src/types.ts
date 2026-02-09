export type SkillType = 
  | 'woodcutting' 
  | 'mining' 
  | 'fishing' 
  | 'farming' 
  | 'cooking' 
  | 'crafting'  // Assembly (Aseet + Lankut)
  | 'smithing'  // Foundry (Armor + Ingots)
  | 'hitpoints' 
  | 'attack' 
  | 'defense' 
  | 'melee' 
  | 'ranged' 
  | 'magic'
  | 'combat';

export type ViewType = SkillType | 'inventory' | 'shop' | 'gamble' | 'achievements';

export type EquipmentSlot = 'head' | 'body' | 'legs' | 'weapon' | 'shield' | 'food';

export type CombatStyle = 'melee' | 'ranged' | 'magic';

export interface ItemStats {
  attack?: number;
  defense?: number;
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
  interval: number;
  value: number;
  icon: string;         // Pieni ikoni (Inventory / Drop)
  actionImage?: string; // Iso kuva (Skill Action, esim. Puu)
  color: string;
  description?: string;
  requiresMapCompletion?: number;
  inputs?: Ingredient[];
  slot?: EquipmentSlot;
  stats?: ItemStats;
  healing?: number;
  category?: string;
  combatStyle?: CombatStyle;
  isBoss?: boolean;
}

export interface ActiveAction {
  skill: SkillType;
  resourceId: string;
}

export interface GameState {
  inventory: Record<string, number>;
  skills: {
    [key in SkillType]: { xp: number, level: number };
  };
  equipment: {
    head: string | null;
    body: string | null;
    legs: string | null;
    weapon: string | null;
    shield: string | null;
  };
  equippedFood: { itemId: string, count: number } | null;
  combatSettings: {
    autoEatThreshold: number;
  };
  activeAction: ActiveAction | null;
  coins: number;
  upgrades: string[];
  unlockedAchievements: string[];
  combatStats: CombatState;
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

export interface CombatMap {
  id: number;
  world: number;
  name: string;
  enemyName: string;
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
  drops: { itemId: string, chance: number, amount: [number, number] }[];
  isBoss?: boolean;
  keyRequired?: string;
}