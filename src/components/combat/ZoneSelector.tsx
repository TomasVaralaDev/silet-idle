import { useGameStore } from '../../store/useGameStore';
import { COMBAT_DATA } from '../../data/combat';
import type { CombatMap } from '../../types';

interface Props {
  selectedWorldId: number;
}

export default function ZoneSelector({ selectedWorldId }: Props) {
  const startCombat = useGameStore(state => state.startCombat);
  const stopCombat = useGameStore(state => state.stopCombat);
  const combatStats = useGameStore(state => state.combatStats);
  const combatSettings = useGameStore(state => state.combatSettings);
  const toggleAutoProgress = useGameStore(state => state.toggleAutoProgress);

  const zones = COMBAT_DATA.filter((map: CombatMap) => map.world === selectedWorldId);

  return (
    <div className="flex flex-col h-full">
      {/* AUTO PROGRESS */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 mb-4 flex items-center justify-between">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Auto-Progress</div>
        <button 
          onClick={toggleAutoProgress}
          className={`w-10 h-5 rounded-full relative transition-colors ${combatSettings.autoProgress ? 'bg-emerald-600' : 'bg-slate-800'}`}
        >
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${combatSettings.autoProgress ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* MAP LIST WITH ENEMY ICONS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 pb-6">
        {zones.map((map: CombatMap) => {
          const isRunning = combatStats.currentMapId === map.id;

          return (
            <button
              key={map.id}
              onClick={() => isRunning ? stopCombat() : startCombat(map.id)}
              className={`
                w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between
                ${isRunning 
                  ? 'bg-emerald-900/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-600 hover:bg-slate-800/40'
                }
              `}
            >
              <div className="flex-1 min-w-0 pr-2">
                <h4 className={`font-bold text-[13px] truncate ${isRunning ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {map.name}
                </h4>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <p className="text-[10px] text-slate-400 truncate">Target: {map.enemyName}</p>
                  <p className="text-[9px] font-mono text-slate-500">HP: {map.enemyHp} | ATK: {map.enemyAttack}</p>
                </div>
              </div>

              {/* PALAUTETTU ENEMY ICON */}
              <div className={`
                w-10 h-10 rounded-lg bg-slate-950 border flex items-center justify-center shrink-0
                ${isRunning ? 'border-emerald-500/50' : 'border-slate-800'}
              `}>
                <img src={map.image} alt={map.enemyName} className="w-8 h-8 pixelated" />
              </div>

              {isRunning && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}