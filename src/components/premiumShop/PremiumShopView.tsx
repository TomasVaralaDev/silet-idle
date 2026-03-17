import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { PREMIUM_SHOP_ITEMS } from "../../data/premiumShop";
import type { PremiumShopItem } from "../../types";

export default function PremiumShopView() {
  const gems = useGameStore((state) => state.gems) || 0;
  // TODO: Lisää oikea osto-funktio useGameStore:een myöhemmin
  const handleBuy = (item: PremiumShopItem) => {
    alert(
      `Purchasing ${item.name} for ${item.priceGems} gems is not yet implemented!`,
    );
  };

  const categories = ["All", "Boosts", "Utility", "Cosmetics", "Bundles"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? PREMIUM_SHOP_ITEMS
      : PREMIUM_SHOP_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="h-full flex flex-col bg-app-base text-tx-main overflow-hidden font-sans text-left relative">
      {/* HEADER */}
      <div className="p-6 border-b border-border/50 bg-panel/80 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md shrink-0 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
            <span className="text-3xl drop-shadow-[0_0_10px_rgba(6,182,212,1)]">
              💎
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">
              Premium Store
            </h1>
            <p className="text-tx-muted text-sm font-medium">
              Support development and unlock exclusive benefits.
            </p>
          </div>
        </div>

        {/* OSTA GEMS NAPPI (Placeholder) */}
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 border border-cyan-400/50">
          + Get Gems
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR - KATEGORIAT */}
        <aside className="w-64 border-r border-border/50 overflow-y-auto bg-panel/30 z-10 custom-scrollbar">
          <div className="p-4 space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-tx-muted hover:bg-panel-hover hover:text-tx-main border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN - TUOTTEET */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {/* Taustagradientti */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-panel border border-border/50 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-500/50 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <div className="h-32 bg-gradient-to-br from-panel-hover to-panel flex items-center justify-center relative p-4">
                  <div className="absolute inset-0 bg-[url('/assets/ui/noise.png')] opacity-10 mix-blend-overlay"></div>
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-16 h-16 pixelated drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.isOneTime && (
                    <span className="absolute top-2 right-2 bg-app-base text-[9px] font-bold text-warning uppercase px-2 py-1 rounded border border-warning/30">
                      One-Time
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-tx-main mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-tx-muted mb-6 flex-1">
                    {item.description}
                  </p>

                  <button
                    onClick={() => handleBuy(item)}
                    className="w-full py-3 bg-panel-hover hover:bg-cyan-900/40 border border-border hover:border-cyan-500/50 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
                  >
                    <span className="text-sm">💎</span>
                    <span
                      className={
                        gems >= item.priceGems ? "text-cyan-400" : "text-danger"
                      }
                    >
                      {item.priceGems}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
