import type { InventoryItem } from "./InventoryGrid";
import { formatAttackSpeed } from "../../utils/formatUtils";

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSell: () => void;
  onEquip?: () => void;
}

export default function ItemDetails({ item, onClose, onSell, onEquip }: Props) {
  const isEquippable = item.slot || item.healing || item.category === "Food";

  // Määritellään väriteemat rarityn mukaan
  const getRarityColors = () => {
    switch (item.rarity) {
      case "legendary":
        return {
          border: "border-orange-500",
          text: "text-orange-500",
          bg: "bg-orange-500/10",
          glow: "shadow-orange-500/20",
        };
      case "rare":
        return {
          border: "border-accent",
          text: "text-accent",
          bg: "bg-accent/10",
          glow: "shadow-accent/20",
        };
      case "uncommon":
        return {
          border: "border-success",
          text: "text-success",
          bg: "bg-success/10",
          glow: "shadow-success/20",
        };
      default:
        return {
          border: "border-border",
          text: "text-tx-main",
          bg: "bg-panel-hover",
          glow: "shadow-none",
        };
    }
  };

  const theme = getRarityColors();

  return (
    <div
      className={`
      w-full bg-panel border rounded-xl overflow-hidden flex flex-col relative 
      animate-in slide-in-from-top-4 fade-in duration-300 shadow-xl shrink-0
      ${theme.border} border-opacity-50
    `}
    >
      {/* HEADER SECTION */}
      <div className="p-4 flex gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-tx-muted hover:text-tx-main transition-colors text-xs p-2"
        >
          ✕
        </button>

        {/* ICON BOX */}
        <div
          className={`
          w-16 h-16 shrink-0 rounded-lg border ${theme.border} ${theme.bg} 
          flex items-center justify-center relative overflow-hidden shadow-lg ${theme.glow}
        `}
        >
          <div className={`absolute inset-0 ${theme.bg} blur-md opacity-50`} />
          <img
            src={item.icon}
            alt={item.name}
            className="w-10 h-10 pixelated relative z-10 drop-shadow-md scale-110"
          />
        </div>

        {/* TEXT INFO */}
        <div className="flex flex-col justify-center min-w-0 pr-4">
          <h3
            className={`font-bold text-base leading-tight truncate ${theme.text}`}
          >
            {item.name}
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-tx-muted mt-1">
            {item.rarity} {item.category || "Item"}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] bg-app-base px-2 py-0.5 rounded text-tx-muted border border-border">
              x{item.count}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-warning">
              <span className="font-mono">{item.value}</span>
              <img src="/assets/ui/coins.png" className="w-3 h-3" alt="coins" />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-4 pb-4 space-y-3">
        {/* Description */}
        <p className="text-xs text-tx-muted italic leading-relaxed border-l-2 border-border pl-3">
          "{item.description || "A mysterious item with no description."}"
        </p>

        {/* Stats Grid */}
        {(item.stats || item.healing) && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* OFFENSIVE STATS (Aseet jne) */}
            {item.stats?.attack && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Attack
                </span>
                <span className="text-warning font-mono font-bold">
                  +{item.stats.attack}
                </span>
              </div>
            )}
            {item.stats?.attackSpeed && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Speed
                </span>
                <span className="text-accent font-mono font-bold">
                  {formatAttackSpeed(item.stats.attackSpeed)}
                </span>
              </div>
            )}
            {item.stats?.critChance && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Crit %
                </span>
                <span className="text-danger font-mono font-bold">
                  {(item.stats.critChance * 100).toFixed(0)}%
                </span>
              </div>
            )}
            {item.stats?.critMulti && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Crit DMG
                </span>
                <span className="text-danger font-mono font-bold">
                  {item.stats.critMulti}x
                </span>
              </div>
            )}

            {/* DEFENSIVE STATS (Armorit jne) */}
            {item.stats?.defense && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Defense
                </span>
                <span className="text-accent-hover font-mono font-bold">
                  +{item.stats.defense}
                </span>
              </div>
            )}
            {item.stats?.hpBonus && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Max HP
                </span>
                <span className="text-success font-mono font-bold">
                  +{item.stats.hpBonus}
                </span>
              </div>
            )}
            {item.stats?.strength && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs">
                <span className="text-tx-muted font-bold uppercase text-[10px]">
                  Strength
                </span>
                <span className="text-danger font-mono font-bold">
                  +{item.stats.strength}
                </span>
              </div>
            )}

            {/* HEALING */}
            {item.healing && (
              <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs col-span-2">
                <span className="text-success font-bold uppercase text-[10px]">
                  Restores HP
                </span>
                <span className="text-success font-mono font-bold">
                  +{item.healing}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS FOOTER */}
      <div
        className={`grid ${
          isEquippable ? "grid-cols-2" : "grid-cols-1"
        } border-t border-border divide-x divide-border`}
      >
        <button
          onClick={onSell}
          className="py-3 text-xs font-bold uppercase tracking-wider text-danger hover:bg-danger/10 transition-colors flex items-center justify-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">💰</span>{" "}
          Sell
        </button>

        {isEquippable && (
          <button
            onClick={onEquip}
            className="py-3 text-xs font-bold uppercase tracking-wider text-tx-main hover:bg-panel-hover transition-colors flex items-center justify-center gap-2 bg-panel-hover/50"
          >
            Equip <span className="text-tx-muted">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
