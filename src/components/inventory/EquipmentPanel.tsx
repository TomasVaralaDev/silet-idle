import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import { getRarityStyle } from "../../utils/rarity";
import type { EquipmentSlot } from "../../types";

export default function EquipmentPanel() {
  const equipment = useGameStore((state) => state.equipment);
  const unequipItem = useGameStore((state) => state.unequipItem);

  const getIndicatorClass = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]";
      case "epic":
        return "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]";
      case "rare":
        return "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]";
      case "uncommon":
        return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]";
      default:
        return "bg-slate-500";
    }
  };

  const renderSlot = (
    slot: Exclude<EquipmentSlot, "food">,
    isSmall: boolean = false,
  ) => {
    const itemId = equipment[slot];
    const item = itemId ? getItemDetails(itemId) : null;

    const containerSize = isSmall ? "w-14 h-14" : "w-20 h-20";
    const iconSize = isSmall ? "w-8 h-8" : "w-10 h-10";

    const rarityStyle = item ? getRarityStyle(item.rarity) : null;

    return (
      <div
        onClick={() => item && unequipItem(slot)}
        className={`
          ${containerSize} rounded-xl border flex items-center justify-center relative transition-all group
          ${
            item
              ? `bg-panel-hover ${rarityStyle?.border} shadow-lg cursor-pointer hover:border-danger/50`
              : "bg-app-base/20 border-border/40 border-dashed"
          }
        `}
        title={item ? `Unequip ${item.name}` : `Empty ${slot} slot`}
      >
        {!item && (
          <span className="text-[8px] text-tx-muted/30 uppercase font-black text-center leading-none select-none tracking-widest">
            {slot}
          </span>
        )}

        {item && (
          <>
            <img
              src={item.icon}
              alt={item.name}
              className={`${iconSize} pixelated drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform z-10`}
            />
            <div
              className={`absolute bottom-0 inset-x-0 h-1.5 rounded-b-xl opacity-90 ${getIndicatorClass(
                item.rarity,
              )}`}
            />
            <div className="absolute inset-0 bg-danger/10 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity z-20">
              <span className="text-[7px] font-black uppercase text-danger bg-panel px-1.5 py-0.5 rounded border border-danger/30">
                Remove
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    // MUUTETTU: Poistettu 'h-full', lisätty 'shrink-0' jotta ei puristu kasaan
    <div className="bg-panel border border-border rounded-xl p-5 flex flex-col items-center shadow-inner shrink-0">
      <div className="w-full flex justify-between items-center mb-6 border-b border-border pb-2">
        <h3 className="text-xs font-black text-tx-muted uppercase tracking-widest">
          Active Loadout
        </h3>
        <span className="text-[8px] bg-app-base px-2 py-0.5 rounded border border-border text-tx-muted font-bold">
          Slot-Based
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div /> {renderSlot("head")} <div />
        {renderSlot("weapon")} {renderSlot("body")} {renderSlot("shield")}
        <div /> {renderSlot("legs")} <div />
      </div>

      <div className="w-full bg-app-base/20 rounded-xl p-3 border border-border/30">
        <div className="flex justify-center gap-2">
          {renderSlot("necklace", true)}
          {renderSlot("ring", true)}
          {renderSlot("rune", true)}
          {renderSlot("skill", true)}
        </div>
      </div>
    </div>
  );
}
