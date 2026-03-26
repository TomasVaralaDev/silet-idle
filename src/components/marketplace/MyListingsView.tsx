import { useState, useEffect, useCallback } from "react";
import { getMyActiveListings } from "../../services/marketService";
import ListingRow from "./ListingRow";
import type { MarketListing } from "../../types";

interface Props {
  userId: string;
}

export default function MyListingsView({ userId }: Props) {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Load active listings associated with the current player UID
  const fetchMyListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyActiveListings(userId);
      setListings(data);
    } catch (err) {
      console.error("Error fetching my listings:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="text-accent animate-pulse font-mono text-[10px] md:text-sm uppercase tracking-widest text-center">
          Loading your listings...
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 md:py-20 h-full px-4">
        <img
          src="/assets/ui/icon_market.png"
          className="w-16 h-16 md:w-20 md:h-20 pixelated opacity-10 mb-4 md:mb-6 grayscale"
          alt="No listings"
        />
        <p className="text-[9px] md:text-[10px] font-black font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-tx-muted/40 text-center">
          You have no active listings.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {
        // Increased gap on mobile to better separate listing cards
      }
      <div className="max-w-3xl mx-auto flex flex-col gap-2 sm:gap-1">
        {
          // Column headers (Desktop only) matched to ListingRow widths
        }
        <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-[9px] font-bold text-tx-muted uppercase tracking-widest border-b border-border/50">
          <span className="w-48 text-left">Item</span>
          <span className="flex-1 text-left">Status</span>
          <span className="w-32 text-right">Total Price</span>
          <span className="w-24 text-right">Action</span>
        </div>

        {listings.map((l) => (
          <ListingRow
            key={l.id}
            listing={l}
            myUid={userId}
            // Passing fetchMyListings to refresh the view after a cancellation
            onPurchase={fetchMyListings}
          />
        ))}
      </div>
    </div>
  );
}
