interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function PurchaseSuccessModal({
  isOpen,
  onClose,
  amount,
}: PurchaseSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Tumma tausta teeman mukaisella blurrilla */}
      <div
        className="absolute inset-0 bg-base/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modalin sisältö: RPG-paneeli teeman reunuksilla */}
      <div className="relative bg-panel border-2 border-border w-full max-w-sm rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Koristeellinen yläosa hohteella */}
        <div className="p-8 text-center relative">
          {/* Taustahohde joka käyttää teeman accent-väriä */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/20 blur-[50px] rounded-full"></div>

          <div className="relative inline-block mb-6">
            <img
              src="assets/ui/icon_gem.png"
              alt="Gems"
              className="w-24 h-24 object-contain pixelated relative z-10 drop-shadow-[0_0_20px_rgb(var(--color-accent)/0.6)] animate-bounce-slow"
            />
          </div>

          <h2 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover mb-1">
            Thank You!
          </h2>
          <p className="text-tx-muted font-bold uppercase tracking-[0.2em] text-[10px] mb-8 opacity-70">
            Transaction Complete
          </p>

          {/* Saatu määrä -laatikko */}
          <div className="bg-base/50 rounded-lg p-5 border border-border/50 mb-8 shadow-inner relative overflow-hidden">
            {/* Koristekulmat */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/30"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/30"></div>

            <span className="text-tx-muted text-[10px] uppercase font-black tracking-widest block mb-2 opacity-50">
              Gems Received
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-mono font-black text-tx-main tracking-tighter">
                +{amount.toLocaleString()}
              </span>
              <img
                src="assets/ui/icon_gem.png"
                className="w-8 h-8 pixelated"
                alt="gem"
              />
            </div>
          </div>

          {/* RPG-tyylinen painike */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-panel-hover hover:bg-accent text-accent hover:text-white font-black rounded-lg uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg border border-accent/30 hover:border-accent"
          >
            Claim Gems
          </button>
        </div>

        {/* Alareunan koristeellinen viiva */}
        <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
