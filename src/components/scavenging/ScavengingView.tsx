import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import LocationSelector from "./LocationSelector";
import DurationSlider from "./DurationSlider";
import ActiveExpeditions from "./ActiveExpeditions";
import { WORLD_INFO } from "../../data/worlds";

export default function ScavengingView() {
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(10);

  const { startExpedition, scavenger, combatStats } = useGameStore();

  const selectedWorld = selectedWorldId ? WORLD_INFO[selectedWorldId] : null;

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
    <div className="h-full w-full flex flex-col bg-app-base text-tx-main font-sans overflow-hidden text-left">
      {/* HEADER */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-success/20 border border-success/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/skills/scavenging.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Scavenging"
          />
        </div>
        <div className="flex-1">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-success mb-1`}
          >
            Expeditions
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            Dispatch brave scouts to recover lost relics and treasures from
            surrounding worlds.
          </p>
        </div>
      </div>

      {/* JAKOVIIVA / PROGRESS BAR STYLE */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div
          className={`h-full bg-success transition-all duration-300 shadow-[0_0_10px_rgb(var(--color-success)/0.5)]`}
          style={{ width: `100%` }}
        ></div>
      </div>

      {/* PÄÄSISÄLTÖ */}
      <div className="flex flex-1 overflow-hidden">
        {/* VASEN: Konfiguraatio ja Aktiiviset */}
        <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto custom-scrollbar">
          {/* ACTIVE EXPEDITIONS */}
          <div className="mb-8">
            <h2 className="text-[10px] font-black uppercase text-tx-muted mb-3 tracking-[0.2em]">
              Active Scouting Parties ({scavenger.activeExpeditions.length}/
              {scavenger.unlockedSlots})
            </h2>
            <ActiveExpeditions />
          </div>

          {/* CONFIGURE NEW */}
          <div className="bg-panel/30 border border-border rounded-xl p-5">
            <h2 className="text-sm font-black text-tx-main mb-4 flex items-center gap-2 uppercase tracking-tight">
              Prepare New Expedition
            </h2>

            <div className="space-y-6">
              <div className="bg-app-base border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-tx-muted font-black tracking-widest">
                    Target World
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      selectedWorld ? "text-accent" : "text-tx-muted/60"
                    }`}
                  >
                    {selectedWorld
                      ? selectedWorld.name
                      : "Choose Destination →"}
                  </div>
                </div>
                {selectedWorld && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-tx-muted uppercase">
                      WORLD {selectedWorldId}
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
                      ? "bg-success hover:bg-success/80 text-white shadow-lg shadow-success/20"
                      : "bg-panel-hover text-tx-muted/60 cursor-not-allowed opacity-50 border border-border/50"
                  }
                `}
              >
                {isSlotsFull
                  ? "Parties Full"
                  : !selectedWorldId
                  ? "Pick a World"
                  : isSelectedWorldLocked
                  ? "World Locked"
                  : "Begin Expedition"}
              </button>
            </div>
          </div>
        </div>

        {/* OIKEA: Location Selector */}
        <div className="w-80 flex-shrink-0 bg-panel border-l border-border">
          <LocationSelector
            selectedWorldId={selectedWorldId}
            onSelect={setSelectedWorldId}
          />
        </div>
      </div>
    </div>
  );
}
