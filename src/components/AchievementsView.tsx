import type { Achievement } from '../types';

interface AchievementsViewProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

export default function AchievementsView({ achievements, unlockedIds }: AchievementsViewProps) {
  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-slate-950">
      <header className="mb-8 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-yellow-500 flex items-center gap-4 uppercase tracking-widest">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
             <img src="/assets/ui/icon_achievements.png" className="w-10 h-10 pixelated" alt="Trophy" />
          </div>
          Milestones
        </h2>
        <p className="text-slate-400 text-sm">
          System Completion: <span className="text-white font-bold">{unlockedIds.length} / {achievements.length}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-10">
        {achievements.map((ach) => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              className={`p-5 rounded-xl border flex items-center gap-5 transition-all duration-200
                ${isUnlocked 
                  ? 'bg-slate-900 border-yellow-600/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'
                }`}
            >
              <div className={`p-4 rounded-xl border shadow-inner
                ${isUnlocked ? 'bg-slate-950 border-yellow-900/50' : 'bg-slate-950 border-slate-700'}`}>
                <img src={ach.icon} alt={ach.name} className="w-14 h-14 pixelated drop-shadow-md" />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold text-base uppercase tracking-wide mb-1 ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                  {ach.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2 leading-snug">
                  {ach.description}
                </p>
                {isUnlocked ? (
                  <span className="inline-block text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-900/50 tracking-wider">
                    Complete
                  </span>
                ) : (
                  <span className="inline-block text-[10px] uppercase font-bold text-slate-600 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 tracking-wider">
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