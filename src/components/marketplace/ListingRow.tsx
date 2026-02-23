import { getItemById } from '../../utils/itemUtils';
import { purchaseListing, cancelListing } from '../../services/marketService';
import type { MarketListing } from '../../types';

interface Props {
  listing: MarketListing;
  myUid: string;
  onPurchase: () => void;
}

export default function ListingRow({ listing, myUid, onPurchase }: Props) {
  const item = getItemById(listing.itemId);
  const isOwn = listing.sellerUid === myUid;

  // --- OSTO-OPERAATIO ---
  const handleBuy = async () => {
    if (isOwn) return;
    try {
      await purchaseListing(myUid, listing.id);
      onPurchase(); // Päivittää listan oston jälkeen
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(String(err));
      }
    }
  };

  // --- PERUUTUS-OPERAATIO (Tavarat takaisin myyjälle) ---
  const handleCancel = async () => {
    if (!isOwn) return;

    const confirmCancel = window.confirm(
      `Do you want to cancel this listing and return ${listing.amount}x ${item?.name} to your storage?`,
    );

    if (!confirmCancel) return;

    try {
      await cancelListing(listing.id, myUid);
      onPurchase(); // Päivittää listan peruutuksen jälkeen
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(String(err));
      }
    }
  };

  if (!item) return null;

  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
      {/* 1. Item Icon & Info */}
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

      {/* 2. Seller Info */}
      <div className="hidden md:flex flex-col flex-1">
        <span className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">
          Merchant
        </span>
        <span className="text-xs text-slate-400 italic">
          {isOwn ? '✦ You (Seller)' : listing.sellerName}
        </span>
      </div>

      {/* 3. Price (Tavern style) */}
      <div className="flex flex-col items-end w-32 shrink-0">
        <span className="text-[9px] text-slate-600 uppercase font-bold">
          Total fragments
        </span>
        <div className="flex items-center gap-2">
          <img src="/assets/ui/coins.png" className="w-4 h-4" alt="" />
          <span className="font-mono text-amber-500 font-bold">
            {listing.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4. Action Button (Dynaaminen) */}
      <div className="w-24 flex justify-end">
        {isOwn ? (
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all border border-red-900/30 text-red-500 hover:bg-red-900/10 active:scale-95"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={handleBuy}
            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm active:scale-95"
          >
            Acquire
          </button>
        )}
      </div>
    </div>
  );
}
