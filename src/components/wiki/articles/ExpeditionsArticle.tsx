import { Compass, Clock, Package } from "lucide-react";

export default function ExpeditionsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Logistics Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.5
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Scouting & Logistics
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Expeditionary units provide a passive acquisition stream for regional
          resources. Deploying scouts allows for continuous material gathering
          without diverting the Traveler from active combat or specialized
          skilling operations.
        </p>
      </header>

      {/* OPERATIONAL OVERVIEW */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Compass className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Deployment Protocols
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-tx-muted" />
              <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Resource Extraction
              </span>
            </div>
            <p className="text-xs text-tx-muted leading-relaxed">
              Scouts are dispatched to unlocked regions to identify and secure
              localized assets. The volume of recovered materials is directly
              influenced by the region's difficulty and the duration of the
              scouting cycle.
            </p>
          </div>

          <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-tx-muted" />
              <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Temporal Yield Optimization
              </span>
            </div>
            <p className="text-xs text-tx-muted leading-relaxed">
              Longer deployment cycles yield higher aggregate returns but reduce
              the frequency of resource rotation. For maximum efficiency, align
              expedition durations with your terminal check-in intervals.
            </p>
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECIFICATIONS */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-tx-muted uppercase tracking-[0.2em]">
          Unit Specifications
        </h3>
        <div className="border border-border/50 rounded-lg overflow-hidden">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-panel/10 border-b border-border/50">
              <tr>
                <th className="p-3 font-bold text-tx-main uppercase">
                  Parameter
                </th>
                <th className="p-3 font-bold text-tx-main uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <tr>
                <td className="p-3 text-tx-muted">Active Slot Capacity</td>
                <td className="p-3 text-tx-main font-medium uppercase tracking-tighter">
                  Tier Dependent
                </td>
              </tr>
              <tr>
                <td className="p-3 text-tx-muted">Resource Variance</td>
                <td className="p-3 text-tx-main font-medium uppercase tracking-tighter">
                  Regional Mapping
                </td>
              </tr>
              <tr>
                <td className="p-3 text-tx-muted">Risk Factor</td>
                <td className="p-3 text-success font-bold uppercase tracking-tighter">
                  Zero (Safe)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="p-4 border-l border-border bg-panel/10">
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-70">
          Logistics Note: Ensure inventory capacity is sufficient before
          recalling long-term expeditions. Overflow materials may be lost if
          regional caches exceed local storage limits.
        </p>
      </div>
    </div>
  );
}
