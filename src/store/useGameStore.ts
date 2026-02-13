import { create } from 'zustand';
import type { GameState } from '../types';
import { createInventorySlice, type InventorySlice } from './slices/inventorySlice';
import { createSkillSlice, type SkillSlice } from './slices/skillSlice';
import { createCombatSlice, type CombatSlice } from './slices/combatSlice';
import { createScavengerSlice, type ScavengerSlice } from './slices/scavengerSlice';

export type FullStoreState = GameState & 
  InventorySlice & 
  SkillSlice & 
  CombatSlice & 
  ScavengerSlice & {
    setState: (updater: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
    setNotification: (payload: { message: string, icon: string } | null) => void;
    notification: { message: string, icon: string } | null;
};

export const DEFAULT_STATE: GameState = {
  username: "Player",
  lastTimestamp: Date.now(),
  settings: { notifications: true, sound: true, music: true, particles: true },
  inventory: {},
  skills: {
    woodcutting: { xp: 0, level: 1 }, mining: { xp: 0, level: 1 },
    fishing: { xp: 0, level: 1 }, farming: { xp: 0, level: 1 },
    crafting: { xp: 0, level: 1 }, smithing: { xp: 0, level: 1 },
    cooking: { xp: 0, level: 1 }, hitpoints: { xp: 0, level: 10 },
    attack: { xp: 0, level: 1 }, defense: { xp: 0, level: 1 },
    melee: { xp: 0, level: 1 }, ranged: { xp: 0, level: 1 },
    magic: { xp: 0, level: 1 }, combat: { xp: 0, level: 1 },
    scavenging: { xp: 0, level: 1 },
  },
  equipment: { head: null, body: null, legs: null, weapon: null, shield: null, necklace: null, ring: null, rune: null, skill: null },
  equippedFood: null,
  combatSettings: { autoEatThreshold: 50, autoProgress: false },
  scavenger: { activeExpeditions: [], unlockedSlots: 1 },
  activeAction: null,
  coins: 0,
  upgrades: [],
  unlockedAchievements: [],
  combatStats: { hp: 100, currentMapId: null, maxMapCompleted: 0, enemyCurrentHp: 0, respawnTimer: 0, foodTimer: 0, combatLog: [] }
};

export const useGameStore = create<FullStoreState>()((set, get, ...args) => ({
  // 1. Slices
  ...createInventorySlice(set, get, ...args),
  ...createSkillSlice(set, get, ...args),
  ...createCombatSlice(set, get, ...args),
  ...createScavengerSlice(set, get, ...args),

  // 2. GameState Fields (Varmistetaan että kaikki löytyvät)
  username: DEFAULT_STATE.username,
  lastTimestamp: DEFAULT_STATE.lastTimestamp, // KORJAUS: Lisätty puuttuva kenttä
  settings: DEFAULT_STATE.settings,
  unlockedAchievements: DEFAULT_STATE.unlockedAchievements,
  activeAction: DEFAULT_STATE.activeAction,
  coins: DEFAULT_STATE.coins,
  upgrades: DEFAULT_STATE.upgrades,
  inventory: DEFAULT_STATE.inventory,
  skills: DEFAULT_STATE.skills,
  equipment: DEFAULT_STATE.equipment,
  equippedFood: DEFAULT_STATE.equippedFood,
  combatSettings: DEFAULT_STATE.combatSettings,
  scavenger: DEFAULT_STATE.scavenger,
  combatStats: DEFAULT_STATE.combatStats,

  // 3. UI State
  notification: null,
  setNotification: (payload) => set({ notification: payload }),
  
  // 4. Global Updater
  setState: (updater) => set((state: FullStoreState) => {
    const nextState = typeof updater === 'function' 
      ? updater(state as unknown as GameState) 
      : updater;
    return nextState as Partial<FullStoreState>;
  }),
}));