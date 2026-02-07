import { useState } from 'react'; // Lisää useState
import type { SkillType, ActiveAction, GameState } from '../types';
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
}

export default function SkillView({ skill, level, xp, activeAction, inventory, onToggleAction, speedMultiplier, nextLevelXp }: SkillViewProps) {
  
  // UUSI: Tila tabeille. Oletuksena 'all'
  const [activeTab, setActiveTab] = useState('all');

  const getThemeColors = (s: SkillType) => {
    switch (s) {
      case 'woodcutting': return { bg: 'bg-emerald-500' };
      case 'mining': return { bg: 'bg-orange-500' };
      case 'fishing': return { bg: 'bg-cyan-500' };
      case 'farming': return { bg: 'bg-lime-500' };
      case 'crafting': return { bg: 'bg-violet-500' };
      default: return { bg: 'bg-slate-500' };
    }
  };

  const theme = getThemeColors(skill);
  const resources = GAME_DATA[skill];

  // UUSI: Suodatuslogiikka
  // Jos skilli on crafting, suodatetaan tabin mukaan. Muuten näytetään kaikki.
  const filteredResources = resources.filter(resource => {
    if (skill !== 'crafting') return true; // Muut skillit näyttävät aina kaiken
    if (activeTab === 'all') return true;
    return resource.category === activeTab;
  });

  // Määritellään tabit Craftingille
  const craftingTabs = [
    { id: 'all', label: 'All', icon: '♾️' },
    { id: 'weapons', label: 'Weapons', icon: '⚔️' },
    { id: 'armor', label: 'Armor', icon: '🛡️' },
    { id: 'combat', label: 'Combat', icon: '🏹' }, // Esim. nuolet
  ];

  return (
    <div className="p-6">
      <header className="mb-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl select-none pointer-events-none">
          {skill === 'woodcutting' ? '🪓' : skill === 'mining' ? '⛏️' : skill === 'fishing' ? '🎣' : skill === 'farming' ? '🌱' : '🔨'}
        </div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h2 className="text-3xl font-bold capitalize flex items-center gap-3 text-white">
            <span className="text-4xl">
              {skill === 'woodcutting' ? '🌲' : skill === 'mining' ? '⛰️' : skill === 'fishing' ? '🌊' : skill === 'farming' ? '🌻' : '🗡️'}
            </span>
            {skill.charAt(0).toUpperCase() + skill.slice(1)}
          </h2>
          <div className="text-right">
            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Level {level}</div>
            <div className="text-xs text-slate-500 font-mono">{xp} XP</div>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative z-10">
          <div className={`h-full transition-all duration-300 ${theme.bg}`} style={{ width: `${(xp / nextLevelXp) * 100}%` }}></div>
        </div>
        {speedMultiplier < 1 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded-full border border-emerald-900 text-emerald-400 text-xs font-bold uppercase tracking-wide">
            <span>⚡ Speed Bonus: +{Math.round((1 - speedMultiplier) * 100)}%</span>
          </div>
        )}
      </header>

      {/* UUSI: Tab-valikko (vain jos skilli on Crafting) */}
      {skill === 'crafting' && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {craftingTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all
                ${activeTab === tab.id 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredResources.map((resource) => {
          const isLocked = level < resource.levelRequired;
          const isActive = activeAction?.resourceId === resource.id;
          const currentInterval = resource.interval * speedMultiplier;
          
          const canAfford = resource.inputs ? resource.inputs.every(req => (inventory[req.id] || 0) >= req.count) : true;

          return (
            <div key={resource.id} className={`relative p-5 rounded-xl border transition-all duration-200 ${isLocked ? 'bg-slate-900/50 border-slate-800 opacity-50 grayscale' : isActive ? `bg-slate-800 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]` : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`text-4xl p-3 bg-slate-950 rounded-lg border border-slate-800 ${resource.color}`}>{resource.icon}</div>
                {!isLocked && <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">{(currentInterval / 1000).toFixed(1)}s</span>}
              </div>
              
              <h3 className="text-lg font-bold mb-1 text-slate-200">{resource.name}</h3>
              <p className="text-xs text-slate-500 mb-4 h-10 overflow-hidden">{resource.description}</p>
              
              {resource.inputs && (
                <div className="mb-4 bg-slate-950/50 p-2 rounded border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Materials:</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.inputs.map(input => {
                       const inputItem = getItemDetails(input.id);
                       const hasEnough = (inventory[input.id] || 0) >= input.count;
                       return (
                         <div key={input.id} className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${hasEnough ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-red-900/20 border-red-900/50 text-red-400'}`}>
                           <span>{inputItem?.icon}</span>
                           <span>{inventory[input.id] || 0}/{input.count}</span>
                         </div>
                       );
                    })}
                  </div>
                </div>
              )}

              <button 
                disabled={isLocked || (resource.inputs && !canAfford && !isActive)} 
                onClick={() => onToggleAction(skill, resource.id)} 
                className={`w-full py-2 px-4 rounded-lg font-bold text-sm uppercase tracking-wide transition-all 
                  ${isActive 
                    ? 'bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/50' 
                    : isLocked 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                      : !canAfford && resource.inputs
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                  }`}
              >
                {isActive ? 'Stop' : isLocked ? `Lvl ${resource.levelRequired}` : (resource.inputs && !canAfford) ? 'Need Mats' : 'Start'}
              </button>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-950 rounded-b-xl overflow-hidden">
                   <div className={`h-full ${theme.bg} origin-left`} style={{ animation: `progress ${currentInterval}ms linear infinite`, width: '100%' }}></div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Ilmoitus jos kategoria on tyhjä */}
        {filteredResources.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 italic">
            No items found in this category.
          </div>
        )}
      </div>
    </div>
  );
}