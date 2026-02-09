import { useState } from 'react';
import type { CombatState, GameState, Resource, SkillType } from '../types';
import { COMBAT_DATA, getItemDetails } from '../data';

interface CombatViewProps {
  combatState: CombatState;
  inventory: GameState['inventory'];
  equippedFood: GameState['equippedFood'];
  skills: GameState['skills'];       
  equipment: GameState['equipment']; 
  autoProgress: boolean;              
  onToggleAutoProgress: () => void;   
  onEquipFood: (itemId: string, amount: number) => void;
  onStartCombat: (mapId: number) => void;
  onStopCombat: () => void;
}

const WORLD_NAMES: Record<number, string> = {
  1: "Greenvale",
  2: "Stonefall",
  3: "Ashridge",
  4: "Frostreach",
  5: "Duskwood",
  6: "Stormcoast",
  7: "Void Expanse",
  8: "Eternal Nexus"
};

export default function CombatView({ 
  combatState, 
  inventory, 
  equippedFood, 
  skills,
  equipment,
  autoProgress,
  onToggleAutoProgress,
  onEquipFood, 
  onStartCombat, 
  onStopCombat 
}: CombatViewProps) {

  const initialWorld = combatState.currentMapId 
    ? COMBAT_DATA.find(m => m.id === combatState.currentMapId)?.world || 1
    : 1;

  const [selectedWorld, setSelectedWorld] = useState<number>(initialWorld);
  const uniqueWorlds = Array.from(new Set(COMBAT_DATA.map(m => m.world)));

  const foodItem = equippedFood ? (getItemDetails(equippedFood.itemId) as Resource) : null;

  const calculatePlayerStats = () => {
    const weaponItem = equipment.weapon ? getItemDetails(equipment.weapon) as Resource : null;
    const combatStyle = weaponItem?.combatStyle || 'melee'; 
    const skillLevel = skills[combatStyle as SkillType]?.level || 1;
    
    const gearAttackBonus = Object.values(equipment).reduce((acc, id) => {
      if (!id) return acc;
      const item = getItemDetails(id) as Resource;
      return acc + (item?.stats?.attack || 0);
    }, 0);

    const totalAttack = Math.floor(1 + gearAttackBonus + (skillLevel * 0.5));

    const defenseLevel = skills.defense.level;
    const gearDefenseBonus = Object.values(equipment).reduce((acc, id) => {
      if (!id) return acc;
      const item = getItemDetails(id) as Resource;
      return acc + (item?.stats?.defense || 0);
    }, 0);
    
    const totalDefense = defenseLevel + gearDefenseBonus;

    return { totalAttack, totalDefense, gearAttackBonus, gearDefenseBonus };
  };

  const stats = calculatePlayerStats();

  const availableFood = Object.entries(inventory)
    .map(([id, count]) => {
      const item = getItemDetails(id) as Resource;
      return item && item.healing ? { ...item, count, id } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => (b.healing || 0) - (a.healing || 0));

  const currentMap = combatState.currentMapId 
    ? COMBAT_DATA.find(m => m.id === combatState.currentMapId) 
    : null;

  const playerHpPercent = combatState.maxHp ? (combatState.hp / combatState.maxHp) * 100 : 0;
  const enemyHpPercent = currentMap ? (combatState.enemyCurrentHp / currentMap.enemyHp) * 100 : 0;

  const isWorldUnlocked = (world: number) => {
    if (world === 1) return true;
    const previousWorldLastMapId = (world - 1) * 10; 
    return combatState.maxMapCompleted >= previousWorldLastMapId;
  };

  const filteredMaps = COMBAT_DATA.filter(m => m.world === selectedWorld);

  return (
    <div className="p-6 h-full flex flex-col xl:flex-row gap-6 bg-slate-950 overflow-y-auto custom-scrollbar font-sans">
      
      {/* --- LEFT COLUMN: BATTLE & STATS --- */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* 1. BATTLE ARENA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 relative overflow-hidden shadow-2xl flex flex-col min-h-[420px]">
          <div className="absolute inset-0 bg-[url('/assets/bg/combat_grid.png')] opacity-10 pointer-events-none"></div>
          
          {/* --- AUTO PROGRESS TOGGLE (VISIBLE IN COMBAT & IDLE) --- */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-700 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Auto-Push</span>
            <button 
              onClick={onToggleAutoProgress}
              className={`w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out border border-transparent ${autoProgress ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 absolute top-0.5 left-1 ${autoProgress ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-950 rounded-xl relative z-10 flex flex-col justify-between p-8">
            
            {currentMap ? (
              <>
                {/* ENEMY (TOP) */}
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <div className="relative group mb-6">
                     {/* ENEMY IMAGE CONTAINER */}
                     <div className="w-28 h-28 bg-slate-950 rounded-full border-4 border-red-900/60 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.15)] group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        {currentMap.image ? (
                          <img src={currentMap.image} className="w-full h-full object-cover pixelated" alt={currentMap.enemyName} />
                        ) : (
                          <span className="text-6xl drop-shadow-lg">👾</span>
                        )}
                     </div>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-950 border border-red-800 px-4 py-1 rounded-full text-xs font-bold text-red-200 uppercase tracking-wider whitespace-nowrap">
                       Lvl.{currentMap.enemyAttack * 2}
                     </div>
                  </div>
                  
                  <div className="text-center w-full max-w-md">
                    <h2 className="text-xl font-bold text-red-100 uppercase tracking-widest mb-2 drop-shadow-md">{currentMap.enemyName}</h2>
                    <div className="w-full h-6 bg-slate-950 rounded-full border border-slate-700 relative overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300 ease-out" style={{ width: `${enemyHpPercent}%` }}></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white/90 drop-shadow-sm">
                        {Math.ceil(combatState.enemyCurrentHp)} / {currentMap.enemyHp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center py-4 opacity-20 text-6xl font-black italic tracking-widest text-slate-500 select-none">VS</div>

                {/* PLAYER (BOTTOM) */}
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md mb-8">
                    <div className="flex justify-between text-sm font-bold text-slate-400 mb-1 px-1">
                      <span>YOU</span>
                      <span>{Math.ceil(combatState.hp)} / {combatState.maxHp} HP</span>
                    </div>
                    <div className="w-full h-8 bg-slate-950 rounded-full border border-slate-700 relative overflow-hidden shadow-lg">
                      <div className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-all duration-300 ease-out" style={{ width: `${playerHpPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Active Food Display */}
                    <div className="relative group cursor-help">
                      <div className={`w-16 h-16 bg-slate-900 border-2 rounded-xl flex items-center justify-center relative shadow-lg transition-all
                          ${equippedFood ? 'border-emerald-500 shadow-emerald-900/20' : 'border-slate-800 border-dashed opacity-50'}`}>
                        {foodItem ? (
                          <>
                            <img src={foodItem.icon} className="w-10 h-10 pixelated" alt="Food" />
                            <div className="absolute -top-3 -right-3 bg-slate-950 text-xs font-bold px-2 py-0.5 rounded border border-slate-700 text-white shadow-sm">
                              {equippedFood?.count}
                            </div>
                            {combatState.foodTimer > 0 && (
                              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-sm font-mono text-white font-bold">{combatState.foodTimer}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-600 font-bold uppercase">Empty</span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={onStopCombat}
                      className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white border-b-4 border-red-800 active:border-b-0 active:translate-y-1 rounded-lg font-bold uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all text-sm"
                    >
                      Retreat
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                <div className="w-28 h-28 rounded-full border-4 border-slate-800 flex items-center justify-center mb-6 opacity-50">
                  <span className="text-5xl">⚔️</span>
                </div>
                <p className="text-lg font-bold uppercase tracking-widest">Zone Secure</p>
                <p className="text-sm opacity-50 mt-2">Select a location to engage</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. STATS DASHBOARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1 bg-orange-600/50"></div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors"></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Combat Power</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-orange-400">{stats.totalAttack}</span>
                <span className="text-sm text-orange-600 font-bold">(+{stats.gearAttackBonus})</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center">
               {equipment.weapon ? (
                 <img src={getItemDetails(equipment.weapon)?.icon} className="w-10 h-10 pixelated" alt="Weapon" />
               ) : (
                 <span className="text-3xl opacity-20">🗡️</span>
               )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1 bg-cyan-600/50"></div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors"></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Defense Rating</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-cyan-400">{stats.totalDefense}</span>
                <span className="text-sm text-cyan-600 font-bold">(+{stats.gearDefenseBonus})</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center">
               {equipment.body ? (
                 <img src={getItemDetails(equipment.body)?.icon} className="w-10 h-10 pixelated" alt="Armor" />
               ) : (
                 <span className="text-3xl opacity-20">🛡️</span>
               )}
            </div>
          </div>
        </div>

        {/* 3. FOOD BELT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Rationing Belt
            </h3>
            <span className="text-xs text-slate-600 font-mono">{availableFood.length} Items</span>
          </div>
          
          {availableFood.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 italic">No food in inventory.</p>
              <p className="text-xs text-slate-700 mt-1">Cook fish to stock up.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-52 overflow-y-auto custom-scrollbar pr-2">
              {availableFood.map(food => {
                const isEquipped = equippedFood?.itemId === food.id;
                return (
                  <button
                    key={food.id}
                    onClick={() => onEquipFood(food.id, food.count)}
                    className={`relative p-3 rounded-lg border-2 text-left transition-all group flex flex-col items-center gap-2
                      ${isEquipped 
                        ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'}`}
                  >
                    <div className="relative">
                      <img src={food.icon} className="w-12 h-12 pixelated drop-shadow-md group-hover:scale-110 transition-transform" alt={food.name} />
                      {isEquipped && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">EQ</div>
                      )}
                    </div>
                    <div className="w-full text-center">
                      <div className="text-xs font-bold text-slate-300 truncate w-full leading-tight mb-1">{food.name}</div>
                      <div className="flex justify-center gap-2">
                        <span className="text-[10px] font-mono text-green-400 bg-green-950/50 px-1.5 rounded">+{food.healing}HP</span>
                        <span className="text-[10px] font-mono text-slate-500">x{food.count}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* --- RIGHT COLUMN: MAP SELECTION --- */}
      <div className="w-full xl:w-[500px] flex-shrink-0 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl h-fit">
        
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Select Region</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {uniqueWorlds.map(worldNum => {
              const unlocked = isWorldUnlocked(worldNum);
              return (
                <button
                  key={worldNum}
                  onClick={() => unlocked && setSelectedWorld(worldNum)}
                  disabled={!unlocked}
                  className={`p-4 rounded-lg border-2 transition-all relative text-left flex flex-col justify-center min-h-[70px]
                    ${selectedWorld === worldNum 
                      ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20' 
                      : unlocked 
                        ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                        : 'bg-slate-950/50 text-slate-700 border-slate-800/50 cursor-not-allowed opacity-60'
                    }`}
                >
                  <span className="text-[10px] uppercase opacity-60 leading-none mb-1">World {worldNum}</span>
                  <span className="text-sm font-black uppercase tracking-wider truncate w-full font-sans">
                    {WORLD_NAMES[worldNum]}
                  </span>
                  {!unlocked && <span className="absolute top-3 right-3 text-sm grayscale opacity-50">🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar max-h-[700px]">
          <div className="flex items-center justify-between mb-3 px-1">
             <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">{WORLD_NAMES[selectedWorld]} Zones</span>
             <span className="text-[10px] text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono">
               Zone {((selectedWorld - 1) * 10) + 1} - {selectedWorld * 10}
             </span>
          </div>
          
          {filteredMaps.map((map) => {
            const isUnlocked = map.id === 1 || combatState.maxMapCompleted >= map.id - 1;
            const isCompleted = combatState.maxMapCompleted >= map.id;
            const isActive = combatState.currentMapId === map.id;
            
            const keyCount = map.keyRequired ? (inventory[map.keyRequired] || 0) : 0;
            
            return (
              <button
                key={map.id}
                disabled={!isUnlocked || (combatState.currentMapId !== null && !isActive)}
                onClick={() => onStartCombat(map.id)}
                className={`w-full p-4 rounded-lg border-l-4 text-left transition-all relative group shadow-sm hover:shadow-md
                  ${isActive
                    ? 'bg-red-950/30 border-l-red-500 border-y border-r border-y-red-900/30 border-r-red-900/30 cursor-default' 
                    : !isUnlocked 
                      ? 'bg-slate-950 border-l-slate-800 border-y border-r border-slate-800 opacity-50 cursor-not-allowed grayscale' 
                      : 'bg-slate-900 border-l-slate-600 border-y border-r border-slate-800 hover:bg-slate-800 hover:border-l-cyan-400'
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-red-400' : 'text-slate-200'}`}>
                    {map.name}
                  </span>
                  
                  {map.keyRequired && (
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ml-auto mr-3
                      ${keyCount > 0 ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300' : 'bg-slate-950 border-red-900/50 text-red-500'}`}
                      title="Required Key"
                    >
                      <img src="/assets/items/key_frozen.png" className="w-3 h-3 opacity-90" alt="Key" />
                      <span>{keyCount}</span>
                    </div>
                  )}

                  {isCompleted && !map.keyRequired && <span className="text-emerald-500 text-[10px] font-bold">✓ CLEARED</span>}
                  {isCompleted && map.keyRequired && <span className="text-emerald-500 text-[10px] font-bold">✓</span>}
                  {!isUnlocked && <span className="text-slate-600 text-sm">🔒</span>}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                    Lvl.{map.enemyAttack * 2}
                  </span>
                  <span className="truncate max-w-[150px]">{map.enemyName}</span>
                  <span className="ml-auto text-slate-200 font-bold">{map.enemyHp} HP</span>
                </div>

                {map.isBoss && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}