import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
// POISTETTU: import type { EquipmentSlot } from '../types'; <--- TÄMÄ RIVI POIS

// Komponentit
import EquipmentPanel from './inventory/EquipmentPanel';
import StatsPanel from './inventory/StatsPanel';
import InventoryGrid, { type InventoryItem } from './inventory/InventoryGrid';
import ItemDetails from './inventory/ItemDetails';
import InventoryControls from './inventory/InventoryControls';

// Hook
import { useInventoryFiltering } from './inventory/useInventoryFiltering';

interface Props {
  onSellClick: (itemId: string) => void;
}

export default function Inventory({ onSellClick }: Props) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const { items, filter, setFilter, sortBy, sortDesc, toggleSort } = useInventoryFiltering();

  const equipItem = useGameStore(state => state.equipItem);

  const handleEquip = () => {
    if (!selectedItem) return;
    
    // Store päättelee itse itemin tyypistä mihin se menee
    equipItem(selectedItem.id);
    
    setSelectedItem(null); 
  };

  const handleSell = () => {
    if (!selectedItem) return;
    onSellClick(selectedItem.id);
    setSelectedItem(null);
  };

  const handleItemClick = (item: InventoryItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 p-6 overflow-hidden relative">
      
      {/* VASEN PUOLI (1/3) */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0">
        <EquipmentPanel />
        
        {selectedItem && (
          <ItemDetails 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)}
            onSell={handleSell}
            onEquip={handleEquip}
          />
        )}

        <StatsPanel />
      </div>

      {/* OIKEA PUOLI (2/3) - Inventory Container */}
      <div className="w-full md:w-2/3 h-full overflow-hidden flex flex-col bg-slate-900 border border-slate-800 rounded-xl">
        
        <InventoryControls 
          activeFilter={filter}
          onSetFilter={setFilter}
          activeSort={sortBy}
          sortDesc={sortDesc}
          onToggleSort={toggleSort}
        />

        <InventoryGrid 
          items={items}
          onSellClick={onSellClick} 
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}