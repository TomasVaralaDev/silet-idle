import { getItemById } from "../../utils/itemUtils";
import { purchaseListing, cancelListing } from "../../services/marketService";
import { useGameStore } from "../../store/useGameStore";
import type { MarketListing } from "../../types";

interface Props {
  listing: MarketListing;
  myUid: string;
  onPurchase: () => void;
}

export default function ListingRow({ listing, myUid, onPurchase }: Props) {
  const item = getItemById(listing.itemId);
  const isOwn = listing.sellerUid === myUid;

  const { emitEvent } = useGameStore();

  const handleBuy = async () => {
    if (isOwn) return;
    try {
      await purchaseListing(myUid, listing.id);

      emitEvent(
        "success",
        `Acquired ${listing.amount}x ${item?.name}!`,
        item?.icon,
      );

      onPurchase();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      emitEvent("error", errorMsg);
    }
  };

  const handleCancel = async () => {
    if (!isOwn) return;

    const confirmCancel = window.confirm(
      `Do you want to cancel this listing and return ${listing.amount}x ${item?.name} to your storage?`,
    );

    if (!confirmCancel) return;

    try {
      await cancelListing(listing.id, myUid);
      emitEvent("warning", `Listing for ${item?.name} cancelled.`, item?.icon);
      onPurchase();
    } catch (err: unknown) {
      emitEvent("error", err instanceof Error ? err.message : String(err));
    }
  };

  if (!item) return null;

  return (
    // Pääcontainer: mobiilissa flex-col (pino), sm-koossa flex-row (rivi)
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 px-3 sm:px-4 border-b border-border/30 hover:bg-panel-hover/30 transition-colors group">
      {/* ITEM INFO */}
      <div className="flex items-center gap-3 w-full sm:w-48 shrink-0 text-left">
        <div className="relative shrink-0">
          <img
            src={item.icon}
            className="w-8 h-8 md:w-10 md:h-10 pixelated"
            alt=""
          />
          <span className="absolute -top-1 -right-1 bg-panel text-[8px] font-mono px-1 border border-border text-tx-muted shadow-sm rounded-sm">
            x{listing.amount}
          </span>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full">
            <span
              className={`text-sm md:text-base font-bold truncate ${
                item.color || "text-tx-main"
              }`}
            >
              {item.name}
            </span>
            {/* Myyjän nimi mobiilissa nimen vieressä */}
            <span className="sm:hidden text-[9px] text-tx-muted italic truncate max-w-[80px]">
              {isOwn ? "You" : listing.sellerName}
            </span>
          </div>

          <span className="text-[9px] text-tx-muted font-mono uppercase tracking-tighter flex items-center gap-1">
            Unit: {listing.pricePerItem}{" "}
            <img
              src="/assets/ui/coins.png"
              className="w-2.5 h-2.5 pixelated"
              alt=""
            />
          </span>
        </div>
      </div>

      {/* MERCHANT (Vain Desktop) */}
      <div className="hidden sm:flex flex-col flex-1 text-left min-w-0">
        <span className="text-[9px] text-tx-muted/60 uppercase font-black tracking-widest">
          Merchant
        </span>
        <span className="text-xs text-tx-muted italic truncate pr-2">
          {isOwn ? "✦ You (Seller)" : listing.sellerName}
        </span>
      </div>

      {/* MOBILE BOTTOM ROW / DESKTOP RIGHT ALIGN */}
      {/* Mobiilissa luodaan viiva (border-t) erottamaan hinta ja nappi, Desktopissa ei viivaa */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t border-border/30 sm:border-none">
        {/* TOTAL COST */}
        <div className="flex flex-col items-start sm:items-end w-auto sm:w-32 shrink-0">
          <span className="text-[9px] text-tx-muted/60 uppercase font-black tracking-widest">
            <span className="hidden sm:inline">Total Cost</span>
            <span className="sm:hidden">Total</span>
          </span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <img
              src="/assets/ui/coins.png"
              className="w-3.5 h-3.5 md:w-4 md:h-4 pixelated"
              alt=""
            />
            <span className="font-mono text-warning font-black tracking-tighter text-sm md:text-base">
              {listing.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="w-auto sm:w-24 flex justify-end shrink-0">
          {isOwn ? (
            <button
              onClick={handleCancel}
              className="px-3 md:px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border border-danger/30 text-danger hover:bg-danger/10 active:scale-95 transition-all"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className="px-3 md:px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest bg-accent hover:bg-accent-hover text-white shadow-[0_0_10px_rgb(var(--color-accent)/0.2)] active:scale-95 transition-all"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
