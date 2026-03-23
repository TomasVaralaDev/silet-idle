import {
  ArrowLeft,
  ShoppingBag,
  Beaker,
  Tent,
  CheckCircle2,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function Phase3WorldWalker({ onBack }: Props) {
  return (
    <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 text-left pb-32">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-tx-muted hover:text-accent transition-colors text-[10px] font-black uppercase tracking-widest group bg-panel border border-border px-4 py-2 rounded-lg"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Roadmap
      </button>

      <header className="border-b-2 border-accent/30 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-accent font-mono text-sm tracking-widest">
            PHASE III
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The World Walker
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4">
          The worlds are opening up to you. Resources are plentiful, but enemies
          deal devastating damage. You must start balancing your economy and
          exploring side-content.
        </p>
      </header>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-accent rounded-xl flex items-center justify-center text-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.2)]">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-accent uppercase tracking-widest">
              Step 01
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              World Trade
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Every world has unique vendors. Visit the{" "}
            <strong>World Vendors</strong> tab to trade your excess gathered
            materials and coins for powerful upgrades you cannot craft yourself.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Purchase at least one unique equipment piece from a World
              Vendor.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-accent rounded-xl flex items-center justify-center text-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.2)]">
            <Beaker size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-accent uppercase tracking-widest">
              Step 02
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Advanced Healing
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Basic food is no longer enough to survive World 2 and beyond. Start
            leveling up <strong>Alchemy</strong> to brew potions that restore
            massive amounts of HP in a single sip.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Brew and equip a stack of Tier 3 (Lesser) Potions.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-panel border border-border rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4 border-b border-border/50 pb-4">
          <div className="w-12 h-12 bg-app-base border-2 border-accent rounded-xl flex items-center justify-center text-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.2)]">
            <Tent size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-accent uppercase tracking-widest">
              Step 03
            </div>
            <h3 className="text-xl font-bold text-tx-main uppercase tracking-wider">
              Delegation
            </h3>
          </div>
        </div>
        <div className="space-y-4 text-sm text-tx-muted leading-relaxed">
          <p>
            Why do all the work yourself? Send followers on{" "}
            <strong>Expeditions</strong> (Scavenging) to gather passive loot
            from regions you've already conquered while you focus on fighting.
          </p>
          <div className="bg-panel-hover p-4 rounded-lg border border-border flex gap-3 items-start">
            <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
            <span className="text-xs text-tx-main">
              Goal: Keep your Expedition slots constantly active.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
