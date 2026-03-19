import { WORLD_INFO } from "../../data/worlds";

interface Props {
  selectedWorld: number;
  onSelectWorld: (id: number) => void;
}

export default function WorldSelector({ selectedWorld, onSelectWorld }: Props) {
  return (
    <div className="w-full md:w-20 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto custom-scrollbar bg-app-base border-b md:border-b-0 md:border-r border-border/50 p-2 shrink-0 snap-x">
      {Object.entries(WORLD_INFO).map(([idStr, info]) => {
        const id = parseInt(idStr);
        const isSelected = selectedWorld === id;

        return (
          <button
            key={id}
            onClick={() => onSelectWorld(id)}
            className={`
              snap-start shrink-0 w-16 h-16 md:w-full md:aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden group
              ${
                isSelected
                  ? "border-accent shadow-[0_0_15px_rgb(var(--color-accent)/0.3)] scale-[1.05] md:scale-100"
                  : "border-border/50 opacity-60 hover:opacity-100"
              }
            `}
            title={info.name}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-60 transition-opacity duration-500"
              style={{ backgroundImage: `url(${info.image})` }}
            />
            <div
              className={`absolute inset-0 bg-app-base/60 transition-colors ${isSelected ? "bg-app-base/20" : ""}`}
            />

            <span
              className={`relative z-10 text-lg md:text-xl font-black transition-colors ${isSelected ? "text-accent" : "text-tx-main"}`}
            >
              W{id}
            </span>

            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
