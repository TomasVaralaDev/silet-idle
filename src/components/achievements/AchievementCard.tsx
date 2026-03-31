import type { Achievement } from "../../types";
import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import { CHAT_COLORS } from "../../data/chatColors";

interface Props {
  achievement: Achievement;
  isUnlocked: boolean;
  isClaimed: boolean;
}

export default function AchievementCard({
  achievement,
  isUnlocked,
  isClaimed,
}: Props) {
  // Hook to access the achievement claim logic from the store
  const claimAchievement = useGameStore((state) => state.claimAchievement);

  // Helper to determine if the achievement has any associated rewards
  const hasRewards =
    achievement.rewards &&
    (achievement.rewards.coins ||
      achievement.rewards.items ||
      achievement.rewards.xpMap ||
      achievement.rewards.chatColorId);

  return (
    <div
      className={`p-3 md:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 transition-all duration-300 relative overflow-hidden
        ${
          isClaimed
            ? "bg-accent/5 border-accent/20 opacity-75"
            : isUnlocked
              ? "bg-accent/10 border-accent/50 shadow-[0_0_15px_rgba(var(--color-accent)/0.15)]"
              : "bg-panel/50 border-border opacity-50 grayscale"
        }`}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
        {
          // Icon Container
        }
        <div
          className={`p-2 md:p-3 rounded-xl border shrink-0 relative z-10
          ${
            isUnlocked && !isClaimed
              ? "bg-accent/20 border-accent/50 shadow-inner"
              : isClaimed
                ? "bg-accent/10 border-accent/20"
                : "bg-app-base border-border"
          }`}
        >
          <img
            src={achievement.icon}
            alt=""
            className={`w-10 h-10 md:w-12 md:h-12 pixelated transition-transform duration-500 ${
              isUnlocked && !isClaimed
                ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--color-accent)/0.5)]"
                : "opacity-70"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0 relative z-10 text-left">
          <h3
            className={`font-black text-sm md:text-base uppercase tracking-tight mb-0.5 md:mb-1 truncate ${
              isUnlocked && !isClaimed
                ? "text-accent"
                : isClaimed
                  ? "text-accent/80"
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
                  ? "text-accent/70 bg-accent/10 border-accent/20"
                  : isUnlocked
                    ? "text-accent bg-accent/20 border-accent/40"
                    : "text-tx-muted/50 bg-app-base border-border"
              }`}
            >
              {isClaimed ? "Claimed" : isUnlocked ? "Completed" : "Locked"}
            </span>
          </div>
        </div>
      </div>

      {
        // Rewards and Action Section
      }
      {hasRewards && (
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-border/50 pt-2 sm:pt-0 sm:pl-4 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {
              // 1. COINS
            }
            {achievement.rewards?.coins && (
              <div
                className="flex items-center gap-1 bg-app-base px-1.5 py-0.5 rounded border border-border"
                title={`${achievement.rewards.coins} Coins`}
              >
                <img
                  src="./assets/ui/coins.png"
                  className="w-3 h-3 pixelated"
                  alt="Coins"
                />
                <span className="text-[9px] font-mono text-accent font-bold">
                  {achievement.rewards.coins}
                </span>
              </div>
            )}

            {
              // 2. ITEMS
            }
            {achievement.rewards?.items?.map(
              (item: { itemId: string; amount: number }) => {
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
              },
            )}

            {
              // 3. XP
            }
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

            {
              // 4. CHAT COLOR
            }
            {achievement.rewards?.chatColorId &&
              (() => {
                const colorObj = CHAT_COLORS.find(
                  (c) => c.id === achievement.rewards?.chatColorId,
                );
                if (!colorObj) return null;

                return (
                  <div
                    className="flex items-center gap-1.5 bg-app-base px-1.5 py-0.5 rounded border border-border"
                    title={`Unlocks Chat Color: ${colorObj.name}`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-black/50 shadow-sm"
                      style={colorObj.style}
                    ></div>
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{
                        ...(colorObj.style.webkitBackgroundClip === "text"
                          ? colorObj.style
                          : { color: colorObj.style.color }),
                        filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.8))",
                      }}
                    >
                      Color
                    </span>
                  </div>
                );
              })()}
          </div>

          {
            // Claim button - Visible only when achievement is completed but not claimed
          }
          {isUnlocked && !isClaimed && (
            <button
              onClick={() => claimAchievement(achievement.id)}
              className="bg-accent text-white hover:bg-accent-hover font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded shadow-[0_0_10px_rgba(var(--color-accent)/0.3)] transition-transform active:scale-95"
            >
              Claim
            </button>
          )}
        </div>
      )}
    </div>
  );
}
