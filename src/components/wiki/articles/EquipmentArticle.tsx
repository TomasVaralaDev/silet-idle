import { Shield, Sword, Gem, Flame } from "lucide-react";

export default function EquipmentArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Minimalistinen ja asiallinen */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.1
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Armament & Defense
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Survival within the Nexus is directly proportional to the quality of
          your equipment. Optimizing your gear across all specialized slots is
          essential for engaging high-tier threats.
        </p>
      </header>

      {/* EQUIPMENT SLOTS - Siisti ruudukko ilman raskaita efektejä */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="text-tx-main" size={20} />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Standard Issue Slots
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Armor */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <Shield size={16} className="text-tx-muted" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Armor Units
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Comprised of{" "}
              <span className="text-tx-main font-semibold">
                Head, Body, and Leg
              </span>{" "}
              protection. Primary source of Defense rating and Maximum
              Hitpoints.
            </p>
          </div>

          {/* Weapons */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <Sword size={16} className="text-tx-muted" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Offensive Tools
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Determines{" "}
              <span className="text-tx-main font-semibold">Attack Damage</span>{" "}
              and combat style. Shields may be deployed to mitigate incoming
              damage.
            </p>
          </div>

          {/* Jewelry */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <Gem size={16} className="text-tx-muted" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Accessories
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Necklaces and Rings provide specialized stat boosts, including
              <span className="text-tx-main font-semibold">
                Critical Multipliers
              </span>{" "}
              and haste.
            </p>
          </div>

          {/* Consumables */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <Flame size={16} className="text-tx-muted" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Sustenance
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Food and Potions linked to the{" "}
              <span className="text-tx-main font-semibold">Auto-Eat</span>{" "}
              system. Essential for sustained combat operations.
            </p>
          </div>
        </div>
      </section>

      {/* STRATEGIC OVERVIEW - Taulukkomuotoinen lisäinfo */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-tx-muted uppercase tracking-[0.2em]">
          Deployment Specifications
        </h3>
        <div className="p-4 border border-border/50 rounded-lg bg-panel/5">
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-[11px] border-b border-border/20 pb-2">
              <span className="text-tx-muted">Requirement Check</span>
              <span className="text-tx-main font-medium uppercase">
                Level-Locked
              </span>
            </li>
            <li className="flex justify-between items-center text-[11px] border-b border-border/20 pb-2">
              <span className="text-tx-muted">Durability Status</span>
              <span className="text-tx-main font-medium uppercase">
                Indestructible
              </span>
            </li>
            <li className="flex justify-between items-center text-[11px]">
              <span className="text-tx-muted">Augmentation</span>
              <span className="text-accent font-bold uppercase tracking-tighter">
                Enchanting Eligible
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="p-4 border-l border-border bg-panel/10">
        <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-70">
          Field Tip: Always balance your Defense against the enemy's tier. A
          high damage output is useless if your character cannot sustain the
          duration of the encounter.
        </p>
      </div>
    </div>
  );
}
