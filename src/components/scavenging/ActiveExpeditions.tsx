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
          src="./assets/ui/icon_map.png"
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {scavenger.activeExpeditions.map((exp) => {
        const worldInfo = WORLD_INFO[exp.mapId];
        const elapsed = now - exp.startTime;
        const progress = Math.min(100, (elapsed / exp.duration) * 100);
        const timeLeft = Math.max(0, exp.duration - elapsed);
        const isFinished = timeLeft <= 0;

        return (
          <div
            key={exp.id}
            className={`group relative flex flex-col bg-panel border-2 rounded-xl overflow-hidden transition-all duration-300 ${
              isFinished
                ? "border-success/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                : "border-border hover:border-border-hover shadow-lg"
            }`}
          >
            {
              // Background Visuals
            }
            <div className="h-24 md:h-28 w-full relative overflow-hidden bg-black">
              {worldInfo?.image && (
                <img
                  src={worldInfo.image}
                  alt=""
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    isFinished ? "opacity-60" : "opacity-40"
                  }`}
                />
              )}
              {
                // Gradients for text readability
              }
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />

              {
                // Overlay Information
              }
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-tx-muted uppercase font-black tracking-widest mb-0.5">
                    Sector Explorer
                  </div>
                  <div className="font-black text-lg md:text-xl text-white uppercase tracking-tight drop-shadow-md">
                    {worldInfo?.name || `World ${exp.mapId}`}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono text-sm md:text-base font-black tracking-tighter drop-shadow-md ${
                      isFinished ? "text-success animate-pulse" : "text-warning"
                    }`}
                  >
                    {isFinished ? "COMPLETED" : formatRemainingTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            {
              // Content Area: Actions and Progress
            }
            <div className="p-4 bg-panel/80 backdrop-blur-sm relative z-10">
              <div className="flex justify-between items-center gap-4">
                <div className="text-[10px] font-mono font-bold text-tx-muted uppercase">
                  Progress: {progress.toFixed(0)}%
                </div>

                <div className="flex gap-2">
                  {!isFinished ? (
                    <button
                      onClick={() => cancelExpedition(exp.id)}
                      className="px-4 py-2 bg-black/40 hover:bg-danger/20 text-danger text-[10px] font-black uppercase rounded border border-danger/30 transition-all active:scale-95"
                    >
                      Abort
                    </button>
                  ) : (
                    <button
                      onClick={() => claimExpedition(exp.id)}
                      className="px-6 py-2 bg-success hover:bg-success/80 text-black text-[11px] font-black rounded shadow-lg shadow-success/20 animate-pulse uppercase tracking-widest transition-all active:scale-95"
                    >
                      Collect Rewards
                    </button>
                  )}
                </div>
              </div>
            </div>

            {
              // Bottom Progress Bar
            }
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/40">
              <div
                className={`h-full transition-all duration-1000 ${
                  isFinished ? "bg-success" : "bg-warning"
                } ${!isFinished && "shadow-[0_0_10px_rgba(245,158,11,0.5)]"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
