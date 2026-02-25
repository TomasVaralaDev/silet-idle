import { useGameStore } from "../../store/useGameStore";
import { getItemById } from "../../utils/itemUtils";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function InventorySelector({ selectedId, onSelect }: Props) {
  const inventory = useGameStore((state) => state.inventory);
  const availableItems = Object.entries(inventory).filter(
    ([, count]) => count > 0
  );

  return (
    <div className="flex flex-col h-full bg-app-base/50 rounded-lg border border-border overflow-hidden shadow-inner">
      {/* Table Header */}
      <div className="flex items-center px-4 py-2 bg-panel/50 border-b border-border text-[9px] font-bold text-tx-muted uppercase tracking-widest">
        <span className="flex-1 text-left">Inventory</span>
        <span className="w-20 text-right">Qty</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {availableItems.map(([id, count]) => {
          const item = getItemById(id);
          if (!item) return null;
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
                src={item.icon}
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
                    item.color || "text-tx-main"
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-[9px] text-tx-muted/60 uppercase font-mono tracking-tighter">
                  {item.rarity}
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

        {availableItems.length === 0 && (
          <div className="py-20 text-center text-tx-muted/30 text-[10px] uppercase font-mono tracking-widest">
            Relay database empty
          </div>
        )}
      </div>
    </div>
  );
}
