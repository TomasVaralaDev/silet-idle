import type { Achievement } from '../types';

interface AchievementsViewProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

export default function AchievementsView({ achievements, unlockedIds }: AchievementsViewProps) {
  return (
    <div className="p-6">
      <header className="mb-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-yellow-500 flex items-center gap-3">
          <span>🏆</span> Achievements
        </h2>
        <p className="text-slate-400 text-sm">
          Unlocked: <span className="text-white font-bold">{unlockedIds.length} / {achievements.length}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              className={`p-4 rounded-xl border flex items-center gap-4 transition-all
                ${isUnlocked 
                  ? 'bg-slate-800 border-yellow-600/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'
                }`}
            >
              <div className={`text-4xl p-3 rounded-full border 
                ${isUnlocked ? 'bg-slate-900 border-yellow-600 text-yellow-400' : 'bg-slate-950 border-slate-700 text-slate-600'}`}>
                {ach.icon}
              </div>
              
              <div>
                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {ach.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {ach.description}
                </p>
                {isUnlocked ? (
                  <span className="inline-block mt-2 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-900/50">
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-block mt-2 text-[10px] uppercase font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}