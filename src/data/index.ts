import { WORLD_INFO, WORLD_LOOT } from './worlds';
import { COMBAT_DATA } from './combat';
import { GAME_DATA } from './skills';
import { SHOP_ITEMS } from './shop';
import { ACHIEVEMENTS } from './achievements';
import { getBaseId, getEnchantLevel, applyEnchantStats } from '../utils/enchanting';
import type { Resource } from '../types';

export { WORLD_INFO, WORLD_LOOT, COMBAT_DATA, GAME_DATA, SHOP_ITEMS, ACHIEVEMENTS };

/**
 * Hakee esineen tiedot ID:n perusteella.
 * Tukee dynaamisia maailma-esineitä, avaimia ja taitokohtaisia resursseja.
 */
export const getItemDetails = (id: string): Resource | null => {
  if (!id) return null;

  // Erikoistapaus: Kolikot
  if (id === 'coins') {
    return { 
      id: 'coins', 
      name: 'Coins', 
      value: 1, 
      icon: '/assets/ui/coins.png', 
      rarity: 'common' 
    } as Resource;
  }

  const baseId = getBaseId(id);
  const enchantLevel = getEnchantLevel(id);
  let foundItem: Partial<Resource> | null = null;

  // 1. Dynaaminen maailmaloot (Dust, Gem, Elite)
  if (baseId.includes('_basic') || baseId.includes('_rare') || baseId.includes('_exotic')) {
    const parts = baseId.split('_');
    const worldNameRaw = parts[0];
    const worldNameDisplay = worldNameRaw.charAt(0).toUpperCase() + worldNameRaw.slice(1);
    const type = parts[1];

    const typeConfigs: Record<string, { suffix: string, val: number, rar: Resource['rarity'], col: string }> = {
      basic: { suffix: 'Dust', val: 10, rar: 'common', col: 'text-slate-400' },
      rare: { suffix: 'Gem', val: 100, rar: 'rare', col: 'text-cyan-400' },
      exotic: { suffix: 'Elite', val: 1000, rar: 'legendary', col: 'text-orange-500' }
    };

    const config = typeConfigs[type];
    if (config) {
      foundItem = {
        name: `${worldNameDisplay} ${config.suffix}`,
        value: config.val,
        rarity: config.rar,
        color: config.col,
        icon: `/assets/lootpoolszones/${baseId}.png`,
        description: `${config.rar === 'common' ? 'Common' : config.rar === 'rare' ? 'Rare' : 'Exotic'} essence from ${worldNameDisplay}.`
      };
    }
  }
  // 2. Boss-avaimet
  else if (baseId.startsWith('bosskey_w')) {
    const worldNum = baseId.replace('bosskey_w', '');
    foundItem = {
      name: `World ${worldNum} Key`,
      value: 500,
      color: 'text-yellow-500',
      icon: `/assets/items/bosskey/${baseId}.png`,
      description: 'Access to world boss.',
      rarity: 'rare'
    };
  }
  // 3. Normaali pelidata (taidot)
  else {
    for (const skill of Object.keys(GAME_DATA)) {
      const item = GAME_DATA[skill].find(i => i.id === baseId);
      if (item) {
        foundItem = item;
        break;
      }
    }
  }

  // Jos item löytyi, rakennetaan lopullinen Resource-olio
  if (foundItem) {
    const itemWithId = { ...foundItem, id: id } as Resource;
    
    // Käsitellään Enchanting, jos taso > 0
    if (enchantLevel > 0) {
      return applyEnchantStats(itemWithId, enchantLevel);
    }
    return itemWithId;
  }

  return null;
};