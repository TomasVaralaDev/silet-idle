export default function EnchantingArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 05
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Enchanting
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Standard equipment can be magically enhanced beyond its base power.
          Mastering the enchanting system and managing your magical scrolls is
          critical for pushing into the most dangerous realms.
        </p>
      </header>

      {/* LAWS OF ENCHANTING - Säännöt roolipelimuodossa */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_enchanting.png"
            alt="Magic"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            The Rules of Magic
          </h3>
        </div>

        <div className="bg-panel/5 border border-border rounded-lg overflow-hidden">
          <div className="divide-y divide-border/30">
            {/* Rule 1: The 20% Boost */}
            <div className="p-6 flex gap-6 group">
              <div className="text-xs font-bold text-border group-hover:text-accent transition-colors pt-1">
                01
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-tx-main uppercase tracking-wide">
                  Power Scaling (+20%)
                </h4>
                <p className="text-xs text-tx-muted leading-relaxed">
                  Every successful enchantment adds a flat{" "}
                  <span className="text-tx-main font-bold">+20% boost</span>
                  to the item's original base stats. An item can be upgraded up
                  to a maximum of{" "}
                  <span className="text-accent font-bold">+5</span>, essentially
                  doubling its original power.
                </p>
              </div>
            </div>

            {/* Rule 2: Scaling Costs */}
            <div className="p-6 flex gap-6 group">
              <div className="text-xs font-bold text-border group-hover:text-accent transition-colors pt-1">
                02
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-tx-main uppercase tracking-wide">
                  Enchanting Costs
                </h4>
                <p className="text-xs text-tx-muted leading-relaxed">
                  The gold and material cost required to enchant an item scales
                  dynamically. High-level equipment costs significantly more to
                  enchant than beginner gear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLS & SUCCESS RATES (UUSI OSIO: T1-T4 ja prosentit) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/items/enchantingscroll/enchanting_tier4.png"
            alt="Scroll"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Scroll Tiers & Success Rates
          </h3>
        </div>

        <div className="bg-panel/10 border border-border/50 p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed mb-4">
            As your item's upgrade level increases (e.g., going from +3 to +4),
            the base chance of a successful enchantment drops drastically. To
            counter this, you must use higher-tier scrolls.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ScrollTierCard
              tier="T1"
              name="Basic Scroll"
              desc="Best for +1 to +2"
            />
            <ScrollTierCard
              tier="T2"
              name="Adept Scroll"
              desc="Best for +2 to +3"
            />
            <ScrollTierCard
              tier="T3"
              name="Mystic Scroll"
              desc="Crucial for +4"
            />
            <ScrollTierCard
              tier="T4"
              name="Divine Scroll"
              desc="Required for +5"
              isRare
            />
          </div>
        </div>
      </section>

      {/* BOSS WEAPON RESTRICTION */}
      <section className="space-y-4">
        <div className="p-5 border border-danger/30 bg-danger/5 rounded-lg flex gap-4 items-start">
          <img
            src="/assets/ui/icon_fail.png"
            alt="Alert"
            className="w-5 h-5 pixelated opacity-80 mt-0.5 shrink-0"
          />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-danger uppercase tracking-widest">
              Ancient Artifacts (Boss Drops)
            </h4>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Weapons and artifacts dropped directly by{" "}
              <span className="text-danger font-semibold">World Bosses</span>{" "}
              are already brimming with ancient magic. Because of their sheer
              raw power,{" "}
              <span className="font-bold text-tx-main">
                Boss Drops cannot be enchanted
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="p-4 border-l border-border bg-panel/10 flex items-center gap-3">
        <img
          src="/assets/ui/icon_achievements.png"
          alt="Tip"
          className="w-4 h-4 pixelated opacity-60 shrink-0"
        />
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-80 italic">
          Adventurer's Tip: Don't waste your rare T4 Divine Scrolls on beginner
          iron weapons! Save them for your highest-tier crafted gear when
          attempting that final +5 upgrade.
        </p>
      </div>
    </div>
  );
}

// Apukomponentti T1-T4 scrolleille
function ScrollTierCard({
  tier,
  name,
  desc,
  isRare = false,
}: {
  tier: string;
  name: string;
  desc: string;
  isRare?: boolean;
}) {
  return (
    <div
      className={`p-3 border rounded text-center space-y-1 ${isRare ? "border-accent/50 bg-accent/5" : "border-border/50 bg-panel/5"}`}
    >
      <span
        className={`block text-xs font-black uppercase ${isRare ? "text-accent" : "text-tx-main"}`}
      >
        {tier}
      </span>
      <span className="block text-[10px] font-bold text-tx-main uppercase tracking-tight">
        {name}
      </span>
      <span className="block text-[9px] text-tx-muted leading-tight">
        {desc}
      </span>
    </div>
  );
}
