import { getItemDetails } from "../../data";

import type { OfflineSummary } from "../../systems/offlineSystem";

interface OfflineSummaryModalProps {
  results: OfflineSummary;

  onClose: () => void;
}

interface ItemVisuals {
  name?: string;

  icon?: string;

  image?: string;
}

export default function OfflineSummaryModal({
  results,

  onClose,
}: OfflineSummaryModalProps) {
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);

    const m = Math.floor((seconds % 3600) / 60);

    const s = Math.floor(seconds % 60);

    if (h > 0) return `${h}h ${m}m ${s}s`;

    if (m > 0) return `${m}m ${s}s`;

    return `${s}s`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-base/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-panel border-2 border-border rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        {/* HEADER - Suora teksti, hohtava gradientti */}

        <div className="p-6 border-b border-border/50 bg-panel-hover/30 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-accent/10 blur-3xl rounded-full"></div>

          <h2 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover mb-1">
            Welcome Back
          </h2>

          <p className="text-tx-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
            Away for{" "}
            <span className="text-accent">{formatTime(results.seconds)}</span>
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-base/20">
          {/* XP GAINS - Ei desimaaleja */}

          {Object.keys(results.xpGained).length > 0 && (
            <div>
              <h3 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-3 opacity-50">
                Experience Gained
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {Object.entries(results.xpGained).map(([skill, amount]) => (
                  <div
                    key={skill}
                    className="bg-panel border border-border/50 p-3 rounded-lg flex justify-between items-center shadow-inner"
                  >
                    <span className="capitalize text-tx-main font-bold text-sm tracking-wide">
                      {skill}
                    </span>

                    <span className="text-accent font-mono font-black text-lg">
                      +{Math.floor(amount as number)} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITEM GAINS - Ei desimaaleja */}

          {Object.keys(results.itemsGained).length > 0 && (
            <div>
              <h3 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-3 opacity-50">
                Loot Collected
              </h3>

              <div className="space-y-2">
                {Object.entries(results.itemsGained).map(([itemId, count]) => {
                  const item = getItemDetails(itemId);

                  const visualItem = item as unknown as ItemVisuals;

                  const itemIcon = visualItem?.icon || visualItem?.image;

                  return (
                    <div
                      key={itemId}
                      className="flex items-center gap-4 bg-panel border border-border/50 p-2 rounded-lg hover:border-accent/30 transition-colors"
                    >
                      <div className="w-10 h-10 bg-base rounded border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {itemIcon ? (
                          <img
                            src={itemIcon}
                            alt={item?.name}
                            className="w-8 h-8 object-contain pixelated"
                          />
                        ) : (
                          <span className="text-lg">📦</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-bold text-tx-main uppercase tracking-tight">
                          {item?.name || itemId}
                        </div>
                      </div>

                      <div className="text-accent font-mono font-black text-lg pr-2">
                        x{Math.floor(count as number)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(results.xpGained).length === 0 &&
            Object.keys(results.itemsGained).length === 0 && (
              <div className="text-center text-tx-muted font-bold text-xs py-8 border-2 border-dashed border-border/30 rounded-xl opacity-50 uppercase tracking-widest">
                No progress was made.
              </div>
            )}
        </div>

        {/* FOOTER */}

        <div className="p-4 border-t border-border bg-panel-hover/30">
          <button
            onClick={onClose}
            className="w-full py-4 bg-panel-hover hover:bg-accent text-accent hover:text-white font-black rounded-lg transition-all uppercase tracking-[0.3em] text-sm border border-accent/30 hover:border-accent active:scale-95 shadow-lg"
          >
            Collect & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
