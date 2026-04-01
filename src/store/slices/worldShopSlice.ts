import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { WORLD_SHOP_DATA } from "../../data/worldShop";
import type { WorldShopState } from "../../types";

export interface WorldShopSlice {
  worldShop: WorldShopState;
  buyWorldItem: (itemId: string, amount: number) => void;
  syncWorldShopWithServer: (serverResetTime: number) => void;
}

/**
 * createWorldShopSlice
 * Manages purchases from the localized regional merchants.
 * Incorporates a daily limit constraint that rests at midnight UTC.
 */
export const createWorldShopSlice: StateCreator<
  FullStoreState,
  [],
  [],
  WorldShopSlice
> = (set, get) => ({
  worldShop: {
    purchases: {},
    lastResetTime: 0,
  },

  /**
   * syncWorldShopWithServer
   * Server-driven reset mechanism. Compares the global server timestamp
   * indicating the last midnight reset with the player's locally saved timestamp.
   * If a reset has occurred, wipes the daily purchase history.
   */
  syncWorldShopWithServer: (serverResetTime: number) => {
    const { worldShop } = get();

    if (!serverResetTime) return;

    if (serverResetTime > worldShop.lastResetTime) {
      set((state) => ({
        worldShop: {
          ...state.worldShop,
          purchases: {}, // Flush the tracked daily limits
          lastResetTime: serverResetTime, // Synchronize to server clock
        },
      }));
    }
  },

  buyWorldItem: (itemId, amount) => {
    const { inventory, coins, emitEvent, worldShop } = get();

    const shopItem = WORLD_SHOP_DATA.find((item) => item.id === itemId);
    if (!shopItem || amount <= 0) return;

    // 1. EVALUATE DAILY RESTRICTIONS
    const currentPurchases = worldShop.purchases[itemId] || 0;
    if (
      shopItem.dailyLimit !== undefined &&
      currentPurchases + amount > shopItem.dailyLimit
    ) {
      emitEvent(
        "warning",
        `Not enough daily limit left!`,
        "./assets/ui/icon_locked.png",
      );
      return; // Abort
    }

    // 2. EVALUATE GENERIC CURRENCY
    const totalCoinCost = shopItem.costCoins * amount;
    if (coins < totalCoinCost) {
      emitEvent("error", "Not enough Fragments!", "./assets/ui/coins.png");
      return; // Abort
    }

    // 3. EVALUATE REGIONAL MATERIALS
    const hasMaterials = shopItem.costMaterials.every(
      (req) => (inventory[req.itemId] || 0) >= req.amount * amount,
    );

    if (!hasMaterials) {
      emitEvent(
        "error",
        "Missing required materials!",
        "./assets/ui/icon_locked.png",
      );
      return; // Abort
    }

    // 4. PROCESS TRANSACTION (Single atomic set call)
    set((state) => {
      const newInventory = { ...state.inventory };

      // Deduct materials
      shopItem.costMaterials.forEach((req) => {
        newInventory[req.itemId] -= req.amount * amount;
        if (newInventory[req.itemId] <= 0) delete newInventory[req.itemId];
      });

      // Inject products
      const totalResult = shopItem.resultAmount * amount;
      newInventory[shopItem.resultItemId] =
        (newInventory[shopItem.resultItemId] || 0) + totalResult;

      // Update tracked limit integer
      const newPurchases = {
        ...state.worldShop.purchases,
        [itemId]: currentPurchases + amount,
      };

      return {
        coins: state.coins - totalCoinCost,
        inventory: newInventory,
        worldShop: {
          ...state.worldShop,
          purchases: newPurchases,
        },
      };
    });

    emitEvent(
      "success",
      `Purchased x${amount} ${shopItem.name}`,
      shopItem.icon,
    );
  },
});
