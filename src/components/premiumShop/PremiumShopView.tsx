import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { PREMIUM_SHOP_ITEMS } from "../../data/premiumShop";
import type { PremiumShopItem, RewardEntry } from "../../types";
import GemsModal from "../modals/GemsModal";
import PurchaseSuccessModal from "../modals/PurchaseSuccessModal";
import BundlePreviewModal from "../modals/BundlePreviewModal"; // LISÄTTY
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
    openRewardModal,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [isGemsModalOpen, setIsGemsModalOpen] = useState(false);
  const [isWaitingForPurchase, setIsWaitingForPurchase] = useState(false);
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);

  // UUDET TILAT MODAALILLE
  const [selectedBundle, setSelectedBundle] = useState<PremiumShopItem | null>(
    null,
  );

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

        if (data.gems !== prevGemsRef.current) {
          setState((state) => ({
            gems: data.gems,
            upgrades: data.upgrades || state.upgrades,
            inventory: data.inventory || state.inventory,
            scavenger: data.scavenger || state.scavenger,
          }));
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

  // Käsittelee oston VASTA KUN käyttäjä vahvistaa sen modaalista
  const handleConfirmPurchase = async (item: PremiumShopItem) => {
    if (purchasingItem) return;

    if (gems < item.priceGems) {
      emitEvent("error", "Not enough gems!", "💎");
      return;
    }

    setPurchasingItem(item.id);

    try {
      const success = await buyPremiumItem(item);

      if (success) {
        // Suljetaan esikatselumodaali ensin
        setSelectedBundle(null);

        if (item.rewards) {
          const rewardsList: RewardEntry[] = [];

          if (item.rewards.rewardGems) {
            rewardsList.push({
              itemId: "gems",
              amount: item.rewards.rewardGems,
            });
          }

          if (item.rewards.items) {
            Object.entries(item.rewards.items).forEach(([itemId, amount]) => {
              rewardsList.push({ itemId, amount });
            });
          }

          if (item.rewards.stats?.expeditionSlotsIncrement) {
            rewardsList.push({
              itemId: "Expedition Slots",
              amount: item.rewards.stats.expeditionSlotsIncrement,
            });
          }

          if (item.rewards.stats?.queueSlotsSet) {
            rewardsList.push({
              itemId: "Queue Slots",
              amount: item.rewards.stats.queueSlotsSet,
            });
          }

          openRewardModal(`Unlocked: ${item.name}`, rewardsList);
        }
      }
    } catch (e) {
      console.error("Purchase error in UI:", e);
    } finally {
      setPurchasingItem(null);
    }
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
    <div className="h-full flex flex-col bg-app-base text-tx-main overflow-hidden font-sans text-left relative">
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

      {/* LISÄTTY: Uusi Bundle Preview Modal */}
      <BundlePreviewModal
        isOpen={!!selectedBundle}
        item={selectedBundle}
        onClose={() => setSelectedBundle(null)}
        onConfirm={handleConfirmPurchase}
        userGems={gems}
        isProcessing={!!purchasingItem}
      />

      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
            <img
              src="assets/ui/icon_gem.png"
              className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
              alt="Premium Store"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">
              Treasury
            </h1>
            <p className="text-tx-muted text-[10px] md:text-sm font-medium hidden sm:block uppercase tracking-wider opacity-70">
              {isWaitingForPurchase || purchasingItem
                ? "Consulting the royal treasury..."
                : "Acquire mystical artifacts and divine essence."}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 bg-app-base/40 sm:bg-transparent p-2 sm:p-0 rounded-lg border border-border/30 sm:border-none ml-auto">
          <div className="flex items-center gap-2 bg-panel px-3 py-1 rounded-lg border border-border shadow-inner">
            <img
              src="assets/ui/icon_gem.png"
              className="w-4 h-4 md:w-5 md:h-5 pixelated"
              alt="gem"
            />
            <div className="text-lg md:text-2xl font-black text-tx-main uppercase tracking-tighter">
              {gems.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setIsGemsModalOpen(true)}
            className="text-[10px] font-mono font-bold text-accent hover:text-tx-main uppercase tracking-widest border-b border-accent/30 transition-all px-1 py-0.5"
          >
            + Get More
          </button>
        </div>
      </div>

      <div className="h-1 bg-panel w-full shrink-0 overflow-hidden">
        <div
          className={`h-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgb(var(--color-accent)/0.5)] ${isWaitingForPurchase || purchasingItem ? "animate-pulse" : ""}`}
          style={{
            width: isWaitingForPurchase || purchasingItem ? "100%" : "0%",
          }}
        ></div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="md:w-64 border-b md:border-b-0 md:border-r border-border bg-panel/20 z-10 shrink-0">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto custom-scrollbar p-2 md:p-4 gap-1 snap-x">
            <div className="hidden md:block text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
              Categories
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start shrink-0 md:w-full text-left px-4 py-2 md:py-3 rounded-lg font-bold uppercase tracking-wider transition-all border whitespace-nowrap text-xs md:text-sm ${
                  activeCategory === cat
                    ? "bg-accent/10 text-accent border-accent/30 shadow-inner"
                    : "text-tx-muted hover:bg-panel-hover hover:text-tx-main border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative bg-app-base/30 pb-24 md:pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto relative z-10">
            {filteredItems.map((item) => {
              const isOwned =
                item.isOneTime && (upgrades || []).includes(item.id);

              // KORJAUS: Nyt kortin nappia painamalla AVAAMME modaalin, emme osta suoraan.
              return (
                <div
                  key={item.id}
                  className={`bg-panel border-2 rounded-xl overflow-hidden flex flex-col group transition-all shadow-md ${
                    isOwned
                      ? "opacity-50 border-border/20 grayscale-[0.5]"
                      : "border-border hover:border-accent/40 hover:shadow-xl cursor-pointer"
                  }`}
                  onClick={() =>
                    !isOwned && !purchasingItem && setSelectedBundle(item)
                  }
                >
                  <div className="h-24 md:h-40 bg-app-base/50 flex items-center justify-center relative p-2 md:p-4 border-b border-border/30">
                    <img
                      src={item.icon}
                      className={`w-12 h-12 md:w-20 md:h-20 pixelated drop-shadow-2xl transition-transform ${!isOwned && "group-hover:scale-110"}`}
                      alt={item.name}
                    />
                    {item.isOneTime && (
                      <span className="absolute top-2 right-2 bg-warning/20 text-[7px] md:text-[9px] font-black text-warning uppercase px-1.5 py-0.5 rounded border border-warning/30">
                        Unique
                      </span>
                    )}
                  </div>

                  <div className="p-3 md:p-5 flex-1 flex flex-col pointer-events-none">
                    <h3 className="text-xs md:text-lg font-bold text-tx-main mb-1 uppercase tracking-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[9px] md:text-[11px] text-tx-muted mb-4 md:mb-6 flex-1 opacity-80 leading-tight md:leading-snug font-medium line-clamp-2 md:line-clamp-none">
                      {item.description}
                    </p>

                    <button
                      disabled={isOwned || !!purchasingItem}
                      className={`w-full py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-3 transition-all font-black border uppercase tracking-widest text-[10px] md:text-xs pointer-events-auto ${
                        isOwned
                          ? "bg-app-base text-tx-muted cursor-not-allowed border-transparent"
                          : "bg-panel-hover group-hover:bg-accent group-hover:text-white border-border group-hover:border-accent shadow-inner"
                      }`}
                    >
                      {isOwned ? (
                        "OWNED"
                      ) : (
                        <>
                          <img
                            src="assets/ui/icon_gem.png"
                            className="w-3 h-3 md:w-4 md:h-4 pixelated"
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
