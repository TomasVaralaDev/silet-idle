import { Clock, ListOrdered, MoonStar } from "lucide-react";

export default function AutomationArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12 text-left relative z-10">
      {/* HEADER */}
      <header className="border-b-2 border-success/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-success font-mono text-sm tracking-widest">
            CHAPTER 05
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          Time is Magic
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4 max-w-2xl">
          A true Restorer never sleeps. The TimeRing system is designed to work
          for you even when you step away from the terminal. Mastering
          Automation is essential for rapid progression.
        </p>
      </header>

      {/* THE ACTION QUEUE */}
      <section className="space-y-6">
        <h3 className="text-xl md:text-2xl font-bold text-tx-main uppercase tracking-widest flex items-center gap-3">
          <ListOrdered className="text-success" size={24} />
          The Action Queue
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed max-w-2xl">
          Instead of micromanaging one action at a time, you can stack tasks.
          The system will automatically move to the next task in the queue once
          the current objective is met.
        </p>

        {/* Esimerkki Jonosta */}
        <div className="bg-panel border border-border rounded-2xl overflow-hidden shadow-md max-w-lg">
          <div className="bg-panel-hover p-3 border-b border-border/50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-tx-muted">
              Example Queue
            </span>
            <span className="text-[10px] font-mono text-success">
              Running...
            </span>
          </div>
          <div className="p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-4 bg-success/10 p-3 rounded border border-success/20">
              <span className="text-success font-bold flex-shrink-0 w-4">
                1.
              </span>
              <span className="text-tx-main">
                Chop Pine Logs <span className="text-tx-muted">(x100)</span>
              </span>
            </div>
            <div className="flex items-center gap-4 bg-app-base p-3 rounded border border-border">
              <span className="text-tx-muted font-bold flex-shrink-0 w-4">
                2.
              </span>
              <span className="text-tx-muted">
                Craft Pine Planks <span className="opacity-50">(x50)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* OFFLINE PROGRESSION */}
      <section className="space-y-6 pt-6">
        <h3 className="text-xl md:text-2xl font-bold text-tx-main uppercase tracking-widest flex items-center gap-3">
          <MoonStar className="text-tx-main" size={24} />
          Offline Progression
        </h3>

        <div className="bg-gradient-to-br from-panel to-app-base border border-border p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
            <Clock size={150} />
          </div>

          <h4 className="text-tx-main font-black text-sm md:text-base uppercase mb-4 tracking-widest">
            Rest & Recover
          </h4>
          <p className="text-xs md:text-sm text-tx-muted leading-relaxed mb-4 relative z-10">
            When you close the game, your character continues to perform the
            current active action and any queued actions until they either
            finish the queue or run out of required resources.
          </p>
          <div className="bg-black/30 border-l-2 border-success p-4 rounded-r-lg relative z-10">
            <p className="text-xs text-tx-muted/80 italic">
              Upon your return, the{" "}
              <strong className="text-success not-italic">
                Offline Summary
              </strong>{" "}
              will detail exactly what was gathered, crafted, or fought while
              you were gone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
