import React from 'react';
import type { Resource } from '../../types';

export interface InventoryItem extends Resource {
  count: number;
}

interface Props {
  items: InventoryItem[];
  onSellClick: (itemId: string) => void;
  onItemClick: (item: InventoryItem) => void;
  onRightClick: (itemId: string) => void; // UUSI
}

export default function InventoryGrid({ items, onSellClick, onItemClick, onRightClick }: Props) {
  
  const handleInteraction = (item: InventoryItem, e: React.MouseEvent) => {
    if (e.shiftKey) {
      onSellClick(item.id);
      return;
    }
    onItemClick(item);
  };

  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault(); // Estetään selaimen valikko
    onRightClick(itemId);
  };

  // Estetään tekstin valinta shift-klikkauksen aikana
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey || e.button === 2) { // 2 on oikea klikkaus
      e.preventDefault();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden relative select-none">
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <p className="text-sm font-bold opacity-50">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={(e) => handleInteraction(item, e)}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                onMouseDown={handleMouseDown}
                className="flex items-center gap-3 p-2 rounded bg-slate-950 border border-slate-800 hover:border-slate-500 hover:bg-slate-900 cursor-pointer group transition-all animate-in zoom-in-95 duration-200"
              >
                <div className="relative shrink-0">
                   <div className={`w-10 h-10 rounded flex items-center justify-center bg-slate-900 ${
                    item.rarity === 'legendary' ? 'border border-orange-500/30' : 
                    item.rarity === 'rare' ? 'border border-cyan-500/30' : ''
                  }`}>
                    <img src={item.icon} className="w-8 h-8 pixelated" alt={item.name} />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono border border-slate-700 shadow-sm z-10">
                    {item.count}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className={`text-sm font-bold truncate ${item.color || 'text-slate-300'}`}>
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    <span className={
                      item.rarity === 'legendary' ? 'text-orange-500' :
                      item.rarity === 'rare' ? 'text-cyan-500' :
                      item.rarity === 'uncommon' ? 'text-emerald-500' : 'text-slate-500'
                    }>{item.rarity}</span>
                    {item.level && <span>• L. {item.level}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 flex justify-between">
        <div className="flex gap-3">
          <span>Shift+Click: <span className="text-slate-300">Quick Sell</span></span>
          <span>Right Click: <span className="text-slate-300">Equip</span></span>
        </div>
        <span>{items.length} items</span>
      </div>
    </div>
  );
}