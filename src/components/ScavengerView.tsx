import { useState, useEffect } from 'react';
import type { ScavengerState } from '../types';
import { WORLD_INFO, COMBAT_DATA } from '../data';

interface ScavengerViewProps {
  scavengerState: ScavengerState;
  maxMapCompleted: number;
  onStart: (worldId: number, durationMinutes: number) => void;
  onCancel: (expeditionId: string) => void;
  onClaim: (expeditionId: string) => void;
}

export default function ScavengerView({ scavengerState, maxMapCompleted, onStart, onCancel, onClaim }: ScavengerViewProps) {
  const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
  const [duration, setDuration] = useState(10); // minuutit
  
  // KORJAUS: Lazy initialization () => Date.now() estää "impure function" -virheen
  const [now, setNow] = useState(() => Date.now());

  // Päivitetään aikaa sekunnin välein, jotta palkit liikkuvat
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lasketaan mitkä maailmat ovat auki
  const isWorldUnlocked = (worldId: number) => {
    if (worldId === 1) return true;
    const previousWorldLastMapId = (worldId - 1) * 10; 
    return maxMapCompleted >= previousWorldLastMapId;
  };

  // Lasketaan montako aluetta on auki valitussa maailmassa
  const getUnlockedAreaCount = (worldId: number) => {
    const mapsInWorld = COMBAT_DATA.filter(m => m.world === worldId);
    const unlockedMaps = mapsInWorld.filter(m => m.id <= maxMapCompleted + 1);
    return `${unlockedMaps.length} / ${mapsInWorld.length}`;
  };

  return (
    <div className="p-6 h-full bg-slate-950 overflow-y-auto custom-scrollbar">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-3">
            <img src="/assets/skills/scavenging.png" className="w-8 h-8 pixelated" alt="Scavenging" />
            Expeditions
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Send teams to scavenge resources from unlocked regions. 
            Loot is gathered only from areas you have discovered in the selected world.
          </p>
        </div>
        
        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 flex flex-col items-end">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Teams</span>
          <span className="text-xl font-mono text-amber-400 font-bold">
            {scavengerState.activeExpeditions.length} / {scavengerState.unlockedSlots}
          </span>
        </div>
      </div>

      {/* ACTIVE EXPEDITIONS LIST */}
      {scavengerState.activeExpeditions.length > 0 && (
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scavengerState.activeExpeditions.map(exp => {
            const world = WORLD_INFO[exp.mapId];
            
            // Käytetään 'now' tilamuuttujana
            const timeLeft = Math.max(0, (exp.startTime + exp.duration) - now);
            const progress = Math.min(100, ((now - exp.startTime) / exp.duration) * 100);
            
            return (
              <div key={exp.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 relative overflow-hidden group">
                {/* Background Image Faded */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <img src={world?.image} className="w-full h-full object-cover grayscale" alt="world bg" />
                </div>

                <div className="relative z-10 flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-200 uppercase text-sm mb-1">{world?.name || `World ${exp.mapId}`}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                      {Math.floor(exp.duration / 60000)} min
                    </span>
                  </div>
                  {exp.completed ? (
                    <span className="text-green-400 text-xs font-bold animate-pulse">● COMPLETED</span>
                  ) : (
                    <span className="text-amber-400 text-xs font-bold font-mono">
                      {Math.ceil(timeLeft / 1000)}s
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mb-4">
                  <div 
                    className={`h-full transition-all duration-1000 ${exp.completed ? 'bg-green-500' : 'bg-amber-500'}`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  {exp.completed ? (
                    <button 
                      onClick={() => onClaim(exp.id)}
                      className="flex-1 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold uppercase rounded shadow-lg transition-colors"
                    >
                      Claim Loot
                    </button>
                  ) : (
                    <button 
                      onClick={() => onCancel(exp.id)}
                      className="flex-1 py-2 bg-red-950/50 hover:bg-red-900/80 text-red-400 text-xs font-bold uppercase rounded border border-red-900/50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WORLD SELECTION GRID */}
      <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest mb-4 border-l-4 border-amber-600 pl-3">
        Deploy New Expedition
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
        {Object.entries(WORLD_INFO).map(([idStr, info]) => {
          const id = parseInt(idStr);
          const unlocked = isWorldUnlocked(id);
          const isSelected = selectedWorld === id;

          return (
            <div 
              key={id} 
              onClick={() => unlocked && setSelectedWorld(id)}
              className={`relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-64 group
                ${!unlocked 
                  ? 'bg-slate-950 border-slate-800 opacity-50 grayscale cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-slate-900 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] transform -translate-y-1' 
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
            >
              {/* World Image */}
              <div className="h-32 bg-slate-950 relative border-b border-slate-800 flex items-center justify-center overflow-hidden">
                {unlocked ? (
                   <img 
                     src={info.image} 
                     alt={info.name} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                   />
                ) : (
                   <span className="text-4xl">🔒</span>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                  WORLD {id}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`font-bold uppercase tracking-wide mb-1 ${unlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                    {info.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight mb-2 h-8 overflow-hidden">
                    {unlocked ? info.description : "Region locked. Complete previous maps to unlock."}
                  </p>
                </div>

                {unlocked && (
                  <div className="flex items-center gap-2 text-xs text-amber-400/80 font-mono bg-amber-950/20 px-2 py-1 rounded w-fit">
                    <span>📍</span> Areas: {getUnlockedAreaCount(id)}
                  </div>
                )}
              </div>

              {/* Selection Overlay */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-amber-500 rounded-xl pointer-events-none z-20"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOTTOM CONTROL PANEL (Fixed) */}
      {selectedWorld && (
        <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-slate-900 border-t border-slate-800 p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center overflow-hidden">
                <img src={WORLD_INFO[selectedWorld].image} className="w-full h-full object-cover" alt="Target" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold">Target Region</div>
                <div className="text-lg font-bold text-amber-400">{WORLD_INFO[selectedWorld].name}</div>
              </div>
            </div>

            <div className="flex-1 w-full sm:w-auto">
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold uppercase">
                <span>Duration</span>
                <span className="text-white">{duration} min</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="480" 
                step="10"
                value={duration} 
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                <span>10m</span>
                <span>8h</span>
              </div>
            </div>

            <button 
              onClick={() => {
                onStart(selectedWorld, duration);
                setSelectedWorld(null);
              }}
              disabled={scavengerState.activeExpeditions.length >= scavengerState.unlockedSlots}
              className="w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {scavengerState.activeExpeditions.length >= scavengerState.unlockedSlots 
                ? "Slots Full" 
                : "Deploy Team"
              }
            </button>
          </div>
        </div>
      )}

    </div>
  );
}