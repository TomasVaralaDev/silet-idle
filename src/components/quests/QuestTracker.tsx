import { useGameStore } from "../../store/useGameStore";

export default function QuestTracker() {
  const { dailyQuests } = useGameStore((state) => state.quests);

  // Filter to show quests that are not yet claimed
  const activeQuests = dailyQuests.filter((q) => !q.isClaimed);

  if (activeQuests.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 w-64 shadow-2xl pointer-events-auto">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
          Active Objectives
          <img
            src="./assets/ui/icon_quest.png"
            className="w-3.5 h-3.5 pixelated"
            alt=""
          />
        </h4>

        <div className="space-y-3">
          {activeQuests.map((quest) => {
            const progressPercent = Math.min(
              100,
              (quest.progress / quest.targetAmount) * 100,
            );
            const isDone = quest.isCompleted;

            return (
              <div key={quest.id} className="group">
                <div className="flex justify-between text-[11px] mb-1">
                  <span
                    className={`font-bold truncate pr-2 ${isDone ? "text-emerald-400" : "text-slate-300"}`}
                  >
                    {quest.title}
                  </span>
                  <span className="font-mono text-slate-500 shrink-0">
                    {quest.progress}/{quest.targetAmount}
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${isDone ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-cyan-500"}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {isDone && (
                  <p className="text-[9px] text-emerald-500 font-bold mt-1 animate-pulse uppercase">
                    Ready to claim!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
