import { getItemDetails } from '../../data';
import type { WorldShopItem } from '../../types';

interface Props {
  item: WorldShopItem;
  onBuy: (id: string) => void;
  playerInventory: Record<string, number>;
  playerCoins: number;
}

export default function MarketItem({ item, onBuy, playerInventory, playerCoins }: Props) {
  const canAffordCoins = playerCoins >= item.costCoins;
  const canAffordMats = item.costMaterials.every(m => (playerInventory[m.itemId] || 0) >= m.amount);
  const canAffordAll = canAffordCoins && canAffordMats;

  return (
    <div className={`
      relative group flex flex-col bg-slate-900/40 border transition-all duration-300 rounded-2xl overflow-hidden
      ${canAffordAll ? 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60' : 'border-red-900/20 opacity-80'}
    `}>
      
      {/* Yläosa: Tuotteen tiedot */}
      <div className="p-5 flex gap-4">
        {/* Kuvake */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
             <img src={item.icon} alt={item.name} className="w-10 h-10 pixelated group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-cyan-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded border border-cyan-400 shadow-sm">
            x{item.resultAmount}
          </div>
        </div>

        {/* Tekstit */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-100 truncate">{item.name}</h3>
          <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2 italic">
            "{item.description}"
          </p>
        </div>
      </div>

      {/* Keskiosa: Kustannukset */}
      <div className="px-5 pb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {/* Fragment Hinta */}
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold
            ${canAffordCoins ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}
          `}>
            <img src="/assets/ui/coins.png" className="w-4 h-4" alt="Coins" />
            {item.costCoins.toLocaleString()}
          </div>

          {/* Materiaali Hinnat */}
          {item.costMaterials.map(mat => {
            const details = getItemDetails(mat.itemId);
            const current = playerInventory[mat.itemId] || 0;
            const enough = current >= mat.amount;
            return (
              <div key={mat.itemId} className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold
                ${enough ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-500'}
              `}>
                <img src={details?.icon} className="w-4 h-4 pixelated" alt="" />
                {current}/{mat.amount}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alaosa: Ostonappi */}
      <button
        onClick={() => onBuy(item.id)}
        disabled={!canAffordAll}
        className={`
          w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all
          ${canAffordAll 
            ? 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border-t border-cyan-500/30' 
            : 'bg-slate-950 text-slate-700 border-t border-slate-800 cursor-not-allowed'}
        `}
      >
        {canAffordAll ? 'Authorize Exchange' : 'Insufficient Assets'}
      </button>
    </div>
  );
}