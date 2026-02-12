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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
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

  // --- DETAILS PANEL LOGIC ---
  const selectedItem = selectedItemId ? getResource(selectedItemId) : null;
  const selectedItemCount = selectedItemId ? (inventory[selectedItemId] || 0) : 0;
  
  const isEquipped = selectedItemId ? Object.values(equipment).includes(selectedItemId) : false;
  const isFoodEquipped = selectedItemId ? equippedFood?.itemId === selectedItemId : false;
  
  const equippedSlot = selectedItemId 
    ? (Object.keys(equipment) as Array<keyof typeof equipment>).find(key => equipment[key] === selectedItemId) 
    : null;

  const handleSellClick = (id: string) => {
    onSellClick(id);
    if (!inventory[id] || inventory[id] <= 1) { 
       setSelectedItemId(null);
    }
  };

  // KORJAUS 2: Määritelty item-tyyppi tarkasti 'any':n sijaan
  const handleRightClick = (e: React.MouseEvent, item: Resource & { count: number; id: string }) => {
    e.preventDefault(); 

    if (item.slot) {
      if (item.slot === 'food') {
        setFoodToEquip({ id: item.id, name: item.name, max: item.count });
      } else {
        onEquip(item.id, item.slot as EquipmentSlot);
      }
    }
  };

  // KORJAUS 1: useEffect poistettu. Tämä ehto hoitaa paneelin piilotuksen renderöinnissä.
  const showDetailsPanel = selectedItem && (selectedItemCount > 0 || isEquipped || isFoodEquipped);

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

      {/* --- LEFT COLUMN: EQUIPMENT DOLL --- */}
      <div className="w-full xl:w-[500px] flex-shrink-0 flex flex-col gap-6 mx-auto">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col shadow-xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center border-b border-slate-800 pb-2">Active Loadout</h3>
          
          <div className="relative w-full max-w-[500px] h-[500px] sm:h-[600px] bg-slate-950/50 rounded-lg border border-slate-800/50 mb-4 flex items-center justify-center overflow-hidden shadow-inner mx-auto">
              <img src="/assets/ui/character_silhouette.png" className="h-[75%] opacity-10 object-contain pixelated pointer-events-none -translate-y-10 sm:-translate-y-20" alt="Silhouette" />
              
              {/* ARMOR SLOTS */}
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-10"><EquipmentSlotBox item={getEquippedItem('head')} slot="head" onUnequip={() => onUnequip('head')} /></div>
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 z-10"><EquipmentSlotBox item={getEquippedItem('body')} slot="body" onUnequip={() => onUnequip('body')} /></div>
              <div className="absolute top-[28%] left-[8%] sm:left-[12%] z-10"><EquipmentSlotBox item={getEquippedItem('weapon')} slot="weapon" onUnequip={() => onUnequip('weapon')} /></div>
              <div className="absolute top-[28%] right-[8%] sm:right-[12%] z-10"><EquipmentSlotBox item={getEquippedItem('shield')} slot="shield" onUnequip={() => onUnequip('shield')} /></div>
              <div className="absolute top-[52%] left-1/2 -translate-x-1/2 z-10"><EquipmentSlotBox item={getEquippedItem('legs')} slot="legs" onUnequip={() => onUnequip('legs')} /></div>

              {/* ACCESSORIES */}
              <div className="absolute bottom-[5%] left-0 w-full flex justify-center gap-3 sm:gap-6 px-4 z-10 scale-90 sm:scale-100">
                 <EquipmentSlotBox item={getEquippedItem('skill')} slot="skill" onUnequip={() => onUnequip('skill')} />
                 <EquipmentSlotBox item={getEquippedItem('necklace')} slot="necklace" onUnequip={() => onUnequip('necklace')} />
                 <EquipmentSlotBox item={getEquippedItem('ring')} slot="ring" onUnequip={() => onUnequip('ring')} />
                 <EquipmentSlotBox item={getEquippedItem('rune')} slot="rune" onUnequip={() => onUnequip('rune')} />
              </div>
          </div>

          {/* STATS & FOOD */}
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="block text-[10px] text-slate-500 font-bold uppercase">Attack</span><span className="text-2xl text-orange-400 font-bold">+{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.attack || 0) : 0), 0)}</span></div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="block text-[10px] text-slate-500 font-bold uppercase">Defense</span><span className="text-2xl text-cyan-400 font-bold">+{Object.values(equipment).reduce((acc, id) => acc + (id ? (getResource(id)?.stats?.defense || 0) : 0), 0)}</span></div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
             <div onClick={onUnequipFood} className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center cursor-pointer relative ${equippedFood ? 'bg-slate-900 border-green-600' : 'bg-slate-900 border-slate-700 border-dashed'}`}>
               {equippedFood ? <><img src={getEquippedFoodItem()?.icon} className="w-10 h-10 pixelated" alt="Food" /><span className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] px-1">{equippedFood.count}</span></> : <span className="text-[9px] uppercase">Empty</span>}
             </div>
             <div className="flex-1">
               <div className="flex justify-between mb-1"><span className="text-xs font-bold text-slate-400">Auto-Eat</span><span className="text-xs font-bold text-green-400">{combatSettings.autoEatThreshold}%</span></div>
               <input type="range" min="0" max="100" value={combatSettings.autoEatThreshold} onChange={(e) => onUpdateAutoEat(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg accent-green-500" />
             </div>
          </div>
        </div>
      </div>

      {/* --- MIDDLE: INVENTORY GRID --- */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl min-h-[500px]">
        
        <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-wrap gap-2 items-center justify-between bg-slate-900 z-10">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(['all', 'equipment', 'consumables', 'resources'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${filter === f ? 'bg-slate-800 text-cyan-400 border-cyan-500/50' : 'text-slate-500 border-slate-700 hover:text-slate-300'}`}>{f}</button>
            ))}
          </div>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'name' | 'value' | 'amount')} className="bg-slate-950 border border-slate-700 text-slate-300 text-xs py-1.5 px-3 rounded outline-none focus:border-cyan-500">
             <option value="amount">Amount</option><option value="value">Value</option><option value="name">Name</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar bg-slate-950/30">
          {sortedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
              <span className="text-4xl mb-2">📭</span><p className="text-xs font-mono uppercase">Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-6 2xl:grid-cols-7 gap-2 content-start">
              {sortedItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    onContextMenu={(e) => handleRightClick(e, item)} 
                    className={`relative rounded-lg border-2 transition-all flex flex-col items-center p-1.5 group h-20 sm:h-24 justify-between
                      ${isSelected 
                        ? 'bg-slate-800 border-cyan-500 shadow-lg z-10' 
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                  >
                    <div className="w-full flex justify-end">
                       <span className="bg-slate-950/80 text-slate-400 text-[9px] font-mono font-bold px-1 rounded border border-slate-800">{item.count > 999 ? '999+' : item.count}</span>
                    </div>
                    <img src={item.icon} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 pixelated object-contain drop-shadow-md mb-1" />
                    <div className={`text-[8px] sm:text-[9px] text-center font-bold truncate w-full px-0.5 leading-none ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT: ITEM DETAILS PANEL (SLIDE IN) --- */}
      {showDetailsPanel && selectedItem && (
        <div className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-300 z-20">
          
          <div className="p-4 border-b border-slate-800 flex justify-between items-start bg-slate-950/50 rounded-t-xl">
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{selectedItem.category || (selectedItem.slot ? 'Equipment' : 'Resource')}</div>
              <h3 className="text-lg font-bold text-white leading-none">{selectedItem.name}</h3>
            </div>
            <button onClick={() => setSelectedItemId(null)} className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-slate-950 rounded-xl border-2 border-slate-800 flex items-center justify-center shadow-inner relative">
                <img src={selectedItem.icon} className="w-16 h-16 pixelated scale-125" alt={selectedItem.name} />
                <span className="absolute -bottom-2.5 bg-slate-800 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700">{selectedItem.value}g</span>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800 pb-1 mb-2">Description</h4>
              <p className="text-xs text-slate-300 italic">"{selectedItem.description}"</p>
            </div>

            {(selectedItem.stats || selectedItem.healing) && (
              <div className="mb-5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800 pb-1 mb-2">Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.stats?.attack && <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between"><span className="text-[10px] text-orange-500 font-bold">ATK</span><span className="text-xs text-white">+{selectedItem.stats.attack}</span></div>}
                  {selectedItem.stats?.defense && <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between"><span className="text-[10px] text-cyan-500 font-bold">DEF</span><span className="text-xs text-white">+{selectedItem.stats.defense}</span></div>}
                  {selectedItem.healing && <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between col-span-2"><span className="text-[10px] text-green-500 font-bold">HEAL</span><span className="text-xs text-white">+{selectedItem.healing} HP</span></div>}
                </div>
              </div>
            )}

            {selectedItem.levelRequired && (
              <div className="text-xs text-slate-400">
                Requires Level <span className="text-white font-bold">{selectedItem.levelRequired}</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950 rounded-b-xl space-y-2">
            {selectedItem.slot && (
              isEquipped 
              ? <button onClick={() => equippedSlot && onUnequip(equippedSlot)} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded font-bold uppercase text-[10px] tracking-wider">Unequip</button>
              : (selectedItem.slot === 'food' 
                  ? <button onClick={() => setFoodToEquip({ id: selectedItem.id, name: selectedItem.name, max: selectedItemCount })} className="w-full py-2.5 bg-green-800 hover:bg-green-700 border border-green-600 text-white rounded font-bold uppercase text-[10px] tracking-wider">Equip Food</button>
                  : <button onClick={() => onEquip(selectedItem.id, selectedItem.slot as EquipmentSlot)} className="w-full py-2.5 bg-cyan-800 hover:bg-cyan-700 border border-cyan-600 text-white rounded font-bold uppercase text-[10px] tracking-wider">Equip</button>
                )
            )}
            
            {selectedItem.healing && isFoodEquipped && (
                <button onClick={onUnequipFood} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded font-bold uppercase text-[10px] tracking-wider">Unequip Food</button>
            )}
            {selectedItem.healing && !isFoodEquipped && !selectedItem.slot && (
                <button onClick={() => setFoodToEquip({ id: selectedItem.id, name: selectedItem.name, max: selectedItemCount })} className="w-full py-2.5 bg-green-800 hover:bg-green-700 border border-green-600 text-white rounded font-bold uppercase text-[10px] tracking-wider">Equip Food</button>
            )}
            
            <button onClick={() => handleSellClick(selectedItem.id)} className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 hover:text-red-300 rounded font-bold uppercase text-[10px] tracking-wider flex items-center justify-center gap-2">
              <span>💰</span> Sell Item
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

// --- HELPER COMPONENTS ---

function EquipFoodModal({ item, onClose, onConfirm }: { item: {id: string, name: string, max: number}, onClose: () => void, onConfirm: (amount: number) => void }) {
  const [amount, setAmount] = useState<number>(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        <h3 className="text-lg font-bold text-slate-200 mb-4">Equip Rations</h3>
        <p className="text-sm text-green-400 font-bold mb-4">{item.name}</p>
        <div className="flex items-center gap-4 mb-6">
          <input type="number" min="1" max={item.max} value={amount} onChange={(e) => setAmount(Math.min(item.max, Math.max(1, parseInt(e.target.value) || 0)))} className="w-20 bg-slate-950 border border-slate-700 rounded p-2 text-center text-white" />
          <input type="range" min="1" max={item.max} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} className="flex-1 h-2 bg-slate-800 rounded-lg accent-green-500" />
        </div>
        <div className="flex gap-2 mb-4">
           <button onClick={() => setAmount(1)} className="flex-1 py-1 bg-slate-800 text-xs font-bold text-slate-300 rounded border border-slate-700">1</button>
           <button onClick={() => setAmount(Math.ceil(item.max / 2))} className="flex-1 py-1 bg-slate-800 text-xs font-bold text-slate-300 rounded border border-slate-700">50%</button>
           <button onClick={() => setAmount(item.max)} className="flex-1 py-1 bg-slate-800 text-xs font-bold text-slate-300 rounded border border-slate-700">Max</button>
        </div>
        <button onClick={() => onConfirm(amount)} className="w-full py-3 bg-green-700 hover:bg-green-600 text-white font-bold uppercase rounded shadow-lg">Confirm</button>
      </div>
    </div>
  );
}

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
        <img src={getPlaceholderImage(slot)} alt={slot} className="w-8 h-8 sm:w-10 sm:h-10 opacity-20 pixelated grayscale group-hover:opacity-30 transition-opacity" />
      </div>
    );
  }

  return (
    <div onClick={onUnequip} className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-950/20 transition-all relative group shadow-lg overflow-hidden" title={`Unequip ${item.name}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-950/80"></div>
      <img src={item.icon} alt={slot} className="w-12 h-12 sm:w-16 sm:h-16 pixelated drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform" />
      <div className="absolute inset-0 bg-red-950/90 items-center justify-center rounded-xl hidden group-hover:flex z-20 backdrop-blur-[2px]"><span className="text-[10px] sm:text-xs font-bold text-red-200 uppercase tracking-widest">Unequip</span></div>
      <div className="absolute bottom-0 w-full bg-slate-950/90 text-[8px] sm:text-[9px] font-bold text-slate-300 py-1 text-center border-t border-slate-700 truncate px-1 z-10">{item.name}</div>
    </div>
  );
}