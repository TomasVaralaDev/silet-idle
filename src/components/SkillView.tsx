import { useState } from 'react';
import type { SkillType, ActiveAction, GameState, Resource, Ingredient } from '../types';
import { GAME_DATA, getItemDetails } from '../data';

interface SkillViewProps {
  skill: SkillType;
  level: number;
  xp: number;
  activeAction: ActiveAction | null;
  inventory: GameState['inventory'];
  onToggleAction: (skill: SkillType, resourceId: string) => void;
  speedMultiplier: number;
  nextLevelXp: number;
  maxMapCompleted: number;
}

export default function SkillView({ skill, level, xp, activeAction, inventory, onToggleAction, speedMultiplier, nextLevelXp, maxMapCompleted }: SkillViewProps) {
  
  // Tila Foundry-tabeille (Smithing) - PÄIVITETTY: Lisätty 'rings'
  const [smithingMode, setSmithingMode] = useState<'smelting' | 'forging' | 'rings'>('smelting');
  
  // Tila Assembly-tabeille (Crafting)
  const [assemblyMode, setAssemblyMode] = useState<'refining' | 'creation' | 'jewelry'>('refining');
  
  const [searchQuery, setSearchQuery] = useState('');

  const getSkillName = (s: SkillType) => {
    switch(s) {
      case 'woodcutting': return 'Excavation Protocol';
      case 'mining': return 'Salvage Operations';
      case 'fishing': return 'Gathering Systems';
      case 'farming': return 'Bio-Cultivation';
      case 'crafting': return 'Assembly Protocol';
      case 'smithing': return 'Foundry Protocol';
      case 'cooking': return 'Energy Refining';
      default: return 'Unknown Protocol';
    }
  };

  const getThemeColors = (s: SkillType) => {
    switch (s) {
      case 'woodcutting': return { bg: 'bg-emerald-900', border: 'border-emerald-800', text: 'text-emerald-400' };
      case 'mining': return { bg: 'bg-amber-900', border: 'border-amber-800', text: 'text-amber-400' };
      case 'fishing': return { bg: 'bg-cyan-900', border: 'border-cyan-800', text: 'text-cyan-400' };
      case 'farming': return { bg: 'bg-lime-900', border: 'border-lime-800', text: 'text-lime-400' };
      case 'crafting': return { bg: 'bg-amber-900/60', border: 'border-amber-700', text: 'text-amber-200' };
      case 'smithing': return { bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-400' };
      case 'cooking': return { bg: 'bg-orange-900', border: 'border-orange-800', text: 'text-orange-400' };
      default: return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400' };
    }
  };

  const isResourceSkill = (s: string): s is keyof typeof GAME_DATA => {
    return s in GAME_DATA;
  };

  if (!isResourceSkill(skill)) {
    return (
      <div className="p-10 text-center text-slate-500 font-mono text-sm uppercase tracking-widest">
        // Protocol Mismatch: Combat System Required //
      </div>
    );
  }

  const theme = getThemeColors(skill);
  const resources = GAME_DATA[skill];

  const filteredResources = resources.filter((resource: Resource) => {
    // 1. Hakufiltteri
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Smithing Tabit (Foundry) - PÄIVITETTY LOGIIKKA
    if (skill === 'smithing') {
      if (smithingMode === 'smelting') {
        // Näytä vain Harkot (tunnistetaan ID:n päätteestä)
        return resource.id.includes('_smelted');
      }
      if (smithingMode === 'forging') {
        // Näytä vain Armor (kategoria 'armor')
        return resource.category === 'armor';
      }
      if (smithingMode === 'rings') {
        // Näytä vain Sormukset (kategoria 'rings')
        return resource.category === 'rings';
      }
    }

    // 3. Crafting Tabit (Assembly)
    if (skill === 'crafting') {
      if (assemblyMode === 'refining') {
        return resource.category === 'wood_refining';
      }
      if (assemblyMode === 'creation') {
        return resource.category === 'weapons';
      }
      if (assemblyMode === 'jewelry') {
        return resource.category === 'jewelry';
      }
    }

    return true;
  });

  return (
    <div className="p-6 h-full flex flex-col bg-slate-950 overflow-y-auto custom-scrollbar">
      
      {/* HEADER */}
      <header className="mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none grayscale">
           <img src={`/assets/skills/${skill}.png`} className="w-32 h-32 pixelated" alt="Background Icon" />
        </div>
        
        <div className="flex justify-between items-end mb-5 relative z-10">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 flex items-center justify-center bg-slate-950 rounded-xl border-2 ${theme.border} shadow-lg`}>
               <img src={`/assets/skills/${skill}.png`} className="w-10 h-10 pixelated drop-shadow-md" alt={skill} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold uppercase tracking-widest ${theme.text} mb-1`}>
                {getSkillName(skill)}
              </h2>
              <p className="text-xs text-slate-500 font-mono tracking-widest uppercase font-bold">System Stability: Lv.{level}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-mono font-bold mb-1">PROGRESS TO NEXT TIER</div>
            <div className={`text-xl font-mono ${theme.text}`}>{Math.floor(xp)} / {nextLevelXp}</div>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
          <div className={`h-full transition-all duration-300 ${theme.bg} opacity-90`} style={{ width: `${(xp / nextLevelXp) * 100}%` }}></div>
        </div>

        {speedMultiplier < 1 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase bg-emerald-950/30 w-fit px-3 py-1 rounded-lg border border-emerald-900/50">
            <span className="animate-pulse">●</span> 
            Overclocking Active: +{Math.round((1 - speedMultiplier) * 100)}% Speed
          </div>
        )}
      </header>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4 border-b border-slate-800 pb-2">
        
        {/* SMITHING TABS - PÄIVITETTY */}
        {skill === 'smithing' ? (
          <div className="flex gap-2">
            <button
              onClick={() => setSmithingMode('smelting')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg flex items-center gap-2
                ${smithingMode === 'smelting' 
                  ? 'bg-red-900/40 text-red-200 border-t-2 border-x border-red-700/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
              <span>🔥</span> Smelting
            </button>
            <button
              onClick={() => setSmithingMode('forging')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg flex items-center gap-2
                ${smithingMode === 'forging' 
                  ? 'bg-slate-700/40 text-slate-200 border-t-2 border-x border-slate-500/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
              <span>⚒️</span> Forging
            </button>
            <button
              onClick={() => setSmithingMode('rings')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg flex items-center gap-2
                ${smithingMode === 'rings' 
                  ? 'bg-indigo-900/40 text-indigo-200 border-t-2 border-x border-indigo-700/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
              <span>💍</span> Rings
            </button>
          </div>
        ) 
        // CRAFTING (ASSEMBLY) TABS
        : skill === 'crafting' ? (
          <div className="flex gap-2">
            <button
              onClick={() => setAssemblyMode('refining')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg flex items-center gap-2
                ${assemblyMode === 'refining' 
                  ? 'bg-amber-900/40 text-amber-200 border-t-2 border-x border-amber-700/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
              <span>🪚</span> Refining
            </button>
            <button
              onClick={() => setAssemblyMode('creation')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg flex items-center gap-2
                ${assemblyMode === 'creation' 
                  ? 'bg-slate-700/40 text-slate-200 border-t-2 border-x border-slate-500/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
              <span>⚔️</span> Creation
            </button>
            <button
              onClick={() => setAssemblyMode('jewelry')}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg flex items-center gap-2
                ${assemblyMode === 'jewelry' 
                  ? 'bg-purple-900/40 text-purple-200 border-t-2 border-x border-purple-700/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
              <span>💎</span> Jewelry
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono uppercase tracking-widest py-2">
            Available Operations
          </div>
        )}

        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search protocols..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all font-mono"
          />
          <span className="absolute right-3 top-2 text-slate-600 text-xs">🔍</span>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 pb-10">
        {filteredResources.length === 0 && (
          <div className="col-span-full py-12 text-center border border-slate-800 rounded-xl bg-slate-900/50 border-dashed">
            <p className="text-slate-500 text-sm font-mono uppercase tracking-wider">No protocols found in this sector.</p>
          </div>
        )}

        {filteredResources.map((resource: Resource) => {
          const isLevelLocked = level < resource.levelRequired;
          const isMapLocked = resource.requiresMapCompletion ? maxMapCompleted < resource.requiresMapCompletion : false;
          const isActive = activeAction?.resourceId === resource.id;
          const currentInterval = resource.interval * speedMultiplier;
          const canAfford = resource.inputs ? resource.inputs.every((req: Ingredient) => (inventory[req.id] || 0) >= req.count) : true;
          const isLocked = isLevelLocked || isMapLocked;
          
          const lockedText = isMapLocked 
             ? `REQ: ZONE ${resource.requiresMapCompletion}` 
             : `REQ: LVL ${resource.levelRequired}`;

          // Use actionImage if available (for Trees), otherwise standard icon
          const displayImage = resource.actionImage || resource.icon;

          return (
            <div key={resource.id} className={`relative p-4 rounded-xl border-2 transition-all duration-200 group flex flex-col min-h-[220px]
              ${isLocked 
                ? 'bg-slate-950 border-slate-800 opacity-50 grayscale cursor-not-allowed' 
                : isActive 
                  ? `bg-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]` 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex gap-5 mb-4 flex-1">
                
                {/* --- LEFT: BIG ACTION IMAGE --- */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-slate-950 rounded-xl border border-slate-700 shadow-inner flex items-center justify-center relative overflow-hidden">
                    <img src={displayImage} alt={resource.name} className="w-20 h-20 pixelated drop-shadow-xl object-contain transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>

                {/* --- RIGHT: CONTENT --- */}
                <div className="flex-1 flex flex-col justify-between">
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wide leading-tight mb-1">{resource.name}</h3>
                    <p className="text-xs text-slate-500 leading-snug italic mb-3">"{resource.description}"</p>
                    
                    {/* Effects / Stats Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {resource.stats?.attack && <span className="text-[10px] font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-900/50">FORCE +{resource.stats.attack}</span>}
                        {resource.stats?.defense && <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">SHIELD +{resource.stats.defense}</span>}
                        {resource.healing && <span className="text-[10px] font-bold text-green-400 bg-green-950/40 px-2 py-0.5 rounded border border-green-900/50">REPAIR +{resource.healing}</span>}
                    </div>

                    {/* Requirements */}
                    {resource.inputs && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {resource.inputs.map((input: Ingredient) => {
                           const inputItem = getItemDetails(input.id);
                           const hasEnough = (inventory[input.id] || 0) >= input.count;
                           return (
                             <div 
                               key={input.id} 
                               className={`relative group/item flex items-center gap-2 px-3 py-1.5 rounded-md border-2 cursor-help transition-colors
                                 ${hasEnough 
                                   ? 'bg-slate-950/50 border-slate-700 text-slate-300 hover:border-slate-500' 
                                   : 'bg-red-950/20 border-red-900/50 text-red-400 hover:border-red-800'
                                 }`}
                             >
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/item:block bg-slate-900 text-slate-200 text-xs px-2 py-1 rounded border border-slate-600 shadow-xl z-50 whitespace-nowrap">
                                 {inputItem?.name}
                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
                               </div>

                               {inputItem && <img src={inputItem.icon} className="w-5 h-5 pixelated drop-shadow-md" alt="mat" />}
                               <span className="text-xs font-mono font-bold">
                                 {inventory[input.id] || 0}/{input.count}
                               </span>
                             </div>
                           );
                        })}
                      </div>
                    )}
                  </div>

                  {/* --- STATS --- */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    
                    <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Time</span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {isLocked ? '--' : `${(currentInterval / 1000).toFixed(1)}s`}
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] font-bold text-cyan-700 uppercase tracking-wider mb-0.5">Exp</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">+{resource.xpReward}</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Out</span>
                      <div className="flex items-center gap-1">
                        {/* Always use icon for output */}
                        <img src={resource.icon} className="w-4 h-4 pixelated" alt="Out" />
                        <span className="text-xs font-bold text-slate-300">1x</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                <button 
                  disabled={isLocked || (resource.inputs && !canAfford && !isActive)} 
                  onClick={() => onToggleAction(skill, resource.id)} 
                  className={`w-full py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-lg border-2
                    ${isActive 
                      ? 'bg-red-950/30 text-red-400 border-red-500/50 hover:bg-red-900/50' 
                      : isLocked 
                        ? 'bg-transparent text-slate-600 border-slate-800' 
                        : !canAfford && resource.inputs
                          ? 'bg-transparent text-slate-500 border-slate-700'
                          : 'bg-slate-900 text-cyan-400 border-cyan-800 hover:bg-cyan-950 hover:border-cyan-500 hover:text-cyan-100 shadow-lg'
                    }`}
                >
                  {isActive ? 'TERMINATE PROCESS' : isLocked ? lockedText : (resource.inputs && !canAfford) ? 'INSUFFICIENT MATTER' : 'INITIATE PROCESS'}
                </button>
              </div>
              
              {/* Active Animation Bar - FIXED */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-900 rounded-b-xl overflow-hidden z-20">
                   <div 
                     className={`h-full ${theme.bg} origin-left`} 
                     style={{ 
                        width: '100%',
                        animation: `progress ${currentInterval}ms linear infinite` 
                     }}
                   ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- ANIMATION KEYFRAMES --- */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}