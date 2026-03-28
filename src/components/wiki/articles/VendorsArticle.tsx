export default function VendorsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 08
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          World Vendors
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Each World features its own specialized Vendor. These local merchants
          are your primary source for crucial magical supplies, provided you
          have the right combination of currencies to trade.
        </p>
      </header>

      {/* HOW TO TRADE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-panel/5 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/ui/icon_coin_placeholder.png"
              alt="Trade"
              className="w-5 h-5 pixelated opacity-80"
            />
            <h4 className="text-xs font-bold text-tx-main uppercase tracking-wide">
              The Merchant's Exchange
            </h4>
          </div>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            World Vendors don't just accept standard gold. Purchasing items
            requires a combination of{" "}
            <span className="text-warning font-semibold">Coins</span>, localized{" "}
            <span className="text-tx-main font-semibold">World Currency</span>,
            and specific{" "}
            <span className="text-tx-main font-semibold">Monster Drops</span>{" "}
            from that region.
          </p>
        </div>

        <div className="p-6 bg-panel/5 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/ui/icon_clock_placeholder.png"
              alt="Time"
              className="w-5 h-5 pixelated opacity-80"
            />
            <h4 className="text-xs font-bold text-tx-main uppercase tracking-wide">
              Daily Restocks (00:00 UTC)
            </h4>
          </div>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Vendors have a{" "}
            <span className="text-danger font-bold">
              strict daily purchase limit
            </span>{" "}
            on their most valuable goods. Their inventory is completely
            restocked exactly at Midnight (00:00 UTC) every day.
          </p>
        </div>
      </section>

      {/* ENCHANTING SCROLLS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/items/scroll_placeholder.png"
            alt="Scrolls"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Enchanting Scrolls (T1 - T4)
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-tx-muted leading-relaxed">
            Outside of buying from other players on the Marketplace, World
            Vendors are the
            <strong className="text-tx-main font-semibold"> only way</strong> to
            acquire Enchanting Scrolls. The higher the World tier, the better
            the scrolls they sell.
          </p>

          <div className="border border-border/50 rounded-lg overflow-hidden bg-panel/5">
            <div className="divide-y divide-border/20">
              <VendorTierRow
                world="World 1"
                item="Tier 1 Scrolls"
                cost="Coins + W1 Currency + W1 Loot"
                cap="High Stock Limit"
              />
              <VendorTierRow
                world="World 2"
                item="Tier 2 Scrolls"
                cost="Coins + W2 Currency + W2 Loot"
                cap="Medium Stock Limit"
              />
              <VendorTierRow
                world="World 3"
                item="Tier 3 Scrolls"
                cost="Coins + W3 Currency + W3 Loot"
                cap="Low Stock Limit"
              />
              <VendorTierRow
                world="World 4+"
                item="Tier 4 Scrolls"
                cost="Coins + W4 Currency + W4 Loot"
                cap="Strict Daily Limit"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ADVENTURER'S TIP - Tärkeä vinkki stackaamisesta */}
      <div className="p-4 border-l border-border bg-panel/10 flex gap-4 items-start">
        <img
          src="/assets/ui/icon_tip_placeholder.png"
          alt="Tip"
          className="w-5 h-5 pixelated opacity-80 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Adventurer's Tip: Start Stacking!
          </h4>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Do not wait until you need to enchant your gear to start buying
            scrolls! Because of the daily limits, you should try to buy your
            maximum allowance of T3 and T4 scrolls every single day. Stacking
            them in your inventory early prevents massive progression delays
            later on.
          </p>
        </div>
      </div>
    </div>
  );
}

// Apukomponentti listaukseen
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
  const isStrict = cap.includes("Strict");

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 hover:bg-panel/10 transition-colors gap-2">
      <div className="space-y-1">
        <span className="block text-[10px] font-bold uppercase text-tx-main">
          {world} Vendor
        </span>
        <span className="block text-[9px] text-tx-muted uppercase font-mono tracking-tighter">
          Cost: {cost}
        </span>
      </div>
      <div className="md:text-right space-y-1">
        <div className="text-[10px] font-bold text-accent uppercase">
          {item}
        </div>
        <div
          className={`text-[9px] font-bold uppercase tracking-tighter ${isStrict ? "text-danger" : "text-tx-muted opacity-60"}`}
        >
          {cap}
        </div>
      </div>
    </div>
  );
}
