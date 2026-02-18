import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { getItemDetails } from '../../data';
import type { EquipmentSlot, ShopItem } from '../../types';

export interface InventorySlice {
  // State
  inventory: Record<string, number>;
  coins: number;
  upgrades: string[];
  equipment: Record<Exclude<EquipmentSlot, 'food'>, string | null>;
  equippedFood: { itemId: string, count: number } | null;
  
  // Actions
  sellItem: (itemId: string) => void;
  buyUpgrade: (item: ShopItem) => void;
  gamble: (amount: number, callback: (win: boolean) => void) => void;
  
  // Unified Equip/Unequip
  equipItem: (itemId: string) => void;
  unequipItem: (slot: string) => void;
  
  // Legacy / Specific actions
  enchantItem: (originalId: string, newId: string, cost: number) => void;
}

export const createInventorySlice: StateCreator<
  FullStoreState,
  [],
  [],
  InventorySlice
> = (set) => ({ // Poistettu 'get' tästä
  inventory: {},
  coins: 0,
  upgrades: [],
  equipment: {
    head: null, body: null, legs: null, weapon: null, shield: null,
    necklace: null, ring: null, rune: null, skill: null
  },
  equippedFood: null,

  sellItem: (itemId) => set((state) => {
    const item = getItemDetails(itemId);
    const count = state.inventory[itemId] || 0;
    
    if (!item || count <= 0) return {};

    const profit = count * item.value;
    const newInventory = { ...state.inventory };
    delete newInventory[itemId]; // Myydään kaikki kerralla

    return { 
      coins: state.coins + profit, 
      inventory: newInventory 
    };
  }),

  buyUpgrade: (item) => set((state) => {
    if (state.coins >= item.price && !state.upgrades.includes(item.id)) {
      return { 
        coins: state.coins - item.price, 
        upgrades: [...state.upgrades, item.id] 
      };
    }
    return {};
  }),

  gamble: (amount, callback) => {
    set((state) => {
      if (state.coins < amount) return {};
      
      const isWin = Math.random() >= 0.5;
      callback(isWin); 
      
      return { 
        coins: isWin ? state.coins + amount : state.coins - amount 
      };
    });
  },

  equipItem: (itemId) => set((state) => {
    const item = getItemDetails(itemId);
    if (!item || !item.slot) return {}; 

    const newInventory = { ...state.inventory };
    const currentCount = newInventory[itemId] || 0;
    if (currentCount <= 0) return {};

    // --- CASE 1: FOOD ---
    if (item.slot === 'food') {
      if (state.equippedFood) {
        const oldId = state.equippedFood.itemId;
        newInventory[oldId] = (newInventory[oldId] || 0) + state.equippedFood.count;
      }

      delete newInventory[itemId];
      
      return {
        inventory: newInventory,
        equippedFood: { itemId, count: currentCount }
      };
    }

    // --- CASE 2: EQUIPMENT ---
    else {
      const slot = item.slot as Exclude<EquipmentSlot, 'food'>;
      const currentEquipId = state.equipment[slot];

      if (currentEquipId) {
        newInventory[currentEquipId] = (newInventory[currentEquipId] || 0) + 1;
      }

      if (currentCount > 1) {
        newInventory[itemId] = currentCount - 1;
      } else {
        delete newInventory[itemId];
      }

      return {
        inventory: newInventory,
        equipment: {
          ...state.equipment,
          [slot]: itemId
        }
      };
    }
  }),

  unequipItem: (slot) => set((state) => {
    const newInventory = { ...state.inventory };

    // --- CASE 1: FOOD ---
    if (slot === 'food') {
      if (!state.equippedFood) return {};
      
      const { itemId, count } = state.equippedFood;
      newInventory[itemId] = (newInventory[itemId] || 0) + count;
      
      return {
        inventory: newInventory,
        equippedFood: null
      };
    }

    // --- CASE 2: EQUIPMENT ---
    else {
      const equipSlot = slot as keyof typeof state.equipment;
      const itemId = state.equipment[equipSlot];
      
      if (!itemId) return {};

      newInventory[itemId] = (newInventory[itemId] || 0) + 1;

      return {
        inventory: newInventory,
        equipment: {
          ...state.equipment,
          [equipSlot]: null
        }
      };
    }
  }),

  enchantItem: (originalId, newId, cost) => set((state) => {
    if (state.coins < cost) return {};

    const newInventory = { ...state.inventory };
    const newEquipment = { ...state.equipment };
    let itemFound = false;

    const equippedSlot = (Object.keys(newEquipment) as Array<keyof typeof newEquipment>).find(
      key => newEquipment[key] === originalId
    );

    if (equippedSlot) {
      newEquipment[equippedSlot] = newId;
      itemFound = true;
    } 
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
    };
  }),
});