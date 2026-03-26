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
  // Local state for tracking the currently inspected item and mobile view navigation
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [mobileTab, setMobileTab] = useState<"gear" | "bag">("bag");

  // Custom hook manages filtering, sorting, and search logic to keep this view clean
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

  // Equip logic: Handles both direct clicks and secondary actions
  const handleEquip = (itemId?: string) => {
    const id = itemId || selectedItem?.id;
    if (!id) return;
    equipItem(id);
    setSelectedItem(null); // Close details after equipping
  };

  const handleSell = () => {
    if (!selectedItem) return;
    onSellClick(selectedItem.id);
    setSelectedItem(null); // Close details before opening sell modal
  };

  // Toggle selection: Clicking the same item twice deselects it
  const handleItemClick = (item: InventoryItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-app-base text-left">
      {
        // Mobile Tab Navigation: Only visible on small screens to toggle between Gear and Backpack
      }
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

      {
        // Main Container:
        // Mobile/Tablet (< lg): Vertical flex-col layout with scrolling.
        // Desktop (>= lg): Horizontal flex-row layout with fixed viewport.
      }
      <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 p-2 lg:p-6 overflow-y-auto lg:overflow-hidden relative custom-scrollbar">
        {
          // Left Column (Desktop) / Top Section (Tablet): Active Loadout and Stats
        }
        <div
          className={`w-full lg:w-1/3 flex flex-col gap-4 shrink-0 pb-4 lg:pb-0 overflow-y-visible lg:overflow-y-auto custom-scrollbar ${
            mobileTab === "gear" ? "flex" : "hidden md:flex"
          }`}
        >
          <EquipmentPanel />

          {
            // Desktop-only inline item details for quick inspection
          }
          {selectedItem && (
            <div className="hidden lg:block animate-in slide-in-from-left-4 duration-200">
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

        {
          // Right Column (Desktop) / Bottom Section (Tablet): Item Grid and Controls
        }
        <div
          className={`w-full lg:w-2/3 min-h-[60vh] lg:min-h-0 lg:h-full overflow-hidden flex flex-col bg-panel border border-border rounded-xl shadow-lg relative shrink-0 lg:shrink ${
            mobileTab === "bag" ? "flex" : "hidden md:flex"
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

      {
        // Mobile/Tablet Modal Overlay: Triggered when an item is selected for inspection
      }
      {selectedItem && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
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
