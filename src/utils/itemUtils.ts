import { GAME_DATA } from '../data/skills'; // Polku tiedostoosi
import type { Resource } from '../types';

// Litistetään kaikki esineet yhteen mappiin nopeaa haku varten
const ALL_ITEMS_MAP: Record<string, Resource> = {};

Object.values(GAME_DATA).forEach((categoryItems) => {
  categoryItems.forEach((item) => {
    ALL_ITEMS_MAP[item.id] = item;
  });
});

export const getItemById = (id: string): Resource | undefined => {
  return ALL_ITEMS_MAP[id];
};
