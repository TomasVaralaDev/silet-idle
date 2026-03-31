export default function ExpeditionsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 06
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Expeditions & Scouting
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          A wise adventurer doesn't work alone. By deploying scouts to
          previously explored worlds, you can continuously gather vital
          resources, rare keys, and mystical runes while you focus on combat or
          crafting.
        </p>
      </header>

      {/* DEPLOYMENT MECHANICS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="./assets/ui/icon_scope.png"
            alt="Scope"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Deploying Scouts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <span className="text-xs font-bold text-tx-main uppercase tracking-wide flex items-center gap-2">
              Expedition Duration
            </span>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              You can send scouts on journeys ranging from a quick{" "}
              <span className="text-tx-main font-semibold">10 minutes</span> up
              to a grueling{" "}
              <span className="text-tx-main font-semibold">12 hours</span>.
              Longer trips yield vastly more resources.
            </p>
          </div>

          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <span className="text-xs font-bold text-tx-main uppercase tracking-wide flex items-center gap-2">
              Scout Capacity
            </span>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Every adventurer begins with{" "}
              <span className="text-tx-main font-semibold">
                1 free scouting slot
              </span>
              . You may purchase new slots or complete achievements.
            </p>
          </div>
        </div>
      </section>

      {/* REGIONAL LOOT (Keys & Currency) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="./assets/ui/icon_reward.png"
            alt="Loot"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Regional Spoils
          </h3>
        </div>

        <div className="bg-panel/10 border border-border/50 p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed mb-4">
            Scouts can only be sent to Worlds you have already unlocked. Upon
            returning, they bring back a massive assortment of loot specific to
            that region.
          </p>

          <ul className="space-y-4">
            <li className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-[11px] border-b border-border/20 pb-4">
              <div className="flex items-center gap-2">
                <img
                  src="./assets/items/bosskey/bosskey_w6.png"
                  className="w-4 h-4 pixelated"
                  alt="Key"
                />
                <span className="text-tx-main font-bold uppercase tracking-wider">
                  Boss Keys & Materials
                </span>
              </div>
              <div className="md:text-right max-w-sm">
                <p className="text-tx-muted leading-relaxed">
                  Expeditions are the absolute{" "}
                  <span className="text-tx-main font-semibold">
                    best method
                  </span>{" "}
                  for farming the Boss Keys required to progress, as well as
                  general monster loot from that world.
                </p>
              </div>
            </li>

            <li className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <img
                  src="./assets/lootpoolszones/frostreach_basic.png"
                  className="w-4 h-4 pixelated"
                  alt="Currency"
                />
                <span className="text-tx-main font-bold uppercase tracking-wider">
                  World Currency
                </span>
              </div>
              <div className="md:text-right max-w-sm">
                <p className="text-tx-muted leading-relaxed">
                  Scouts gather large amounts of localized World Currency, which
                  is heavily required for purchasing essential upgrades from the
                  World Store.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ANCIENT RUNES (TÄRKEÄ ERIKOISUUS) */}
      <section className="space-y-4">
        <div className="p-5 border border-accent/30 bg-accent/5 rounded-lg flex gap-4 items-start">
          <img
            src="./assets/items/runes/rune_6.png"
            alt="Rune"
            className="w-6 h-6 pixelated opacity-90 mt-0.5 shrink-0"
          />
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-accent uppercase tracking-widest">
              Exclusive Reward: Ancient Runes
            </h4>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Expeditions are the{" "}
              <strong className="text-tx-main">only way to obtain Runes</strong>{" "}
              in the game. When equipped in your Rune slot, these powerful
              stones drastically reduce crafting times and provide massive
              Experience (XP) boosts for your gathering and refining skills.
            </p>
          </div>
        </div>
      </section>

      {/* ADVENTURER'S TIP */}
      <div className="flex gap-4 items-start p-4 border border-border/50 bg-panel/5 rounded-lg">
        <img
          src="./assets/ui/icon_achievements.png"
          alt="Tip"
          className="w-4 h-4 pixelated opacity-60 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-80">
            Adventurer's Tip: Before you log off for the night or head to work,
            always send your scouts on a 12-hour expedition. You'll wake up to a
            mountain of Runes, Coins and Boss Keys!
          </p>
        </div>
      </div>
    </div>
  );
}
