import { useGameStore } from "../../store/useGameStore"; // Tarvitaan store combatStatsia varten
import { WORLD_INFO } from "../../data/worlds";

interface Props {
  selectedWorldId: number | null;
  onSelect: (worldId: number) => void;
}

export default function LocationSelector({ selectedWorldId, onSelect }: Props) {
  const combatStats = useGameStore((state) => state.combatStats); // Haetaan combat statsit

  // Muutetaan WORLD_INFO objektista taulukoksi
  const worlds = Object.entries(WORLD_INFO).map(([id, info]) => ({
    id: parseInt(id),
    ...info,
  }));

  return (
    <div className="h-full flex flex-col bg-panel border-l border-border">
      <div className="p-4 border-b border-border bg-app-base/50">
        <h3 className="text-xs font-black uppercase text-tx-muted tracking-wider">
          Select World
        </h3>
        <p className="text-[10px] text-tx-muted/70 mt-1">
          Unlock worlds by defeating the boss.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {worlds.map((world) => {
          // --- LUKITUSLOGIIKKA ---
          const requiredMapCompleted = (world.id - 1) * 10;
          const isLocked = combatStats.maxMapCompleted < requiredMapCompleted;

          return (
            <button
              key={world.id}
              onClick={() => !isLocked && onSelect(world.id)}
              disabled={isLocked}
              className={`
                w-full text-left rounded-lg overflow-hidden border transition-all relative group
                ${
                  selectedWorldId === world.id
                    ? "border-success ring-1 ring-success/50 shadow-lg shadow-success/20"
                    : isLocked
                    ? "border-border opacity-60 cursor-not-allowed grayscale"
                    : "border-border hover:border-border-hover"
                }
              `}
            >
              {/* Taustakuva */}
              <div className="h-24 bg-panel-hover relative">
                <img
                  src={world.image}
                  alt={world.name}
                  className={`
                       w-full h-full object-cover transition-all duration-500 
                       ${
                         selectedWorldId === world.id
                           ? "opacity-100 scale-105"
                           : "opacity-60"
                       }
                       ${
                         !isLocked &&
                         "group-hover:grayscale-0 group-hover:scale-105"
                       }
                     `}
                />
                {/* Gradient käyttää uutta dynaamista bg-app-base -väriä häivytykseen */}
                <div className="absolute inset-0 bg-gradient-to-t from-app-base via-transparent to-transparent"></div>

                {/* World Number Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-bold text-tx-main border border-white/10 shadow-sm">
                  W{world.id}
                </div>

                {/* LOCK OVERLAY */}
                {isLocked && (
                  <div className="absolute inset-0 bg-app-base/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-tx-muted">
                    <span className="text-2xl mb-1 drop-shadow-md">🔒</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 px-2 py-1 rounded border border-border">
                      LOCKED
                    </span>
                    <span className="text-[9px] mt-1 font-mono text-danger font-bold drop-shadow-md">
                      Reach Zone {(world.id - 1) * 10 + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 bg-app-base relative">
                <div
                  className={`font-bold text-sm mb-1 ${
                    selectedWorldId === world.id
                      ? "text-success"
                      : isLocked
                      ? "text-tx-muted"
                      : "text-tx-main"
                  }`}
                >
                  {world.name}
                </div>
                <p className="text-[10px] text-tx-muted line-clamp-2 leading-relaxed">
                  {world.description}
                </p>
              </div>

              {/* Selected Indicator */}
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
