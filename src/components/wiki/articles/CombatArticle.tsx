import { ShieldAlert, Crosshair, HeartPulse, Zap } from "lucide-react";

export default function CombatArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12 text-left relative z-10">
      {/* HEADER */}
      <header className="border-b-2 border-accent/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-accent font-mono text-sm tracking-widest">
            CHAPTER 02
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The Art of War
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4 max-w-2xl">
          Combat is an automated, turn-based exchange of blows. However, victory
          is decided long before the first strike—in the preparation of your
          gear and the honing of your skills.
        </p>
      </header>

      {/* WEAPON ARCHETYPES */}
      <section>
        <h3 className="text-xl md:text-2xl font-black text-tx-main uppercase tracking-widest mb-6 flex items-center gap-3">
          <Crosshair className="text-accent" size={24} />
          Weapon Archetypes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-panel border-2 border-border hover:border-tx-main transition-all p-6 rounded-2xl flex flex-col items-center text-center group shadow-md">
            <div className="w-16 h-16 rounded-full bg-app-base border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <img
                src="/assets/items/weapons/weapon_sword_iron.png"
                className="w-10 h-10 pixelated"
                alt="Melee"
              />
            </div>
            <h4 className="text-tx-main font-black uppercase text-sm md:text-base tracking-widest mb-2">
              Melee / Swords
            </h4>
            <p className="text-xs text-tx-muted leading-relaxed">
              Specializes in raw physical power. Highly reliable damage that
              scales exclusively with your <strong>Melee</strong> skill.
            </p>
          </div>

          <div className="bg-panel border-2 border-border hover:border-success transition-all p-6 rounded-2xl flex flex-col items-center text-center group shadow-md">
            <div className="w-16 h-16 rounded-full bg-app-base border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <img
                src="/assets/items/bows/bow_iron.png"
                className="w-10 h-10 pixelated"
                alt="Ranged"
              />
            </div>
            <h4 className="text-success font-black uppercase text-sm md:text-base tracking-widest mb-2">
              Ranged / Bows
            </h4>
            <p className="text-xs text-tx-muted leading-relaxed">
              Favors extreme attack speed and critical strikes. Highly lethal
              but unpredictable. Scales with your <strong>Ranged</strong> skill.
            </p>
          </div>
        </div>
      </section>

      {/* KEY STATS */}
      <section className="bg-panel/50 border border-border/50 rounded-3xl p-6 md:p-8 shadow-inner">
        <h3 className="text-xl font-black text-tx-main uppercase tracking-widest mb-6 border-b border-border/50 pb-4">
          Understanding Attributes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <StatDetail
            icon={<Zap className="text-warning" size={16} />}
            label="Attack"
            desc="Raw damage dealt per successful hit. The foundation of your DPS."
          />
          <StatDetail
            icon={<ShieldAlert className="text-accent" size={16} />}
            label="Defense"
            desc="Directly mitigates incoming damage. Crucial for long expeditions."
          />
          <StatDetail
            icon={<Zap className="text-tx-main" size={16} />}
            label="Attack Speed"
            desc="Measured in seconds. Lower is faster. Bows naturally excel here."
          />
          <StatDetail
            icon={<HeartPulse className="text-danger" size={16} />}
            label="HP Bonus"
            desc="Added flat Health Points from armor pieces like chestplates and helmets."
          />
        </div>
      </section>

      {/* DEATH PENALTY */}
      <section>
        <div className="bg-danger/10 border-2 border-danger/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(var(--color-danger)/0.1)]">
          <div className="absolute -right-10 -top-10 opacity-10">
            <ShieldAlert size={200} className="text-danger" />
          </div>
          <h3 className="text-lg md:text-xl font-black text-danger uppercase tracking-[0.2em] mb-4 relative z-10 flex items-center gap-3">
            <span className="animate-pulse">⚠️</span> Survival Protocol
          </h3>
          <p className="text-sm text-tx-main/80 leading-relaxed mb-4 relative z-10 font-medium">
            If your HP reaches zero, you will be forcefully evacuated from the
            Combat Zone.
          </p>
          <ul className="space-y-3 relative z-10">
            <li className="flex items-center gap-3 text-xs text-tx-muted bg-black/40 p-3 rounded-lg border border-danger/20">
              <span className="text-danger font-black">01</span> You will incur
              a <strong>60-second Cooldown</strong> preventing combat entry.
            </li>
            <li className="flex items-center gap-3 text-xs text-tx-muted bg-black/40 p-3 rounded-lg border border-danger/20">
              <span className="text-danger font-black">02</span> Active combat
              progress for that map is halted instantly.
            </li>
            <li className="flex items-center gap-3 text-xs text-tx-muted bg-black/40 p-3 rounded-lg border border-warning/30">
              <span className="text-warning font-black">TIP</span> Keep your{" "}
              <strong>Auto-Eat</strong> threshold high and stock up on food!
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// Apukomponentti attribuuttien listaukseen
function StatDetail({
  label,
  desc,
  icon,
}: {
  label: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="bg-app-base p-2 rounded-lg border border-border group-hover:border-tx-main/50 transition-colors shrink-0 shadow-sm mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black text-tx-main uppercase tracking-wider mb-1">
          {label}
        </h4>
        <p className="text-xs text-tx-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
