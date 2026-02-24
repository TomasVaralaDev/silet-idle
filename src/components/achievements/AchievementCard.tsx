import type { Achievement } from '../../types';

interface Props {
  achievement: Achievement;
  isUnlocked: boolean;
}

export default function AchievementCard({ achievement, isUnlocked }: Props) {
  return (
    <div 
      className={`p-5 rounded-xl border flex items-center gap-5 transition-all duration-300
        ${isUnlocked 
          ? 'bg-slate-900 border-yellow-600/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
          : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'
        }`}
    >
      <div className={`p-4 rounded-xl border shadow-inner shrink-0
        ${isUnlocked ? 'bg-slate-950 border-yellow-900/50' : 'bg-slate-950 border-slate-700'}`}>
        <img src={achievement.icon} alt="" className="w-12 h-12 pixelated drop-shadow-md" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-sm uppercase tracking-wide mb-1 truncate ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>
          {achievement.name}
        </h3>
        <p className="text-[11px] text-slate-400 mb-2 leading-snug line-clamp-2">
          {achievement.description}
        </p>
        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border tracking-tighter
          ${isUnlocked 
            ? 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50' 
            : 'text-slate-600 bg-slate-950 border-slate-800'}`}>
          {isUnlocked ? 'Protocol Complete' : 'Locked'}
        </span>
      </div>
    </div>
  );
}