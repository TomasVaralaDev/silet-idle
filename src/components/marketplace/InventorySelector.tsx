import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemById } from "../../utils/itemUtils";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function InventorySelector({ selectedId, onSelect }: Props) {
  const inventory = useGameStore((state) => state.inventory);
  const [searchQuery, setSearchQuery] = useState("");

  const availableItems = Object.entries(inventory)
    .map(([id, count]) => ({ id, count, item: getItemById(id) }))
    .filter(({ count, item }) => {
      // 1. Perustarkistukset: onko item olemassa, onko sitä ja onko se uniikki
      if (!item || count <= 0 || item.isUnique) return false;

      // 2. KORJAUS: Varmistetaan, että item.name on olemassa ennen hakua
      const itemName = item.name || "";
      const query = searchQuery.toLowerCase();

      if (searchQuery && !itemName.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });

  return (
    <div className="flex flex-col h-full bg-app-base/50 rounded-lg border border-border overflow-hidden shadow-inner">
      {/* Search Input */}
      <div className="p-3 bg-panel/30 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-base border border-border/50 rounded-sm px-3 py-2 pl-8 text-xs text-tx-main focus:outline-none focus:border-accent transition-colors font-mono placeholder:text-tx-muted/50"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted/50 flex items-center justify-center">
            {/* SVG Suurennuslasi */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center px-4 py-2 bg-panel/50 border-b border-border text-[9px] font-bold text-tx-muted uppercase tracking-widest shrink-0">
        <span className="flex-1 text-left">Inventory</span>
        <span className="w-20 text-right">Qty</span>
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {availableItems.map(({ id, count, item }) => {
          const isSelected = selectedId === id;

          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`w-full flex items-center gap-4 py-3 px-4 border-b border-border/10 transition-all group ${
                isSelected
                  ? "bg-accent/10 border-l-2 border-l-accent"
                  : "hover:bg-panel-hover/20 border-l-2 border-l-transparent"
              }`}
            >
              <img
                src={item!.icon}
                className={`w-8 h-8 pixelated transition-all duration-300 ${
                  isSelected
                    ? "brightness-125 scale-110"
                    : "brightness-75 opacity-70 group-hover:opacity-100 group-hover:brightness-100"
                }`}
                alt=""
              />
              <div className="flex flex-col items-start flex-1 min-w-0 overflow-hidden text-left">
                <span
                  className={`text-xs font-bold truncate w-full ${
                    item!.color || "text-tx-main"
                  }`}
                >
                  {item!.name}
                </span>
                <span className="text-[9px] text-tx-muted/60 uppercase font-mono tracking-tighter">
                  {item!.rarity}
                </span>
              </div>
              <div className="w-20 text-right shrink-0">
                <span
                  className={`font-mono text-xs font-bold transition-colors ${
                    isSelected ? "text-accent" : "text-tx-muted"
                  }`}
                >
                  {count.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}

        {/* Empty States */}
        {availableItems.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            {/* SVG Tyhjä laatikko / Arkisto */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-12 h-12 opacity-20 text-tx-muted"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
            <div className="text-tx-muted/40 text-[10px] uppercase font-mono tracking-widest">
              {searchQuery ? "No matching resources" : "Relay database empty"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
