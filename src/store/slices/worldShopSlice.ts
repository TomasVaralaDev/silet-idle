// src/store/slices/worldShopSlice.ts
import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { WORLD_SHOP_DATA } from "../../data/worldShop";
import type { WorldShopState } from "../../types";

export interface WorldShopSlice {
  worldShop: WorldShopState;
  buyWorldItem: (itemId: string) => void;
  syncWorldShopWithServer: (serverResetTime: number) => void;
}

export const createWorldShopSlice: StateCreator<
  FullStoreState,
  [],
  [],
  WorldShopSlice
> = (set, get) => ({
  // --- ALKUTILA ---
  worldShop: {
    purchases: {},
    lastResetTime: 0,
  },

  /**
   * Palvelinohjattu reset-mekaniikka.
   * Verrataan palvelimen globaalia aikaleimaa pelaajan tallennukseen.
   */
  syncWorldShopWithServer: (serverResetTime: number) => {
    const { worldShop } = get();

    if (!serverResetTime) return;

    console.log(
      "🔍 [SHOP-SYNC] Tarkistetaan reset: Server:",
      serverResetTime,
      "Player:",
      worldShop.lastResetTime,
    );

    if (serverResetTime > worldShop.lastResetTime) {
      console.log(
        "🔥 [SHOP-SYNC] Päivä vaihtunut! Nollataan kauppa ja tehtävät.",
      );

      set((state) => ({
        worldShop: {
          ...state.worldShop,
          purchases: {}, // Tyhjennetään päivän ostokset
          lastResetTime: serverResetTime, // Päivitetään "viimeisin reset" palvelimen ajalla
        },
      }));
    } else {
      console.log("✅ [SHOP-SYNC] Pelaaja on jo synkassa palvelimen kanssa.");
    }
  },

  buyWorldItem: (itemId) => {
    const { inventory, coins, emitEvent, worldShop } = get();

    // 0. Etsitään tuote datasta
    const shopItem = WORLD_SHOP_DATA.find((item) => item.id === itemId);
    if (!shopItem) return;

    // 1. TARKISTA PÄIVÄLIMIT (Daily Limit)
    const currentPurchases = worldShop.purchases[itemId] || 0;
    if (
      shopItem.dailyLimit !== undefined &&
      currentPurchases >= shopItem.dailyLimit
    ) {
      emitEvent(
        "warning",
        `Daily limit reached (${currentPurchases}/${shopItem.dailyLimit})`,
        "/assets/ui/icon_locked.png",
      );
      return;
    }

    // 2. TARKISTA VALUUTTA
    if (coins < shopItem.costCoins) {
      emitEvent("error", "Not enough Fragments!", "/assets/ui/coins.png");
      return;
    }

    // 3. TARKISTA MATERIAALIT
    const hasMaterials = shopItem.costMaterials.every(
      (req) => (inventory[req.itemId] || 0) >= req.amount,
    );

    if (!hasMaterials) {
      emitEvent(
        "error",
        "Missing required materials!",
        "/assets/ui/icon_locked.png",
      );
      return;
    }

    // 4. SUORITA OSTO
    set((state) => {
      const newInventory = { ...state.inventory };

      // Vähennä materiaalit
      shopItem.costMaterials.forEach((req) => {
        newInventory[req.itemId] -= req.amount;
        if (newInventory[req.itemId] <= 0) delete newInventory[req.itemId];
      });

      // Lisää tuote inventaarioon
      newInventory[shopItem.resultItemId] =
        (newInventory[shopItem.resultItemId] || 0) + shopItem.resultAmount;

      // PÄIVITÄ OSTOSLASKURI (Ylläpitää muiden tuotteiden laskurit)
      const newPurchases = {
        ...state.worldShop.purchases,
        [itemId]: currentPurchases + 1,
      };

      return {
        coins: state.coins - shopItem.costCoins,
        inventory: newInventory,
        worldShop: {
          ...state.worldShop,
          purchases: newPurchases,
        },
      };
    });

    emitEvent("success", `Purchased ${shopItem.name}`, shopItem.icon);
  },
});
