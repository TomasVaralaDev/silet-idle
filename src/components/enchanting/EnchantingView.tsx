import { useState, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import {
  getEnchantLevel,
  getEnchantCost,
  MAX_ENCHANT_LEVEL,
  getSuccessChance,
} from "../../utils/enchanting";
import { getScrollTier } from "../../data/scrolls";
import { getRarityStyle } from "../../utils/rarity";
import type { Resource } from "../../types";

export default function EnchantingView() {
  const { inventory, equipment, coins, attemptEnchant } = useGameStore();

  // Manage which equipment slot the user is currently viewing/enchanting
  const [selectedSlot, setSelectedSlot] = useState<
    keyof typeof equipment | null
  >("weapon");

  // Track which scroll catalyst is selected from the inventory
  const [selectedScrollId, setSelectedScrollId] = useState<string | null>(null);

  // -- Enchanting Logic Calculations --
  const selectedItemId = selectedSlot ? equipment[selectedSlot] : null;
  const selectedItem = selectedItemId
    ? (getItemDetails(selectedItemId) as Resource)
    : null;

  const currentLevel = selectedItemId ? getEnchantLevel(selectedItemId) : 0;
  const isMaxLevel = currentLevel >= MAX_ENCHANT_LEVEL;
  const nextLevel = currentLevel + 1;

  // Calculate cost based on the item's base value and the *next* level it will reach
  const cost = selectedItem
    ? getEnchantCost(nextLevel, selectedItem.value || 100)
    : 0;
  const canAfford = coins >= cost;

  // Memoize available scrolls so we don't recalculate the inventory filter on every render
  const availableScrolls = useMemo(() => {
    return (
      Object.keys(inventory)
        .filter((id) => id.startsWith("scroll_enchant_"))
        .map((id) => {
          const item = getItemDetails(id);
          const tier = getScrollTier(id);
          return {
            id,
            count: inventory[id],
            name: item?.name,
            icon: item?.icon,
            tier,
          };
        })
        // Sort so highest tier (most effective) scrolls appear first
        .sort((a, b) => b.tier - a.tier)
    );
  }, [inventory]);

  const activeScroll = selectedScrollId
    ? availableScrolls.find((s) => s.id === selectedScrollId)
    : null;
  const scrollTier = activeScroll?.tier || 0;

  // Determine success chance based on the current enchant level and the tier of the scroll used
  const successChance = getSuccessChance(currentLevel, scrollTier);
  const isScrollSelected = selectedScrollId !== null;

  // Final validation before allowing the enchant action
  const canEnchant = canAfford && isScrollSelected && !isMaxLevel;

  // Dynamically set the color of the success chance text for visual feedback
  let chanceColor = "text-tx-muted";
  if (isScrollSelected) {
    if (successChance >= 80) chanceColor = "text-success";
    else if (successChance >= 50) chanceColor = "text-warning";
    else chanceColor = "text-[#E43636]"; // Danger/Red indicating high risk of failure
  }

  return (
    <div className="h-full flex flex-col bg-app-base overflow-hidden">
      {
        // Header Section
      }
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-3 md:gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
          <img
            src="/assets/ui/icon_enchanting.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
            alt="Enchanting"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-accent mb-0.5 md:mb-1">
            Enchanting
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium hidden sm:block">
            Infuse your equipment with ancient scrolls to unlock hidden
            potential.
          </p>
        </div>
      </div>

      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-accent transition-all duration-300 shadow-[0_0_10px_rgb(var(--color-accent)/0.5)] w-full"></div>
      </div>

      {
        // Main Scrollable Area
      }
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-10 items-center lg:items-start justify-center">
          {
            // Left Column: Active Loadout Silhouette
            // Uses absolute positioning to map slots to specific parts of the character image
          }
          <div className="w-full max-w-[340px] md:max-w-md shrink-0">
            <div className="bg-panel border border-border rounded-2xl p-4 md:p-8 relative shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-hover opacity-30"></div>
              <h2 className="text-center text-tx-muted font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-6 md:mb-10">
                Active Loadout
              </h2>

              <div className="relative h-[320px] md:h-[420px] w-full flex justify-center items-center select-none">
                <img
                  src="/assets/ui/character_silhouette.png"
                  className="absolute h-full opacity-5 contrast-0 brightness-200 pointer-events-none"
                  alt=""
                />

                <div className="absolute top-0 left-1/2 -translate-x-1/2 scale-90 md:scale-100">
                  <EnchantSlot
                    slot="head"
                    itemId={equipment.head}
                    isSelected={selectedSlot === "head"}
                    onClick={() => setSelectedSlot("head")}
                  />
                </div>
                <div className="absolute top-[22%] left-1/2 -translate-x-1/2 scale-90 md:scale-100">
                  <EnchantSlot
                    slot="body"
                    itemId={equipment.body}
                    isSelected={selectedSlot === "body"}
                    onClick={() => setSelectedSlot("body")}
                  />
                </div>
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 scale-90 md:scale-100">
                  <EnchantSlot
                    slot="legs"
                    itemId={equipment.legs}
                    isSelected={selectedSlot === "legs"}
                    onClick={() => setSelectedSlot("legs")}
                  />
                </div>
                <div className="absolute top-[22%] left-[5%] md:left-[10%] scale-90 md:scale-100">
                  <EnchantSlot
                    slot="weapon"
                    itemId={equipment.weapon}
                    isSelected={selectedSlot === "weapon"}
                    onClick={() => setSelectedSlot("weapon")}
                  />
                </div>
                <div className="absolute top-[22%] right-[5%] md:right-[10%] scale-90 md:scale-100">
                  <EnchantSlot
                    slot="shield"
                    itemId={equipment.shield}
                    isSelected={selectedSlot === "shield"}
                    onClick={() => setSelectedSlot("shield")}
                  />
                </div>

                <div className="absolute bottom-0 w-full flex justify-center gap-1 md:gap-2 scale-90 md:scale-100">
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

              <p className="text-center text-[10px] text-tx-muted mt-6 italic opacity-50">
                Select a slot to enhance
              </p>
            </div>
          </div>

          {
            // Right Column: Enchanting Details and Actions
          }
          <div className="flex-1 w-full max-w-[400px] md:max-w-md bg-panel border border-border rounded-2xl p-5 md:p-8 flex flex-col relative overflow-hidden shadow-2xl min-h-[500px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none"></div>

            {selectedItem ? (
              <div className="relative z-10 w-full flex flex-col h-full gap-5 md:gap-6">
                {
                  // Item Information
                }
                <div className="text-center">
                  <h3 className="text-lg md:text-2xl font-black text-tx-main tracking-tight uppercase">
                    {selectedItem.name}
                  </h3>
                  <div
                    className={`text-xs font-bold uppercase tracking-widest mt-1 ${getRarityStyle(selectedItem.rarity).text}`}
                  >
                    Level: +{currentLevel} / {MAX_ENCHANT_LEVEL}
                  </div>
                  {!isMaxLevel && (
                    <div className="text-accent text-[10px] uppercase font-black tracking-widest mt-3 px-3 py-1 bg-accent/5 border border-accent/20 rounded-full inline-block animate-pulse">
                      Target: +20% Base Stats
                    </div>
                  )}
                </div>

                {
                  // Scroll / Catalyst Selector
                }
                {!isMaxLevel && (
                  <div
                    className={`rounded-xl p-4 border transition-all ${!isScrollSelected ? "bg-[#E43636]/5 border-[#E43636]/20" : "bg-app-base border-border"}`}
                  >
                    <div className="text-[10px] font-black text-tx-muted uppercase mb-3 flex justify-between items-center tracking-wider">
                      <span
                        className={!isScrollSelected ? "text-[#E43636]" : ""}
                      >
                        {isScrollSelected
                          ? "Catalyst Selected"
                          : "Choose Catalyst"}
                      </span>
                      {selectedScrollId && (
                        <button
                          onClick={() => setSelectedScrollId(null)}
                          className="text-[9px] bg-panel px-2 py-0.5 rounded border border-border text-tx-muted hover:text-tx-main"
                        >
                          CLEAR
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 min-h-[70px] snap-x">
                      {availableScrolls.length > 0 ? (
                        availableScrolls.map((scroll) => (
                          <button
                            key={scroll.id}
                            onClick={() =>
                              setSelectedScrollId(
                                selectedScrollId === scroll.id
                                  ? null
                                  : scroll.id,
                              )
                            }
                            className={`snap-start flex-shrink-0 w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center relative transition-all group ${
                              selectedScrollId === scroll.id
                                ? "bg-accent/20 border-accent shadow-[0_0_15px_rgb(var(--color-accent)/0.3)]"
                                : "bg-panel border-border/50 hover:border-border"
                            }`}
                          >
                            <img
                              src={scroll.icon}
                              className="w-8 h-8 pixelated group-hover:scale-110 transition-transform"
                              alt=""
                            />
                            <span className="text-[9px] font-black text-success mt-1">
                              T{scroll.tier}
                            </span>
                            <span className="absolute -top-2 -right-2 bg-panel-hover text-tx-main text-[10px] font-bold px-1.5 py-0.5 rounded-lg border border-border shadow-md z-10">
                              {scroll.count}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="text-[10px] text-tx-muted italic w-full text-center py-6 opacity-40">
                          No scrolls available in storage
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {
                  // Cost and Chance Summary
                }
                {!isMaxLevel && (
                  <div className="bg-app-base/60 rounded-xl p-4 border border-border space-y-4 shadow-inner">
                    <div className="flex justify-between items-center pb-3 border-b border-border/50">
                      <span className="text-[10px] text-tx-muted font-black uppercase tracking-widest">
                        Success Rate
                      </span>
                      <span
                        className={`text-2xl font-black font-mono ${chanceColor}`}
                      >
                        {successChance}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-tx-muted font-black uppercase tracking-widest">
                        Cost
                      </span>
                      <div className="flex items-center gap-2">
                        <img
                          src="/assets/ui/coins.png"
                          className="w-4 h-4 pixelated"
                          alt="Coins"
                        />
                        <span
                          className={`font-mono text-base font-bold ${canAfford ? "text-tx-main" : "text-[#E43636]"}`}
                        >
                          {cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {
                  // Action Button
                }
                {!isMaxLevel && (
                  <button
                    onClick={() =>
                      isScrollSelected &&
                      attemptEnchant(selectedItemId!, selectedScrollId!)
                    }
                    disabled={!canEnchant}
                    className={`w-full py-4 mt-auto rounded-xl font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 relative overflow-hidden group shadow-lg ${
                      canEnchant
                        ? "bg-accent hover:bg-accent-hover text-white shadow-accent/20"
                        : "bg-panel-hover text-tx-muted/40 cursor-not-allowed border border-border"
                    }`}
                  >
                    {!isScrollSelected
                      ? "Select Scroll"
                      : canAfford
                        ? "Attempt Enchant"
                        : "Insufficient Funds"}
                  </button>
                )}

                {
                  // Max Level Placeholder
                }
                {isMaxLevel && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-warning font-black text-lg uppercase tracking-[0.2em] bg-warning/5 px-8 py-4 rounded-2xl border-2 border-warning/20 shadow-[0_0_20px_rgba(var(--color-warning)/0.1)]">
                      MAX LEVEL
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full text-tx-muted gap-4 opacity-30">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center text-2xl">
                  ?
                </div>
                <p className="text-xs font-black uppercase tracking-widest">
                  Select an item to begin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

// Visual slot for displaying equipment in the silhouette layout
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

  // Map generic slot placeholders
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
      className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 relative group
        ${
          isSelected
            ? `bg-panel-hover border-2 border-accent shadow-[0_0_15px_rgb(var(--color-accent)/0.4)] scale-110 z-10`
            : `bg-app-base border-2 ${rarityStyle ? rarityStyle.border : "border-border/50"} hover:border-border shadow-inner`
        }
      `}
    >
      {item ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-panel/20 to-panel/60 rounded-lg"></div>
          <img
            src={item.icon}
            className="w-8 h-8 sm:w-12 sm:h-12 pixelated relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform"
            alt={item.name}
          />
          {enchantLevel > 0 && (
            <div
              className={`absolute -top-1.5 -right-1.5 text-[8px] sm:text-[10px] font-black text-white px-1.5 py-0.5 rounded-lg shadow-lg border border-black/20 z-20 ${enchantLevel >= MAX_ENCHANT_LEVEL ? "bg-warning" : "bg-accent"}`}
            >
              +{enchantLevel}
            </div>
          )}
          {
            // Hover Label (Hidden on mobile to save space)
          }
          <div
            className={`absolute -bottom-7 w-24 text-center text-[9px] bg-black/80 text-white px-2 py-1 rounded-md border border-border pointer-events-none transition-opacity hidden md:block ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} z-30`}
          >
            {item.name}
          </div>
        </>
      ) : (
        <img
          src={getPlaceholder(slot)}
          className="w-6 h-6 sm:w-8 sm:h-8 opacity-10 grayscale pixelated"
          alt="Empty Slot"
        />
      )}
    </div>
  );
}
