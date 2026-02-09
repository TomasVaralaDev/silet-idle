import { useState } from 'react';
import { getItemDetails } from '../data';
import type { GameState, EquipmentSlot, Resource } from '../types';

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

export default function Inventory({ 
  inventory, 
  equipment, 
  equippedFood,
  combatSettings,
  onSellClick, 
  onEquip, 
  onEquipFood,
  onUnequip,
  onUnequipFood,
  onUpdateAutoEat
}: InventoryProps) {
  
  const [filter, setFilter] = useState<'all' | 'resources' | 'consumables' | 'equipment'>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'value' | 'amount'>('amount');

  // Helper to safely get resource item
  const getResource = (id: string): Resource | null => {
    const item = getItemDetails(id);
    return item as Resource;
  };

  const inventoryItems = Object.entries(inventory).map(([id, count]) => {
    const details = getResource(id);
    return details ? { ...details, count, id } : null;
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'equipment') return item.slot !== undefined && item.slot !== 'food';
    if (filter === 'consumables') return item.healing !== undefined;
    if (filter === 'resources') return !item.slot && !item.healing;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'amount') return b.count - a.count;
    if (sortOrder === 'value') return b.value - a.value;
    return a.name.localeCompare(b.name);
  });

  // KORJAUS 1: Tarkistetaan, ettei slot ole 'food' ennen equipment-objektin hakua
  const getEquippedItem = (slot: EquipmentSlot) => {
    if (slot === 'food') return null; // Food käsitellään erikseen
    
    // Type assertion: Tiedämme nyt varmasti, että slot on validi avain equipmentille
    const id = equipment[slot as keyof typeof equipment];
    
    if (!id) return null;
    return getResource(id);
  };

  const getEquippedFoodItem = () => {
    if (!equippedFood) return null;
    return getResource(equippedFood.itemId);
  };

  return (
    <div className="p-6 h-full flex flex-col md:flex-row gap-6 bg-slate-950 overflow-y-auto custom-scrollbar">
      
      {/* --- LEFT: EQUIPMENT & STATS --- */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
        
        {/* CHARACTER DOLL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Active Loadout</h3>
          
          <div className="relative w-full aspect-[3/4] bg-slate-950/50 rounded-lg border border-slate-800/50 mb-4 flex items-center justify-center">
             <img src="/assets/ui/character_silhouette.png" className="w-3/4 h-3/4 opacity-10 object-contain pixelated" alt="Silhouette" />
             
             {/* Slot Positions (Absolute) */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <EquipmentSlotBox item={getEquippedItem('head')} slot="head" onUnequip={() => onUnequip('head')} />
             </div>
             <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                <EquipmentSlotBox item={getEquippedItem('body')} slot="body" onUnequip={() => onUnequip('body')} />
             </div>
             <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                <EquipmentSlotBox item={getEquippedItem('legs')} slot="legs" onUnequip={() => onUnequip('legs')} />
             </div>
             <div className="absolute top-1/2 left-4 -translate-y-1/2">
                <EquipmentSlotBox item={getEquippedItem('weapon')} slot="weapon" onUnequip={() => onUnequip('weapon')} />
             </div>
             <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <EquipmentSlotBox item={getEquippedItem('shield')} slot="shield" onUnequip={() => onUnequip('shield')} />
             </div>
          </div>

          {/* COMBAT STATS SUMMARY */}
          <div className="grid grid-cols-2 gap-2 text-center">
             <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
               <span className="text-[10px] text-slate-500 font-bold uppercase block">Attack</span>
               <span className="text-orange-400 font-mono font-bold">
                 +{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.attack || 0) : 0), 0)}
               </span>
             </div>
             <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
               <span className="text-[10px] text-slate-500 font-bold uppercase block">Defense</span>
               <span className="text-cyan-400 font-mono font-bold">
                 +{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.defense || 0) : 0), 0)}
               </span>
             </div>
          </div>
        </div>

        {/* FOOD & AUTO-EAT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Consumables</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className={`w-12 h-12 rounded border-2 flex items-center justify-center cursor-pointer transition-all relative
              ${equippedFood ? 'bg-slate-800 border-green-700' : 'bg-slate-950 border-slate-800 border-dashed hover:border-slate-600'}`}
              onClick={onUnequipFood}
              title="Click to unequip food"
            >
              {equippedFood ? (
                <>
                  <img src={getEquippedFoodItem()?.icon} className="w-8 h-8 pixelated" alt="Food" />
                  <span className="absolute -bottom-2 -right-2 bg-slate-950 text-[10px] font-mono font-bold text-white px-1 rounded border border-slate-700">
                    {equippedFood.count}
                  </span>
                </>
              ) : (
                <span className="text-slate-700 text-xs">EMPTY</span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Auto-Eat Threshold</div>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={combatSettings.autoEatThreshold} 
                  onChange={(e) => onUpdateAutoEat(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="text-xs font-mono font-bold text-green-400 w-8 text-right">{combatSettings.autoEatThreshold}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- RIGHT: INVENTORY GRID --- */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        
        {/* TOOLBAR */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900 z-10">
          <div className="flex gap-2">
            {(['all', 'equipment', 'consumables', 'resources'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)} 
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all
                  ${filter === f 
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500/50' 
                    : 'text-slate-500 border-slate-700 hover:text-slate-300 hover:bg-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Sort:</span>
            <select 
              value={sortOrder} 
              // KORJAUS 2: Korvattu 'any' union-tyypillä
              onChange={(e) => setSortOrder(e.target.value as 'name' | 'value' | 'amount')}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs py-1 px-2 rounded outline-none focus:border-cyan-500"
            >
              <option value="amount">Amount</option>
              <option value="value">Value</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {sortedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <span className="text-4xl mb-2 opacity-50">📦</span>
              <p className="text-xs font-mono uppercase tracking-widest">Storage Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sortedItems.map((item) => (
                <div key={item.id} className="group relative bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-lg p-3 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  
                  {/* Top Stats (Values) */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-amber-500/80">{item.value}g</span>
                    {item.count > 1 && <span className="text-[10px] font-mono text-slate-500">x{item.count}</span>}
                  </div>

                  {/* Icon */}
                  <div className="flex-1 flex items-center justify-center mb-3">
                    <img src={item.icon} alt={item.name} className="w-10 h-10 pixelated drop-shadow-md group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Name & Type */}
                  <div className="text-center mb-3">
                    <h4 className={`text-xs font-bold leading-tight ${item.color} mb-0.5`}>{item.name}</h4>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">
                      {item.slot ? item.slot : item.healing ? 'Food' : 'Resource'}
                    </p>
                  </div>

                  {/* Item Specific Stats (Tooltip-ish info) */}
                  {(item.stats?.attack || item.stats?.defense || item.healing) && (
                    <div className="flex justify-center gap-1.5 mb-3">
                      {item.stats?.attack && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-orange-950/30 text-orange-400 rounded border border-orange-900/30">ATK {item.stats.attack}</span>}
                      {item.stats?.defense && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-cyan-950/30 text-cyan-400 rounded border border-cyan-900/30">DEF {item.stats.defense}</span>}
                      {item.healing && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-green-950/30 text-green-400 rounded border border-green-900/30">HP {item.healing}</span>}
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="mt-auto grid grid-cols-2 gap-1 pt-2 border-t border-slate-900">
                    <button 
                      onClick={() => onSellClick(item.id)} 
                      className="py-1.5 bg-slate-900 hover:bg-red-950/30 text-[9px] font-bold uppercase text-slate-400 hover:text-red-400 rounded transition-colors"
                    >
                      Sell
                    </button>
                    
                    {item.slot ? (
                      item.slot === 'food' ? (
                        <button 
                          onClick={() => onEquipFood(item.id, item.count)}
                          className="py-1.5 bg-slate-900 hover:bg-green-950/30 text-[9px] font-bold uppercase text-slate-400 hover:text-green-400 rounded transition-colors"
                        >
                          Equip
                        </button>
                      ) : (
                        <button 
                          onClick={() => onEquip(item.id, item.slot!)} // ! assertion is safe because filter checks item.slot
                          className="py-1.5 bg-slate-900 hover:bg-cyan-950/30 text-[9px] font-bold uppercase text-slate-400 hover:text-cyan-400 rounded transition-colors"
                        >
                          Equip
                        </button>
                      )
                    ) : (
                      <div className="bg-transparent"></div> // Spacer
                    )}
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

// Sub-component for equipment slot
function EquipmentSlotBox({ item, slot, onUnequip }: { item: Resource | null, slot: string, onUnequip: () => void }) {
  if (!item) {
    return (
      <div className="w-10 h-10 bg-slate-900/80 border border-slate-700 border-dashed rounded flex items-center justify-center group cursor-default">
        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100">{slot[0]}</span>
      </div>
    );
  }

  return (
    <div 
      onClick={onUnequip}
      className="w-10 h-10 bg-slate-900 border border-slate-600 rounded flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-950/20 transition-all relative group"
      title={`Unequip ${item.name}`}
    >
      <img src={item.icon} alt={slot} className="w-7 h-7 pixelated" />
      {/* Unequip indicator */}
      <div className="absolute inset-0 bg-red-950/80 items-center justify-center rounded hidden group-hover:flex">
        <span className="text-xs font-bold text-red-400">✕</span>
      </div>
    </div>
  );
}