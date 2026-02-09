import { useState, useEffect } from 'react';
import type { Expedition, GameState } from '../types';
import { COMBAT_DATA } from '../data';

interface ScavengerViewProps {
  scavengerState: GameState['scavenger'];
  maxMapCompleted: number;
  onStart: (mapId: number, durationMinutes: number) => void;
  onCancel: (expeditionId: string) => void;
  onClaim: (expeditionId: string) => void;
}

export default function ScavengerView({ scavengerState, maxMapCompleted, onStart, onCancel, onClaim }: ScavengerViewProps) {
  const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(60); 

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const handleStartClick = () => {
    if (selectedMapId) {
      onStart(selectedMapId, sliderValue);
      setSelectedMapId(null);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col xl:flex-row gap-6 bg-slate-950 overflow-y-auto custom-scrollbar">
      
      {/* --- LEFT: ACTIVE EXPEDITIONS --- */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest">
            Active Operations 
          </h2>
          <span className="text-xs font-mono text-indigo-400 font-bold">
            SLOTS: {scavengerState.activeExpeditions.length} / {scavengerState.unlockedSlots}
          </span>
        </div>

        {scavengerState.activeExpeditions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl min-h-[200px] text-slate-600">
            {/* KORJAUS: Emoji -> Kuva */}
            <img src="/assets/ui/icon_scope.png" className="w-16 h-16 opacity-20 pixelated mb-2" alt="Scope" />
            <p className="font-mono uppercase text-xs tracking-widest">No active expeditions</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {scavengerState.activeExpeditions.map(exp => (
              <ActiveExpeditionCard 
                key={exp.id} 
                expedition={exp} 
                onCancel={onCancel} 
                onClaim={onClaim} 
              />
            ))}
          </div>
        )}
      </div>

      {/* --- RIGHT: PLANNING CONSOLE --- */}
      <div className="w-full xl:w-[450px] bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-fit shadow-xl flex-shrink-0">
        <div className="mb-6 flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-950/50 rounded-lg flex items-center justify-center border border-indigo-500/30">
             {/* KORJAUS: Emoji -> Kuva */}
             <img src="/assets/ui/icon_map.png" className="w-8 h-8 pixelated opacity-90" alt="Map" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-wide">Mission Control</h3>
             <p className="text-xs text-slate-500">Deploy scavengers to unlocked zones.</p>
           </div>
        </div>

        {/* 1. ZONE SELECTION */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Target Zone</label>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1 bg-slate-950/50 p-2 rounded border border-slate-800">
            {COMBAT_DATA.map(map => {
              const isUnlocked = map.id === 1 || maxMapCompleted >= map.id - 1;
              return (
                <button
                  key={map.id}
                  disabled={!isUnlocked}
                  onClick={() => setSelectedMapId(map.id)}
                  className={`flex justify-between items-center p-3 rounded border text-left transition-all
                    ${!isUnlocked 
                      ? 'bg-slate-900 border-slate-800 opacity-40 cursor-not-allowed' 
                      : selectedMapId === map.id 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/50' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300'
                    }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase">{map.name}</span>
                    <span className="text-[10px] opacity-70">Lvl.{map.enemyAttack * 2} Enemies</span>
                  </div>
                  {!isUnlocked && <span className="text-xs">🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DURATION SLIDER */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</label>
            <span className="text-2xl font-mono font-bold text-indigo-400">{formatDuration(sliderValue)}</span>
          </div>
          
          <input 
            type="range" 
            min="30" 
            max="1440" 
            step="30"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-2 font-mono font-bold">
            <span>30m</span>
            <span>12h</span>
            <span>24h</span>
          </div>
        </div>

        {/* 3. DEPLOY BUTTON */}
        <button
          disabled={!selectedMapId || scavengerState.activeExpeditions.length >= scavengerState.unlockedSlots}
          onClick={handleStartClick}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.2em] rounded shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"
        >
          {scavengerState.activeExpeditions.length >= scavengerState.unlockedSlots 
            ? "Capacity Full" 
            : !selectedMapId 
              ? "Select Zone" 
              : "Deploy Team"}
        </button>

        <p className="text-[10px] text-slate-500 mt-4 text-center italic">
          Warning: Canceling returns scavengers empty-handed.
        </p>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: ACTIVE EXPEDITION CARD ---
function ActiveExpeditionCard({ expedition, onCancel, onClaim }: { expedition: Expedition, onCancel: (id: string) => void, onClaim: (id: string) => void }) {
  const mapInfo = COMBAT_DATA.find(m => m.id === expedition.mapId);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const end = expedition.startTime + expedition.duration;
      const remaining = Math.max(0, end - now);
      const total = expedition.duration;
      const elapsed = now - expedition.startTime;
      const prog = Math.min(100, (elapsed / total) * 100);

      setTimeLeft(remaining);
      setProgress(prog);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expedition]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden
      ${expedition.completed 
        ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
        : 'bg-slate-900 border-slate-700'}`}
    >
      
      {!expedition.completed && (
        <div className="absolute top-0 left-0 h-full bg-slate-800/50 -z-10 transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
      )}

      <div className="flex justify-between items-center mb-3 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded flex items-center justify-center border ${expedition.completed ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-950 border-slate-700'}`}>
            {/* KORJAUS: Emojit (✅ / ⏳ / 📦) -> Kuvat */}
            {expedition.completed ? (
               <img src="/assets/ui/icon_box.png" className="w-6 h-6 pixelated animate-bounce" alt="Loot" />
            ) : (
               <img src="/assets/ui/icon_clock.png" className="w-6 h-6 pixelated opacity-70" alt="Timer" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">{mapInfo?.name || 'Unknown Zone'}</h4>
            <div className="text-xs font-mono text-slate-400">
              {expedition.completed ? <span className="text-emerald-400 font-bold">Mission Complete</span> : `Return in: ${formatTime(timeLeft)}`}
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          {expedition.completed ? (
            <button 
              onClick={() => onClaim(expedition.id)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg animate-pulse"
            >
              Claim Loot
            </button>
          ) : (
            <button 
              onClick={() => onCancel(expedition.id)}
              className="px-4 py-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 text-xs font-bold uppercase tracking-wider rounded border border-red-900/50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden relative z-10">
        <div 
          className={`h-full transition-all duration-1000 linear ${expedition.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
          style={{ width: `${expedition.completed ? 100 : progress}%` }}
        ></div>
      </div>
    </div>
  );
}