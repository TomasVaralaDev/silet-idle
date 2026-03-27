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
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;
}

export const createCombatSlice: StateCreator<
  FullStoreState,
  [],
  [],
  CombatSlice
> = (set, get) => ({
  startCombat: (mapId: number) => {
    // --- COOLDOWN TARKISTUS ---
    const state = get();
    const cooldownLeft = (state.combatStats.cooldownUntil || 0) - Date.now();

    if (cooldownLeft > 0) {
      const seconds = Math.ceil(cooldownLeft / 1000);
      state.emitEvent(
        "warning",
        `You were defeated... Wait ${seconds}s`,
        "/assets/ui/icon_death.png",
      );
      return;
    }

    const map = COMBAT_DATA.find((m) => m.id === mapId);
    if (!map) return;

    // --- BOSS AVAIN TARKISTUS JA KULUTUS ---
    if (map.isBoss && map.keyRequired) {
      const currentInventory = state.inventory;
      const keyCount = currentInventory[map.keyRequired] || 0;

      if (keyCount < 1) return;

      set((state) => ({
        inventory: {
          ...state.inventory,
          [map.keyRequired!]: keyCount - 1,
        },
      }));
    }

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
      playerAttackTimer: 1000, // Alkuviive ennen ensimmäistä iskua (1s)
      enemyAttackTimer: 1500, // Vihollinen iskee hieman myöhemmin alussa
      hp:
        currentStats.hp > 0
          ? currentStats.hp
          : get().skills.hitpoints.level * 10,
      cooldownReason: null, // Nollataan syy aina kun uusi taistelu alkaa
    };

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

  processCombatTick: () => {
    const currentState = get() as unknown as GameState;
    const updates = calculateCombatSystem(currentState, 100);

    if (Object.keys(updates).length > 0) {
      const nextState: Partial<FullStoreState> = { ...updates };
      const nextStats = updates.combatStats || get().combatStats;

      if (nextStats.respawnTimer > 0) {
        nextState.enemy = null;
      } else if (nextStats.enemyCurrentHp > 0 && !get().enemy) {
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

  // RETREAT: Pysäytetään taistelu ja asetetaan VETÄYTYMIS-rangaistus
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
        cooldownUntil: Date.now() + 30000, // 30 sekunnin rangaistus vetäytymisestä
        cooldownReason: "retreat", // LISÄTTY: Tieto vetäytymisestä UI:ta varten
      },
    }),

  toggleAutoProgress: () =>
    set({
      combatSettings: {
        ...get().combatSettings,
        autoProgress: !get().combatSettings.autoProgress,
      },
    }),

  updateCombatSettings: (newSettings) =>
    set((state) => ({
      combatSettings: { ...state.combatSettings, ...newSettings },
    })),

  addCombatLog: (message: string) =>
    set({
      combatStats: {
        ...get().combatStats,
        combatLog: [message, ...get().combatStats.combatLog].slice(0, 20),
      },
    }),
});
