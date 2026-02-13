import { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GAME_DATA, getItemDetails } from '../data';
import { getSpeedMultiplier } from '../utils/gameUtils';
import type { SkillType, Resource } from '../types';

import { SKILL_TABS } from '../config/skillTabs';
import SkillTabs from './SkillTabs';

interface Props {
  skill: SkillType;
}

export default function SkillView({ skill }: Props) {
  const [activeTab, setActiveTab] = useState('all');
  
  const [prevSkill, setPrevSkill] = useState(skill);
  if (skill !== prevSkill) {
    setPrevSkill(skill);
    setActiveTab('all');
  }

  const activeAction = useGameStore((state) => state.activeAction);
  const toggleAction = useGameStore((state) => state.toggleAction);
  const upgrades = useGameStore((state) => state.upgrades);
  const inventory = useGameStore((state) => state.inventory);
  const skillData = useGameStore((state) => state.skills[skill]);

  const tabs = SKILL_TABS[skill] || [];

  const filteredResources = useMemo(() => {
    const resources = GAME_DATA[skill as keyof typeof GAME_DATA] || [];
    const currentTabs = SKILL_TABS[skill] || [];

    if (currentTabs.length === 0) return resources;
    const currentRule = currentTabs.find(t => t.id === activeTab);
    return currentRule ? resources.filter(currentRule.filter) : resources;
  }, [skill, activeTab]);

  const speedMult = getSpeedMultiplier(skill, upgrades);
  
  const xpNeeded = Math.max(150, skillData.level * 150); 
  const currentXp = skillData.xp;
  const levelProgressPercent = Math.min(100, (currentXp / xpNeeded) * 100);

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="mb-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg relative overflow-hidden group shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
               <span className="text-3xl capitalize font-black text-slate-700 select-none">{skill.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white capitalize tracking-tighter">{skill}</h2>
              <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                <span className="text-emerald-400 font-bold bg-emerald-900/20 px-2 py-0.5 rounded">
                  LEVEL {skillData.level}
                </span>
              </div>
            </div>
          </div>
          
          {activeAction?.skill === skill && (
            <div className="text-right">
               <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_currentColor]" />
                 <span className="text-xs uppercase font-bold tracking-widest">Running</span>
               </div>
               <div className="text-[10px] text-slate-500 font-mono mt-1">
                 {(activeAction.targetTime / 1000).toFixed(1)}s / cycle
               </div>
            </div>
          )}
        </div>
        <div className="relative z-10">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 px-1">
            <span>Progress to Lvl {skillData.level + 1}</span>
            <span className="font-mono text-emerald-400">
              {Math.floor(currentXp).toLocaleString()} / {Math.floor(xpNeeded).toLocaleString()} XP
            </span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* TABS: KORJAUS - Lisätty shrink-0 wrapper */}
      <div className="shrink-0">
        <SkillTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* RESOURCES GRID */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.length === 0 ? (
             <div className="col-span-full text-center py-10 text-slate-500 italic">No items in this category.</div>
          ) : (
            filteredResources.map((resource: Resource) => {
              const isActive = activeAction?.resourceId === resource.id && activeAction?.skill === skill;
              const progressPercent = isActive && activeAction
                ? Math.min(100, (activeAction.progress / activeAction.targetTime) * 100)
                : 0;
              const actualInterval = Math.max(0.2, (resource.interval || 3000) / speedMult) / 1000;
              const isLocked = (resource.level || 0) > skillData.level;
              
              const canAfford = resource.inputs 
                ? resource.inputs.every(req => (inventory[req.id] || 0) >= req.count)
                : true;

              return (
                <button
                  key={resource.id}
                  onClick={() => !isLocked && (canAfford || isActive) && toggleAction(skill, resource.id)}
                  disabled={isLocked}
                  className={`
                    relative group overflow-hidden rounded-xl border text-left transition-all duration-200
                    flex flex-col h-auto min-h-[6.5rem]
                    ${isActive 
                      ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-900/10' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                    }
                    ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                    ${!canAfford && !isActive && !isLocked ? 'opacity-75 cursor-not-allowed border-red-900/30' : ''}
                  `}
                >
                  {/* Progress Bar Backgrounds */}
                  {isActive && (
                    <>
                      <div 
                        className="absolute inset-0 bg-emerald-500/5 transition-all duration-100 ease-linear pointer-events-none z-0"
                        style={{ width: `${progressPercent}%` }}
                      />
                      <div 
                        className="absolute bottom-0 left-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all duration-100 ease-linear z-10"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </>
                  )}

                  {/* KORJAUS: Poistettu h-full ja justify-between, käytetään gap-3 */}
                  <div className="p-3 relative z-10 w-full flex flex-col gap-3">
                    
                    {/* YLÄOSA: Ikoni ja Nimi */}
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0
                          ${isActive ? 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}
                        `}>
                          <img src={resource.icon} alt={resource.name} className="w-6 h-6 pixelated" />
                        </div>
                        
                        <div>
                          <h3 className={`font-bold text-sm leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {resource.name}
                          </h3>
                          <div className="flex gap-2 mt-0.5 text-[10px] text-slate-500">
                            <span className="font-mono text-emerald-500">+{resource.xpReward} XP</span>
                            <span>⏱ {actualInterval.toFixed(1)}s</span>
                          </div>
                        </div>
                      </div>

                      {/* Level Req / Running Indicator */}
                      {isLocked ? (
                        <span className="text-[9px] font-bold text-red-500 bg-red-900/20 px-1.5 py-0.5 rounded border border-red-900/30">
                          LVL {resource.level}
                        </span>
                      ) : isActive ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                      ) : !canAfford && (
                        <span className="text-[8px] font-bold text-red-400 uppercase tracking-wide">Missing Mats</span>
                      )}
                    </div>

                    {/* ALAOSA: Materiaalivaatimukset (INPUTS) */}
                    {resource.inputs && resource.inputs.length > 0 && (
                      <div className="w-full pt-2 border-t border-slate-800/50">
                        <div className="text-[9px] text-slate-600 font-bold uppercase mb-1 tracking-wider">Requires:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {resource.inputs.map((input) => {
                            const inputItem = getItemDetails(input.id);
                            const currentAmount = inventory[input.id] || 0;
                            const hasEnough = currentAmount >= input.count;

                            if (!inputItem) return null;

                            return (
                              <div 
                                key={input.id}
                                // KORJAUS: Hover tooltip (title)
                                title={inputItem.name} 
                                className={`
                                  flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] border cursor-help
                                  ${hasEnough 
                                    ? 'bg-slate-950 border-slate-800 text-slate-400' 
                                    : 'bg-red-950/30 border-red-900/50 text-red-400'
                                  }
                                `}
                              >
                                <img src={inputItem.icon} className="w-3 h-3 pixelated" alt="" />
                                <span className="font-mono font-medium">
                                  <span className={hasEnough ? 'text-slate-300' : 'text-red-400'}>
                                    {currentAmount}
                                  </span>
                                  <span className="text-slate-600 mx-0.5">/</span> 
                                  <span className="text-slate-500">{input.count}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}