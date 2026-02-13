import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { DEFAULT_STATE } from '../useGameStore';
import { getItemDetails } from '../../data';
import { isEquipmentSlot } from '../../utils/gameUtils';
import type { Resource, EquipmentSlot, ShopItem } from '../../types';

export interface InventorySlice {
  inventory: Record<string, number>;
  coins: number;
  upgrades: string[];
  equipment: Record<Exclude<EquipmentSlot, 'food'>, string | null>;
  equippedFood: { itemId: string, count: number } | null;
  
  sellItem: (itemId: string, amount: number | 'all') => void;
  buyUpgrade: (item: ShopItem) => void;
  gamble: (amount: number) => boolean;
  equipItem: (itemId: string, targetSlot: EquipmentSlot) => void;
  unequipItem: (slot: string) => void;
  equipFood: (itemId: string, amount: number) => void;
  unequipFood: () => void;
  enchantItem: (originalId: string, newId: string, cost: number) => void;
}

export const createInventorySlice: StateCreator<FullStoreState, [], [], InventorySlice> = (set) => ({
  inventory: DEFAULT_STATE.inventory,
  coins: DEFAULT_STATE.coins,
  upgrades: DEFAULT_STATE.upgrades,
  equipment: DEFAULT_STATE.equipment,
  equippedFood: DEFAULT_STATE.equippedFood,

  sellItem: (itemId, amountToSell) => set((state: FullStoreState) => {
    const item = getItemDetails(itemId);
    const currentCount = state.inventory[itemId] || 0;
    if (!item || currentCount <= 0) return {};
    const count = amountToSell === 'all' ? currentCount : Math.min(amountToSell, currentCount);
    const profit = count * item.value;
    const newInventory = { ...state.inventory };
    newInventory[itemId] -= count;
    if (newInventory[itemId] <= 0) delete newInventory[itemId];
    return { coins: state.coins + profit, inventory: newInventory };
  }),

    buyUpgrade: (item) => set((state: FullStoreState) => {
        // KORJAUS: Vaihdettu item.cost -> item.price
        if (state.coins >= item.price && !state.upgrades.includes(item.id)) {
        return { 
            coins: state.coins - item.price, 
            upgrades: [...state.upgrades, item.id] 
        };
        }
        return {};
    }),

  gamble: (amount) => {
    const isWin = Math.random() >= 0.5;
    set((state: FullStoreState) => ({ coins: isWin ? state.coins + amount : state.coins - amount }));
    return isWin;
  },

  equipItem: (itemId, targetSlot) => set((state: FullStoreState) => {
    if (targetSlot === 'food' || !isEquipmentSlot(targetSlot)) return {};
    const item = getItemDetails(itemId) as Resource;
    if (!item || !item.slot || item.slot !== targetSlot) return {};
    const newInventory = { ...state.inventory };
    const newEquipment = { ...state.equipment };
    const currentEquipped = newEquipment[targetSlot];
    newInventory[itemId] -= 1;
    if (newInventory[itemId] <= 0) delete newInventory[itemId];
    if (currentEquipped) newInventory[currentEquipped] = (newInventory[currentEquipped] || 0) + 1;
    newEquipment[targetSlot] = itemId;
    return { inventory: newInventory, equipment: newEquipment };
  }),

  unequipItem: (slot) => set((state: FullStoreState) => {
    if (slot === 'food' || !isEquipmentSlot(slot)) return {};
    const validSlot = slot as keyof typeof state.equipment;
    const itemId = state.equipment[validSlot];
    if (!itemId) return {};
    const newEquipment = { ...state.equipment, [validSlot]: null };
    const newInventory = { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) + 1 };
    return { equipment: newEquipment, inventory: newInventory };
  }),

  equipFood: (itemId, amount) => set((state: FullStoreState) => {
    const item = getItemDetails(itemId) as Resource;
    if (!item || !item.healing) return {};
    const newInventory = { ...state.inventory };
    let newEquippedFood = state.equippedFood ? { ...state.equippedFood } : null;
    if (newEquippedFood) newInventory[newEquippedFood.itemId] = (newInventory[newEquippedFood.itemId] || 0) + newEquippedFood.count;
    if (newInventory[itemId] >= amount) {
      newInventory[itemId] -= amount;
      if (newInventory[itemId] <= 0) delete newInventory[itemId];
      newEquippedFood = { itemId, count: amount };
    }
    return { inventory: newInventory, equippedFood: newEquippedFood };
  }),

  unequipFood: () => set((state: FullStoreState) => {
    if (!state.equippedFood) return {};
    const newInventory = { ...state.inventory };
    newInventory[state.equippedFood.itemId] = (newInventory[state.equippedFood.itemId] || 0) + state.equippedFood.count;
    return { inventory: newInventory, equippedFood: null };
  }),

  enchantItem: (originalId, newId, cost) => set((state: FullStoreState) => {
    if (state.coins < cost) return {};
    const newInventory = { ...state.inventory };
    const newEquipment = { ...state.equipment };
    let itemFound = false;
    const equippedSlot = (Object.keys(newEquipment) as Array<keyof typeof newEquipment>).find(key => newEquipment[key] === originalId);
    if (equippedSlot) { newEquipment[equippedSlot] = newId; itemFound = true; } 
    else if (newInventory[originalId]) {
      newInventory[originalId] -= 1;
      if (newInventory[originalId] <= 0) delete newInventory[originalId];
      newInventory[newId] = (newInventory[newId] || 0) + 1;
      itemFound = true;
    }
    if (!itemFound) return {};
    return {
      coins: state.coins - cost,
      inventory: newInventory,
      equipment: newEquipment,
      notification: { message: "Enchantment Successful!", icon: "/assets/ui/icon_check.png" }
    } as Partial<FullStoreState>;
  }),
});