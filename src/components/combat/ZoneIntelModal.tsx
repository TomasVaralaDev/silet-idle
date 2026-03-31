import { getItemDetails } from "../../data";
import { calculateEnemyStats } from "../../utils/enemyScaling";
import { formatNumber } from "../../utils/formatUtils";
import type { CombatMap, Resource } from "../../types";

interface ZoneIntelModalProps {
  zone: CombatMap;
  onClose: () => void;
}

export default function ZoneIntelModal({ zone, onClose }: ZoneIntelModalProps) {
  // 1. Dynaamiset statsit
  const relativeZone = ((zone.id - 1) % 10) + 1;
  const stats = calculateEnemyStats(zone.world, relativeZone);
  const possibleDrops = zone.drops || [];

  return (
    <div className="absolute inset-0 z-[100] bg-app-base/95 animate-in fade-in slide-in-from-right duration-200 flex flex-col overflow-hidden font-sans">
      {/* Header - RPG henkisempi */}
      <div className="p-4 border-b border-border bg-panel/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-accent rounded-full shadow-[0_0_8px_rgba(var(--color-accent)/0.4)]" />
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              Enemy Info
            </h2>
            <p className="text-xs font-bold text-tx-main uppercase tracking-tighter">
              {zone.name}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-app-base border border-border flex items-center justify-center text-tx-muted hover:text-danger hover:border-danger/50 transition-all shadow-sm font-bold"
        >
          ✕
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 pb-24">
        {/* Enemy Profile Card */}
        <div className="bg-panel border border-border rounded-xl p-5 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-app-base/40 to-transparent pointer-events-none" />
          <img
            src={zone.image || "./assets/ui/icon_battle.png"}
            className="w-24 h-24 mx-auto mb-4 pixelated drop-shadow-[0_0_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-700"
            alt={zone.enemyName}
          />
          <h3 className="text-lg font-black uppercase tracking-widest text-tx-main">
            {zone.enemyName}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[9px] font-mono text-tx-muted uppercase bg-app-base px-2 py-0.5 rounded border border-border">
              Region {zone.world}-{relativeZone}
            </span>
          </div>
        </div>

        {/* Combat Stats - RPG Termit */}
        <section>
          <h4 className="text-[9px] font-black text-tx-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-border/50"></span> Enemy Power{" "}
            <span className="h-px flex-1 bg-border/50"></span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <StatBox
              label="Vitality"
              value={formatNumber(stats.enemyHp)}
              color="text-danger"
            />
            <StatBox
              label="Attack"
              value={formatNumber(stats.enemyAttack)}
              color="text-warning"
            />
            <StatBox
              label="XP Reward"
              value={formatNumber(stats.xpReward)}
              color="text-success"
            />
          </div>
        </section>

        {/* Possible Drops - Vain esineet ja harvinaisuus */}
        <section>
          <h4 className="text-[9px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-accent/20"></span> Loot Table{" "}
            <span className="h-px flex-1 bg-accent/20"></span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {possibleDrops.length > 0 ? (
              possibleDrops.map((drop, idx) => (
                <LootItemRow key={idx} itemId={drop.itemId} />
              ))
            ) : (
              <div className="text-center py-8 bg-app-base/20 rounded-xl border border-dashed border-border/40">
                <p className="text-[10px] text-tx-muted italic uppercase tracking-widest">
                  No loot discovered yet
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 bg-app-base/80 border-t border-border/50 text-center shrink-0 backdrop-blur-sm">
        <p className="text-[9px] text-tx-muted/40 uppercase font-black tracking-[0.4em]">
          End of Report
        </p>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-panel/40 p-2.5 rounded-lg border border-border/40 flex flex-col items-center justify-center shadow-inner">
      <span className="text-[7px] font-black text-tx-muted uppercase mb-1">
        {label}
      </span>
      <span className={`text-[11px] font-mono font-black ${color}`}>
        {value}
      </span>
    </div>
  );
}

function LootItemRow({ itemId }: { itemId: string }) {
  const item = getItemDetails(itemId) as Resource;
  if (!item) return null;

  return (
    <div className="flex items-center gap-3 bg-panel/40 p-2.5 rounded-xl border border-border/40 hover:border-accent/30 transition-all group shadow-sm">
      {/* Icon Wrapper */}
      <div className="w-10 h-10 shrink-0 bg-app-base rounded-lg border border-border flex items-center justify-center relative shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
        <img
          src={item.icon}
          className="w-7 h-7 pixelated z-10 group-hover:scale-125 transition-transform duration-300"
          alt=""
        />
      </div>

      {/* Item Info - Nyt vain nimi ja rarity */}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-black text-tx-main truncate leading-tight uppercase tracking-tight">
          {item.name}
        </div>
        <div className="text-[8px] text-tx-muted font-bold uppercase tracking-widest mt-0.5">
          {item.rarity}
        </div>
      </div>

      {/* Nuoli indikoi että tämä on vain lista */}
      <div className="text-tx-muted/20 text-xs font-black pr-2">&bull;</div>
    </div>
  );
}
