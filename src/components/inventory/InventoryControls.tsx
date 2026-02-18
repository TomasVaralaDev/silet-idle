import type { FilterType, SortType } from './useInventoryFiltering';

interface Props {
  activeFilter: FilterType;
  onSetFilter: (f: FilterType) => void;
  activeSort: SortType;
  sortDesc: boolean;
  onToggleSort: (s: SortType) => void;
}

export default function InventoryControls({ 
  activeFilter, onSetFilter, activeSort, sortDesc, onToggleSort 
}: Props) {
  
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'equipment', label: 'Gear' },
    { id: 'consumable', label: 'Consumables' },
    { id: 'material', label: 'Mats' },
  ];

  const sorts: { id: SortType; label: string }[] = [
    { id: 'rarity', label: 'Rarity' },
    { id: 'level', label: 'Level' },
    { id: 'amount', label: 'Amount' },
    { id: 'value', label: 'Value' },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 border-b border-slate-800 bg-slate-900/50">
      
      {/* TABS (Filtering) */}
      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => onSetFilter(f.id)}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all
              ${activeFilter === f.id 
                ? 'bg-slate-700 text-white shadow' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SORTING (Buttons) */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sort By:</span>
        <div className="flex gap-2">
          {sorts.map(s => (
            <button
              key={s.id}
              onClick={() => onToggleSort(s.id)}
              className={`text-[10px] uppercase font-bold px-2 py-1 rounded border transition-all flex items-center gap-1
                ${activeSort === s.id 
                  ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' 
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'
                }
              `}
            >
              {s.label}
              {activeSort === s.id && (
                <span className="text-[8px]">{sortDesc ? '↓' : '↑'}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}