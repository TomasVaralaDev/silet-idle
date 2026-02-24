import { useState } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import AchievementCard from './achievements/AchievementCard';
import type { AchievementCategory } from '../types';

interface AchievementsViewProps {
  unlockedIds: string[];
}

export default function AchievementsView({
  unlockedIds = [],
}: AchievementsViewProps) {
  const [activeCategory, setActiveCategory] = useState<
    AchievementCategory | 'all'
  >('all');

  const filteredAchievements = ACHIEVEMENTS.filter(
    (ach) => activeCategory === 'all' || ach.category === activeCategory,
  );

  const categories: { id: AchievementCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Systems' },
    { id: 'general', label: 'General' },
    { id: 'skills', label: 'Skills' },
    { id: 'combat', label: 'Combat' },
    { id: 'wealth', label: 'Wealth' },
  ];

  const unlockCount = unlockedIds?.length || 0;
  const progressPercent = (unlockCount / ACHIEVEMENTS.length) * 100;

  return (
    <div className="h-full flex flex-col bg-slate-950/80 font-sans overflow-hidden">
      {/* HEADER - Tyyli kopioitu esimerkkisi mukaan */}
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-yellow-500/20 border border-yellow-500/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/ui/icon_achievements.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Milestones"
          />
        </div>
        <div className="flex-1 text-left">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-yellow-500 mb-1`}
          >
            Milestones
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            System synchronization and operational records.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-200 uppercase tracking-tighter">
            {unlockCount} / {ACHIEVEMENTS.length}
          </div>
          <div className="text-xs font-mono text-slate-500 mt-1 uppercase">
            Completed
          </div>
        </div>
      </div>

      {/* PROGRESS BAR - Ohut palkki headerin alla kuten Skill-näkymässä */}
      <div className="h-1 bg-slate-900 w-full shrink-0">
        <div
          className={`h-full bg-yellow-500 transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.5)]`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* TABS - Kategoriat siistissä rivissä */}
      <div className="px-6 pt-4 flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
              ${
                activeCategory === cat.id
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT - Grid achievement-korteille */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <AchievementCard
                achievement={ach}
                isUnlocked={unlockedIds.includes(ach.id)}
              />
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredAchievements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-700">
            <span className="text-4xl mb-4">📡</span>
            <p className="text-xs font-mono uppercase tracking-widest">
              No records found for this system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
