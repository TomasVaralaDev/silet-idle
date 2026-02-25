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
        item?.icon
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
      `Do you want to cancel this listing and return ${listing.amount}x ${item?.name} to your storage?`
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
    <div className="flex items-center gap-4 py-3 px-4 border-b border-border/30 hover:bg-panel-hover/30 transition-colors group">
      {/* ITEM INFO */}
      <div className="flex items-center gap-3 w-48 shrink-0 text-left">
        <div className="relative">
          <img src={item.icon} className="w-8 h-8 pixelated" alt="" />
          <span className="absolute -top-1 -right-1 bg-panel text-[8px] font-mono px-1 border border-border text-tx-muted shadow-sm">
            x{listing.amount}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-bold truncate ${
              item.color || "text-tx-main"
            }`}
          >
            {item.name}
          </span>
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

      {/* MERCHANT */}
      <div className="hidden md:flex flex-col flex-1 text-left">
        <span className="text-[9px] text-tx-muted/60 uppercase font-black tracking-widest">
          Merchant
        </span>
        <span className="text-xs text-tx-muted italic">
          {isOwn ? "✦ You (Seller)" : listing.sellerName}
        </span>
      </div>

      {/* TOTAL COST */}
      <div className="flex flex-col items-end w-32 shrink-0">
        <span className="text-[9px] text-tx-muted/60 uppercase font-black tracking-widest">
          Total Cost
        </span>
        <div className="flex items-center gap-2">
          <img
            src="/assets/ui/coins.png"
            className="w-4 h-4 pixelated"
            alt=""
          />
          <span className="font-mono text-warning font-black tracking-tighter text-base">
            {listing.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="w-24 flex justify-end">
        {isOwn ? (
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border border-danger/30 text-danger hover:bg-danger/10 active:scale-95 transition-all"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={handleBuy}
            className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest bg-accent hover:bg-accent-hover text-white shadow-[0_0_10px_rgb(var(--color-accent)/0.2)] active:scale-95 transition-all"
          >
            Acquire
          </button>
        )}
      </div>
    </div>
  );
}
