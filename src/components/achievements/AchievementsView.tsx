import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { ACHIEVEMENTS } from "../../data/achievements";
import AchievementCard from "./AchievementCard";
import type { AchievementCategory } from "../../types";

// Define filter categories for the milestones view
const CATEGORIES: { id: AchievementCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "combat", label: "Combat" },
  { id: "skills", label: "Skills" },
  { id: "wealth", label: "Wealth" },
  { id: "collection", label: "Collection" },
];

export default function AchievementsView() {
  const [activeCategory, setActiveCategory] = useState<
    AchievementCategory | "all"
  >("all");

  // Fetch progress lists from the store to handle unlocking and claiming logic
  const unlockedAchievements = useGameStore(
    (state) => state.unlockedAchievements || [],
  );
  const claimedAchievements = useGameStore(
    (state) => state.claimedAchievements || [],
  );

  // Filter achievements based on the selected category tab
  const filteredAchievements = ACHIEVEMENTS.filter(
    (ach) => activeCategory === "all" || ach.category === activeCategory,
  );

  // Calculate overall completion progress
  const unlockCount = unlockedAchievements.length;
  const progressPercent = (unlockCount / ACHIEVEMENTS.length) * 100;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden">
      {
        // Header - Branding and total progress overview
      }
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-4 md:gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div
          className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-warning/20 border border-warning/30 shadow-lg shrink-0`}
        >
          <img
            src="/assets/ui/icon_achievements.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
            alt="Milestones"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1
            className={`text-xl md:text-3xl font-black uppercase tracking-widest text-warning mb-0.5 md:mb-1 truncate`}
          >
            Milestones
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium hidden sm:block truncate">
            Your journey is recorded in the stars. Keep unlocking new
            milestones!
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg md:text-2xl font-black text-tx-main uppercase tracking-tighter">
            {unlockCount} / {ACHIEVEMENTS.length}
          </div>
          <div className="text-[9px] md:text-xs font-mono text-tx-muted mt-0.5 md:mt-1 uppercase">
            Completed
          </div>
        </div>
      </div>

      {
        // Progress Bar - Visual completion feedback
      }
      <div className="h-1 bg-panel w-full shrink-0">
        <div
          className={`h-full bg-warning transition-all duration-1000 opacity-80`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {
        // Category Tabs - Filter navigation
      }
      <div className="p-3 md:p-5 border-b border-border/30 bg-panel/20 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[9px] font-bold uppercase border transition-all shrink-0 ${
                activeCategory === cat.id
                  ? "border-warning text-warning bg-warning/10"
                  : "border-border text-tx-muted hover:border-border-hover"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {
        // Main Content - Display filtered achievements in a responsive grid
      }
      <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-10">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <AchievementCard
                achievement={ach}
                isUnlocked={unlockedAchievements.includes(ach.id)}
                isClaimed={claimedAchievements.includes(ach.id)}
              />
            </div>
          ))}
        </div>

        {
          // Empty State - Shown when no achievements match the filter
        }
        {filteredAchievements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-tx-muted/40">
            <span className="text-4xl mb-4 opacity-30">📡</span>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest">
              No records found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
