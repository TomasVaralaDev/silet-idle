import type { ActiveQuest } from '../../types';
import QuestCard from './QuestCard';

interface QuestListProps {
  quests: ActiveQuest[];
}

export default function QuestList({ quests }: QuestListProps) {
  if (!quests || quests.length === 0) {
    return (
      <div className="text-center p-10 text-slate-500 font-bold">
        No quests available right now. Wait for the daily reset.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}