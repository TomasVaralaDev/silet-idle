import { useGameStore } from "../../store/useGameStore";

export default function EnemyDisplay() {
  const { enemy, combatStats } = useGameStore();

  // Show searching animation if no enemy is loaded or respawn timer is active
  if (!enemy || combatStats.respawnTimer > 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 p-8 relative overflow-hidden">
        {
          // Animation Overlay
        }
        <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-slate-400 font-mono text-sm tracking-widest uppercase animate-pulse">
              Searching for target...
            </span>
            {combatStats.respawnTimer > 0 && (
              <span className="text-xs text-slate-600">
                {(combatStats.respawnTimer / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Safely calculate HP percentage to prevent UI overflow
  const hpPercent = Math.max(
    0,
    Math.min(100, (combatStats.enemyCurrentHp / enemy.maxHp) * 100),
  );

  return (
    <div className="h-full flex flex-col bg-slate-900/50 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
      {
        // Enemy Details Section
      }
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {
          // Portrait Container
        }
        <div className="relative group">
          <div className="w-32 h-32 bg-slate-950 rounded-lg border-2 border-red-900/30 flex items-center justify-center shadow-lg overflow-hidden">
            {enemy.icon ? (
              <img
                src={enemy.icon}
                alt={enemy.name}
                className="w-full h-full object-cover pixelated hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <span className="text-4xl">💀</span>
            )}
          </div>
          {
            // Level Badge
          }
          <div className="absolute -bottom-3 -right-3 bg-slate-800 border border-slate-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Lvl {enemy.level}
          </div>
        </div>

        {
          // Name and Info
        }
        <div className="text-center">
          <h2 className="text-xl font-black text-red-400 uppercase tracking-wide">
            {enemy.name}
          </h2>
          <div className="text-slate-500 text-xs mt-1 font-mono">
            XP: <span className="text-emerald-400">{enemy.xpReward}</span>
          </div>
        </div>
      </div>

      {
        // HP Bar Section
      }
      <div className="mt-4 w-full">
        <div className="flex justify-between text-xs font-bold mb-1 px-1">
          <span className="text-slate-400">HP</span>
          <span className="text-slate-300">
            {Math.ceil(combatStats.enemyCurrentHp)} / {enemy.maxHp}
          </span>
        </div>
        <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
          {
            // Background bar with red glow effect
          }
          <div
            className="h-full bg-red-600 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
