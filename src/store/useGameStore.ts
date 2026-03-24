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

import { ACHIEVEMENTS } from "../data/achievements";
import { calculateXpGain } from "../utils/gameUtils";

// Slices
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
import type { OfflineSummary } from "../systems/offlineSystem";

interface RewardModalState {
  isOpen: boolean;
  title: string;
  rewards: RewardEntry[];
}

export type FullStoreState = GameState &
  InventorySlice &
  SkillSlice &
  CombatSlice &
  ScavengerSlice &
  WorldShopSlice &
  EnchantingSlice &
  SocialSlice &
  PremiumShopSlice &
  QuestSlice & {
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
    claimAchievement: (id: string) => void;
  };

export const DEFAULT_STATE: GameState = {
  username: "Player",
  avatar: "/assets/avatars/avatar_1.png",
  unlockedQueueSlots: 2,
  lastTimestamp: Date.now(),
  events: [],
  settings: {
    notifications: true,
    sound: true,
    music: true,
    particles: true,
    theme: "theme-neon",
    chatColor: "default",
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

  quests: {
    dailyQuests: [],
    lastResetTime: 0,
  },
  worldShop: {
    purchases: {},
    lastResetTime: 0,
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
  combatSettings: { autoEatThreshold: 50, autoProgress: false },
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
};

export const customMerge = (
  persistedState: unknown,
  currentState: FullStoreState,
): FullStoreState => {
  const typedPersisted = persistedState as Partial<FullStoreState> | undefined;
  if (!typedPersisted) return currentState;

  const mergedSkills = { ...DEFAULT_STATE.skills };
  if (typedPersisted.skills) {
    (Object.keys(DEFAULT_STATE.skills) as SkillType[]).forEach((skillKey) => {
      mergedSkills[skillKey] = {
        ...DEFAULT_STATE.skills[skillKey],
        ...(typedPersisted.skills![skillKey] || {}),
      };
    });
  }

  return {
    ...currentState,
    ...typedPersisted,
    unlockedQueueSlots: typedPersisted.unlockedQueueSlots ?? 2,
    premiumPurchases: typedPersisted.premiumPurchases || {},
    maxOfflineHoursIncrement: typedPersisted.maxOfflineHoursIncrement || 0,
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
      unlockedChatColors: typedPersisted.social?.unlockedChatColors || [
        "default",
      ],
    },
    quests: {
      ...DEFAULT_STATE.quests,
      ...(typedPersisted.quests || {}),
      dailyQuests: typedPersisted.quests?.dailyQuests || [],
    },

    enemy: null,
    queue: typedPersisted.queue || [],
    activeAction: typedPersisted.activeAction || null,
    rewardModal: { isOpen: false, title: "", rewards: [] },
    offlineSummary: null,
  } as FullStoreState;
};

export const useGameStore = create<FullStoreState>()(
  persist(
    (set, get, ...args) => ({
      ...DEFAULT_STATE,
      offlineSummary: null,
      rewardModal: { isOpen: false, title: "", rewards: [] },

      ...createInventorySlice(set, get, ...args),
      ...createSkillSlice(set, get, ...args),
      ...createCombatSlice(set, get, ...args),
      ...createScavengerSlice(set, get, ...args),
      ...createWorldShopSlice(set, get, ...args),
      ...createEnchantingSlice(set, get, ...args),
      ...createSocialSlice(set, get, ...args),
      ...createQuestSlice(set, get, ...args),
      ...createPremiumShopSlice(set, get, ...args),

      claimAchievement: (id: string) => {
        const state = get();

        if (state.claimedAchievements.includes(id)) return;
        if (!state.unlockedAchievements.includes(id)) return;

        const achievement = ACHIEVEMENTS.find((a) => a.id === id);
        if (!achievement) return;

        const rewards = achievement.rewards;
        const updates: Partial<FullStoreState> = {
          claimedAchievements: [...state.claimedAchievements, id],
        };

        if (rewards?.coins) {
          updates.coins = state.coins + rewards.coins;
        }

        if (rewards?.items && rewards.items.length > 0) {
          updates.inventory = { ...state.inventory };
          rewards.items.forEach((item: { itemId: string; amount: number }) => {
            updates.inventory![item.itemId] =
              (updates.inventory![item.itemId] || 0) + item.amount;
          });
        }

        // --- KORJATTU XP LOGIIKKA (Ei enää overflow-bugia) ---
        if (rewards?.xpMap) {
          updates.skills = { ...state.skills };
          Object.entries(rewards.xpMap).forEach(([skillStr, xpAmount]) => {
            const skill = skillStr as SkillType;
            const amount = xpAmount as number;

            if (updates.skills![skill]) {
              const currentLevel = updates.skills![skill].level;
              const currentXp = updates.skills![skill].xp;

              // Lasketaan uusi level ja yli jäävä xp oikein gameUtilsin avulla
              const { level: newLevel, xp: newXp } = calculateXpGain(
                currentLevel,
                currentXp,
                amount,
              );

              updates.skills![skill] = {
                ...updates.skills![skill],
                level: newLevel,
                xp: newXp,
              };

              // Valinnainen: Heitetään "Level Up" pop-up, jos taso nousi saavutuksen takia!
              if (newLevel > currentLevel) {
                get().emitEvent(
                  "levelUp",
                  `${skill.toUpperCase()} reached level ${newLevel}!`,
                  "/assets/ui/icon_star.png",
                );
              }
            }
          });
        }
        // ---------------------------------------------------

        set(updates);

        get().emitEvent(
          "success",
          `Claimed reward for: ${achievement.name}`,
          "/assets/ui/icon_achievements.png",
        );

        if (rewards && (rewards.coins || rewards.items || rewards.xpMap)) {
          const displayRewards: RewardEntry[] = [];
          if (rewards.coins)
            displayRewards.push({ itemId: "coins", amount: rewards.coins });
          if (rewards.items) displayRewards.push(...rewards.items);
          if (rewards.xpMap) {
            Object.entries(rewards.xpMap).forEach(([skill, xp]) => {
              displayRewards.push({
                itemId: `${skill}_xp`,
                amount: xp as number,
              });
            });
          }
          get().openRewardModal(
            `Achievement: ${achievement.name}`,
            displayRewards,
          );
        }
      },

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
          rewardModal: { isOpen: false, title: "", rewards: [] },
        }),

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
      merge: (persisted, current) =>
        customMerge(persisted, current as FullStoreState),
      onRehydrateStorage: () => (state) => {
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
        const rest = { ...state };
        delete (rest as Partial<FullStoreState>).offlineSummary;
        delete (rest as Partial<FullStoreState>).rewardModal;
        delete (rest as Partial<FullStoreState>).gems;
        delete (rest as Partial<FullStoreState>).upgrades;
        return rest;
      },
    },
  ),
);
