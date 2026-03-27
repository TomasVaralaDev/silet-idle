import { ShieldAlert, Crosshair, HeartPulse, Zap } from "lucide-react";

export default function CombatArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - Professional Engagement Briefing */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Manual v1.4
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Combat Engagement Protocols
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Combat within the Nexus is an automated exchange of strikes. Success
          is determined by pre-deployment preparation, equipment optimization,
          and attribute alignment.
        </p>
      </header>

      {/* WEAPON ARCHETYPES - Clean grid without circular containers */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider flex items-center gap-3">
          <Crosshair className="text-tx-main" size={20} />
          Weapon Archetypes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/assets/items/weapons/weapon_sword_iron.png"
                className="w-8 h-8 pixelated object-contain"
                alt="Melee"
              />
              <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Melee Units
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              High reliability physical output. Damage scales directly with the{" "}
              <span className="text-tx-main font-semibold">Melee</span> skill.
              Ideal for consistent frontline deployment.
            </p>
          </div>

          <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/assets/items/bows/bow_iron.png"
                className="w-8 h-8 pixelated object-contain"
                alt="Ranged"
              />
              <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Ranged Units
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Focuses on rapid fire and critical vulnerabilities. Scales with
              the <span className="text-tx-main font-semibold">Ranged</span>{" "}
              skill. High ceiling for burst damage output.
            </p>
          </div>
        </div>
      </section>

      {/* CORE ATTRIBUTES - Clean data grid */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
          Attribute Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatDetail
            icon={<Zap size={14} />}
            label="Attack"
            desc="Total damage dealt per successful cycle. Primary DPS foundation."
          />
          <StatDetail
            icon={<ShieldAlert size={14} />}
            label="Defense"
            desc="Mitigates incoming damage. Essential for high-tier realm survival."
          />
          <StatDetail
            icon={<Zap size={14} />}
            label="Attack Speed"
            desc="Frequency of engagement. Lower values indicate higher output."
          />
          <StatDetail
            icon={<HeartPulse size={14} />}
            label="HP Bonus"
            desc="Flat health augmentation provided by defensive armaments."
          />
        </div>
      </section>

      {/* EVACUATION PROTOCOLS - Replaces "Death Penalty" */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
          Evacuation Protocols
        </h3>
        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-xs text-tx-muted leading-relaxed">
            In the event of critical HP depletion (Zero HP), the Nexus Engine
            initiates immediate evacuation to prevent total data loss.
          </p>
          <div className="space-y-2">
            {[
              "A 60-second recovery cooldown will be enforced.",
              "All active combat progress in the current zone is voided.",
              "Auto-Eat parameters should be maintained above 50% for safety.",
            ].map((text, i) => (
              <div
                key={i}
                className="flex gap-3 items-center text-[11px] text-tx-muted"
              >
                <span className="text-border font-bold">0{i + 1}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGIC OVERVIEW */}
      <div className="p-4 border-l border-border bg-panel/10">
        <p className="text-[11px] text-tx-muted leading-relaxed opacity-70">
          Engagement Note: Successful combat requires balancing offensive output
          with sustainable defense. Monitor your combat log for efficiency gaps
          during encounters.
        </p>
      </div>
    </div>
  );
}

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
    <div className="flex gap-4 p-4 border border-border/40 rounded-lg">
      <div className="text-tx-muted mt-0.5">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-[11px] font-bold text-tx-main uppercase tracking-wide">
          {label}
        </h4>
        <p className="text-[10px] text-tx-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
