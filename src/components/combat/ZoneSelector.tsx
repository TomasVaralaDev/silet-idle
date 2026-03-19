import { useGameStore } from "../../store/useGameStore";
import { COMBAT_DATA } from "../../data/combat";
import type { CombatMap } from "../../types";

interface Props {
  selectedWorldId: number;
  isMobile?: boolean;
}

export default function ZoneSelector({
  selectedWorldId,
  isMobile = false,
}: Props) {
  const {
    startCombat,
    stopCombat,
    combatStats,
    combatSettings,
    toggleAutoProgress,
    inventory,
  } = useGameStore();
  const zones = COMBAT_DATA.filter(
    (map: CombatMap) => map.world === selectedWorldId,
  );

  return (
    <div
      className={`flex flex-col h-full bg-panel/20 ${isMobile ? "w-full" : "w-full border-l border-border/50"}`}
    >
      <div className="p-3 md:p-4 border-b border-border/50 flex items-center justify-between bg-panel/50">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">
            Tactical Maps
          </span>
          <span className="text-[9px] text-tx-muted font-mono">
            Region {selectedWorldId}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-app-base/50 px-2 py-1 rounded-lg border border-border">
          <span className="text-[8px] md:text-[9px] text-tx-muted uppercase font-black tracking-wider">
            Auto Push
          </span>
          <button
            onClick={toggleAutoProgress}
            className={`w-8 h-4 rounded-full relative transition-all ${combatSettings.autoProgress ? "bg-success" : "bg-panel-hover"}`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${combatSettings.autoProgress ? "translate-x-4" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`flex-1 ${isMobile ? "flex flex-row overflow-x-auto p-2 gap-2 snap-x" : "overflow-y-auto custom-scrollbar"}`}
      >
        {zones.map((map) => {
          const isActive = combatStats.currentMapId === map.id;
          const keyRequired = map.keyRequired;
          const hasKey = !keyRequired || (inventory[keyRequired] || 0) > 0;
          const isProgressionLocked = map.id > combatStats.maxMapCompleted + 1;
          const isLocked = isProgressionLocked || (map.isBoss && !hasKey);

          return (
            <button
              key={map.id}
              onClick={() =>
                !isLocked && (isActive ? stopCombat() : startCombat(map.id))
              }
              disabled={isLocked}
              className={`
                ${isMobile ? "w-40 shrink-0 rounded-xl snap-start py-3" : "w-full border-b border-border/30"} 
                p-4 text-left transition-all relative
                ${isActive ? "bg-accent/10" : isLocked ? "opacity-30 grayscale" : "hover:bg-panel-hover"}
              `}
            >
              <div className="flex flex-col gap-1">
                <div
                  className={`text-xs font-black truncate uppercase ${isActive ? "text-accent" : "text-tx-main"}`}
                >
                  {map.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-tx-muted bg-app-base/50 px-1.5 py-0.5 rounded border border-border/50">
                    Z.{map.id}
                  </span>
                  {map.isBoss && (
                    <span className="text-[8px] font-black text-danger uppercase tracking-tighter">
                      Boss
                    </span>
                  )}
                </div>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 md:h-auto md:w-1 md:top-0 bg-accent shadow-[0_0_10px_rgb(var(--color-accent))]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
