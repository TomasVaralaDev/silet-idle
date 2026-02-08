import { useState } from 'react';
import type { CombatState, GameState } from '../types';
import { COMBAT_DATA, getItemDetails } from '../data';
import QuantityModal from './QuantityModal';

interface CombatViewProps {
  combatState: CombatState;
  inventory: Record<string, number>;
  equippedFood: GameState['equippedFood'];
  onEquipFood: (itemId: string, amount: number) => void;
  onStartCombat: (mapId: number) => void;
  onStopCombat: () => void;
}

export default function CombatView({ 
  combatState, inventory, equippedFood, 
  onEquipFood, onStartCombat, onStopCombat 
}: CombatViewProps) {
  
  const { hp, maxHp = 100, currentMapId, maxMapCompleted, enemyCurrentHp, respawnTimer, foodTimer } = combatState;
  const activeMap = currentMapId ? COMBAT_DATA.find(m => m.id === currentMapId) : null;
  
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  const availableFoods = Object.keys(inventory).filter(id => {
    const item = getItemDetails(id);
    return item && item.healing;
  });

  const activeFoodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;

  return (
    <div className="p-6 relative">
      
      {selectedFoodId && (
        <QuantityModal 
          itemId={selectedFoodId}
          maxAmount={Math.min(999, inventory[selectedFoodId] || 0)} 
          title={`Equip Food: ${getItemDetails(selectedFoodId)?.name}`}
          onClose={() => setSelectedFoodId(null)}
          onConfirm={(amount) => {
            onEquipFood(selectedFoodId, amount);
            setSelectedFoodId(null);
            setShowFoodModal(false);
          }}
        />
      )}

      {showFoodModal && !selectedFoodId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Select Food</h3>
              <button onClick={() => setShowFoodModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {availableFoods.map(foodId => {
                const item = getItemDetails(foodId);
                return (
                  <button 
                    key={foodId}
                    onClick={() => setSelectedFoodId(foodId)}
                    className="bg-slate-700 hover:bg-slate-600 p-3 rounded flex flex-col items-center gap-1 border border-slate-600"
                  >
                    <img src={item?.icon} className="w-8 h-8 pixelated" alt={item?.name} />
                    <span className="text-[10px] text-slate-300 font-bold text-center leading-tight">{item?.name}</span>
                    <span className="text-[9px] text-emerald-400">+{item?.healing} HP</span>
                    <span className="text-[9px] text-slate-500">x{inventory[foodId]}</span>
                  </button>
                );
              })}
              {availableFoods.length === 0 && <p className="col-span-4 text-slate-500 text-center text-sm py-4">No food in inventory.</p>}
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-red-500 flex items-center gap-3">
        <img src="/assets/skills/combat.png" className="w-8 h-8 pixelated" alt="Combat" />
        Combat Zone - World 1
      </h2>

      {/* PLAYER STATS & FOOD */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1 bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex gap-2 items-center">
              <img src="/assets/ui/avatar.png" className="w-6 h-6 rounded pixelated" alt="Hero" /> Hero
            </h3>
            <p className="text-slate-400 text-sm">HP: {Math.round(hp)} / {maxHp}</p>
          </div>
          <div className="w-1/2 h-6 bg-slate-950 rounded-full border border-slate-700 overflow-hidden relative">
            <div 
              className="h-full bg-red-600 transition-all duration-300" 
              style={{ width: `${(hp / maxHp) * 100}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md">
              {Math.round((hp / maxHp) * 100)}%
            </span>
          </div>
        </div>

        <button 
          onClick={() => setShowFoodModal(true)}
          className="w-24 bg-slate-900 p-2 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative hover:border-slate-600 transition-colors group"
        >
          <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Eat</span>
          {activeFoodItem ? (
            <>
              <img src={activeFoodItem.icon} className="w-8 h-8 pixelated drop-shadow-md" alt="Food" />
              <span className="absolute bottom-1 right-1 bg-slate-950 text-white text-[10px] font-bold px-1.5 rounded border border-slate-700">
                {equippedFood?.count}
              </span>
              {foodTimer > 0 && (
                <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-white font-bold font-mono text-lg">{foodTimer}s</span>
                </div>
              )}
            </>
          ) : (
            <img src="/assets/ui/slot_food.png" className="w-8 h-8 opacity-20 grayscale pixelated" alt="Empty" />
          )}
        </button>
      </div>

      {activeMap && (
        <div className="mb-8 bg-slate-800 p-6 rounded-xl border border-red-900/50 shadow-lg relative overflow-hidden">
          {respawnTimer > 0 && (
            <div className="absolute inset-0 bg-slate-900/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-4xl animate-bounce mb-2">💀</span>
              <span className="text-xl font-bold text-red-400">Enemy Defeated!</span>
              <span className="text-sm text-slate-400">Respawning in {respawnTimer}s...</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-2 relative z-0">
            <h3 className="text-2xl font-bold text-red-400">VS. {activeMap.enemyName}</h3>
            <button onClick={onStopCombat} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-white font-bold text-sm">Run Away 🏃</button>
          </div>
          
          <div className="w-full h-8 bg-slate-950 rounded-full border border-slate-700 overflow-hidden relative z-0">
            <div 
              className="h-full bg-orange-600 transition-all duration-100" 
              style={{ width: `${(enemyCurrentHp / activeMap.enemyHp) * 100}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
              Enemy HP: {Math.round(enemyCurrentHp)} / {activeMap.enemyHp}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMBAT_DATA.map(map => {
          const isUnlocked = map.id === 1 || maxMapCompleted >= (map.id - 1);
          const isCompleted = maxMapCompleted >= map.id;
          const isActive = currentMapId === map.id;
          const hasKey = !map.keyRequired || (inventory[map.keyRequired] && inventory[map.keyRequired] > 0);

          return (
            <button
              key={map.id}
              disabled={!isUnlocked || (!!map.keyRequired && !hasKey && !isCompleted)}
              onClick={() => onStartCombat(map.id)}
              className={`p-4 rounded-xl border text-left transition-all
                ${isActive ? 'bg-red-900/20 border-red-500 ring-1 ring-red-500' : 
                  !isUnlocked ? 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed' : 
                  'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-600'}
              `}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-slate-200">{map.name}</span>
                {isCompleted && <span className="text-emerald-500 text-xs font-bold">CLEARED ✓</span>}
                {!isUnlocked && <span className="text-slate-600 text-xs">LOCKED 🔒</span>}
              </div>
              <div className="text-sm text-slate-500 space-y-1">
                <p>Enemy: {map.enemyName}</p>
                <p>HP: {map.enemyHp} | Atk: {map.enemyAttack}</p>
                {map.isBoss && <p className="text-yellow-500 font-bold text-xs mt-2">⚠️ BOSS FIGHT</p>}
                {map.keyRequired && !isCompleted && (
                  <p className={`${hasKey ? 'text-green-400' : 'text-red-400'} text-xs`}>
                    {hasKey ? 'Key Found 🗝️' : 'Requires Key 🗝️'}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}