import { getItemById } from "../../utils/itemUtils";
import { purchaseListing } from "../../services/marketService";
import type { MarketListing } from "../../types";

interface Props {
  listing: MarketListing;
  myUid: string;
  onPurchase: () => void;
}

export default function ListingCard({ listing, myUid, onPurchase }: Props) {
  const item = getItemById(listing.itemId);
  const isOwn = listing.sellerUid === myUid;

  // Process the purchase transaction via the market service
  const handleBuy = async () => {
    if (isOwn) return;
    try {
      await purchaseListing(myUid, listing.id);
      onPurchase();
    } catch (err) {
      alert(err);
    }
  };

  if (!item) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col gap-4 hover:border-slate-700 transition-colors group">
      <div className="flex items-center gap-4">
        {
          // Item Icon and Quantity Badge
        }
        <div className="w-12 h-12 bg-slate-950 rounded border border-slate-800 flex items-center justify-center relative">
          <img src={item.icon} className="w-8 h-8 pixelated" alt="" />
          <span className="absolute -bottom-1 -right-1 bg-slate-900 text-[10px] font-mono px-1 border border-slate-700">
            x{listing.amount}
          </span>
        </div>
        <div>
          <h4 className={`font-bold text-sm ${item.color || "text-slate-200"}`}>
            {item.name}
          </h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            Seller: {isOwn ? "YOU" : listing.sellerName}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-800/50 mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-600 uppercase font-bold">
            Total Cost
          </span>
          <div className="flex items-center gap-1.5">
            <img src="/assets/ui/coins.png" className="w-4 h-4" alt="" />
            <span className="font-mono text-amber-500 font-bold">
              {listing.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {
          // Interaction button: Disabled for owner's own listings
        }
        <button
          onClick={handleBuy}
          disabled={isOwn}
          className={`px-4 py-2 rounded text-[10px] font-bold uppercase transition-all ${
            isOwn
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95"
          }`}
        >
          {isOwn ? "Your Listing" : "Acquire"}
        </button>
      </div>
    </div>
  );
}
