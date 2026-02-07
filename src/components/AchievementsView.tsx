import type { Achievement } from '../types';

interface AchievementsViewProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

export default function AchievementsView({ achievements, unlockedIds }: AchievementsViewProps) {
  // Lasketaan edistyminen
  const unlockedCount = unlockedIds.length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-yellow-400">
          <span className="text-4xl">🏆</span> Achievements
        </h2>
        <div className="flex justify-between items-end mt-4">
          <p className="text-slate-400">Track your progress and milestones.</p>
          <p className="text-xl font-mono text-yellow-400 font-bold">{unlockedCount} / {totalCount}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-4 bg-slate-900 rounded-full mt-4 border border-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = unlockedIds.includes(ach.id);

          return (
            <div 
              key={ach.id} 
              className={`p-6 rounded-xl border relative overflow-hidden transition-all
                ${isUnlocked 
                  ? 'bg-slate-900 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                  : 'bg-slate-950 border-slate-800 grayscale opacity-60'
                }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`text-4xl p-3 rounded-lg border ${isUnlocked ? 'bg-slate-800 border-yellow-900 text-yellow-400' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
                  {ach.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.name}</h3>
                  {isUnlocked && <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Unlocked</span>}
                </div>
              </div>
              <p className="text-sm text-slate-400">{ach.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}