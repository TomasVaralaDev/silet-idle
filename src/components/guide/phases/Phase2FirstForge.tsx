import { ArrowLeft, Clock, Zap, Target, CheckCircle2 } from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function Phase2FirstForge({ onBack }: Props) {
  return (
    <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 text-left pb-32">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-tx-muted hover:text-warning transition-colors text-[10px] font-black uppercase tracking-widest group bg-panel border border-border px-4 py-2 rounded-lg"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Roadmap
      </button>

      <header className="border-b-2 border-warning/30 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-warning font-mono text-sm tracking-widest">
            PHASE II
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The First Forge
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4">
          You've survived the slimes, but Zone 10 holds the World 1 Boss. Basic
          gear won't cut it anymore. It's time to unlock the power of Enchanting
          and Automation.
        </p>
      </header>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-warning rounded-xl flex items-center justify-center text-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.2)]">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-warning uppercase tracking-widest">
              Step 01
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Queue Mastery
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            You cannot play actively all day. Start utilizing the{" "}
            <strong>Action Queue</strong> before closing the game. Queue up
            resource gathering to ensure your character continues working
            offline.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Have at least 2 actions queued up before closing the app for
              the night.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-warning rounded-xl flex items-center justify-center text-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.2)]">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-warning uppercase tracking-widest">
              Step 02
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Magical Augmentation
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Gems and Runes drop occasionally from combat. Take these to the{" "}
            <strong>Enchanting</strong> tab to upgrade your weapon. Each
            successful enchant adds +20% to its base stats.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Successfully enchant your primary weapon to +2 or higher.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-warning rounded-xl flex items-center justify-center text-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.2)]">
            <Target size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-warning uppercase tracking-widest">
              Step 03
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              The First Boss
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Zone 10 is the final challenge of the first world. The enemy here
            hits incredibly hard. Ensure you have high-healing food equipped and
            your HP is full before engaging.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Defeat the Zone 10 Boss to obtain the Boss Key and unlock
              World 2.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
