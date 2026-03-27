import { Sparkles, ScrollText, ShieldAlert } from "lucide-react";

export default function EnchantingArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Technical Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.3
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Enchanting
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Standard equipment can be enhanced beyond its base specifications
          through the infusion of magical catalysts. Understanding the stability
          limits of the Nexus Forge is critical to maximizing combat efficiency.
        </p>
      </header>

      {/* LAWS OF AUGMENTATION - Clean, structured data */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ScrollText className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Operational Constraints
          </h3>
        </div>

        <div className="bg-panel/5 border border-border rounded-lg overflow-hidden">
          <div className="divide-y divide-border/30">
            {/* Rule 1 */}
            <div className="p-6 flex gap-6 group">
              <div className="text-xs font-bold text-border group-hover:text-accent transition-colors pt-1">
                01
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-tx-main uppercase tracking-wide">
                  Statistical Scaling
                </h4>
                <p className="text-xs text-tx-muted leading-relaxed">
                  Every successful augmentation cycle increases the item's base
                  attributes by{" "}
                  <span className="text-tx-main font-bold">+20%</span>. This
                  bonus is cumulative based on the original base values.
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="p-6 flex gap-6 group">
              <div className="text-xs font-bold text-border group-hover:text-accent transition-colors pt-1">
                02
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-tx-main uppercase tracking-wide">
                  Stability Threshold
                </h4>
                <p className="text-xs text-tx-muted leading-relaxed">
                  Equipment can be stabilized up to a maximum of
                  <span className="text-tx-main font-bold"> Level +5</span>.
                  Attempting to exceed this threshold is currently restricted by
                  the Forge safety protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INCOMPATIBILITY NOTICE - Mieto mutta selkeä varoitus */}
      <section className="space-y-4">
        <div className="p-5 border border-border/50 bg-panel/5 rounded-lg flex gap-4 items-start">
          <ShieldAlert className="text-tx-muted shrink-0" size={18} />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
              Compatibility Constraints
            </h4>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Ancient artifacts and specialized{" "}
              <span className="text-tx-main font-semibold">Boss Drops</span> are
              ineligible for augmentation. These items possess sealed magical
              properties that cannot be altered by standard Forge operations.
            </p>
          </div>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="p-4 border-l border-border bg-panel/10 flex items-center gap-3">
        <Sparkles className="text-tx-muted shrink-0" size={16} />
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-70">
          Tip: Prioritize augmenting your primary weapon before armor to
          maximize your resource-to-damage ratio during early realm progression.
        </p>
      </div>
    </div>
  );
}
