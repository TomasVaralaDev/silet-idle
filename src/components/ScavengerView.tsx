import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { WORLD_INFO } from '../data';
import type { Expedition } from '../types';

export default function ScavengerView() {
  // Haetaan tiedot Storesta
  const scavengerState = useGameStore(state => state.scavenger);
  const maxMapCompleted = useGameStore(state => state.combatStats.maxMapCompleted);
  
  // Haetaan actionit Storesta
  const startExpedition = useGameStore(state => state.startExpedition);
  const claimExpedition = useGameStore(state => state.claimExpedition);
  const cancelExpedition = useGameStore(state => state.cancelExpedition);

  // Pidetään aikaa yllä tilassa, jotta renderöinti on puhdasta ja progress bar liikkuu
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleStart = (worldId: number, duration: number) => {
    startExpedition(worldId, duration);
  };

  const handleCancel = (id: string) => {
    if (confirm("Cancel expedition? The team will return empty-handed.")) {
        cancelExpedition(id);
    }
  };

  return (
    <div className="p-6 h-full bg-slate-950 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-200 uppercase tracking-widest mb-2">Expeditions</h2>
          <p className="text-sm text-slate-500">Dispatch scavenger teams to gather resources from cleared worlds.</p>
          <div className="mt-4 inline-block bg-slate-900 px-4 py-2 rounded border border-slate-800">
            <span className="text-xs font-bold text-indigo-400 uppercase">Active Teams:</span>
            <span className="ml-2 font-mono text-white">{scavengerState.activeExpeditions.length} / {scavengerState.unlockedSlots}</span>
          </div>
        </div>

        {/* ACTIVE EXPEDITIONS */}
        {scavengerState.activeExpeditions.length > 0 && (
          <div className="mb-8 grid gap-4">
            {/* KORJAUS: Lisätty (exp: Expedition) tyyppimäärittely */}
            {scavengerState.activeExpeditions.map((exp: Expedition) => {
              const elapsed = now - exp.startTime;
              const progress = Math.min(100, (elapsed / exp.duration) * 100);
              const timeLeft = Math.max(0, Math.ceil((exp.duration - elapsed) / 60000));
              const world = WORLD_INFO[exp.mapId];

              return (
                <div key={exp.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden group">
                  {/* Progress Bar Background */}
                  <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <img src={world.image} className="w-12 h-12 rounded object-cover border border-slate-700 opacity-80" alt={world.name} />
                    <div>
                      <div className="font-bold text-slate-200">{world.name} Expedition</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {exp.completed ? <span className="text-green-400">MISSION COMPLETE</span> : `Returning in ${timeLeft} min`}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {exp.completed ? (
                      <button 
                        onClick={() => claimExpedition(exp.id)}
                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse uppercase text-xs tracking-wider"
                      >
                        Claim Loot
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleCancel(exp.id)}
                        className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider px-4 py-2 border border-red-900/30 hover:bg-red-900/10 rounded"
                      >
                        Recall
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WORLD SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((worldId: number) => {
            const world = WORLD_INFO[worldId];
            const unlockReq = (worldId - 1) * 10;
            const isUnlocked = worldId === 1 || maxMapCompleted >= unlockReq;
            
            return (
              <div key={worldId} className={`relative bg-slate-900 rounded-xl overflow-hidden border transition-all group
                ${isUnlocked ? 'border-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-slate-800 opacity-50 grayscale'}`}>
                
                {/* Background Image */}
                <div className="h-32 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                  <img src={world.image} className="w-full h-full object-cover" alt={world.name} />
                  <div className="absolute bottom-2 left-3 z-20">
                    <div className="font-bold text-white tracking-wide">{world.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Zone {worldId}</div>
                  </div>
                </div>

                <div className="p-4">
                  {isUnlocked ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 mb-3 min-h-[40px]">{world.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 30, 60].map(mins => (
                          <button 
                            key={mins}
                            onClick={() => handleStart(worldId, mins)}
                            disabled={scavengerState.activeExpeditions.length >= scavengerState.unlockedSlots}
                            className="bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-2 rounded text-[10px] font-bold uppercase transition-colors border border-slate-700 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-4 text-center">
                      <span className="text-2xl mb-2">🔒</span>
                      <p className="text-xs font-bold text-slate-500 uppercase">Locked</p>
                      <p className="text-[10px] text-slate-600 mt-1">Clear Map {unlockReq} to unlock</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}