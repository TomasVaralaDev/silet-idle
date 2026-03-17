export default function EquipmentArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          The Armory
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          Your survival depends entirely on the gear you wear. Equipment is
          divided into multiple slots, each providing unique offensive or
          defensive benefits to your character.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-tx-main font-black text-[10px] uppercase mb-2">
              Armor (Head, Body, Legs)
            </h4>
            <p className="text-[11px] text-tx-muted">
              Provides the bulk of your Defense rating and maximum Hitpoints (HP
              Bonus).
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-tx-main font-black text-[10px] uppercase mb-2">
              Weapons & Shields
            </h4>
            <p className="text-[11px] text-tx-muted">
              Dictates your Attack damage, combat style (Melee/Ranged), and
              block efficiency.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2">
              Jewelry (Necklace, Ring)
            </h4>
            <p className="text-[11px] text-tx-muted">
              Often grants critical strike multipliers and attack speed bonuses.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-success font-black text-[10px] uppercase mb-2">
              Food & Potions
            </h4>
            <p className="text-[11px] text-tx-muted">
              Consumables that automatically heal you during combat based on
              your auto-eat settings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
