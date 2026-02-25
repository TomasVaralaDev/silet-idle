import { getItemDetails } from "../../data";
import type { WorldShopItem } from "../../types";

interface Props {
  item: WorldShopItem;
  onBuy: (id: string) => void;
  playerInventory: Record<string, number>;
  playerCoins: number;
  purchaseCount: number; // Lisätty: tieto montako ostettu
}

export default function MarketItem({
  item,
  onBuy,
  playerInventory,
  playerCoins,
  purchaseCount,
}: Props) {
  const canAffordCoins = playerCoins >= item.costCoins;
  const canAffordMats = item.costMaterials.every(
    (m) => (playerInventory[m.itemId] || 0) >= m.amount
  );

  // Daily limit tarkistus
  const isLimitReached =
    item.dailyLimit !== undefined && purchaseCount >= item.dailyLimit;

  const canAffordAll = canAffordCoins && canAffordMats && !isLimitReached;

  return (
    <div
      className={`
      relative group flex flex-col bg-panel/60 backdrop-blur-sm border transition-all duration-300 rounded-2xl overflow-hidden
      ${
        canAffordAll
          ? "border-border hover:border-accent/50 hover:bg-panel/80 hover:shadow-[0_0_20px_rgb(var(--color-accent)/0.1)]"
          : "border-danger/20 opacity-80"
      }
    `}
    >
      {/* DAILY LIMIT MERKKI (oikea yläkulma) */}
      {item.dailyLimit && (
        <div
          className={`
            absolute top-3 right-3 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border z-10
            ${
              isLimitReached
                ? "bg-danger/20 text-danger border-danger/40"
                : "bg-app-base/80 text-accent border-accent/30"
            }
        `}
        >
          Daily: {purchaseCount}/{item.dailyLimit}
        </div>
      )}

      {/* Yläosa: Tuotteen tiedot */}
      <div className="p-5 flex gap-4">
        {/* Kuvake */}
        <div className="relative shrink-0">
          <div
            className={`
             w-16 h-16 bg-app-base rounded-xl border flex items-center justify-center overflow-hidden shadow-inner transition-colors
             ${
               isLimitReached
                 ? "border-danger/30 grayscale opacity-50"
                 : "border-border"
             }
          `}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-10 h-10 pixelated group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-accent text-white text-[10px] font-black px-1.5 py-0.5 rounded border border-accent-hover shadow-sm z-20">
            x{item.resultAmount}
          </div>
        </div>

        {/* Tekstit */}
        <div className="flex-1 min-w-0 pt-1">
          <h3
            className={`text-sm font-black uppercase tracking-tight truncate ${
              isLimitReached ? "text-tx-muted line-through" : "text-tx-main"
            }`}
          >
            {item.name}
          </h3>
          <p className="text-[11px] text-tx-muted leading-tight mt-1 line-clamp-2 italic">
            "{item.description}"
          </p>
        </div>
      </div>

      {/* Keskiosa: Kustannukset */}
      <div className="px-5 pb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Fragment Hinta (Aina varoitusväri/kulta, paitsi jos ei varaa) */}
          <div
            className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-colors
            ${
              canAffordCoins
                ? "bg-warning/5 border-warning/20 text-warning"
                : "bg-danger/5 border-danger/20 text-danger"
            }
          `}
          >
            <img src="/assets/ui/coins.png" className="w-4 h-4" alt="Coins" />
            {item.costCoins.toLocaleString()}
          </div>

          {/* Materiaali Hinnat */}
          {item.costMaterials.map((mat) => {
            const details = getItemDetails(mat.itemId);
            const current = playerInventory[mat.itemId] || 0;
            const enough = current >= mat.amount;
            return (
              <div
                key={mat.itemId}
                className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-colors
                ${
                  enough
                    ? "bg-success/5 border-success/20 text-success"
                    : "bg-danger/5 border-danger/20 text-danger"
                }
              `}
              >
                {details?.icon && (
                  <img
                    src={details.icon}
                    className="w-4 h-4 pixelated"
                    alt=""
                  />
                )}
                {current}/{mat.amount}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alaosa: Ostonappi */}
      <button
        onClick={() => onBuy(item.id)}
        disabled={!canAffordAll}
        className={`
          w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all
          ${
            isLimitReached
              ? "bg-panel text-danger/80 border-t border-danger/10 cursor-not-allowed"
              : canAffordAll
              ? "bg-accent/20 hover:bg-accent text-accent hover:text-white border-t border-accent/30"
              : "bg-app-base text-tx-muted/60 border-t border-border cursor-not-allowed"
          }
        `}
      >
        {isLimitReached
          ? "Daily Limit Reached"
          : canAffordAll
          ? "Authorize Exchange"
          : "Insufficient Assets"}
      </button>
    </div>
  );
}
