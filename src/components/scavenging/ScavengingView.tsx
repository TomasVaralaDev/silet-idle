import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import LocationSelector from './LocationSelector';
import DurationSlider from './DurationSlider';
import ActiveExpeditions from './ActiveExpeditions';
import { WORLD_INFO } from '../../data/worlds';

export default function ScavengingView() {
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(10);

  const { startExpedition, scavenger, combatStats, skills } = useGameStore();

  const selectedWorld = selectedWorldId ? WORLD_INFO[selectedWorldId] : null;
  const currentLevel = skills.scavenging.level;

  const isWorldUnlocked = (worldId: number) => {
    const requiredMapCompleted = (worldId - 1) * 10;
    return combatStats.maxMapCompleted >= requiredMapCompleted;
  };

  const isSlotsFull =
    scavenger.activeExpeditions.length >= scavenger.unlockedSlots;
  const isSelectedWorldLocked = selectedWorldId
    ? !isWorldUnlocked(selectedWorldId)
    : true;

  const canStart =
    selectedWorldId !== null && !isSlotsFull && !isSelectedWorldLocked;

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-200 font-sans overflow-hidden text-left">
      {/* HEADER - Sama tyyli kuin muissa vieweissä */}
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/skills/scavenging.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Scavenging"
          />
        </div>
        <div className="flex-1">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-emerald-500 mb-1`}
          >
            Scavenging
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Send automated units to gather rare fragments from stabilized
            regions.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-200">
            Level {currentLevel}
          </div>
          <div className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-tighter">
            Deployment Units Online
          </div>
        </div>
      </div>

      {/* JAKOVIIVA / PROGRESS BAR STYLE */}
      <div className="h-1 bg-slate-900 w-full shrink-0">
        <div
          className={`h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]`}
          style={{ width: `100%` }} // Tai voit laittaa tähän esim. XP-prosessin
        ></div>
      </div>

      {/* PÄÄSISÄLTÖ (Horisontaalinen jako) */}
      <div className="flex flex-1 overflow-hidden">
        {/* VASEN: Konfiguraatio ja Aktiiviset */}
        <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto custom-scrollbar">
          {/* ACTIVE EXPEDITIONS */}
          <div className="mb-8">
            <h2 className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">
              Deployment Slots ({scavenger.activeExpeditions.length}/
              {scavenger.unlockedSlots})
            </h2>
            <ActiveExpeditions />
          </div>

          {/* CONFIGURE NEW */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
              New Expedition Setup
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-black tracking-widest">
                    Target Sector
                  </div>
                  <div
                    className={`text-lg font-bold ${selectedWorld ? 'text-cyan-400' : 'text-slate-600'}`}
                  >
                    {selectedWorld ? selectedWorld.name : 'Select a World →'}
                  </div>
                </div>
                {selectedWorld && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">
                      Sector 0{selectedWorldId}
                    </div>
                  </div>
                )}
              </div>

              <DurationSlider value={duration} onChange={setDuration} />

              <button
                onClick={() =>
                  canStart &&
                  selectedWorldId &&
                  startExpedition(selectedWorldId, duration)
                }
                disabled={!canStart}
                className={`
                  w-full py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all
                  ${
                    canStart
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                  }
                `}
              >
                {isSlotsFull
                  ? 'No Free Slots'
                  : !selectedWorldId
                    ? 'Identify Target'
                    : isSelectedWorldLocked
                      ? 'Sector Unstable'
                      : 'Initiate Scavenging'}
              </button>
            </div>
          </div>
        </div>

        {/* OIKEA: Location Selector */}
        <div className="w-80 flex-shrink-0 bg-slate-900 border-l border-slate-800">
          <LocationSelector
            selectedWorldId={selectedWorldId}
            onSelect={setSelectedWorldId}
          />
        </div>
      </div>
    </div>
  );
}
