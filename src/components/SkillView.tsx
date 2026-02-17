import { useGameStore } from '../store/useGameStore';
import { GAME_DATA } from '../data/skills';
import { getItemDetails } from '../data'; // <--- TÄRKEÄ: Importtaa tämä itemien tietojen hakua varten
import { SKILL_DEFINITIONS } from '../config/skillDefinitions';
import type { SkillType } from '../types';

interface SkillViewProps {
  skill: SkillType;
}

export default function SkillView({ skill }: SkillViewProps) {
  const { skills, activeAction, setState } = useGameStore();

  const definition = SKILL_DEFINITIONS.find(d => d.id === skill);
  const resources = GAME_DATA[skill] || [];

  if (!definition) return <div className="p-10 text-red-500">Skill config missing</div>;

  const skillState = skills[skill] || { level: 1, xp: 0 };
  const currentLevel = skillState.level;
  const nextLevelXp = currentLevel * 150;
  const progressPercent = Math.min(100, Math.max(0, (skillState.xp / nextLevelXp) * 100));

  const handleStartAction = (resourceId: string, interval: number) => {
    if (activeAction?.resourceId === resourceId) {
      setState({ activeAction: null });
    } else {
      setState({
        activeAction: { skill, resourceId, progress: 0, targetTime: interval }
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      
      {/* HEADER */}
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${definition.bgColor} shadow-lg shrink-0`}>
          <img src={definition.icon} className="w-10 h-10 pixelated" alt={definition.sidebarLabel} />
        </div>
        <div className="flex-1">
          <h1 className={`text-3xl font-bold uppercase tracking-widest ${definition.color} mb-1`}>{definition.sidebarLabel}</h1>
          <p className="text-slate-500 text-sm font-medium">{definition.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-200">Level {currentLevel}</div>
          <div className="text-xs font-mono text-slate-500 mt-1">
            {Math.floor(skillState.xp).toLocaleString()} / {nextLevelXp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* GLOBAL PROGRESS BAR */}
      <div className="h-1 bg-slate-900 w-full shrink-0">
        <div className={`h-full ${definition.bgColor} transition-all duration-300 shadow-[0_0_10px_currentColor]`} style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* RESOURCES GRID */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resources.map((resource) => {
            const isUnlocked = currentLevel >= (resource.level || 1);
            const isActive = activeAction?.resourceId === resource.id;
            const progress = isActive && activeAction ? (activeAction.progress / activeAction.targetTime) * 100 : 0;
            
            // Tarkistetaan onko dropseja määritelty
            const hasDrops = resource.drops && resource.drops.length > 0;

            return (
              <button
                key={resource.id}
                onClick={() => isUnlocked && handleStartAction(resource.id, resource.interval || 3000)}
                disabled={!isUnlocked}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col h-full group
                  ${isActive 
                    ? `bg-slate-900 border-${definition.color.split('-')[1]}-500 shadow-[0_0_20px_rgba(0,0,0,0.4)] scale-[1.02] z-10` 
                    : isUnlocked 
                      ? 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-900' 
                      : 'bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed grayscale'}
                `}
              >
                {/* ICON SECTION */}
                <div className="flex items-start justify-between mb-4 w-full relative">
                  
                  {/* --- TÄSSÄ ON UUSI LOGIIKKA KUVIEN NÄYTTÄMISEEN --- */}
                  <div className={`min-w-[3.5rem] min-h-[3.5rem] rounded-lg bg-slate-950 flex flex-wrap items-center justify-center border border-slate-800 shrink-0 relative overflow-hidden gap-1 p-1`}>
                    
                    {hasDrops ? (
                      // Jos on dropseja, näytetään ne kaikki pieninä
                      resource.drops!.map((drop, index) => {
                        // Haetaan itemin tiedot jotta saadaan ikoni
                        const itemDetails = getItemDetails(drop.itemId);
                        const iconPath = itemDetails?.icon || '/assets/ui/icon_missing.png';
                        
                        return (
                          <div key={index} className="relative group/drop" title={`${drop.chance}% chance`}>
                            <img 
                              src={iconPath} 
                              className="w-5 h-5 pixelated object-contain" 
                              alt={drop.itemId} 
                            />
                            {/* Pieni prosentti jos alle 100% */}
                            {drop.chance < 100 && (
                              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold text-cyan-300 bg-slate-900/80 px-0.5 rounded">
                                {drop.chance}%
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      // Jos ei dropseja, näytetään vanha isona
                      <img 
                        src={isActive && resource.actionImage ? resource.actionImage : resource.icon} 
                        className={`w-10 h-10 pixelated transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} 
                        alt={resource.name} 
                      />
                    )}

                  </div>
                  {/* -------------------------------------------------- */}
                  
                  {isActive && (
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 animate-pulse ml-2">
                      ACTIVE
                    </span>
                  )}
                  {!isUnlocked && (
                    <span className="px-2 py-1 rounded bg-red-900/20 text-red-400 text-[10px] font-bold border border-red-900/30 ml-2">
                      LVL {resource.level}
                    </span>
                  )}
                </div>

                <div className="mb-4 flex-1">
                  <h3 className={`font-bold text-sm ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>{resource.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{resource.description}</p>
                </div>

                {isUnlocked && (
                  <div className="mt-auto pt-3 border-t border-slate-800/50 w-full">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-cyan-400">+{resource.xpReward} XP</span>
                      <span className="font-bold text-slate-500">{(resource.interval! / 1000).toFixed(1)}s</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isActive ? definition.bgColor : 'bg-transparent'} transition-all duration-100 ease-linear`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}