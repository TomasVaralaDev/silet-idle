export type SkillType = 'woodcutting' | 'mining' | 'fishing' | 'farming' | 'crafting';
// Lisätään 'achievements' näkymä
export type ViewType = SkillType | 'inventory' | 'shop' | 'gamble' | 'achievements'; 
export type EquipmentSlot = 'head' | 'body' | 'legs' | 'weapon' | 'ammo' | 'shield';

// ... (Ingredient, Resource, ShopItem säilyvät ennallaan) ...
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
  icon: string;
  color: string;
  description: string;
  inputs?: Ingredient[];
  slot?: EquipmentSlot;
  stats?: { attack?: number; defense?: number; strength?: number };
  category?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  skill: SkillType;
  cost: number;
  multiplier: number;
  description: string;
  icon: string;
}

export interface ActiveAction {
  skill: SkillType;
  resourceId: string;
}

// UUSI: Saavutuksen tyyppi
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  // condition-funktio tarkistaa pelitilasta, onko saavutus tehty
  condition: (state: GameState) => boolean; 
}

export interface GameState {
  inventory: Record<string, number>;
  skills: Record<SkillType, { xp: number; level: number }>;
  equipment: Record<string, string | null>;
  activeAction: ActiveAction | null;
  coins: number;
  upgrades: string[];
  // UUSI: Lista saavutettujen saavutusten ID:istä
  unlockedAchievements: string[]; 
}