import { useGameStore } from "../../store/useGameStore";
import { WORLD_INFO } from "../../data/worlds";

interface Props {
  selectedWorldId: number | null;
  onSelect: (worldId: number) => void;
}

export default function LocationSelector({ selectedWorldId, onSelect }: Props) {
  const combatStats = useGameStore((state) => state.combatStats);

  const worlds = Object.entries(WORLD_INFO).map(([id, info]) => ({
    id: parseInt(id),
    ...info,
  }));

  return (
    <div className="h-full flex flex-col bg-panel">
      {/* Työpöydällä näkyvä header, mobiilissa piilossa (säästää tilaa) */}
      <div className="hidden md:block p-4 border-b border-border bg-app-base/50">
        <h3 className="text-xs font-black uppercase text-tx-muted tracking-wider">
          Select World
        </h3>
        <p className="text-[10px] text-tx-muted/70 mt-1">
          Unlock worlds by defeating the boss.
        </p>
      </div>

      {/* LISTAUS: Mobiilissa rivi (overflow-x-auto), Työpöydällä pino (overflow-y-auto) */}
      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto custom-scrollbar p-3 gap-3 snap-x">
        {worlds.map((world) => {
          const requiredMapCompleted = (world.id - 1) * 10;
          const isLocked = combatStats.maxMapCompleted < requiredMapCompleted;

          return (
            <button
              key={world.id}
              onClick={() => !isLocked && onSelect(world.id)}
              disabled={isLocked}
              className={`
                snap-start shrink-0 w-48 md:w-full text-left rounded-lg overflow-hidden border transition-all relative group flex flex-col
                ${
                  selectedWorldId === world.id
                    ? "border-success ring-1 ring-success/50 shadow-lg shadow-success/20 scale-[1.02] md:scale-100 z-10"
                    : isLocked
                      ? "border-border opacity-50 cursor-not-allowed grayscale"
                      : "border-border hover:border-border-hover hover:bg-panel-hover"
                }
              `}
            >
              {/* Taustakuva */}
              <div className="h-16 md:h-24 bg-app-base relative shrink-0">
                <img
                  src={world.image}
                  alt={world.name}
                  className={`
                    w-full h-full object-cover transition-all duration-500 
                    ${selectedWorldId === world.id ? "opacity-100" : "opacity-50"}
                    ${!isLocked && "group-hover:grayscale-0 group-hover:opacity-80"}
                  `}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent"></div>

                {/* World Badge */}
                <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-black/80 backdrop-blur-sm px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-[10px] font-mono font-bold text-white border border-white/10 shadow-sm">
                  W{world.id}
                </div>

                {/* LOCK OVERLAY */}
                {isLocked && (
                  <div className="absolute inset-0 bg-panel/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-tx-muted">
                    <span className="text-lg md:text-2xl drop-shadow-md">
                      🔒
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 md:p-3 bg-panel flex-1 flex flex-col justify-center">
                <div
                  className={`font-bold text-xs md:text-sm truncate ${
                    selectedWorldId === world.id
                      ? "text-success"
                      : isLocked
                        ? "text-tx-muted"
                        : "text-tx-main"
                  }`}
                >
                  {world.name}
                </div>
                {isLocked ? (
                  <p className="text-[8px] md:text-[9px] text-danger font-bold mt-0.5 tracking-wider uppercase">
                    Unlocks at Zone {(world.id - 1) * 10 + 1}
                  </p>
                ) : (
                  <p className="text-[9px] md:text-[10px] text-tx-muted line-clamp-1 md:line-clamp-2 leading-snug mt-0.5">
                    {world.description}
                  </p>
                )}
              </div>

              {/* Selected Indicator Border */}
              {selectedWorldId === world.id && (
                <div className="absolute inset-0 border-2 border-success rounded-lg pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
