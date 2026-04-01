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
    <div className="h-full flex flex-col bg-app-base/50">
      <div className="hidden md:block p-5 border-b border-border/50 bg-panel/30 shadow-sm shrink-0 z-10">
        <h3 className="text-[10px] font-black uppercase text-tx-muted tracking-[0.2em]">
          Available Sectors
        </h3>
      </div>

      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto custom-scrollbar p-4 md:p-6 gap-4">
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
                relative shrink-0 w-64 md:w-full text-left rounded-xl overflow-hidden border-2 transition-all h-32 md:h-36 group shadow-lg
                ${
                  isSelected
                    ? "border-success shadow-success/20 ring-4 ring-success/10 scale-[1.02]"
                    : isLocked
                      ? "border-border/30 opacity-60 cursor-not-allowed grayscale"
                      : "border-border hover:border-success/50 hover:scale-[1.01]"
                }
              `}
            >
              {
                // Background Image and Overlay
              }
              <div className="absolute inset-0 bg-black">
                <img
                  src={world.image}
                  alt={world.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isSelected
                      ? "scale-105 opacity-80"
                      : "opacity-40 group-hover:opacity-60 group-hover:scale-105"
                  }`}
                />
              </div>

              {
                // Gradients for improved readability
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

              {
                // Locked State Indicator
              }
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20">
                  <div className="bg-black/80 p-3 rounded-full border border-border/50">
                    <img
                      src="./assets/ui/icon_locked.png"
                      alt="Locked"
                      className="w-8 h-8 object-contain rendering-pixelated opacity-80 grayscale"
                    />
                  </div>
                </div>
              )}

              {
                // Sector Content
              }
              <div className="relative z-10 h-full flex flex-col p-4">
                <div className="flex justify-between items-start mb-auto">
                  <div
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-widest border shadow-sm ${
                      isSelected
                        ? "bg-success text-black border-success"
                        : "bg-black/60 text-tx-muted border-border/50"
                    }`}
                  >
                    World {world.id}
                  </div>
                </div>

                <div className="mt-auto">
                  <div
                    className={`font-black text-lg uppercase tracking-tight drop-shadow-md truncate ${
                      isSelected
                        ? "text-success"
                        : isLocked
                          ? "text-tx-muted/60"
                          : "text-white group-hover:text-success/90 transition-colors"
                    }`}
                  >
                    {world.name}
                  </div>

                  {isLocked ? (
                    <div className="text-[10px] text-danger font-mono mt-1 uppercase tracking-widest font-black drop-shadow-md bg-black/50 inline-block px-1.5 rounded">
                      Unlock: Clear Map {requiredMapCompleted}
                    </div>
                  ) : (
                    <div className="text-xs text-tx-muted/80 truncate mt-0.5 font-medium drop-shadow-md">
                      {world.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
