export default function CombatArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10 text-left">
      {/* SECTION 1: WEAPON ARCHETYPES */}
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-6">
          Art of War
        </h2>
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Weapon Archetypes
        </h3>
        {/* Muutettu md:grid-cols-3 -> md:grid-cols-2 koska sauvat on poistettu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SWORD */}
          <div className="bg-panel border border-border p-4 rounded-xl flex flex-col items-center text-center">
            <img
              src="/assets/items/weapons/weapon_sword_iron.png"
              className="w-12 h-12 pixelated mb-3"
              alt="Melee"
            />
            <h4 className="text-tx-main font-black uppercase text-xs">Sword</h4>
            <p className="text-[10px] text-tx-muted mt-2">
              Specializes in raw physical power and scales with your Melee
              skill.
            </p>
          </div>

          {/* BOW */}
          <div className="bg-panel border border-border p-4 rounded-xl flex flex-col items-center text-center">
            <img
              src="/assets/items/bows/bow_iron.png"
              className="w-12 h-12 pixelated mb-3"
              alt="Ranged"
            />
            <h4 className="text-tx-main font-black uppercase text-xs">Bow</h4>
            <p className="text-[10px] text-tx-muted mt-2">
              Favors high attack speed and critical strikes. Scales with Ranged
              skill.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: EQUIPMENT ATTRIBUTES */}
      <section>
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Equipment Attributes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-panel/30 p-6 rounded-2xl border border-border/50">
          <StatDetail
            label="Attack"
            desc="Raw damage dealt per successful hit."
          />
          <StatDetail
            label="Defense"
            desc="Reduces incoming damage from hostile sources."
          />
          <StatDetail
            label="Attack Speed"
            desc="The delay (ms) between strikes. Lower is faster."
          />
          <StatDetail
            label="Crit Chance"
            desc="Percentage chance to deal a Critical Strike."
          />
          <StatDetail
            label="Crit Multi"
            desc="Multiplier applied to critical damage (Base: 1.5x)."
          />
          <StatDetail
            label="Strength"
            desc="Bonus physical power affecting melee effectiveness."
          />
          <StatDetail
            label="HP Bonus"
            desc="Increases your maximum life point capacity."
          />
        </div>
      </section>

      {/* SECTION 3: HERO SKILLS */}
      <section>
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Combat Proficiency
        </h3>
        <p className="text-xs text-tx-muted mb-6 leading-relaxed">
          Engaging in battle grants experience in several internal systems.
          Raising these levels is the only way to master higher-tier gear and
          survive late-game zones.
        </p>

        <div className="space-y-2">
          <SkillRow
            name="Combat"
            desc="Overall combat capability and power level."
          />
          <SkillRow
            name="Hitpoints"
            desc="Directly increases your Maximum Health."
          />
          <SkillRow
            name="Attack"
            desc="Increases your chance to land successful hits."
          />
          <SkillRow
            name="Defense"
            desc="Improves the efficiency of all equipped armor."
          />
          {/* Muutettu md:grid-cols-3 -> md:grid-cols-2 koska magia on poistettu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <div className="bg-panel p-3 border border-border rounded-lg">
              <span className="text-[10px] font-black text-accent uppercase">
                Melee
              </span>
              <p className="text-[9px] text-tx-muted mt-1">
                Mastery of blades and physical force.
              </p>
            </div>
            <div className="bg-panel p-3 border border-border rounded-lg">
              <span className="text-[10px] font-black text-success uppercase">
                Ranged
              </span>
              <p className="text-[9px] text-tx-muted mt-1">
                Mastery of bows and precision strikes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SURVIVAL & DEFEAT */}
      <section>
        <h3 className="text-sm font-bold text-danger uppercase tracking-[0.2em] mb-4 border-l-4 border-danger pl-4">
          Survival & Defeat
        </h3>
        <p className="text-xs text-tx-muted mb-6 leading-relaxed">
          The worlds outside the safe zones are unforgiving. Knowing when to
          fight and when to flee is a vital skill.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-danger/5 border border-danger/20 rounded-xl">
            <h4 className="text-danger font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
              <span>☠️</span> Death Penalty
            </h4>
            <p className="text-xs text-tx-muted leading-relaxed">
              If your HP reaches zero, you are defeated. You will be forcefully
              removed from combat and placed on a{" "}
              <strong>Respawn Cooldown</strong>. During this time, you cannot
              fight, and your active combat progress for that map is halted.
            </p>
          </div>

          <div className="p-5 bg-warning/5 border border-warning/20 rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
              <span>🏃</span> Retreating
            </h4>
            <p className="text-xs text-tx-muted leading-relaxed">
              You can manually click the <strong>Stop/Retreat</strong> button to
              flee a losing battle. However, fleeing still triggers a brief{" "}
              <strong>Retreat Cooldown</strong> before you can re-engage with
              the enemy. Use Auto-Eat to survive longer!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatDetail({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/30 pb-2">
      <span className="text-[10px] font-black text-tx-main uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[10px] text-tx-muted leading-tight">{desc}</span>
    </div>
  );
}

function SkillRow({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-panel border border-border rounded-xl">
      <span className="text-xs font-black uppercase text-tx-main">{name}</span>
      <span className="text-[10px] text-tx-muted italic">{desc}</span>
    </div>
  );
}
