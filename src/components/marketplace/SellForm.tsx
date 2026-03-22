import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemById } from "../../utils/itemUtils";
import { createListing } from "../../services/marketService";
import InventorySelector from "./InventorySelector";

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

  // Haetaan itemin tiedot turvallisesti
  const selectedItem = selectedId ? getItemById(selectedId) : null;
  const maxAmount = selectedId ? inventory[selectedId] || 0 : 0;

  // TURVAMEKANISMI: Jos valittu ID ei enää vastaa mitään itemiä pelidatassa,
  // nollataan valinta automaattisesti, jotta sivu ei kaadu.
  useEffect(() => {
    if (selectedId && !selectedItem) {
      setSelectedId(null);
      emitEvent("error", "Selected item data is missing or corrupted.");
    }
  }, [selectedId, selectedItem, emitEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Varmistetaan, että item on olemassa ennen kuin jatketaan
    if (!selectedId || !selectedItem || isSubmitting) return;

    if (selectedItem.isUnique) {
      emitEvent("error", "Unique items cannot be sold on the market.");
      return;
    }

    if (amount < 1) {
      emitEvent("error", "Value must be greater or equal to 1");
      return;
    }

    if (amount > maxAmount) {
      emitEvent(
        "error",
        `Insufficient stock. You only have ${maxAmount} units.`,
      );
      return;
    }

    if (price < 1) {
      emitEvent("error", "Value must be greater or equal to 1");
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing(myUid, username, selectedId, amount, price);
      emitEvent(
        "success",
        `Listing created: ${amount}x ${selectedItem.name}`,
        selectedItem.icon,
      );
      onComplete();
    } catch (err: unknown) {
      emitEvent("error", err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden animate-in fade-in duration-500 text-left bg-app-base">
      {/* LEFT: Inventory Selection */}
      <div className="flex-1 min-h-[300px] flex flex-col">
        <h3 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4">
          Select Resource from Storage
        </h3>
        <div className="flex-1 overflow-hidden">
          <InventorySelector selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {/* RIGHT: Listing Options */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-panel/50 border border-border rounded-sm p-5 flex flex-col h-full shadow-2xl backdrop-blur-sm">
          <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4 border-b border-border/30 pb-3 text-left">
            Item info
          </h3>

          {/* Renderöidään lomake vain jos item on oikeasti löydetty */}
          {selectedId && selectedItem ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6 flex-1"
            >
              {/* Item Info Card */}
              <div className="bg-app-base p-4 rounded-sm border border-border flex items-center gap-4 shadow-inner">
                <img
                  src={selectedItem.icon}
                  className="w-10 h-10 pixelated"
                  alt=""
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-black text-xs uppercase tracking-wider truncate ${
                      selectedItem.color || "text-tx-main"
                    }`}
                  >
                    {selectedItem.name}
                  </p>
                  <p className="text-[10px] text-tx-muted font-mono mt-1 uppercase">
                    Available: {maxAmount}
                  </p>
                </div>
              </div>

              {selectedItem.isUnique && (
                <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-sm text-center">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Unique Item — Cannot be traded
                  </p>
                </div>
              )}

              {/* Amount Input */}
              <div
                className={
                  selectedItem.isUnique ? "opacity-50 pointer-events-none" : ""
                }
              >
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-black text-tx-muted uppercase tracking-widest">
                    Quantity
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(maxAmount)}
                    disabled={selectedItem.isUnique}
                    className="text-[9px] text-accent hover:text-accent-hover font-black uppercase tracking-tighter transition-colors disabled:opacity-50"
                  >
                    Set Max
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  disabled={selectedItem.isUnique}
                  onChange={(e) =>
                    setAmount(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full bg-app-base border border-border rounded-sm px-3 py-2.5 text-sm text-tx-main focus:outline-none focus:border-accent transition-colors font-mono disabled:opacity-50"
                />
              </div>

              {/* Price Input */}
              <div
                className={
                  selectedItem.isUnique ? "opacity-50 pointer-events-none" : ""
                }
              >
                <label className="text-[10px] font-black text-tx-muted uppercase tracking-widest block mb-2">
                  Price Per Unit
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={price}
                    disabled={selectedItem.isUnique}
                    onChange={(e) =>
                      setPrice(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-app-base border border-border rounded-sm px-3 py-2.5 text-sm text-tx-main focus:outline-none focus:border-warning transition-colors pl-10 font-mono disabled:opacity-50"
                  />
                  <img
                    src="/assets/ui/coins.png"
                    className="w-4 h-4 absolute left-3 opacity-70"
                    alt=""
                  />
                </div>
              </div>

              {/* Revenue calculation */}
              <div
                className={`mt-auto p-4 bg-app-base rounded-sm border border-border border-dashed ${selectedItem.isUnique ? "opacity-50" : ""}`}
              >
                <p className="text-[9px] text-tx-muted font-black uppercase tracking-widest mb-2 text-left">
                  Estimated Revenue
                </p>
                <div className="flex items-center gap-2">
                  <img src="/assets/ui/coins.png" className="w-5 h-5" alt="" />
                  <span className="text-2xl font-black font-mono text-warning tracking-tighter">
                    {selectedItem.isUnique
                      ? 0
                      : (amount * price).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedItem.isUnique}
                className="w-full py-4 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-accent disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Listing item..." : "Sell Item"}
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
              <img
                src="/assets/ui/icon_reward.png"
                className="w-20 h-20 pixelated opacity-20 grayscale"
                alt="Awaiting Selection"
              />
              <p className="text-[10px] text-tx-muted/60 font-black uppercase tracking-widest leading-relaxed">
                Awaiting item selection
                <br />
                From inventory
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
