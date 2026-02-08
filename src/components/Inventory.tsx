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

export default function Inventory({ 
  inventory, equipment, equippedFood, combatSettings, 
  onSellClick, onEquip, onEquipFood, onUnequip, onUnequipFood, onUpdateAutoEat 
}: InventoryProps) {
  
  const [foodSelectionId, setFoodSelectionId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const inventoryItems = Object.entries(inventory)
    .map(([id, count]) => {
      const details = getItemDetails(id);
      if (!details) return null;
      return { id, count, ...details };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

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

  const renderSlot = (slot: string, placeholderIcon: string) => {
    const itemId = equipment[slot as keyof typeof equipment];
    const item = itemId ? getItemDetails(itemId) : null;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-1 relative aspect-square shadow-inner overflow-hidden">
        <span className="absolute top-1 left-2 text-[10px] uppercase font-bold text-slate-600 tracking-wider pointer-events-none z-10">{slot}</span>
        {item ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
             <img src={item.icon} alt={item.name} className="w-8 h-8 pixelated drop-shadow-md" />
             <span className="text-[9px] font-bold text-slate-300 text-center leading-tight line-clamp-2 px-1 mt-1">{item.name}</span>
             <button 
               onClick={() => onUnequip(slot)}
               className="absolute top-1 right-1 text-red-500 hover:text-red-300 hover:bg-red-900/30 rounded px-1 transition-colors text-xs font-bold leading-none w-5 h-5 flex items-center justify-center z-20"
               title="Unequip"
             >✕</button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={placeholderIcon} alt="Empty Slot" className="w-8 h-8 opacity-20 pixelated grayscale" />
          </div>
        )}
      </div>
    );
  };

  const renderFoodSlot = () => {
    const item = equippedFood ? getItemDetails(equippedFood.itemId) : null;

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-1 relative aspect-square shadow-inner group overflow-visible">
        <span className="absolute top-1 left-2 text-[10px] uppercase font-bold text-slate-600 tracking-wider pointer-events-none z-10">Food</span>
        
        <div className="absolute top-1 right-1 flex flex-col gap-1 items-end z-30">
          {item && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUnequipFood(); }}
              className="bg-slate-950/80 text-red-500 hover:text-red-300 hover:bg-red-900/50 border border-slate-700 rounded-md text-[10px] font-bold w-5 h-5 flex items-center justify-center shadow-sm transition-all"
              title="Unequip Food"
            >✕</button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-md text-[10px] w-5 h-5 flex items-center justify-center shadow-sm transition-all ${showSettings ? 'text-emerald-400 border-emerald-500' : ''}`}
            title="Auto-Eat Settings"
          >⚙️</button>
        </div>

        {showSettings && (
          <div className="absolute top-0 left-full ml-2 w-56 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-2xl z-50">
            <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Auto-Eat Settings</h4>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-red-400 font-bold px-1">✕</button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <input 
                type="range" min="0" max="95" step="5"
                value={combatSettings.autoEatThreshold}
                onChange={(e) => onUpdateAutoEat(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-sm font-mono font-bold text-emerald-400 w-10 text-right">{combatSettings.autoEatThreshold}%</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              When HP drops to <span className="text-white font-bold">{combatSettings.autoEatThreshold}%</span> or below, one food will be eaten (10s cooldown).
            </p>
          </div>
        )}

        {item ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 pt-4">
             <div className="relative">
                <img src={item.icon} alt={item.name} className="w-8 h-8 pixelated drop-shadow-md" />
                <span className="absolute -bottom-1 -right-2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-700 shadow-sm font-mono">
                  {equippedFood?.count}
                </span>
             </div>
             <div className="mt-1 flex flex-col items-center w-full">
               <span className="text-[9px] font-bold text-slate-300 text-center leading-tight line-clamp-1 w-full px-1">{item.name}</span>
               <span className="text-[9px] text-emerald-400 font-mono font-bold mt-0.5">+{item.healing} HP</span>
             </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/assets/ui/slot_food.png" alt="Empty Food" className="w-8 h-8 opacity-20 pixelated grayscale" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 h-full overflow-hidden relative">
      
      {foodSelectionId && (
        <QuantityModal 
          itemId={foodSelectionId}
          maxAmount={Math.min(999, inventory[foodSelectionId] || 0)} 
          title={`Equip Food: ${getItemDetails(foodSelectionId)?.name}`}
          onClose={() => setFoodSelectionId(null)}
          onConfirm={(amount) => {
            onEquipFood(foodSelectionId, amount);
            setFoodSelectionId(null);
          }}
        />
      )}

      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
            {/* Equipment-otsikon ikoni vaihdettu */}
            <img src="/assets/ui/icon_equipment.png" alt="Equipment" className="w-6 h-6 pixelated" />
            <span>Equipment</span>
          </h2>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="col-start-2">{renderSlot('head', '/assets/ui/slot_head.png')}</div>
            <div className="col-start-1 row-start-2">{renderSlot('weapon', '/assets/ui/slot_weapon.png')}</div>
            <div className="col-start-2 row-start-2">{renderSlot('body', '/assets/ui/slot_body.png')}</div>
            <div className="col-start-3 row-start-2">{renderSlot('shield', '/assets/ui/slot_shield.png')}</div>
            <div className="col-start-2 row-start-3">{renderSlot('legs', '/assets/ui/slot_legs.png')}</div>
            <div className="col-start-3 row-start-3 relative z-10">{renderFoodSlot()}</div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">
            Combat Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/skills/attack.png" className="w-4 h-4 pixelated" alt="Attack" />
                <span className="text-slate-300 font-bold">Attack Power</span>
              </div>
              <span className="text-xl font-mono font-bold text-orange-400">+{playerStats.attack}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/skills/defense.png" className="w-4 h-4 pixelated" alt="Defense" />
                <span className="text-slate-300 font-bold">Armor / Def</span>
              </div>
              <span className="text-xl font-mono font-bold text-blue-400">+{playerStats.defense}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/50 p-6 rounded-xl border border-slate-800 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
          {/* Backpack-otsikon ikoni vaihdettu */}
          <img src="/assets/ui/icon_inventory.png" alt="Backpack" className="w-6 h-6 pixelated" />
          <span>Backpack</span>
        </h2>

        {inventoryItems.length === 0 ? (
          <div className="text-center text-slate-600 italic py-20 flex flex-col items-center gap-4">
            {/* Tyhjän inventoryn ikoni vaihdettu */}
            <img src="/assets/ui/icon_inventory.png" className="w-16 h-16 opacity-20 grayscale pixelated" alt="Empty" />
            <p>Your inventory is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {inventoryItems.map((item) => (
              <div key={item.id} className="bg-slate-800 border border-slate-700 p-3 rounded-lg relative group hover:border-slate-500 transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <img src={item.icon} alt={item.name} className="w-8 h-8 pixelated drop-shadow-sm" />
                  <span className="text-xs font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 shadow-inner">x{item.count}</span>
                </div>
                
                <div className="mb-2 flex-1">
                  <div className="text-sm font-bold text-slate-200 leading-tight">{item.name}</div>
                  {item.stats && (
                    <div className="text-[10px] text-slate-400 mt-1 flex gap-2">
                      {item.stats.attack ? <span className="text-orange-400">Atk +{item.stats.attack}</span> : null}
                      {item.stats.defense ? <span className="text-blue-400">Def +{item.stats.defense}</span> : null}
                    </div>
                  )}
                  {item.healing && (
                    <div className="text-[10px] text-green-400 mt-1 font-bold">
                      Heals +{item.healing} HP
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1 mt-auto">
                  {item.healing ? (
                    <button 
                      onClick={() => setFoodSelectionId(item.id)}
                      className="flex-1 bg-green-900/40 hover:bg-green-600 text-green-200 text-[10px] font-bold py-1.5 rounded border border-green-800 transition-colors uppercase"
                    >
                      Equip
                    </button>
                  ) : item.slot ? (
                    <button 
                      onClick={() => onEquip(item.id, item.slot as EquipmentSlot)}
                      className="flex-1 bg-emerald-900/40 hover:bg-emerald-600 text-emerald-200 text-[10px] font-bold py-1.5 rounded border border-emerald-800 transition-colors uppercase"
                    >
                      Equip
                    </button>
                  ) : null}
                  <button 
                    onClick={() => onSellClick(item.id)}
                    className="flex-1 bg-slate-700/50 hover:bg-yellow-900/50 hover:text-yellow-200 text-slate-400 text-[10px] font-bold py-1.5 rounded border border-slate-600 transition-colors uppercase"
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}