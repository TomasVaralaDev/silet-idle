import { useGameStore } from '../store/useGameStore';
import { getItemDetails } from '../data';
import { getRarityStyle } from '../utils/rarity';
import type { Resource, EquipmentSlot } from '../types';

interface InventoryProps {
  onSellClick: (itemId: string) => void;
}

export default function Inventory({ onSellClick }: InventoryProps) {
  const inventory = useGameStore(state => state.inventory);
  const equipment = useGameStore(state => state.equipment);
  const equippedFood = useGameStore(state => state.equippedFood);
  const combatSettings = useGameStore(state => state.combatSettings);
  
  const equipItem = useGameStore(state => state.equipItem);
  const equipFood = useGameStore(state => state.equipFood);
  const unequipFood = useGameStore(state => state.unequipFood);
  const updateCombatSettings = useGameStore(state => state.updateCombatSettings);

  const inventoryItems = Object.entries(inventory).map(([id, count]) => {
    const details = getItemDetails(id);
    return details ? { ...details, count, originalId: id } : null;
  }).filter((item): item is Resource & { count: number, originalId: string } => item !== null)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="p-4 sm:p-6 h-full bg-slate-950 text-slate-200 overflow-y-auto custom-scrollbar">
      
      {/* --- EQUIPMENT SECTION --- */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-400 flex items-center gap-2 uppercase tracking-wider text-sm border-b border-slate-800 pb-2">
          <span>🛡️</span> Active Loadout
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Paper Doll */}
          <div className="flex-shrink-0 bg-slate-900/50 p-4 rounded-xl border border-slate-800 relative">
             <div className="grid grid-cols-3 gap-3 w-max mx-auto">
               <div className="col-start-2"><EquipmentSlotDisplay slot="head" itemId={equipment.head} label="Head" /></div>
               
               <div className="col-start-1 row-start-2"><EquipmentSlotDisplay slot="weapon" itemId={equipment.weapon} label="Main" /></div>
               <div className="col-start-2 row-start-2"><EquipmentSlotDisplay slot="body" itemId={equipment.body} label="Body" /></div>
               <div className="col-start-3 row-start-2"><EquipmentSlotDisplay slot="shield" itemId={equipment.shield} label="Off" /></div>
               
               <div className="col-start-2 row-start-3"><EquipmentSlotDisplay slot="legs" itemId={equipment.legs} label="Legs" /></div>
               
               <div className="col-start-1 row-start-4"><EquipmentSlotDisplay slot="ring" itemId={equipment.ring} label="Ring" /></div>
               <div className="col-start-2 row-start-4"><EquipmentSlotDisplay slot="necklace" itemId={equipment.necklace} label="Neck" /></div>
               <div className="col-start-3 row-start-4"><EquipmentSlotDisplay slot="rune" itemId={equipment.rune} label="Rune" /></div>
             </div>
          </div>

          {/* Combat Settings & Food */}
          <div className="flex-1 space-y-4">
             {/* Food Slot */}
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Equipped Food</div>
                  {equippedFood ? (
                    <div className="flex items-center gap-3">
                       <img src={getItemDetails(equippedFood.itemId)?.icon} className="w-8 h-8 pixelated" alt="Food" />
                       <div>
                         <div className="text-sm font-bold text-green-400">{getItemDetails(equippedFood.itemId)?.name}</div>
                         <div className="text-xs text-slate-400">x{equippedFood.count}</div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600 italic">No food equipped</div>
                  )}
                </div>
                {equippedFood && (
                  <button onClick={unequipFood} className="text-xs text-red-400 hover:text-red-300 border border-red-900/30 px-3 py-1 rounded hover:bg-red-900/10">
                    Unequip
                  </button>
                )}
             </div>

             {/* Auto Eat Setting */}
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Auto-Eat Threshold</span>
                  <span className="text-xs font-bold text-slate-200">{combatSettings.autoEatThreshold}% HP</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  step="5"
                  value={combatSettings.autoEatThreshold} 
                  onChange={(e) => updateCombatSettings({ autoEatThreshold: parseInt(e.target.value) })}
                  className="w-full accent-green-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-slate-600 mt-2">Automatically eats food when HP drops below this percentage.</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- INVENTORY GRID --- */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-400 flex items-center gap-2 uppercase tracking-wider text-sm border-b border-slate-800 pb-2">
          <span>🎒</span> Inventory ({inventoryItems.length} items)
        </h2>

        {inventoryItems.length === 0 ? (
          <div className="text-center py-20 text-slate-600 italic">Inventory is empty. Go gather some resources!</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {inventoryItems.map((item) => {
              const style = getRarityStyle(item.rarity);
              
              return (
                <div key={item.originalId} className={`group relative bg-slate-900 border-2 ${style.border} rounded-lg p-3 hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-lg`}>
                  
                  {/* Actions Overlay */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex flex-col gap-1 z-10 transition-opacity">
                    <button 
                      onClick={() => onSellClick(item.originalId)}
                      className="bg-slate-950 text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-yellow-900/50 hover:bg-yellow-900/20"
                      title="Sell Item"
                    >
                      $
                    </button>
                    {item.slot && (
                      <button 
                        onClick={() => item.slot === 'food' ? equipFood(item.originalId, 1000) : equipItem(item.originalId, item.slot as EquipmentSlot)}
                        className="bg-slate-950 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-900/50 hover:bg-green-900/20"
                        title="Equip"
                      >
                        E
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className={`relative w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/50 ${item.rarity === 'legendary' ? 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''}`}>
                       <img src={item.icon} alt={item.name} className="w-8 h-8 pixelated object-contain" />
                       <span className="absolute -bottom-1 -right-1 bg-slate-950 text-slate-300 text-[10px] font-bold px-1.5 rounded border border-slate-700 shadow">
                         {item.count > 999 ? '999+' : item.count}
                       </span>
                    </div>
                    
                    <div className="text-center w-full">
                      <div className={`text-xs font-bold truncate ${style.text}`}>{item.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">{item.category || 'Item'}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- HELPER COMPONENT (MOVED OUTSIDE) ---
function EquipmentSlotDisplay({ slot, itemId, label }: { slot: string, itemId: string | null, label: string }) {
  // Haetaan unequipItem tässä komponentissa suoraan storesta
  const unequipItem = useGameStore(state => state.unequipItem);
  
  const item = itemId ? getItemDetails(itemId) : null;
  const rarity = item?.rarity || 'common';
  const style = getRarityStyle(rarity);

  return (
    <div className="relative group w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 rounded border border-slate-700 flex items-center justify-center">
      {item ? (
        <button onClick={() => unequipItem(slot)} className={`w-full h-full p-1 relative rounded hover:bg-red-900/30 transition-colors border ${style.border}`}>
           <img src={item.icon} alt={item.name} className="w-full h-full object-contain pixelated" />
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 rounded">
             <span className="text-[10px] text-red-400 font-bold uppercase">Unequip</span>
           </div>
        </button>
      ) : (
        <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">{label}</span>
      )}
    </div>
  );
}