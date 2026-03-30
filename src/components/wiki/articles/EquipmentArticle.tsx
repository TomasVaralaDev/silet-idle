export default function EquipmentArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja selkeä */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 03
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Armament & Defense
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Your survival in the shifting realms is dictated by the quality of
          your gear. Understanding how to optimize your equipment slots and meet
          their strict requirements is essential for facing higher-tier threats.
        </p>
      </header>

      {/* EQUIPMENT SLOTS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/items/armor/armor_head_eternium.png"
            alt="Equipment"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Equipment Slots
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Armor */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <img
                src="/assets/items/armor/armor_chest_eternium.png"
                alt="Armor"
                className="w-4 h-4 pixelated"
              />
              <span className="text-xs font-bold uppercase tracking-wide">
                Armor (Head, Body, Legs)
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              The foundation of your survivability. These pieces provide the
              bulk of your Defense rating and maximum Hitpoints.
            </p>
          </div>

          {/* Weapons */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <img
                src="/assets/items/weapons/boss_w8_sword.png"
                alt="Weapon"
                className="w-4 h-4 pixelated"
              />
              <span className="text-xs font-bold uppercase tracking-wide">
                Weapons & Shields
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Dictates your Attack Damage and combat style (Melee, Ranged, or
              Magic). Shields can be equipped to further mitigate incoming
              damage.
            </p>
          </div>

          {/* Accessories */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <img
                src="/assets/items/necklace/necklace_eternium.png"
                alt="Accessory"
                className="w-4 h-4 pixelated"
              />
              <span className="text-xs font-bold uppercase tracking-wide">
                Accessories
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Necklaces and rings provide highly specialized stat boosts,
              including Critical Multipliers and attack speed enhancements.
            </p>
          </div>

          {/* Consumables */}
          <div className="bg-panel/5 border border-border p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-tx-main">
              <img
                src="/assets/items/alchemy/potion_tier8.png"
                alt="Consumable"
                className="w-4 h-4 pixelated"
              />
              <span className="text-xs font-bold uppercase tracking-wide">
                Consumables
              </span>
            </div>
            <p className="text-[11px] text-tx-muted leading-relaxed">
              Food and potions linked to your Auto-Eat system. Essential for
              sustaining your health during prolonged encounters.
            </p>
          </div>
        </div>
      </section>

      {/* GEAR REQUIREMENTS & LIMITS (TÄRKEIN OSIO) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/assets/items/body_iron.png"
            alt="Rules"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Requirements & Augmentation
          </h3>
        </div>

        <div className="bg-panel/10 border border-border/50 p-6 rounded-lg space-y-4">
          <ul className="space-y-4">
            {/* Level Lock */}
            <li className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-[11px] border-b border-border/20 pb-4">
              <span className="text-tx-main font-bold uppercase tracking-wider">
                Skill-Based Level Locks
              </span>
              <div className="md:text-right max-w-sm">
                <p className="text-tx-muted leading-relaxed">
                  You cannot equip gear unless you meet the{" "}
                  <span className="text-tx-main font-bold">
                    Crafting/Smithing
                  </span>{" "}
                  level required to make it. For example, to wear a Gold Armor
                  set, your Smithing must be Level 30.
                  <span className="text-warning font-semibold">
                    {" "}
                    Purchasing the item from the Marketplace does not bypass
                    this restriction.
                  </span>
                </p>
              </div>
            </li>

            {/* Enchanting Limit */}
            <li className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-[11px]">
              <span className="text-tx-main font-bold uppercase tracking-wider">
                Maximum Enchantment
              </span>
              <div className="md:text-right max-w-sm">
                <p className="text-tx-muted leading-relaxed">
                  All equippable gear can be magically enhanced up to a maximum
                  of <span className="text-accent font-bold text-xs">+5</span>.
                  Each successful enchantment massively boosts the item's base
                  stats.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* TIP BOX */}
      <div className="flex gap-4 items-start p-4 border border-border/50 bg-panel/5 rounded-lg">
        <img
          src="/assets/ui/icon_achievements.png"
          alt="Tip"
          className="w-4 h-4 pixelated opacity-60 mt-0.5 shrink-0"
        />
        <div className="space-y-1">
          <p className="text-[11px] text-tx-muted leading-relaxed italic opacity-80">
            Adventurer's Tip: Before spending all your hard-earned coins on the
            Marketplace, double-check your skill levels! A legendary weapon is
            entirely useless if you lack the proficiency to wield it.
          </p>
        </div>
      </div>
    </div>
  );
}
