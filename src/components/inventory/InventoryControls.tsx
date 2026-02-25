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
  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "equipment", label: "Gear" },
    { id: "consumable", label: "Consumables" },
    { id: "material", label: "Mats" },
  ];

  const sorts: { id: SortType; label: string }[] = [
    { id: "rarity", label: "Rarity" },
    { id: "level", label: "Level" },
    { id: "amount", label: "Amount" },
    { id: "value", label: "Value" },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 border-b border-border bg-panel/50">
      {/* SEARCH BAR (UUSI) */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items..."
          className="w-full bg-app-base border border-border rounded-lg py-2 pl-9 pr-4 text-sm text-tx-main placeholder-tx-muted focus:outline-none focus:border-accent/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-2.5 text-tx-muted hover:text-tx-main"
          >
            ✕
          </button>
        )}
      </div>

      {/* TABS (Filtering) */}
      <div className="flex bg-app-base p-1 rounded-lg border border-border">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onSetFilter(f.id)}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all
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

      {/* SORTING */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-tx-muted font-bold uppercase tracking-widest">
          Sort By:
        </span>
        <div className="flex gap-2">
          {sorts.map((s) => (
            <button
              key={s.id}
              onClick={() => onToggleSort(s.id)}
              className={`text-[10px] uppercase font-bold px-2 py-1 rounded border transition-all flex items-center gap-1
                ${
                  activeSort === s.id
                    ? "bg-success/20 text-success border-success/50"
                    : "bg-panel text-tx-muted border-border hover:border-border-hover"
                }
              `}
            >
              {s.label}
              {activeSort === s.id && (
                <span className="text-[8px]">{sortDesc ? "↓" : "↑"}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
