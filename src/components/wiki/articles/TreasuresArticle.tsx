export default function TreasuresArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 10
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Enemy Spoils & Loot
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Every monster guarding the realms hoards valuable treasures. Defeating
          them is the primary way to line your pockets with gold and gather the
          keys necessary to challenge the ultimate threats.
        </p>
      </header>

      {/* STANDARD DROPS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="./assets/ui/icon_reward.png"
            alt="Loot"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Standard Monster Drops
          </h3>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden bg-panel/5">
          <div className="divide-y divide-border/20">
            <LootRow
              label="Gold Coins"
              rate="Common"
              desc="The universal currency used for enchanting and marketplace trades."
              iconSrc="./assets/ui/coins.png"
            />
            <LootRow
              label="World Currency"
              rate="Uncommon"
              desc="Localized currency specific to the world you are currently fighting in."
              iconSrc="./assets/lootpoolszones/eternalnexus_basic.png"
            />
            <LootRow
              label="Boss Keys"
              rate="Rare"
              desc="Required to challenge the Zone 10 World Boss. Dropped by standard monsters."
              iconSrc="./assets/items/bosskey/bosskey_w7.png"
              isCritical
            />
          </div>
        </div>
      </section>

      {/* BOSS DROPS (10% Chance) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="./assets/items/weapons/boss_w5_sword.png"
            alt="Boss Loot"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-danger/80 uppercase tracking-wider">
            World Boss Artifacts
          </h3>
        </div>

        <div className="bg-danger/5 border border-danger/20 p-6 rounded-lg space-y-2">
          <p className="text-[11px] text-tx-muted leading-relaxed">
            World Bosses guard the ultimate prizes. Every time you successfully
            defeat a World Boss, there is a{" "}
            <span className="text-danger font-bold tracking-wide">
              ~10% chance
            </span>{" "}
            that it will drop its signature Boss Weapon.
          </p>
          <p className="text-[11px] text-tx-muted leading-relaxed pt-2 border-t border-danger/10">
            While these legendary armaments cannot be enchanted, their raw base
            stats are incredibly high, providing enough power to carry you
            entirely through the next World.
          </p>
        </div>
      </section>

      {/* ADVENTURER'S TIP (Auto-loot) */}
      <div className="flex gap-4 items-start p-4 border border-border/50 bg-panel/5 rounded-lg">
        <img
          src="./assets/ui/icon_achievements.png"
          alt="Bag"
          className="w-4 h-4 pixelated opacity-60 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Adventurer's Tip: Auto-Loot
          </h4>
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-80">
            You don't need to manually pick up items! All defeated monster loot
            goes straight into your inventory automatically. Just make sure you
            have enough free storage slots before leaving your character to
            fight overnight.
          </p>
        </div>
      </div>
    </div>
  );
}

// Apukomponentti (Päivitetty tukemaan kuva-ikonia)
function LootRow({
  label,
  rate,
  desc,
  iconSrc,
  isCritical = false,
}: {
  label: string;
  rate: string;
  desc: string;
  iconSrc: string;
  isCritical?: boolean;
}) {
  return (
    <div className="p-4 hover:bg-panel/10 transition-colors flex justify-between items-center gap-4">
      <div className="flex items-start gap-4">
        <img
          src={iconSrc}
          alt={label}
          className="w-6 h-6 pixelated mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <span className="block text-xs font-bold text-tx-main uppercase tracking-wide">
            {label}
          </span>
          <p className="text-[10px] text-tx-muted leading-relaxed max-w-[250px]">
            {desc}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-tighter ${isCritical ? "text-accent" : "text-tx-muted"}`}
        >
          {rate}
        </span>
      </div>
    </div>
  );
}
