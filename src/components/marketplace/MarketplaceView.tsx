import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getActiveListings } from "../../services/marketService";
import { getItemById } from "../../utils/itemUtils";
import ListingRow from "./ListingRow";
import SellForm from "./SellForm";
import MailboxView from "./MailboxView";
import MyListingsView from "./MyListingsView"; // UUSI IMPORTTI TÄÄLLÄ
import type { MarketListing } from "../../types";

import { useTooltipStore } from "../../store/useToolTipStore";

// TYYPPIÄ PÄIVITETTY
type MarketTab = "buy" | "sell" | "my_listings" | "mailbox";

const CATEGORIES = [
  { id: "all", label: "All Resources" },
  { id: "woodcutting", label: "Wood" },
  { id: "mining", label: "Ores & Bars" },
  { id: "smithing", label: "Equipment" },
  { id: "alchemy", label: "Potions" },
  { id: "foraging", label: "Foraging" },
  { id: "keys", label: "Keys" },
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

  const showTooltip = useTooltipStore((state) => state.showTooltip);
  const hideTooltip = useTooltipStore((state) => state.hideTooltip);

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

  useEffect(() => {
    return () => hideTooltip && hideTooltip();
  }, [tab, hideTooltip]);

  const catalog = useMemo(() => {
    const uniqueItemIds = Array.from(new Set(listings.map((l) => l.itemId)));

    return uniqueItemIds
      .map((id) => {
        const item = getItemById(id);
        if (!item) return null;

        const itemListings = listings.filter((l) => l.itemId === id);
        const lowestPrice = Math.min(
          ...itemListings.map((l) => l.pricePerItem),
        );
        const totalAvailable = itemListings.reduce(
          (acc, l) => acc + l.amount,
          0,
        );

        return {
          ...item,
          lowestPrice,
          listingCount: itemListings.length,
          totalAvailable,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [listings]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      if (!item || !item.name) return false;

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
            matchesCategory = cat === "material";
            break;
          case "keys":
            matchesCategory = item.id.startsWith("bosskey_");
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
      <div className="p-10 text-tx-muted font-mono italic text-center">
        Connection to Relay lost...
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-app-base/80 font-sans overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/ui/icon_market.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Marketplace"
          />
        </div>
        <div className="flex-1 text-left">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-accent mb-1`}
          >
            Marketplace
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            Global Marketplace for adventurers.
          </p>
        </div>

        {/* TABS & MAILBOX BUTTON */}
        <div className="flex items-center gap-4">
          <div className="flex bg-panel p-1 rounded-sm border border-border h-fit">
            {(["buy", "sell", "my_listings"] as MarketTab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSelectedItemId(null);
                }}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all ${
                  tab === t
                    ? "bg-accent text-white shadow-[0_0_15px_rgb(var(--color-accent)/0.3)]"
                    : "text-tx-muted hover:text-tx-main"
                }`}
              >
                {t === "buy" ? "Buy" : t === "sell" ? "Sell" : "My Listings"}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setTab("mailbox");
              setSelectedItemId(null);
            }}
            className="relative flex items-center justify-center transition-all group"
            title="Mailbox"
          >
            <img
              src="/assets/ui/icon_mail.png"
              className={`w-10 h-10 pixelated transition-all ${
                tab === "mailbox"
                  ? "brightness-125 scale-110"
                  : "brightness-50 opacity-60 group-hover:opacity-100 group-hover:brightness-100"
              }`}
              alt="Mail"
            />
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      {tab === "buy" && (
        <div className="p-5 border-b border-border/30 bg-panel/20 shrink-0">
          {!selectedItemId && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase border transition-all shrink-0 ${
                      activeCategory === cat.id
                        ? "border-accent text-accent bg-accent/10"
                        : "border-border text-tx-muted hover:border-border-hover"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* SEARCH BAR */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted/50 flex items-center justify-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search marketplace..."
                    className="w-full bg-panel/50 border border-border rounded-sm pl-9 pr-3 py-2 text-xs text-tx-main focus:outline-none focus:border-accent transition-colors font-mono placeholder:text-tx-muted/50"
                  />
                </div>

                <button
                  onClick={() => fetchListings(true)}
                  disabled={loading}
                  className="px-4 bg-panel border border-border text-accent text-[10px] font-bold uppercase hover:bg-panel-hover transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : "⟳"}
                </button>
              </div>
            </div>
          )}

          {selectedItemId && (
            <button
              onClick={() => setSelectedItemId(null)}
              className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase hover:text-accent-hover transition-colors"
            >
              <span>←</span> Back to Global Catalog
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        {tab === "mailbox" && <MailboxView userId={user.uid} />}

        {/* UUSI VÄLILEHTI RENDERÖIDÄÄN TÄSSÄ */}
        {tab === "my_listings" && <MyListingsView userId={user.uid} />}

        {tab === "sell" && (
          <SellForm
            myUid={user.uid}
            onComplete={() => {
              setTab("my_listings"); // Ohjataan suoraan "My Listings" -lehdelle, jotta myyjä näkee ilmoituksensa onnistuneen!
            }}
          />
        )}

        {tab === "buy" && (
          <div className="h-full overflow-y-auto custom-scrollbar p-4">
            {!selectedItemId && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredCatalog.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      hideTooltip();
                    }}
                    onMouseEnter={(e) =>
                      showTooltip(item.id, e.clientX, e.clientY)
                    }
                    onMouseMove={(e) =>
                      showTooltip(item.id, e.clientX, e.clientY)
                    }
                    onMouseLeave={hideTooltip}
                    className="group relative bg-panel/40 border border-border p-4 rounded-sm hover:border-accent/50 hover:bg-panel/60 transition-all flex flex-col items-center text-center gap-3"
                  >
                    <img
                      src={item.icon}
                      className="w-12 h-12 pixelated group-hover:scale-110 transition-transform duration-300"
                      alt=""
                    />
                    <div>
                      <div
                        className={`text-xs font-bold leading-tight ${
                          item.color || "text-tx-main"
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-[9px] text-tx-muted font-mono mt-1 uppercase tracking-tighter">
                        {item.listingCount} Sellers • {item.totalAvailable} Qty
                      </div>
                    </div>
                    <div className="mt-auto pt-2 w-full border-t border-border/50">
                      <div className="text-[10px] text-warning font-bold font-mono flex items-center justify-center gap-1">
                        <span>From {item.lowestPrice.toLocaleString()}</span>
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
                <div
                  className="flex items-center gap-4 mb-4 p-4 bg-accent/5 border border-accent/20 rounded-sm"
                  onMouseEnter={(e) =>
                    showTooltip(selectedItemId, e.clientX, e.clientY)
                  }
                  onMouseMove={(e) =>
                    showTooltip(selectedItemId, e.clientX, e.clientY)
                  }
                  onMouseLeave={hideTooltip}
                >
                  <img
                    src={getItemById(selectedItemId)?.icon}
                    className="w-12 h-12 pixelated shadow-lg"
                    alt=""
                  />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-tx-main tracking-tight">
                      {getItemById(selectedItemId)?.name}
                    </h3>
                    <p className="text-[10px] text-tx-muted uppercase font-mono tracking-widest">
                      For sale
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-4 py-2 text-[9px] font-bold text-tx-muted uppercase tracking-widest border-b border-border/50">
                  <span className="flex-1 text-left">Merchant</span>
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
                <p className="text-[10px] font-black font-mono uppercase tracking-[0.3em] text-tx-muted/40">
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
