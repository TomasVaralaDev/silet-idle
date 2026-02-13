import { useGameStore } from '../../store/useGameStore';
import { WORLD_INFO } from '../../data/worlds';

export default function BattleArena({ selectedWorldId }: { selectedWorldId: number }) {
  const enemy = useGameStore(state => state.enemy);
  const combatStats = useGameStore(state => state.combatStats);
  const stopCombat = useGameStore(state => state.stopCombat);
  const skills = useGameStore(state => state.skills);

  // KAIKKI INTERVALLIKOODI POISTETTU TÄSTÄ.
  // Peli käyttää App.tsx -> useGameEngine():ä tai vastaavaa globaalia kelloa.

  const bgImage = WORLD_INFO[selectedWorldId]?.image || '';
  const playerMaxHp = skills.hitpoints.level * 10;
  const playerHpPercent = Math.max(0, (combatStats.hp / playerMaxHp) * 100);
  const enemyMaxHp = enemy?.maxHp || 100;
  const enemyHpPercent = Math.max(0, (combatStats.enemyCurrentHp / enemyMaxHp) * 100);

  return (
    <div className="h-full w-full relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="relative z-10 h-full flex items-center justify-around p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-slate-900 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-4xl">🧙‍♂️</div>
          <div className="w-32 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${playerHpPercent}%` }} />
          </div>
          <button onClick={stopCombat} className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-4 py-1 rounded-full border border-red-500/20">Retreat</button>
        </div>

        <div className="text-4xl font-black text-slate-800 italic opacity-20">VS</div>

        <div className="flex flex-col items-center gap-4 min-w-[128px]">
          {enemy ? (
            <div className="flex flex-col items-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-slate-900 border-2 border-red-900/30 rounded-2xl flex items-center justify-center">
                <img src={enemy.icon} className="w-16 h-16 pixelated" alt={enemy.name} />
              </div>
              <div className="w-32 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-4">
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${enemyHpPercent}%` }} />
              </div>
              <div className="text-xs font-bold text-red-200 uppercase mt-2">{enemy.name}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 opacity-40">
               <div className="w-10 h-10 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-4" />
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {combatStats.respawnTimer > 0 ? `Respawning... ${combatStats.respawnTimer}s` : 'Searching...'}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}