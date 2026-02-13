import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';
import type { InventoryItem } from './InventoryGrid';

export type SortType = 'rarity' | 'level' | 'amount' | 'value';
export type FilterType = 'all' | 'equipment' | 'consumable' | 'material';

const RARITY_WEIGHTS: Record<string, number> = {
  legendary: 4,
  epic: 3,
  rare: 2,
  uncommon: 1,
  common: 0
};

export function useInventoryFiltering() {
  const inventory = useGameStore(state => state.inventory);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('rarity');
  const [sortDesc, setSortDesc] = useState(true); // Descending (Suurin ensin) oletuksena

  // 1. Muunnetaan inventory-objekti listaksi
  const rawItems = useMemo(() => {
    return Object.entries(inventory)
      .map(([id, count]) => {
        const details = getItemDetails(id);
        if (!details) return null;
        return { ...details, count } as InventoryItem;
      })
      .filter((item): item is InventoryItem => item !== null && item.name !== undefined);
  }, [inventory]);

  // 2. Suodatetaan ja lajitellaan (Memoized performance)
  const processedItems = useMemo(() => {
    let result = [...rawItems];

    // --- FILTERING ---
    if (filter === 'equipment') {
      result = result.filter(i => i.slot !== undefined);
    } else if (filter === 'consumable') {
      result = result.filter(i => i.healing !== undefined || i.category === 'Food');
    } else if (filter === 'material') {
      result = result.filter(i => !i.slot && !i.healing && i.category !== 'Food');
    }

    // --- SORTING ---
    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortBy) {
        case 'rarity':
          valA = RARITY_WEIGHTS[a.rarity] || 0;
          valB = RARITY_WEIGHTS[b.rarity] || 0;
          break;
        case 'level':
          valA = a.level || 0;
          valB = b.level || 0;
          break;
        case 'amount':
          valA = a.count;
          valB = b.count;
          break;
        case 'value':
          valA = a.value;
          valB = b.value;
          break;
      }

      // Toissijainen lajittelu aina nimen mukaan, jotta järjestys ei hypi
      if (valA === valB) {
        return a.name.localeCompare(b.name);
      }

      return sortDesc ? valB - valA : valA - valB;
    });

    return result;
  }, [rawItems, filter, sortBy, sortDesc]);

  const toggleSort = (type: SortType) => {
    if (sortBy === type) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(type);
      setSortDesc(true);
    }
  };

  return {
    items: processedItems,
    filter,
    setFilter,
    sortBy,
    sortDesc,
    toggleSort
  };
}