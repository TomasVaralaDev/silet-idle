// src/utils/equipmentUtils.ts
import { useGameStore } from "../store/useGameStore";
import { getItemDetails } from "../data";
import type { EquipmentSlot, Resource } from "../types";

/**
 * Hakee tällä hetkellä puetun esineen tiedot annetulle slotille.
 */
export const getEquippedItem = (
  slot: EquipmentSlot | undefined,
): Resource | null => {
  if (!slot) return null;

  const equipment = useGameStore.getState().equipment;

  // Tyyppiturvallinen tarkistus (EquipmentSlot ei sisällä "food")
  const equippedId = equipment[slot as keyof typeof equipment];

  if (!equippedId) return null;

  return getItemDetails(equippedId as string);
};
