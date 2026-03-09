import { getItemDetails } from "../data";
import type { Resource } from "../types";

/**
 * Hakee esineen tiedot ID:n perusteella.
 * Käyttää pelin dynaamista päätehdasta (getItemDetails),
 * jotta myös generoidut esineet (avaimet, lootit, lumotut varusteet) otetaan huomioon.
 */
export const getItemById = (id: string): Resource | undefined => {
  const item = getItemDetails(id);

  // Palautetaan undefined nullin sijaan, jotta tyypitys säilyy samana kuin aiemmin
  return item !== null ? item : undefined;
};
