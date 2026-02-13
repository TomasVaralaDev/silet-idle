import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS } from '../data';
import type { ShopItem } from '../types';

export default function Shop() {
  const coins = useGameStore(state => state.coins);
  const upgrades = useGameStore(state => state.upgrades);
  const setState = useGameStore(state => state.setState);
  const emitEvent = useGameStore(state => state.emitEvent); // KORJAUS: Vaihdettu emitEventiin

  const handleBuy = (item: ShopItem) => {
    if (coins < item.price) {
      // KORJAUS: Käytetään emitEventiä alertin sijaan
      emitEvent('warning', `Need ${item.price - coins} more coins!`, '/assets/ui/coins.png');
      return;
    }
    
    if (upgrades.includes(item.id)) return;

    setState((prev) => ({
      coins: prev.coins - item.price,
      upgrades: [...prev.upgrades, item.id]
    }));

    // KORJAUS: Onnistunut osto tapahtumana
    emitEvent('success', `Unlocked: ${item.name}`, item.icon);
  };

  return (
    <div className="p-6 h-full bg-slate-950 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Marketplace</h2>
        <p className="text-slate-500 text-sm">Exchange credits for system upgrades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOP_ITEMS.map((item) => {
          const isOwned = upgrades.includes(item.id);
          const canAfford = coins >= item.price;
          const requirementMet = !item.requires || upgrades.includes(item.requires);
          
          if (!requirementMet && !isOwned) return null;

          return (
            <button
              key={item.id}
              onClick={() => handleBuy(item)}
              disabled={isOwned || !canAfford}
              className={`relative p-5 rounded-xl border text-left transition-all duration-200 group
                ${isOwned ? 'bg-slate-900/40 border-slate-800/50 opacity-60' : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                 <img src={item.icon} alt={item.name} className="w-10 h-10 pixelated" />
                 {!isOwned && (
                   <div className="flex items-center gap-1">
                     <span className={`font-mono text-sm ${canAfford ? 'text-amber-500' : 'text-red-500'}`}>
                       {item.price.toLocaleString()}
                     </span>
                     <img src="/assets/ui/coins.png" className="w-4 h-4" alt="coins" />
                   </div>
                 )}
                 {isOwned && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Owned</span>}
              </div>
              <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}