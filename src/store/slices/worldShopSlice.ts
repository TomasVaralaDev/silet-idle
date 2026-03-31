// src/store/slices/worldShopSlice.ts
import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { WORLD_SHOP_DATA } from "../../data/worldShop";
import type { WorldShopState } from "../../types";

export interface WorldShopSlice {
  worldShop: WorldShopState;
  buyWorldItem: (itemId: string, amount: number) => void; // Lisätty amount
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

  buyWorldItem: (itemId, amount) => {
    const { inventory, coins, emitEvent, worldShop } = get();

    // 0. Etsitään tuote datasta
    const shopItem = WORLD_SHOP_DATA.find((item) => item.id === itemId);
    if (!shopItem || amount <= 0) return;

    // 1. TARKISTA PÄIVÄLIMIT (Daily Limit)
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
      return;
    }

    // 2. TARKISTA VALUUTTA
    const totalCoinCost = shopItem.costCoins * amount;
    if (coins < totalCoinCost) {
      emitEvent("error", "Not enough Fragments!", "./assets/ui/coins.png");
      return;
    }

    // 3. TARKISTA MATERIAALIT
    const hasMaterials = shopItem.costMaterials.every(
      (req) => (inventory[req.itemId] || 0) >= req.amount * amount,
    );

    if (!hasMaterials) {
      emitEvent(
        "error",
        "Missing required materials!",
        "./assets/ui/icon_locked.png",
      );
      return;
    }

    // 4. SUORITA OSTO (Vain yksi set-kutsu!)
    set((state) => {
      const newInventory = { ...state.inventory };

      // Vähennä materiaalit määrällä
      shopItem.costMaterials.forEach((req) => {
        newInventory[req.itemId] -= req.amount * amount;
        if (newInventory[req.itemId] <= 0) delete newInventory[req.itemId];
      });

      // Lisää lopputuotteet määrällä
      const totalResult = shopItem.resultAmount * amount;
      newInventory[shopItem.resultItemId] =
        (newInventory[shopItem.resultItemId] || 0) + totalResult;

      // PÄIVITÄ OSTOSLASKURI MÄÄRÄLLÄ
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

    // Päivitetty onnistumisviesti
    emitEvent(
      "success",
      `Purchased x${amount} ${shopItem.name}`,
      shopItem.icon,
    );
  },
});
