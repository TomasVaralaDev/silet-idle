import { useState, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import {
  getEnchantLevel,
  getEnchantCost,
  MAX_ENCHANT_LEVEL,
  getSuccessChance,
} from "../../utils/enchanting";
import { getRarityStyle } from "../../utils/rarity";
import type { Resource } from "../../types";

export default function EnchantingView() {
  const { inventory, equipment, coins, attemptEnchant } = useGameStore();

  const [selectedSlot, setSelectedSlot] = useState<
    keyof typeof equipment | null
  >("weapon");
  const [selectedScrollId, setSelectedScrollId] = useState<string | null>(null);

  const selectedItemId = selectedSlot ? equipment[selectedSlot] : null;
  const selectedItem = selectedItemId
    ? (getItemDetails(selectedItemId) as Resource)
    : null;
  const currentLevel = selectedItemId ? getEnchantLevel(selectedItemId) : 0;
  const isMaxLevel = currentLevel >= MAX_ENCHANT_LEVEL;
  const nextLevel = currentLevel + 1;
  const cost = selectedItem ? getEnchantCost(nextLevel, selectedItem.value) : 0;
  const canAfford = coins >= cost;

  const availableScrolls = useMemo(() => {
    return Object.keys(inventory)
      .filter((id) => id.startsWith("scroll_enchant_"))
      .map((id) => {
        const item = getItemDetails(id);
        const tier = parseInt(id.split("_").pop()?.replace("w", "") || "0");
        return {
          id,
          count: inventory[id],
          name: item?.name,
          icon: item?.icon,
          tier,
        };
      })
      .sort((a, b) => b.tier - a.tier);
  }, [inventory]);

  const activeScroll = selectedScrollId
    ? availableScrolls.find((s) => s.id === selectedScrollId)
    : null;
  const scrollTier = activeScroll?.tier || 0;

  const successChance = getSuccessChance(currentLevel, scrollTier);
  const isScrollSelected = selectedScrollId !== null;
  const canEnchant = canAfford && isScrollSelected && !isMaxLevel;

  let chanceColor = "text-tx-muted";
  if (isScrollSelected) {
    if (successChance >= 80) chanceColor = "text-success";
    else if (successChance >= 50) chanceColor = "text-warning";
    else chanceColor = "text-danger";
  }

  return (
    <div className="p-6 h-full bg-app-base overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-8 items-start justify-center">
      <div className="flex-shrink-0 w-full max-w-md mx-auto lg:mx-0">
        <div className="bg-panel border border-border rounded-xl p-6 relative min-h-[400px] shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-hover opacity-50"></div>
          <h2 className="text-center text-tx-muted font-bold uppercase tracking-widest text-sm mb-8">
            Active Gear
          </h2>

          <div className="relative h-[420px] w-full flex justify-center items-center select-none">
            <img
              src="/assets/ui/character_silhouette.png"
              className="absolute h-full opacity-10 contrast-0 brightness-200 pointer-events-none"
              alt=""
            />

            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <EnchantSlot
                slot="head"
                itemId={equipment.head}
                isSelected={selectedSlot === "head"}
                onClick={() => setSelectedSlot("head")}
              />
            </div>
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2">
              <EnchantSlot
                slot="body"
                itemId={equipment.body}
                isSelected={selectedSlot === "body"}
                onClick={() => setSelectedSlot("body")}
              />
            </div>
            <div className="absolute top-[50%] left-1/2 -translate-x-1/2">
              <EnchantSlot
                slot="legs"
                itemId={equipment.legs}
                isSelected={selectedSlot === "legs"}
                onClick={() => setSelectedSlot("legs")}
              />
            </div>
            <div className="absolute top-[25%] left-[10%]">
              <EnchantSlot
                slot="weapon"
                itemId={equipment.weapon}
                isSelected={selectedSlot === "weapon"}
                onClick={() => setSelectedSlot("weapon")}
              />
            </div>
            <div className="absolute top-[25%] right-[10%]">
              <EnchantSlot
                slot="shield"
                itemId={equipment.shield}
                isSelected={selectedSlot === "shield"}
                onClick={() => setSelectedSlot("shield")}
              />
            </div>

            <div className="absolute bottom-0 w-full flex justify-center gap-2">
              <EnchantSlot
                slot="necklace"
                itemId={equipment.necklace}
                isSelected={selectedSlot === "necklace"}
                onClick={() => setSelectedSlot("necklace")}
              />
              <EnchantSlot
                slot="ring"
                itemId={equipment.ring}
                isSelected={selectedSlot === "ring"}
                onClick={() => setSelectedSlot("ring")}
              />
              <EnchantSlot
                slot="rune"
                itemId={equipment.rune}
                isSelected={selectedSlot === "rune"}
                onClick={() => setSelectedSlot("rune")}
              />
            </div>
          </div>
          <p className="text-center text-xs text-tx-muted mt-6 italic">
            Select a slot to enchant equipped item.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full lg:max-w-md bg-panel border border-border rounded-xl p-6 flex flex-col relative overflow-hidden shadow-2xl min-h-[550px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none"></div>

        {selectedItem ? (
          <div className="relative z-10 w-full flex flex-col h-full gap-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-tx-main tracking-wide">
                {selectedItem.name}
              </h3>
              <div
                className={`text-xs font-bold uppercase tracking-widest ${
                  getRarityStyle(selectedItem.rarity).text
                }`}
              >
                Current Level: +{currentLevel}
              </div>
            </div>

            {!isMaxLevel && (
              <div
                className={`rounded-lg p-3 border transition-colors ${
                  !isScrollSelected
                    ? "bg-danger/10 border-danger/30 animate-pulse"
                    : "bg-app-base border-border"
                }`}
              >
                <div className="text-[10px] font-bold text-tx-muted uppercase mb-2 flex justify-between items-center">
                  <span className={!isScrollSelected ? "text-danger" : ""}>
                    {isScrollSelected
                      ? "Catalyst Selected"
                      : "Select a Catalyst (Required)"}
                  </span>
                  {selectedScrollId && (
                    <button
                      onClick={() => setSelectedScrollId(null)}
                      className="text-xs text-tx-muted hover:text-tx-main"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 min-h-[80px]">
                  {availableScrolls.length > 0 ? (
                    availableScrolls.map((scroll) => (
                      <button
                        key={scroll.id}
                        onClick={() =>
                          setSelectedScrollId(
                            selectedScrollId === scroll.id ? null : scroll.id,
                          )
                        }
                        className={`
                          flex-shrink-0 w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center relative transition-all group
                          ${
                            selectedScrollId === scroll.id
                              ? "bg-accent/20 border-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.3)]"
                              : "bg-panel-hover border-border hover:border-border-hover"
                          }
                        `}
                      >
                        <img
                          src={scroll.icon}
                          className="w-8 h-8 pixelated group-hover:scale-110 transition-transform"
                          alt=""
                        />
                        <span className="text-[10px] font-bold text-success mt-1">
                          T{scroll.tier}
                        </span>
                        <span className="absolute -top-1.5 -right-1.5 bg-panel-hover text-tx-main text-[9px] font-bold px-1.5 rounded-full border border-border shadow-sm z-10">
                          {scroll.count}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-tx-muted italic w-full text-center py-6">
                      No scrolls in inventory
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isMaxLevel && (
              <div className="bg-app-base/40 rounded-xl p-4 border border-border space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-xs text-tx-muted font-bold uppercase">
                    Success Rate
                  </span>
                  <span className={`text-2xl font-black ${chanceColor}`}>
                    {successChance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-tx-muted font-bold uppercase">
                    Cost
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/ui/coins.png"
                      className="w-4 h-4"
                      alt="Coins"
                    />
                    <span
                      className={`font-mono font-bold ${
                        canAfford ? "text-tx-main" : "text-danger"
                      }`}
                    >
                      {cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isMaxLevel && (
              <button
                onClick={() =>
                  isScrollSelected &&
                  attemptEnchant(selectedItemId!, selectedScrollId!)
                }
                disabled={!canEnchant}
                className={`w-full py-4 mt-auto rounded-xl font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group
                  ${
                    canEnchant
                      ? "bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgb(var(--color-accent)/0.3)]"
                      : "bg-panel-hover text-tx-muted/50 cursor-not-allowed border border-border"
                  }`}
              >
                {!isScrollSelected
                  ? "Select Scroll to Enchant"
                  : canAfford
                    ? "Attempt Enchant"
                    : "Insufficient Coins"}
              </button>
            )}

            {isMaxLevel && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-warning font-bold text-xl uppercase tracking-widest bg-warning/10 px-6 py-3 rounded border border-warning/20">
                  Max Level
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-tx-muted">
            <p className="text-sm font-bold uppercase opacity-30">
              No Item Selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EnchantSlot({
  slot,
  itemId,
  isSelected,
  onClick,
}: {
  slot: string;
  itemId: string | null;
  isSelected: boolean;
  onClick: () => void;
}) {
  const item = itemId ? (getItemDetails(itemId) as Resource) : null;
  const rarityStyle = item ? getRarityStyle(item.rarity) : null;
  const enchantLevel = item && itemId ? getEnchantLevel(itemId) : 0;

  const getPlaceholder = (s: string) => {
    switch (s) {
      case "head":
        return "/assets/ui/slots/slot_head.png";
      case "body":
        return "/assets/ui/slots/slot_body.png";
      case "legs":
        return "/assets/ui/slots/slot_legs.png";
      case "weapon":
        return "/assets/ui/slots/slot_weapon.png";
      case "shield":
        return "/assets/ui/slots/slot_shield.png";
      case "necklace":
        return "/assets/ui/slots/slot_necklace.png";
      case "ring":
        return "/assets/ui/slots/slot_ring.png";
      case "rune":
        return "/assets/ui/slots/slot_rune.png";
      default:
        return "/assets/ui/slots/slot_default.png";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 relative group
        ${
          isSelected
            ? `bg-panel-hover border-2 border-accent shadow-[0_0_15px_rgb(var(--color-accent)/0.4)] scale-110 z-10`
            : `bg-app-base border-2 ${
                rarityStyle ? rarityStyle.border : "border-border"
              } hover:border-border-hover shadow-inner`
        }
      `}
    >
      {item ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-panel/30 to-panel/80 rounded-lg"></div>
          <img
            src={item.icon}
            className="w-10 h-10 sm:w-12 sm:h-12 pixelated relative z-10 drop-shadow-xl"
            alt={item.name}
          />
          {enchantLevel > 0 && (
            <div
              className={`absolute -top-2 -right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow border border-black/20 z-20
              ${
                enchantLevel >= MAX_ENCHANT_LEVEL ? "bg-warning" : "bg-accent"
              }`}
            >
              +{enchantLevel}
            </div>
          )}
          <div
            className={`absolute -bottom-6 w-32 text-center text-[9px] bg-panel text-tx-main px-2 py-1 rounded border border-border pointer-events-none transition-opacity
              ${
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              } z-30`}
          >
            {item.name}
          </div>
        </>
      ) : (
        <img
          src={getPlaceholder(slot)}
          className="w-8 h-8 opacity-20 grayscale pixelated"
          alt="Empty Slot"
        />
      )}
    </div>
  );
}
