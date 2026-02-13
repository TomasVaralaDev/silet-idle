import { useGameStore } from '../../store/useGameStore';

export default function PlayerStats() {
  const { skills, combatStats, username } = useGameStore();

  // Lasketaan max HP (esim. Level 10 = 100 HP)
  const maxHp = skills.hitpoints.level * 10;
  const currentHp = combatStats.hp;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
      <div className="flex items-center gap-3 mb-4">
        {/* Pelaajan avatar (placeholder) */}
        <div className="w-12 h-12 bg-emerald-900/20 rounded-full border border-emerald-500/30 flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-slate-200 truncate">{username}</h3>
          <div className="text-xs text-slate-500">
            Hitpoints Lvl: <span className="text-white font-mono">{skills.hitpoints.level}</span>
          </div>
        </div>
      </div>

      {/* Oma HP Palkki */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold px-1">
          <span className="text-emerald-400">Hitpoints</span>
          <span className="text-slate-300">
            {Math.floor(currentHp)} / {maxHp}
          </span>
        </div>
        <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Pieni status grid */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/50">
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">ATK</div>
          <div className="font-mono text-sm font-bold text-slate-300">{skills.attack.level}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">STR</div>
          <div className="font-mono text-sm font-bold text-slate-300">{skills.melee.level}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">DEF</div>
          <div className="font-mono text-sm font-bold text-slate-300">{skills.defense.level}</div>
        </div>
      </div>
    </div>
  );
}