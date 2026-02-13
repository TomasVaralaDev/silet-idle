import { WORLD_INFO, WORLD_LOOT } from './worlds';
import { COMBAT_DATA } from './combat';
import { GAME_DATA } from './skills';
import { SHOP_ITEMS } from './shop';
import { ACHIEVEMENTS } from './achievements';
import { getBaseId, getEnchantLevel, applyEnchantStats } from '../utils/enchanting';
import type { Resource } from '../types';

export { WORLD_INFO, WORLD_LOOT, COMBAT_DATA, GAME_DATA, SHOP_ITEMS, ACHIEVEMENTS };

/**
 * 1. Määritellään Factory-rajapinta.
 * Jokainen tehdas tietää, mitä se osaa tehdä (canHandle) ja miten se tehdään (create).
 */
interface ItemSubFactory {
  canHandle: (id: string) => boolean;
  create: (id: string) => Partial<Resource>;
}

/**
 * 2. World Loot Factory: Dustit, Helmet ja Elite-fragmentit
 */
const WorldLootFactory: ItemSubFactory = {
  canHandle: (id) => id.includes('_basic') || id.includes('_rare') || id.includes('_exotic'),
  create: (id) => {
    const [worldNameRaw, type] = id.split('_');
    const worldDisplay = worldNameRaw.charAt(0).toUpperCase() + worldNameRaw.slice(1);
    
    const configs: Record<string, { suffix: string, val: number, rar: Resource['rarity'], col: string }> = {
      basic: { suffix: 'Dust', val: 10, rar: 'common', col: 'text-slate-400' },
      rare: { suffix: 'Gem', val: 100, rar: 'rare', col: 'text-cyan-400' },
      exotic: { suffix: 'Elite', val: 1000, rar: 'legendary', col: 'text-orange-500' }
    };

    const config = configs[type];
    return {
      name: `${worldDisplay} ${config.suffix}`,
      value: config.val,
      rarity: config.rar,
      color: config.col,
      icon: `/assets/lootpoolszones/${id}.png`,
      description: `${config.rar} energy source from ${worldDisplay}.`
    };
  }
};

/**
 * 3. Key Factory: Pomovastusten avaimet
 */
const KeyFactory: ItemSubFactory = {
  canHandle: (id) => id.startsWith('bosskey_w'),
  create: (id) => {
    const worldNum = id.replace('bosskey_w', '');
    return {
      name: `World ${worldNum} Key`,
      value: 500,
      color: 'text-yellow-500',
      icon: `/assets/items/bosskey/${id}.png`,
      description: 'Provides access to the regional boss.',
      rarity: 'rare'
    };
  }
};

/**
 * 4. Skill Resource Factory: Kaikki GAME_DATAsta löytyvät esineet
 */
const SkillResourceFactory: ItemSubFactory = {
  canHandle: (id) => {
    return Object.values(GAME_DATA).some(skillList => 
      skillList.some(item => item.id === id)
    );
  },
  create: (id) => {
    for (const skillList of Object.values(GAME_DATA)) {
      const found = skillList.find(item => item.id === id);
      if (found) return found;
    }
    return {};
  }
};

/**
 * 5. PÄÄTEHDAS (The Master Factory)
 * Tämä korvaa vanhan if-else viidakon.
 */
export const getItemDetails = (id: string): Resource | null => {
  if (!id) return null;

  // Erikoistapaus: Kolikot (pidetään yksinkertaisena)
  if (id === 'coins') {
    return { id: 'coins', name: 'Coins', value: 1, icon: '/assets/ui/coins.png', rarity: 'common' } as Resource;
  }

  const baseId = getBaseId(id);
  const enchantLevel = getEnchantLevel(id);

  // Etsitään sopiva alitehdas
  const factories = [WorldLootFactory, KeyFactory, SkillResourceFactory];
  const factory = factories.find(f => f.canHandle(baseId));

  if (!factory) return null;

  // Luodaan pohja-esine
  const baseItem = factory.create(baseId);
  
  // Rakennetaan lopullinen Resource
  const finalItem = { ...baseItem, id: id } as Resource;

  // Decorator-kuvio: Lisätään enchantmentit, jos niitä on
  return enchantLevel > 0 ? applyEnchantStats(finalItem, enchantLevel) : finalItem;
};