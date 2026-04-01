import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import {
  getEnchantLevel,
  getNextEnchantId,
  getEnchantCost,
  getSuccessChance,
  MAX_ENCHANT_LEVEL,
} from "../../utils/enchanting";
import { getItemDetails } from "../../data";

export interface EnchantingSlice {
  attemptEnchant: (targetItemId: string, scrollId: string) => void;
}

/**
 * createEnchantingSlice
 * Handles the logic, cost deduction, and RNG required to augment equipment.
 */
export const createEnchantingSlice: StateCreator<
  FullStoreState,
  [],
  [],
  EnchantingSlice
> = (set, get) => ({
  attemptEnchant: (targetItemId, scrollId) => {
    const { inventory, coins, equipment, emitEvent } = get();

    // 1. VALIDATION
    const itemDetails = getItemDetails(targetItemId);
    if (!itemDetails) {
      emitEvent("error", "Item data not found.");
      return;
    }
    // Prevent breaking the game by enchanting raw materials or boss weapons
    if (itemDetails.nonEnchantable) {
      emitEvent(
        "error",
        "This Item cannot be enchanted.",
        "./assets/ui/icon_locked.png",
      );
      return;
    }

    const currentLevel = getEnchantLevel(targetItemId);
    if (currentLevel >= MAX_ENCHANT_LEVEL) {
      emitEvent("warning", "Item is already at max level.");
      return;
    }

    if (!inventory[scrollId] || inventory[scrollId] < 1) {
      emitEvent(
        "error",
        "You do not have the required scroll.",
        "./assets/ui/icon_locked.png",
      );
      return;
    }

    const nextLevel = currentLevel + 1;
    const cost = getEnchantCost(nextLevel, itemDetails.value || 100);

    // Extract numerical tier from the scroll ID string (e.g. "enchanting_tier4" -> 4)
    const scrollTier = parseInt(
      scrollId.split("_").pop()?.replace("w", "") || "0",
    );
    const successChance = getSuccessChance(currentLevel, scrollTier);

    if (coins < cost) {
      emitEvent(
        "error",
        `Not enough coins! Need ${cost}.`,
        "./assets/ui/coins.png",
      );
      return;
    }

    // 2. RESOURCE CONSUMPTION (Executed before the roll!)
    const newInventory = { ...inventory };
    newInventory[scrollId] -= 1;
    if (newInventory[scrollId] <= 0) delete newInventory[scrollId];

    const newCoins = coins - cost;

    // 3. THE RNG ROLL
    const roll = Math.random() * 100;
    const isSuccess = roll <= successChance;

    // Apply resource deductions immediately
    set({ inventory: newInventory, coins: newCoins });

    // 4. OUTCOME HANDLING
    if (isSuccess) {
      // Create upgraded item identifier
      const newId = getNextEnchantId(targetItemId);
      const newEquipment = { ...equipment };

      let updated = false;
      // We must scan the equipment object to find where this item is currently worn
      (Object.keys(newEquipment) as Array<keyof typeof equipment>).forEach(
        (slot) => {
          if (newEquipment[slot] === targetItemId) {
            newEquipment[slot] = newId;
            updated = true;
          }
        },
      );

      if (updated) {
        set({ equipment: newEquipment });
        emitEvent(
          "success",
          "Enchantment successful",
          "./assets/ui/icon_check.png",
        );
      } else {
        // Fallback catch if the UI allowed an enchantment on an unequipped item (should not happen currently)
        emitEvent("error", "Error finding equipped item to update.");
      }
    } else {
      // Item breaks/fails, resources were already consumed above
      emitEvent("error", "Enchantment failed", "./assets/ui/icon_fail.png");
    }
  },
});
