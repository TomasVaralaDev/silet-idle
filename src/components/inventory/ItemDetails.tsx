import type { InventoryItem } from "./InventoryGrid";
import { getEquippedItem } from "../../utils/equipmentUtils";
import StatComparison from "./StatComparison";
import { getRarityStyle } from "../../utils/rarity";
import { useGameStore } from "../../store/useGameStore";

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSell: () => void;
  onEquip?: () => void;
  isMobile?: boolean; // UUSI PROP
}

export default function ItemDetails({
  item,
  onClose,
  onSell,
  onEquip,
  isMobile = false,
}: Props) {
  const skills = useGameStore((state) => state.skills);
  const openPouch = useGameStore((state) => state.openPouch);

  const isEquippable = !!item.slot;
  const isPouch = item.id.startsWith("pouch_mystery_");
  const currentlyEquipped = getEquippedItem(item.slot);
  const theme = getRarityStyle(item.rarity);

  let requiredSkillName = "Smithing";
  let playerSkillLevel = skills.smithing?.level || 1;
  let meetsRequirement = true;

  if (item.level && item.level > 1) {
    if (
      item.slot === "weapon" ||
      item.category === "weapon" ||
      item.slot === "necklace"
    ) {
      requiredSkillName = "Crafting";
      playerSkillLevel = skills.crafting?.level || 1;
    } else if (item.slot === "food" || item.healing) {
      requiredSkillName = "Alchemy";
      playerSkillLevel = skills.alchemy?.level || 1;
    } else {
      requiredSkillName = "Smithing";
      playerSkillLevel = skills.smithing?.level || 1;
    }
    meetsRequirement = playerSkillLevel >= item.level;
  }

  return (
    <div
      className={`
      w-full bg-panel flex flex-col relative shrink-0 shadow-2xl
      ${isMobile ? "rounded-t-2xl border-none" : `border rounded-xl ${theme.border} border-opacity-50 animate-in slide-in-from-top-4 fade-in duration-300`}
    `}
    >
      <div className="p-4 flex gap-4 relative border-b border-border/50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-app-base text-tx-muted hover:text-[#E43636] border border-border hover:border-[#E43636]/50 rounded-full w-6 h-6 flex items-center justify-center transition-colors text-xs z-20"
        >
          ✕
        </button>

        <div
          className={`w-16 h-16 shrink-0 rounded-lg border ${theme.border} ${theme.lightBg} flex items-center justify-center relative overflow-hidden shadow-lg ${theme.glow}`}
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

        <div className="flex flex-col justify-center min-w-0 pr-6">
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

      <div className="px-4 py-3 space-y-3">
        <p className="text-xs text-tx-muted italic leading-relaxed border-l-2 border-[#E43636]/50 pl-3 bg-app-base/30 py-1">
          "{item.description || "A mysterious item with no description."}"
        </p>

        {!meetsRequirement && (
          <div className="bg-[#E43636]/10 border border-[#E43636]/30 rounded p-2 text-center mt-2">
            <p className="text-[10px] font-bold text-[#E43636] uppercase tracking-wider">
              Requires Lv. {item.level} {requiredSkillName} to equip
            </p>
          </div>
        )}

        {(item.stats || item.healing) && (
          <div className="grid grid-cols-2 gap-2 mt-2 bg-app-base/50 p-2 rounded-lg border border-border/50">
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
              <div className="bg-success/10 px-3 py-2 rounded border border-success/30 flex justify-between items-center text-xs col-span-2">
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
        className={`grid ${isEquippable || isPouch ? "grid-cols-2" : "grid-cols-1"} border-t border-border divide-x divide-border bg-app-base/50`}
      >
        <button
          onClick={onSell}
          className="py-4 text-xs font-black uppercase tracking-widest text-[#E43636] hover:bg-[#E43636]/10 transition-colors flex items-center justify-center gap-2 group"
        >
          <span className="group-hover:scale-125 transition-transform">💰</span>{" "}
          Sell
        </button>

        {isEquippable && (
          <button
            onClick={() => {
              if (meetsRequirement && onEquip) {
                onEquip();
              }
            }}
            disabled={!meetsRequirement}
            className={`py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
              meetsRequirement
                ? "text-tx-main hover:bg-success/20 hover:text-success"
                : "text-tx-muted/30 cursor-not-allowed"
            }`}
          >
            Equip <span className="opacity-50">→</span>
          </button>
        )}

        {isPouch && (
          <button
            onClick={() => {
              openPouch(item.id);
              onClose();
            }}
            className="py-4 text-xs font-black uppercase tracking-widest text-accent bg-accent/5 hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
          >
            Open
          </button>
        )}
      </div>
    </div>
  );
}
