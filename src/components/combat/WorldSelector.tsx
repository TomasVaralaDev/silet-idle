import { WORLD_INFO } from '../../data/worlds';

interface Props {
  selectedWorld: number;
  onSelectWorld: (id: number) => void;
}

export default function WorldSelector({ selectedWorld, onSelectWorld }: Props) {
  return (
    <div className="w-20 flex flex-col gap-2 overflow-y-auto custom-scrollbar bg-slate-950 border-r border-slate-800 p-2 shrink-0">
      {Object.entries(WORLD_INFO).map(([idStr, info]) => {
        const id = parseInt(idStr);
        const isSelected = selectedWorld === id;
        
        return (
          <button
            key={id}
            onClick={() => onSelectWorld(id)}
            className={`
              w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden group
              ${isSelected 
                ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
              }
            `}
            title={info.name}
          >
            {/* Background Image Preview */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundImage: `url(${info.image})` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            
            <span className="relative z-10 text-xl font-black text-white drop-shadow-md">W{id}</span>
          </button>
        );
      })}
    </div>
  );
}