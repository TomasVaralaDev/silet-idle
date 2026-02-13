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

// --- NEW: EVENT TYPES ---
export type GameEventType = 'info' | 'success' | 'warning' | 'error' | 'loot' | 'level_up';

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

// Tämä hallitsee taistelun UI-tilaa ja logiikkaa
export interface CombatState {
  hp: number;
  currentMapId: number | null;
  maxMapCompleted: number;
  enemyCurrentHp: number;
  respawnTimer: number;
  foodTimer: number;
  combatLog: string[]; // Pidetään loki täällä kuten aiemmin
}

// Tämä on tallennettava data hahmon statseista (EI taistelun hetkellinen tila)
export interface PlayerCombatStats {
  hp: number; // Nykyinen HP (tallennetaan)
  maxMapCompleted: number; // Progression
}

// Laskennalliset statsit (Equipment + Levelit), ei tallenneta kantaan
export interface CalculatedStats {
  attackDamage: number;
  armor: number;
  attackSpeed: number;
  maxHp: number;
  critChance: number;
  critMultiplier: number;
}

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

export interface Drop {
  itemId: string;
  chance: number;
  amount: [number, number]; 
}

export interface WeightedDrop {
  itemId: string;
  weight: number; 
  amount?: [number, number];
}

export interface CombatMap {
  id: number; // MUUTOS: String -> Number
  world: number; // MUUTOS: Nimi 'world' eikä 'worldId' (kuten datassasi)
  name: string;
  enemyName: string; // UUSI KENTTÄ
  enemyHp: number;   // UUSI KENTTÄ
  enemyAttack: number; // UUSI KENTTÄ
  xpReward: number; // UUSI KENTTÄ
  image?: string; 
  drops: Drop[]; // UUSI KENTTÄ
  isBoss?: boolean;
  keyRequired?: string;
  // levelRequirement poistettu, koska datassa sitä ei ollut (tai voit päätellä sen ID:stä)
}

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

export interface SkillData {
  xp: number;
  level: number;
}

// --- STATE INTERFACES ---

// Tämä on se, mikä tallennetaan localStorageen (Persistence)
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
  combatStats: CombatState; // Alkuperäinen polku palautettu
  enemy: Enemy | null;      // Vihollinen on combatStatsin sisar-objekti
  lastTimestamp: number;
  events: GameEvent[];
}

export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number; 
}