import { useState, useEffect, useCallback } from "react";
import { getMyActiveListings } from "../../services/marketService";
import { useGameStore } from "../../store/useGameStore";
import ListingRow from "./ListingRow";
import type { MarketListing } from "../../types";

interface Props {
  userId: string;
}

export default function MyListingsView({ userId }: Props) {
  // Haetaan pelaajan ilmoitusraja statesta
  const marketListingLimit = useGameStore((state) => state.marketListingLimit);

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

  const isLimitReached = listings.length >= marketListingLimit;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 bg-app-base">
      {/* --- LIMIT HEADER --- */}
      <div className="shrink-0 p-3 md:p-4 border-b border-border/50 bg-panel/30 flex justify-between items-center z-10">
        <h3 className="text-[10px] md:text-xs font-black text-tx-main uppercase tracking-[0.2em]">
          Active Listings
        </h3>
        <div
          className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-sm transition-colors ${
            !loading && isLimitReached
              ? "bg-danger/10 text-danger border border-danger/30"
              : "bg-panel border border-border/50 text-tx-muted"
          }`}
        >
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            `Slots: ${listings.length} / ${marketListingLimit}`
          )}
        </div>
      </div>

      {/* --- PROGRESS BAR --- */}
      <div className="shrink-0 w-full h-1 bg-panel">
        <div
          className={`h-full transition-all duration-1000 ${isLimitReached ? "bg-danger" : "bg-accent"}`}
          style={{
            width: loading
              ? "0%"
              : `${Math.min(100, (listings.length / marketListingLimit) * 100)}%`,
          }}
        />
      </div>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full p-6">
            <div className="text-accent animate-pulse font-mono text-[10px] md:text-sm uppercase tracking-widest text-center">
              Loading your listings...
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 md:py-20 h-full px-4">
            <img
              src="./assets/ui/icon_market.png"
              className="w-16 h-16 md:w-20 md:h-20 pixelated opacity-10 mb-4 md:mb-6 grayscale"
              alt="No listings"
            />
            <p className="text-[9px] md:text-[10px] font-black font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-tx-muted/40 text-center">
              You have no active listings.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
