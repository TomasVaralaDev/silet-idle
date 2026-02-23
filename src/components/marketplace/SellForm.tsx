import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemById } from '../../utils/itemUtils';
import { createListing } from '../../services/marketService';
import InventorySelector from './InventorySelector';

interface Props {
  myUid: string;
  onComplete: () => void;
}

export default function SellForm({ myUid, onComplete }: Props) {
  const username = useGameStore((state) => state.username);
  const inventory = useGameStore((state) => state.inventory);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [price, setPrice] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = selectedId ? getItemById(selectedId) : null;
  const maxAmount = selectedId ? inventory[selectedId] || 0 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !selectedItem || isSubmitting) return;
    if (amount <= 0 || amount > maxAmount) return alert('Invalid amount');
    if (price <= 0) return alert('Price must be positive');

    setIsSubmitting(true);
    try {
      await createListing(myUid, username, selectedId, amount, price);
      onComplete();
    } catch (err: unknown) {
      // Vaihdettu: any -> unknown
      // Tarkistetaan onko virhe standardi Error-objekti
      if (err instanceof Error) {
        alert(err.message);
      } else {
        // Jos virhe on jotain muuta (esim. pelkkä merkkijono)
        alert(String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
      {/* LEFT: Inventory Selection */}
      <div className="flex-1 min-h-[300px]">
        <InventorySelector selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* RIGHT: Listing Options */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full shadow-xl">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-800 pb-2">
            Listing Parameters
          </h3>

          {selectedItem ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 flex-1"
            >
              {/* Item Info Card */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center gap-4">
                <img
                  src={selectedItem.icon}
                  className="w-10 h-10 pixelated"
                  alt=""
                />
                <div>
                  <p
                    className={`font-bold text-sm ${selectedItem.color || 'text-white'}`}
                  >
                    {selectedItem.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Available: {maxAmount}
                  </p>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Quantity
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(maxAmount)}
                    className="text-[9px] text-cyan-500 hover:text-cyan-400 font-mono uppercase"
                  >
                    Set Max
                  </button>
                </div>
                <input
                  type="number"
                  min={1}
                  max={maxAmount}
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      Math.min(maxAmount, parseInt(e.target.value) || 0),
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Price Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                  Price Per Unit
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors pl-8"
                  />
                  <img
                    src="/assets/ui/coins.png"
                    className="w-4 h-4 absolute left-2.5 opacity-50"
                    alt=""
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="mt-auto p-4 bg-slate-950 rounded border border-slate-800 border-dashed">
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">
                  Total Fragments Received
                </p>
                <div className="flex items-center gap-2">
                  <img src="/assets/ui/coins.png" className="w-5 h-5" alt="" />
                  <span className="text-xl font-mono font-bold text-amber-500">
                    {(amount * price).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || amount <= 0}
                className={`w-full py-3 rounded font-bold text-xs uppercase tracking-widest transition-all ${
                  isSubmitting
                    ? 'bg-slate-800 text-slate-600'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_4px_15px_rgba(8,145,178,0.3)]'
                }`}
              >
                {isSubmitting ? 'Distributing...' : 'Authorize Listing'}
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center text-2xl opacity-20">
                📦
              </div>
              <p className="text-xs text-slate-600 italic">
                Awaiting resource selection from storage protocols.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
