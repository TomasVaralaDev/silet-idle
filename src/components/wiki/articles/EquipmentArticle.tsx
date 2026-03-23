import { Shield, Sword, Gem, Flame } from "lucide-react";

export default function EquipmentArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12 text-left relative z-10">
      {/* HEADER */}
      <header className="border-b-2 border-tx-main/20 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-tx-main/60 font-mono text-sm tracking-widest">
            CHAPTER 03
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The Armory
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4 max-w-2xl">
          Your survival in the fractured worlds depends entirely on the gear you
          wear. Understanding how to balance your equipment slots is the key to
          conquering higher-tier zones.
        </p>
      </header>

      {/* EQUIPMENT SLOTS GRID */}
      <section>
        <h3 className="text-xl md:text-2xl font-black text-tx-main uppercase tracking-widest mb-6 flex items-center gap-3">
          <Shield className="text-tx-main/60" size={24} />
          Equipment Slots
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Armor */}
          <div className="bg-panel border border-border hover:border-tx-main/50 transition-all p-6 rounded-2xl shadow-md group">
            <h4 className="text-tx-main font-black text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <Shield
                size={16}
                className="text-tx-main/50 group-hover:text-tx-main transition-colors"
              />
              Armor (Head, Body, Legs)
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed">
              The foundation of your survivability. These pieces provide the
              bulk of your <strong className="text-tx-main">Defense</strong>{" "}
              rating and{" "}
              <strong className="text-danger">Maximum Hitpoints</strong>.
            </p>
          </div>

          {/* Weapons */}
          <div className="bg-panel border border-border hover:border-tx-main/50 transition-all p-6 rounded-2xl shadow-md group">
            <h4 className="text-tx-main font-black text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <Sword
                size={16}
                className="text-tx-main/50 group-hover:text-tx-main transition-colors"
              />
              Weapons & Shields
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed">
              Dictates your{" "}
              <strong className="text-warning">Attack Damage</strong> and combat
              style (Melee or Ranged). Shields offer crucial damage mitigation.
            </p>
          </div>

          {/* Jewelry */}
          <div className="bg-panel border border-border hover:border-warning/50 transition-all p-6 rounded-2xl shadow-md group">
            <h4 className="text-warning font-black text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <Gem
                size={16}
                className="text-warning/50 group-hover:text-warning transition-colors"
              />
              Jewelry (Necklace, Ring)
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed">
              Rare accessories that often grant powerful{" "}
              <strong className="text-warning">Critical Strike</strong>{" "}
              multipliers and attack speed bonuses.
            </p>
          </div>

          {/* Consumables */}
          <div className="bg-panel border border-border hover:border-success/50 transition-all p-6 rounded-2xl shadow-md group">
            <h4 className="text-success font-black text-sm uppercase mb-3 tracking-widest flex items-center gap-2">
              <Flame
                size={16}
                className="text-success/50 group-hover:text-success transition-colors"
              />
              Consumables (Food, Potions)
            </h4>
            <p className="text-xs md:text-sm text-tx-muted leading-relaxed">
              Items that automatically restore HP during combat based on your{" "}
              <strong className="text-success">Auto-Eat</strong> threshold
              settings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
