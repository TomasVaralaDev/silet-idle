import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameEventType, GameEvent, Enemy, RewardEntry } from '../types';
import { createInventorySlice, type InventorySlice } from './slices/inventorySlice';
import { createSkillSlice, type SkillSlice } from './slices/skillSlice';
import { createCombatSlice, type CombatSlice } from './slices/combatSlice';
import { createScavengerSlice, type ScavengerSlice } from './slices/scavengerSlice';
import { createWorldShopSlice, type WorldShopSlice } from './slices/worldShopSlice';
// LISÄÄ TÄMÄ IMPORT:
import { createEnchantingSlice, type EnchantingSlice } from './slices/enchantingSlice';
import type { OfflineSummary } from '../systems/offlineSystem';

// Määritellään RewardModal-tila
interface RewardModalState {
  isOpen: boolean;
  title: string;
  rewards: RewardEntry[];
}

/**
 * FullStoreState yhdistää datan, kaikki slicet ja globaalit funktiot.
 */
export type FullStoreState = GameState & 
  InventorySlice & 
  SkillSlice & 
  CombatSlice & 
  ScavengerSlice & 
  WorldShopSlice & 
  EnchantingSlice & { // LISÄTTY: EnchantingSlice
    enemy: Enemy | null;
    offlineSummary: OfflineSummary | null;
    rewardModal: RewardModalState;
    
    setState: (updater: Partial<FullStoreState> | ((state: FullStoreState) => Partial<FullStoreState>)) => void;
    emitEvent: (type: GameEventType, message: string, icon?: string) => void;
    clearEvent: (id: string) => void;
    setOfflineSummary: (summary: OfflineSummary | null) => void;
    
    openRewardModal: (title: string, rewards: RewardEntry[]) => void;
    closeRewardModal: () => void;
};

/**
 * DEFAULT_STATE sisältää GameState-rajapinnan mukaiset tiedot.
 */
export const DEFAULT_STATE: GameState = {
  username: "Player",
  avatar: "/assets/avatars/avatar_1.png",
  lastTimestamp: Date.now(),
  events: [],
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
  equipment: { 
    head: null, body: null, legs: null, weapon: null, shield: null, 
    necklace: null, ring: null, rune: null, skill: null 
  },
  equippedFood: null,
  combatSettings: { autoEatThreshold: 50, autoProgress: false },
  scavenger: { activeExpeditions: [], unlockedSlots: 1 },
  activeAction: null,
  coins: 0,
  upgrades: [],
  unlockedAchievements: [],
  combatStats: { 
    hp: 100, 
    currentMapId: null, 
    maxMapCompleted: 0, 
    enemyCurrentHp: 0, 
    respawnTimer: 0, 
    foodTimer: 0, 
    combatLog: [] 
  },
  enemy: null
};

export const useGameStore = create<FullStoreState>()(
  persist(
    (set, get, ...args) => ({
      // 1. Perustila
      ...DEFAULT_STATE,
      offlineSummary: null,
      rewardModal: { isOpen: false, title: '', rewards: [] },

      // 2. Slicet
      ...createInventorySlice(set, get, ...args),
      ...createSkillSlice(set, get, ...args),
      ...createCombatSlice(set, get, ...args), 
      ...createScavengerSlice(set, get, ...args),
      ...createWorldShopSlice(set, get, ...args),
      ...createEnchantingSlice(set, get, ...args), // LISÄTTY: EnchantingSlice

      // 3. Globaalit funktiot
      emitEvent: (type, message, icon) => set((state) => {
        const newEvent: GameEvent = {
          id: Math.random().toString(36).substring(2, 9),
          type,
          message,
          icon,
          timestamp: Date.now()
        };
        return { events: [newEvent, ...state.events].slice(0, 50) };
      }),

      clearEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),

      setOfflineSummary: (summary: OfflineSummary | null) => set({ 
        offlineSummary: summary 
      }),
      
      openRewardModal: (title, rewards) => set({ 
        rewardModal: { isOpen: true, title, rewards } 
      }),
      
      closeRewardModal: () => set({ 
        rewardModal: { isOpen: false, title: '', rewards: [] } 
      }),
      
      setState: (updater) => set((state: FullStoreState) => {
        const nextState = typeof updater === 'function' 
          ? updater(state) 
          : updater;
        return nextState as Partial<FullStoreState>;
      }),
    }),
    { 
      name: 'ggez-idle-storage',
      
      merge: (persistedState: unknown, currentState: FullStoreState) => {
        const typedPersisted = persistedState as Partial<FullStoreState> | undefined;

        if (!typedPersisted) return currentState;

        return {
          ...currentState,
          ...typedPersisted,
          combatStats: {
            ...DEFAULT_STATE.combatStats,
            ...(typedPersisted.combatStats || {}),
            combatLog: typedPersisted.combatStats?.combatLog || []
          },
          skills: {
            ...DEFAULT_STATE.skills,
            ...(typedPersisted.skills || {})
          },
          enemy: null,
          activeAction: typedPersisted.activeAction || null,
          rewardModal: { isOpen: false, title: '', rewards: [] }
        };
      },

      partialize: (state) => {
        const rest = { ...state };
        // Poistetaan UI-tilat tallennuksesta
        delete (rest as Partial<FullStoreState>).offlineSummary; 
        delete (rest as Partial<FullStoreState>).rewardModal; 
        return rest;
      }
    }
  )
);