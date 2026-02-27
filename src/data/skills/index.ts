import { autoScaleResource } from '../../utils/skillScaling';
import type { Resource } from '../../types';

// Perus-skillit (tiedostot)
import { woodcuttingResources } from './woodcutting';
import { miningResources } from './mining';
import { foragingResources, foragingLoot } from './foraging';
import { alchemyResources } from './alchemy';
import { fishingResources } from './fishing';
import { farmingResources } from './farming';
import { cookingResources } from './cooking';

// Monimutkaiset skillit (alikansiot)
// Vite/TypeScript osaa hakea automaattisesti index.ts-tiedoston kansion sisältä
import { smithingResources } from './smithing'; 
import { craftingResources } from './crafting';

const RAW_GAME_DATA: Record<string, Resource[]> = {
  woodcutting: woodcuttingResources,
  mining: miningResources,
  foraging: foragingResources,
  alchemy: alchemyResources,
  foraging_loot: foragingLoot,
  smithing: smithingResources,
  crafting: craftingResources,
  fishing: fishingResources,
  farming: farmingResources,
  cooking: cookingResources,
};

export const GAME_DATA: Record<string, Resource[]> = Object.keys(RAW_GAME_DATA).reduce(
  (acc, category) => {
    acc[category] = RAW_GAME_DATA[category].map(autoScaleResource);
    return acc;
  },
  {} as Record<string, Resource[]>
);