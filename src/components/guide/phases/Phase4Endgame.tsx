import {
  ArrowLeft,
  Crown,
  Trophy,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function Phase4Endgame({ onBack }: Props) {
  return (
    <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 text-left pb-32">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-tx-muted hover:text-danger transition-colors text-[10px] font-black uppercase tracking-widest group bg-panel border border-border px-4 py-2 rounded-lg"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Roadmap
      </button>

      <header className="border-b-2 border-danger/30 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-danger font-mono text-sm tracking-widest">
            PHASE IV
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          Master of Time
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4">
          You have reached the pinnacle of the fractured worlds. From here on
          out, it is about min-maxing your setup, dominating the economy, and
          carving your name into history.
        </p>
      </header>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-danger rounded-xl flex items-center justify-center text-danger shadow-[0_0_10px_rgb(var(--color-danger)/0.2)]">
            <Crown size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-danger uppercase tracking-widest">
              Step 01
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Absolute Power
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            By now, you should be hunting for <strong>Legendary</strong>{" "}
            equipment. Push the Forge to its absolute limit by enchanting your
            best gear to +5.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Equip a full set of Level +5 Armor and Weapons.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-danger rounded-xl flex items-center justify-center text-danger shadow-[0_0_10px_rgb(var(--color-danger)/0.2)]">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-danger uppercase tracking-widest">
              Step 02
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Completionist
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Your journey is documented in the <strong>Milestones</strong> tab.
            Hunting down the final, elusive achievements is the mark of a true
            master.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Unlock 100% of all in-game Achievements.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-danger rounded-xl flex items-center justify-center text-danger shadow-[0_0_10px_rgb(var(--color-danger)/0.2)]">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-danger uppercase tracking-widest">
              Step 03
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Market Domination
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Amass unimaginable wealth by trading rare boss drops and highly
            enchanted gear on the <strong>Marketplace</strong>. Watch your name
            rise on the <strong>Leaderboards</strong>.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Reach the Top 10 on the Global Leaderboards.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
