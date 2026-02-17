import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { 
  getEnchantLevel, 
  getNextEnchantId, 
  getEnchantCost, 
  getSuccessChance, 
  MAX_ENCHANT_LEVEL 
} from '../../utils/enchanting';
import { getItemDetails } from '../../data';

export interface EnchantingSlice {
  attemptEnchant: (targetItemId: string, scrollId: string) => void;
}

export const createEnchantingSlice: StateCreator<FullStoreState, [], [], EnchantingSlice> = (set, get) => ({
  attemptEnchant: (targetItemId, scrollId) => {
    const { inventory, coins, equipment, emitEvent } = get();

    // 1. VALIDIOINTI
    const itemDetails = getItemDetails(targetItemId);
    if (!itemDetails) {
      emitEvent('error', 'Item data not found.');
      return;
    }

    const currentLevel = getEnchantLevel(targetItemId);
    if (currentLevel >= MAX_ENCHANT_LEVEL) {
      emitEvent('warning', 'Item is already at max level.');
      return;
    }

    if (!inventory[scrollId] || inventory[scrollId] < 1) {
      emitEvent('error', 'You do not have the required scroll.', '/assets/ui/icon_locked.png');
      return;
    }

    const nextLevel = currentLevel + 1;
    const cost = getEnchantCost(nextLevel, itemDetails.value);
    
    const scrollTier = parseInt(scrollId.split('_').pop()?.replace('w', '') || '0');
    const successChance = getSuccessChance(currentLevel, scrollTier);

    if (coins < cost) {
      emitEvent('error', `Not enough coins! Need ${cost}.`, '/assets/ui/coins.png');
      return;
    }

    // 2. KULUTETAAN RESURSSIT
    const newInventory = { ...inventory };
    newInventory[scrollId] -= 1;
    if (newInventory[scrollId] <= 0) delete newInventory[scrollId];

    const newCoins = coins - cost;

    // 3. NOPANHEITTO (RNG Logic)
    const roll = Math.random() * 100;
    const isSuccess = roll <= successChance;

    // Päivitetään resurssit heti
    set({ inventory: newInventory, coins: newCoins });

    // 4. TULOSKÄSITTELY
    if (isSuccess) {
      // --- ONNISTUMINEN ---
      const newId = getNextEnchantId(targetItemId);
      const newEquipment = { ...equipment };

      let updated = false;
      (Object.keys(newEquipment) as Array<keyof typeof equipment>).forEach(slot => {
        if (newEquipment[slot] === targetItemId) {
          newEquipment[slot] = newId;
          updated = true;
        }
      });

      if (updated) {
        set({ equipment: newEquipment });
        // KORJATTU VIESTI:
        emitEvent('success', 'Enchantment successful', '/assets/ui/icon_check.png');
      } else {
        emitEvent('error', 'Error finding equipped item to update.');
      }

    } else {
      // --- EPÄONNISTUMINEN ---
      // KORJATTU VIESTI:
      emitEvent('error', 'Enchantment failed', '/assets/ui/icon_fail.png');
    }
  }
});