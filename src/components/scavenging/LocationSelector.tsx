import { useGameStore } from '../../store/useGameStore'; // Tarvitaan store combatStatsia varten
import { WORLD_INFO } from '../../data/worlds';

interface Props {
  selectedWorldId: number | null;
  onSelect: (worldId: number) => void;
}

export default function LocationSelector({ selectedWorldId, onSelect }: Props) {
  const combatStats = useGameStore(state => state.combatStats); // Haetaan combat statsit

  // Muutetaan WORLD_INFO objektista taulukoksi
  const worlds = Object.entries(WORLD_INFO).map(([id, info]) => ({
    id: parseInt(id),
    ...info
  }));

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Select Region</h3>
        <p className="text-[10px] text-slate-500 mt-1">Regions must be stabilized in Combat first.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {worlds.map(world => {
          // --- LUKITUSLOGIIKKA ---
          // Oletetaan että World 1 loppuu map 10:een, World 2 map 20:een jne.
          // World aukeaa kun edellisen worldin viimeinen mappi on suoritettu.
          // World 1 (id 1): vaatii 0
          // World 2 (id 2): vaatii 10
          const requiredMapCompleted = (world.id - 1) * 10;
          const isLocked = combatStats.maxMapCompleted < requiredMapCompleted;

          return (
            <button
              key={world.id}
              onClick={() => !isLocked && onSelect(world.id)}
              disabled={isLocked}
              className={`
                w-full text-left rounded-lg overflow-hidden border transition-all relative group
                ${selectedWorldId === world.id 
                  ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-900/20' 
                  : isLocked
                    ? 'border-slate-800 opacity-60 cursor-not-allowed grayscale'
                    : 'border-slate-800 hover:border-slate-600'
                }
              `}
            >
              {/* Taustakuva */}
              <div className="h-24 bg-slate-800 relative">
                 <img 
                   src={world.image} 
                   alt={world.name} 
                   className={`
                     w-full h-full object-cover transition-all duration-500 
                     ${selectedWorldId === world.id ? 'opacity-100 scale-105' : 'opacity-60'}
                     ${!isLocked && 'group-hover:grayscale-0 group-hover:scale-105'}
                   `}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                 
                 {/* World Number Badge */}
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-300 border border-white/10">
                   W{world.id}
                 </div>

                 {/* LOCK OVERLAY */}
                 {isLocked && (
                   <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-slate-400">
                     <span className="text-2xl mb-1">🔒</span>
                     <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 px-2 py-1 rounded border border-slate-700">
                       LOCKED
                     </span>
                     <span className="text-[9px] mt-1 font-mono text-red-400">
                       Reach Zone {(world.id - 1) * 10 + 1}
                     </span>
                   </div>
                 )}
              </div>

              {/* Info */}
              <div className="p-3 bg-slate-950 relative">
                <div className={`font-bold text-sm mb-1 ${selectedWorldId === world.id ? 'text-emerald-400' : isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                  {world.name}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                  {world.description}
                </p>
              </div>

              {/* Selected Indicator */}
              {selectedWorldId === world.id && (
                <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}