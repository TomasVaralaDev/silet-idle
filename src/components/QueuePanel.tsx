import { useGameStore } from "../store/useGameStore";
import { GAME_DATA, getItemDetails } from "../data";

export default function QueuePanel() {
  const { queue, removeFromQueue, unlockedQueueSlots } = useGameStore();

  const maxSlots = unlockedQueueSlots;
  const isFull = queue.length >= maxSlots;

  // Lasketaan sen "seuraavan" slottin numero (indeksi alkaa nollasta, eli jos jonossa on 2, seuraava on indeksi 2 eli slotti 3)
  const extraSlotIndex = queue.length;
  // Onko tämä seuraava slotti maksumuurin takana?
  const extraSlotIsLocked = extraSlotIndex >= maxSlots;

  return (
    <div className="border-t border-border/50 bg-app-base/80 backdrop-blur p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-tx-main">
          Action Queue
        </h3>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold ${isFull ? "bg-danger/20 text-danger" : "bg-accent/20 text-accent"}`}
        >
          {queue.length} / {maxSlots}
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {/* 1. AKTIIVISET JONOSSA OLEVAT SLOTIT */}
        {queue.map((item, index) => {
          const resource = GAME_DATA[item.skill]?.find(
            (r) => r.id === item.resourceId,
          );
          const icon = resource?.icon || getItemDetails(item.resourceId)?.icon;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs relative overflow-hidden ${index === 0 ? "bg-panel border-accent/50 shadow-[0_0_10px_rgba(var(--color-accent)/0.1)]" : "bg-app-base border-border/50 opacity-90"}`}
            >
              {/* Vihreä sivupalkki osoittamaan, mikä tehtävä on juuri nyt työn alla */}
              {index === 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
              )}

              <div className="flex items-center gap-3 pl-1">
                <span className="text-[10px] font-black text-tx-muted/50 w-3">
                  {index + 1}.
                </span>
                {icon && (
                  <img src={icon} className="w-5 h-5 pixelated" alt="" />
                )}
                <div>
                  <div className="font-bold text-tx-main truncate max-w-[100px]">
                    {resource?.name || item.resourceId}
                  </div>
                  <div className="text-[10px] font-mono text-tx-muted">
                    {item.completed} / {item.amount} done
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromQueue(item.id)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-tx-muted hover:text-danger hover:bg-danger/10 transition-colors"
                title="Remove from queue"
              >
                ✕
              </button>
            </div>
          );
        })}

        {/* 2. AINA YKSI SEURAAVA SLOTTI (Joko Tyhjä tai Lukittu) */}
        <div
          className={`flex items-center gap-3 p-2 rounded-lg border border-dashed text-xs ${extraSlotIsLocked ? "bg-app-base/30 border-danger/20 opacity-50 cursor-pointer hover:opacity-80 transition-opacity" : "bg-app-base/50 border-border/50 text-tx-muted/50"}`}
          onClick={() => {
            // Tulevaisuutta varten: Tähän funktio joka avaa kaupan jos slotti on lukittu!
            if (extraSlotIsLocked) {
              // Esim: openShopModal()
              // alert("Unlock more queue slots in the shop!");
            }
          }}
          title={
            extraSlotIsLocked ? "Buy more slots in the Shop!" : "Empty slot"
          }
        >
          <span className="text-[10px] font-black text-tx-muted/30 pl-1 w-3">
            {extraSlotIndex + 1}.
          </span>
          {extraSlotIsLocked ? (
            <div className="flex items-center gap-2 text-danger">
              <span>🔒</span>
              <span className="font-bold text-[10px] uppercase">
                Locked Slot
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="opacity-50">Empty Slot</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
