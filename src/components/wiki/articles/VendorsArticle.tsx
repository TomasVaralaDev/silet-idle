export default function VendorsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          World Vendors
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          Regional Traders are the primary source for essential augmentation
          materials. These vendors require both{" "}
          <span className="text-tx-main font-bold">Coins</span> and{" "}
          <span className="text-tx-main font-bold">World Loot</span> extracted
          from the local wildlife.
        </p>
      </section>

      {/* SECTION: TRADING MECHANICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-panel border border-border rounded-xl">
          <h4 className="text-warning font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
            <img
              src="/assets/ui/coins.png"
              className="w-4 h-4 pixelated"
              alt=""
            />
            Exchange Protocol
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Purchasing items from World Vendors requires a combination of Gold
            and materials (Basic, Rare, or Exotic drops) from that specific
            world.
          </p>
        </div>
        <div className="p-5 bg-panel border border-border rounded-xl">
          <h4 className="text-warning font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
            <span>⏳</span>
            Daily Supply Limits
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Vendors have a{" "}
            <span className="text-danger font-bold">Strict Daily Limit</span> on
            their stock. This limit resets once every 24 hours.
          </p>
        </div>
      </div>

      {/* SECTION: ENCHANTMENT SCROLLS */}
      <section className="bg-panel/30 border border-border/50 p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Enchantment Scroll Tiers (T1 - T4)
        </h3>
        <p className="text-xs text-tx-muted mb-4 leading-relaxed">
          Regional Merchants only stock scrolls ranging from{" "}
          <span className="text-tx-main font-bold">Tier 1 to Tier 4</span>. Each
          tier provides a different success probability when used to augment
          your equipment.
        </p>

        <div className="bg-app-base/40 p-4 border border-border/30 rounded-xl mb-4">
          <h4 className="text-[10px] font-black uppercase text-tx-main mb-2">
            Supply Scarcity Logic
          </h4>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            As the Scroll Tier increases, the{" "}
            <span className="text-warning font-bold">
              Daily Cap decreases significantly
            </span>
            . While Tier 1 scrolls are abundant, Tier 4 scrolls are highly
            limited and should be purchased whenever available.
          </p>
        </div>

        <div className="space-y-2">
          <VendorTierRow
            world="World 1 (Greenvale)"
            item="Tier 1 Scroll"
            cost="Coins + World 1 Loot"
            cap="High Stock"
          />
          <VendorTierRow
            world="World 2 (Stonefall)"
            item="Tier 2 Scroll"
            cost="Coins + World 2 Loot"
            cap="Medium Stock"
          />
          <VendorTierRow
            world="World 3 (Ashridge)"
            item="Tier 3 Scroll"
            cost="Coins + World 3 Loot"
            cap="Low Stock"
          />
          <VendorTierRow
            world="World 4 (Frostreach)"
            item="Tier 4 Scroll"
            cost="Coins + World 4 Loot"
            cap="Minimal Stock"
          />
        </div>

        <p className="text-[10px] text-tx-muted mt-4 italic">
          *Note: No vendor currently stocks scrolls above Tier 4.
        </p>
      </section>

      {/* PRO TIP */}
      <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
        <p className="text-xs text-tx-muted">
          <span className="text-warning font-black uppercase mr-2">
            Pro Tip:
          </span>
          Do not hoard your world loot. Because of the daily limits, missing a
          day of purchases can delay your final{" "}
          <span className="text-tx-main font-bold">Enchantment +5</span>{" "}
          upgrades for weeks.
        </p>
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
  return (
    <div className="flex justify-between items-center p-3 bg-app-base/50 border-b border-border/30 last:border-0">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-tx-main">
          {world}
        </span>
        <span className="text-[9px] text-tx-muted uppercase font-mono">
          {cost}
        </span>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-bold text-accent">{item}</div>
        <div
          className={`text-[9px] font-bold uppercase ${cap === "Minimal Stock" ? "text-danger" : "text-tx-muted opacity-60"}`}
        >
          {cap}
        </div>
      </div>
    </div>
  );
}
