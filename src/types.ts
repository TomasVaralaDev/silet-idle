export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type SkillType = 
  | 'woodcutting' | 'mining' | 'fishing' | 'farming' 
  | 'crafting' | 'smithing' | 'cooking' 
  | 'hitpoints' | 'attack' | 'defense' 
  | 'melee' | 'ranged' | 'magic' | 'combat'
  | 'scavenging';

export type ViewType = SkillType | 'inventory' | 'shop' | 'gamble' | 'achievements' | 'scavenger' | 'enchanting';

export type EquipmentSlot = 'head' | 'body' | 'legs' | 'weapon' | 'shield' | 'necklace' | 'ring' | 'rune' | 'skill' | 'food';

export type CombatStyle = 'melee' | 'ranged' | 'magic';

// --- EVENT TYPES ---
export type GameEventType = 'info' | 'success' | 'warning' | 'error' | 'loot' | 'combat' | 'levelUp';

export interface GameEvent {
  id: string;
  type: GameEventType;
  message: string;
  icon?: string;
  timestamp: number;
}

export interface GameSettings {
  notifications: boolean;
  sound: boolean;
  music: boolean;
  particles: boolean;
}

export interface ActiveAction {
  skill: SkillType;
  resourceId: string;
  progress: number;
  targetTime: number;
}

// --- COMBAT TYPES ---

export interface Enemy {
  id: string;
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  level: number;
  attack: number;
  defense: number;
  xpReward: number;
}

export interface CombatLogEntry {
  message: string;
  timestamp: string;
  type?: 'damage' | 'heal' | 'info' | 'loot';
}

// Taistelun hetkellinen tila
export interface CombatState {
  hp: number;
  currentMapId: number | null;
  maxMapCompleted: number;
  enemyCurrentHp: number;
  respawnTimer: number;
  foodTimer: number;
  combatLog: string[];
  attackTimer?: number; // Lisätty timer-tuki
}

export interface CalculatedStats {
  attackDamage: number;
  armor: number;
  attackSpeed: number;
  maxHp: number;
  critChance: number;
  critMultiplier: number;
}

// --- ITEM & RESOURCE TYPES ---

export interface Ingredient {
  id: string;
  count: number;
}

export interface Resource {
  id: string;
  name: string;
  actionImage?: string;
  icon: string;
  value: number;
  rarity: Rarity;
  color?: string;
  description?: string;
  category?: string;
  level?: number;
  xpReward?: number;
  interval?: number;
  area?: number;
  inputs?: Ingredient[];
  slot?: EquipmentSlot;
  stats?: {
    attack?: number;
    defense?: number;
    strength?: number;
  };
  combatStyle?: CombatStyle; 
  healing?: number;
}

// Lootit todennäköisyyden (0.0 - 1.0) mukaan
export interface Drop {
  itemId: string;
  chance: number;
  amount: [number, number]; 
}

// Lootit painoarvon mukaan (Weighted Pool)
export interface WeightedDrop {
  itemId: string;
  weight: number;
  amount?: [number, number];
  chance?: number; // Taaksepäin yhteensopivuus
}

export interface CombatMap {
  id: number;
  world: number; 
  name: string;
  enemyName: string;
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
  image?: string; 
  drops: WeightedDrop[]; // KORJAUS: Muutettu Drop[] -> WeightedDrop[] jotta WORLD_LOOT toimii
  isBoss?: boolean;
  keyRequired?: string;
}

// --- SHOP & ACHIEVEMENTS ---

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  requires?: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (state: GameState) => boolean;
}

// --- EXPEDITIONS (Scavenger) ---

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

// --- SETTINGS & CONFIG ---

export interface CombatSettings {
  autoEatThreshold: number; 
  autoProgress: boolean;    
}

export interface SkillData {
  xp: number;
  level: number;
}

// --- ROOT GAME STATE ---

export interface GameState {
  username: string; 
  settings: GameSettings;
  inventory: Record<string, number>;
  skills: Record<SkillType, SkillData>;
  equipment: Record<Exclude<EquipmentSlot, 'food'>, string | null>;
  equippedFood: { itemId: string, count: number } | null;
  combatSettings: CombatSettings;
  scavenger: ScavengerState;
  activeAction: ActiveAction | null;
  coins: number;
  upgrades: string[]; 
  unlockedAchievements: string[];
  combatStats: CombatState; 
  enemy: Enemy | null;      
  lastTimestamp: number;
  events: GameEvent[];
}

export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number; 
}