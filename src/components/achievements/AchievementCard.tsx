import type { Achievement } from "../../types";

interface Props {
  achievement: Achievement;
  isUnlocked: boolean;
}

export default function AchievementCard({ achievement, isUnlocked }: Props) {
  return (
    <div
      className={`p-3 md:p-4 rounded-sm border flex items-center gap-3 md:gap-4 transition-all duration-300 relative overflow-hidden
        ${
          isUnlocked
            ? "bg-panel border-warning/40"
            : "bg-panel/50 border-border opacity-60 grayscale"
        }`}
    >
      {/* Icon Container - Skaalautuu pienemmäksi */}
      <div
        className={`p-2 md:p-3 rounded-sm border shrink-0 relative z-10
        ${
          isUnlocked
            ? "bg-app-base border-warning/30"
            : "bg-app-base border-border"
        }`}
      >
        <img
          src={achievement.icon}
          alt=""
          className={`w-10 h-10 md:w-12 md:h-12 pixelated transition-transform duration-500 ${
            isUnlocked ? "scale-110" : "opacity-50"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0 relative z-10 text-left">
        <h3
          className={`font-black text-xs md:text-sm uppercase tracking-tight mb-0.5 md:mb-1 truncate ${
            isUnlocked ? "text-tx-main" : "text-tx-muted"
          }`}
        >
          {achievement.name}
        </h3>
        <p
          className={`text-[9px] md:text-[10px] mb-2 leading-snug line-clamp-2 ${
            isUnlocked ? "text-tx-muted" : "text-tx-muted/60"
          }`}
        >
          {achievement.description}
        </p>

        <div className="flex">
          <span
            className={`text-[8px] md:text-[9px] uppercase font-black px-1.5 py-0.5 rounded-sm border tracking-tighter transition-colors
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
    </div>
  );
}
