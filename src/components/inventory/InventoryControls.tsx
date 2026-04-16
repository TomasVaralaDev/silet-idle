import type { FilterType, SortType } from "./useInventoryFiltering";

interface Props {
  activeFilter: FilterType;
  onSetFilter: (f: FilterType) => void;
  activeSort: SortType;
  sortDesc: boolean;
  onToggleSort: (s: SortType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function InventoryControls({
  activeFilter,
  onSetFilter,
  activeSort,
  sortDesc,
  onToggleSort,
  searchQuery,
  onSearchChange,
}: Props) {
  // Available filter categories for the backpack view
  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "weapons", label: "Weapons" },
    { id: "armor", label: "Armor" },
    { id: "runes", label: "Runes" },
    { id: "pouches", label: "Pouches" },
    { id: "potions", label: "Potions" },
    { id: "materials", label: "Mats" },
    { id: "skills", label: "Skills" },
    { id: "misc", label: "Misc" },
  ];

  // Sorting metrics available for organizing the grid
  const sorts: { id: SortType; label: string }[] = [
    { id: "rarity", label: "Rarity" },
    { id: "level", label: "Level" },
    { id: "amount", label: "Qty" },
    { id: "value", label: "Value" },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 border-b border-border bg-panel/50">
      {
        // Search bar with clear button
      }
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted/50 flex items-center justify-center pointer-events-none">
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
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items..."
          className="w-full bg-app-base border border-border rounded-lg py-2 pl-9 pr-8 text-sm text-tx-main placeholder-tx-muted focus:outline-none focus:border-accent/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-tx-muted hover:text-tx-main transition-colors text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {
        // Scrollable category filter tabs
      }
      <div className="flex overflow-x-auto pb-1 custom-scrollbar scrollbar-hide">
        <div className="flex bg-app-base p-1 rounded-lg border border-border min-w-max">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onSetFilter(f.id)}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all
                ${
                  activeFilter === f.id
                    ? "bg-panel-hover text-tx-main shadow"
                    : "text-tx-muted hover:text-tx-main hover:bg-panel"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {
        // Sorting controls with direction indicators
      }
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] text-tx-muted font-bold uppercase tracking-widest">
          Sort:
        </span>
        <div className="flex gap-1.5">
          {sorts.map((s) => (
            <button
              key={s.id}
              onClick={() => onToggleSort(s.id)}
              className={`text-[9px] uppercase font-bold px-2 py-1 rounded border transition-all flex items-center gap-1
                ${activeSort === s.id ? "bg-success/20 text-success border-success/30" : "bg-panel text-tx-muted border-border hover:border-border-hover"}
              `}
            >
              {s.label}
              {activeSort === s.id && (
                <span className="text-[8px] opacity-70">
                  {sortDesc ? "↓" : "↑"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
