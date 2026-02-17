import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { WORLD_SHOP_DATA } from '../../data/worldShop';
import { WORLD_INFO } from '../../data/worlds';
import MarketItem from './MarketItem'; 

export default function WorldShopView() {
  const [selectedWorld, setSelectedWorld] = useState(1);
  
  // HAE worldShop STATE
  const { buyWorldItem, inventory, coins, worldShop, checkDailyReset } = useGameStore();

  const currentItems = WORLD_SHOP_DATA.filter(i => i.worldId === selectedWorld);
  const currentWorldInfo = WORLD_INFO[selectedWorld];

  // Tarkistetaan reset joka renderöinnillä (tai voit siirtää useEffectiin)
  checkDailyReset(); 

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      {/* HEADER */}
      <header className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <span className="text-2xl">🏛️</span>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-cyan-500 leading-none">World Market</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-tighter mt-1 font-mono">Terminal connection established / Region: {currentWorldInfo?.name}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* VASEN: MAAILMAN VALINTA */}
        <aside className="w-72 border-r border-slate-800 overflow-y-auto bg-slate-950/50 backdrop-blur-sm z-20 custom-scrollbar">
          {Object.entries(WORLD_INFO).map(([id, info]) => {
            const isSelected = selectedWorld === Number(id);
            return (
              <button
                key={id}
                onClick={() => setSelectedWorld(Number(id))}
                className={`w-full p-4 text-left border-b border-slate-800/50 transition-all group relative overflow-hidden ${
                  isSelected ? 'bg-cyan-500/20' : 'hover:bg-slate-900'
                }`}
              >
                {/* Pieni taustakuva-esikatselu nappeihin */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img src={info.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                </div>

                <div className="relative z-10">
                  <div className={`text-[10px] font-black tracking-widest ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`}>
                    REGION 0{id}
                  </div>
                  <div className={`font-black uppercase tracking-tighter text-lg ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {info.name}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
                )}
              </button>
            );
          })}
        </aside>

        {/* OIKEA: TUOTEALUE (Dynaamisella taustalla) */}
        <main className="flex-1 relative overflow-hidden">
          
          {/* DYNAAMINEN MAAILMAN TAUSTAKUVA */}
          <div className="absolute inset-0 z-0">
            {/* Kuva */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-110"
              style={{ backgroundImage: `url(${currentWorldInfo?.image})` }}
            />
            {/* Tummennus ja blur-overlay */}
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent"></div>
          </div>

          {/* ITSE TUOTTEET */}
          <div className="relative z-10 h-full p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.length > 0 ? (
                  currentItems.map(item => (
                    <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <MarketItem 
                        item={item} 
                        onBuy={buyWorldItem} 
                        playerInventory={inventory}
                        playerCoins={coins}
                        // UUSI: Välitä purchase count
                        purchaseCount={worldShop.purchases[item.id] || 0}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-md">
                    <div className="text-4xl mb-4 opacity-20">📡</div>
                    <p className="text-slate-500 font-mono uppercase tracking-widest text-sm">
                      No requisition orders available for this sector.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}