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
    <div className="h-full flex flex-col">
      <div className="hidden md:block p-5 border-b border-border/50 bg-panel/20">
        <h3 className="text-[10px] font-black uppercase text-tx-muted tracking-[0.2em]">
          Available Worlds
        </h3>
      </div>

      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto custom-scrollbar p-4 gap-3">
        {worlds.map((world) => {
          const requiredMapCompleted = (world.id - 1) * 10;
          const isLocked = combatStats.maxMapCompleted < requiredMapCompleted;
          const isSelected = selectedWorldId === world.id;

          return (
            <button
              key={world.id}
              onClick={() => !isLocked && onSelect(world.id)}
              disabled={isLocked}
              className={`
                shrink-0 w-48 md:w-full text-left rounded-sm overflow-hidden border transition-all flex flex-col md:flex-row h-24 md:h-20
                ${
                  isSelected
                    ? "border-success bg-success/5"
                    : isLocked
                      ? "border-border/40 opacity-50 cursor-not-allowed bg-app-base"
                      : "border-border hover:border-success/50 hover:bg-panel/40 bg-panel/20"
                }
              `}
            >
              {/* Kuva */}
              <div className="h-10 md:h-full w-full md:w-20 bg-app-base relative shrink-0 border-b md:border-b-0 md:border-r border-border/50">
                <img
                  src={world.image}
                  alt={world.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-60"} ${isLocked && "grayscale"}`}
                />
                <div className="absolute top-1 left-1 bg-app-base/80 backdrop-blur-sm px-1.5 py-0.5 rounded-sm text-[8px] font-mono font-bold text-tx-main border border-border">
                  W{world.id}
                </div>
                {isLocked && (
                  <div className="absolute inset-0 bg-panel/80 flex items-center justify-center">
                    <span className="text-sm">🔒</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 md:p-3 flex-1 flex flex-col justify-center min-w-0">
                <div
                  className={`font-black text-[10px] md:text-xs uppercase tracking-tight truncate ${
                    isSelected
                      ? "text-success"
                      : isLocked
                        ? "text-tx-muted"
                        : "text-tx-main"
                  }`}
                >
                  {world.name}
                </div>
                {isLocked ? (
                  <div className="text-[8px] text-danger font-mono mt-1">
                    Req: Zone {(world.id - 1) * 10 + 1}
                  </div>
                ) : (
                  <div className="text-[9px] text-tx-muted truncate mt-0.5 font-medium">
                    {world.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
