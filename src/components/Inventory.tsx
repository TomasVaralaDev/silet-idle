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
  const [foodToEquip, setFoodToEquip] = useState<{ id: string, name: string, max: number } | null>(null);

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
    const id = equipment[slot as keyof typeof equipment];
    if (!id) return null;
    return getResource(id);
  };

  const getEquippedFoodItem = () => {
    if (!equippedFood) return null;
    return getResource(equippedFood.itemId);
  };

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col xl:flex-row gap-6 bg-slate-950 overflow-y-auto custom-scrollbar relative">
      
      {/* --- MODAL: EQUIP FOOD --- */}
      {foodToEquip && (
        <EquipFoodModal 
          item={foodToEquip} 
          onClose={() => setFoodToEquip(null)} 
          onConfirm={(amount) => {
            onEquipFood(foodToEquip.id, amount);
            setFoodToEquip(null);
          }} 
        />
      )}

      {/* --- LEFT: EQUIPMENT & STATS --- */}
      {/* Changed fixed width to flexible width with max-width for large screens */}
      <div className="w-full xl:w-[600px] flex-shrink-0 flex flex-col gap-6 mx-auto">
        
        {/* CHARACTER DOLL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col shadow-xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center border-b border-slate-800 pb-2">Active Loadout</h3>
          
          {/* CONTAINER */}
          {/* Adjusted height for responsiveness, added max-width to center it */}
          <div className="relative w-full max-w-[500px] h-[500px] sm:h-[600px] bg-slate-950/50 rounded-lg border border-slate-800/50 mb-4 flex items-center justify-center overflow-hidden shadow-inner mx-auto">
              
              {/* Character Silhouette */}
              <img src="/assets/ui/character_silhouette.png" className="h-[75%] opacity-10 object-contain pixelated pointer-events-none -translate-y-10 sm:-translate-y-20" alt="Silhouette" />
              
              {/* --- MAIN ARMOR SLOTS (Relative to top) --- */}
              {/* Positioning percentages work well for scaling */}
              
              {/* HEAD (Top Center) */}
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-10">
                 <EquipmentSlotBox item={getEquippedItem('head')} slot="head" onUnequip={() => onUnequip('head')} />
              </div>
              
              {/* BODY (Center) */}
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 z-10">
                 <EquipmentSlotBox item={getEquippedItem('body')} slot="body" onUnequip={() => onUnequip('body')} />
              </div>
              
              {/* WEAPON (Left) */}
              <div className="absolute top-[28%] left-[8%] sm:left-[12%] z-10">
                 <EquipmentSlotBox item={getEquippedItem('weapon')} slot="weapon" onUnequip={() => onUnequip('weapon')} />
              </div>
              
              {/* SHIELD (Right) */}
              <div className="absolute top-[28%] right-[8%] sm:right-[12%] z-10">
                 <EquipmentSlotBox item={getEquippedItem('shield')} slot="shield" onUnequip={() => onUnequip('shield')} />
              </div>

              {/* LEGS (Under Body) */}
              <div className="absolute top-[52%] left-1/2 -translate-x-1/2 z-10">
                 <EquipmentSlotBox item={getEquippedItem('legs')} slot="legs" onUnequip={() => onUnequip('legs')} />
              </div>

              {/* --- ACCESSORY ROW (BOTTOM) --- */}
              {/* Adjusted spacing for smaller screens */}

              {/* 1. SKILL */}
              <div className="absolute bottom-[5%] left-[18%] sm:left-[20%] -translate-x-1/2 z-10 scale-90 sm:scale-100">
                 <EquipmentSlotBox item={getEquippedItem('skill')} slot="skill" onUnequip={() => onUnequip('skill')} />
              </div>

              {/* 2. NECKLACE */}
              <div className="absolute bottom-[5%] left-[39%] sm:left-[40%] -translate-x-1/2 z-10 scale-90 sm:scale-100">
                 <EquipmentSlotBox item={getEquippedItem('necklace')} slot="necklace" onUnequip={() => onUnequip('necklace')} />
              </div>

              {/* 3. RING */}
              <div className="absolute bottom-[5%] left-[61%] sm:left-[60%] -translate-x-1/2 z-10 scale-90 sm:scale-100">
                 <EquipmentSlotBox item={getEquippedItem('ring')} slot="ring" onUnequip={() => onUnequip('ring')} />
              </div>

              {/* 4. RUNE */}
              <div className="absolute bottom-[5%] left-[82%] sm:left-[80%] -translate-x-1/2 z-10 scale-90 sm:scale-100">
                 <EquipmentSlotBox item={getEquippedItem('rune')} slot="rune" onUnequip={() => onUnequip('rune')} />
              </div>

              {/* Connection Lines (Decoration) */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                 <div className="absolute top-[38%] left-[22%] right-[22%] h-0.5 bg-slate-400"></div>
                 <div className="absolute top-[16%] bottom-[40%] left-1/2 w-0.5 bg-slate-400 -translate-x-1/2"></div>
              </div>
          </div>

          {/* COMBAT STATS SUMMARY */}
          <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center shadow-lg">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Attack</span>
                <span className="text-2xl sm:text-3xl text-orange-400 font-mono font-bold drop-shadow-md">
                  +{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.attack || 0) : 0), 0)}
                </span>
              </div>
              <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center shadow-lg">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Defense</span>
                <span className="text-2xl sm:text-3xl text-cyan-400 font-mono font-bold drop-shadow-md">
                  +{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.defense || 0) : 0), 0)}
                </span>
              </div>
          </div>
        </div>

        {/* FOOD & AUTO-EAT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div 
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all relative shadow-xl overflow-hidden flex-shrink-0
              ${equippedFood ? 'bg-slate-800 border-green-600 shadow-green-900/20' : 'bg-slate-950 border-slate-800 border-dashed hover:border-slate-600'}`}
              onClick={onUnequipFood}
              title="Click to unequip food"
            >
              {equippedFood ? (
                <>
                  <img src={getEquippedFoodItem()?.icon} className="w-12 h-12 sm:w-14 sm:h-14 pixelated drop-shadow-lg" alt="Food" />
                  <div className="absolute bottom-1 right-1 bg-slate-950/90 text-xs font-mono font-bold text-white px-2 py-0.5 rounded border border-slate-600 shadow-md backdrop-blur-sm">
                    x{equippedFood.count}
                  </div>
                </>
              ) : (
                <div className="text-center flex flex-col items-center justify-center h-full w-full opacity-30">
                  <img src="/assets/ui/slots/slot_food.png" className="w-8 h-8 sm:w-10 sm:h-10 pixelated mb-1" alt="Empty Food" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Empty</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full">
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
              <p className="text-[10px] text-slate-600 mt-2 italic text-center sm:text-left">Automatically consume food when HP drops below this threshold.</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- RIGHT: INVENTORY GRID --- */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl min-h-[500px]">
        
        {/* TOOLBAR */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-900 z-10">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
            {(['all', 'equipment', 'consumables', 'resources'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)} 
                className={`px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition-all whitespace-nowrap
                  ${filter === f 
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-500 border-slate-700 hover:text-slate-300 hover:bg-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:inline">Sort:</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as 'name' | 'value' | 'amount')}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs py-1.5 px-3 rounded outline-none focus:border-cyan-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="amount">Amount</option>
              <option value="value">Value</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar bg-slate-950/30">
          {sortedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
              <img src="/assets/ui/slots/icon_empty_box.png" className="w-16 h-16 opacity-30 pixelated mb-2" alt="Empty" />
              <p className="text-xs font-mono uppercase tracking-widest">Storage Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {sortedItems.map((item) => (
                <div key={item.id} className="group relative bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg p-3 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl">
                  
                  {/* Top Stats */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-amber-500/80">{item.value}g</span>
                    {item.count > 1 && <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 rounded">x{item.count}</span>}
                  </div>

                  {/* Icon */}
                  <div className="flex-1 flex items-center justify-center mb-3 min-h-[60px]">
                    <img src={item.icon} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 pixelated drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
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
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
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
                          onClick={() => setFoodToEquip({ id: item.id, name: item.name, max: item.count })}
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

// --- NEW COMPONENT: Equip Food Modal ---
function EquipFoodModal({ item, onClose, onConfirm }: { item: {id: string, name: string, max: number}, onClose: () => void, onConfirm: (amount: number) => void }) {
  const [amount, setAmount] = useState<number>(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        
        <h3 className="text-lg font-bold text-slate-200 mb-1 uppercase tracking-wide">Equip Rations</h3>
        <p className="text-sm text-green-400 font-bold mb-6">{item.name}</p>

        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold uppercase">
            <span>Amount</span>
            <span>Max: {item.max}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              min="1" 
              max={item.max} 
              value={amount} 
              onChange={(e) => setAmount(Math.min(item.max, Math.max(1, parseInt(e.target.value) || 0)))}
              className="w-20 bg-slate-900 border border-slate-700 rounded p-2 text-center text-white font-mono outline-none focus:border-green-500"
            />
            <input 
              type="range" 
              min="1" 
              max={item.max} 
              value={amount} 
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <button onClick={() => setAmount(1)} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 border border-slate-700">1</button>
            <button onClick={() => setAmount(Math.ceil(item.max / 2))} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 border border-slate-700">50%</button>
            <button onClick={() => setAmount(item.max)} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 border border-slate-700">ALL</button>
          </div>
        </div>

        <button 
          onClick={() => onConfirm(amount)}
          className="w-full py-3 bg-green-700 hover:bg-green-600 text-white font-bold uppercase tracking-widest rounded shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]"
        >
          Confirm
        </button>
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
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900/80 border-2 border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center group cursor-default shadow-inner transition-colors hover:bg-slate-900">
        <img 
          src={getPlaceholderImage(slot)} 
          alt={slot} 
          className="w-8 h-8 sm:w-10 sm:h-10 opacity-20 pixelated grayscale group-hover:opacity-30 transition-opacity" 
        />
      </div>
    );
  }

  return (
    <div 
      onClick={onUnequip}
      className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-950/20 transition-all relative group shadow-lg overflow-hidden"
      title={`Unequip ${item.name}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-950/80"></div>
      <img src={item.icon} alt={slot} className="w-12 h-12 sm:w-16 sm:h-16 pixelated drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform" />
      
      {/* Unequip overlay */}
      <div className="absolute inset-0 bg-red-950/90 items-center justify-center rounded-xl hidden group-hover:flex z-20 backdrop-blur-[2px]">
        <span className="text-[10px] sm:text-xs font-bold text-red-200 uppercase tracking-widest">Unequip</span>
      </div>
      
      {/* Item Name Tag */}
      <div className="absolute bottom-0 w-full bg-slate-950/90 text-[8px] sm:text-[9px] font-bold text-slate-300 py-1 text-center border-t border-slate-700 truncate px-1 z-10">
        {item.name}
      </div>
    </div>
  );
}