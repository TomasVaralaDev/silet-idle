import { useState } from 'react'; // Poistettu useEffect import
import { useGameStore } from '../store/useGameStore';
import { GAME_DATA } from '../data/skills';
import { getItemDetails } from '../data';
import { SKILL_DEFINITIONS } from '../config/skillDefinitions';
import type { SkillType, Resource } from '../types';

interface SkillViewProps {
  skill: SkillType;
}

// Määritellään kategoriat ja filtteröintilogiikka
const SKILL_CATEGORIES: Record<string, { id: string; label: string; filter: (r: Resource) => boolean }[]> = {
  smithing: [
    { id: 'all', label: 'All', filter: () => true },
    { id: 'smelting', label: 'Smelting', filter: (r) => !r.slot && !r.category?.includes('refining') },
    { id: 'head', label: 'Helmets', filter: (r) => r.slot === 'head' },
    { id: 'body', label: 'Body', filter: (r) => r.slot === 'body' },
    { id: 'legs', label: 'Legs', filter: (r) => r.slot === 'legs' },
    { id: 'shield', label: 'Shields', filter: (r) => r.slot === 'shield' },
    { id: 'ring', label: 'Rings', filter: (r) => r.slot === 'ring' },
  ],
  crafting: [
    { id: 'all', label: 'All', filter: () => true },
    { id: 'refining', label: 'Wood Refining', filter: (r) => r.category === 'wood_refining' },
    { id: 'swords', label: 'Swords', filter: (r) => r.combatStyle === 'melee' },
    { id: 'bows', label: 'Bows', filter: (r) => r.combatStyle === 'ranged' },
    { id: 'staffs', label: 'Staffs', filter: (r) => r.combatStyle === 'magic' },
    { id: 'necklace', label: 'Necklaces', filter: (r) => r.slot === 'necklace' },
  ]
};

export default function SkillView({ skill }: SkillViewProps) {
  const { skills, activeAction, inventory, setState } = useGameStore();
  
  // State aktiiviselle kategorialle
  const [activeCategory, setActiveCategory] = useState('all');
  
  // KORJAUS 1: Seurataan edellistä skilliä tilassa
  const [prevSkill, setPrevSkill] = useState(skill);

  // KORJAUS 1: Jos skill vaihtuu, nollataan kategoria HETI (ennen renderöintiä)
  if (skill !== prevSkill) {
    setPrevSkill(skill);
    setActiveCategory('all');
  }

  const definition = SKILL_DEFINITIONS.find(d => d.id === skill);
  const resources = GAME_DATA[skill] || [];

  if (!definition) return <div className="p-10 text-red-500">Config missing</div>;

  const skillState = skills[skill] || { level: 1, xp: 0 };
  const currentLevel = skillState.level;
  const nextLevelXp = currentLevel * 150;
  const progressPercent = Math.min(100, Math.max(0, (skillState.xp / nextLevelXp) * 100));

  const categories = SKILL_CATEGORIES[skill];

  const filteredResources = resources.filter(resource => {
    if (!categories) return true;
    const currentFilter = categories.find(c => c.id === activeCategory);
    return currentFilter ? currentFilter.filter(resource) : true;
  });

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

      <div className="h-1 bg-slate-900 w-full shrink-0">
        <div className={`h-full ${definition.bgColor} transition-all duration-300 shadow-[0_0_10px_currentColor]`} style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* TABS */}
      {categories && (
        <div className="px-6 pt-4 flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                ${activeCategory === cat.id 
                  ? 'bg-slate-200 text-slate-900' 
                  : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* GRID */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.map((resource) => {
            const isUnlocked = currentLevel >= (resource.level || 1);
            const isActive = activeAction?.resourceId === resource.id;
            const progress = isActive && activeAction ? (activeAction.progress / activeAction.targetTime) * 100 : 0;
            
            let canAfford = true;
            if (resource.inputs) {
              canAfford = resource.inputs.every(input => (inventory[input.id] || 0) >= input.count);
            }

            const hasDrops = resource.drops && resource.drops.length > 0;
            const isDisabled = !isUnlocked || !canAfford;

            return (
              <button
                key={resource.id}
                onClick={() => !isDisabled && handleStartAction(resource.id, resource.interval || 3000)}
                disabled={isDisabled}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col h-full group
                  ${isActive 
                    ? `bg-slate-900 border-${definition.color.split('-')[1]}-500 shadow-[0_0_20px_rgba(0,0,0,0.4)] scale-[1.02] z-10` 
                    : isDisabled
                      ? 'bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed grayscale'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-900'}
                `}
              >
                <div className="flex items-start justify-between mb-4 w-full relative">
                  <div className={`min-w-[3.5rem] min-h-[3.5rem] rounded-lg bg-slate-950 flex flex-wrap items-center justify-center border border-slate-800 shrink-0 relative overflow-hidden gap-1 p-1`}>
                    {hasDrops ? (
                      resource.drops!.map((drop, index) => {
                        const itemDetails = getItemDetails(drop.itemId);
                        const iconPath = itemDetails?.icon || '/assets/ui/icon_missing.png';
                        return (
                          <div key={index} className="relative group/drop" title={`${drop.chance}%`}>
                            <img src={iconPath} className="w-5 h-5 pixelated object-contain" alt={drop.itemId} />
                          </div>
                        );
                      })
                    ) : (
                      <img src={isActive && resource.actionImage ? resource.actionImage : resource.icon} className={`w-10 h-10 pixelated transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} alt={resource.name} />
                    )}
                  </div>
                  
                  {isActive && <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 animate-pulse ml-2">ACTIVE</span>}
                  
                  {!isUnlocked ? (
                    <span className="px-2 py-1 rounded bg-red-900/20 text-red-400 text-[10px] font-bold border border-red-900/30 ml-2">LVL {resource.level}</span>
                  ) : !canAfford ? (
                    <span className="px-2 py-1 rounded bg-orange-900/20 text-orange-400 text-[10px] font-bold border border-orange-900/30 ml-2">COST</span>
                  ) : null}
                </div>

                <div className="mb-4 flex-1">
                  <h3 className={`font-bold text-sm ${!isDisabled ? 'text-slate-200' : 'text-slate-600'}`}>{resource.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{resource.description}</p>
                </div>

                {resource.inputs && (
                  <div className="mb-3 p-2 bg-slate-950/50 rounded border border-slate-800/50">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Requires:</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.inputs.map((input) => {
                         const item = getItemDetails(input.id);
                         const have = inventory[input.id] || 0;
                         const hasEnough = have >= input.count;
                         return (
                           <div key={input.id} className={`text-xs flex items-center gap-1 ${hasEnough ? 'text-slate-300' : 'text-red-400'}`}>
                             <img src={item?.icon} className="w-3 h-3 pixelated" />
                             <span>{have}/{input.count}</span>
                           </div>
                         );
                      })}
                    </div>
                  </div>
                )}

                {isUnlocked && (
                  <div className="mt-auto pt-3 border-t border-slate-800/50 w-full">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-cyan-400">+{resource.xpReward} XP</span>
                      <span className="font-bold text-slate-500">{(resource.interval! / 1000).toFixed(1)}s</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${isActive ? definition.bgColor : 'bg-transparent'} transition-all duration-100 ease-linear`} style={{ width: `${progress}%` }} />
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