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

  // APUFUNKTIO: Estetään tooltip mobiilissa, jotta se ei jää jumiin sormen painalluksesta
  const handleShowTooltip = (itemId: string, x: number, y: number) => {
    if (window.innerWidth < 768) return;
    showTooltip(itemId, x, y);
  };

  const handleInteraction = (item: InventoryItem, e: React.MouseEvent) => {
    if (e.shiftKey) {
      onSellClick(item.id);
      return;
    }
    onItemClick(item);
  };

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
      <div className="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar pb-24 md:pb-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-tx-muted">
            <p className="text-sm font-bold opacity-50 uppercase tracking-widest">
              Bag is Empty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {items.map((item) => {
              const rarityTheme = getRarityStyle(item.rarity);

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleInteraction(item, e)}
                  onContextMenu={(e) => handleContextMenu(e, item.id)}
                  onMouseDown={handleMouseDown}
                  // KORJATTU: Käytetään tarkistettua tooltip-funktiota
                  onMouseEnter={(e) =>
                    handleShowTooltip(item.id, e.clientX, e.clientY)
                  }
                  onMouseMove={(e) =>
                    handleShowTooltip(item.id, e.clientX, e.clientY)
                  }
                  onMouseLeave={hideTooltip}
                  className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 p-2 rounded-xl md:rounded bg-app-base border border-border hover:border-border-hover hover:bg-panel cursor-pointer group transition-all animate-in zoom-in-95 duration-200 relative text-center md:text-left aspect-square md:aspect-auto"
                >
                  {/* ICON AREA */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-panel border ${rarityTheme.border} bg-opacity-30 mx-auto`}
                    >
                      <img
                        src={item.icon}
                        className="w-8 h-8 pixelated drop-shadow-sm group-hover:scale-110 transition-transform"
                        alt={item.name}
                      />
                    </div>
                  </div>

                  {/* TEXT & COUNT AREA */}
                  <div className="flex-1 min-w-0 w-full overflow-hidden flex flex-col md:flex-row md:items-center md:gap-2">
                    {/* COUNT BADGE: Mobiilissa yläoikealla, työpöydällä nimen vieressä */}
                    <span className="absolute top-1 right-1 md:relative md:top-0 md:right-0 bg-panel-hover text-tx-main text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-mono border border-border shadow-sm z-10 shrink-0">
                      {item.count}
                    </span>

                    <div
                      className={`text-[9px] leading-tight md:text-sm font-bold truncate ${rarityTheme.text}`}
                    >
                      {item.name}
                    </div>

                    {/* RARITY & LEVEL: Näytetään vain työpöydällä tilan säästämiseksi */}
                    <div className="hidden md:flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                      <span className={rarityTheme.text}>{item.rarity}</span>
                      {item.level && (
                        <span className="text-tx-muted">• L. {item.level}</span>
                      )}
                    </div>
                  </div>

                  {/* Pieni level-indikaattori mobiiliin kulmaan */}
                  {item.level && item.level > 1 && (
                    <span className="md:hidden absolute top-1 left-1 text-tx-muted/50 text-[8px] font-bold z-10">
                      L{item.level}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER INFO - Työpöydällä */}
      <div className="hidden md:flex px-4 py-2 border-t border-border bg-app-base text-[10px] text-tx-muted justify-between z-10">
        <div className="flex gap-3">
          <span>
            Shift+Click: <span className="text-[#E43636]">Quick Sell</span>
          </span>
          <span>
            Right Click: <span className="text-accent">Equip</span>
          </span>
        </div>
        <span>{items.length} items</span>
      </div>
    </div>
  );
}
