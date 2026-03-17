export default function QuestsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          Daily Quests
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          The Guild posts new bounties and tasks daily. Completing these tasks
          grants massive influxes of Coins, Skill Experience, and sometimes rare
          augmentation materials.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-tx-main font-black text-[10px] uppercase mb-2">
              Gather
            </h4>
            <p className="text-[11px] text-tx-muted">
              Collect raw materials to fulfill local shortages.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-tx-main font-black text-[10px] uppercase mb-2">
              Craft
            </h4>
            <p className="text-[11px] text-tx-muted">
              Supply the local guard with freshly forged weapons and potions.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-danger font-black text-[10px] uppercase mb-2">
              Kill
            </h4>
            <p className="text-[11px] text-tx-muted">
              Eliminate hostile threats across the worlds to keep paths clear.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
