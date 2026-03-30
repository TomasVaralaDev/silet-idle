export default function CombatArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 04
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Combat & Survival
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Combat in the realms is an automated clash of stats and preparation.
          Your success relies heavily on leveling your combat disciplines,
          optimizing your speed, and utilizing the right consumables.
        </p>
      </header>

      {/* BATTLE MECHANICS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_attackspeed.png"
            alt="Speed"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            The Flow of Battle
          </h3>
        </div>
        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed">
            Combat operates on an automated,{" "}
            <span className="text-tx-main font-bold">
              speed-based turn system
            </span>
            . Your attack frequency is entirely dictated by your Speed stat. A
            character with superior speed will execute multiple strikes before a
            slower enemy can even react.
          </p>
        </div>
      </section>

      {/* COMBAT SETTINGS (UUSI OSIO: Auto Push & One Time Kill) */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold text-tx-muted uppercase tracking-[0.2em]">
          Engagement Settings
        </h3>
        <p className="text-[11px] text-tx-muted leading-relaxed">
          You have full control over how your character behaves after defeating
          an enemy using the combat toggles:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border/50 rounded-lg bg-panel/5 space-y-2">
            <span className="text-[11px] font-bold text-tx-main uppercase tracking-wide">
              Auto Push
            </span>
            <p className="text-[10px] text-tx-muted leading-relaxed">
              When enabled, your character will automatically move to the next,
              harder enemy upon victory. If disabled, they will continuously
              farm the same enemy.
            </p>
          </div>
          <div className="p-4 border border-border/50 rounded-lg bg-panel/5 space-y-2">
            <span className="text-[11px] font-bold text-tx-main uppercase tracking-wide">
              One Time Kill
            </span>
            <p className="text-[10px] text-tx-muted leading-relaxed">
              Your character will defeat the current enemy exactly once and then
              automatically stop combat. Highly recommended when attempting
              World Bosses.
            </p>
          </div>
        </div>
      </section>

      {/* WEAPON STYLES */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_death.png"
            alt="Combat Styles"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Combat Styles
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/assets/items/weapons/weapon_sword_iron.png"
                className="w-8 h-8 pixelated object-contain"
                alt="Melee"
              />
              <span className="text-sm font-bold text-tx-main uppercase tracking-wide">
                Melee Combat
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Wielding swords and close-quarters weaponry. Highly reliable
              damage that grants experience directly to your{" "}
              <span className="text-tx-main font-semibold">Melee</span> skill.
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
                Ranged Combat
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Utilizing bows for rapid strikes from a distance. Excellent for
              burst damage, granting experience to your{" "}
              <span className="text-tx-main font-semibold">Ranged</span> skill.
            </p>
          </div>
        </div>
      </section>

      {/* COMBAT LEVELS & STATS */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold text-tx-muted uppercase tracking-[0.2em]">
          Combat Disciplines & Attributes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatDetail
            iconSrc="/assets/skills/attack.png"
            label="Attack Level"
            desc="Increases base accuracy and overall damage output."
          />
          <StatDetail
            iconSrc="/assets/skills/defense.png"
            label="Armor Level"
            desc="Improves base damage mitigation against enemy strikes."
          />
          <StatDetail
            iconSrc="/assets/skills/hitpoints.png"
            label="Max HP"
            desc="Determines your health pool. Expanded by Hitpoints level and gear."
          />
          <StatDetail
            iconSrc="/assets/ui/icon_critchance.png"
            label="Crit Dynamics"
            desc="Equipment determines your Critical Chance and Damage multipliers."
          />
        </div>
      </section>

      {/* ENEMY INTEL & LOOT */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/ui/icon_reward.png"
            alt="Loot"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Enemy Intel & Spoils
          </h3>
        </div>

        <div className="bg-panel/10 border border-border/50 p-6 rounded-lg space-y-4">
          <p className="text-[11px] text-tx-muted leading-relaxed border-b border-border/20 pb-4">
            Before engaging an enemy, you can inspect their potential drops by
            clicking the
            <span className="text-tx-main font-bold"> Info Icon</span> next to
            their name. This allows you to target specific monsters for the
            materials you need.
          </p>

          <div className="flex items-start gap-3 pt-2">
            <img
              src="/assets/items/bows/boss_w4_bow.png"
              alt="Boss Weapon"
              className="w-6 h-6 pixelated shrink-0 mt-1"
            />
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wide block mb-1">
                Boss Artifacts
              </span>
              <p className="text-[11px] text-tx-muted leading-relaxed">
                World Bosses possess a small chance to drop their signature
                weapon. These legendary artifacts are incredibly powerful and
                carry enough raw stats to effectively see you through the
                entirety of the next World.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RETREAT VS DEATH (UUSI OSIO: Cooldownien ero) */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-danger/80 uppercase tracking-wider">
          Retreating vs. Death
        </h3>
        <div className="border border-danger/20 rounded-lg overflow-hidden">
          <div className="p-4 bg-panel/10 border-b border-danger/20 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-tx-main uppercase tracking-wide block">
                Tactical Retreat
              </span>
              <span className="text-[10px] text-tx-muted">
                Manually clicking the Retreat button.
              </span>
            </div>
            <span className="text-[10px] font-mono text-warning font-bold uppercase">
              30s Cooldown
            </span>
          </div>
          <div className="p-4 bg-danger/5 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-danger uppercase tracking-wide block">
                Dying in Combat
              </span>
              <span className="text-[10px] text-tx-muted">
                Your Hitpoints reach zero.
              </span>
            </div>
            <span className="text-[10px] font-mono text-danger font-bold uppercase">
              60s Cooldown
            </span>
          </div>
        </div>
      </section>

      {/* ADVENTURER'S TIP */}
      <div className="flex gap-4 items-start p-4 border border-border/50 bg-panel/5 rounded-lg">
        <img
          src="/assets/ui/icon_achievements.png"
          alt="Tip"
          className="w-4 h-4 pixelated opacity-80 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-80">
            Adventurer's Tip: Always stock up on Consumables! Unlike weapons and
            armor,
            <span className="text-success font-bold not-italic">
              {" "}
              Potions have no level requirement
            </span>
            . Crafting or buying high-tier potions early on is the best way to
            survive encounters far above your current power level.
          </p>
        </div>
      </div>
    </div>
  );
}

// Apukomponentti
function StatDetail({
  label,
  desc,
  iconSrc,
}: {
  label: string;
  desc: string;
  iconSrc: string;
}) {
  return (
    <div className="flex gap-4 p-4 border border-border/40 rounded-lg bg-panel/5">
      <img
        src={iconSrc}
        alt={label}
        className="w-5 h-5 pixelated opacity-70 mt-0.5 shrink-0"
      />
      <div className="space-y-1">
        <h4 className="text-[11px] font-bold text-tx-main uppercase tracking-wide">
          {label}
        </h4>
        <p className="text-[10px] text-tx-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
