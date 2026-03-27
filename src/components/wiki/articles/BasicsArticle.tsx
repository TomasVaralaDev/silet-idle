import { Info, Shield, Swords, Pickaxe } from "lucide-react";

export default function BasicsArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Minimalistinen ja asiallinen */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.0
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Traveler's Field Manual
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Your journey to defeat the Nexus Lord begins with a disciplined cycle
          of resource acquisition and combat. Understanding the core systems is
          vital for survival in the shifting realms.
        </p>
      </header>

      {/* THE PROGRESSION PATH - Selkeä lista korttien sijaan */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider flex items-center gap-3">
          The Progression Path
        </h3>

        <div className="space-y-4">
          {[
            {
              step: "01",
              label: "Gathering",
              desc: "Extract raw ores, timber, and botanical resources. Your primary survival depends on the efficiency of your tools.",
              icon: <Pickaxe size={18} className="text-tx-muted" />,
            },
            {
              step: "02",
              label: "Crafting",
              desc: "Refine materials into superior weaponry and protective gear. Crafted equipment consistently outperforms scavenged remains.",
              icon: <Shield size={18} className="text-tx-muted" />,
            },
            {
              step: "03",
              label: "Combat",
              desc: "Deploy in active zones to clear threats. Victory grants access to deeper regions and rarer materials.",
              icon: <Swords size={18} className="text-tx-muted" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-6 p-5 bg-panel/5 border border-border rounded-lg group"
            >
              <div className="text-xs font-bold text-border group-hover:text-accent transition-colors pt-1">
                {item.step}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                    {item.label}
                  </span>
                  {item.icon}
                </div>
                <p className="text-xs text-tx-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORLD STRUCTURE - Taulukkomainen selkeä esitys */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
          World Structure
        </h3>
        <p className="text-xs text-tx-muted leading-relaxed">
          The Nexus is divided into Worlds, each comprised of exactly 10 Combat
          Zones.
        </p>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center p-4 border-b border-border/50 bg-panel/10">
            <div className="w-24 text-[10px] font-bold text-tx-muted uppercase tracking-tighter">
              Zones 01-09
            </div>
            <div className="flex-1 text-xs font-bold text-tx-main uppercase">
              Standard Encounters
            </div>
            <div className="text-[10px] text-tx-muted uppercase">
              Common Loot
            </div>
          </div>
          <div className="flex items-center p-4 bg-accent/5">
            <div className="w-24 text-[10px] font-bold text-accent uppercase tracking-tighter">
              Zone 10
            </div>
            <div className="flex-1 text-xs font-bold text-accent uppercase flex items-center gap-2">
              World Boss
            </div>
            <div className="text-[10px] text-accent font-bold uppercase tracking-tighter">
              Guaranteed Rare
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC NOTE - Mieto info-box */}
      <div className="p-4 border-l border-accent bg-accent/5 flex gap-4 items-start">
        <Info className="text-accent shrink-0" size={18} />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Strategic Note
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Do not overextend. If combat becomes inefficient, focus on
            non-combat skills. A higher tier of armor is more effective than
            sheer brute force.
          </p>
        </div>
      </div>
    </div>
  );
}
