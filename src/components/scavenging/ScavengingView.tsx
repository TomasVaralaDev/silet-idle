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
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-3 md:gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-success/20 border border-success/30 shadow-lg shrink-0">
          <img
            src="/assets/skills/scavenging.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
            alt="Scavenging"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-success mb-0.5 md:mb-1">
            Expeditions
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium hidden sm:block">
            Dispatch brave scouts to recover lost relics and treasures from
            surrounding worlds.
          </p>
        </div>
      </div>

      <div className="h-1 bg-panel w-full shrink-0">
        <div
          className="h-full bg-success transition-all duration-300 shadow-[0_0_10px_rgb(var(--color-success)/0.5)]"
          style={{ width: `100%` }}
        ></div>
      </div>

      {/* MAIN CONTENT AREA - Pinoituu mobiilissa */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* WORLD SELECTOR (MOBILE: Ylhäällä vaakasuorana, DESKTOP: Oikealla pystysuorana) */}
        <div className="w-full md:w-80 flex-shrink-0 bg-panel border-b md:border-b-0 md:border-l border-border md:order-2">
          <LocationSelector
            selectedWorldId={selectedWorldId}
            onSelect={setSelectedWorldId}
          />
        </div>

        {/* LEFT/BOTTOM: Configuration & Active */}
        <div className="flex-1 flex flex-col p-4 md:p-6 min-w-0 overflow-y-auto custom-scrollbar md:order-1">
          {/* CONFIGURE NEW */}
          <div className="bg-panel/30 border border-border rounded-xl p-4 md:p-5 mb-6 md:mb-8">
            <h2 className="text-xs md:text-sm font-black text-tx-main mb-4 flex items-center gap-2 uppercase tracking-tight">
              Prepare New Expedition
            </h2>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-app-base border border-border rounded-lg p-3 md:p-4 flex items-center justify-between">
                <div>
                  <div className="text-[9px] md:text-[10px] uppercase text-tx-muted font-black tracking-widest">
                    Target World
                  </div>
                  <div
                    className={`text-base md:text-lg font-bold ${
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
                    <div className="text-[10px] font-mono text-tx-muted uppercase bg-panel px-2 py-1 rounded">
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
                  w-full py-3 md:py-4 rounded-lg font-black uppercase tracking-widest text-xs md:text-sm transition-all
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

          {/* ACTIVE EXPEDITIONS */}
          <div>
            <h2 className="text-[10px] font-black uppercase text-tx-muted mb-3 tracking-[0.2em] px-1">
              Active Scouting Parties ({scavenger.activeExpeditions.length}/
              {scavenger.unlockedSlots})
            </h2>
            <ActiveExpeditions />
          </div>
        </div>
      </div>
    </div>
  );
}
