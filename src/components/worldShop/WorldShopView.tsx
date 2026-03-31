import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { WORLD_SHOP_DATA } from "../../data/worldShop";
import { WORLD_INFO } from "../../data/worlds";
import MarketItem from "./MarketItem";
import PouchRatesModal from "../modals/PouchRatesModal";

export default function WorldShopView() {
  const [selectedWorld, setSelectedWorld] = useState(1);
  const [isRatesOpen, setIsRatesOpen] = useState(false);

  const { buyWorldItem, inventory, coins, worldShop } = useGameStore();

  const currentItems = WORLD_SHOP_DATA.filter(
    (i) => i.worldId === selectedWorld,
  );
  const currentWorldInfo = WORLD_INFO[selectedWorld];

  return (
    <div className="h-full flex flex-col bg-app-base text-tx-main overflow-hidden font-sans text-left relative">
      <PouchRatesModal
        isOpen={isRatesOpen}
        onClose={() => setIsRatesOpen(false)}
      />

      {/* HEADER: Skaalattu mobiiliin */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-4 md:gap-6 sticky top-0 z-30 backdrop-blur-md shrink-0">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
          <img
            src="./assets/ui/icon_world_market.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
            alt="World Market"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-accent mb-0.5 md:mb-1">
            World Market
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium">
            Daily stock refreshes at 00:00 UTC.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* MAAILMAN VALINTA (MOBILE: Horisontaalinen, DESKTOP: Vertikaalinen Sidebar) */}
        <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-border/50 overflow-x-auto md:overflow-y-auto bg-app-base/80 backdrop-blur-sm z-20 custom-scrollbar flex md:flex-col shrink-0 snap-x">
          {Object.entries(WORLD_INFO).map(([id, info]) => {
            const isSelected = selectedWorld === Number(id);
            return (
              <button
                key={id}
                onClick={() => setSelectedWorld(Number(id))}
                className={`flex-shrink-0 md:flex-shrink w-48 md:w-full p-3 md:p-4 text-left border-r md:border-r-0 md:border-b border-border/30 transition-all group relative overflow-hidden snap-start ${
                  isSelected ? "bg-accent/15" : "hover:bg-panel"
                }`}
              >
                {/* Taustakuva häivytyksellä */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={info.image}
                    className="w-full h-full object-cover grayscale"
                    alt=""
                  />
                </div>

                <div className="relative z-10">
                  <div
                    className={`text-[8px] md:text-[10px] font-black tracking-widest ${isSelected ? "text-accent" : "text-tx-muted/60"}`}
                  >
                    WORLD {id}
                  </div>
                  <div
                    className={`font-black uppercase tracking-tighter text-sm md:text-lg truncate ${isSelected ? "text-tx-main" : "text-tx-muted"}`}
                  >
                    {info.name}
                  </div>
                </div>

                {/* Valintaindikaattori (Mobiilissa alhaalla, työpöydällä vasemmalla) */}
                {isSelected && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_10px_#E43636] hidden md:block"></div>
                    <div className="absolute left-0 right-0 bottom-0 h-1 bg-accent shadow-[0_0_10px_#E43636] md:hidden"></div>
                  </>
                )}
              </button>
            );
          })}
        </aside>

        {/* TUOTEALUE */}
        <main className="flex-1 relative overflow-hidden">
          {/* Taustagradientti ja maailman kuva */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-20 md:opacity-40"
              style={{ backgroundImage: `url(${currentWorldInfo?.image})` }}
            />
            <div className="absolute inset-0 bg-black/90 md:bg-app-base/80 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 h-full p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                    >
                      <MarketItem
                        item={item}
                        onBuy={buyWorldItem}
                        playerInventory={inventory}
                        playerCoins={coins}
                        purchaseCount={worldShop.purchases[item.id] || 0}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-12 md:p-20 text-center border-2 border-dashed border-border/30 rounded-2xl bg-panel/20 backdrop-blur-md">
                    <div className="text-3xl md:text-4xl mb-4 opacity-20">
                      📡
                    </div>
                    <p className="text-tx-muted font-mono uppercase tracking-widest text-xs md:text-sm">
                      No items available for this world.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HELP BUTTON: Kelluva mobiilissa, siirtyy tieltä pois */}
          <button
            onClick={() => setIsRatesOpen(true)}
            className="absolute bottom-6 right-6 z-30 w-12 h-12 flex items-center justify-center bg-panel/80 hover:bg-accent border border-border hover:border-accent/50 rounded-full transition-all shadow-2xl backdrop-blur-sm active:scale-95 group"
          >
            <img
              src="./assets/ui/icon_question.png"
              className="w-6 h-6 pixelated group-hover:brightness-200 transition"
              alt="Rates"
            />
          </button>
        </main>
      </div>
    </div>
  );
}
