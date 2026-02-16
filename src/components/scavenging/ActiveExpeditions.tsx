import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { WORLD_INFO } from '../../data/worlds';

export default function ActiveExpeditions() {
  const { scavenger, claimExpedition, cancelExpedition } = useGameStore();
  
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (scavenger.activeExpeditions.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600 flex flex-col items-center justify-center">
        {/* KORJAUS: Vaihdettu emoji kuvaan */}
        <img 
            src="/assets/ui/icon_map.png" 
            alt="No Expeditions" 
            className="w-12 h-12 mb-3 opacity-20 pixelated grayscale" 
        />
        <p className="text-sm font-bold opacity-50 uppercase tracking-wide">No active expeditions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scavenger.activeExpeditions.map(exp => {
        const worldInfo = WORLD_INFO[exp.mapId]; 
        const elapsed = now - exp.startTime;
        const progress = Math.min(100, (elapsed / exp.duration) * 100);
        const timeLeft = Math.max(0, exp.duration - elapsed);
        const isFinished = timeLeft <= 0;

        const formatTime = (ms: number) => {
          const s = Math.ceil(ms / 1000);
          if (s < 60) return `${s}s`;
          const m = Math.floor(s / 60);
          return `${m}m ${s % 60}s`;
        };

        return (
          <div key={exp.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg relative overflow-hidden group">
            <div 
              className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />

            <div className="flex justify-between items-center mb-2 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                    {worldInfo?.image && <img src={worldInfo.image} className="w-full h-full object-cover opacity-80" alt="" />}
                 </div>
                 <div>
                    <div className="font-bold text-slate-200">{worldInfo?.name || `World ${exp.mapId}`}</div>
                    <div className="text-xs text-slate-500">Expedition</div>
                 </div>
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold ${isFinished ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isFinished ? 'COMPLETED' : formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-3 relative z-10">
              {!isFinished ? (
                <button 
                  onClick={() => cancelExpedition(exp.id)}
                  className="px-3 py-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs rounded border border-red-900/30 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button 
                  onClick={() => claimExpedition(exp.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg shadow-emerald-900/20 animate-pulse"
                >
                  Claim Rewards
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}