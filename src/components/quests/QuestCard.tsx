import { useGameStore } from "../../store/useGameStore";
import type { ActiveQuest } from "../../types";
import QuestReward from "./QuestReward";

interface QuestCardProps {
  quest: ActiveQuest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const claimQuestReward = useGameStore((state) => state.claimQuestReward);

  const progressPercent = Math.min(
    100,
    Math.max(0, (quest.progress / quest.targetAmount) * 100)
  );
  const canClaim = quest.isCompleted && !quest.isClaimed;

  return (
    <div
      className={`relative p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden text-left
        ${
          quest.isClaimed
            ? "bg-app-base/40 border-border/50 opacity-50 grayscale"
            : canClaim
            ? "bg-success/10 border-success/50 shadow-[0_0_15px_rgb(var(--color-success)/0.15)]"
            : "bg-panel/40 border-border hover:border-border-hover"
        }
      `}
    >
      {/* Progress background bar - Dynaaminen warning-väri */}
      {!quest.isClaimed && (
        <div
          className="absolute left-0 bottom-0 h-1 bg-warning/40 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      )}

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex-1 min-w-0 pr-4">
          <h3
            className={`font-black text-lg uppercase tracking-tight truncate ${
              canClaim
                ? "text-success"
                : quest.isClaimed
                ? "text-tx-muted"
                : "text-tx-main"
            }`}
          >
            {quest.title}
          </h3>
          <p className="text-sm text-tx-muted leading-snug line-clamp-2">
            {quest.description}
          </p>
        </div>

        {!quest.isClaimed && (
          <div className="text-right shrink-0">
            <span className="text-xs font-mono text-tx-muted/60 block mb-2">
              {quest.progress} / {quest.targetAmount}
            </span>
            {canClaim && (
              <button
                onClick={() => claimQuestReward(quest.id)}
                className="px-4 py-1.5 bg-success hover:bg-success/80 text-white text-xs font-black rounded shadow-lg shadow-success/30 animate-pulse uppercase tracking-widest"
              >
                CLAIM
              </button>
            )}
          </div>
        )}

        {quest.isClaimed && (
          <span className="text-[10px] font-black tracking-widest text-tx-muted/40 border border-border px-2 py-1 rounded shrink-0 uppercase">
            COMPLETED
          </span>
        )}
      </div>

      <div
        className={`transition-opacity duration-300 ${
          quest.isClaimed ? "opacity-40" : "opacity-100"
        }`}
      >
        <QuestReward reward={quest.reward} />
      </div>
    </div>
  );
}
