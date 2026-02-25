import React from "react";
import type { Resource } from "../../types";

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
  const handleInteraction = (item: InventoryItem, e: React.MouseEvent) => {
    if (e.shiftKey) {
      onSellClick(item.id);
      return;
    }
    onItemClick(item);
  };

  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault(); // Estetään selaimen valikko
    onRightClick(itemId);
  };

  // Estetään tekstin valinta shift-klikkauksen aikana
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey || e.button === 2) {
      // 2 on oikea klikkaus
      e.preventDefault();
    }
  };

  return (
    <div className="bg-panel border border-border rounded-xl flex flex-col h-full overflow-hidden relative select-none shadow-inner">
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-tx-muted">
            <p className="text-sm font-bold opacity-50">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={(e) => handleInteraction(item, e)}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                onMouseDown={handleMouseDown}
                className="flex items-center gap-3 p-2 rounded bg-app-base border border-border hover:border-border-hover hover:bg-panel cursor-pointer group transition-all animate-in zoom-in-95 duration-200"
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center bg-panel ${
                      item.rarity === "legendary"
                        ? "border border-orange-500/30"
                        : item.rarity === "rare"
                        ? "border border-cyan-500/30"
                        : "border border-border/50"
                    }`}
                  >
                    <img
                      src={item.icon}
                      className="w-8 h-8 pixelated drop-shadow-sm"
                      alt={item.name}
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-panel-hover text-tx-main text-[10px] px-1.5 py-0.5 rounded-full font-mono border border-border shadow-sm z-10">
                    {item.count}
                  </span>
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                  {/* Huom: Jos item.color sisältää tailwind-luokan kuten 'text-red-500', se yliajaa teeman tässä. Muutoin käytetään teeman väriä. */}
                  <div
                    className={`text-sm font-bold truncate ${
                      item.color || "text-tx-main"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-tx-muted uppercase font-bold tracking-wider">
                    {/* Harvinaisuusvärit säilytetään staattisina pelimekaniikan selkeyden vuoksi */}
                    <span
                      className={
                        item.rarity === "legendary"
                          ? "text-orange-500"
                          : item.rarity === "rare"
                          ? "text-cyan-500"
                          : item.rarity === "uncommon"
                          ? "text-emerald-500"
                          : "text-tx-muted/70"
                      }
                    >
                      {item.rarity}
                    </span>
                    {item.level && <span>• L. {item.level}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border bg-app-base text-[10px] text-tx-muted flex justify-between">
        <div className="flex gap-3">
          <span>
            Shift+Click: <span className="text-tx-main">Quick Sell</span>
          </span>
          <span>
            Right Click: <span className="text-tx-main">Equip</span>
          </span>
        </div>
        <span>{items.length} items</span>
      </div>
    </div>
  );
}
