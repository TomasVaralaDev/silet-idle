import type { Achievement } from "../../types";

interface Props {
  achievement: Achievement;
  isUnlocked: boolean;
}

export default function AchievementCard({ achievement, isUnlocked }: Props) {
  return (
    <div
      className={`p-5 rounded-xl border flex items-center gap-5 transition-all duration-300 relative overflow-hidden
        ${
          isUnlocked
            ? "bg-panel border-warning/40 shadow-[0_0_20px_rgb(var(--color-warning)/0.1)]"
            : "bg-panel/50 border-border opacity-60 grayscale"
        }`}
    >
      {/* Icon Container */}
      <div
        className={`p-4 rounded-xl border shadow-inner shrink-0 relative z-10
        ${
          isUnlocked
            ? "bg-app-base border-warning/30"
            : "bg-app-base border-border"
        }`}
      >
        <img
          src={achievement.icon}
          alt=""
          className={`w-12 h-12 pixelated transition-transform duration-500 ${
            isUnlocked
              ? "drop-shadow-[0_0_8px_rgb(var(--color-warning)/0.5)] scale-110"
              : "opacity-50"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0 relative z-10 text-left">
        <h3
          className={`font-black text-sm uppercase tracking-wide mb-1 truncate ${
            isUnlocked ? "text-tx-main" : "text-tx-muted"
          }`}
        >
          {achievement.name}
        </h3>
        <p
          className={`text-[11px] mb-2 leading-snug line-clamp-2 ${
            isUnlocked ? "text-tx-muted" : "text-tx-muted/60"
          }`}
        >
          {achievement.description}
        </p>

        <div className="flex">
          <span
            className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border tracking-tighter transition-colors
            ${
              isUnlocked
                ? "text-success bg-success/10 border-success/30"
                : "text-tx-muted/50 bg-app-base border-border"
            }`}
          >
            {isUnlocked ? "Completed" : "Locked"}
          </span>
        </div>
      </div>

      {/* Subtle Background Glow for Unlocked Cards */}
      {isUnlocked && (
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-warning/5 blur-3xl rounded-full pointer-events-none" />
      )}
    </div>
  );
}
