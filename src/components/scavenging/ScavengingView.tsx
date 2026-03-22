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
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-success/20 border border-success/30 shadow-lg shrink-0">
          <img
            src="/assets/skills/scavenging.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Scavenging"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black uppercase tracking-widest text-success mb-1">
            Expeditions
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            Dispatch brave scouts to recover lost relics and treasures.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
            {scavenger.activeExpeditions.length} / {scavenger.unlockedSlots}
          </div>
          <div className="text-xs font-mono text-tx-muted mt-1 uppercase">
            Active Parties
          </div>
        </div>
      </div>

      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-success w-full opacity-80"></div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-app-base/30">
        {/* WORLD SELECTOR */}
        <div className="w-full md:w-[350px] flex-shrink-0 bg-panel/30 border-b md:border-b-0 md:border-r border-border/50 flex flex-col">
          <LocationSelector
            selectedWorldId={selectedWorldId}
            onSelect={setSelectedWorldId}
          />
        </div>

        {/* OIKEA PUOLI: Config & Active */}
        <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto custom-scrollbar">
          {/* CONFIGURE NEW */}
          <div className="bg-panel/40 border border-border rounded-sm p-5 mb-8 flex flex-col gap-5">
            <h2 className="text-xs font-black text-tx-muted uppercase tracking-[0.2em] border-b border-border/50 pb-2">
              Prepare Expedition
            </h2>

            <div className="flex flex-col xl:flex-row gap-5">
              {/* UUSI: Kohde Info Maailman kuvalla */}
              <div
                className={`relative border border-border rounded-sm flex-1 flex flex-col justify-center overflow-hidden transition-all duration-300 ${selectedWorld ? "h-32 xl:h-auto" : "bg-app-base p-4"}`}
              >
                {selectedWorld && (
                  <>
                    {/* Taustakuva */}
                    <img
                      src={selectedWorld.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-500"
                    />
                    {/* Tumma overlay luettavuutta varten */}
                    <div className="absolute inset-0 bg-gradient-to-t from-app-base via-app-base/80 to-transparent"></div>
                  </>
                )}

                {/* Tekstisisältö */}
                <div
                  className={`relative z-10 ${selectedWorld ? "p-4 mt-auto" : ""}`}
                >
                  <div className="text-[9px] uppercase text-tx-muted font-bold tracking-widest mb-1">
                    Target Destination
                  </div>
                  <div
                    className={`text-lg font-black uppercase tracking-tight ${
                      selectedWorld
                        ? "text-success drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
                        : "text-tx-muted/40"
                    }`}
                  >
                    {selectedWorld ? selectedWorld.name : "Awaiting Orders..."}
                  </div>
                  {selectedWorld && (
                    <div className="text-[10px] font-mono text-tx-muted mt-2 inline-block bg-black/50 px-2 py-0.5 rounded-sm border border-border/50">
                      WORLD {selectedWorldId}
                    </div>
                  )}
                </div>
              </div>

              {/* Slider & Nappi */}
              <div className="flex-1 flex flex-col gap-3 justify-end">
                <DurationSlider value={duration} onChange={setDuration} />

                <button
                  onClick={() =>
                    canStart &&
                    selectedWorldId &&
                    startExpedition(selectedWorldId, duration)
                  }
                  disabled={!canStart}
                  className={`
                    w-full py-3 rounded-sm font-black uppercase tracking-widest text-xs transition-all border
                    ${
                      canStart
                        ? "bg-success/10 border-success text-success hover:bg-success hover:text-white"
                        : "bg-panel border-border text-tx-muted/40 cursor-not-allowed"
                    }
                  `}
                >
                  {isSlotsFull
                    ? "Parties Full"
                    : !selectedWorldId
                      ? "Select Destination"
                      : isSelectedWorldLocked
                        ? "Sector Locked"
                        : "Deploy Scouts"}
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE EXPEDITIONS */}
          <div className="flex flex-col flex-1">
            <h2 className="text-[10px] font-black uppercase text-tx-muted mb-4 tracking-[0.2em] border-b border-border/50 pb-2">
              Active Scouting Parties
            </h2>
            <ActiveExpeditions />
          </div>
        </div>
      </div>
    </div>
  );
}
