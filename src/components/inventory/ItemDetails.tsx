import type { InventoryItem } from "./InventoryGrid";
import { getEquippedItem } from "../../utils/equipmentUtils";
import StatComparison from "./StatComparison";
import { getRarityStyle } from "../../utils/rarity"; // UUSI IMPORT

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSell: () => void;
  onEquip?: () => void;
}

export default function ItemDetails({ item, onClose, onSell, onEquip }: Props) {
  const isEquippable = item.slot || item.healing || item.category === "Food";
  const currentlyEquipped = getEquippedItem(item.slot);

  // KORJAUS: Haetaan globaali teema!
  const theme = getRarityStyle(item.rarity);

  return (
    <div
      className={`
      w-full bg-panel border rounded-xl overflow-hidden flex flex-col relative 
      animate-in slide-in-from-top-4 fade-in duration-300 shadow-xl shrink-0
      ${theme.border} border-opacity-50
    `}
    >
      <div className="p-4 flex gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-tx-muted hover:text-tx-main transition-colors text-xs p-2 z-20"
        >
          ✕
        </button>

        <div
          className={`
          w-16 h-16 shrink-0 rounded-lg border ${theme.border} ${theme.lightBg} 
          flex items-center justify-center relative overflow-hidden shadow-lg ${theme.glow}
        `}
        >
          <div
            className={`absolute inset-0 ${theme.lightBg} blur-md opacity-50`}
          />
          <img
            src={item.icon}
            alt={item.name}
            className="w-10 h-10 pixelated relative z-10 drop-shadow-md scale-110"
          />
        </div>

        <div className="flex flex-col justify-center min-w-0 pr-4">
          <h3
            className={`font-bold text-base leading-tight truncate ${theme.text}`}
          >
            {item.name}
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-tx-muted mt-1">
            <span className={theme.text}>{item.rarity}</span>{" "}
            {item.category || "Item"}
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

      <div className="px-4 pb-4 space-y-3">
        <p className="text-xs text-tx-muted italic leading-relaxed border-l-2 border-border pl-3">
          "{item.description || "A mysterious item with no description."}"
        </p>

        {(item.stats || item.healing) && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(item.stats?.attack || currentlyEquipped?.stats?.attack) && (
              <StatComparison
                label="Attack"
                newValue={item.stats?.attack}
                oldValue={currentlyEquipped?.stats?.attack}
              />
            )}
            {(item.stats?.attackSpeed ||
              currentlyEquipped?.stats?.attackSpeed) && (
              <StatComparison
                label="Speed"
                newValue={item.stats?.attackSpeed}
                oldValue={currentlyEquipped?.stats?.attackSpeed}
                isSpeed={true}
              />
            )}
            {(item.stats?.critChance ||
              currentlyEquipped?.stats?.critChance) && (
              <StatComparison
                label="Crit %"
                newValue={item.stats?.critChance}
                oldValue={currentlyEquipped?.stats?.critChance}
                isPercentage={true}
              />
            )}
            {(item.stats?.critMulti || currentlyEquipped?.stats?.critMulti) && (
              <StatComparison
                label="Crit DMG"
                newValue={item.stats?.critMulti}
                oldValue={currentlyEquipped?.stats?.critMulti}
                isMultiplier={true}
              />
            )}

            {(item.stats?.defense || currentlyEquipped?.stats?.defense) && (
              <StatComparison
                label="Defense"
                newValue={item.stats?.defense}
                oldValue={currentlyEquipped?.stats?.defense}
              />
            )}
            {(item.stats?.hpBonus || currentlyEquipped?.stats?.hpBonus) && (
              <StatComparison
                label="Max HP"
                newValue={item.stats?.hpBonus}
                oldValue={currentlyEquipped?.stats?.hpBonus}
              />
            )}
            {(item.stats?.strength || currentlyEquipped?.stats?.strength) && (
              <StatComparison
                label="Strength"
                newValue={item.stats?.strength}
                oldValue={currentlyEquipped?.stats?.strength}
              />
            )}

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
