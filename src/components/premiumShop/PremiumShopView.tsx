import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { PREMIUM_SHOP_ITEMS } from "../../data/premiumShop";
import type { PremiumShopItem } from "../../types";
import GemsModal from "../modals/GemsModal";
import PurchaseSuccessModal from "../modals/PurchaseSuccessModal";

// LISÄTTY IMPORTIT TÄSMÄHAKUA VARTEN
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PremiumShopView() {
  const {
    gems,
    setState,
    buyPremiumItem,
    startGemsPurchase,
    upgrades,
    emitEvent,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [isGemsModalOpen, setIsGemsModalOpen] = useState(false);
  const [isWaitingForPurchase, setIsWaitingForPurchase] = useState(false);

  const [successData, setSuccessData] = useState<{
    isOpen: boolean;
    amount: number;
  }>({
    isOpen: false,
    amount: 0,
  });

  const prevGemsRef = useRef(gems);

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const refreshGemsFromServer = async () => {
      const user = auth.currentUser;
      if (!user) return false;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.gems > prevGemsRef.current) {
          setState({
            gems: data.gems,
            upgrades: data.upgrades,
          });
          return true;
        }
      }
      return false;
    };

    const handleFocus = async () => {
      if (isWaitingForPurchase) {
        await refreshGemsFromServer();
      }
    };

    window.addEventListener("focus", handleFocus);

    if (isWaitingForPurchase) {
      pollInterval = window.setInterval(async () => {
        await refreshGemsFromServer();
      }, 3000);
    }

    if (isWaitingForPurchase && gems > prevGemsRef.current) {
      const difference = gems - prevGemsRef.current;
      setSuccessData({ isOpen: true, amount: difference });
      emitEvent("success", `Added ${difference} gems to your account!`, "💎");
      setIsWaitingForPurchase(false);
      if (pollInterval) clearInterval(pollInterval);
    }

    prevGemsRef.current = gems;

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [gems, isWaitingForPurchase, emitEvent, setState]);

  const handleBuy = (item: PremiumShopItem) => {
    buyPremiumItem(item);
  };

  const handleGemsSelect = (packId: string) => {
    setIsWaitingForPurchase(true);
    startGemsPurchase(packId);
    setIsGemsModalOpen(false);
  };

  const categories = ["All", "Boosts", "Utility", "Cosmetics", "Bundles"];

  const filteredItems =
    activeCategory === "All"
      ? PREMIUM_SHOP_ITEMS
      : PREMIUM_SHOP_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="h-full flex flex-col bg-base text-tx-main overflow-hidden font-sans text-left relative">
      <GemsModal
        isOpen={isGemsModalOpen}
        onClose={() => setIsGemsModalOpen(false)}
        onSelect={handleGemsSelect}
      />

      <PurchaseSuccessModal
        isOpen={successData.isOpen}
        amount={successData.amount}
        onClose={() => setSuccessData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* HEADER: Yhtenäistetty tyyli ja gradientti-otsikko */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
          <img
            src="assets/ui/icon_gem.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Premium Store"
          />
        </div>

        <div className="flex-1">
          {/* Suora otsikko hohtavalla gradientilla */}
          <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover mb-1">
            Premium Store
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            {isWaitingForPurchase ? (
              <span className="animate-pulse italic">
                Consulting the royal treasury for your transaction...
              </span>
            ) : (
              "Acquire mystical artifacts and divine essence."
            )}
          </p>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <div className="flex items-center gap-3 bg-base/50 px-4 py-1 rounded-lg border border-border/50 shadow-inner">
            <img
              src="assets/ui/icon_gem.png"
              className="w-5 h-5 pixelated"
              alt="gem"
            />
            <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
              {gems.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setIsGemsModalOpen(true)}
            className="text-[10px] font-mono text-accent hover:text-white mt-1 uppercase border-b border-accent/30 hover:border-accent transition-colors"
          >
            + Purchase Gems
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1 bg-panel w-full shrink-0 overflow-hidden">
        <div
          className={`h-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgb(var(--color-accent)/0.5)] ${isWaitingForPurchase ? "animate-shimmer" : ""}`}
          style={{ width: isWaitingForPurchase ? "100%" : "0%" }}
        ></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-border overflow-y-auto bg-panel/20 z-10 custom-scrollbar">
          <div className="p-4 space-y-1">
            <div className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
              Categories
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? "bg-accent/10 text-accent border-accent/30 shadow-inner"
                    : "text-tx-muted hover:bg-panel-hover hover:text-tx-main border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative bg-base/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
            {filteredItems.map((item) => {
              const isOwned =
                item.isOneTime && (upgrades || []).includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-panel border-2 rounded-xl overflow-hidden flex flex-col group transition-all shadow-md ${
                    isOwned
                      ? "opacity-50 border-border/20"
                      : "border-border hover:border-accent/40 hover:shadow-xl"
                  }`}
                >
                  <div className="h-40 bg-base/50 flex items-center justify-center relative p-4 border-b border-border/30">
                    {/* POISTETTU: rotate ja scale hover-animaatiot */}
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-20 h-20 pixelated drop-shadow-2xl"
                    />
                    {item.isOneTime && (
                      /* MUUTETTU: Poistettu 'italic' - teksti on nyt suorassa */
                      <span className="absolute top-3 right-3 bg-warning/20 text-[9px] font-black text-warning uppercase px-2 py-1 rounded border border-warning/30">
                        Unique Artifact
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    {/* MUUTETTU: Poistettu 'italic' otsikosta ja kuvauksesta */}
                    <h3 className="text-lg font-bold text-tx-main mb-1 uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-tx-muted mb-6 flex-1 opacity-80 leading-snug font-medium">
                      {item.description}
                    </p>

                    <button
                      disabled={isOwned}
                      onClick={() => handleBuy(item)}
                      className={`w-full py-3 rounded-lg flex items-center justify-center gap-3 transition-all font-black border uppercase tracking-widest ${
                        isOwned
                          ? "bg-base text-tx-muted cursor-not-allowed border-transparent"
                          : "bg-panel-hover hover:bg-accent hover:text-white border-border hover:border-accent"
                      }`}
                    >
                      {isOwned ? (
                        "ACQUIRED"
                      ) : (
                        <>
                          <img
                            src="assets/ui/icon_gem.png"
                            className="w-4 h-4 pixelated"
                            alt="gem"
                          />
                          <span
                            className={
                              gems >= item.priceGems
                                ? "text-inherit"
                                : "text-danger"
                            }
                          >
                            {item.priceGems}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
