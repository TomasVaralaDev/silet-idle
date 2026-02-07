import { getItemDetails } from '../data';
// KORJAUS: Lisätty 'type'
import type { GameState } from '../types';

interface SellModalProps {
  itemId: string | null;
  inventory: GameState['inventory'];
  onClose: () => void;
  onSell: (id: string, amount: number | 'all') => void;
}

export default function SellModal({ itemId, inventory, onClose, onSell }: SellModalProps) {
  if (!itemId) return null;
  const item = getItemDetails(itemId);
  const count = inventory[itemId] || 0;
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 w-full max-w-md p-6 rounded-2xl border border-slate-600 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
        <div className="text-center">
          <div className={`text-6xl mb-4 inline-block p-4 rounded-full bg-slate-900 border-2 border-slate-700 ${item.color}`}>{item.icon}</div>
          <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
          <p className="text-slate-400 mb-6">{item.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-900 p-4 rounded-xl">
            <div><p className="text-xs text-slate-500 uppercase">In Stock</p><p className="text-xl font-mono text-white">{count}</p></div>
            <div><p className="text-xs text-slate-500 uppercase">Price</p><p className="text-xl font-mono text-yellow-400">{item.value} 🟡</p></div>
          </div>
          <div className="space-y-3">
            <button onClick={() => onSell(item.id, 1)} className="w-full bg-slate-700 hover:bg-slate-600 p-3 rounded-lg font-bold flex justify-between"><span>Sell 1</span><span className="text-yellow-400">+{item.value} 🟡</span></button>
            <button onClick={() => onSell(item.id, 10)} disabled={count < 10} className={`w-full p-3 rounded-lg font-bold flex justify-between ${count < 10 ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}><span>Sell 10</span><span className={count < 10 ? '' : 'text-yellow-400'}>+{item.value * 10} 🟡</span></button>
            <button onClick={() => onSell(item.id, 'all')} className="w-full bg-emerald-600 hover:bg-emerald-500 p-3 rounded-lg font-bold flex justify-between text-white shadow-lg mt-4"><span>Sell All</span><span className="text-yellow-100 font-mono">+{count * item.value} 🟡</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}