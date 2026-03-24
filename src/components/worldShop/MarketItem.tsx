import { useState } from "react";
import { getItemDetails } from "../../data";
import type { WorldShopItem } from "../../types";

interface Props {
  item: WorldShopItem;
  onBuy: (id: string, amount: number) => void;
  playerInventory: Record<string, number>;
  playerCoins: number;
  purchaseCount: number;
}

export default function MarketItem({
  item,
  onBuy,
  playerInventory,
  playerCoins,
  purchaseCount,
}: Props) {
  const [selectedAmount, setSelectedAmount] = useState(1);

  // 1. LASKETAAN RAJOITUKSET
  const remainingLimit = item.dailyLimit
    ? item.dailyLimit - purchaseCount
    : 999;
  const isLimitReached =
    item.dailyLimit !== undefined && purchaseCount >= item.dailyLimit;

  // 2. LASKETAAN MAKSIMIMÄÄRÄ (Affordability + Limit)
  const maxByCoins = Math.floor(playerCoins / item.costCoins);
  const maxByMats = item.costMaterials.map((m) => {
    const current = playerInventory[m.itemId] || 0;
    return Math.floor(current / m.amount);
  });

  // Todellinen maksimi on pienin näistä kaikista
  const absoluteMax = Math.max(
    1,
    Math.min(maxByCoins, ...maxByMats, remainingLimit),
  );

  // Kokonaiskustannukset valitulle määrälle
  const totalCoinCost = item.costCoins * selectedAmount;
  const canAffordCoins = playerCoins >= totalCoinCost;
  const canAffordMats = item.costMaterials.every(
    (m) => (playerInventory[m.itemId] || 0) >= m.amount * selectedAmount,
  );

  const canAffordAll = canAffordCoins && canAffordMats && !isLimitReached;

  const adjustAmount = (val: number) => {
    const next = selectedAmount + val;
    if (next >= 1 && next <= remainingLimit) {
      setSelectedAmount(next);
    }
  };

  const setMaxAmount = () => {
    setSelectedAmount(absoluteMax);
  };

  return (
    <div
      className={`relative group flex flex-col bg-panel/60 backdrop-blur-sm border transition-all duration-300 rounded-2xl overflow-hidden
      ${canAffordAll ? "border-border hover:border-accent/50" : "border-danger/20 opacity-80"}`}
    >
      {/* DAILY LIMIT */}
      {item.dailyLimit && (
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border z-10
            ${isLimitReached ? "bg-danger/20 text-danger border-danger/40" : "bg-app-base/80 text-accent border-accent/30"}`}
        >
          Daily: {purchaseCount}/{item.dailyLimit}
        </div>
      )}

      {/* Yläosa: Tiedot */}
      <div className="p-5 flex gap-4">
        <div className="relative shrink-0">
          <div
            className={`w-16 h-16 bg-app-base rounded-xl border flex items-center justify-center overflow-hidden
             ${isLimitReached ? "border-danger/30 grayscale opacity-50" : "border-border"}`}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-10 h-10 pixelated"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-accent text-white text-[10px] font-black px-1.5 py-0.5 rounded border border-accent-hover z-20">
            x{item.resultAmount * selectedAmount}
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3
            className={`text-sm font-black uppercase truncate ${isLimitReached ? "text-tx-muted line-through" : "text-tx-main"}`}
          >
            {item.name}
          </h3>
          <p className="text-[11px] text-tx-muted leading-tight mt-1 line-clamp-2 italic">
            "{item.description}"
          </p>
        </div>
      </div>

      {/* Keskiosa: Määrän valinta + MAX-nappi */}
      {!isLimitReached && (
        <div className="px-5 mb-4 flex items-center gap-3">
          <div className="flex-1 flex items-center justify-between bg-black/20 py-2 px-3 rounded-lg border border-white/5">
            <button
              onClick={() => adjustAmount(-1)}
              disabled={selectedAmount <= 1}
              className="w-8 h-8 rounded bg-panel border border-border flex items-center justify-center font-bold hover:bg-accent/20 disabled:opacity-30 transition-colors"
            >
              -
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-black text-tx-muted">
                Qty
              </span>
              <span className="text-sm font-mono font-black text-accent">
                {selectedAmount}
              </span>
            </div>

            <button
              onClick={() => adjustAmount(1)}
              disabled={selectedAmount >= remainingLimit}
              className="w-8 h-8 rounded bg-panel border border-border flex items-center justify-center font-bold hover:bg-accent/20 disabled:opacity-30 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={setMaxAmount}
            disabled={selectedAmount === absoluteMax || absoluteMax <= 0}
            className="h-full px-4 py-2 bg-accent/10 hover:bg-accent/30 text-accent border border-accent/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-30"
          >
            Max
          </button>
        </div>
      )}

      {/* Kustannukset */}
      <div className="px-5 pb-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold
            ${canAffordCoins ? "bg-warning/5 border-warning/20 text-warning" : "bg-danger/5 border-danger/20 text-danger"}`}
          >
            <img src="/assets/ui/coins.png" className="w-4 h-4" alt="Coins" />
            {totalCoinCost.toLocaleString()}
          </div>

          {item.costMaterials.map((mat) => {
            const details = getItemDetails(mat.itemId);
            const current = playerInventory[mat.itemId] || 0;
            const required = mat.amount * selectedAmount;
            const enough = current >= required;
            return (
              <div
                key={mat.itemId}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold
                ${enough ? "bg-success/5 border-success/20 text-success" : "bg-danger/5 border-danger/20 text-danger"}`}
              >
                {details?.icon && (
                  <img
                    src={details.icon}
                    className="w-4 h-4 pixelated"
                    alt=""
                  />
                )}
                {current}/{required}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ostonappi */}
      <button
        onClick={() => onBuy(item.id, selectedAmount)}
        disabled={!canAffordAll}
        className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all
          ${
            isLimitReached
              ? "bg-panel text-danger/80 border-t border-danger/10 cursor-not-allowed"
              : canAffordAll
                ? "bg-accent/20 hover:bg-accent text-accent hover:text-white border-t border-accent/30"
                : "bg-app-base text-tx-muted/60 border-t border-border cursor-not-allowed"
          }`}
      >
        {isLimitReached
          ? "Daily Limit Reached"
          : canAffordAll
            ? `Confirm Exchange (x${selectedAmount})`
            : "Insufficient Assets"}
      </button>
    </div>
  );
}
