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
  const emitEvent = useGameStore((state) => state.emitEvent);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [price, setPrice] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = selectedId ? getItemById(selectedId) : null;
  const maxAmount = selectedId ? inventory[selectedId] || 0 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedId || !selectedItem || isSubmitting) return;

    // --- LOPULLINEN VALIDIOINTI ENNEN LÄHETYSTÄ ---
    if (amount < 1) {
      emitEvent('error', 'Value must be greater or equal to 1');
      return;
    }

    if (amount > maxAmount) {
      emitEvent(
        'error',
        `Insufficient stock. You only have ${maxAmount} units.`,
      );
      return;
    }

    if (price < 1) {
      emitEvent('error', 'Value must be greater or equal to 1');
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing(myUid, username, selectedId, amount, price);
      emitEvent(
        'success',
        `Listing created: ${amount}x ${selectedItem.name}`,
        selectedItem.icon,
      );
      onComplete();
    } catch (err: unknown) {
      emitEvent('error', err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden animate-in fade-in duration-500 text-left">
      {/* LEFT: Inventory Selection */}
      <div className="flex-1 min-h-[300px] flex flex-col">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
          Select Resource from Storage
        </h3>
        <div className="flex-1 overflow-hidden">
          <InventorySelector selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {/* RIGHT: Listing Options */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-sm p-5 flex flex-col h-full shadow-2xl backdrop-blur-sm">
          <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-3 text-left">
            Listing Parameters
          </h3>

          {selectedItem ? (
            <form
              onSubmit={handleSubmit}
              noValidate // Estää selaimen omat virheilmoitukset
              className="flex flex-col gap-6 flex-1"
            >
              {/* Item Info Card */}
              <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 flex items-center gap-4">
                <img
                  src={selectedItem.icon}
                  className="w-10 h-10 pixelated"
                  alt=""
                />
                <div>
                  <p
                    className={`font-black text-xs uppercase tracking-wider ${selectedItem.color || 'text-white'}`}
                  >
                    {selectedItem.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                    Available: {maxAmount}
                  </p>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Quantity
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(maxAmount)}
                    className="text-[9px] text-cyan-500 hover:text-cyan-400 font-black uppercase tracking-tighter"
                  >
                    Set Max
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  // Estää miinusluvut lennosta
                  onChange={(e) =>
                    setAmount(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-600 transition-colors font-mono"
                />
              </div>

              {/* Price Input */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Price Per Unit
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={price}
                    // Estää miinusluvut lennosta
                    onChange={(e) =>
                      setPrice(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600 transition-colors pl-10 font-mono"
                  />
                  <img
                    src="/assets/ui/coins.png"
                    className="w-4 h-4 absolute left-3 opacity-70"
                    alt=""
                  />
                </div>
              </div>

              <div className="mt-auto p-4 bg-slate-950 rounded-sm border border-slate-800 border-dashed">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 text-left">
                  Estimated Revenue
                </p>
                <div className="flex items-center gap-2">
                  <img src="/assets/ui/coins.png" className="w-5 h-5" alt="" />
                  <span className="text-2xl font-black font-mono text-amber-500 tracking-tighter">
                    {(amount * price).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 active:scale-95 transition-all"
              >
                {isSubmitting ? 'Transmitting...' : 'Authorize Listing'}
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center text-2xl opacity-10">
                📦
              </div>
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">
                Awaiting Resource Selection
                <br />
                From Storage Protocols
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
