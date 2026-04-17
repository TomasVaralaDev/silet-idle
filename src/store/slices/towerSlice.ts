import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { TOWER_DATA, type TowerTier } from "../../data/tower";
import { getItemDetails } from "../../data";
import type { Resource } from "../../types";

export interface TowerSlice {
  setTowerTier: (tier: TowerTier) => void;
  startTowerCombat: (floorNumber: number) => void;
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
  setTowerTier: (tier: TowerTier) => {
    set((state) => ({
      tower: {
        ...state.tower,
        activeTier: tier,
      },
    }));
  },

  startTowerCombat: (floorNumber: number) => {
    const state = get();
    const activeTier = state.tower.activeTier || "easy";
    const currentTower = TOWER_DATA[activeTier as TowerTier];

    const floorData = currentTower.find((f) => f.floorNumber === floorNumber);
    if (!floorData) return;

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
          combatLog: [
            `Engaged ${floorData.enemy.name} (Lvl ${floorData.enemy.level})!`,
          ],
          damagePopUps: [],
          status: "fighting",
        },
      },
    });
  },

  castTowerSkill: () => {
    set((state) => {
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
            manualSkillQueue: true,
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
    const activeTier = state.tower.activeTier || "easy";
    const currentTower = TOWER_DATA[activeTier as TowerTier];
    const { combat } = state.tower;

    // Yhteensopivuus vanhojen tallennusten kanssa
    const highestFloors =
      typeof state.tower.highestFloorCompleted === "object"
        ? state.tower.highestFloorCompleted
        : { easy: state.tower.highestFloorCompleted || 0, medium: 0, hard: 0 };

    const currentHighest = highestFloors[activeTier as TowerTier] || 0;

    if (combat.status !== "victory" || !combat.floorNumber) return;

    const floorData = currentTower.find(
      (f) => f.floorNumber === combat.floorNumber,
    );
    if (!floorData) return;

    const newInventory = { ...state.inventory };
    let newCoins = state.coins;
    let newRewardsToDisplay = undefined;

    if (combat.floorNumber > currentHighest) {
      floorData.firstClearRewards.forEach((reward) => {
        if (reward.itemId === "coins") {
          newCoins += reward.amount;
        } else {
          newInventory[reward.itemId] =
            (newInventory[reward.itemId] || 0) + reward.amount;
        }
      });
      newRewardsToDisplay = floorData.firstClearRewards;
    }

    set((state) => ({
      coins: newCoins,
      inventory: newInventory,
      tower: {
        ...state.tower,
        highestFloorCompleted: {
          ...highestFloors,
          [activeTier]: Math.max(currentHighest, combat.floorNumber!),
        },
        combat: {
          ...state.tower.combat,
          isActive: false,
          status: null,
        },
      },
      ...(newRewardsToDisplay && {
        rewardModal: {
          isOpen: true,
          title: `${activeTier.toUpperCase()} Floor ${combat.floorNumber} Cleared!`,
          rewards: newRewardsToDisplay,
        },
      }),
    }));
  },
});
