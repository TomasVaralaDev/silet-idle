import { useGameStore } from '../store/useGameStore';
import { GAME_DATA } from '../data';
import { getSpeedMultiplier } from '../utils/gameUtils';
import type { SkillType, Resource, Ingredient } from '../types';

interface SkillViewProps {
  skill: SkillType;
}

type ResourceSkillType = Exclude<SkillType, 'hitpoints' | 'attack' | 'defense' | 'melee' | 'ranged' | 'magic' | 'combat' | 'scavenging'>;

export default function SkillView({ skill }: SkillViewProps) {
  const skillData = useGameStore(state => state.skills[skill]);
  const inventory = useGameStore(state => state.inventory);
  const activeAction = useGameStore(state => state.activeAction);
  const upgrades = useGameStore(state => state.upgrades);
  const maxMapCompleted = useGameStore(state => state.combatStats.maxMapCompleted);
  const toggleAction = useGameStore(state => state.toggleAction);

  const currentSpeedMult = getSpeedMultiplier(skill, upgrades);
  const nextLevelXp = skillData.level * 150;
  const progress = Math.min(100, Math.max(0, (skillData.xp / nextLevelXp) * 100));

  if (['hitpoints', 'attack', 'defense', 'melee', 'ranged', 'magic', 'combat', 'scavenging'].includes(skill)) {
    return <div className="p-6 text-slate-500 font-mono text-sm">Combat protocols are managed via Stabilization Systems.</div>;
  }

  const resources = GAME_DATA[skill as ResourceSkillType] || [];

  return (
    <div className="p-4 sm:p-6 h-full bg-slate-950 text-slate-200 overflow-y-auto custom-scrollbar">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/50 p-5 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 shadow-inner">
             <img src={`/assets/skills/${skill}.png`} alt={skill} className="w-9 h-9 pixelated opacity-90" />
          </div>
          <div>
            <h2 className="text-xl font-bold capitalize text-white tracking-widest">{skill}</h2>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-3 mt-1">
              <span className="text-emerald-500 font-bold">LEVEL {skillData.level}</span>
              <span className="opacity-50">|</span>
              <span>{Math.floor(skillData.xp).toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:block w-48">
          <div className="flex justify-between text-[10px] uppercase font-black text-slate-500 mb-1.5 tracking-tighter">
            <span>Sync Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* RESOURCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource: Resource) => {
          const isActive = activeAction?.skill === skill && activeAction?.resourceId === resource.id;
          const hasLevel = skillData.level >= (resource.level || 1);
          
          // KORJAUS: Lasketaan intervalli jakolaskulla (sama kuin useSkillLoopissa)
          const baseInterval = resource.interval || 3000;
          const intervalSeconds = Math.max(0.2, baseInterval / currentSpeedMult) / 1000;
          
          let canAfford = true;
          if (resource.inputs) {
            canAfford = resource.inputs.every((req: Ingredient) => (inventory[req.id] || 0) >= req.count);
          }

          const areaReq = resource.area ? (resource.area - 1) * 10 : 0;
          const areaUnlocked = maxMapCompleted >= areaReq;

          if (!hasLevel || !areaUnlocked) {
             return (
               <div key={resource.id} className="bg-slate-900/20 border border-slate-800/40 rounded-lg p-5 opacity-40 grayscale flex flex-col items-center justify-center min-h-[120px] border-dashed">
                  <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                    {!hasLevel ? `Requires Lvl ${resource.level}` : `Area Locked (Map ${areaReq})`}
                  </span>
               </div>
             );
          }

          return (
            <button
              key={resource.id}
              onClick={() => toggleAction(skill, resource.id)}
              disabled={!canAfford && !isActive}
              className={`relative p-5 rounded-lg border text-left transition-all duration-200 group overflow-hidden
                ${isActive 
                  ? 'bg-slate-800 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.1)]' 
                  : !canAfford 
                    ? 'bg-red-950/5 border-red-900/20 opacity-60 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                }
              `}
            >
              {/* PROGRESS BAR ANIMATION */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-emerald-500/50 z-10 animate-progress" 
                  style={{ animationDuration: `${intervalSeconds * 1000}ms` }}
                ></div>
              )}

              <div className="flex justify-between items-start mb-3 relative z-20">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded bg-slate-950 border border-slate-800 transition-transform ${isActive ? 'scale-110' : ''}`}>
                    <img src={resource.icon} alt={resource.name} className="w-10 h-10 pixelated object-contain" />
                  </div>
                  <div>
                    <div className={`font-bold text-sm tracking-wide ${isActive ? 'text-emerald-400' : 'text-slate-200'}`}>{resource.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{intervalSeconds.toFixed(2)}s cycle</div>
                  </div>
                </div>
                <div className="text-[9px] font-black bg-emerald-500/10 px-2 py-1 rounded text-emerald-500 border border-emerald-500/20">
                  +{resource.xpReward} XP
                </div>
              </div>

              {resource.inputs && (
                <div className="mt-4 pt-3 border-t border-slate-800/50">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {resource.inputs.map((input: Ingredient) => {
                      const hasEnough = (inventory[input.id] || 0) >= input.count;
                      return (
                        <div key={input.id} className={`text-[10px] font-mono flex items-center gap-1.5 ${hasEnough ? 'text-slate-400' : 'text-red-500'}`}>
                          <span className="font-bold">{input.count}x</span>
                          <span className="opacity-80">{input.id}</span> 
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}