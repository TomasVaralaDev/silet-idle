import { useState } from 'react';
import { getItemDetails } from '../data';
import type { GameState, EquipmentSlot } from '../types';
import QuantityModal from './QuantityModal';

interface InventoryProps {
  inventory: GameState['inventory'];
  equipment: GameState['equipment'];
  equippedFood: GameState['equippedFood'];
  combatSettings: GameState['combatSettings'];
  onSellClick: (itemId: string) => void;
  onEquip: (itemId: string, slot: EquipmentSlot) => void;
  onEquipFood: (itemId: string, amount: number) => void;
  onUnequip: (slot: string) => void;
  onUnequipFood: () => void;
  onUpdateAutoEat: (threshold: number) => void;
}

type FilterType = 'all' | 'gear' | 'resources' | 'food' | 'misc';

export default function Inventory({ 
  inventory, equipment, equippedFood, combatSettings, 
  onSellClick, onEquip, onEquipFood, onUnequip, onUnequipFood, onUpdateAutoEat 
}: InventoryProps) {
  
  const [foodSelectionId, setFoodSelectionId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState(''); // UUSI: Haku-state

  const getItemCategory = (item: { id: string; slot?: string; healing?: number }): FilterType => {
    if (item.slot && item.slot !== 'food') return 'gear';
    if (item.healing || item.slot === 'food') return 'food';
    if (item.id.includes('log') || item.id.includes('ore') || item.id.includes('fish_') || item.id.includes('crop')) return 'resources';
    return 'misc';
  };

  const inventoryItems = Object.entries(inventory)
    .map(([id, count]) => {
      const details = getItemDetails(id);
      if (!details) return null;
      return { id, count, ...details };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .filter((item) => {
      // 1. Kategoria-suodatus
      const matchesCategory = activeFilter === 'all' || getItemCategory(item) === activeFilter;
      // 2. Haku-suodatus (Case insensitive)
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

  const playerStats = { attack: 0, defense: 0 };

  Object.values(equipment).forEach((itemId) => {
    if (itemId) {
      const item = getItemDetails(itemId);
      if (item && item.stats) {
        playerStats.attack += item.stats.attack || 0;
        playerStats.defense += item.stats.defense || 0;
      }
    }
  });

  // --- EQUIPMENT SLOT RENDERER ---
  const renderSlot = (slot: string, placeholderIcon: string) => {
    const itemId = equipment[slot as keyof typeof equipment];
    const item = itemId ? getItemDetails(itemId) : null;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg relative aspect-square shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] overflow-hidden group">
        <span className={`absolute top-1.5 left-2 text-[10px] uppercase font-bold text-slate-600 tracking-wider pointer-events-none z-10 transition-opacity ${item ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          {slot}
        </span>
        
        {item ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
             <img src={item.icon} alt={item.name} className="w-16 h-16 pixelated drop-shadow-2xl hover:scale-110 transition-transform duration-200" />
             
             <div className="absolute bottom-0 w-full bg-slate-950/90 text-[10px] font-bold text-slate-300 text-center py-1 truncate border-t border-slate-800">
               {item.name}
             </div>

             <button 
               onClick={() => onUnequip(slot)}
               className="absolute top-1 right-1 bg-red-950/80 text-red-500 hover:text-white border border-red-900 rounded p-1 transition-colors z-20 opacity-0 group-hover:opacity-100"
               title="Unequip"
             >
               <span className="text-xs font-bold leading-none">✕</span>
             </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={placeholderIcon} alt="Empty Slot" className="w-12 h-12 opacity-10 pixelated grayscale" />
          </div>
        )}
      </div>
    );
  };

  const renderFoodSlot = () => {
    const item = equippedFood ? getItemDetails(equippedFood.itemId) : null;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg relative aspect-square shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] group overflow-visible">
        <span className={`absolute top-1.5 left-2 text-[10px] uppercase font-bold text-slate-600 tracking-wider pointer-events-none z-10 transition-opacity ${item ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          Food
        </span>
        
        <div className="absolute -top-2 -right-2 flex flex-col gap-1 items-end z-30 opacity-0 group-hover:opacity-100 transition-opacity">
          {item && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUnequipFood(); }}
              className="bg-slate-800 text-red-500 hover:text-white border border-slate-600 rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
              title="Unequip Food"
            >✕</button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full w-6 h-6 flex items-center justify-center shadow-lg ${showSettings ? 'text-cyan-400 border-cyan-500' : 'text-slate-400'}`}
            title="Settings"
          >⚙️</button>
        </div>

        {showSettings && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-cyan-900/50 p-3 shadow-2xl z-50 rounded-lg">
            <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-1">
              <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Auto-Eat</h4>
              <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <input 
                type="range" min="0" max="95" step="5"
                value={combatSettings.autoEatThreshold}
                onChange={(e) => onUpdateAutoEat(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-xs font-mono font-bold text-cyan-400 w-8 text-right">{combatSettings.autoEatThreshold}%</span>
            </div>
          </div>
        )}

        {item ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
             <div className="relative">
                <img src={item.icon} alt={item.name} className="w-16 h-16 pixelated drop-shadow-md hover:scale-110 transition-transform duration-200" />
                <span className="absolute -bottom-1 -right-2 bg-slate-950 text-white text-xs font-bold px-1.5 rounded border border-slate-600 shadow-md font-mono">
                  {equippedFood?.count}
                </span>
             </div>
             <div className="absolute bottom-0 w-full bg-slate-950/90 text-[10px] font-bold text-center py-1 truncate text-emerald-400 border-t border-slate-800">
               +{item.healing} HP
             </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/assets/ui/slot_food.png" alt="Empty" className="w-12 h-12 opacity-10 pixelated grayscale" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col xl:flex-row gap-6 h-full overflow-hidden relative bg-slate-950">
      
      {foodSelectionId && (
        <QuantityModal 
          itemId={foodSelectionId}
          maxAmount={Math.min(999, inventory[foodSelectionId] || 0)} 
          title={`Equip: ${getItemDetails(foodSelectionId)?.name}`}
          onClose={() => setFoodSelectionId(null)}
          onConfirm={(amount) => {
            onEquipFood(foodSelectionId, amount);
            setFoodSelectionId(null);
          }}
        />
      )}

      {/* --- LEFT COLUMN --- */}
      <div className="w-full xl:w-[420px] flex-shrink-0 flex flex-col gap-4">
        
        {/* Equipment */}
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-lg flex flex-col">
          <h2 className="text-sm font-bold mb-5 text-slate-300 flex items-center gap-3 uppercase tracking-widest border-b border-slate-800 pb-3">
            <img src="/assets/ui/icon_equipment.png" alt="Equipment" className="w-5 h-5 pixelated opacity-70" />
            <span>Active Modules</span>
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-start-2">{renderSlot('head', '/assets/ui/slot_head.png')}</div>
            <div className="col-start-1 row-start-2">{renderSlot('weapon', '/assets/ui/slot_weapon.png')}</div>
            <div className="col-start-2 row-start-2">{renderSlot('body', '/assets/ui/slot_body.png')}</div>
            <div className="col-start-3 row-start-2">{renderSlot('shield', '/assets/ui/slot_shield.png')}</div>
            <div className="col-start-2 row-start-3">{renderSlot('legs', '/assets/ui/slot_legs.png')}</div>
            <div className="col-start-3 row-start-3">{renderFoodSlot()}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 shadow-lg">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">System Output</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-orange-950/30 rounded border border-orange-900/30">
                  <img src="/assets/skills/attack.png" className="w-4 h-4 pixelated" alt="Attack" />
                </div>
                <span className="text-slate-300 text-sm font-medium">Kinetic Force</span>
              </div>
              <span className="font-mono text-lg font-bold text-orange-400">+{playerStats.attack}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-950/30 rounded border border-blue-900/30">
                  <img src="/assets/skills/defense.png" className="w-4 h-4 pixelated" alt="Defense" />
                </div>
                <span className="text-slate-300 text-sm font-medium">Structure Integrity</span>
              </div>
              <span className="font-mono text-lg font-bold text-blue-400">+{playerStats.defense}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: BACKPACK --- */}
      <div className="flex-1 bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Header & Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-5 gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-3 uppercase tracking-widest">
            <img src="/assets/ui/icon_inventory.png" alt="Backpack" className="w-6 h-6 pixelated opacity-70" />
            <span>Fragment Storage</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* UUSI: SEARCH BAR */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search fragments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all font-mono"
              />
              <span className="absolute right-3 top-1.5 text-slate-600 text-xs">🔍</span>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-1">
              {(['all', 'gear', 'resources', 'food', 'misc'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all border
                    ${activeFilter === filter 
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-800 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-600'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Grid Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {inventoryItems.length === 0 ? (
            <div className="text-center text-slate-700 italic py-20 flex flex-col items-center gap-4">
              <img src="/assets/ui/icon_inventory.png" className="w-20 h-20 opacity-5 grayscale pixelated" alt="Empty" />
              <p className="text-sm uppercase tracking-widest font-bold">Storage Empty</p>
              {searchQuery && <p className="text-xs text-slate-600">No results found for "{searchQuery}"</p>}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {inventoryItems.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 p-2 rounded-lg relative group hover:border-slate-600 transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-center text-center min-h-[140px]">
                  
                  <div className="absolute top-2 right-2 z-10">
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded shadow-sm">
                      x{item.count}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center w-full py-4">
                    <img src={item.icon} alt={item.name} className="w-14 h-14 pixelated drop-shadow-lg" />
                  </div>
                  
                  <div className="w-full mt-1 bg-slate-900/50 p-2 rounded border border-slate-800/50">
                    <div className="text-xs font-bold text-slate-200 leading-tight mb-1 truncate">{item.name}</div>
                    
                    <div className="flex items-center justify-center gap-1.5 mb-2 min-h-[16px]">
                      {item.stats?.attack && <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/40 px-1.5 rounded border border-orange-900/30">FRC+{item.stats.attack}</span>}
                      {item.stats?.defense && <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/40 px-1.5 rounded border border-blue-900/30">DEF+{item.stats.defense}</span>}
                      {item.healing && <span className="text-[10px] font-mono font-bold text-green-400 bg-green-950/40 px-1.5 rounded border border-green-900/30">HP+{item.healing}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {item.healing ? (
                        <button onClick={() => setFoodSelectionId(item.id)} className="bg-emerald-900/30 hover:bg-emerald-600 text-emerald-300 border border-emerald-900 text-[10px] font-bold py-1 rounded uppercase tracking-wider transition-colors">Load</button>
                      ) : item.slot ? (
                        <button onClick={() => onEquip(item.id, item.slot as EquipmentSlot)} className="bg-cyan-900/30 hover:bg-cyan-600 text-cyan-300 border border-cyan-900 text-[10px] font-bold py-1 rounded uppercase tracking-wider transition-colors">Install</button>
                      ) : (
                        <div className="col-span-1"></div>
                      )}
                      
                      <button onClick={() => onSellClick(item.id)} className="bg-slate-800 hover:bg-amber-900/40 hover:text-amber-200 text-slate-400 border border-slate-700 text-[10px] font-bold py-1 rounded uppercase tracking-wider transition-colors">Sell</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}