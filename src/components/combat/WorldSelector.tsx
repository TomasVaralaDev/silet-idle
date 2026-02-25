import { WORLD_INFO } from "../../data/worlds";

interface Props {
  selectedWorld: number;
  onSelectWorld: (id: number) => void;
}

export default function WorldSelector({ selectedWorld, onSelectWorld }: Props) {
  return (
    <div className="w-20 flex flex-col gap-2 overflow-y-auto custom-scrollbar bg-app-base border-r border-border p-2 shrink-0">
      {Object.entries(WORLD_INFO).map(([idStr, info]) => {
        const id = parseInt(idStr);
        const isSelected = selectedWorld === id;

        return (
          <button
            key={id}
            onClick={() => onSelectWorld(id)}
            className={`
              w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden group
              ${
                isSelected
                  ? "border-success shadow-[0_0_15px_rgb(var(--color-success)/0.4)] scale-[1.02]"
                  : "border-border hover:border-border-hover opacity-60 hover:opacity-100"
              }
            `}
            title={info.name}
          >
            {/* Background Image Preview */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundImage: `url(${info.image})` }}
            />

            {/* Overlay - Käytetään app-base väriä tummennukseen jotta se sulaa teemaan paremmin */}
            <div
              className={`absolute inset-0 bg-app-base/60 group-hover:bg-app-base/30 transition-colors ${
                isSelected ? "bg-app-base/20" : ""
              }`}
            />

            <span
              className={`relative z-10 text-xl font-black drop-shadow-md transition-colors ${
                isSelected ? "text-success" : "text-tx-main"
              }`}
            >
              W{id}
            </span>

            {/* Valinta-indikaattori alareunassa */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-success animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
