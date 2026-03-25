import { useState } from "react";
import { getItemDetails } from "../../data";
import type { GameState, Resource } from "../../types";

interface SellModalProps {
  itemId: string | null;
  inventory: GameState["inventory"];
  onClose: () => void;
  onSell: (itemId: string, amount: number | "all") => void;
}

export default function SellModal({
  itemId,
  inventory,
  onClose,
  onSell,
}: SellModalProps) {
  const [sellAmount, setSellAmount] = useState<string>("1");

  if (!itemId) return null;

  const item = getItemDetails(itemId) as Resource;
  const count = inventory[itemId] || 0;

  if (!item) return null;

  const handleSell = () => {
    const amount = sellAmount === "all" ? "all" : parseInt(sellAmount);
    if (amount !== "all" && (isNaN(amount) || amount <= 0)) return;
    onSell(itemId, amount);
    onClose();
    setSellAmount("1");
  };

  const currentAmount =
    sellAmount === "all" ? count : parseInt(sellAmount) || 0;
  const totalValue = currentAmount * item.value;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-panel border border-border w-full max-w-md rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.7)] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-tx-muted hover:text-tx-main transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-app-base rounded-full border-2 border-border mx-auto flex items-center justify-center mb-3 shadow-inner">
            <img
              src={item.icon}
              alt={item.name}
              className="w-10 h-10 pixelated"
            />
          </div>
          <h2
            className={`text-xl font-bold ${item.color || "text-tx-main"} uppercase tracking-wider`}
          >
            {item.name}
          </h2>
          <p className="text-xs text-tx-muted font-mono mt-1">
            Unit Value: <span className="text-warning">{item.value}g</span>
          </p>
        </div>

        <div className="bg-app-base/50 p-4 rounded-lg border border-border/50 mb-6">
          <div className="flex justify-between items-center mb-2 text-sm text-tx-muted">
            <span>In Storage:</span>
            <span className="font-mono font-bold text-tx-main">{count}</span>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSellAmount("1")}
              className="flex-1 py-2 bg-panel hover:bg-panel-hover rounded text-xs font-bold text-tx-muted border border-border transition-colors"
            >
              1
            </button>
            <button
              onClick={() => setSellAmount(Math.floor(count / 2).toString())}
              className="flex-1 py-2 bg-panel hover:bg-panel-hover rounded text-xs font-bold text-tx-muted border border-border transition-colors"
            >
              50%
            </button>
            <button
              onClick={() => setSellAmount("all")}
              className="flex-1 py-2 bg-panel hover:bg-panel-hover rounded text-xs font-bold text-tx-muted border border-border transition-colors"
            >
              ALL
            </button>
          </div>

          <div className="relative">
            <input
              type="number"
              value={sellAmount === "all" ? count : sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="w-full bg-black border border-border rounded py-2 px-3 text-right text-tx-main font-mono focus:border-accent outline-none transition-colors"
            />
            <span className="absolute left-3 top-2 text-tx-muted text-xs font-bold uppercase">
              Amount
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-sm font-bold text-tx-muted uppercase">
            Total Profit
          </span>
          <span className="text-xl font-mono font-bold text-warning flex items-center gap-2">
            {totalValue.toLocaleString()}{" "}
            <img
              src="/assets/ui/coins.png"
              className="w-4 h-4 pixelated"
              alt="g"
            />
          </span>
        </div>

        <button
          onClick={handleSell}
          className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-widest rounded shadow-[0_0_15px_rgb(var(--color-accent)/0.2)] transition-all active:scale-[0.98]"
        >
          Confirm Transaction
        </button>
      </div>
    </div>
  );
}
