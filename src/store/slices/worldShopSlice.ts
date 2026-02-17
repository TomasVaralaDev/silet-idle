import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { WORLD_SHOP_DATA } from '../../data/worldShop';
import type { WorldShopState } from '../../types';

export interface WorldShopSlice {
  worldShop: WorldShopState; // Tila
  buyWorldItem: (itemId: string) => void;
  checkDailyReset: () => void; // Tätä kutsutaan pelin latauksessa/taustalla
}

export const createWorldShopSlice: StateCreator<FullStoreState, [], [], WorldShopSlice> = (set, get) => ({
  // ALKUTILA
  worldShop: {
    purchases: {},
    lastResetTime: Date.now(),
  },

  checkDailyReset: () => {
    const { worldShop } = get();
    const now = Date.now();
    const lastReset = new Date(worldShop.lastResetTime);
    const current = new Date(now);

    // Tarkistetaan onko päivä vaihtunut (yksinkertainen client-side check)
    // Myöhemmin Firebase voi pakottaa tämän palvelimelta päivittämällä lastResetTime:n
    const isNextDay = current.getDate() !== lastReset.getDate() || current.getMonth() !== lastReset.getMonth();

    if (isNextDay) {
      set({
        worldShop: {
          purchases: {}, // Nollataan ostokset
          lastResetTime: now
        }
      });
      console.log("Daily shop limits reset.");
    }
  },

  buyWorldItem: (itemId) => {
    const { inventory, coins, emitEvent, worldShop, checkDailyReset } = get();
    
    // 0. Tarkista ensin onko resetin aika
    checkDailyReset();

    const shopItem = WORLD_SHOP_DATA.find(item => item.id === itemId);
    if (!shopItem) return;

    // 1. TARKISTA DAILY LIMIT
    const currentPurchases = worldShop.purchases[itemId] || 0;
    if (shopItem.dailyLimit !== undefined && currentPurchases >= shopItem.dailyLimit) {
      emitEvent('warning', `Daily limit reached (${shopItem.dailyLimit}/${shopItem.dailyLimit})`, '/assets/ui/icon_locked.png');
      return;
    }

    // 2. Tarkista rahat
    if (coins < shopItem.costCoins) {
      emitEvent('error', 'Not enough Fragments!', '/assets/ui/coins.png');
      return;
    }

    // 3. Tarkista materiaalit
    const hasMaterials = shopItem.costMaterials.every(req => 
      (inventory[req.itemId] || 0) >= req.amount
    );

    if (!hasMaterials) {
      emitEvent('error', 'Missing required materials!', '/assets/ui/icon_locked.png');
      return;
    }

    // 4. Suorita maksu ja päivitä seuranta
    set((state) => {
      const newInventory = { ...state.inventory };
      
      // Vähennä materiaalit
      shopItem.costMaterials.forEach(req => {
        newInventory[req.itemId] -= req.amount;
        if (newInventory[req.itemId] <= 0) delete newInventory[req.itemId];
      });

      // Lisää tuote
      newInventory[shopItem.resultItemId] = (newInventory[shopItem.resultItemId] || 0) + shopItem.resultAmount;

      // PÄIVITÄ OSTOSLASKURI
      const newPurchases = { ...state.worldShop.purchases };
      newPurchases[itemId] = (newPurchases[itemId] || 0) + 1;

      return {
        coins: state.coins - shopItem.costCoins,
        inventory: newInventory,
        worldShop: {
          ...state.worldShop,
          purchases: newPurchases
        }
      };
    });

    emitEvent('success', `Purchased ${shopItem.name}`, shopItem.icon);
  }
});