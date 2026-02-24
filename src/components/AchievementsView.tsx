import { useState } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import AchievementCard from './achievements/AchievementCard';
import type { AchievementCategory } from '../types'; // 'Achievement' poistettu tästä

interface AchievementsViewProps {
  unlockedIds: string[];
}

export default function AchievementsView({ unlockedIds }: AchievementsViewProps) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');

  const filteredAchievements = ACHIEVEMENTS.filter(ach => 
    activeCategory === 'all' || ach.category === activeCategory
  );

  const categories: { id: AchievementCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Systems' },
    { id: 'general', label: 'General' },
    { id: 'skills', label: 'Skills' },
    { id: 'combat', label: 'Combat' },
    { id: 'wealth', label: 'Wealth' },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-slate-950">
      <header className="mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <img src="/assets/ui/icon_achievements.png" className="w-32 h-32 pixelated" alt="" />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 text-slate-100 flex items-center gap-4 uppercase tracking-[0.2em]">
            Milestones
          </h2>
          <div className="flex items-center gap-4 text-sm text-left">
            <div className="flex-1 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-1000" 
                style={{ width: `${(unlockedIds.length / ACHIEVEMENTS.length) * 100}%` }}
              />
            </div>
            <span className="text-slate-400 font-mono text-xs">
              {unlockedIds.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all
              ${activeCategory === cat.id 
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        {filteredAchievements.map((ach) => (
          <AchievementCard 
            key={ach.id} 
            achievement={ach} 
            isUnlocked={unlockedIds.includes(ach.id)} 
          />
        ))}
      </div>
    </div>
  );
}