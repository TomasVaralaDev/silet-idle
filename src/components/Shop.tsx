import type { ShopItem } from '../types';

interface ShopProps {
  items: ShopItem[];
  coins: number;
  upgrades: string[];
  onBuy: (item: ShopItem) => void;
}

export default function Shop({ items, coins, upgrades, onBuy }: ShopProps) {
  return (
    <div className="p-6">
      <header className="mb-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-yellow-500 flex items-center gap-3">
          <img src="/assets/ui/icon_shop.png" className="w-8 h-8 pixelated" alt="Shop" />
          General Store
        </h2>
        <p className="text-slate-400 text-sm">Spend your hard-earned coins on upgrades.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => {
          const isOwned = upgrades.includes(item.id);
          const canAfford = coins >= item.cost;

          return (
            <div key={item.id} className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${isOwned ? 'bg-slate-900 border-slate-700 opacity-50' : 'bg-slate-800 border-slate-600'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-700">
                  <img src={item.icon} alt={item.name} className="w-10 h-10 pixelated" />
                </div>
                {isOwned && <span className="text-xs font-bold bg-slate-950 text-emerald-500 px-2 py-1 rounded">OWNED</span>}
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-4 h-8">{item.description}</p>
                
                <button 
                  disabled={isOwned || !canAfford}
                  onClick={() => onBuy(item)}
                  className={`w-full py-2 rounded font-bold text-sm flex items-center justify-center gap-2
                    ${isOwned 
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : canAfford 
                        ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                        : 'bg-slate-700 text-red-400 cursor-not-allowed'
                    }`}
                >
                  {isOwned ? 'Purchased' : (
                    <>
                      <span>{item.cost}</span>
                      <img src="/assets/ui/coins.png" className="w-3 h-3 pixelated" alt="Coins" />
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