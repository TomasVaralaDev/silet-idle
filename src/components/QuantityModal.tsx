import { useState } from 'react';
import { getItemDetails } from '../data';

interface QuantityModalProps {
  itemId: string;
  maxAmount: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
  title: string;
}

export default function QuantityModal({ itemId, maxAmount, onConfirm, onClose, title }: QuantityModalProps) {
  const [amount, setAmount] = useState<string>('1');
  const item = getItemDetails(itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (val > 0 && val <= maxAmount) {
      onConfirm(val);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-2 right-3 text-slate-400 hover:text-white">✕</button>
        
        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          <span>{item?.icon}</span> {title}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Amount (Max: {maxAmount})
            </label>
            <div className="flex gap-2">
              <input 
                type="number" 
                min="1" 
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setAmount(maxAmount.toString())}
                className="bg-slate-700 px-3 rounded text-xs font-bold hover:bg-slate-600"
              >
                MAX
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-bold text-white">
              Confirm
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded font-bold text-slate-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}