import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { WORLD_INFO } from "../../data/worlds";
import { formatRemainingTime } from "../../utils/formatUtils";

export default function ActiveExpeditions() {
  const { scavenger, claimExpedition, cancelExpedition } = useGameStore();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (scavenger.activeExpeditions.length === 0) {
    return (
      <div className="p-6 md:p-8 text-center border border-dashed border-border rounded-xl text-tx-muted/70 flex flex-col items-center justify-center bg-app-base/30">
        <img
          src="/assets/ui/icon_map.png"
          alt="No Expeditions"
          className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 opacity-20 pixelated grayscale"
        />
        <p className="text-xs md:text-sm font-bold opacity-50 uppercase tracking-wide">
          No active expeditions
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {scavenger.activeExpeditions.map((exp) => {
        const worldInfo = WORLD_INFO[exp.mapId];
        const elapsed = now - exp.startTime;
        const progress = Math.min(100, (elapsed / exp.duration) * 100);
        const timeLeft = Math.max(0, exp.duration - elapsed);
        const isFinished = timeLeft <= 0;

        return (
          <div
            key={exp.id}
            className={`bg-panel border p-3 md:p-4 rounded-lg relative overflow-hidden group transition-colors ${
              isFinished ? "border-success/50 bg-success/5" : "border-border"
            }`}
          >
            {/* Progress Bar */}
            <div
              className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${
                isFinished ? "bg-success" : "bg-warning"
              }`}
              style={{ width: `${progress}%` }}
            />

            <div className="flex justify-between items-center mb-2 relative z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-app-base border border-border-hover overflow-hidden shrink-0">
                  {worldInfo?.image && (
                    <img
                      src={worldInfo.image}
                      className="w-full h-full object-cover opacity-80"
                      alt=""
                    />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs md:text-sm text-tx-main line-clamp-1">
                    {worldInfo?.name || `World ${exp.mapId}`}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-tx-muted uppercase font-black tracking-tighter">
                    Active Expedition
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div
                  className={`font-mono text-xs md:text-sm font-bold ${
                    isFinished ? "text-success" : "text-warning"
                  }`}
                >
                  {isFinished ? "COMPLETED" : formatRemainingTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2 md:mt-3 relative z-10">
              {!isFinished ? (
                <button
                  onClick={() => cancelExpedition(exp.id)}
                  className="px-3 py-1.5 md:py-1 bg-danger/10 hover:bg-danger/20 text-danger text-[9px] md:text-[10px] font-bold uppercase rounded border border-danger/30 transition-colors"
                >
                  Abort
                </button>
              ) : (
                <button
                  onClick={() => claimExpedition(exp.id)}
                  className="w-full md:w-auto px-4 py-2 md:py-1.5 bg-success hover:bg-success/80 text-white text-[10px] md:text-xs font-bold rounded shadow-lg shadow-success/20 animate-pulse uppercase tracking-wider"
                >
                  Collect Rewards
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
