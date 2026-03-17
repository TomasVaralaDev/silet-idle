export default function ExpeditionsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          Expeditions (Scavenging)
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          Expeditions allow your character to passively hunt for regional
          resources without active combat or skilling. Send out teams to gather
          valuable materials while you focus on other tasks.
        </p>
        <div className="p-5 bg-panel border border-border rounded-xl">
          <h4 className="text-warning font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
            <span>⏱️</span> Time is Money
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            The longer you set the expedition duration, the more items your
            scavengers will return with. However, keeping durations optimized
            based on your active play schedule yields the best returns.
          </p>
        </div>
      </section>
    </div>
  );
}
