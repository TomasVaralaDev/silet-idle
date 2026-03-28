export default function BasicsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Roolipelihenkinen mutta selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 01
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          The Hero's Path
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Your journey through the realms relies on a continuous cycle of
          preparation and conquest. To defeat the bosses and unlock new worlds,
          you must master the core loop of survival.
        </p>
      </header>

      {/* THE CORE LOOP - Päivitetty RPG-looppi (Gather -> Craft -> Enchant -> Combat) */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
          The Core Loop
        </h3>

        <div className="space-y-4">
          {[
            {
              step: "01",
              label: "Gather",
              desc: "Extract raw materials like ores, wood, and herbs. Your foundation relies on the resources you collect.",
              icon: (
                <img
                  src="/assets/ui/icon_gather_placeholder.png"
                  alt="Gather"
                  className="w-5 h-5 pixelated opacity-80"
                />
              ),
            },
            {
              step: "02",
              label: "Craft",
              desc: "Forge your materials into weapons, armor, accessories, and life-saving potions to prepare for battle.",
              icon: (
                <img
                  src="/assets/ui/icon_craft_placeholder.png"
                  alt="Craft"
                  className="w-5 h-5 pixelated opacity-80"
                />
              ),
            },
            {
              step: "03",
              label: "Enchant",
              desc: "Use magical scrolls and catalysts to enhance your crafted gear, drastically increasing your power.",
              icon: (
                <img
                  src="/assets/ui/icon_enchant_placeholder.png"
                  alt="Enchant"
                  className="w-5 h-5 pixelated opacity-80"
                />
              ),
            },
            {
              step: "04",
              label: "Combat",
              desc: "Equip your best items and face the monsters of the current zone to gather loot and progress further.",
              icon: (
                <img
                  src="/assets/ui/icon_combat_placeholder.png"
                  alt="Combat"
                  className="w-5 h-5 pixelated opacity-80"
                />
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-6 p-5 bg-panel/5 border border-border rounded-lg group"
            >
              <div className="text-xs font-bold text-border group-hover:text-accent transition-colors pt-1">
                {item.step}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                    {item.label}
                  </span>
                  {item.icon}
                </div>
                <p className="text-xs text-tx-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORLD STRUCTURE - Boss avaimet ja unlockit nostettu esiin */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
          World Progression
        </h3>
        <p className="text-xs text-tx-muted leading-relaxed">
          The game consists of 10 unique Worlds, each divided into 10 Combat
          Zones.
        </p>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center p-4 border-b border-border/50 bg-panel/10">
            <div className="w-24 text-[10px] font-bold text-tx-muted uppercase tracking-tighter">
              Zones 1-9
            </div>
            <div className="flex-1 text-xs font-bold text-tx-main uppercase">
              Standard Monsters
            </div>
            <div className="text-[10px] text-tx-muted uppercase">
              Basic Loot
            </div>
          </div>

          <div className="flex items-center p-4 bg-accent/5 border-b border-border/50">
            <div className="w-24 text-[10px] font-bold text-accent uppercase tracking-tighter flex items-center gap-2">
              <img
                src="/assets/items/boss_key_placeholder.png"
                alt="Key"
                className="w-3 h-3 pixelated"
              />
              Zone 10
            </div>
            <div className="flex-1 text-xs font-bold text-accent uppercase">
              World Boss
            </div>
            <div className="text-[10px] text-accent font-bold uppercase tracking-tighter">
              Requires Boss Key
            </div>
          </div>
        </div>

        {/* Mitä bossin kaataminen tekee */}
        <div className="bg-panel/5 border border-border p-4 rounded-lg mt-2">
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Defeating a World Boss requires a{" "}
            <span className="text-tx-main font-bold">Boss Key</span> (found
            within the world's zones). Emerging victorious grants you access to
            the <strong className="text-tx-main">Next World</strong>, and
            immediately unlocks that world's specific
            <strong className="text-tx-main"> Expeditions</strong> and{" "}
            <strong className="text-tx-main">World Store</strong>.
          </p>
        </div>
      </section>

      {/* STRATEGIC NOTE */}
      <div className="p-4 border-l border-warning bg-warning/5 flex gap-4 items-start">
        <img
          src="/assets/ui/icon_info_placeholder.png"
          alt="Info"
          className="w-5 h-5 pixelated opacity-80 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Adventurer's Note
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Never rush a World Boss unprepared. If standard monsters are hitting
            too hard, step back to gather, craft better armor, and enchant your
            weapons before trying again.
          </p>
        </div>
      </div>
    </div>
  );
}
