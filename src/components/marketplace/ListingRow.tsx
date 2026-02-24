import { getItemById } from '../../utils/itemUtils';
import { purchaseListing, cancelListing } from '../../services/marketService';
import { useGameStore } from '../../store/useGameStore';
import type { MarketListing } from '../../types';

interface Props {
  listing: MarketListing;
  myUid: string;
  onPurchase: () => void;
}

export default function ListingRow({ listing, myUid, onPurchase }: Props) {
  const item = getItemById(listing.itemId);
  const isOwn = listing.sellerUid === myUid;

  // Käytetään storessa määriteltyä emitEvent-funktiota
  const { emitEvent } = useGameStore();

  const handleBuy = async () => {
    if (isOwn) return;
    try {
      await purchaseListing(myUid, listing.id);

      // ILMOITUS ONNISTUNEESTA OSTOSTA
      emitEvent(
        'success',
        `Acquired ${listing.amount}x ${item?.name}!`,
        item?.icon,
      );

      onPurchase();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      // ILMOITUS VIRHEESTÄ
      emitEvent('error', errorMsg);
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

      // ILMOITUS PERUUTUKSESTA
      emitEvent('warning', `Listing for ${item?.name} cancelled.`, item?.icon);

      onPurchase();
    } catch (err: unknown) {
      emitEvent('error', err instanceof Error ? err.message : String(err));
    }
  };

  if (!item) return null;

  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3 w-48 shrink-0">
        <div className="relative">
          <img src={item.icon} className="w-8 h-8 pixelated" alt="" />
          <span className="absolute -top-1 -right-1 bg-slate-900 text-[8px] font-mono px-1 border border-slate-700 text-slate-400">
            x{listing.amount}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            className={`text-sm font-bold truncate ${item.color || 'text-slate-200'}`}
          >
            {item.name}
          </span>
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">
            Unit: {listing.pricePerItem}{' '}
            <img
              src="/assets/ui/coins.png"
              className="w-2 h-2 inline mb-0.5"
              alt=""
            />
          </span>
        </div>
      </div>

      <div className="hidden md:flex flex-col flex-1 text-left">
        <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">
          Merchant
        </span>
        <span className="text-xs text-slate-400 italic">
          {isOwn ? '✦ You (Seller)' : listing.sellerName}
        </span>
      </div>

      <div className="flex flex-col items-end w-32 shrink-0">
        <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">
          Total Cost
        </span>
        <div className="flex items-center gap-2">
          <img src="/assets/ui/coins.png" className="w-4 h-4" alt="" />
          <span className="font-mono text-amber-500 font-black tracking-tighter">
            {listing.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="w-24 flex justify-end">
        {isOwn ? (
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border border-red-900/30 text-red-500 hover:bg-red-900/10 active:scale-95"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={handleBuy}
            className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_rgba(8,145,178,0.2)] active:scale-95"
          >
            Acquire
          </button>
        )}
      </div>
    </div>
  );
}
