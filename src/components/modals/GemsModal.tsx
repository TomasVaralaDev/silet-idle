import { GEM_PACKS, type GemPack } from "../../data/gemPacks";

interface GemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (packId: string) => void;
}

export default function GemsModal({
  isOpen,
  onClose,
  onSelect,
}: GemsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {
        // Main Container
      }
      <div className="bg-panel border-2 border-border rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {
          // Header Section
        }
        <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 shrink-0 text-left">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
            <img
              src="./assets/ui/icon_gem.png"
              className="w-10 h-10 pixelated object-contain"
              alt="Gems"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover">
              Treasury
            </h1>
            <p className="text-tx-muted text-sm font-medium uppercase tracking-wider opacity-70">
              Exchange mortal currency for mystical gemstones.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-base hover:bg-danger hover:text-white transition-all text-tx-muted"
          >
            ✕
          </button>
        </div>

        {
          // Progress Decoration
        }
        <div className="h-1 bg-panel w-full shrink-0">
          <div className="h-full bg-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.5)] w-full opacity-50"></div>
        </div>

        {
          // Gem Packs Grid
        }
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar bg-base/10">
          {GEM_PACKS.map((pack: GemPack) => (
            <button
              key={pack.id}
              onClick={() => onSelect(pack.id)}
              className="group relative flex flex-col bg-panel border border-border hover:border-accent/50 rounded-xl p-5 transition-all hover:-translate-y-1 shadow-lg hover:shadow-accent/5"
            >
              {
                // Pack Image & Amount
              }
              <div className="h-40 w-full rounded-lg bg-base/50 border border-border/50 flex flex-col items-center justify-center mb-4 relative overflow-hidden group-hover:bg-panel-hover transition-colors">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <img
                  src="./assets/ui/icon_gem.png"
                  alt="Gems"
                  className="w-16 h-16 object-contain pixelated z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform"
                />

                <div className="mt-2 font-mono font-black text-2xl text-tx-main z-10">
                  {pack.gems.toLocaleString()}
                </div>

                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-border/30"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-border/30"></div>
              </div>

              {
                // Pack Details
              }
              <h3 className="text-lg font-bold text-tx-main mb-1 uppercase tracking-tight">
                {pack.name}
              </h3>

              <p className="text-[11px] text-tx-muted mb-6 flex-1 leading-relaxed opacity-80 font-medium">
                {pack.description}
              </p>

              {
                // Price Tag
              }
              <div className="mt-auto w-full py-3 bg-panel-hover border border-accent/30 group-hover:border-accent text-accent font-black text-xl rounded-lg transition-all shadow-inner flex items-center justify-center gap-2">
                <span>{pack.price}</span>
                <span className="text-xs uppercase opacity-70">EUR</span>
              </div>
            </button>
          ))}
        </div>

        {
          // Footer Security Notice
        }
        <div className="p-4 bg-panel/80 text-center border-t border-border flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <p className="text-[10px] text-tx-muted uppercase tracking-[0.3em] font-black opacity-30">
            Secure Arcane Transaction
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
