import { useGameStore } from "../../store/useGameStore";

export default function EnemyDisplay() {
  const { enemy, combatStats } = useGameStore();

  if (!enemy || combatStats.respawnTimer > 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-panel/20 rounded-2xl border border-border/50 p-8 relative overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-border/20 border-t-accent rounded-full animate-spin"></div>
          <span className="text-tx-muted font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">
            Scanning Area...
          </span>
          {combatStats.respawnTimer > 0 && (
            <span className="text-[10px] font-mono text-accent font-bold">
              {(combatStats.respawnTimer / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      </div>
    );
  }

  const hpPercent = Math.max(
    0,
    Math.min(100, (combatStats.enemyCurrentHp / enemy.maxHp) * 100),
  );

  return (
    <div className="h-full flex flex-col bg-panel/30 rounded-2xl border border-border p-4 md:p-6 relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center gap-3 md:gap-5">
        <div className="relative group">
          <div className="w-24 h-24 md:w-40 md:h-40 bg-app-base rounded-2xl border-2 border-border flex items-center justify-center shadow-2xl overflow-hidden">
            {enemy.icon ? (
              <img
                src={enemy.icon}
                alt={enemy.name}
                className="w-full h-full object-contain pixelated hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <span className="text-5xl">💀</span>
            )}
          </div>
          <div className="absolute -top-2 -right-2 bg-danger text-white text-[10px] font-black px-2 py-1 rounded-lg border border-white/20 shadow-lg">
            LVL {enemy.level}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-black text-tx-main uppercase tracking-wider">
            {enemy.name}
          </h2>
          <div className="text-tx-muted text-[9px] md:text-[10px] mt-1 font-black uppercase tracking-widest">
            Yield: <span className="text-success">{enemy.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="flex justify-between text-[10px] font-black mb-1.5 px-1 uppercase tracking-widest text-tx-muted">
          <span>Status</span>
          <span className="text-tx-main font-mono">
            {Math.ceil(combatStats.enemyCurrentHp)}{" "}
            <span className="opacity-30">/</span> {enemy.maxHp}
          </span>
        </div>
        <div className="h-3 md:h-5 bg-app-base rounded-full overflow-hidden border border-border relative shadow-inner">
          <div
            className="h-full bg-danger transition-all duration-300 ease-out shadow-[0_0_15px_rgba(var(--color-danger)/0.5)]"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
