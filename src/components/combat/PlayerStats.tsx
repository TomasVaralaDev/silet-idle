import { useGameStore } from '../../store/useGameStore';
import { getRequiredXpForLevel } from '../../utils/gameUtils'; // <-- UUSI IMPORT

export default function PlayerStats() {
  const { skills, combatStats, username } = useGameStore();

  // Lasketaan max HP oikein (Esim. Lvl 10 = 100 + (10*10) = 200 HP? Vai miten se oli?)
  // CombatSystemissä laskit: 100 + (skills.hitpoints.level * 10). Käytetään sitä.
  const currentHpLevel = skills.hitpoints?.level || 10;
  const maxHp = 100 + (currentHpLevel * 10); 
  const currentHp = combatStats.hp;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  // Ota myös Hitpointsin oikea XP esiin, jotta näet tarkan tilanteen
  const hitpointsXp = skills.hitpoints?.xp || 0;
  const hitpointsReq = getRequiredXpForLevel(currentHpLevel);
  const hpXpPercent = Math.min(100, (hitpointsXp / hitpointsReq) * 100);

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-emerald-900/20 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0">
          <span className="text-xl">👤</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-slate-200 truncate">{username}</h3>
          
          {/* UUSI: Näytetään HP:n todellinen levutus XP-palkin kanssa */}
          <div className="text-xs text-slate-500 flex justify-between mt-1">
            <span>HP Lvl: <span className="text-white font-mono">{currentHpLevel}</span></span>
            <span className="font-mono text-[9px]">{Math.floor(hitpointsXp)} / {hitpointsReq} XP</span>
          </div>
          <div className="h-1 bg-slate-950 rounded-full mt-1 border border-slate-800">
             <div className="h-full bg-cyan-500" style={{ width: `${hpXpPercent}%`}} />
          </div>
        </div>
      </div>

      {/* Health Palkki (HP, ei XP) */}
      <div className="space-y-1 mt-3">
        <div className="flex justify-between text-xs font-bold px-1">
          <span className="text-red-400">Health</span>
          <span className="text-slate-300">
            {Math.floor(currentHp)} / {maxHp}
          </span>
        </div>
        <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-red-500 transition-all duration-100 ease-linear"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Pieni status grid */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/50">
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">ATK</div>
          <div className="font-mono text-sm font-bold text-slate-300">{skills.attack?.level || 1}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">DEF</div>
          <div className="font-mono text-sm font-bold text-slate-300">{skills.defense?.level || 1}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">STR</div>
          <div className="font-mono text-sm font-bold text-slate-300">{skills.melee?.level || 1}</div>
        </div>
      </div>
    </div>
  );
}