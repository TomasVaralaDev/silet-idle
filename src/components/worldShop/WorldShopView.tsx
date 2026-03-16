import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { WORLD_SHOP_DATA } from "../../data/worldShop";
import { WORLD_INFO } from "../../data/worlds";
import MarketItem from "./MarketItem";
import PouchRatesModal from "../modals/PouchRatesModal"; // Muista tuoda modaali

export default function WorldShopView() {
  const [selectedWorld, setSelectedWorld] = useState(1);
  const [isRatesOpen, setIsRatesOpen] = useState(false); // Lisätty tila modaalille

  // HAE worldShop STATE
  const { buyWorldItem, inventory, coins, worldShop, checkDailyReset } =
    useGameStore();

  const currentItems = WORLD_SHOP_DATA.filter(
    (i) => i.worldId === selectedWorld,
  );
  const currentWorldInfo = WORLD_INFO[selectedWorld];

  // Tarkistetaan reset joka renderöinnillä
  checkDailyReset();

  return (
    <div className="h-full flex flex-col bg-app-base text-tx-main overflow-hidden font-sans text-left relative">
      {/* POUCH DROP RATES MODAALI */}
      <PouchRatesModal
        isOpen={isRatesOpen}
        onClose={() => setIsRatesOpen(false)}
      />

      {/* HEADER */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/ui/icon_world_market.png"
            className="w-10 h-10 pixelated object-contain"
            alt="World Market"
          />
        </div>
        <div className="flex-1">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-accent mb-1`}
          >
            World Market
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            Buy items with world currencies.
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* VASEN: MAAILMAN VALINTA */}
        <aside className="w-72 border-r border-border/50 overflow-y-auto bg-app-base/50 backdrop-blur-sm z-20 custom-scrollbar">
          {Object.entries(WORLD_INFO).map(([id, info]) => {
            const isSelected = selectedWorld === Number(id);
            return (
              <button
                key={id}
                onClick={() => setSelectedWorld(Number(id))}
                className={`w-full p-4 text-left border-b border-border/30 transition-all group relative overflow-hidden ${
                  isSelected ? "bg-accent/10" : "hover:bg-panel"
                }`}
              >
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <img
                    src={info.image}
                    className="w-full h-full object-cover grayscale"
                    alt=""
                  />
                </div>

                <div className="relative z-10">
                  <div
                    className={`text-[10px] font-black tracking-widest ${
                      isSelected ? "text-accent" : "text-tx-muted/60"
                    }`}
                  >
                    WORLD {id}
                  </div>
                  <div
                    className={`font-black uppercase tracking-tighter text-lg ${
                      isSelected ? "text-tx-main" : "text-tx-muted"
                    }`}
                  >
                    {info.name}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_10px_rgb(var(--color-accent))]"></div>
                )}
              </button>
            );
          })}
        </aside>

        {/* OIKEA: TUOTEALUE */}
        <main className="flex-1 relative overflow-hidden">
          {/* DYNAAMINEN MAAILMAN TAUSTAKUVA */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-40"
              style={{ backgroundImage: `url(${currentWorldInfo?.image})` }}
            />
            <div className="absolute inset-0 bg-app-base/80 backdrop-blur-[1px]"></div>
          </div>

          <div className="relative z-10 h-full p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="col-span-full p-20 text-center border-2 border-dashed border-border rounded-2xl bg-panel/50 backdrop-blur-md">
                    <div className="text-4xl mb-4 opacity-20">📡</div>
                    <p className="text-tx-muted font-mono uppercase tracking-widest text-sm">
                      No items available for this world.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KELLUVA KYSYMYSMERKKI-IKONI */}
          <button
            onClick={() => setIsRatesOpen(true)} // Avaa modaalin
            className="absolute bottom-6 right-6 z-30 w-12 h-12 flex items-center justify-center bg-panel/80 hover:bg-accent border border-border hover:border-accent-hover rounded-full transition-all shadow-xl backdrop-blur-sm active:scale-95 group"
            title="View Pouch Drop Rates"
          >
            <img
              src="/assets/ui/icon_question.png"
              alt="Help"
              className="w-7 h-7 pixelated group-hover:brightness-200 transition"
            />
          </button>
        </main>
      </div>
    </div>
  );
}
