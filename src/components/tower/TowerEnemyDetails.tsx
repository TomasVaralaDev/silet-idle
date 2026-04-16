import { getItemById } from "../../utils/itemUtils";
import { formatNumber } from "../../utils/formatUtils";
import type { TowerFloor } from "../../data/tower";
import type { Resource } from "../../types";

interface TowerEnemyDetailsProps {
  floorData: TowerFloor;
}

export default function TowerEnemyDetails({
  floorData,
}: TowerEnemyDetailsProps) {
  const possibleDrops = floorData.firstClearRewards || [];

  return (
    <div className="w-full lg:w-80 flex-shrink-0 lg:border-l border-border bg-panel/80 backdrop-blur-sm z-20 flex flex-col h-auto lg:h-full font-sans">
      {/* Header - RPG henkisempi */}
      <div className="p-4 border-b border-border bg-panel/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-danger rounded-full shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-danger">
              Tower Intel
            </h2>
            <p className="text-xs font-bold text-tx-main uppercase tracking-tighter">
              Floor {floorData.floorNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {/* Enemy Profile Card */}
        <div className="bg-panel border border-border rounded-xl p-5 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-app-base/40 to-transparent pointer-events-none" />
          <img
            src={floorData.enemy.icon || "./assets/ui/icon_boss.png"}
            className="w-24 h-24 mx-auto mb-4 pixelated drop-shadow-[0_0_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-700"
            alt={floorData.enemy.name}
            onError={(e) => (e.currentTarget.src = "./assets/ui/icon_boss.png")}
          />
          <h3 className="text-lg font-black uppercase tracking-widest text-tx-main">
            {floorData.enemy.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[9px] font-mono text-danger uppercase bg-app-base px-2 py-0.5 rounded border border-danger/30 font-bold">
              Level {floorData.enemy.level} Boss
            </span>
          </div>
        </div>

        {/* Combat Stats - RPG Termit */}
        <section>
          <h4 className="text-[9px] font-black text-tx-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-border/50"></span> Target Power{" "}
            <span className="h-px flex-1 bg-border/50"></span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <StatBox
              label="Vitality"
              value={formatNumber(floorData.enemy.maxHp)}
              color="text-success"
            />
            <StatBox
              label="Attack"
              value={formatNumber(floorData.enemy.attack)}
              color="text-danger"
            />
            <StatBox
              label="Defense"
              value={formatNumber(floorData.enemy.defense)}
              color="text-warning"
            />
          </div>
        </section>

        {/* First Clear Rewards */}
        <section>
          <h4 className="text-[9px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-accent/20"></span> First Clear
            Bounty <span className="h-px flex-1 bg-accent/20"></span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {possibleDrops.length > 0 ? (
              possibleDrops.map((drop, idx) => (
                <LootItemRow
                  key={idx}
                  itemId={drop.itemId}
                  amount={drop.amount}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-app-base/20 rounded-xl border border-dashed border-border/40">
                <p className="text-[10px] text-tx-muted italic uppercase tracking-widest">
                  No bounty registered
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

function LootItemRow({ itemId, amount }: { itemId: string; amount: number }) {
  const item = getItemById(itemId) as Resource;
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

      {/* Item Info - Nimi, määrä ja rarity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div
            className="text-[11px] font-black text-tx-main truncate leading-tight uppercase tracking-tight"
            style={{ color: item.color || "white" }}
          >
            {item.name}
          </div>
          <div className="text-[10px] font-mono font-bold text-success ml-2">
            x{amount}
          </div>
        </div>
        <div className="text-[8px] text-tx-muted font-bold uppercase tracking-widest mt-0.5">
          {item.rarity}
        </div>
      </div>
    </div>
  );
}
