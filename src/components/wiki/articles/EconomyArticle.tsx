import { BarChart3, ShoppingCart, Gem, Percent } from "lucide-react";

export default function EconomyArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Fiscal Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.8
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Fiscal Protocols
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          The Nexus economy is a multi-layered system designed to facilitate the
          flow of resources between Travelers. Mastering the exchange of goods
          is essential for scaling your operations and securing high-tier
          catalysts.
        </p>
      </header>

      {/* MARKETPLACE SECTION - Clean and structured */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Peer-to-Peer Marketplace
          </h3>
        </div>

        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-xs text-tx-muted leading-relaxed">
            The Global Marketplace is the primary hub for player-to-player
            logistics. Travelers can list crafted armaments, rare biological
            samples, or surplus raw materials for public acquisition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex gap-3 items-start p-3 border border-border/30 rounded bg-panel/10">
              <Percent size={14} className="text-tx-muted mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-tx-main uppercase tracking-wide">
                  Transaction Tax
                </span>
                <p className="text-[10px] text-tx-muted leading-relaxed">
                  A standardized fee is applied to all successful listings to
                  maintain fiscal stability.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 border border-border/30 rounded bg-panel/10">
              <ShoppingCart size={14} className="text-tx-muted mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-tx-main uppercase tracking-wide">
                  Listing Limits
                </span>
                <p className="text-[10px] text-tx-muted leading-relaxed">
                  Simultaneous active listings are capped based on your current
                  terminal rank.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM EXCHANGE - Clinical style */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Gem className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Premium Asset Exchange
          </h3>
        </div>

        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-xs text-tx-muted leading-relaxed">
            For rapid operational expansion, the Exchange facilitates the
            acquisition of utility assets using{" "}
            <span className="text-tx-main font-bold italic">
              Crystalline Gems
            </span>
            . These assets are focused on logistical efficiency rather than
            direct combat stats.
          </p>

          <div className="p-4 border border-border/50 rounded-lg bg-panel/5">
            <ul className="space-y-3">
              {[
                {
                  label: "XP Chronometers",
                  desc: "Accelerated skill data acquisition.",
                },
                {
                  label: "Storage Expansion",
                  desc: "Permanent inventory capacity increase.",
                },
                {
                  label: "Utility Bundles",
                  desc: "Essential starter kits for new Travelers.",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-[11px] border-b border-border/20 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-tx-main font-semibold uppercase">
                    {item.label}
                  </span>
                  <span className="text-tx-muted italic">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="p-4 border-l border-border bg-panel/10">
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-70 italic">
          Market Advisory: Always monitor regional material prices before
          listing bulk quantities. Supply and demand fluctuate based on the
          discovery of new realm zones.
        </p>
      </div>
    </div>
  );
}
