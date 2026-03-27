import { FileText, Target, Hammer, Pickaxe } from "lucide-react";

export default function QuestsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Assignment Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.6
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Operational Objectives
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          The Guild issues high-priority field assignments every 24 hours.
          Completion of these objectives provides a vital influx of Credits,
          Skill Data (XP), and specialized augmentation catalysts.
        </p>
      </header>

      {/* OBJECTIVE CATEGORIES - Clean Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Assignment Classifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Gather",
              desc: "Acquire raw materials to alleviate local resource shortages.",
              icon: <Pickaxe size={16} className="text-tx-muted" />,
            },
            {
              label: "Process",
              desc: "Refine materials into weapons or elixirs for Guild supply chains.",
              icon: <Hammer size={16} className="text-tx-muted" />,
            },
            {
              label: "Neutralize",
              desc: "Eliminate designated threats to maintain secure paths through the realms.",
              icon: <Target size={16} className="text-tx-muted" />,
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

      {/* SYSTEM SPECIFICATIONS */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-tx-muted uppercase tracking-[0.2em]">
          Protocol Parameters
        </h3>
        <div className="p-4 border border-border/50 rounded-lg bg-panel/5">
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-[11px] border-b border-border/20 pb-2">
              <span className="text-tx-muted">Reset Cycle</span>
              <span className="text-tx-main font-medium uppercase">
                Every 24 Hours
              </span>
            </li>
            <li className="flex justify-between items-center text-[11px] border-b border-border/20 pb-2">
              <span className="text-tx-muted">Stack Limit</span>
              <span className="text-tx-main font-medium uppercase">
                Non-Cumulative
              </span>
            </li>
            <li className="flex justify-between items-center text-[11px]">
              <span className="text-tx-muted">Bonus Threshold</span>
              <span className="text-accent font-bold uppercase tracking-tighter">
                Full Set Bonus
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* STRATEGIC FOOTER */}
      <div className="p-4 border-l border-border bg-panel/10">
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-70">
          Field Note: Assignments are calculated based on your current skill
          levels. The rewards scale proportionally to the difficulty of the task
          assigned.
        </p>
      </div>
    </div>
  );
}
