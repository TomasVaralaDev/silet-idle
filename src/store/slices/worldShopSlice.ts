import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { WORLD_SHOP_DATA } from '../../data/worldShop';

export interface WorldShopSlice {
  buyWorldItem: (itemId: string) => void;
}

export const createWorldShopSlice: StateCreator<FullStoreState, [], [], WorldShopSlice> = (set, get) => ({
  buyWorldItem: (itemId) => {
    const { inventory, coins, emitEvent } = get();
    const shopItem = WORLD_SHOP_DATA.find(item => item.id === itemId);

    if (!shopItem) return;

    // 1. Tarkista rahat
    if (coins < shopItem.costCoins) {
      emitEvent('error', 'Not enough Fragments!', '/assets/ui/coins.png');
      return;
    }

    // 2. Tarkista materiaalit
    const hasMaterials = shopItem.costMaterials.every(req => 
      (inventory[req.itemId] || 0) >= req.amount
    );

    if (!hasMaterials) {
      emitEvent('error', 'Missing required materials!', '/assets/ui/icon_locked.png');
      return;
    }

    // 3. Suorita maksu ja anna tuote
    set((state) => {
      const newInventory = { ...state.inventory };
      
      // Vähennä materiaalit
      shopItem.costMaterials.forEach(req => {
        newInventory[req.itemId] -= req.amount;
        if (newInventory[req.itemId] <= 0) delete newInventory[req.itemId];
      });

      // Lisää tuote
      newInventory[shopItem.resultItemId] = (newInventory[shopItem.resultItemId] || 0) + shopItem.resultAmount;

      return {
        coins: state.coins - shopItem.costCoins,
        inventory: newInventory
      };
    });

    emitEvent('success', `Purchased ${shopItem.name}`, shopItem.icon);
  }
});