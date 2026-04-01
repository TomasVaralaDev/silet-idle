import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GameState,
  GameEventType,
  GameEvent,
  Enemy,
  RewardEntry,
  SkillType,
} from "../types";

import {
  createInventorySlice,
  type InventorySlice,
} from "./slices/inventorySlice";
import { createSkillSlice, type SkillSlice } from "./slices/skillSlice";
import { createCombatSlice, type CombatSlice } from "./slices/combatSlice";
import {
  createScavengerSlice,
  type ScavengerSlice,
} from "./slices/scavengerSlice";
import {
  createWorldShopSlice,
  type WorldShopSlice,
} from "./slices/worldShopSlice";
import {
  createEnchantingSlice,
  type EnchantingSlice,
} from "./slices/enchantingSlice";
import { createSocialSlice, type SocialSlice } from "./slices/socialSlice";
import { createQuestSlice, type QuestSlice } from "./slices/questSlice";
import {
  createPremiumShopSlice,
  type PremiumShopSlice,
} from "./slices/premiumShopSlice";
import {
  createAchievementSlice,
  type AchievementSlice,
} from "./slices/achievementSlice";
import { getFunctions, httpsCallable } from "firebase/functions";
import type { OfflineSummary } from "../systems/offlineSystem";

interface RewardModalState {
  isOpen: boolean;
  title: string;
  rewards: RewardEntry[];
}

/**
 * FullStoreState
 * Defines the complete boundary of the Zustand global state,
 * uniting every localized slice interface into a single typed tree.
 */
export type FullStoreState = GameState &
  InventorySlice &
  SkillSlice &
  CombatSlice &
  ScavengerSlice &
  WorldShopSlice &
  EnchantingSlice &
  SocialSlice &
  PremiumShopSlice &
  QuestSlice &
  AchievementSlice & {
    enemy: Enemy | null;
    offlineSummary: OfflineSummary | null;
    rewardModal: RewardModalState;

    setState: (
      updater:
        | Partial<FullStoreState>
        | ((state: FullStoreState) => Partial<FullStoreState>),
    ) => void;
    emitEvent: (type: GameEventType, message: string, icon?: string) => void;
    clearEvent: (id: string) => void;
    setOfflineSummary: (summary: OfflineSummary | null) => void;
    openRewardModal: (title: string, rewards: RewardEntry[]) => void;
    closeRewardModal: () => void;
    updateUserProfile: (
      name: string,
      avatar: string,
      theme: string,
      chatColor: string,
    ) => Promise<boolean>;

    // Tutorial hooks
    nextTutorialStep: () => void;
    completeTutorial: () => void;
  };

/**
 * DEFAULT_STATE
 * Blueprint for creating fresh accounts. Defines every expected key
 * to ensure undefined variables do not crash the engine during runtime.
 */
export const DEFAULT_STATE: GameState = {
  username: "Player",
  avatar: "./assets/avatars/avatar_1.png",
  unlockedQueueSlots: 2,
  marketListingLimit: 15,
  lastTimestamp: Date.now(),
  events: [],
  settings: {
    notifications: true,
    sound: true,
    music: true,
    particles: true,
    theme: "theme-neon",
    chatColor: "default",
    lastNameChange: 0,
  },
  social: {
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    globalMessages: [],
    activeChatFriendId: null,
    unreadMessages: {},
    unlockedChatColors: ["default"],
  },
  quests: { dailyQuests: [], lastResetTime: 0 },
  worldShop: { purchases: {}, lastResetTime: 0 },
  inventory: {},
  skills: {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 },
    fishing: { xp: 0, level: 1 },
    foraging: { xp: 0, level: 1 },
    crafting: { xp: 0, level: 1 },
    smithing: { xp: 0, level: 1 },
    alchemy: { xp: 0, level: 1 },
    hitpoints: { xp: 0, level: 1 },
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
  combatSettings: {
    autoEatThreshold: 50,
    autoProgress: false,
    autoRetreat: false,
  },
  scavenger: { activeExpeditions: [], unlockedSlots: 1 },
  activeAction: null,
  queue: [],
  coins: 0,
  gems: 0,
  upgrades: [],
  premiumPurchases: {},
  maxOfflineHoursIncrement: 0,
  unlockedAchievements: [],
  claimedAchievements: [],
  combatStats: {
    hp: 110,
    currentMapId: null,
    maxMapCompleted: 0,
    enemyCurrentHp: 0,
    respawnTimer: 0,
    foodTimer: 0,
    combatLog: [],
    cooldownUntil: 0,
    damagePopUps: [],
    playerAttackTimer: 0,
    enemyAttackTimer: 0,
  },
  enemy: null,
  tutorial: { step: 0, isActive: true, isComplete: false },
};

/**
 * customMerge
 * Deep-merging reconciliation function for handling loaded persistent state.
 * Bridges the gap between old save versions and new patches, ensuring new keys
 * are successfully injected into outdated saves without overwriting valid data.
 */
export const customMerge = (
  persistedState: unknown,
  currentState: FullStoreState,
): FullStoreState => {
  const typedPersisted = persistedState as Partial<FullStoreState> | undefined;
  if (!typedPersisted) return currentState;

  // Deep merge skills array to prevent null-reference crashes when new skills are added to patches
  const mergedSkills = { ...DEFAULT_STATE.skills };
  if (typedPersisted.skills) {
    (Object.keys(DEFAULT_STATE.skills) as SkillType[]).forEach((skillKey) => {
      mergedSkills[skillKey] = {
        ...DEFAULT_STATE.skills[skillKey],
        ...(typedPersisted.skills![skillKey] || {}),
      };
    });
  }

  // Gracefully handle older saves that never experienced the tutorial update
  const isOldPlayer =
    typedPersisted.username && typedPersisted.username !== "Player";

  return {
    ...currentState,
    ...typedPersisted,
    unlockedQueueSlots: typedPersisted.unlockedQueueSlots ?? 2,
    premiumPurchases: typedPersisted.premiumPurchases || {},
    maxOfflineHoursIncrement: typedPersisted.maxOfflineHoursIncrement || 0,
    marketListingLimit: typedPersisted.marketListingLimit ?? 15,
    unlockedAchievements: typedPersisted.unlockedAchievements || [],
    claimedAchievements: typedPersisted.claimedAchievements || [],
    settings: {
      ...DEFAULT_STATE.settings,
      ...(typedPersisted.settings || {}),
      chatColor: typedPersisted.settings?.chatColor || "default",
    },
    worldShop: {
      ...DEFAULT_STATE.worldShop,
      ...(typedPersisted.worldShop || {}),
    },
    combatStats: {
      ...DEFAULT_STATE.combatStats,
      ...(typedPersisted.combatStats || {}),
      combatLog: typedPersisted.combatStats?.combatLog || [],
    },
    skills: mergedSkills,
    social: {
      ...DEFAULT_STATE.social,
      ...(typedPersisted.social || {}),
      activeChatFriendId: null,
      incomingRequests: typedPersisted.social?.incomingRequests || [],
      outgoingRequests: typedPersisted.social?.outgoingRequests || [],
      globalMessages: [], // CRITICAL: Prevent syncing large global chat array into permanent localstorage
      unlockedChatColors: typedPersisted.social?.unlockedChatColors || [
        "default",
      ],
    },
    quests: {
      ...DEFAULT_STATE.quests,
      ...(typedPersisted.quests || {}),
      dailyQuests: typedPersisted.quests?.dailyQuests || [],
    },
    // Assign completed tutorial flag to older legacy players dynamically
    tutorial:
      typedPersisted.tutorial ||
      (isOldPlayer
        ? { step: 99, isActive: false, isComplete: true }
        : DEFAULT_STATE.tutorial),

    enemy: null,
    queue: typedPersisted.queue || [],
    activeAction: typedPersisted.activeAction || null,
    rewardModal: { isOpen: false, title: "", rewards: [] },
    offlineSummary: null,
  } as FullStoreState;
};

// Global Initialization
export const useGameStore = create<FullStoreState>()(
  persist(
    (set, get, ...args) => ({
      ...DEFAULT_STATE,
      offlineSummary: null,
      rewardModal: { isOpen: false, title: "", rewards: [] },

      // Inject logical subsystems
      ...createInventorySlice(set, get, ...args),
      ...createSkillSlice(set, get, ...args),
      ...createCombatSlice(set, get, ...args),
      ...createScavengerSlice(set, get, ...args),
      ...createWorldShopSlice(set, get, ...args),
      ...createEnchantingSlice(set, get, ...args),
      ...createSocialSlice(set, get, ...args),
      ...createQuestSlice(set, get, ...args),
      ...createPremiumShopSlice(set, get, ...args),
      ...createAchievementSlice(set, get, ...args),

      // --- TUTORIAL LOGIC ---
      nextTutorialStep: () =>
        set((state) => ({
          tutorial: { ...state.tutorial, step: state.tutorial.step + 1 },
        })),
      completeTutorial: () =>
        set((state) => ({
          tutorial: { ...state.tutorial, isActive: false, isComplete: true },
          coins: state.coins + 5000, // Finishing tutorial reward
        })),

      /**
       * updateUserProfile
       * Pushes profile setting modifications to Firebase, enforcing cooldowns and name validation
       */
      updateUserProfile: async (newName, newAvatar, newTheme, newChatColor) => {
        const state = get();
        const currentName = state.username;

        // Visual and local data changes apply instantly
        set({
          avatar: newAvatar,
          settings: {
            ...state.settings,
            theme: newTheme,
            chatColor: newChatColor,
          },
        });

        // Abort early if the display name was not actually altered
        if (newName === currentName) {
          get().emitEvent("success", "Profile updated!");
          return true;
        }

        try {
          get().emitEvent("info", "Updating identity...");
          const functions = getFunctions();

          // Server-side validation handles profanity checks and cooldown timers
          const changeNameFn = httpsCallable<
            { newName: string },
            { success: boolean; lastNameChange: number }
          >(functions, "changeUsername");

          const result = await changeNameFn({ newName });

          if (result.data.success) {
            set((prevState) => ({
              username: newName,
              settings: {
                ...prevState.settings,
                lastNameChange: result.data.lastNameChange,
              },
            }));
            get().emitEvent("success", "Identity updated successfully!");
            return true;
          } else {
            get().emitEvent("error", "Could not update identity.");
            return false;
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Failed to change name.";
          get().emitEvent("error", message);
          return false;
        }
      },

      /**
       * emitEvent
       * Generates a unique UI notification payload that disappears automatically.
       */
      emitEvent: (type, message, icon) =>
        set((state) => {
          const newEvent: GameEvent = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            message,
            icon,
            timestamp: Date.now(),
          };
          // Truncate the queue to 50 to prevent memory bloating
          return { events: [newEvent, ...state.events].slice(0, 50) };
        }),

      clearEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      setOfflineSummary: (summary: OfflineSummary | null) =>
        set({ offlineSummary: summary }),

      openRewardModal: (title, rewards) =>
        set({ rewardModal: { isOpen: true, title, rewards } }),

      closeRewardModal: () =>
        set({ rewardModal: { isOpen: false, title: "", rewards: [] } }),

      setState: (updater) =>
        set((state: FullStoreState) => {
          const nextState =
            typeof updater === "function" ? updater(state) : updater;
          return nextState as Partial<FullStoreState>;
        }),
    }),
    {
      name: "ggez-idle-storage",
      version: 1,
      // Pass retrieved local storage payload through the deep-merge reconciler
      merge: (persisted, current) =>
        customMerge(persisted, current as FullStoreState),
      onRehydrateStorage: () => (state) => {
        // Enforce active visual theme immediately upon initialization
        if (state && state.settings?.theme) {
          const theme = state.settings.theme;
          const themes = [
            "theme-neon",
            "theme-tavern",
            "theme-abyss",
            "theme-frost",
            "theme-arcane",
            "theme-sakura",
            "theme-matte",
            "theme-hc",
          ];
          document.body.classList.remove(...themes);
          document.body.classList.add(theme);
        }
      },
      partialize: (state) => {
        // Omit transient or volatile variables from being cached in LocalStorage
        const rest = { ...state };
        delete (rest as Partial<FullStoreState>).offlineSummary;
        delete (rest as Partial<FullStoreState>).rewardModal;
        delete (rest as Partial<FullStoreState>).gems;
        delete (rest as Partial<FullStoreState>).upgrades;
        if (rest.social) {
          const socialCopy = { ...rest.social };
          socialCopy.globalMessages = [];
          rest.social = socialCopy;
        }
        return rest;
      },
    },
  ),
);
