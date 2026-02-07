import React from 'react';
// KORJAUS: Lisätty 'type' sana tähän
import type { EquipmentSlot, GameState } from '../types';
import { getItemDetails } from '../data';

interface InventoryProps {
  inventory: GameState['inventory'];
  equipment: GameState['equipment'];
  onSellClick: (id: string) => void;
  onEquip: (id: string, slot: EquipmentSlot) => void;
  onUnequip: (slot: string) => void;
}

export default function Inventory({ inventory, equipment, onSellClick, onEquip, onUnequip }: InventoryProps) {
  
  // Calculate stats for display
  const playerStats = { attack: 0, defense: 0, strength: 0 };
  Object.values(equipment).forEach(itemId => {
    if (itemId) {
      const item = getItemDetails(itemId);
      if (item?.stats) {
        playerStats.attack += item.stats.attack || 0;
        playerStats.defense += item.stats.defense || 0;
        playerStats.strength += item.stats.strength || 0;
      }
    }
  });

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('itemId', itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSlot: EquipmentSlot) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    if (itemId) onEquip(itemId, targetSlot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8">
      {/* EQUIPMENT (PAPER DOLL) */}
      <div className="lg:w-1/3 flex-shrink-0">
         <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sticky top-6">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-2xl">🛡️</span> Equipment</h2>
           
           <div className="grid grid-cols-3 gap-4 auto-rows-fr">
              <div></div>
              {/* HEAD */}
              <div 
                onDragOver={handleDragOver} 
                onDrop={(e) => handleDrop(e, 'head')}
                onClick={() => onUnequip('head')}
                className={`aspect-square border-2 border-dashed rounded-xl flex items-center justify-center relative transition-all cursor-pointer hover:bg-slate-800
                  ${equipment.head ? 'border-violet-500 bg-slate-800 border-solid' : 'border-slate-700'}`}
              >
                {equipment.head ? <span className="text-4xl">{getItemDetails(equipment.head)?.icon}</span> : <span className="text-slate-700 text-2xl">🧢</span>}
                <span className="absolute bottom-1 text-[10px] uppercase text-slate-500 font-bold">Head</span>
              </div>
              <div></div>

              {/* WEAPON */}
              <div 
                onDragOver={handleDragOver} 
                onDrop={(e) => handleDrop(e, 'weapon')}
                onClick={() => onUnequip('weapon')}
                className={`aspect-square border-2 border-dashed rounded-xl flex items-center justify-center relative transition-all cursor-pointer hover:bg-slate-800
                  ${equipment.weapon ? 'border-amber-600 bg-slate-800 border-solid' : 'border-slate-700'}`}
              >
                {equipment.weapon ? <span className="text-4xl">{getItemDetails(equipment.weapon)?.icon}</span> : <span className="text-slate-700 text-2xl">⚔️</span>}
                <span className="absolute bottom-1 text-[10px] uppercase text-slate-500 font-bold">Weapon</span>
              </div>

              {/* BODY */}
              <div 
                onDragOver={handleDragOver} 
                onDrop={(e) => handleDrop(e, 'body')}
                onClick={() => onUnequip('body')}
                className={`aspect-square border-2 border-dashed rounded-xl flex items-center justify-center relative transition-all cursor-pointer hover:bg-slate-800
                  ${equipment.body ? 'border-orange-500 bg-slate-800 border-solid' : 'border-slate-700'}`}
              >
                {equipment.body ? <span className="text-4xl">{getItemDetails(equipment.body)?.icon}</span> : <span className="text-slate-700 text-2xl">👕</span>}
                <span className="absolute bottom-1 text-[10px] uppercase text-slate-500 font-bold">Body</span>
              </div>

              {/* SHIELD */}
              <div 
                onDragOver={handleDragOver} 
                onDrop={(e) => handleDrop(e, 'shield')}
                onClick={() => onUnequip('shield')}
                className={`aspect-square border-2 border-dashed rounded-xl flex items-center justify-center relative transition-all cursor-pointer hover:bg-slate-800
                  ${equipment.shield ? 'border-blue-500 bg-slate-800 border-solid' : 'border-slate-700'}`}
              >
                {equipment.shield ? <span className="text-4xl">{getItemDetails(equipment.shield)?.icon}</span> : <span className="text-slate-700 text-2xl">🛡️</span>}
                <span className="absolute bottom-1 text-[10px] uppercase text-slate-500 font-bold">Shield</span>
              </div>

              {/* LEGS */}
              <div className="col-start-2 aspect-square border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center relative">
                 <span className="text-slate-700 text-2xl">👖</span>
                 <span className="absolute bottom-1 text-[10px] uppercase text-slate-500 font-bold">Legs</span>
              </div>

              {/* AMMO */}
              <div 
                onDragOver={handleDragOver} 
                onDrop={(e) => handleDrop(e, 'ammo')}
                onClick={() => onUnequip('ammo')}
                className={`aspect-square border-2 border-dashed rounded-xl flex items-center justify-center relative transition-all cursor-pointer hover:bg-slate-800
                  ${equipment.ammo ? 'border-slate-400 bg-slate-800 border-solid' : 'border-slate-700'}`}
              >
                {equipment.ammo ? <span className="text-4xl">{getItemDetails(equipment.ammo)?.icon}</span> : <span className="text-slate-700 text-2xl">🏹</span>}
                <span className="absolute bottom-1 text-[10px] uppercase text-slate-500 font-bold">Ammo</span>
              </div>
           </div>

           <div className="mt-8 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Player Stats</h3>
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between"><span>⚔️ Attack</span><span className="text-amber-500 font-mono">{playerStats.attack}</span></div>
                 <div className="flex justify-between"><span>🛡️ Defense</span><span className="text-blue-400 font-mono">{playerStats.defense}</span></div>
                 <div className="flex justify-between"><span>💪 Strength</span><span className="text-red-400 font-mono">{playerStats.strength}</span></div>
              </div>
           </div>
         </div>
      </div>

      {/* INVENTORY GRID */}
      <div className="flex-1">
        <header className="mb-8 border-b border-slate-800 pb-6"><h2 className="text-3xl font-bold flex items-center gap-3"><span className="text-4xl">🎒</span> Inventory</h2><p className="text-slate-400 mt-2">Drag items to the left to equip.</p></header>
        {Object.keys(inventory).length === 0 ? (<div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed"><p className="text-slate-500 text-lg">Inventory is empty.</p></div>) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(inventory).map(([id, count]) => {
              const item = getItemDetails(id);
              if (!item) return null;
              const isDraggable = !!item.slot;

              return (
                <div 
                  key={id} 
                  draggable={isDraggable}
                  onDragStart={(e) => handleDragStart(e, id)}
                  onClick={() => onSellClick(id)} 
                  className={`group bg-slate-900 aspect-square rounded-xl border border-slate-800 hover:border-violet-500 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] flex flex-col items-center justify-center relative active:scale-95 cursor-pointer
                    ${isDraggable ? 'cursor-grab active:cursor-grabbing border-slate-600' : ''}
                  `}
                >
                  <div className={`text-4xl mb-2 transition-transform group-hover:scale-110 ${item.color}`}>{item.icon}</div>
                  <span className="text-xs text-slate-400 font-medium group-hover:text-white truncate max-w-[90%]">{item.name}</span>
                  <div className="absolute top-2 right-2 bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full shadow-lg">{count}</div>
                  {item.slot && <span className="absolute top-2 left-2 text-[10px] bg-slate-800 text-slate-500 px-1 rounded border border-slate-700 uppercase">{item.slot}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}