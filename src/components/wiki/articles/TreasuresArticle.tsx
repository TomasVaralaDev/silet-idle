import { Database, Percent, Star, ShieldCheck } from "lucide-react";

export default function TreasuresArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Resource Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.9
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Yield & Rarity Classifications
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Every hostile entity within the Nexus holds a specific data-set of
          recoverable assets. The frequency of these yields is determined by
          standardized rarity coefficients.
        </p>
      </header>

      {/* RARITY TABLE - Clean and structured */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Database className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Asset Recovery Rates
          </h3>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden bg-panel/5">
          <div className="divide-y divide-border/20">
            <LootRow
              label="Common Materials"
              rate="100% (Guaranteed)"
              desc="Standard raw resources for basic crafting."
            />
            <LootRow
              label="Rare Catalysts"
              rate="~10.00%"
              desc="Specialized gems required for mid-tier augmentation."
            />
            <LootRow
              label="Artifact Remnants"
              rate="10.00% (Boss Units)"
              desc="Unique components from high-value targets."
            />
            <LootRow
              label="Exotic Blueprints"
              rate="~1.00%"
              desc="Highly volatile data. Minimal recovery probability."
              isCritical
            />
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECIFICATIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-panel/5 border border-border rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Percent size={14} className="text-tx-muted" />
            <span className="text-[10px] font-bold text-tx-main uppercase">
              Drop Calculation
            </span>
          </div>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Yields are calculated per combat cycle. Luck modifiers from
            specialized jewelry can influence the frequency of Rare and Exotic
            categories.
          </p>
        </div>
        <div className="p-5 bg-panel/5 border border-border rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-tx-muted" />
            <span className="text-[10px] font-bold text-tx-main uppercase">
              Auto-Loot Protocol
            </span>
          </div>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            All recovered assets are automatically transferred to the Traveler's
            inventory. Ensure sufficient storage capacity before long-term
            engagement.
          </p>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="p-4 border-l border-border bg-panel/10 flex items-start gap-4">
        <Star className="text-tx-muted shrink-0" size={16} />
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-70 italic">
          Field Advisory: Focus your deployment on zones where the common
          material yield aligns with your current forging requirements. Rare
          assets should be viewed as supplementary to your primary resource
          loop.
        </p>
      </div>
    </div>
  );
}

function LootRow({
  label,
  rate,
  desc,
  isCritical = false,
}: {
  label: string;
  rate: string;
  desc: string;
  isCritical?: boolean;
}) {
  return (
    <div className="p-4 hover:bg-panel/10 transition-colors flex justify-between items-start gap-4">
      <div className="space-y-1">
        <span className="block text-xs font-bold text-tx-main uppercase tracking-wide">
          {label}
        </span>
        <p className="text-[10px] text-tx-muted leading-relaxed max-w-[250px]">
          {desc}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-tighter ${isCritical ? "text-accent" : "text-tx-muted"}`}
        >
          {rate}
        </span>
      </div>
    </div>
  );
}
