import { Info, Target, Pickaxe, Hammer, Swords } from "lucide-react"; // Vaatii lucide-react (joka sinulla jo on)

export default function BasicsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12 text-left relative z-10">
      {/* HEADER */}
      <header className="border-b-2 border-warning/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-warning font-mono text-sm tracking-widest">
            CHAPTER 01
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The Hero's Path
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4 max-w-2xl">
          Welcome, Restorer. The world is fractured, and the path to mending it
          requires a continuous cycle of gathering, forging, and conquering.
          Here is your blueprint for survival.
        </p>
      </header>

      {/* CORE LOOP - Käytetään visuaalisia kortteja */}
      <section>
        <h3 className="text-xl md:text-2xl font-black text-tx-main uppercase tracking-widest mb-6 flex items-center gap-3">
          <Target className="text-warning" size={24} />
          The Core Loop
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-panel border border-border hover:border-warning/50 transition-colors p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Pickaxe size={100} />
            </div>
            <h4 className="text-warning font-black text-xs md:text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <span className="bg-warning/20 text-warning px-2 py-1 rounded">
                01
              </span>{" "}
              Gather
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed relative z-10">
              Extract raw materials like ores, wood, and herbs from the world
              using your gathering skills.
            </p>
          </div>

          <div className="bg-panel border border-border hover:border-accent/50 transition-colors p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Hammer size={100} />
            </div>
            <h4 className="text-accent font-black text-xs md:text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <span className="bg-accent/20 text-accent px-2 py-1 rounded">
                02
              </span>{" "}
              Craft
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed relative z-10">
              Refine your gathered materials to forge powerful weapons, durable
              armor, and essential tools.
            </p>
          </div>

          <div className="bg-panel border border-border hover:border-danger/50 transition-colors p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Swords size={100} />
            </div>
            <h4 className="text-danger font-black text-xs md:text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <span className="bg-danger/20 text-danger px-2 py-1 rounded">
                03
              </span>{" "}
              Conquer
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed relative z-10">
              Equip your gear and face the monsters of the current zone to
              unlock new regions and rare loot.
            </p>
          </div>
        </div>
      </section>

      {/* PRO TIP / INFO BOX */}
      <div className="bg-success/10 border-l-4 border-success p-5 rounded-r-xl flex gap-4 items-start shadow-inner">
        <Info className="text-success shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-success font-black text-xs uppercase tracking-widest mb-1">
            Restorer's Advice
          </h4>
          <p className="text-xs md:text-sm text-tx-muted leading-relaxed">
            Never rush into a new World unprepared. Take time to level up your
            non-combat skills, as the gear you craft will be significantly
            stronger than what you find early on.
          </p>
        </div>
      </div>

      {/* DIFFICULTY SCALING */}
      <section className="space-y-6">
        <h3 className="text-xl md:text-2xl font-black text-tx-main uppercase tracking-widest flex items-center gap-3">
          <span className="w-8 h-1 bg-warning rounded-full" />
          World Progression
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed max-w-2xl">
          The realm is divided into vast{" "}
          <strong className="text-tx-main">Worlds</strong>, each containing
          exactly <strong className="text-tx-main">10 Combat Zones</strong>.
          Difficulty scales exponentially.
        </p>

        <div className="bg-panel border border-border rounded-xl overflow-hidden shadow-md">
          <div className="flex flex-col md:flex-row items-center p-4 border-b border-border/50 hover:bg-panel-hover transition-colors">
            <div className="w-full md:w-32 text-xs font-mono text-tx-muted mb-2 md:mb-0">
              Zones 1 - 9
            </div>
            <div className="flex-1 text-sm font-bold text-tx-main">
              Standard Encounters
            </div>
            <div className="w-full md:w-auto text-xs text-tx-muted mt-2 md:mt-0 italic">
              Normal Loot Table
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center p-4 bg-danger/5 hover:bg-danger/10 transition-colors">
            <div className="w-full md:w-32 text-xs font-mono text-danger mb-2 md:mb-0">
              Zone 10
            </div>
            <div className="flex-1 text-sm font-black text-danger uppercase tracking-wider flex items-center gap-2">
              <span>💀</span> World Boss
            </div>
            <div className="w-full md:w-auto text-xs text-warning mt-2 md:mt-0 font-bold">
              Guaranteed Rare Drops
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
