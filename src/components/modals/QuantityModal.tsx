import { useState, useEffect, useRef } from "react";
import { getItemDetails } from "../../data";
import { Clock, Target } from "lucide-react";
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
  const item = getItemDetails(itemId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Haetaan pelaajan upgradet storesta nopeuden laskentaa varten
  const upgrades = useGameStore((state) => state.upgrades);

  // Focus input automatically when opened
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // Valitsee automaattisesti numeron "1"
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (val > 0 && val <= maxAmount) {
      onConfirm(val);
    }
  };

  // --- LASKENTA LIVENÄ ---
  const numericAmount = parseInt(amount) || 0;

  // Oletetaan, että item.category vastaa skillin nimeä (esim. "woodcutting").
  // Jos ei, nopeuskerroin on vain 1.
  const skill = (item?.category || "") as SkillType;
  const speedMult = getSpeedMultiplier(skill, upgrades);

  const baseInterval = item?.interval || 3000;
  // Minimissään 200ms per action, aivan kuten skillSlicessä
  const timePerAction = Math.max(200, baseInterval / speedMult);
  const totalTimeMs = timePerAction * numericAmount;
  const totalXp = (item?.xpReward || 0) * numericAmount;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-panel border border-border p-6 rounded-xl w-full max-w-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200">
        {/* SULKUPAINIKE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-tx-muted hover:text-danger hover:bg-danger/10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* OTSIKKO JA IKONI */}
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

        {/* FORMI */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-black text-tx-muted uppercase tracking-widest">
                Amount
              </label>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Max: {maxAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="number"
                min="1"
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-app-base border-2 border-border rounded-lg px-4 py-3 text-tx-main font-mono text-lg focus:border-accent outline-none transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => setAmount(maxAmount.toString())}
                className="bg-panel-hover border border-border hover:border-accent hover:text-accent px-4 rounded-lg text-xs font-black text-tx-main transition-all uppercase tracking-wider"
              >
                Max
              </button>
            </div>
          </div>

          {/* --- UUSI LIVE STATS SECTION --- */}
          {item?.interval && numericAmount > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-6">
              {/* AIKA-ARVIO */}
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

              {/* XP-ARVIO (Näytetään vain, jos action antaa XP:tä) */}
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-accent/10 hover:bg-accent text-accent hover:text-app-base border border-accent hover:border-transparent py-3 rounded-lg font-black transition-all uppercase tracking-widest"
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
