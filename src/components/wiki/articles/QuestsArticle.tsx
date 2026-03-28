export default function QuestsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 07
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Daily Quests
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Every adventurer needs a steady income. The local guilds offer a fresh
          set of daily tasks that provide a reliable source of Experience (XP),
          Coins, and essential crafting materials.
        </p>
      </header>

      {/* THE RESET SYSTEM */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_clock_placeholder.png"
            alt="Time"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            The Midnight Reset
          </h3>
        </div>
        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed">
            The quest board is wiped clean and repopulated with new tasks
            exactly at
            <span className="text-tx-main font-bold"> 00:00 UTC</span> every
            single day. Make sure to claim your completed rewards before the
            server time resets, or they will be lost forever.
          </p>
        </div>
      </section>

      {/* QUEST CATEGORIES */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_quest_placeholder.png"
            alt="Quests"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Quest Objectives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Gathering",
              desc: "Extract raw materials like wood, ores, and fish.",
              icon: (
                <img
                  src="/assets/ui/icon_gather_placeholder.png"
                  className="w-4 h-4 pixelated"
                  alt="Gather"
                />
              ),
            },
            {
              label: "Crafting",
              desc: "Refine materials into weapons, armor, or potions.",
              icon: (
                <img
                  src="/assets/ui/icon_craft_placeholder.png"
                  className="w-4 h-4 pixelated"
                  alt="Craft"
                />
              ),
            },
            {
              label: "Combat",
              desc: "Defeat a specific number of monsters in the realms.",
              icon: (
                <img
                  src="/assets/ui/icon_combat_placeholder.png"
                  className="w-4 h-4 pixelated"
                  alt="Combat"
                />
              ),
            },
          ].map((type) => (
            <div
              key={type.label}
              className="bg-panel/5 border border-border p-5 rounded-lg space-y-3 flex flex-col h-full"
            >
              <div className="flex items-center gap-2">
                {type.icon}
                <span className="text-xs font-bold text-tx-main uppercase tracking-wide">
                  {type.label}
                </span>
              </div>
              <p className="text-[11px] text-tx-muted leading-relaxed flex-grow">
                {type.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ADVENTURER'S TIP */}
      <div className="flex gap-4 items-start p-4 border border-border/50 bg-panel/5 rounded-lg">
        <img
          src="/assets/ui/icon_tip_placeholder.png"
          alt="Tip"
          className="w-4 h-4 pixelated opacity-80 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-80">
            Adventurer's Tip: You can work on your daily quests passively! Just
            set up your Automatic Queue before you log off, and your character
            will complete the Gathering and Crafting tasks while you sleep.
          </p>
        </div>
      </div>
    </div>
  );
}
