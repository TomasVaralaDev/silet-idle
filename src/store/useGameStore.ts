import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameEventType, GameEvent, Enemy } from '../types';
import { createInventorySlice, type InventorySlice } from './slices/inventorySlice';
import { createSkillSlice, type SkillSlice } from './slices/skillSlice';
import { createCombatSlice, type CombatSlice } from './slices/combatSlice';
import { createScavengerSlice, type ScavengerSlice } from './slices/scavengerSlice';
import type { OfflineSummary } from '../systems/offlineSystem';

/**
 * FullStoreState yhdistää datan, kaikki slicet ja globaalit funktiot.
 */
export type FullStoreState = GameState & 
  InventorySlice & 
  SkillSlice & 
  CombatSlice & 
  ScavengerSlice & {
    enemy: Enemy | null;
    offlineSummary: OfflineSummary | null;
    setState: (updater: Partial<FullStoreState> | ((state: FullStoreState) => Partial<FullStoreState>)) => void;
    emitEvent: (type: GameEventType, message: string, icon?: string) => void;
    clearEvent: (id: string) => void;
    setOfflineSummary: (summary: OfflineSummary | null) => void;
};

/**
 * DEFAULT_STATE sisältää GameState-rajapinnan mukaiset tiedot.
 */
export const DEFAULT_STATE: GameState = {
  username: "Player",
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

      // 2. Slicet
      ...createInventorySlice(set, get, ...args),
      ...createSkillSlice(set, get, ...args),
      ...createCombatSlice(set, get, ...args), 
      ...createScavengerSlice(set, get, ...args),

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
      
      setState: (updater) => set((state: FullStoreState) => {
        const nextState = typeof updater === 'function' 
          ? updater(state) 
          : updater;
        return nextState as Partial<FullStoreState>;
      }),
    }),
    { 
      name: 'ggez-idle-storage',
      
      // KORJAUS 1: merge käyttää nyt 'unknown' tyyppiä 'any':n sijasta
      merge: (persistedState: unknown, currentState: FullStoreState) => {
        // Tyyppimuunnos turvallisesti
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
        };
      },

      // KORJAUS 2: Käytetään delete-operaattoria välttääksemme unused variable -virheen
      partialize: (state) => {
        const rest = { ...state };
        delete (rest as Partial<FullStoreState>).offlineSummary; 
        return rest;
      }
    }
  )
);