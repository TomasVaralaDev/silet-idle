export default function EconomyArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja reilu */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 09
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Trade & Supporter Store
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          The economy relies on the exchange of goods between adventurers.
          Whether you are trading your hard-earned loot with others or choosing
          to support the game's development, understanding the markets is key to
          prosperity.
        </p>
      </header>

      {/* MARKETPLACE SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_market.png"
            alt="Market"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Player Marketplace
          </h3>
        </div>

        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed">
            The Global Marketplace allows you to buy and sell items directly
            with other players. Got extra ores? Crafting gear you don't need?
            List it for gold!
            <span className="text-tx-main font-semibold">
              {" "}
              Almost every item in the game is tradable
            </span>{" "}
            on the open market.
          </p>

          <div className="p-4 border-l-2 border-danger/50 bg-danger/5 mt-2">
            <span className="block text-xs font-bold text-danger uppercase tracking-widest mb-1">
              Restriction: Boss Artifacts
            </span>
            <p className="text-[10px] text-tx-muted leading-relaxed">
              Currently, incredibly powerful{" "}
              <strong className="text-tx-main">Boss Weapons</strong> cannot be
              bought or sold. You must defeat the World Bosses yourself to wield
              their legendary power!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex gap-3 items-start p-3 border border-border/30 rounded bg-panel/10">
              <img
                src="/assets/ui/icon_tax_placeholder.png"
                alt="Tax"
                className="w-4 h-4 pixelated mt-0.5 opacity-60"
              />
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-tx-main uppercase tracking-wide">
                  Transaction Tax
                </span>
                <p className="text-[10px] text-tx-muted leading-relaxed">
                  A small standard fee is applied to successful sales to keep
                  the global economy balanced.
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 border border-border/30 rounded bg-panel/10">
              <img
                src="/assets/ui/icon_list_placeholder.png"
                alt="List"
                className="w-4 h-4 pixelated mt-0.5 opacity-60"
              />
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-tx-main uppercase tracking-wide">
                  Listing Limits
                </span>
                <p className="text-[10px] text-tx-muted leading-relaxed">
                  You have a maximum number of active listings you can host on
                  the market simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM STORE - Reilu ja pelaajaystävällinen teksti */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_gem.png"
            alt="Premium"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Premium Supporter Store
          </h3>
        </div>

        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed">
            The Premium Store exists to help cover server costs and ongoing
            development.
            <strong className="text-tx-main">
              {" "}
              Buying items is completely optional and never required to play or
              enjoy the game.{" "}
            </strong>
            If you choose to support us with real currency, we appreciate it
            immensely! Purchases here are designed to speed up your journey and
            provide quality-of-life upgrades.
          </p>

          <div className="p-4 border border-border/50 rounded-lg bg-panel/5 mt-4">
            <ul className="space-y-3">
              {[
                {
                  label: "Starter Bundles",
                  desc: "A solid boost of starting materials to help you hit the ground running.",
                },
                {
                  label: "Offline Time Expansion",
                  desc: "Permanently increases the maximum amount of time your character works while you are away.",
                },
                {
                  label: "Expedition Slots",
                  desc: "Unlocks extra slots so you can send out more scouts simultaneously for massive loot.",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex flex-col md:flex-row md:justify-between md:items-center text-[11px] border-b border-border/20 pb-3 last:border-0 last:pb-0 gap-1"
                >
                  <span className="text-tx-main font-semibold uppercase tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-tx-muted italic md:text-right">
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="flex gap-4 items-start p-4 border border-border/50 bg-panel/5 rounded-lg">
        <img
          src="/assets/ui/icon_achievements.png"
          alt="Tip"
          className="w-4 h-4 pixelated opacity-60 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-80">
            Market Advisory: Always double-check current market prices before
            listing large quantities of raw materials. Supply and demand will
            shift as more players reach higher Worlds!
          </p>
        </div>
      </div>
    </div>
  );
}
