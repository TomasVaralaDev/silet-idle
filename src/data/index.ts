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
 * 4. Enchant Scroll Factory (UUSI)
 * Tunnistaa IDt muotoa: scroll_enchant_w1, scroll_enchant_w2...
 */
const EnchantScrollFactory: ItemSubFactory = {
  canHandle: (id) => id.startsWith('scroll_enchant_'),
  create: (id) => {
    // Erotetaan tier numerosta (esim. "w1")
    const tierPart = id.split('_').pop(); // "w1"
    const tier = parseInt(tierPart?.replace('w', '') || '1');
    
    // Konfiguraatio (nämä vastaavat shopin arvoja)
    const chances = [0, 5, 8, 12, 15, 20, 25, 30, 40]; 
    const chance = chances[tier] || 5;

    const rarityMap = ['common', 'common', 'common', 'rare', 'rare', 'epic', 'epic', 'legendary', 'legendary'];
    const colorMap = ['text-slate-400', 'text-slate-400', 'text-green-400', 'text-blue-400', 'text-blue-300', 'text-purple-400', 'text-purple-300', 'text-orange-400', 'text-yellow-400'];

    return {
      name: `Enchant Scroll T${tier}`,
      value: 100 * tier,
      rarity: (rarityMap[tier] || 'common') as Resource['rarity'],
      color: colorMap[tier] || 'text-slate-400',
      icon: `/assets/items/enchantingscroll/enchanting_tier${tier}.png`,
      description: `Magical scroll. Increases enchanting success chance by +${chance}%.`
    };
  }
};

/**
 * 5. Skill Resource Factory: Kaikki GAME_DATAsta löytyvät esineet
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
 * 6. PÄÄTEHDAS (The Master Factory)
 */
export const getItemDetails = (id: string): Resource | null => {
  if (!id) return null;

  // Erikoistapaus: Kolikot
  if (id === 'coins') {
    return { id: 'coins', name: 'Coins', value: 1, icon: '/assets/ui/coins.png', rarity: 'common' } as Resource;
  }

  const baseId = getBaseId(id);
  const enchantLevel = getEnchantLevel(id);

  // Etsitään sopiva alitehdas
  const factories = [WorldLootFactory, KeyFactory, EnchantScrollFactory, SkillResourceFactory]; // Lisätty EnchantScrollFactory
  const factory = factories.find(f => f.canHandle(baseId));

  if (!factory) return null;

  // Luodaan pohja-esine
  const baseItem = factory.create(baseId);
  
  // Rakennetaan lopullinen Resource
  const finalItem = { ...baseItem, id: id } as Resource;

  // Decorator-kuvio: Lisätään enchantmentit, jos niitä on
  return enchantLevel > 0 ? applyEnchantStats(finalItem, enchantLevel) : finalItem;
};