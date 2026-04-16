import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { TOWER_FLOORS } from "../../data/tower";
import { getItemDetails } from "../../data";
import type { Resource } from "../../types";

export interface TowerSlice {
  startTowerCombat: (floorNumber: number) => void;
  // processTowerTick poistettu, koska useGameEngine hoitaa tikityksen nykyään!
  leaveTowerCombat: () => void;
  claimTowerVictory: () => void;
  castTowerSkill: () => void;
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

    // Lasketaan pelaajan maksimi HP (Perus HP + Skillien taso + Varusteet)
    const hitpointsLevel = state.skills.hitpoints?.level || 1;
    const gearHpBonus = (
      Object.values(state.equipment) as (string | null)[]
    ).reduce((acc, itemId) => {
      if (!itemId) return acc;
      const item = getItemDetails(itemId) as Resource;
      return acc + (item?.stats?.hpBonus || 0);
    }, 0);

    const maxHp = 100 + hitpointsLevel * 10 + gearHpBonus;

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
          combatTimer: 60000,
          combatLog: [`Engaged ${floorData.enemy.name}!`],
          damagePopUps: [],
          status: "fighting",
        },
      },
    });
  },

  castTowerSkill: () => {
    set((state) => {
      // Varmistetaan, että taistelu on käynnissä
      if (
        !state.tower.combat.isActive ||
        state.tower.combat.status !== "fighting"
      )
        return state;
      return {
        tower: {
          ...state.tower,
          combat: {
            ...state.tower.combat,
            manualSkillQueue: true, // Tämä käskee seuraavaa tikkiä laukaisemaan taidon!
          },
        },
      };
    });
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
