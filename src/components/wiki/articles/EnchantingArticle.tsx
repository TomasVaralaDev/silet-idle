export default function EnchantingArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 text-left">
      <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter">
        The Great Forge
      </h2>
      <div className="p-6 bg-panel border border-border rounded-2xl relative overflow-hidden">
        <h4 className="text-xs font-black uppercase text-warning mb-4">
          Laws of Augmentation
        </h4>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="text-warning font-bold">I.</span>
            <span className="text-sm text-tx-muted">
              Every successful enchantment increases base power by{" "}
              <span className="text-success font-bold">+20%</span>.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="text-warning font-bold">II.</span>
            <span className="text-sm text-tx-muted">
              The forge can only stabilize an item up to{" "}
              <span className="text-warning font-bold">Level +5</span>.
            </span>
          </li>
          <li className="flex gap-4 p-3 bg-danger/10 border border-danger/20 rounded">
            <span className="text-xs text-danger font-black uppercase italic">
              Ancient artifacts (Boss Drops) cannot be enchanted; their power is
              absolute.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
