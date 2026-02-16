import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import LocationSelector from './LocationSelector';
import DurationSlider from './DurationSlider';
import ActiveExpeditions from './ActiveExpeditions';
import { WORLD_INFO } from '../../data/worlds';

export default function ScavengingView() {
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(10); 
  
  // Haetaan storesta myös combatStats tarkistusta varten
  const { startExpedition, scavenger, combatStats } = useGameStore();
  
  const selectedWorld = selectedWorldId ? WORLD_INFO[selectedWorldId] : null;

  // --- VALIDATION LOGIC ---
  const isWorldUnlocked = (worldId: number) => {
    // Sama logiikka kuin LocationSelectorissa
    const requiredMapCompleted = (worldId - 1) * 10;
    return combatStats.maxMapCompleted >= requiredMapCompleted;
  };

  const isSlotsFull = scavenger.activeExpeditions.length >= scavenger.unlockedSlots;
  const isSelectedWorldLocked = selectedWorldId ? !isWorldUnlocked(selectedWorldId) : true;
  
  const canStart = selectedWorldId !== null && !isSlotsFull && !isSelectedWorldLocked;

  return (
    <div className="h-full w-full flex bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* VASEN: Konfiguraatio ja Aktiiviset */}
      <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto custom-scrollbar">
        
        <header className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-slate-500 mb-1">Scavenging</h1>
          <p className="text-slate-400 text-sm">Send active expeditions to gather resources from stabilized regions.</p>
        </header>

        {/* ACTIVE EXPEDITIONS */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Active Expeditions ({scavenger.activeExpeditions.length}/{scavenger.unlockedSlots})</h2>
          <ActiveExpeditions />
        </div>

        {/* CONFIGURE NEW */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <span></span> Configure New Expedition
          </h2>

          <div className="space-y-6">
            {/* 1. Valittu alue */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold">Target Region</div>
                <div className={`text-lg font-bold ${selectedWorld ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {selectedWorld ? selectedWorld.name : 'Select a World →'}
                </div>
              </div>
              {selectedWorld && (
                <div className="text-right">
                   <div className="text-[10px] font-mono text-slate-500">World {selectedWorldId}</div>
                </div>
              )}
            </div>

            {/* 2. Slider */}
            <DurationSlider value={duration} onChange={setDuration} />

            {/* 3. Start Button */}
            <button
              onClick={() => canStart && selectedWorldId && startExpedition(selectedWorldId, duration)}
              disabled={!canStart}
              className={`
                w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all
                ${canStart 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }
              `}
            >
              {isSlotsFull
                ? 'No Expedition Slots Available' 
                : !selectedWorldId 
                  ? 'Select Region' 
                  : isSelectedWorldLocked
                    ? 'Region Locked'
                    : 'Start Expedition'
              }
            </button>
          </div>
        </div>

      </div>

      {/* OIKEA: Location Selector */}
      <div className="w-80 flex-shrink-0 bg-slate-900 border-l border-slate-800">
        <LocationSelector selectedWorldId={selectedWorldId} onSelect={setSelectedWorldId} />
      </div>

    </div>
  );
}