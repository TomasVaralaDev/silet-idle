import { useState, useEffect, useRef } from "react";
import { getItemDetails } from "../../data";
import { Clock, Target, AlertCircle } from "lucide-react";
import { formatRemainingTime } from "../../utils/formatUtils";
import { getSpeedMultiplier } from "../../utils/gameUtils";
import { useGameStore } from "../../store/useGameStore";
import type { SkillType } from "../../types";

interface QuantityModalProps {
  itemId: string;
  maxAmount: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
  title: string;
}

export default function QuantityModal({
  itemId,
  maxAmount,
  onConfirm,
  onClose,
  title,
}: QuantityModalProps) {
  const [amount, setAmount] = useState<string>("1");
  const [isError, setIsError] = useState(false);

  const item = getItemDetails(itemId);
  const inputRef = useRef<HTMLInputElement>(null);
  const upgrades = useGameStore((state) => state.upgrades);

  // Focus input automatically when opened
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);

    if (isNaN(val) || val <= 0 || val > maxAmount) {
      setIsError(true);
      return;
    }

    onConfirm(val);
  };

  // Live calculation logic
  const numericAmount = parseInt(amount) || 0;
  const isOverMax = numericAmount > maxAmount;

  const skill = (item?.category || "") as SkillType;
  const speedMult = getSpeedMultiplier(skill, upgrades);

  const baseInterval = item?.interval || 3000;
  const timePerAction = Math.max(200, baseInterval / speedMult);

  const calcAmount = isOverMax ? maxAmount : numericAmount;
  const totalTimeMs = timePerAction * calcAmount;
  const totalXp = (item?.xpReward || 0) * calcAmount;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-panel border border-border p-6 rounded-xl w-full max-w-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-tx-muted hover:text-danger hover:bg-danger/10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <h3 className="text-xl font-black text-tx-main mb-6 flex items-center gap-3 pr-8">
          {item?.icon && (
            <div className="w-10 h-10 bg-app-base border border-border rounded-lg flex items-center justify-center shrink-0 shadow-inner">
              <img
                src={item.icon}
                alt={item.name || "item"}
                className="w-7 h-7 pixelated object-contain drop-shadow-md"
              />
            </div>
          )}
          <span className="truncate tracking-wide">{title}</span>
        </h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <label
                className={`text-xs font-black uppercase tracking-widest transition-colors ${isError || isOverMax ? "text-danger" : "text-tx-muted"}`}
              >
                Amount
              </label>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  isOverMax
                    ? "bg-danger/10 text-danger border-danger/30"
                    : "bg-accent/10 text-accent border-accent/20"
                }`}
              >
                Max: {maxAmount.toLocaleString()}
              </span>
            </div>

            <div
              className={`flex gap-2 ${isError ? "animate-shake-horizontal" : ""}`}
            >
              <input
                ref={inputRef}
                type="number"
                min="1"
                max={maxAmount}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (isError) setIsError(false);
                }}
                className={`w-full bg-app-base border-2 rounded-lg px-4 py-3 text-tx-main font-mono text-lg outline-none transition-colors shadow-inner ${
                  isError || isOverMax
                    ? "border-danger focus:border-danger text-danger bg-danger/5"
                    : "border-border focus:border-accent"
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setAmount(maxAmount.toString());
                  if (isError) setIsError(false);
                }}
                className="bg-panel-hover border border-border hover:border-accent hover:text-accent px-4 rounded-lg text-xs font-black text-tx-main transition-all uppercase tracking-wider"
              >
                Max
              </button>
            </div>

            <div
              className={`mt-2 flex items-center gap-1 text-[10px] font-bold text-danger transition-opacity duration-200 ${isError || isOverMax ? "opacity-100" : "opacity-0"}`}
            >
              <AlertCircle size={12} />
              <span>Please enter a valid amount (1 - {maxAmount}).</span>
            </div>
          </div>

          {item?.interval && numericAmount > 0 && !isError && (
            <div
              className={`grid grid-cols-2 gap-2 mb-6 transition-opacity ${isOverMax ? "opacity-50" : "opacity-100"}`}
            >
              <div className="bg-app-base p-3 border border-border rounded-lg shadow-inner">
                <div className="flex items-center gap-1.5 text-tx-muted mb-1">
                  <Clock size={12} className="text-warning" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-warning">
                    Duration
                  </span>
                </div>
                <div className="text-tx-main font-mono text-sm mb-0.5">
                  {formatRemainingTime(totalTimeMs)}
                </div>
                <div className="text-[9px] text-tx-muted font-mono">
                  {(timePerAction / 1000).toFixed(1)}s / act
                </div>
              </div>

              {item?.xpReward ? (
                <div className="bg-app-base p-3 border border-border rounded-lg shadow-inner">
                  <div className="flex items-center gap-1.5 text-tx-muted mb-1">
                    <Target size={12} className="text-success" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-success">
                      Total XP
                    </span>
                  </div>
                  <div className="text-tx-main font-mono text-sm mb-0.5">
                    +{totalXp.toLocaleString()} XP
                  </div>
                  <div className="text-[9px] text-tx-muted font-mono">
                    {item.xpReward} XP / act
                  </div>
                </div>
              ) : (
                <div className="bg-app-base p-3 border border-border rounded-lg shadow-inner opacity-50 flex items-center justify-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-tx-muted">
                    No XP Reward
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isError || isOverMax}
              className={`flex-1 py-3 rounded-lg font-black transition-all uppercase tracking-widest border ${
                isError || isOverMax
                  ? "bg-danger/10 text-danger border-danger/30 cursor-not-allowed opacity-50"
                  : "bg-accent/10 hover:bg-accent text-accent hover:text-app-base border-accent hover:border-transparent"
              }`}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-app-base hover:bg-danger/10 text-tx-muted hover:text-danger border border-border hover:border-danger/30 py-3 rounded-lg font-black transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
