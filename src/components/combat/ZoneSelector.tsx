import { useGameStore } from '../../store/useGameStore';
import { COMBAT_DATA } from '../../data/combat';
import type { CombatMap } from '../../types';

interface Props {
  selectedWorldId: number;
}

export default function ZoneSelector({ selectedWorldId }: Props) {
  const { 
    startCombat, 
    stopCombat, 
    combatStats, 
    combatSettings, 
    toggleAutoProgress,
    inventory 
  } = useGameStore();

  const zones = COMBAT_DATA.filter((map: CombatMap) => map.world === selectedWorldId);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-sm border-l border-slate-800">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shadow-sm z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
            Campaign Zones
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            World {selectedWorldId}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
             <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Auto</span>
             <button 
                onClick={toggleAutoProgress}
                className={`
                  w-8 h-4 rounded-full relative transition-colors duration-200
                  ${combatSettings.autoProgress ? 'bg-emerald-600' : 'bg-slate-700'}
                `}
             >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm ${combatSettings.autoProgress ? 'translate-x-4' : 'translate-x-0.5'}`} />
             </button>
        </div>
      </div>

      {/* ZONE LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {zones.map((map) => {
          const isActive = combatStats.currentMapId === map.id;
          
          // AVAIN-TARKISTUKSET
          const keyCount = map.keyRequired ? (inventory[map.keyRequired] || 0) : 0;
          const hasKey = !map.keyRequired || keyCount > 0;
          const isProgressionLocked = map.id > combatStats.maxMapCompleted + 1;
          const isLocked = isProgressionLocked || (map.isBoss && !hasKey);

          return (
            <button
              key={map.id}
              onClick={() => !isLocked && (isActive ? stopCombat() : startCombat(map.id))}
              disabled={isLocked}
              className={`
                w-full p-4 border-b border-slate-800/50 text-left transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-emerald-900/10 border-l-4 border-l-emerald-500' 
                  : isLocked 
                    ? 'opacity-40 cursor-not-allowed bg-slate-950' 
                    : 'hover:bg-slate-800/40 border-l-4 border-l-transparent hover:border-l-slate-600'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-2">
                  <div className={`text-sm font-bold mb-0.5 flex items-center gap-2 ${isActive ? 'text-white' : isLocked ? 'text-slate-600' : 'text-slate-300'}`}>
                    <span className="truncate">{map.name}</span>
                    {map.isBoss && (
                      <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${keyCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                        🔑 {keyCount}/1
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex flex-wrap items-center gap-1">
                    <span className={`px-1 rounded ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                      Lvl {map.id}
                    </span>
                    {map.isBoss && !hasKey && (
                      <span className="text-red-500 font-bold uppercase text-[8px] bg-red-500/10 px-1 rounded border border-red-500/20">
                        Needs Key
                      </span>
                    )}
                    <span className="text-slate-700">|</span>
                    <span className="truncate">{map.enemyName}</span>
                  </div>
                </div>
                
                <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all
                    ${isActive 
                      ? 'bg-slate-900 border-emerald-500/30' 
                      : isLocked ? 'bg-slate-950 border-slate-900' : 'bg-slate-950 border-slate-800'
                    }
                `}>
                   {isProgressionLocked ? (
                      <span className="text-xs">🔒</span>
                   ) : map.isBoss && !hasKey ? (
                      <span className="text-xs">🔑</span>
                   ) : map.image ? (
                       <img src={map.image} className={`w-5 h-5 object-contain ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}`} alt="" />
                   ) : (
                       <span className="text-xs opacity-50">⚔️</span>
                   )}
                </div>
              </div>
              
              {isActive && (
                  <div className="absolute left-0 bottom-0 top-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}