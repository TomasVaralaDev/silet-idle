// KORJAUS: Lisätty 'type'
import type { ShopItem } from '../types';

interface ShopProps {
  items: ShopItem[];
  coins: number;
  upgrades: string[];
  onBuy: (item: ShopItem) => void;
}

export default function Shop({ items, coins, upgrades, onBuy }: ShopProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6"><h2 className="text-3xl font-bold flex items-center gap-3 text-yellow-400"><span className="text-4xl">🛒</span> Tool Shop</h2><p className="text-slate-400 mt-2">Buy better tools to work faster.</p></header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isOwned = upgrades.includes(item.id);
          const canAfford = coins >= item.cost;
          return (
            <div key={item.id} className={`p-6 rounded-xl border relative overflow-hidden ${isOwned ? 'bg-slate-900/50 border-emerald-900/50 opacity-75' : 'bg-slate-900 border-slate-700'}`}>
              <div className="flex justify-between items-start mb-4"><div className="text-4xl p-3 bg-slate-950 rounded-lg border border-slate-800">{item.icon}</div>{isOwned && <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-1 rounded font-bold uppercase">Owned</span>}</div>
              <h3 className="text-xl font-bold mb-1 text-slate-200">{item.name}</h3>
              <p className="text-sm text-slate-400 mb-2">{item.description}</p>
              <div className="text-xs font-mono text-emerald-400 mb-6 uppercase tracking-wider">Speed: +{Math.round((1 - item.multiplier) * 100)}%</div>
              {!isOwned ? (
                <button onClick={() => onBuy(item)} disabled={!canAfford} className={`w-full py-3 rounded-lg font-bold flex justify-between px-4 items-center transition-all ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}><span>Buy</span><span>{item.cost} 🟡</span></button>
              ) : (<div className="w-full py-3 bg-slate-800 rounded-lg text-center text-slate-500 font-bold text-sm uppercase">Active</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}