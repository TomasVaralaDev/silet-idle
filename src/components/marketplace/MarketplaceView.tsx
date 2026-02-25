import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getActiveListings } from "../../services/marketService";
import { getItemById } from "../../utils/itemUtils";
import ListingRow from "./ListingRow";
import SellForm from "./SellForm";
import MailboxView from "./MailboxView"; // <--- UUSI IMPORT
import type { MarketListing } from "../../types";

// Lisätty 'mailbox' tyyppiin
type MarketTab = "buy" | "sell" | "mailbox";

const CATEGORIES = [
  { id: "all", label: "All Resources" },
  { id: "woodcutting", label: "Wood" },
  { id: "mining", label: "Ores & Bars" },
  { id: "smithing", label: "Equipment" },
  { id: "alchemy", label: "Potions" },
  { id: "foraging", label: "Materials" },
];

export default function MarketplaceView() {
  const [tab, setTab] = useState<MarketTab>("buy");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const lastFetchTime = useRef<number>(0);
  const FETCH_COOLDOWN = 30000;
  const { user } = useAuth();

  const fetchListings = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime.current < FETCH_COOLDOWN) return;

    setLoading(true);
    try {
      const data = await getActiveListings();
      setListings(data);
      lastFetchTime.current = now;
    } catch (err) {
      console.error("Relay error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "buy") fetchListings();
  }, [tab, fetchListings]);

  const catalog = useMemo(() => {
    const uniqueItemIds = Array.from(new Set(listings.map((l) => l.itemId)));

    return uniqueItemIds
      .map((id) => {
        const item = getItemById(id);
        if (!item) return null;

        const itemListings = listings.filter((l) => l.itemId === id);
        const lowestPrice = Math.min(
          ...itemListings.map((l) => l.pricePerItem)
        );
        const totalAvailable = itemListings.reduce(
          (acc, l) => acc + l.amount,
          0
        );

        return {
          ...item,
          lowestPrice,
          listingCount: itemListings.length,
          totalAvailable,
        };
      })
      .filter(Boolean);
  }, [listings]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      if (!item) return false;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchesCategory = false;

      if (activeCategory === "all") {
        matchesCategory = true;
      } else {
        const cat = item.category;

        switch (activeCategory) {
          case "woodcutting":
            matchesCategory = cat === "log" || cat === "plank";
            break;
          case "mining":
            matchesCategory = cat === "ore" || cat === "ingot";
            break;
          case "smithing":
            matchesCategory = [
              "sword",
              "bow",
              "staff",
              "helmet",
              "chestplate",
              "legs",
              "shield",
              "ring",
              "necklace",
            ].includes(cat as string);
            break;
          case "alchemy":
            matchesCategory = cat === "potion";
            break;
          case "foraging":
            matchesCategory = cat === "foraging_material";
            break;
          default:
            matchesCategory = cat === activeCategory;
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [catalog, searchQuery, activeCategory]);

  const selectedItemSellers = useMemo(() => {
    return listings
      .filter((l) => l.itemId === selectedItemId)
      .sort((a, b) => a.pricePerItem - b.pricePerItem);
  }, [listings, selectedItemId]);

  if (!user)
    return (
      <div className="p-10 text-slate-500 font-mono italic text-center">
        Connection to Relay lost...
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-slate-950/80 font-sans overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-cyan-500/20 border border-cyan-500/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/ui/icon_market.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Marketplace"
          />
        </div>
        <div className="flex-1">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-cyan-500 mb-1`}
          >
            Marketplace
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Global Marketplace for adventurers.
          </p>
        </div>

        {/* TABS & MAILBOX BUTTON */}
        <div className="flex items-center gap-2">
          {/* BUY & SELL TABS */}
          <div className="flex bg-slate-900 p-1 rounded-sm border border-slate-800 h-fit">
            {(["buy", "sell"] as MarketTab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSelectedItemId(null);
                }}
                className={`px-6 py-1.5 text-[10px] font-bold uppercase transition-all ${
                  tab === t
                    ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "buy" ? "Buy" : "Sell"}
              </button>
            ))}
          </div>

          {/* MAILBOX BUTTON */}
          <button
            onClick={() => {
              setTab("mailbox");
              setSelectedItemId(null);
            }}
            className={`relative h-full px-4 flex items-center justify-center border rounded-sm transition-all ${
              tab === "mailbox"
                ? "bg-amber-500/10 border-amber-500 text-amber-500"
                : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
            }`}
            title="Mailbox"
          >
            <img
              src="/assets/ui/icon_mail.png"
              className="w-5 h-5 pixelated"
              alt="Mail"
            />
            {/* Optional: Add red dot notification badge logic here */}
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR (Only show when buying) */}
      {tab === "buy" && (
        <div className="p-5 border-b border-white/5 bg-slate-900/20 shrink-0">
          {!selectedItemId && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase border transition-all shrink-0 ${
                      activeCategory === cat.id
                        ? "border-cyan-500 text-cyan-400 bg-cyan-950/30"
                        : "border-slate-800 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marketplace..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-sm px-9 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-600 transition-colors"
                />
                <button
                  onClick={() => fetchListings(true)}
                  disabled={loading}
                  className="px-4 bg-slate-900 border border-slate-800 text-cyan-500 text-[10px] font-bold uppercase hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : "⟳"}
                </button>
              </div>
            </div>
          )}

          {selectedItemId && (
            <button
              onClick={() => setSelectedItemId(null)}
              className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase hover:text-cyan-400 transition-colors"
            >
              <span>←</span> Back to Global Catalog
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        {/* VIEW ROUTING */}
        {tab === "mailbox" && <MailboxView userId={user.uid} />}

        {tab === "sell" && (
          <SellForm
            myUid={user.uid}
            onComplete={() => {
              setTab("buy");
              fetchListings(true);
            }}
          />
        )}

        {tab === "buy" && (
          <div className="h-full overflow-y-auto custom-scrollbar p-4">
            {!selectedItemId && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredCatalog.map((item) => (
                  <button
                    key={item!.id}
                    onClick={() => setSelectedItemId(item!.id)}
                    className="group relative bg-slate-900/40 border border-slate-800 p-4 rounded-sm hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all flex flex-col items-center text-center gap-3"
                  >
                    <img
                      src={item!.icon}
                      className="w-12 h-12 pixelated group-hover:scale-110 transition-transform duration-300"
                      alt=""
                    />
                    <div>
                      <div
                        className={`text-xs font-bold leading-tight ${
                          item!.color || "text-slate-200"
                        }`}
                      >
                        {item!.name}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">
                        {item!.listingCount} Sellers • {item!.totalAvailable}{" "}
                        Qty
                      </div>
                    </div>
                    <div className="mt-auto pt-2 w-full border-t border-white/5">
                      <div className="text-[10px] text-amber-500 font-bold font-mono flex items-center justify-center gap-1">
                        <span>From {item!.lowestPrice.toLocaleString()}</span>
                        <img
                          src="/assets/ui/coins.png"
                          className="w-3 h-3 pixelated inline-block"
                          alt="coins"
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedItemId && (
              <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-4 mb-4 p-4 bg-cyan-950/10 border border-cyan-900/20 rounded-sm">
                  <img
                    src={getItemById(selectedItemId)?.icon}
                    className="w-12 h-12 pixelated shadow-lg"
                    alt=""
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {getItemById(selectedItemId)?.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">
                      For sale
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-4 py-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest border-b border-white/5">
                  <span className="flex-1">Merchant</span>
                  <span className="w-24 text-right">Amount</span>
                  <span className="w-32 text-right pr-4">Unit Price</span>
                  <span className="w-24 text-right">Action</span>
                </div>

                {selectedItemSellers.map((l) => (
                  <ListingRow
                    key={l.id}
                    listing={l}
                    myUid={user.uid}
                    onPurchase={() => fetchListings(true)}
                  />
                ))}
              </div>
            )}

            {!loading && filteredCatalog.length === 0 && !selectedItemId && (
              <div className="flex flex-col items-center justify-center py-20">
                <img
                  src="/assets/ui/icon_market.png"
                  className="w-20 h-20 pixelated opacity-10 mb-6 grayscale"
                  alt="No signals"
                />
                <p className="text-[10px] font-black font-mono uppercase tracking-[0.3em] text-slate-700">
                  No items for sale.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
