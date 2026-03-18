import { useState } from "react";
import { ACHIEVEMENTS } from "../../data/achievements";
import AchievementCard from "./AchievementCard";
import type { AchievementCategory } from "../../types";

interface AchievementsViewProps {
  unlockedIds: string[];
}

export default function AchievementsView({
  unlockedIds = [],
}: AchievementsViewProps) {
  const [activeCategory, setActiveCategory] = useState<
    AchievementCategory | "all"
  >("all");

  const filteredAchievements = ACHIEVEMENTS.filter(
    (ach) => activeCategory === "all" || ach.category === activeCategory,
  );

  const categories: { id: AchievementCategory | "all"; label: string }[] = [
    { id: "all", label: "All Systems" },
    { id: "general", label: "General" },
    { id: "skills", label: "Skills" },
    { id: "combat", label: "Combat" },
    { id: "wealth", label: "Wealth" },
  ];

  const unlockCount = unlockedIds?.length || 0;
  const progressPercent = (unlockCount / ACHIEVEMENTS.length) * 100;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center bg-warning/20 border border-warning/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/ui/icon_achievements.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Milestones"
          />
        </div>
        <div className="flex-1">
          <h1
            className={`text-3xl font-black uppercase tracking-widest text-warning mb-1`}
          >
            Achievements
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            All your achievements in one place. Keep unlocking new milestones!
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
            {unlockCount} / {ACHIEVEMENTS.length}
          </div>
          <div className="text-xs font-mono text-tx-muted mt-1 uppercase">
            Completed
          </div>
        </div>
      </div>

      {/* PROGRESS BAR - Kultainen hehku teeman mukaan */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div
          className={`h-full bg-warning transition-all duration-1000 shadow-[0_0_10px_rgb(var(--color-warning)/0.5)]`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* TABS */}
      <div className="px-6 pt-4 flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
              ${
                activeCategory === cat.id
                  ? "bg-warning/20 border-warning text-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.2)]"
                  : "bg-panel border-border text-tx-muted hover:text-tx-main hover:border-border-hover"
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <AchievementCard
                achievement={ach}
                isUnlocked={unlockedIds.includes(ach.id)}
              />
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredAchievements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-tx-muted/40">
            <span className="text-4xl mb-4 opacity-30">📡</span>
            <p className="text-xs font-mono uppercase tracking-widest">
              No records found for this system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
