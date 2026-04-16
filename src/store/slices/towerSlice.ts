import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { TOWER_FLOORS } from "../../data/tower";
import { calculateTowerCombatTick } from "../../systems/towerCombatSystem";

export interface TowerSlice {
  startTowerCombat: (floorNumber: number) => void;
  processTowerTick: () => void;
  leaveTowerCombat: () => void;
  claimTowerVictory: () => void;
}

export const createTowerSlice: StateCreator<
  FullStoreState,
  [],
  [],
  TowerSlice
> = (set, get) => ({
  startTowerCombat: (floorNumber: number) => {
    const state = get();
    const floorData = TOWER_FLOORS.find((f) => f.floorNumber === floorNumber);
    if (!floorData) return;

    // Laske pelaajan maksimi HP
    const hitpointsLevel = state.skills.hitpoints?.level || 1;
    let hpBonus = 0;
    // Voit halutessasi laskea tähän varusteiden tuoman hpBonuksen,
    // mutta pelkkä baseHp toimii alkuun hyvin.
    const maxHp = 100 + hitpointsLevel * 10;

    set({
      tower: {
        ...state.tower,
        combat: {
          isActive: true,
          floorNumber: floorNumber,
          playerHp: maxHp,
          enemyCurrentHp: floorData.enemy.maxHp,
          playerAttackTimer: 1000,
          enemyAttackTimer: 1500,
          combatLog: [`Engaged ${floorData.enemy.name}!`],
          damagePopUps: [],
          status: "fighting",
        },
      },
    });
  },

  processTowerTick: () => {
    const state = get();
    const newCombatState = calculateTowerCombatTick(state, 100);

    if (newCombatState) {
      set({
        tower: {
          ...state.tower,
          combat: newCombatState as any,
        },
      });
    }
  },

  leaveTowerCombat: () => {
    set((state) => ({
      tower: {
        ...state.tower,
        combat: {
          ...state.tower.combat,
          isActive: false,
          status: null,
          damagePopUps: [],
        },
      },
    }));
  },

  claimTowerVictory: () => {
    const state = get();
    const { combat, highestFloorCompleted } = state.tower;
    if (combat.status !== "victory" || !combat.floorNumber) return;

    const floorData = TOWER_FLOORS.find(
      (f) => f.floorNumber === combat.floorNumber,
    );
    if (!floorData) return;

    const newInventory = { ...state.inventory };
    let newCoins = state.coins;

    // Tarkista onko tämä ensimmäinen läpäisy!
    if (combat.floorNumber > highestFloorCompleted) {
      floorData.firstClearRewards.forEach((reward) => {
        if (reward.itemId === "coins") {
          newCoins += reward.amount;
        } else {
          newInventory[reward.itemId] =
            (newInventory[reward.itemId] || 0) + reward.amount;
        }
      });
      state.emitEvent(
        "success",
        `Floor ${combat.floorNumber} cleared! Rewards claimed.`,
      );
    }

    set((state) => ({
      coins: newCoins,
      inventory: newInventory,
      tower: {
        ...state.tower,
        highestFloorCompleted: Math.max(
          state.tower.highestFloorCompleted,
          combat.floorNumber!,
        ),
        combat: {
          ...state.tower.combat,
          isActive: false,
          status: null,
        },
      },
    }));
  },
});
