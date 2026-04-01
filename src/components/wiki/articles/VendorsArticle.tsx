export default function VendorsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {
        // HEADER
      }
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
          are your primary source for crucial supplies, provided you have the
          right combination of currencies to trade.
        </p>
      </header>

      {
        // HOW TO TRADE
      }
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-panel/5 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="./assets/lootpoolszones/eternalnexus_rare.png"
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
            <span className="text-warning font-semibold">Coins</span> and
            localized{" "}
            <span className="text-tx-main font-semibold">World Currency</span>{" "}
            (which drops directly from monsters in that region).
          </p>
        </div>

        <div className="p-6 bg-panel/5 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2">
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

      {
        // VENDOR INVENTORY
      }
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
          Vendor Inventory
        </h3>

        <div className="space-y-4">
          {
            // Scrolls
          }
          <div className="bg-panel/5 border border-border p-5 rounded-lg flex gap-4 items-start">
            <img
              src="./assets/items/enchantingscroll/enchanting_tier3.png"
              alt="Scroll"
              className="w-6 h-6 pixelated mt-1 shrink-0"
            />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Enchanting Scrolls
              </h4>
              <p className="text-[11px] text-tx-muted leading-relaxed">
                Outside of the player Marketplace, World Vendors are the{" "}
                <strong className="text-tx-main">only way</strong> to acquire
                Enchanting Scrolls (Tiers 1-4). Different scrolls are sold
                across various worlds.
              </p>
            </div>
          </div>

          {
            // Potions
          }
          <div className="bg-panel/5 border border-border p-5 rounded-lg flex gap-4 items-start">
            <img
              src="./assets/items/alchemy/potion_tier5.png"
              alt="Potion"
              className="w-6 h-6 pixelated mt-1 shrink-0"
            />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Combat Potions
              </h4>
              <p className="text-[11px] text-tx-muted leading-relaxed">
                If you prefer to focus entirely on combat and skip leveling your{" "}
                <span className="text-tx-main font-semibold">Forager</span> and{" "}
                <span className="text-tx-main font-semibold">Alchemist</span>{" "}
                skills, you can buy high-quality potions directly from the
                vendors to keep you alive.
              </p>
            </div>
          </div>

          {
            // Mystery Bags
          }
          <div className="bg-panel/5 border border-border p-5 rounded-lg flex gap-4 items-start">
            <img
              src="./assets/items/pouch_legendary.png"
              alt="Mystery Bag"
              className="w-6 h-6 pixelated mt-1 shrink-0"
            />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-accent uppercase tracking-wide">
                Mystery Bags
              </h4>
              <p className="text-[11px] text-tx-muted leading-relaxed">
                Vendors occasionally stock mysterious loot bags. Once purchased,
                these can be opened directly from your inventory for a chance at
                various surprise rewards and materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
        // ADVENTURER'S TIP
      }
      <div className="p-4 border-l border-border bg-panel/10 flex gap-4 items-start">
        <img
          src="./assets/ui/icon_achievements.png"
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
            maximum allowance of scrolls every single day. Stacking them in your
            inventory early prevents massive progression delays later on.
          </p>
        </div>
      </div>
    </div>
  );
}
