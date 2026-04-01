import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { COMBAT_DATA } from "../../data/combat";
import { processCombatTick as calculateCombatSystem } from "../../systems/combatSystem";
import type {
  GameState,
  Enemy,
  CombatSettings,
  CombatState,
} from "../../types";

export interface CombatSlice {
  startCombat: (mapId: number) => void;
  stopCombat: () => void;
  processCombatTick: () => void;
  addCombatLog: (message: string) => void;
  toggleAutoProgress: () => void;
  toggleAutoRetreat: () => void;
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;
}

/**
 * createCombatSlice
 * Provides action dispatches specific to the combat subsystem.
 * Handles the initiation, termination, and state updates of combat encounters.
 */
export const createCombatSlice: StateCreator<
  FullStoreState,
  [],
  [],
  CombatSlice
> = (set, get) => ({
  startCombat: (mapId: number) => {
    const state = get();

    // Prevent engaging in combat if the player recently died (Death Penalty)
    const cooldownLeft = (state.combatStats.cooldownUntil || 0) - Date.now();
    if (cooldownLeft > 0) {
      const seconds = Math.ceil(cooldownLeft / 1000);
      state.emitEvent(
        "warning",
        `You were defeated... Wait ${seconds}s`,
        "./assets/ui/icon_death.png",
      );
      return;
    }

    const map = COMBAT_DATA.find((m) => m.id === mapId);
    if (!map) return;

    // Validate and consume World Boss keys
    if (map.isBoss && map.keyRequired) {
      const currentInventory = state.inventory;
      const keyCount = currentInventory[map.keyRequired] || 0;

      if (keyCount < 1) return; // Silent abort if no key

      // Immediately deduct the key
      set((state) => ({
        inventory: {
          ...state.inventory,
          [map.keyRequired!]: keyCount - 1,
        },
      }));
    }

    // Initialize enemy object instance
    const newEnemy: Enemy = {
      id: `enemy_${map.id}_${Date.now()}`,
      name: map.enemyName,
      icon: map.image || "",
      maxHp: map.enemyHp,
      currentHp: map.enemyHp,
      level: map.id,
      attack: map.enemyAttack,
      defense: Math.floor(map.enemyAttack * 0.1),
      xpReward: map.xpReward,
    };

    const currentStats = state.combatStats;
    const newStats: CombatState = {
      ...currentStats,
      currentMapId: mapId,
      enemyCurrentHp: map.enemyHp,
      respawnTimer: 0,
      playerAttackTimer: 1000, // Initial delay before the player's first strike
      enemyAttackTimer: 1500, // Initial delay before the enemy's first strike
      // Ensure the player doesn't start dead (e.g. from an old bugged save)
      hp:
        currentStats.hp > 0
          ? currentStats.hp
          : get().skills.hitpoints.level * 10,
      cooldownReason: null,
    };

    // Override activeAction to flag the engine that combat is running
    set({
      activeAction: {
        skill: "combat",
        resourceId: mapId.toString(),
        progress: 0,
        targetTime: 0,
      },
      enemy: newEnemy,
      combatStats: newStats,
    });
  },

  /**
   * processCombatTick
   * Wraps the complex calculateCombatSystem function, applies it to the store,
   * and handles dynamic enemy generation between kills.
   */
  processCombatTick: () => {
    const currentState = get() as unknown as GameState;
    const updates = calculateCombatSystem(currentState, 100);

    if (Object.keys(updates).length > 0) {
      const nextState: Partial<FullStoreState> = { ...updates };
      const nextStats = updates.combatStats || get().combatStats;

      // Handle the visual transition between dead enemies and respawning enemies
      if (nextStats.respawnTimer > 0) {
        nextState.enemy = null; // Clear the visual while waiting
      } else if (nextStats.enemyCurrentHp > 0 && !get().enemy) {
        // Timer elapsed, inject new enemy
        const map = COMBAT_DATA.find((m) => m.id === nextStats.currentMapId);
        if (map) {
          nextState.enemy = {
            id: `enemy_${map.id}_${Date.now()}`,
            name: map.enemyName,
            icon: map.image || "",
            maxHp: map.enemyHp,
            currentHp: nextStats.enemyCurrentHp,
            level: map.id,
            attack: map.enemyAttack,
            defense: Math.floor(map.enemyAttack * 0.1),
            xpReward: map.xpReward,
          };
        }
      }

      set(nextState);
    }
  },

  stopCombat: () =>
    set({
      activeAction: null,
      enemy: null,
      combatStats: {
        ...get().combatStats,
        currentMapId: null,
        enemyCurrentHp: 0,
        respawnTimer: 0,
        playerAttackTimer: 0,
        enemyAttackTimer: 0,
        cooldownUntil: Date.now() + 30000, // 30s tactical retreat penalty
        cooldownReason: "retreat",
        damagePopUps: [], // Instantly wipe visual floating numbers
      },
    }),

  // UI Setting Toggles (Ensure mutual exclusivity)
  toggleAutoProgress: () =>
    set((state) => ({
      combatSettings: {
        ...state.combatSettings,
        autoProgress: !state.combatSettings.autoProgress,
        autoRetreat: !state.combatSettings.autoProgress
          ? false
          : state.combatSettings.autoRetreat,
      },
    })),

  toggleAutoRetreat: () =>
    set((state) => ({
      combatSettings: {
        ...state.combatSettings,
        autoRetreat: !state.combatSettings.autoRetreat,
        autoProgress: !state.combatSettings.autoRetreat
          ? false
          : state.combatSettings.autoProgress,
      },
    })),

  updateCombatSettings: (newSettings) =>
    set((state) => ({
      combatSettings: { ...state.combatSettings, ...newSettings },
    })),

  addCombatLog: (message: string) =>
    set({
      combatStats: {
        ...get().combatStats,
        // Prepend new messages and slice to maintain max array length of 20
        combatLog: [message, ...get().combatStats.combatLog].slice(0, 20),
      },
    }),
});
