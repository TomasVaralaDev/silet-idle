import type { Achievement } from "../../types";
import { useGameStore } from "../../store/useGameStore"; // Tuodaan store, jotta voidaan lunastaa
import { getItemDetails } from "../../data";

interface Props {
  achievement: Achievement;
  isUnlocked: boolean;
  isClaimed: boolean; // LISÄTTY: Tieto onko palkinto haettu
}

export default function AchievementCard({
  achievement,
  isUnlocked,
  isClaimed,
}: Props) {
  const claimAchievement = useGameStore((state) => state.claimAchievement);

  const hasRewards =
    achievement.rewards &&
    (achievement.rewards.coins ||
      achievement.rewards.items ||
      achievement.rewards.xpMap);

  return (
    <div
      className={`p-3 md:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 transition-all duration-300 relative overflow-hidden
        ${
          isClaimed
            ? "bg-panel/30 border-success/20 opacity-80"
            : isUnlocked
              ? "bg-warning/5 border-warning/40 shadow-[0_0_15px_rgba(var(--color-warning)/0.1)]"
              : "bg-panel/50 border-border opacity-50 grayscale"
        }`}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
        {/* Icon Container */}
        <div
          className={`p-2 md:p-3 rounded-xl border shrink-0 relative z-10
          ${
            isUnlocked && !isClaimed
              ? "bg-warning/20 border-warning/50 shadow-inner"
              : isClaimed
                ? "bg-success/10 border-success/30"
                : "bg-app-base border-border"
          }`}
        >
          <img
            src={achievement.icon}
            alt=""
            className={`w-10 h-10 md:w-12 md:h-12 pixelated transition-transform duration-500 ${
              isUnlocked && !isClaimed
                ? "scale-110 drop-shadow-md"
                : "opacity-80"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0 relative z-10 text-left">
          <h3
            className={`font-black text-sm md:text-base uppercase tracking-tight mb-0.5 md:mb-1 truncate ${
              isUnlocked && !isClaimed
                ? "text-warning"
                : isClaimed
                  ? "text-success"
                  : "text-tx-muted"
            }`}
          >
            {achievement.name}
          </h3>
          <p
            className={`text-[10px] md:text-xs mb-2 leading-snug line-clamp-2 ${
              isUnlocked ? "text-tx-muted" : "text-tx-muted/60"
            }`}
          >
            {achievement.description}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded border tracking-widest transition-colors
              ${
                isClaimed
                  ? "text-success bg-success/10 border-success/30"
                  : isUnlocked
                    ? "text-warning bg-warning/10 border-warning/30"
                    : "text-tx-muted/50 bg-app-base border-border"
              }`}
            >
              {isClaimed ? "Claimed" : isUnlocked ? "Completed" : "Locked"}
            </span>
          </div>
        </div>
      </div>

      {/* PALKINNOT JA LUNASTUSNAPPI */}
      {hasRewards && (
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-border/50 pt-2 sm:pt-0 sm:pl-4 shrink-0">
          {/* Näytetään pienet ikonit palkinnoista */}
          <div className="flex items-center gap-1.5">
            {achievement.rewards?.coins && (
              <div
                className="flex items-center gap-1 bg-app-base px-1.5 py-0.5 rounded border border-border"
                title={`${achievement.rewards.coins} Coins`}
              >
                <img
                  src="/assets/ui/coins.png"
                  className="w-3 h-3 pixelated"
                  alt="Coins"
                />
                <span className="text-[9px] font-mono text-warning font-bold">
                  {achievement.rewards.coins}
                </span>
              </div>
            )}
            {achievement.rewards?.items?.map((item) => {
              const details = getItemDetails(item.itemId);
              return details ? (
                <div
                  key={item.itemId}
                  className="flex items-center gap-1 bg-app-base px-1.5 py-0.5 rounded border border-border"
                  title={`${details.name} x${item.amount}`}
                >
                  <img
                    src={details.icon}
                    className="w-3 h-3 pixelated"
                    alt={details.name}
                  />
                  <span className="text-[9px] font-mono text-tx-main font-bold">
                    {item.amount}
                  </span>
                </div>
              ) : null;
            })}
            {achievement.rewards?.xpMap && (
              <div
                className="flex items-center gap-1 bg-app-base px-1.5 py-0.5 rounded border border-border"
                title="Experience Points"
              >
                <span className="text-[9px] font-black text-accent uppercase tracking-tighter">
                  XP
                </span>
              </div>
            )}
          </div>

          {/* CLAIM NAPPI */}
          {isUnlocked && !isClaimed && (
            <button
              onClick={() => claimAchievement(achievement.id)}
              className="bg-warning text-black hover:bg-warning-hover font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded shadow-lg transition-transform active:scale-95"
            >
              Claim
            </button>
          )}
        </div>
      )}
    </div>
  );
}
