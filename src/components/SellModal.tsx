import { useState } from 'react';
import { getItemDetails } from '../data';
import type { GameState, Resource } from '../types';

interface SellModalProps {
  itemId: string | null;
  inventory: GameState['inventory'];
  onClose: () => void;
  onSell: (itemId: string, amount: number | 'all') => void;
}

export default function SellModal({ itemId, inventory, onClose, onSell }: SellModalProps) {
  const [sellAmount, setSellAmount] = useState<string>('1');

  if (!itemId) return null;

  // KORJAUS: Tyyppimuunnos Resourcelle
  const item = getItemDetails(itemId) as Resource;
  const count = inventory[itemId] || 0;

  if (!item) return null;

  const handleSell = () => {
    const amount = sellAmount === 'all' ? 'all' : parseInt(sellAmount);
    if (amount !== 'all' && (isNaN(amount) || amount <= 0)) return;
    onSell(itemId, amount);
    onClose();
    setSellAmount('1');
  };

  const currentAmount = sellAmount === 'all' ? count : parseInt(sellAmount) || 0;
  const totalValue = currentAmount * item.value;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl p-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">✕</button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-slate-950 rounded-full border-2 border-slate-800 mx-auto flex items-center justify-center mb-3 shadow-inner">
             <img src={item.icon} alt={item.name} className="w-10 h-10 pixelated" />
          </div>
          <h2 className={`text-xl font-bold ${item.color} uppercase tracking-wider`}>{item.name}</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">Unit Value: <span className="text-amber-500">{item.value}g</span></p>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 mb-6">
          <div className="flex justify-between items-center mb-2 text-sm text-slate-400">
            <span>In Storage:</span>
            <span className="font-mono font-bold text-slate-200">{count}</span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button onClick={() => setSellAmount('1')} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 border border-slate-700">1</button>
            <button onClick={() => setSellAmount(Math.floor(count / 2).toString())} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 border border-slate-700">50%</button>
            <button onClick={() => setSellAmount('all')} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 border border-slate-700">ALL</button>
          </div>

          <div className="relative">
            <input 
              type="number" 
              value={sellAmount === 'all' ? count : sellAmount} 
              onChange={(e) => setSellAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded py-2 px-3 text-right text-slate-200 font-mono focus:border-amber-500 outline-none"
            />
            <span className="absolute left-3 top-2 text-slate-500 text-xs font-bold uppercase">Amount</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-sm font-bold text-slate-400 uppercase">Total Profit</span>
          <span className="text-xl font-mono font-bold text-amber-400 flex items-center gap-2">
            {totalValue.toLocaleString()} <img src="/assets/ui/coins.png" className="w-4 h-4 pixelated" alt="g" />
          </span>
        </div>

        <button 
          onClick={handleSell}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold uppercase tracking-widest rounded shadow-lg shadow-amber-900/20 transition-all active:scale-[0.98]"
        >
          Confirm Transaction
        </button>

      </div>
    </div>
  );
}