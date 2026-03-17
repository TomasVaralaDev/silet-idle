export default function AutomationArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          Time is Magic
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          A true Restorer never sleeps. The TimeRing system is designed to work
          for you even when you step away from the terminal. Mastering the
          Action Queue and Offline Gains is essential for rapid progression.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-tx-main uppercase tracking-widest border-l-4 border-success pl-4">
          The Action Queue
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed">
          Instead of performing one action at a time, you can queue multiple
          tasks. For example, you can command your character to:
        </p>
        <div className="bg-panel/30 border border-border p-4 rounded-xl space-y-2 font-mono text-xs">
          <div className="flex items-center gap-4 text-tx-muted">
            <span className="text-success">1.</span>{" "}
            <span>Chop Pine Logs (x100)</span>
          </div>
          <div className="flex items-center gap-4 text-tx-muted">
            <span className="text-success">2.</span>{" "}
            <span>Craft Pine Planks (x50)</span>
          </div>
        </div>
        <p className="text-xs text-tx-muted italic">
          The system will automatically move to the next task in the queue once
          the current objective is met. You can unlock more queue slots later!
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-tx-main uppercase tracking-widest border-l-4 border-accent pl-4">
          Offline Progression
        </h3>
        <div className="p-5 bg-panel border border-border rounded-xl">
          <h4 className="text-accent font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
            <span>💤</span> Rest & Recover
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            When you close the game, your character continues to perform the
            current active action and any queued actions until they run out of
            required resources or finish the queue.
          </p>
          <br />
          <p className="text-xs text-tx-muted leading-relaxed">
            Upon your return, the{" "}
            <span className="text-tx-main font-bold">Offline Summary</span> will
            detail exactly what was gathered, crafted, or fought while you were
            gone.
          </p>
        </div>
      </section>
    </div>
  );
}
