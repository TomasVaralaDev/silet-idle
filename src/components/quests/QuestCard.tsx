import { useGameStore } from '../../store/useGameStore';
import type { ActiveQuest } from '../../types';
import QuestReward from './QuestReward';

interface QuestCardProps {
  quest: ActiveQuest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const claimQuestReward = useGameStore((state) => state.claimQuestReward);

  const progressPercent = Math.min(100, Math.max(0, (quest.progress / quest.targetAmount) * 100));
  const canClaim = quest.isCompleted && !quest.isClaimed;

  return (
    <div
      className={`relative p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden
        ${
          quest.isClaimed
            ? 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'
            : canClaim
            ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
        }
      `}
    >
      {/* Progress background bar */}
      {!quest.isClaimed && (
        <div
          className="absolute left-0 bottom-0 h-1 bg-amber-500/50 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      )}

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <h3
            className={`font-bold text-lg ${
              canClaim ? 'text-emerald-400' : quest.isClaimed ? 'text-slate-500' : 'text-slate-200'
            }`}
          >
            {quest.title}
          </h3>
          <p className="text-sm text-slate-400">{quest.description}</p>
        </div>

        {!quest.isClaimed && (
          <div className="text-right shrink-0 ml-4">
            <span className="text-xs font-mono text-slate-500 block mb-1 text-right">
              {quest.progress} / {quest.targetAmount}
            </span>
            {canClaim && (
              <button
                onClick={() => claimQuestReward(quest.id)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg shadow-emerald-900/50 animate-pulse"
              >
                CLAIM
              </button>
            )}
          </div>
        )}
        {quest.isClaimed && (
          <span className="text-[10px] font-bold tracking-wider text-slate-600 border border-slate-700 px-2 py-1 rounded shrink-0 ml-4">
            COMPLETED
          </span>
        )}
      </div>

      <QuestReward reward={quest.reward} />
    </div>
  );
}