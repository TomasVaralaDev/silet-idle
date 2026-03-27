import { Clock, ListOrdered, MoonStar } from "lucide-react";

export default function AutomationArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Minimalistinen dashboard-tyyli */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.2
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Automation Protocols
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Efficiency is the cornerstone of progression within the Nexus. By
          mastering the Action Queue and temporal synchronization, a Traveler
          ensures continuous advancement even during terminal absence.
        </p>
      </header>

      {/* THE ACTION QUEUE - Puhdas ja tekninen esitys */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ListOrdered className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            The Action Queue
          </h3>
        </div>
        <p className="text-xs text-tx-muted leading-relaxed">
          The queue system allows for pre-programmed task sequences. Once a
          target quantity is reached, the system automatically initiates the
          subsequent operation without requiring manual intervention.
        </p>

        {/* Example Queue - Simuloitu UI-elementti */}
        <div className="border border-border rounded-lg overflow-hidden max-w-md">
          <div className="bg-panel/10 p-2 border-b border-border flex justify-between items-center">
            <span className="text-[9px] font-bold text-tx-muted uppercase tracking-widest pl-2">
              Active Sequence
            </span>
            <div className="flex items-center gap-2 pr-2">
              <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
              <span className="text-[9px] font-bold text-success uppercase">
                Processing
              </span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center text-[11px] bg-panel/20 p-2.5 rounded border border-border">
              <span className="text-tx-main font-medium">
                01. Chop Pine Logs
              </span>
              <span className="text-tx-muted font-mono">100 / 100</span>
            </div>
            <div className="flex justify-between items-center text-[11px] p-2.5 rounded border border-border/50 opacity-60">
              <span className="text-tx-main">02. Craft Pine Planks</span>
              <span className="text-tx-muted font-mono">0 / 50</span>
            </div>
          </div>
        </div>
      </section>

      {/* ASYNCHRONOUS PROGRESSION - Ei enää liukuvärejä tai isoja ikoneita */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <MoonStar className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Asynchronous Progression
          </h3>
        </div>

        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Temporal Synchronization
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            The Nexus engine utilizes delta-time calculations to ensure your
            actions continue while the terminal is inactive. Your character will
            persist in performing the current task and any queued items until
            resources are exhausted or objectives are met.
          </p>

          <div className="p-4 bg-panel/10 border-l border-border mt-2">
            <p className="text-xs text-tx-muted leading-relaxed">
              Upon session restoration, an{" "}
              <span className="text-tx-main font-bold">Offline Summary</span>{" "}
              will be generated, detailing all materials gathered, items
              crafted, and experience points gained during the interval.
            </p>
          </div>
        </div>
      </section>

      {/* DATA INTEGRITY NOTE */}
      <div className="flex gap-4 items-start p-4 border border-border/50 rounded-lg">
        <Clock className="text-tx-muted shrink-0" size={18} />
        <div className="space-y-1">
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-70">
            Note: Maximum offline duration is determined by your current tier of
            Nexus upgrades. Ensure your queue is sufficiently stocked with raw
            materials before disconnection.
          </p>
        </div>
      </div>
    </div>
  );
}
