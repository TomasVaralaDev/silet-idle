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

  const getEquippedItem = (slot: EquipmentSlot) => {
    if (slot === 'food') return null; 
    // Nyt kun types.ts on päivitetty, tämä on turvallinen ilman 'as keyof' kikkailua
    const id = equipment[slot as keyof typeof equipment];
    if (!id) return null;
    return getResource(id);
  };

  const getEquippedFoodItem = () => {
    if (!equippedFood) return null;
    return getResource(equippedFood.itemId);
  };

  return (
    <div className="p-6 h-full flex flex-col lg:flex-row gap-6 bg-slate-950 overflow-y-auto custom-scrollbar">
      
      {/* --- LEFT: EQUIPMENT & STATS --- */}
      <div className="w-full lg:w-[600px] flex-shrink-0 flex flex-col gap-6">
        
        {/* CHARACTER DOLL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center border-b border-slate-800 pb-2">Active Loadout</h3>
          
          {/* CONTAINER */}
          <div className="relative w-full h-[450px] bg-slate-950/50 rounded-lg border border-slate-800/50 mb-4 flex items-center justify-center overflow-hidden shadow-inner">
             
             {/* --- EQUIPMENT SLOTS --- */}
             
             {/* TOP ROW */}
             {/* SKILL (Left of Head - Symmetrinen 22%) */}
             <div className="absolute top-[5%] left-[22%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('skill')} slot="skill" onUnequip={() => onUnequip('skill')} />
             </div>

             {/* HEAD (Center - 50%) */}
             <div className="absolute top-[5%] left-[50%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('head')} slot="head" onUnequip={() => onUnequip('head')} />
             </div>

             {/* NECKLACE (Right of Head - Symmetrinen 78%) */}
             <div className="absolute top-[5%] left-[78%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('necklace')} slot="necklace" onUnequip={() => onUnequip('necklace')} />
             </div>
             
             {/* MIDDLE ROW */}
             {/* WEAPON (Left) */}
             <div className="absolute top-[38%] left-[10%] z-10">
                <EquipmentSlotBox item={getEquippedItem('weapon')} slot="weapon" onUnequip={() => onUnequip('weapon')} />
             </div>

             {/* BODY (Center) */}
             <div className="absolute top-[38%] left-[50%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('body')} slot="body" onUnequip={() => onUnequip('body')} />
             </div>
             
             {/* SHIELD (Right) */}
             <div className="absolute top-[38%] right-[10%] z-10">
                <EquipmentSlotBox item={getEquippedItem('shield')} slot="shield" onUnequip={() => onUnequip('shield')} />
             </div>

             {/* BOTTOM ROW */}
             {/* RING (Left of Legs - Symmetrinen 22%) */}
             <div className="absolute bottom-[5%] left-[22%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('ring')} slot="ring" onUnequip={() => onUnequip('ring')} />
             </div>

             {/* LEGS (Bottom Center - 50%) */}
             <div className="absolute bottom-[5%] left-[50%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('legs')} slot="legs" onUnequip={() => onUnequip('legs')} />
             </div>

             {/* RUNE (Right of Legs - Symmetrinen 78%) */}
             <div className="absolute bottom-[5%] left-[78%] -translate-x-1/2 z-10">
                <EquipmentSlotBox item={getEquippedItem('rune')} slot="rune" onUnequip={() => onUnequip('rune')} />
             </div>

             {/* Connection Lines (Decoration) */}
             <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-[50%] left-[20%] right-[20%] h-0.5 bg-slate-400"></div>
                <div className="absolute top-[20%] bottom-[20%] left-[50%] w-0.5 bg-slate-400 -translate-x-1/2"></div>
             </div>
          </div>

          {/* COMBAT STATS SUMMARY */}
          <div className="grid grid-cols-2 gap-4 text-center">
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center shadow-lg">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Attack</span>
               <span className="text-3xl text-orange-400 font-mono font-bold drop-shadow-md">
                 +{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.attack || 0) : 0), 0)}
               </span>
             </div>
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center shadow-lg">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Defense</span>
               <span className="text-3xl text-cyan-400 font-mono font-bold drop-shadow-md">
                 +{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.defense || 0) : 0), 0)}
               </span>
             </div>
          </div>
        </div>

        {/* FOOD & AUTO-EAT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-6">
            <div 
              className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all relative shadow-xl overflow-hidden
              ${equippedFood ? 'bg-slate-800 border-green-600 shadow-green-900/20' : 'bg-slate-950 border-slate-800 border-dashed hover:border-slate-600'}`}
              onClick={onUnequipFood}
              title="Click to unequip food"
            >
              {equippedFood ? (
                <>
                  <img src={getEquippedFoodItem()?.icon} className="w-12 h-12 pixelated drop-shadow-lg" alt="Food" />
                  <span className="absolute -bottom-2 -right-2 bg-slate-900 text-xs font-mono font-bold text-white px-2 py-0.5 rounded border border-slate-600 shadow-sm">
                    {equippedFood.count}
                  </span>
                </>
              ) : (
                <div className="text-center flex items-center justify-center h-full w-full">
                  <img src="/assets/ui/slots/slot_food.png" className="w-10 h-10 opacity-20 pixelated" alt="Empty Food" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auto-Eat</div>
                 <span className="text-sm font-mono font-bold text-green-400">{combatSettings.autoEatThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={combatSettings.autoEatThreshold} 
                onChange={(e) => onUpdateAutoEat(Number(e.target.value))}
                className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
              />
              <p className="text-[10px] text-slate-600 mt-2 italic">Automatically consume food when HP drops below this threshold.</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- RIGHT: INVENTORY GRID --- */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        
        {/* TOOLBAR */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900 z-10">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(['all', 'equipment', 'consumables', 'resources'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)} 
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition-all whitespace-nowrap
                  ${filter === f 
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-500 border-slate-700 hover:text-slate-300 hover:bg-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:inline">Sort:</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as 'name' | 'value' | 'amount')}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs py-1.5 px-3 rounded outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="amount">Amount</option>
              <option value="value">Value</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950/30">
          {sortedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
              <img src="/assets/ui/slots/icon_empty_box.png" className="w-16 h-16 opacity-30 pixelated mb-2" alt="Empty" />
              <p className="text-xs font-mono uppercase tracking-widest">Storage Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {sortedItems.map((item) => (
                <div key={item.id} className="group relative bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg p-3 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl">
                  
                  {/* Top Stats */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-amber-500/80">{item.value}g</span>
                    {item.count > 1 && <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 rounded">x{item.count}</span>}
                  </div>

                  {/* Icon */}
                  <div className="flex-1 flex items-center justify-center mb-3 min-h-[60px]">
                    <img src={item.icon} alt={item.name} className="w-12 h-12 pixelated drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Name & Type */}
                  <div className="text-center mb-3">
                    <h4 className={`text-xs font-bold leading-tight ${item.color} mb-1 line-clamp-1`}>{item.name}</h4>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">
                      {item.slot ? item.slot : item.healing ? 'Food' : 'Resource'}
                    </p>
                  </div>

                  {/* Stats */}
                  {(item.stats?.attack || item.stats?.defense || item.healing) && (
                    <div className="flex justify-center gap-1.5 mb-3">
                      {item.stats?.attack && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-orange-950/30 text-orange-400 rounded border border-orange-900/30">ATK {item.stats.attack}</span>}
                      {item.stats?.defense && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-cyan-950/30 text-cyan-400 rounded border border-cyan-900/30">DEF {item.stats.defense}</span>}
                      {item.healing && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-green-950/30 text-green-400 rounded border border-green-900/30">HP {item.healing}</span>}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/50">
                    <button 
                      onClick={() => onSellClick(item.id)} 
                      className="py-2 bg-slate-950 hover:bg-red-950/40 text-[9px] font-bold uppercase text-slate-500 hover:text-red-400 rounded transition-colors border border-slate-800 hover:border-red-900/50"
                    >
                      Sell
                    </button>
                    
                    {item.slot ? (
                      item.slot === 'food' ? (
                        <button 
                          onClick={() => onEquipFood(item.id, item.count)}
                          className="py-2 bg-slate-950 hover:bg-green-950/40 text-[9px] font-bold uppercase text-slate-500 hover:text-green-400 rounded transition-colors border border-slate-800 hover:border-green-900/50"
                        >
                          Equip
                        </button>
                      ) : (
                        <button 
                          onClick={() => onEquip(item.id, item.slot!)} 
                          className="py-2 bg-slate-950 hover:bg-cyan-950/40 text-[9px] font-bold uppercase text-slate-500 hover:text-cyan-400 rounded transition-colors border border-slate-800 hover:border-cyan-900/50"
                        >
                          Equip
                        </button>
                      )
                    ) : (
                      <div className="bg-transparent"></div>
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

// --- SUB-COMPONENT: EQUIPMENT SLOT ---
function EquipmentSlotBox({ item, slot, onUnequip }: { item: Resource | null, slot: string, onUnequip: () => void }) {
  
  const getPlaceholderImage = (slotType: string) => {
    switch(slotType) {
      case 'head': return '/assets/ui/slots/slot_head.png';
      case 'body': return '/assets/ui/slots/slot_body.png';
      case 'legs': return '/assets/ui/slots/slot_legs.png';
      case 'weapon': return '/assets/ui/slots/slot_weapon.png';
      case 'shield': return '/assets/ui/slots/slot_shield.png';
      case 'necklace': return '/assets/ui/slots/slot_necklace.png';
      case 'ring': return '/assets/ui/slots/slot_ring.png';
      case 'rune': return '/assets/ui/slots/slot_rune.png';
      case 'skill': return '/assets/ui/slots/slot_skill.png';
      default: return '/assets/ui/slots/slot_default.png';
    }
  };

  if (!item) {
    return (
      <div className="w-24 h-24 bg-slate-900/80 border-2 border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center group cursor-default shadow-inner transition-colors hover:bg-slate-900">
        <img 
          src={getPlaceholderImage(slot)} 
          alt={slot} 
          className="w-10 h-10 opacity-20 pixelated grayscale group-hover:opacity-30 transition-opacity" 
        />
      </div>
    );
  }

  return (
    <div 
      onClick={onUnequip}
      className="w-24 h-24 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-950/20 transition-all relative group shadow-lg overflow-hidden"
      title={`Unequip ${item.name}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-950/80"></div>
      <img src={item.icon} alt={slot} className="w-16 h-16 pixelated drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform" />
      
      {/* Unequip overlay */}
      <div className="absolute inset-0 bg-red-950/90 items-center justify-center rounded-xl hidden group-hover:flex z-20 backdrop-blur-[2px]">
        <span className="text-xs font-bold text-red-200 uppercase tracking-widest">Unequip</span>
      </div>
      
      {/* Item Name Tag */}
      <div className="absolute bottom-0 w-full bg-slate-950/90 text-[9px] font-bold text-slate-300 py-1 text-center border-t border-slate-700 truncate px-1 z-10">
        {item.name}
      </div>
    </div>
  );
}