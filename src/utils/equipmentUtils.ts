import { useGameStore } from "../store/useGameStore";
import { getItemDetails } from "../data";
import type { EquipmentSlot, Resource } from "../types";

/**
 * getEquippedItem
 * Helper function to safely retrieve the full data object of an item currently
 * worn in a specific equipment slot.
 *
 * @param slot - The equipment slot to check (e.g., 'head', 'weapon')
 * @returns The Resource data of the equipped item, or null if the slot is empty
 */
export const getEquippedItem = (
  slot: EquipmentSlot | undefined,
): Resource | null => {
  if (!slot) return null;

  const equipment = useGameStore.getState().equipment;

  // Type-safe lookup ensuring 'food' is excluded as it's not a standard equip slot
  const equippedId = equipment[slot as keyof typeof equipment];

  if (!equippedId) return null;

  return getItemDetails(equippedId as string);
};
