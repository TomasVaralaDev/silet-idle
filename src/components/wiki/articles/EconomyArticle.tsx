export default function EconomyArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          Global Economy
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          Trade is the lifeblood of a restorer. You have multiple avenues to
          turn your hard work into profit.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-tx-main uppercase tracking-widest border-l-4 border-cyan-500 pl-4">
          The Marketplace
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed">
          Player-to-player trading is facilitated through the Global
          Marketplace. You can list your crafted goods, rare monster drops, or
          excess materials for other players to buy. A modest tax is applied to
          all listings.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-tx-main uppercase tracking-widest border-l-4 border-warning pl-4">
          Premium Shop
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed">
          For those seeking to accelerate their journey or acquire exclusive
          cosmetics, the Premium Shop accepts{" "}
          <span className="text-cyan-400 font-bold">Gems</span>. Here you can
          find powerful XP Tomes, expanded storage capabilities, and starter
          bundles.
        </p>
      </section>
    </div>
  );
}
