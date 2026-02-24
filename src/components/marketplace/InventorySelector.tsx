import { useGameStore } from '../../store/useGameStore';
import { getItemById } from '../../utils/itemUtils';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function InventorySelector({ selectedId, onSelect }: Props) {
  const inventory = useGameStore((state) => state.inventory);
  const availableItems = Object.entries(inventory).filter(
    ([, count]) => count > 0,
  );

  return (
    <div className="flex flex-col h-full bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center px-4 py-2 bg-slate-900/50 border-b border-slate-800 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        <span className="flex-1">Inventory</span>
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
              className={`w-full flex items-center gap-4 py-3 px-4 border-b border-white/5 transition-all group ${
                isSelected
                  ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500'
                  : 'hover:bg-white/5 border-l-2 border-l-transparent'
              }`}
            >
              <img
                src={item.icon}
                className={`w-8 h-8 pixelated ${isSelected ? 'brightness-125' : 'brightness-75 opacity-70'}`}
                alt=""
              />
              <div className="flex flex-col items-start flex-1 overflow-hidden">
                <span
                  className={`text-xs font-bold truncate ${item.color || 'text-slate-300'}`}
                >
                  {item.name}
                </span>
                <span className="text-[9px] text-slate-600 uppercase font-mono">
                  {item.rarity}
                </span>
              </div>
              <div className="w-20 text-right shrink-0">
                <span
                  className={`font-mono text-xs font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}
                >
                  {count.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}

        {availableItems.length === 0 && (
          <div className="py-20 text-center text-slate-700 text-[10px] uppercase font-mono tracking-widest">
            Relay database empty
          </div>
        )}
      </div>
    </div>
  );
}
