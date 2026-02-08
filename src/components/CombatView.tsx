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
    <div className="p-6 relative bg-slate-950 h-full overflow-y-auto custom-scrollbar">
      
      {/* --- MODALS --- */}
      {selectedFoodId && (
        <QuantityModal 
          itemId={selectedFoodId}
          maxAmount={Math.min(999, inventory[selectedFoodId] || 0)} 
          title={`Load Injector: ${getItemDetails(selectedFoodId)?.name}`}
          onClose={() => setSelectedFoodId(null)}
          onConfirm={(amount) => {
            onEquipFood(selectedFoodId, amount);
            setSelectedFoodId(null);
            setShowFoodModal(false);
          }}
        />
      )}

      {showFoodModal && !selectedFoodId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-cyan-500 uppercase tracking-widest">Select Energy Source</h3>
              <button onClick={() => setShowFoodModal(false)} className="text-slate-500 hover:text-white font-bold text-lg">✕</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {availableFoods.map(foodId => {
                const item = getItemDetails(foodId);
                return (
                  <button 
                    key={foodId}
                    onClick={() => setSelectedFoodId(foodId)}
                    className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex flex-col items-center gap-2 border border-slate-700 hover:border-cyan-500/50 transition-all group"
                  >
                    <img src={item?.icon} className="w-12 h-12 pixelated drop-shadow-md group-hover:scale-110 transition-transform" alt={item?.name} />
                    <span className="text-[10px] text-slate-300 font-bold text-center leading-tight mt-1">{item?.name}</span>
                    <span className="text-[10px] text-green-400 font-mono font-bold">REP +{item?.healing}</span>
                    <span className="text-[10px] text-slate-500">QTY: {inventory[foodId]}</span>
                  </button>
                );
              })}
              {availableFoods.length === 0 && <p className="col-span-4 text-slate-500 text-center text-sm font-mono py-6">NO COMPATIBLE ENERGY SOURCES DETECTED.</p>}
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <h2 className="text-2xl font-bold mb-8 text-slate-200 flex items-center gap-4 uppercase tracking-widest border-b border-slate-800 pb-4">
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
           <img src="/assets/skills/combat.png" className="w-8 h-8 pixelated" alt="Combat" />
        </div>
        Stabilization Protocol <span className="text-red-500/80 text-sm ml-auto font-mono font-normal">SECTOR: WORLD 1</span>
      </h2>

      {/* --- PLAYER HUD --- */}
      <div className="mb-8 flex flex-col sm:flex-row gap-5">
        <div className="flex-1 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
          
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div className="flex gap-4 items-center">
               <div className="w-16 h-16 rounded-xl border-2 border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner">
                 <img src="/assets/ui/avatar.png" className="w-full h-full object-cover pixelated opacity-90" alt="Hero" />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-1">Restorer Unit</h3>
                 <p className="text-[10px] text-slate-500 font-mono font-bold">SYSTEM INTEGRITY</p>
               </div>
            </div>
            <p className="text-slate-200 font-mono text-xl font-bold">{Math.round(hp)} <span className="text-slate-600 text-sm font-normal">/ {maxHp}</span></p>
          </div>
          
          <div className="w-full h-6 bg-slate-950 rounded-full border border-slate-700 relative overflow-hidden">
            <div 
              className="h-full bg-cyan-600 transition-all duration-300" 
              style={{ width: `${(hp / maxHp) * 100}%` }}
            ></div>
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhZWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-20"></div>
          </div>
        </div>

        {/* --- INJECTOR SLOT --- */}
        <button 
          onClick={() => setShowFoodModal(true)}
          className="w-full sm:w-28 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative hover:border-cyan-500/50 hover:bg-slate-800 transition-all group shadow-lg"
        >
          <span className="absolute top-2 left-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Injector</span>
          {activeFoodItem ? (
            <div className="flex flex-col items-center pt-4 pb-2">
              <img src={activeFoodItem.icon} className="w-14 h-14 pixelated drop-shadow-xl group-hover:scale-110 transition-transform" alt="Food" />
              <span className="absolute bottom-2 right-2 bg-slate-950 text-slate-200 text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
                {equippedFood?.count}
              </span>
              {foodTimer > 0 && (
                <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex items-center justify-center backdrop-blur-[1px] border border-red-900/50">
                  <span className="text-red-500 font-bold font-mono text-lg animate-pulse">{foodTimer}s</span>
                </div>
              )}
            </div>
          ) : (
            <img src="/assets/ui/slot_food.png" className="w-12 h-12 opacity-20 grayscale pixelated" alt="Empty" />
          )}
        </button>
      </div>

      {/* --- ENEMY HUD (ANOMALY) --- */}
      {activeMap && (
        <div className="mb-8 bg-slate-900 p-6 rounded-xl border border-red-900/40 shadow-[0_0_20px_rgba(185,28,28,0.1)] relative overflow-hidden">
          
          {/* Respawn Overlay */}
          {respawnTimer > 0 && (
            <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-5xl mb-4 opacity-70 grayscale pixelated animate-bounce">💥</span>
              <span className="text-lg font-bold text-emerald-500 uppercase tracking-widest mb-2">Anomaly Stabilized</span>
              <span className="text-xs text-slate-500 font-mono">Re-scanning zone in <span className="text-emerald-400 font-bold">{respawnTimer}s</span>...</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-4 relative z-10">
            <div>
               <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest flex items-center gap-3">
                 <span className="w-3 h-3 bg-red-500 animate-pulse rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                 {activeMap.enemyName}
               </h3>
               <p className="text-xs text-red-900/80 font-mono uppercase font-bold mt-1">Unstable Entity Detected</p>
            </div>
            
            <button onClick={onStopCombat} className="bg-slate-950 hover:bg-red-950/40 px-6 py-2 rounded-lg border border-slate-800 hover:border-red-800 text-red-500/80 font-bold text-xs uppercase tracking-wider transition-all">
              Disengage
            </button>
          </div>
          
          <div className="w-full h-8 bg-slate-950 rounded-full border border-slate-800 relative z-10 overflow-hidden">
            <div 
              className="h-full bg-red-700/90 transition-all duration-100" 
              style={{ width: `${(enemyCurrentHp / activeMap.enemyHp) * 100}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/70 font-mono tracking-widest shadow-black drop-shadow-md">
              INSTABILITY: {Math.round(enemyCurrentHp)} / {activeMap.enemyHp}
            </span>
          </div>
        </div>
      )}

      {/* --- ZONE SELECTOR --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
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
              className={`p-4 text-left transition-all border-2 rounded-lg group
                ${isActive ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] relative overflow-hidden' : 
                  !isUnlocked ? 'bg-slate-950 border-slate-900 opacity-40 cursor-not-allowed' : 
                  'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'}
              `}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>}
              
              <div className="flex justify-between items-center mb-2 pl-3">
                <span className={`font-bold text-base ${isActive ? 'text-red-400' : 'text-slate-200'}`}>{map.name}</span>
                {isCompleted && <span className="text-emerald-500 text-[10px] font-bold uppercase border border-emerald-900/40 px-2 py-0.5 rounded bg-emerald-950/40">Stabilized</span>}
                {!isUnlocked && <span className="text-slate-600 text-[10px] font-bold uppercase">Locked</span>}
              </div>
              
              <div className="text-xs text-slate-500 space-y-1 pl-3 font-mono">
                <p>TARGET: <span className="text-slate-400 font-bold">{map.enemyName}</span></p>
                <p className="flex gap-4">
                   <span>THR: {map.enemyAttack}</span>
                   <span>MASS: {map.enemyHp}</span>
                </p>
                {map.isBoss && <p className="text-yellow-600 font-bold mt-2 flex items-center gap-2">⚠️ CORE GUARDIAN</p>}
                {map.keyRequired && !isCompleted && (
                  <p className={`mt-2 font-bold ${hasKey ? 'text-emerald-500' : 'text-red-500'}`}>
                    [{hasKey ? 'ACCESS KEY FOUND' : 'ACCESS KEY REQUIRED'}]
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