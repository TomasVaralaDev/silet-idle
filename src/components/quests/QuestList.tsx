import type { ActiveQuest } from "../../types";
import QuestCard from "./QuestCard";

interface QuestListProps {
  quests: ActiveQuest[];
}

export default function QuestList({ quests }: QuestListProps) {
  if (!quests || quests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-tx-muted/50 border-2 border-dashed border-border/20 rounded-xl">
        <img
          src="/assets/ui/icon_quest.png"
          alt="No quests"
          className="w-12 h-12 mb-3 opacity-20 grayscale pixelated"
        />
        <p className="font-black uppercase tracking-widest text-[10px]">
          No quests available right now.
          <br />
          Wait for the daily reset.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
