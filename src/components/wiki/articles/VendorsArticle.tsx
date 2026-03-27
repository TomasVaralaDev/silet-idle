import {
  ShoppingBag,
  ArrowLeftRight,
  AlertCircle,
  TrendingDown,
} from "lucide-react";

export default function VendorsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Logistics Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.7
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Trade & Acquisition Nodes
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Regional Traders serve as the primary distribution points for
          essential augmentation catalysts. Procurement requires a combination
          of Credits (Coins) and localized resources extracted from the
          surrounding environment.
        </p>
      </header>

      {/* PROCUREMENT PROTOCOLS - Clean Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-panel/5 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={16} className="text-tx-muted" />
            <h4 className="text-xs font-bold text-tx-main uppercase tracking-wide">
              Exchange Protocol
            </h4>
          </div>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Acquisition from World Vendors necessitates a multi-currency
            exchange. Travelers must provide both Credits and specific regional
            materials (Basic, Rare, or Exotic).
          </p>
        </div>

        <div className="p-6 bg-panel/5 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-tx-muted" />
            <h4 className="text-xs font-bold text-tx-main uppercase tracking-wide">
              Daily Supply Quotas
            </h4>
          </div>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            All acquisition nodes operate under{" "}
            <span className="text-tx-main font-bold">Strict Daily Quotas</span>.
            Inventory levels are replenished exactly once every 24-hour cycle.
          </p>
        </div>
      </section>

      {/* CATALYST AVAILABILITY - Structured Data */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Augmentation Catalyst Tiers
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-tx-muted leading-relaxed">
            Regional merchants facilitate the distribution of Augmentation
            Scrolls (T1–T4). Higher-tier catalysts possess significantly reduced
            stock levels due to supply chain scarcity.
          </p>

          <div className="border border-border/50 rounded-lg overflow-hidden bg-panel/5">
            <div className="p-4 border-b border-border/20 bg-panel/10">
              <h4 className="text-[10px] font-bold uppercase text-tx-main">
                Supply Logic Registry
              </h4>
              <p className="text-[10px] text-tx-muted mt-1">
                As catalyst potency increases, availability decreases
                proportionally.
              </p>
            </div>

            <div className="divide-y divide-border/20">
              <VendorTierRow
                world="Regional Zone 01"
                item="Tier 1 Catalyst"
                cost="Credits + R1 Loot"
                cap="Standard Stock"
              />
              <VendorTierRow
                world="Regional Zone 02"
                item="Tier 2 Catalyst"
                cost="Credits + R2 Loot"
                cap="Regulated Stock"
              />
              <VendorTierRow
                world="Regional Zone 03"
                item="Tier 3 Catalyst"
                cost="Credits + R3 Loot"
                cap="Limited Stock"
              />
              <VendorTierRow
                world="Regional Zone 04"
                item="Tier 4 Catalyst"
                cost="Credits + R4 Loot"
                cap="Critical Scarcity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LOGISTICS ADVISORY */}
      <div className="p-4 border border-border/50 rounded-lg bg-panel/5 flex gap-4 items-start">
        <AlertCircle className="text-tx-muted shrink-0" size={18} />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Logistics Advisory
          </h4>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Do not accumulate regional materials excessively. Due to daily
            procurement caps, failure to secure high-tier catalysts daily will
            result in significant long-term delays in achieving{" "}
            <span className="text-tx-main font-semibold">
              Max Augmentation (+5)
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function VendorTierRow({
  world,
  item,
  cost,
  cap,
}: {
  world: string;
  item: string;
  cost: string;
  cap: string;
}) {
  const isCritical = cap === "Critical Scarcity";

  return (
    <div className="flex justify-between items-center p-4 hover:bg-panel/10 transition-colors">
      <div className="space-y-1">
        <span className="block text-[10px] font-bold uppercase text-tx-main">
          {world}
        </span>
        <span className="block text-[9px] text-tx-muted uppercase font-mono tracking-tighter">
          {cost}
        </span>
      </div>
      <div className="text-right space-y-1">
        <div className="text-[10px] font-bold text-tx-main uppercase">
          {item}
        </div>
        <div
          className={`text-[9px] font-bold uppercase tracking-tighter ${isCritical ? "text-accent" : "text-tx-muted opacity-60"}`}
        >
          {cap}
        </div>
      </div>
    </div>
  );
}
