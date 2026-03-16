import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { getItemDetails } from "../../data";
import type { EquipmentSlot, ShopItem } from "../../types";

export interface InventorySlice {
  inventory: Record<string, number>;
  coins: number;
  upgrades: string[];
  equipment: Record<Exclude<EquipmentSlot, "food">, string | null>;
  equippedFood: { itemId: string; count: number } | null;
  // KORJAUS: Tyypitykseen lisätty | "all", jotta UI voi lähettää sen turvallisesti
  sellItem: (itemId: string, amount: number | "all") => void;
  buyUpgrade: (item: ShopItem) => void;
  gamble: (amount: number, callback: (win: boolean) => void) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: string) => void;
  enchantItem: (originalId: string, newId: string, cost: number) => void;
}

export const createInventorySlice: StateCreator<
  FullStoreState,
  [],
  [],
  InventorySlice
> = (set) => ({
  inventory: {},
  coins: 0,
  upgrades: [],
  equipment: {
    head: null,
    body: null,
    legs: null,
    weapon: null,
    shield: null,
    necklace: null,
    ring: null,
    rune: null,
    skill: null,
  },
  equippedFood: null,

  sellItem: (itemId, amount) =>
    set((state) => {
      const item = getItemDetails(itemId);
      const currentCount = state.inventory[itemId] || 0;

      if (!item || currentCount <= 0) return {};

      // POMMINVARMA MÄÄRÄN TARKISTUS:
      // Jos UI lähettää vahingossa sanan "all", myydään kaikki.
      // Muussa tapauksessa muutetaan syöte varmasti numeroksi.
      let parsedAmount = 0;
      if (amount === "all") {
        parsedAmount = currentCount;
      } else {
        parsedAmount = Number(amount) || 0;
      }

      // Jos määrä on nolla tai vähemmän (esim. viallinen syöte), perutaan myynti
      if (parsedAmount <= 0) return {};

      const actualSellAmount = Math.min(parsedAmount, currentCount);
      const itemValue = item.value || 0;
      const profit = actualSellAmount * itemValue;

      const newInventory = { ...state.inventory };
      newInventory[itemId] = currentCount - actualSellAmount;

      if (newInventory[itemId] <= 0) {
        delete newInventory[itemId];
      }

      const currentCoins = state.coins || 0;

      return {
        coins: currentCoins + profit,
        inventory: newInventory,
      };
    }),

  buyUpgrade: (item) =>
    set((state) => {
      if (state.coins >= item.price && !state.upgrades.includes(item.id)) {
        return {
          coins: state.coins - item.price,
          upgrades: [...state.upgrades, item.id],
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
        coins: isWin ? state.coins + amount : state.coins - amount,
      };
    });
  },

  equipItem: (itemId) =>
    set((state) => {
      const item = getItemDetails(itemId);
      if (!item || !item.slot) return {};

      // === LEVEL CAP JÄRJESTELMÄ ===
      if (item.level && item.level > 1) {
        let requiredSkill: keyof typeof state.skills = "smithing"; // Oletus melee/armor

        // Määritetään vaadittu skill
        if (item.combatStyle === "ranged") requiredSkill = "crafting";
        if (item.combatStyle === "magic") requiredSkill = "alchemy"; // Aseille/sauvoille

        // JOS esine on parantava potion (slot "food" tai on parantava vaikutus), se vaatii Alchemya
        if (item.slot === "food" || item.healing) {
          requiredSkill = "alchemy";
        }

        const playerSkillLevel = state.skills[requiredSkill]?.level || 1;

        if (playerSkillLevel < item.level) {
          return {}; // Ei tarpeeksi tasoa, estetään pukeminen
        }
      }
      // ============================

      const newInventory = { ...state.inventory };
      const currentCount = newInventory[itemId] || 0;
      if (currentCount <= 0) return {};

      if (item.slot === "food") {
        let newEquippedCount = currentCount;

        if (state.equippedFood) {
          if (state.equippedFood.itemId === itemId) {
            newEquippedCount += state.equippedFood.count;
          } else {
            const oldId = state.equippedFood.itemId;
            newInventory[oldId] =
              (newInventory[oldId] || 0) + state.equippedFood.count;
          }
        }

        delete newInventory[itemId];

        return {
          inventory: newInventory,
          equippedFood: { itemId, count: newEquippedCount },
        };
      } else {
        const slot = item.slot as Exclude<EquipmentSlot, "food">;
        const currentEquipId = state.equipment[slot];

        if (currentEquipId) {
          newInventory[currentEquipId] =
            (newInventory[currentEquipId] || 0) + 1;
        }

        if (currentCount > 1) {
          newInventory[itemId] = currentCount - 1;
        } else {
          delete newInventory[itemId];
        }

        return {
          inventory: newInventory,
          equipment: { ...state.equipment, [slot]: itemId },
        };
      }
    }),
  unequipItem: (slot) =>
    set((state) => {
      const newInventory = { ...state.inventory };
      if (slot === "food") {
        if (!state.equippedFood) return {};
        const { itemId, count } = state.equippedFood;
        newInventory[itemId] = (newInventory[itemId] || 0) + count;
        return { inventory: newInventory, equippedFood: null };
      } else {
        const equipSlot = slot as keyof typeof state.equipment;
        const itemId = state.equipment[equipSlot];
        if (!itemId) return {};
        newInventory[itemId] = (newInventory[itemId] || 0) + 1;
        return {
          inventory: newInventory,
          equipment: { ...state.equipment, [equipSlot]: null },
        };
      }
    }),

  enchantItem: (originalId, newId, cost) =>
    set((state) => {
      if (state.coins < cost) return {};
      const newInventory = { ...state.inventory };
      const newEquipment = { ...state.equipment };
      let itemFound = false;

      const equippedSlot = (
        Object.keys(newEquipment) as Array<keyof typeof newEquipment>
      ).find((key) => newEquipment[key] === originalId);

      if (equippedSlot) {
        newEquipment[equippedSlot] = newId;
        itemFound = true;
      } else if (newInventory[originalId]) {
        newInventory[originalId] -= 1;
        if (newInventory[originalId] <= 0) {
          delete newInventory[originalId];
        }
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
