import { useGameStore } from '../../store/useGameStore';
import { COMBAT_DATA } from '../../data/combat';
import type { CombatMap } from '../../types';

interface Props {
  selectedWorldId: number;
}

export default function ZoneSelector({ selectedWorldId }: Props) {
  // Haetaan storesta tarvittavat tilat ja funktiot
  const { 
    startCombat, 
    stopCombat, 
    combatStats, 
    combatSettings, 
    toggleAutoProgress 
  } = useGameStore();

  // Suodatetaan kartat (varmistetaan tyyppi 'any'-kikalla jos types.ts ei tue world-kenttää vielä)
  const zones = COMBAT_DATA.filter((map) => {
    const m = map as unknown as CombatMap & { world?: number };
    return m.world ? m.world === selectedWorldId : true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-sm border-l border-slate-800">
      
      {/* --- HEADER & AUTO PROGRESS SWITCH --- */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shadow-sm z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
            Campaign Zones
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            World {selectedWorldId}
          </span>
        </div>

        {/* AUTO PUSH NAPPI */}
        <div className="flex items-center gap-2 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
             <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Auto</span>
             <button 
                onClick={toggleAutoProgress}
                className={`
                  w-8 h-4 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50
                  ${combatSettings.autoProgress ? 'bg-emerald-600' : 'bg-slate-700'}
                `}
                title="Toggle Auto-Progress (Move to next zone on victory)"
             >
                <div 
                  className={`
                    absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm 
                    ${combatSettings.autoProgress ? 'translate-x-4' : 'translate-x-0.5'}
                  `} 
                />
             </button>
        </div>
      </div>

      {/* --- KARTTALISTA --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {zones.map((map) => {
          const m = map as unknown as CombatMap;
          const isLocked = m.id > combatStats.maxMapCompleted + 1;
          const isActive = combatStats.currentMapId === m.id;

          return (
            <button
              key={m.id}
              onClick={() => !isLocked && (isActive ? stopCombat() : startCombat(m.id))}
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
                <div>
                  <div className={`text-sm font-bold mb-0.5 ${isActive ? 'text-white' : isLocked ? 'text-slate-600' : 'text-slate-300'}`}>
                    {m.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <span className={`px-1 rounded ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                      Lvl {m.id}
                    </span>
                    <span className="text-slate-700">|</span>
                    <span>{m.enemyName}</span>
                  </div>
                </div>
                
                {/* Status Icon */}
                <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all
                    ${isActive 
                      ? 'bg-slate-900 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-slate-950 border-slate-800 group-hover:border-slate-600'
                    }
                `}>
                   {isLocked ? (
                      <span className="text-xs">🔒</span>
                   ) : m.image ? (
                       <img src={m.image} className={`w-5 h-5 object-contain ${isActive ? 'opacity-100' : 'opacity-60 grayscale group-hover:grayscale-0'}`} />
                   ) : (
                       <span className="text-xs opacity-50">⚔️</span>
                   )}
                </div>
              </div>
              
              {/* Active Indicator Glow */}
              {isActive && (
                  <div className="absolute left-0 bottom-0 top-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
              )}
            </button>
          );
        })}
        
        {/* Tyhjä tila lopussa scrollausta varten */}
        <div className="h-4 w-full"></div>
      </div>
    </div>
  );
}