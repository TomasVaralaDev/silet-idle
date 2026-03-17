export default function BasicsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      {/* SECTION 1: CORE LOOP */}
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          Hero's Path
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          The fundamental progression of the game revolves around a continuous
          cycle of gathering, crafting, and conquering. To advance through the
          worlds, you must constantly optimize your efficiency in both resource
          management and combat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2 tracking-widest">
              01. Gather
            </h4>
            <p className="text-[11px] text-tx-muted">
              Collect raw materials like ores, wood, and herbs using gathering
              skills.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2 tracking-widest">
              02. Craft
            </h4>
            <p className="text-[11px] text-tx-muted">
              Refine materials and forge the highest tier of equipment available
              to you.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2 tracking-widest">
              03. Conquer
            </h4>
            <p className="text-[11px] text-tx-muted">
              Defeat enemies in your current zone to unlock the path to the next
              area.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: DIFFICULTY SCALING */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-tx-main uppercase tracking-widest border-l-4 border-warning pl-4">
          Scaling & Difficulty
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed">
          The game is divided into{" "}
          <span className="text-tx-main font-bold">Worlds</span>, each
          containing{" "}
          <span className="text-tx-main font-bold">10 Combat Zones</span>. As
          you progress, enemies become significantly stronger:
        </p>
        <div className="bg-panel/30 border border-border p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs border-b border-border/50 pb-2">
            <span className="text-tx-muted">Zone 1-9</span>
            <span className="text-tx-main font-mono">Standard Progression</span>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="text-tx-muted">Zone 10</span>
            <span className="text-warning font-bold">World Boss Encounter</span>
          </div>
        </div>
        <p className="text-xs text-tx-muted italic">
          New areas introduce enemies with higher HP and Attack power.
          Attempting to enter a new world without upgrading your equipment will
          result in rapid defeat.
        </p>
      </section>
    </div>
  );
}
