import React from "react";
import type { Resource } from "../../types";
import { getRarityStyle } from "../../utils/rarity";
import { useTooltipStore } from "../../store/useToolTipStore";

export interface InventoryItem extends Resource {
  count: number;
}

interface Props {
  items: InventoryItem[];
  onSellClick: (itemId: string) => void;
  onItemClick: (item: InventoryItem) => void;
  onRightClick: (itemId: string) => void;
}

export default function InventoryGrid({
  items,
  onSellClick,
  onItemClick,
  onRightClick,
}: Props) {
  const showTooltip = useTooltipStore((s) => s.showTooltip);
  const hideTooltip = useTooltipStore((s) => s.hideTooltip);

  // Helper to trigger tooltips, disabled on mobile to prevent touch interaction issues
  const handleShowTooltip = (itemId: string, x: number, y: number) => {
    if (window.innerWidth < 768) return;
    showTooltip(itemId, x, y);
  };

  // Primary interaction: Handles standard selection and Shift+Click shortcut for selling
  const handleInteraction = (item: InventoryItem, e: React.MouseEvent) => {
    if (e.shiftKey) {
      onSellClick(item.id);
      return;
    }
    onItemClick(item);
  };

  // Context menu used as a shortcut for equipping items
  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    onRightClick(itemId);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey || e.button === 2) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-panel border-t border-border flex flex-col h-full overflow-hidden relative select-none shadow-inner">
      <div className="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar pb-24 md:pb-4 text-left">
        {items.length === 0 ? (
          // Empty state placeholder
          <div className="h-full flex flex-col items-center justify-center text-tx-muted">
            <p className="text-sm font-bold opacity-50 uppercase tracking-widest">
              Bag is Empty
            </p>
          </div>
        ) : (
          // Main scrollable grid of items
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {items.map((item) => {
              const rarityTheme = getRarityStyle(item.rarity);

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleInteraction(item, e)}
                  onContextMenu={(e) => handleContextMenu(e, item.id)}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={(e) =>
                    handleShowTooltip(item.id, e.clientX, e.clientY)
                  }
                  onMouseMove={(e) =>
                    handleShowTooltip(item.id, e.clientX, e.clientY)
                  }
                  onMouseLeave={hideTooltip}
                  className="flex flex-row items-center gap-3 p-2 rounded-xl bg-app-base border border-border hover:border-border-hover hover:bg-panel cursor-pointer group transition-all animate-in zoom-in-95 duration-200 relative min-h-[64px]"
                >
                  {
                    // Icon Container: Includes rarity border and quantity badge
                  }
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-panel border ${rarityTheme.border} bg-opacity-30`}
                    >
                      <img
                        src={item.icon}
                        className="w-8 h-8 pixelated drop-shadow-sm group-hover:scale-110 transition-transform"
                        alt={item.name}
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-panel-hover text-tx-main text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold border border-border shadow-md z-10">
                      {item.count}
                    </span>
                  </div>

                  {
                    // Item Details: Name and meta information (Rarity/Level)
                  }
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div
                      className={`text-[11px] md:text-sm font-bold uppercase tracking-tight truncate ${rarityTheme.text}`}
                    >
                      {item.name}
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase font-semibold tracking-wider mt-0.5">
                      <span className={`${rarityTheme.text} opacity-90`}>
                        {item.rarity}
                      </span>
                      {item.level && (
                        <span className="text-tx-muted opacity-60">
                          • Lvl {item.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {
        // Desktop Footer: Displays input hints for faster inventory management
      }
      <div className="hidden md:flex px-4 py-2 border-t border-border bg-app-base text-[10px] text-tx-muted justify-between z-10">
        <div className="flex gap-3 font-bold uppercase tracking-widest opacity-70">
          <span>
            Shift+Click:{" "}
            <span className="text-danger font-bold">Quick Sell</span>
          </span>
          <span>
            Right Click: <span className="text-accent font-bold">Equip</span>
          </span>
        </div>
        <span className="font-bold">{items.length} items</span>
      </div>
    </div>
  );
}
