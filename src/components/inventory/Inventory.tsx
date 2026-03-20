import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import EquipmentPanel from "./EquipmentPanel";
import StatsPanel from "./StatsPanel";
import InventoryGrid, { type InventoryItem } from "./InventoryGrid";
import ItemDetails from "./ItemDetails";
import InventoryControls from "./InventoryControls";
import { useInventoryFiltering } from "./useInventoryFiltering";

interface Props {
  onSellClick: (itemId: string) => void;
}

export default function Inventory({ onSellClick }: Props) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [mobileTab, setMobileTab] = useState<"gear" | "bag">("bag");

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
    <div className="flex flex-col h-full overflow-hidden relative bg-app-base text-left">
      {/* MOBIILI TABS: Emojit korvattu ikoneilla */}
      <div className="md:hidden flex p-2 bg-panel border-b border-border gap-2 shrink-0">
        <button
          onClick={() => setMobileTab("bag")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border ${
            mobileTab === "bag"
              ? "bg-accent/20 text-accent border-accent/40 shadow-inner"
              : "bg-app-base text-tx-muted border-border opacity-70"
          }`}
        >
          <img
            src="assets/ui/icon_inventory.png"
            className={`w-4 h-4 pixelated ${mobileTab !== "bag" && "grayscale opacity-50"}`}
            alt="Bag"
          />
          Backpack
        </button>
        <button
          onClick={() => setMobileTab("gear")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all border ${
            mobileTab === "gear"
              ? "bg-accent/20 text-accent border-accent/40 shadow-inner"
              : "bg-app-base text-tx-muted border-border opacity-70"
          }`}
        >
          <img
            src="assets/ui/icon_armor.png"
            className={`w-4 h-4 pixelated ${mobileTab !== "gear" && "grayscale opacity-50"}`}
            alt="Gear"
          />
          Loadout
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6 p-2 md:p-6 overflow-hidden relative">
        {/* VASEN SARAKE */}
        <div
          className={`w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0 pb-20 md:pb-0 ${
            mobileTab === "gear" ? "block" : "hidden md:flex"
          }`}
        >
          <EquipmentPanel />

          {selectedItem && (
            <div className="hidden md:block animate-in slide-in-from-left-4 duration-200">
              <ItemDetails
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onSell={handleSell}
                onEquip={() => handleEquip()}
              />
            </div>
          )}

          <StatsPanel />
        </div>

        {/* OIKEA SARAKE */}
        <div
          className={`w-full md:w-2/3 h-full overflow-hidden flex flex-col bg-panel border border-border rounded-xl shadow-lg relative ${
            mobileTab === "bag" ? "block" : "hidden md:flex"
          }`}
        >
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

      {/* MOBIILI POPUP */}
      {selectedItem && (
        <div className="md:hidden fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-base/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative w-full max-w-lg animate-in slide-in-from-bottom-8 duration-300">
            <ItemDetails
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onSell={handleSell}
              onEquip={() => handleEquip()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
