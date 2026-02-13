import type { InventoryItem } from './InventoryGrid';

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSell: () => void;
  onEquip?: () => void;
}

export default function ItemDetails({ item, onClose, onSell, onEquip }: Props) {
  const isEquippable = item.slot || item.healing || item.category === 'Food';

  // Määritellään väriteemat rarityn mukaan
  const getRarityColors = () => {
    switch (item.rarity) {
      case 'legendary': return { border: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' };
      case 'rare': return { border: 'border-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20' };
      case 'uncommon': return { border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' };
      default: return { border: 'border-slate-600', text: 'text-slate-300', bg: 'bg-slate-800', glow: 'shadow-none' };
    }
  };

  const theme = getRarityColors();

  return (
    <div className={`
      w-full bg-slate-900 border rounded-xl overflow-hidden flex flex-col relative 
      animate-in slide-in-from-top-4 fade-in duration-300 shadow-xl shrink-0
      ${theme.border} border-opacity-50
    `}>
      
      {/* HEADER SECTION: Icon & Title Side-by-Side */}
      <div className="p-4 flex gap-4 relative">
        {/* Close Button (Absolute) */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors text-xs p-2"
        >
          ✕
        </button>

        {/* ICON BOX */}
        <div className={`
          w-16 h-16 shrink-0 rounded-lg border ${theme.border} ${theme.bg} 
          flex items-center justify-center relative overflow-hidden shadow-lg ${theme.glow}
        `}>
          <div className={`absolute inset-0 ${theme.bg} blur-md opacity-50`} />
          <img 
            src={item.icon} 
            alt={item.name} 
            className="w-10 h-10 pixelated relative z-10 drop-shadow-md scale-110" 
          />
        </div>

        {/* TEXT INFO */}
        <div className="flex flex-col justify-center min-w-0 pr-4">
          <h3 className={`font-bold text-base leading-tight truncate ${theme.text}`}>
            {item.name}
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">
            {item.rarity} {item.category || 'Item'}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
              x{item.count}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-amber-400">
              <span className="font-mono">{item.value}</span>
              <img src="/assets/ui/coins.png" className="w-3 h-3" alt="coins" />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-4 pb-4 space-y-3">
        {/* Description */}
        <p className="text-xs text-slate-400 italic leading-relaxed border-l-2 border-slate-800 pl-3">
          "{item.description || "A mysterious item with no description."}"
        </p>

        {/* Stats Grid */}
        {(item.stats || item.healing) && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {item.stats?.attack && (
              <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Attack</span>
                <span className="text-amber-400 font-mono font-bold">+{item.stats.attack}</span>
              </div>
            )}
            {item.stats?.defense && (
              <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Defense</span>
                <span className="text-blue-400 font-mono font-bold">+{item.stats.defense}</span>
              </div>
            )}
            {item.stats?.strength && (
              <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Strength</span>
                <span className="text-red-400 font-mono font-bold">+{item.stats.strength}</span>
              </div>
            )}
            {item.healing && (
              <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800 flex justify-between items-center text-xs col-span-2">
                <span className="text-emerald-500 font-bold uppercase text-[10px]">Restores HP</span>
                <span className="text-emerald-400 font-mono font-bold">+{item.healing}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS FOOTER */}
      <div className="grid grid-cols-2 border-t border-slate-800 divide-x divide-slate-800">
        <button 
          onClick={onSell}
          className="py-3 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">💰</span> Sell
        </button>
        
        {isEquippable && (
          <button 
            onClick={onEquip}
            className="py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 bg-slate-800/50"
          >
            Equip <span className="text-slate-500">→</span>
          </button>
        )}
        
        {/* Jos ei ole puettava, Sell nappi vie koko leveyden */}
        {!isEquippable && (
          <div className="hidden" /> // Grid kikka, jotta layout ei hajoa, tai muuta grid-cols logiikkaa
        )}
      </div>
      
      {/* Fix: Jos ei puettava, laajennetaan Sell nappi */}
      {!isEquippable && (
        <style>{`
          .grid-cols-2 { display: flex; }
          .grid-cols-2 > button { flex: 1; border-right: none; }
        `}</style>
      )}
    </div>
  );
}