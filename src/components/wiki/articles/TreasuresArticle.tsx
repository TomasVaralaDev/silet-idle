export default function TreasuresArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 text-left">
      <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter">
        Spoils of War
      </h2>
      <p className="text-tx-muted text-sm">
        Every monster carries different loot. The quality of these treasures is
        determined by the stars.
      </p>
      <div className="space-y-2">
        <LootRow
          label="Common (Materials)"
          rate="Garanteed"
          color="text-slate-400"
        />
        <LootRow label="Rare (Gems)" rate="~10%" color="text-cyan-400" />
        <LootRow label="Boss Artifacts" rate="10%" color="text-purple-400" />
        <LootRow label="Legendary Loot" rate="~1%" color="text-warning" />
      </div>
    </div>
  );
}

function LootRow({
  label,
  rate,
  color,
}: {
  label: string;
  rate: string;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center p-4 bg-panel border-b border-border">
      <span className={`text-xs font-black uppercase ${color}`}>{label}</span>
      <span className="text-[10px] font-mono font-bold text-tx-muted">
        {rate}
      </span>
    </div>
  );
}
