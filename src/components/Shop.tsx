import type { ShopItem } from '../types';

interface ShopProps {
  items: ShopItem[];
  coins: number;
  upgrades: string[];
  onBuy: (item: ShopItem) => void;
}

export default function Shop({ items, coins, upgrades, onBuy }: ShopProps) {
  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-slate-950">
      
      <header className="mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-amber-500 flex items-center gap-4 uppercase tracking-widest">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
             <img src="/assets/ui/icon_shop.png" className="w-10 h-10 pixelated" alt="Shop" />
          </div>
          Requisition
        </h2>
        <p className="text-slate-400 text-sm">Exchange Memory Fragments for system upgrades.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
        {items.map(item => {
          const isOwned = upgrades.includes(item.id);
          const canAfford = coins >= item.cost;

          return (
            <div key={item.id} className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-200 ${isOwned ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:shadow-lg'}`}>
              <div className="flex justify-between items-start mb-5">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                  <img src={item.icon} alt={item.name} className="w-16 h-16 pixelated drop-shadow-lg" />
                </div>
                {isOwned && <span className="text-[10px] font-bold bg-emerald-950 text-emerald-500 border border-emerald-900 px-3 py-1 rounded-full uppercase tracking-wider">Acquired</span>}
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 uppercase tracking-wide">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-6 h-10 leading-snug">{item.description}</p>
                
                <button 
                  disabled={isOwned || !canAfford}
                  onClick={() => onBuy(item)}
                  className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all border
                    ${isOwned 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700' 
                      : canAfford 
                        ? 'bg-amber-700 hover:bg-amber-600 text-white border-amber-600 shadow-lg' 
                        : 'bg-slate-800 text-red-400 cursor-not-allowed border-slate-700'
                    }`}
                >
                  {isOwned ? 'INSTALLED' : (
                    <>
                      <span>{item.cost.toLocaleString()}</span>
                      <img src="/assets/ui/coins.png" className="w-4 h-4 pixelated" alt="Coins" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}