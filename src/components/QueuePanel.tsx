import { useGameStore } from "../store/useGameStore";
import { GAME_DATA, getItemDetails } from "../data";
import { useQueueTimer } from "../hooks/useQueueTimer";
import { formatRemainingTime } from "../utils/formatUtils";

export default function QueuePanel() {
  const { queue, removeFromQueue, unlockedQueueSlots } = useGameStore();
  const timeLeftMs = useQueueTimer();

  const maxSlots = unlockedQueueSlots;
  const isFull = queue.length >= maxSlots;
  const extraSlotIndex = queue.length;
  const extraSlotIsLocked = extraSlotIndex >= maxSlots;

  return (
    <div className="pt-2 pb-4 px-4 border-t border-border/50 bg-app-base relative z-10 shrink-0">
      <div className="flex justify-between items-end mb-3 px-2 border-b border-border/50 pb-1">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-tx-muted/80 uppercase tracking-[0.2em] text-left">
            Action Queue
          </p>
          {queue.length > 0 && (
            <span className="text-xs font-mono font-bold text-tx-main animate-pulse">
              ETA: {formatRemainingTime(timeLeftMs)}
            </span>
          )}
        </div>
        <span
          className={`text-[9px] font-bold font-mono tracking-wider mb-1 ${isFull ? "text-danger" : "text-accent"}`}
        >
          {queue.length} / {maxSlots}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-1 max-h-32 md:max-h-48">
        {queue.map((item, index) => {
          const resource = GAME_DATA[item.skill]?.find(
            (r) => r.id === item.resourceId,
          );
          const icon = resource?.icon || getItemDetails(item.resourceId)?.icon;
          const isActive = index === 0;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs relative overflow-hidden transition-colors ${isActive ? "bg-panel border-accent/50 shadow-[0_0_10px_rgb(var(--color-accent)/0.2)]" : "bg-panel/50 border-border/50 hover:bg-panel hover:border-border"}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
              )}
              <div className="flex items-center gap-3 pl-1">
                <span
                  className={`text-[10px] font-black w-3 ${isActive ? "text-accent" : "text-tx-muted/50"}`}
                >
                  {index + 1}.
                </span>
                {icon && (
                  <img
                    src={icon}
                    className={`w-5 h-5 pixelated ${isActive ? "" : "opacity-80"}`}
                    alt=""
                  />
                )}
                <div className="flex flex-col">
                  <span
                    className={`font-bold truncate max-w-[110px] ${isActive ? "text-tx-main" : "text-tx-muted"}`}
                  >
                    {resource?.name || item.resourceId}
                  </span>
                  <span className="text-[9px] font-mono text-tx-muted/70">
                    {item.completed} / {item.amount}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromQueue(item.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-tx-muted/60 hover:text-danger hover:bg-danger/20 transition-all"
              >
                ✕
              </button>
            </div>
          );
        })}

        <div
          className={`flex items-center gap-3 p-2 rounded-lg border border-dashed text-xs transition-all ${extraSlotIsLocked ? "bg-danger/10 border-danger/30 text-danger/70" : "bg-panel/30 border-border/50 text-tx-muted/50"}`}
        >
          <span className="text-[10px] font-black pl-1 w-3 opacity-50">
            {extraSlotIndex + 1}.
          </span>
          <span className="font-bold text-[10px] uppercase tracking-wide">
            {extraSlotIsLocked ? "Locked Slot" : "Empty Slot"}
          </span>
        </div>
      </div>
    </div>
  );
}
