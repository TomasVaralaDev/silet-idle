import { useGameStore } from "../../store/useGameStore";
import { COMBAT_DATA } from "../../data/combat";
import type { CombatMap } from "../../types";

interface Props {
  selectedWorldId: number;
}

export default function ZoneSelector({ selectedWorldId }: Props) {
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
    <div className="flex flex-col h-full bg-panel/80 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border">
      {/* HEADER */}
      <div className="p-3 md:p-4 border-b border-border flex items-center justify-between bg-panel/90 shadow-sm z-10">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-success">
            Zones
          </span>
          <span className="text-[9px] text-tx-muted font-mono">
            World {selectedWorldId}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-app-base/50 px-2 py-1.5 rounded-lg border border-border">
          <span className="text-[8px] md:text-[9px] text-tx-muted uppercase font-black tracking-wider">
            Auto push
          </span>
          <button
            onClick={toggleAutoProgress}
            className={`
                  w-8 h-4 rounded-full relative transition-all duration-300
                  ${
                    combatSettings.autoProgress
                      ? "bg-success shadow-[0_0_8px_rgb(var(--color-success)/0.4)]"
                      : "bg-panel-hover"
                  }
                `}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                combatSettings.autoProgress
                  ? "translate-x-4"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ZONE LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {zones.map((map) => {
          const isActive = combatStats.currentMapId === map.id;

          // AVAIN-TARKISTUKSET
          const keyCount = map.keyRequired
            ? inventory[map.keyRequired] || 0
            : 0;
          const hasKey = !map.keyRequired || keyCount > 0;
          const isProgressionLocked = map.id > combatStats.maxMapCompleted + 1;
          const isLocked = isProgressionLocked || (map.isBoss && !hasKey);

          const keyImage = `/assets/items/bosskey/bosskey_w${selectedWorldId}.png`;

          return (
            <button
              key={map.id}
              onClick={() =>
                !isLocked && (isActive ? stopCombat() : startCombat(map.id))
              }
              disabled={isLocked}
              className={`
                w-full p-3 md:p-4 border-b border-border/50 text-left transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-success/10 border-l-4 border-l-success"
                    : isLocked
                      ? "opacity-40 cursor-not-allowed bg-app-base grayscale"
                      : "hover:bg-panel-hover/40 border-l-4 border-l-transparent hover:border-l-border-hover"
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-2">
                  <div
                    className={`text-xs md:text-sm font-bold mb-0.5 flex items-center gap-1.5 md:gap-2 ${
                      isActive
                        ? "text-tx-main"
                        : isLocked
                          ? "text-tx-muted/60"
                          : "text-tx-main/80"
                    }`}
                  >
                    <span className="truncate">{map.name}</span>
                    {map.isBoss && (
                      <span
                        className={`flex items-center gap-1 text-[9px] md:text-[10px] px-1.5 py-0.5 rounded border ${
                          keyCount > 0
                            ? "bg-warning/20 text-warning border-warning/30"
                            : "bg-panel border-border text-tx-muted"
                        }`}
                      >
                        <img
                          src={keyImage}
                          className="w-3 h-3 object-contain pixelated"
                          alt="Key"
                        />
                        {keyCount}/1
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-tx-muted font-mono flex flex-wrap items-center gap-1">
                    <span
                      className={`px-1 rounded border ${
                        isActive
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-panel border-border text-tx-muted"
                      }`}
                    >
                      Lvl {map.id}
                    </span>
                    {map.isBoss && !hasKey && (
                      <span className="text-danger font-black uppercase text-[8px] bg-danger/10 px-1.5 py-0.5 rounded border border-danger/20">
                        Needs Key
                      </span>
                    )}
                    <span className="opacity-30">|</span>
                    <span className="truncate opacity-70">{map.enemyName}</span>
                  </div>
                </div>

                <div
                  className={`
                    w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all
                    ${
                      isActive
                        ? "bg-panel border-success/30 shadow-[0_0_10px_rgb(var(--color-success)/0.2)]"
                        : isLocked
                          ? "bg-app-base border-border"
                          : "bg-app-base border-border"
                    }
                `}
                >
                  {isProgressionLocked ? (
                    <img
                      src="/assets/ui/icon_locked.png"
                      className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain pixelated opacity-30"
                      alt="Locked"
                    />
                  ) : map.isBoss && !hasKey ? (
                    <img
                      src={keyImage}
                      className="w-4 h-4 md:w-5 md:h-5 object-contain pixelated animate-pulse"
                      alt="Key Needed"
                    />
                  ) : map.image ? (
                    <img
                      src={map.image}
                      className={`w-4 h-4 md:w-5 md:h-5 object-contain transition-all ${
                        isActive
                          ? "opacity-100 scale-110"
                          : "opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80"
                      }`}
                      alt=""
                    />
                  ) : (
                    <img
                      src="/assets/ui/icon_battle.png"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain pixelated opacity-30"
                      alt="Battle"
                    />
                  )}
                </div>
              </div>

              {isActive && (
                <div className="absolute left-0 bottom-0 top-0 w-1 bg-success shadow-[0_0_15px_rgb(var(--color-success)/0.6)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
