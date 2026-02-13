import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS } from '../data';
import type { ShopItem } from '../types'; // Tuodaan tyyppi types-tiedostosta, ei datasta

export default function Shop() {
  const coins = useGameStore(state => state.coins);
  const upgrades = useGameStore(state => state.upgrades);
  const setState = useGameStore(state => state.setState);
  const setNotification = useGameStore(state => state.setNotification);

  const handleBuy = (item: ShopItem) => {
    // Käytetään nyt 'price' kenttää
    if (coins < item.price) return;
    if (upgrades.includes(item.id)) return;

    setState((prev) => ({
      coins: prev.coins - item.price,
      upgrades: [...prev.upgrades, item.id]
    }));

    setNotification({ message: `Purchased: ${item.name}`, icon: item.icon });
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="p-6 h-full bg-slate-950 overflow-y-auto custom-scrollbar">
      {/* ... (Otsikot pysyvät samoina) ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOP_ITEMS.map((item) => {
          const isOwned = upgrades.includes(item.id);
          const canAfford = coins >= item.price;
          
          // Nyt 'requires' on tunnettu kenttä!
          const requirementMet = !item.requires || upgrades.includes(item.requires);
          
          if (!requirementMet && !isOwned) return null;

          return (
            <button
              key={item.id}
              onClick={() => handleBuy(item)}
              disabled={isOwned || !canAfford}
              className={`relative p-5 rounded-xl border text-left transition-all duration-200 group
                ${isOwned ? 'bg-slate-900/40 opacity-60' : 'bg-slate-900 border-slate-800'}
              `}
            >
              {/* Renderöinti kuten aiemmin, käyttäen item.price */}
              <div className="flex justify-between items-start mb-4">
                 <img src={item.icon} alt={item.name} className="w-10 h-10 pixelated" />
                 {!isOwned && <span className="text-amber-500 font-mono">{item.price}</span>}
              </div>
              <h3 className="font-bold text-slate-200">{item.name}</h3>
              <p className="text-xs text-slate-500">{item.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}