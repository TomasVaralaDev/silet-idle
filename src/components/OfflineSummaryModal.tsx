import { getItemDetails } from '../data'; 
import type { OfflineSummary } from '../systems/offlineSystem'; 

interface OfflineSummaryModalProps {
  results: OfflineSummary;
  onClose: () => void;
}

// Määritellään apurajapinta itemille tässä komponentissa,
// jotta vältämme 'any'-tyypin käytön, jos varsinainen Resource-tyyppi on puutteellinen.
interface ItemVisuals {
  name?: string;
  icon?: string;
  image?: string;
}

export default function OfflineSummaryModal({ results, onClose }: OfflineSummaryModalProps) {
  // Aputoiminto ajan muotoiluun
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="p-6 border-b border-slate-800 text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">Welcome Back</h2>
          <p className="text-slate-400 text-sm">
            You were away for <span className="text-emerald-400 font-bold">{formatTime(results.seconds)}</span>
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* XP GAINS */}
          {Object.keys(results.xpGained).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Experience Gained</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(results.xpGained).map(([skill, amount]) => (
                  <div key={skill} className="bg-slate-800/50 p-2 rounded flex justify-between items-center border border-slate-700/50">
                    <span className="capitalize text-slate-300 text-sm">{skill}</span>
                    <span className="text-emerald-400 font-mono font-bold">+{amount as number} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITEM GAINS */}
          {Object.keys(results.itemsGained).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Loot Collected</h3>
              <div className="space-y-2">
                {Object.entries(results.itemsGained).map(([itemId, count]) => {
                  const item = getItemDetails(itemId);
                  
                  // KORJAUS: Tyyppimuunnos ilman 'any':a.
                  // Kerrotaan TypeScriptille, että itemillä voi olla icon tai image.
                  const visualItem = item as unknown as ItemVisuals;
                  const itemIcon = visualItem?.icon || visualItem?.image;

                  return (
                    <div key={itemId} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                      <div className="w-8 h-8 bg-slate-900 rounded border border-slate-700 flex items-center justify-center overflow-hidden">
                        {itemIcon ? (
                          <img src={itemIcon} alt={item?.name} className="w-full h-full object-cover pixelated" />
                        ) : (
                          <span className="text-xs">📦</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-200">{item?.name || itemId}</div>
                      </div>
                      <div className="text-emerald-400 font-mono font-bold">+{count as number}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(results.xpGained).length === 0 && Object.keys(results.itemsGained).length === 0 && (
            <div className="text-center text-slate-500 italic py-4">
              No progress made. Make sure to start an action before leaving!
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors uppercase tracking-widest text-sm"
          >
            Collect & Continue
          </button>
        </div>
      </div>
    </div>
  );
}