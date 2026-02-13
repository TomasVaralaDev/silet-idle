import type { OfflineResults } from '../systems/offlineSystem';
import { getItemDetails } from '../data';

interface Props {
  results: OfflineResults;
  onClose: () => void;
}

export default function OfflineSummaryModal({ results, onClose }: Props) {
  const { secondsPassed, itemsGained, xpGained } = results;
  const minutes = Math.floor(secondsPassed / 60);
  const hours = Math.floor(minutes / 60);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-slate-800 to-slate-900">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">System Restored</h2>
          <p className="text-slate-400 text-xs">Offline Time: {hours > 0 ? `${hours}h ` : ''}{minutes % 60}m</p>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
          {/* XP GAINS */}
          {Object.keys(xpGained).length > 0 && (
            <div>
              <h3 className="text-[10px] font-bold text-emerald-500 uppercase mb-2 tracking-widest">Experience Sync</h3>
              <div className="space-y-2">
                {Object.entries(xpGained).map(([skill, amount]) => (
                  <div key={skill} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800/50">
                    <span className="capitalize text-sm text-slate-300">{skill}</span>
                    <span className="text-emerald-400 font-mono text-sm">+{amount.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITEM GAINS */}
          <div>
            <h3 className="text-[10px] font-bold text-cyan-500 uppercase mb-2 tracking-widest">Resource Extraction</h3>
            {Object.keys(itemsGained).length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(itemsGained).map(([id, count]) => {
                  const details = getItemDetails(id);
                  return (
                    <div key={id} className="flex items-center gap-3 bg-slate-950 p-2 rounded border border-slate-800/50">
                      <img src={details?.icon} className="w-8 h-8 pixelated" alt="" />
                      <div className="flex-1">
                        <div className="text-xs text-slate-300 font-bold">{details?.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Count: {count.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic text-center py-4">No physical resources were gathered.</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3 rounded-xl transition-colors uppercase text-xs tracking-widest"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}