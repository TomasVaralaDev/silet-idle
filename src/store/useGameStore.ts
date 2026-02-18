import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  GameEventType,
  GameEvent,
  Enemy,
  RewardEntry,
} from '../types';

// Slices
import {
  createInventorySlice,
  type InventorySlice,
} from './slices/inventorySlice';
import { createSkillSlice, type SkillSlice } from './slices/skillSlice';
import { createCombatSlice, type CombatSlice } from './slices/combatSlice';
import {
  createScavengerSlice,
  type ScavengerSlice,
} from './slices/scavengerSlice';
import {
  createWorldShopSlice,
  type WorldShopSlice,
} from './slices/worldShopSlice';
import {
  createEnchantingSlice,
  type EnchantingSlice,
} from './slices/enchantingSlice';
import { createSocialSlice, type SocialSlice } from './slices/socialSlice'; // <--- 1. IMPORT

import type { OfflineSummary } from '../systems/offlineSystem';

interface RewardModalState {
  isOpen: boolean;
  title: string;
  rewards: RewardEntry[];
}

// 2. LISÄÄ SOCIAL SLICE TYYPPIIN
export type FullStoreState = GameState &
  InventorySlice &
  SkillSlice &
  CombatSlice &
  ScavengerSlice &
  WorldShopSlice &
  EnchantingSlice &
  SocialSlice & {
    // <--- TÄMÄ KORJAA "Property does not exist" -VIRHEET
    enemy: Enemy | null;
    offlineSummary: OfflineSummary | null;
    rewardModal: RewardModalState;

    // Core actions
    setState: (
      updater:
        | Partial<FullStoreState>
        | ((state: FullStoreState) => Partial<FullStoreState>),
    ) => void;
    emitEvent: (type: GameEventType, message: string, icon?: string) => void;
    clearEvent: (id: string) => void;
    setOfflineSummary: (summary: OfflineSummary | null) => void;

    // UI actions
    openRewardModal: (title: string, rewards: RewardEntry[]) => void;
    closeRewardModal: () => void;
  };

// Initial state
export const DEFAULT_STATE: GameState = {
  username: 'Player',
  avatar: '/assets/avatars/avatar_1.png',
  lastTimestamp: Date.now(),
  events: [],
  settings: { notifications: true, sound: true, music: true, particles: true },

  // 3. ALUSTA SOCIAL STATE
  social: {
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    globalMessages: [],
    activeChatFriendId: null,
    unreadMessages: {},
  },

  inventory: {},
  skills: {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 },
    fishing: { xp: 0, level: 1 },
    foraging: { xp: 0, level: 1 },
    crafting: { xp: 0, level: 1 },
    smithing: { xp: 0, level: 1 },
    alchemy: { xp: 0, level: 1 },
    hitpoints: { xp: 0, level: 10 },
    attack: { xp: 0, level: 1 },
    defense: { xp: 0, level: 1 },
    melee: { xp: 0, level: 1 },
    ranged: { xp: 0, level: 1 },
    magic: { xp: 0, level: 1 },
    combat: { xp: 0, level: 1 },
    scavenging: { xp: 0, level: 1 },
  },
  equipment: {
    head: null,
    body: null,
    legs: null,
    weapon: null,
    shield: null,
    necklace: null,
    ring: null,
    rune: null,
    skill: null,
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
    combatLog: [],
  },
  enemy: null,
};

export const useGameStore = create<FullStoreState>()(
  persist(
    (set, get, ...args) => ({
      ...DEFAULT_STATE,
      offlineSummary: null,
      rewardModal: { isOpen: false, title: '', rewards: [] },

      // Combine slices
      ...createInventorySlice(set, get, ...args),
      ...createSkillSlice(set, get, ...args),
      ...createCombatSlice(set, get, ...args),
      ...createScavengerSlice(set, get, ...args),
      ...createWorldShopSlice(set, get, ...args),
      ...createEnchantingSlice(set, get, ...args),
      ...createSocialSlice(set, get, ...args), // <--- 4. YHDISTÄ SOCIAL SLICE STOREEN

      // Global actions
      emitEvent: (type, message, icon) =>
        set((state) => {
          const newEvent: GameEvent = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            message,
            icon,
            timestamp: Date.now(),
          };
          return { events: [newEvent, ...state.events].slice(0, 50) };
        }),

      clearEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      setOfflineSummary: (summary: OfflineSummary | null) =>
        set({
          offlineSummary: summary,
        }),

      openRewardModal: (title, rewards) =>
        set({
          rewardModal: { isOpen: true, title, rewards },
        }),

      closeRewardModal: () =>
        set({
          rewardModal: { isOpen: false, title: '', rewards: [] },
        }),

      setState: (updater) =>
        set((state: FullStoreState) => {
          const nextState =
            typeof updater === 'function' ? updater(state) : updater;
          return nextState as Partial<FullStoreState>;
        }),
    }),
    {
      name: 'ggez-idle-storage',

      // Custom merge to handle migrations or deep merges
      merge: (persistedState: unknown, currentState: FullStoreState) => {
        const typedPersisted = persistedState as
          | Partial<FullStoreState>
          | undefined;
        if (!typedPersisted) return currentState;

        return {
          ...currentState,
          ...typedPersisted,

          // Deep merge critical nested objects
          combatStats: {
            ...DEFAULT_STATE.combatStats,
            ...(typedPersisted.combatStats || {}),
            combatLog: typedPersisted.combatStats?.combatLog || [],
          },
          skills: {
            ...DEFAULT_STATE.skills,
            ...(typedPersisted.skills || {}),
          },
          // 5. SOCIAL STATE MERGE (Turvallisuus)
          social: {
            ...DEFAULT_STATE.social,
            ...(typedPersisted.social || {}),
            // Varmistetaan että activeChat nollataan latauksessa
            activeChatFriendId: null,
            // Varmistetaan että arrayt löytyy, vaikka vanhassa tallennuksessa ei olisi
            incomingRequests: typedPersisted.social?.incomingRequests || [],
            outgoingRequests: typedPersisted.social?.outgoingRequests || [],
          },

          // Reset transient state
          enemy: null,
          activeAction: typedPersisted.activeAction || null,
          rewardModal: { isOpen: false, title: '', rewards: [] },
        };
      },

      // Only persist necessary parts
      partialize: (state) => {
        const rest = { ...state };
        delete (rest as Partial<FullStoreState>).offlineSummary;
        delete (rest as Partial<FullStoreState>).rewardModal;
        return rest;
      },
    },
  ),
);
