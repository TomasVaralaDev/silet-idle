// Määritellään Rarity tässä, jotta ei tule riippuvuusongelmia
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

// Tämä on Storen tila (State)
export interface CombatState {
  hp: number;
  currentMapId: number | null;
  maxMapCompleted: number;
  enemyCurrentHp: number;
  respawnTimer: number;
  foodTimer: number;
  combatLog: string[]; // Logi on string-taulukko
}

// Tämä on laskennallinen data (Stats)
export interface CombatStats {
  attackDamage: number;
  armor: number;
  attackSpeed: number;
  hp: number;             // Tämä on usein "nykyinen HP" laskennoissa
  maxHp: number;          // Lisätty Vercel-virheen takia
  attackLevel: number;    // Lisätty Vercel-virheen takia
  strengthLevel: number;  // Lisätty Vercel-virheen takia
  defenseLevel: number;   // Lisätty Vercel-virheen takia
  critChance: number;     // Lisätty Vercel-virheen takia
  critMultiplier: number; // Lisätty Vercel-virheen takia
}

export interface Ingredient {
  id: string;
  count: number;
}

// Yhdistetty ja laajennettu Resource-tyyppi kattamaan kaikki tarpeet
export interface Resource {
  id: string;
  name: string;
  actionImage?: string;
  icon: string;
  value: number;
  rarity: Rarity;
  
  // Optional / Context specific
  color?: string;
  description?: string;
  category?: string;       // Esim. "Food", "Weapon"
  level?: number;          // Level required (SkillView)
  xpReward?: number;       // XP gain (SkillView)
  interval?: number;       // Time in ms (SkillView)
  area?: number;           // Area requirement (SkillView: "requiresMapCompletion")
  inputs?: Ingredient[];   // Crafting inputs
  
  // Equipment / Combat props
  slot?: EquipmentSlot;    
  stats?: {
    attack?: number;
    defense?: number;
    strength?: number;
  };
  combatStyle?: CombatStyle; 
  healing?: number;        // Food healing amount
}

export interface Drop {
  itemId: string;
  chance: number; // 0.0 - 1.0
  amount: [number, number]; 
}

export interface WeightedDrop {
  itemId: string;
  weight: number; 
  amount?: [number, number]; // Tehty valinnaiseksi, oletus 1
}

export interface CombatMap {
  id: number;
  world: number;
  name: string;
  enemyName: string;
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
  drops: Drop[]; 
  isBoss?: boolean;
  keyRequired?: string; 
  image?: string; 
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;     // Varmista että tämä on price, ei cost
  category: string;
  icon: string;
  requires?: string; // Lisää tämä valinnaisena
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

// PÄÄTILA (STORE)
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
  combatStats: CombatState; // Viittaa Storen tilaan
  lastTimestamp: number;
}

// Combat Mechanics apu-interface
export interface CombatResult {
  finalDamage: number;
  isCrit: boolean;
  mitigationPercent: number; 
}