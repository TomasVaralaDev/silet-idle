import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { ACHIEVEMENTS } from "../../data/achievements";
import AchievementCard from "./AchievementCard";
import type { AchievementCategory } from "../../types";

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

  // Haetaan molemmat listat storesta
  const unlockedAchievements = useGameStore(
    (state) => state.unlockedAchievements || [],
  );
  const claimedAchievements = useGameStore(
    (state) => state.claimedAchievements || [],
  );

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    if (activeCategory === "all") return true;
    return ach.category === activeCategory;
  });

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPercent = Math.floor((unlockedCount / totalCount) * 100);

  return (
    <div className="h-full flex flex-col bg-app-base animate-in fade-in duration-500 text-left">
      {/* HEADER & PROGRESS */}
      <div className="p-4 md:p-8 border-b border-border/50 bg-panel/30 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter mb-2">
              Milestones
            </h2>
            <p className="text-tx-muted text-xs md:text-sm uppercase tracking-widest font-bold">
              Your journey is recorded in the stars.
            </p>
          </div>

          <div className="w-full md:w-72 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-tx-muted">
              <span>Overall Completion</span>
              <span className="text-warning">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full border border-border/50 overflow-hidden shadow-inner">
              <div
                className="h-full bg-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.4)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[9px] text-right text-tx-muted/60 font-mono italic">
              {unlockedCount} / {totalCount} Artifacts Recovered
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="bg-panel/10 border-b border-border/30 px-4 md:px-8 py-2 overflow-x-auto custom-scrollbar shrink-0">
        <div className="max-w-5xl mx-auto flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap
                ${
                  activeCategory === cat.id
                    ? "bg-warning/10 border-warning/40 text-warning shadow-sm"
                    : "bg-transparent border-transparent text-tx-muted hover:text-tx-main hover:bg-panel"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENT GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 pb-12">
          {filteredAchievements.map((ach) => (
            <AchievementCard
              key={ach.id}
              achievement={ach}
              isUnlocked={unlockedAchievements.includes(ach.id)}
              // LISÄTTY TÄMÄ: Välitetään tieto onko palkinto jo lunastettu
              isClaimed={claimedAchievements.includes(ach.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
