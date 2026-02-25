import { useState } from "react";
import { useGameStore } from "../store/useGameStore";

import EquipmentPanel from "./inventory/EquipmentPanel";
import StatsPanel from "./inventory/StatsPanel";
import InventoryGrid, { type InventoryItem } from "./inventory/InventoryGrid";
import ItemDetails from "./inventory/ItemDetails";
import InventoryControls from "./inventory/InventoryControls";

import { useInventoryFiltering } from "./inventory/useInventoryFiltering";

interface Props {
  onSellClick: (itemId: string) => void;
}

export default function Inventory({ onSellClick }: Props) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const {
    items,
    filter,
    setFilter,
    sortBy,
    sortDesc,
    toggleSort,
    searchQuery,
    setSearchQuery,
  } = useInventoryFiltering();

  const equipItem = useGameStore((state) => state.equipItem);

  const handleEquip = (itemId?: string) => {
    const id = itemId || selectedItem?.id;
    if (!id) return;

    equipItem(id);
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
    <div className="flex flex-col md:flex-row h-full gap-6 p-6 overflow-hidden relative bg-app-base">
      {/* VASEN SARAKE: Varusteet, Tiedot ja Statsit */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0">
        <EquipmentPanel />

        {selectedItem && (
          <ItemDetails
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onSell={handleSell}
            onEquip={() => handleEquip()}
          />
        )}

        <StatsPanel />
      </div>

      {/* OIKEA SARAKE: Kontrollit ja Tavaraluettelo */}
      <div className="w-full md:w-2/3 h-full overflow-hidden flex flex-col bg-panel border border-border rounded-xl shadow-lg">
        <InventoryControls
          activeFilter={filter}
          onSetFilter={setFilter}
          activeSort={sortBy}
          sortDesc={sortDesc}
          onToggleSort={toggleSort}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <InventoryGrid
          items={items}
          onSellClick={onSellClick}
          onItemClick={handleItemClick}
          onRightClick={handleEquip}
        />
      </div>
    </div>
  );
}
