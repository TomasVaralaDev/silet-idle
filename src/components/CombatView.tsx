import { useGameStore } from '../store/useGameStore';
import { COMBAT_DATA, getItemDetails } from '../data';
import { getRarityStyle } from '../utils/rarity';
import type { Resource } from '../types';

export default function CombatView() {
  const combatState = useGameStore(state => state.combatStats);
  const hpLevel = useGameStore(state => state.skills.hitpoints.level);
  const inventory = useGameStore(state => state.inventory);
  const equipment = useGameStore(state => state.equipment);
  const activeAction = useGameStore(state => state.activeAction);
  const autoProgress = useGameStore(state => state.combatSettings.autoProgress);

  const toggleAutoProgress = useGameStore(state => state.toggleAutoProgress);
  const equipFood = useGameStore(state => state.equipFood);
  const startCombat = useGameStore(state => state.startCombat);
  const stopCombat = useGameStore(state => state.stopCombat);

  const maxHp = hpLevel * 10;
  
  const foodItems = Object.keys(inventory).filter(id => {
    const item = getItemDetails(id) as Resource | null;
    return item?.category === 'Food';
  });

  const currentMap = COMBAT_DATA.find(m => m.id === combatState.currentMapId);
  const isFighting = activeAction?.skill === 'combat' && combatState.currentMapId;

  const playerHpPercent = Math.max(0, Math.min(100, (combatState.hp / maxHp) * 100));
  const enemyMaxHp = currentMap ? currentMap.enemyHp : 100;
  const enemyHpPercent = Math.max(0, Math.min(100, (combatState.enemyCurrentHp / enemyMaxHp) * 100));

  const logs = combatState.combatLog || [];

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/assets/bg/combat_grid.png')] opacity-10 pointer-events-none"></div>

      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 z-10 shadow-md">
        <div className="flex items-center gap-4">
           <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 border
             ${isFighting ? 'bg-red-900/30 text-red-400 border-red-900/50 animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
             <div className={`w-2 h-2 rounded-full ${isFighting ? 'bg-red-500' : 'bg-slate-600'}`}></div>
             {isFighting ? 'Combat Active' : 'Idle'}
           </div>
           
           <button 
             onClick={toggleAutoProgress}
             className={`px-3 py-1 rounded text-xs font-bold uppercase border transition-all
               ${autoProgress 
                 ? 'bg-amber-600/20 text-amber-400 border-amber-600/50 hover:bg-amber-600/30' 
                 : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'}`}
           >
             Auto-Progress: {autoProgress ? 'ON' : 'OFF'}
           </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500">Quick Eat:</span>
          <select 
            className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded p-1 outline-none focus:border-indigo-500"
            onChange={(e) => e.target.value && equipFood(e.target.value, 100)}
            value=""
          >
            <option value="">Equip Food...</option>
            {foodItems.map(id => (
              <option key={id} value={id}>
                {getItemDetails(id)?.name} ({inventory[id]})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 relative z-10 custom-scrollbar">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center items-center relative overflow-hidden min-h-[300px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800 font-black text-6xl opacity-20 pointer-events-none italic">VS</div>
            <div className="w-full flex justify-between items-end max-w-lg mx-auto relative z-10">
              {/* PLAYER */}
              <div className="flex flex-col items-center gap-4 w-1/3 group">
                 <div className="w-full bg-slate-950 h-3 rounded-full border border-slate-800 overflow-hidden relative">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${playerHpPercent}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white shadow-black drop-shadow-md">
                      {Math.ceil(combatState.hp)} / {maxHp}
                    </span>
                 </div>
                 <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 rounded-xl border-2 border-slate-600 flex items-center justify-center relative shadow-2xl transition-transform ${isFighting ? 'animate-bounce-slight' : ''}`}>
                    {equipment.weapon && <img src={getItemDetails(equipment.weapon)?.icon} alt="weapon" className="absolute -right-4 top-0 w-10 h-10 pixelated z-20 drop-shadow-lg" />}
                    {equipment.body && <img src={getItemDetails(equipment.body)?.icon} alt="body" className="absolute inset-0 w-full h-full object-contain pixelated z-10 opacity-80" />}
                    <img src="/assets/ui/icon_user_avatar.png" alt="avatar" className="w-12 h-12 pixelated opacity-50" />
                 </div>
                 <div className="text-center">
                   <div className="font-bold text-slate-200">You</div>
                   <div className="text-[10px] text-slate-500">Lvl {hpLevel}</div>
                 </div>
              </div>
              {/* ENEMY */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                 {currentMap ? (
                   <>
                     <div className="w-full bg-slate-950 h-3 rounded-full border border-slate-800 overflow-hidden relative">
                        <div className="h-full bg-red-500 transition-all duration-200" style={{ width: `${enemyHpPercent}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white shadow-black drop-shadow-md">
                          {Math.ceil(combatState.enemyCurrentHp)} / {enemyMaxHp}
                        </span>
                     </div>
                     <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-red-950/30 rounded-xl border-2 border-red-900/50 flex items-center justify-center shadow-xl relative ${combatState.respawnTimer > 0 ? 'opacity-50 grayscale' : 'animate-pulse-slow'}`}>
                        {combatState.respawnTimer > 0 ? <div className="text-2xl font-bold text-slate-500">{combatState.respawnTimer}s</div> : <img src="/assets/ui/icon_skull.png" alt="skull" className="w-12 h-12 opacity-80" />}
                     </div>
                     <div className="text-center">
                       <div className="font-bold text-red-400">{currentMap.enemyName}</div>
                       <div className="text-[10px] text-red-900/60">Level {currentMap.enemyAttack}</div>
                     </div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full opacity-30">
                     <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-700"></div>
                     <span className="text-xs mt-2 font-bold uppercase">No Target</span>
                   </div>
                 )}
              </div>
            </div>
          </div>
          <div className="h-48 bg-black/40 rounded-xl border border-slate-800 p-3 overflow-y-auto custom-scrollbar font-mono text-xs">
            {logs.length === 0 && <div className="text-slate-600 italic text-center mt-4">Combat log is empty...</div>}
            {logs.map((log: string, i: number) => (
              <div key={i} className={`mb-1 ${log.includes("Player hit") ? "text-green-400/80" : log.includes("Enemy hit") ? "text-red-400/80" : log.includes("Loot") ? "text-amber-400 font-bold" : log.includes("Defeated") ? "text-purple-400 font-bold border-b border-slate-800 pb-1 mb-1" : "text-slate-400"}`}>
                <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
          <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs border-b border-slate-800 pb-2">Campaign Maps</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 max-h-[600px]">
            {COMBAT_DATA.map((map) => {
              const isActive = combatState.currentMapId === map.id;
              const isUnlocked = map.id === 1 || combatState.maxMapCompleted >= map.id - 1;
              const drops = map.drops.map(d => getItemDetails(d.itemId)).filter(Boolean);
              if (!isUnlocked) return null;
              return (
                <button
                  key={map.id}
                  onClick={() => isActive ? stopCombat() : startCombat(map.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all group relative overflow-hidden ${isActive ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'}`}
                >
                  <div className="flex justify-between items-start mb-1 relative z-10">
                    <span className={`font-bold text-sm ${isActive ? 'text-red-400' : 'text-slate-300'}`}>{map.id}. {map.name}</span>
                    {isActive && <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse">ACTIVE</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2 relative z-10">Enemy: <span className="text-slate-400">{map.enemyName}</span> (HP: {map.enemyHp})</div>
                  <div className="flex gap-1 relative z-10">
                    {drops.slice(0, 4).map((item, idx) => {
                       const style = getRarityStyle(item?.rarity || 'common');
                       return <div key={idx} className={`w-5 h-5 bg-slate-950 rounded border ${style.border} flex items-center justify-center`} title={item?.name}><img src={item?.icon} alt="drop" className="w-3 h-3 pixelated" /></div>
                    })}
                    {drops.length > 4 && <span className="text-[9px] text-slate-600 self-end">+{drops.length - 4}</span>}
                  </div>
                  {map.keyRequired && <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-10 group-hover:opacity-100 transition-opacity"><img src="/assets/items/key_frozen.png" alt="key" className="w-8 h-8 opacity-50" /></div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}