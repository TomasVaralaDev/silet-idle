import { useGameStore } from '../../store/useGameStore';
import { WORLD_INFO } from '../../data/worlds';

export default function BattleArena({ selectedWorldId }: { selectedWorldId: number }) {
  const { enemy, combatStats, stopCombat, skills } = useGameStore();

  // KORJAUS: Käytetään taustana VAIN Worldin kuvaa.
  // Poistettu 'currentMap.image', jotta mobin kuva ei vahingossa tule taustaksi.
  const bgImage = WORLD_INFO[selectedWorldId]?.image || '';

  const playerMaxHp = skills.hitpoints.level * 10;
  const playerHpPercent = Math.max(0, (combatStats.hp / playerMaxHp) * 100);
  const enemyMaxHp = enemy?.maxHp || 100;
  const enemyHpPercent = Math.max(0, (combatStats.enemyCurrentHp / enemyMaxHp) * 100);

  return (
    <div className="h-full w-full relative bg-slate-950 select-none">
      {/* 1. TAUSTAKUVA */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20"></div>
      </div>

      {/* 2. PELIKENTTÄ */}
      <div className="relative h-full w-full flex justify-between items-end pb-12 px-16 max-w-6xl mx-auto">
        
        {/* --- PELAAJA (Vasen) --- */}
        <div className="flex flex-col items-center gap-3 relative group">
          {/* HP Palkki */}
          <div className="w-32 h-2.5 bg-slate-950/80 rounded border border-slate-700 overflow-hidden mb-1 relative shadow-lg">
             <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${playerHpPercent}%` }}></div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 mb-2">
            {Math.ceil(combatStats.hp)} / {playerMaxHp}
          </div>
          
          {/* Hahmo */}
          <div className="w-24 h-24 relative flex items-center justify-center">
             <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transform scale-x-[-1]">🧙‍♂️</div>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/60 blur-md rounded-full"></div>
          </div>

          <button 
            onClick={stopCombat} 
            className="mt-2 text-[10px] uppercase font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded border border-red-500/20 transition-colors"
          >
            Retreat
          </button>
        </div>

        {/* --- VS / INFO --- */}
        <div className="mb-20 flex flex-col items-center gap-2">
            {combatStats.respawnTimer > 0 && (
                <div className="px-4 py-1 bg-black/80 rounded border border-yellow-500/30 text-yellow-400 text-xs font-mono font-bold animate-pulse shadow-lg">
                    RESPAWN {(combatStats.respawnTimer / 1000).toFixed(1)}s
                </div>
            )}
        </div>

        {/* --- VIHOLLINEN (Oikea) --- */}
        <div className="flex flex-col items-center gap-3 relative min-w-[128px]">
          {enemy ? (
             <div className="flex flex-col items-center animate-in fade-in duration-500 slide-in-from-right-4">
                {/* Enemy HP Bar */}
                <div className="w-32 h-2.5 bg-slate-950/80 rounded border border-slate-700 overflow-hidden mb-1 relative shadow-lg">
                   <div className="h-full bg-red-600 transition-all duration-100" style={{ width: `${enemyHpPercent}%` }}></div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 mb-2">
                   {Math.ceil(combatStats.enemyCurrentHp)} / {enemyMaxHp}
                </div>

                {/* Enemy Sprite */}
                <div className={`w-24 h-24 relative flex items-center justify-center transition-all duration-200 ${combatStats.enemyCurrentHp <= 0 ? 'opacity-0 scale-90 grayscale' : 'opacity-100 scale-100'}`}>
                    {enemy.icon ? (
                        <img src={enemy.icon} className="w-20 h-20 object-contain pixelated drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]" alt={enemy.name} />
                    ) : (
                        <span className="text-6xl filter drop-shadow-lg">👾</span>
                    )}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/60 blur-md rounded-full"></div>
                </div>

                <div className="bg-black/60 px-3 py-1 rounded text-[10px] font-bold border border-red-900/30 text-red-200 mt-2 backdrop-blur-sm">
                    {enemy.name} <span className="text-slate-500 ml-1">Lvl {enemy.level}</span>
                </div>
             </div>
          ) : (
             !combatStats.respawnTimer && (
                 <div className="opacity-30 text-slate-500 text-xs font-mono mt-20 flex flex-col items-center gap-2">
                    <span className="text-2xl">⚔️</span>
                    <span>NO TARGET</span>
                 </div>
             )
          )}
        </div>

      </div>
    </div>
  );
}