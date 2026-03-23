import { ArrowLeft, Pickaxe, Hammer, Swords, CheckCircle2 } from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function Phase1Awakening({ onBack }: Props) {
  return (
    <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 text-left pb-32">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-tx-muted hover:text-success transition-colors text-[10px] font-black uppercase tracking-widest group bg-panel border border-border px-4 py-2 rounded-lg"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Roadmap
      </button>

      <header className="border-b-2 border-success/30 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-success font-mono text-sm tracking-widest">
            PHASE I
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The Awakening
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4">
          You have arrived in World 1 with nothing. To survive, you must
          immediately begin building an economy and equipping yourself for the
          battles ahead. Do not rush into combat bare-handed.
        </p>
      </header>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-success rounded-xl flex items-center justify-center text-success shadow-[0_0_10px_rgb(var(--color-success)/0.2)]">
            <Pickaxe size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-success uppercase tracking-widest">
              Step 01
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Gathering Basics
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Start by navigating to the <strong>Woodcutting</strong> and{" "}
            <strong>Mining</strong> tabs. Spend your first few hours strictly
            accumulating basic resources like Pine Logs and Copper Ore.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Reach Level 10 in both Mining and Woodcutting before
              attempting to craft gear.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-success rounded-xl flex items-center justify-center text-success shadow-[0_0_10px_rgb(var(--color-success)/0.2)]">
            <Hammer size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-success uppercase tracking-widest">
              Step 02
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              The First Armor
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Take your raw ores to the <strong>Smithing</strong> tab. Smelt them
            into ingots, and then forge a full set of Copper Armor (Head, Body,
            Legs) and a Copper Sword.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Equip a weapon and at least two pieces of armor before
              engaging enemies.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-success rounded-xl flex items-center justify-center text-success shadow-[0_0_10px_rgb(var(--color-success)/0.2)]">
            <Swords size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-success uppercase tracking-widest">
              Step 03
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Testing the Waters
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Navigate to the <strong>Combat (Maps)</strong> tab. Start with Zone
            1. Your character will automatically fight. Watch your HP carefully!
            If you drop too low, hit the Retreat button.
          </p>
          <p className="text-xs text-warning bg-warning/10 p-3 rounded border border-warning/20">
            Tip: Foraging provides food. Keep your Auto-Eat threshold at 60% to
            prevent accidental deaths!
          </p>
        </div>
      </section>
    </div>
  );
}
