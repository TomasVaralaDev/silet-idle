import { useGameStore } from "../../store/useGameStore";
import QuestList from "./QuestList";

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestModal({ isOpen, onClose }: QuestModalProps) {
  // Haetaan vain quests-tila. Poistettu checkDailyReset.
  const quests = useGameStore((state) => state.quests);

  // POISTETTU: useEffect ja checkDailyReset kutsu.
  // Synkronointi hoidetaan nyt globaalisti pelin latautuessa.

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-app-base/80 backdrop-blur-sm p-4 animate-in fade-in duration-300 text-left">
      <div className="bg-panel border border-border rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-panel-hover/50 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-tx-main flex items-center gap-3">
              <img
                src="/assets/ui/icon_quest.png"
                className="w-8 h-8 pixelated drop-shadow-md"
                alt="Quests"
              />
              Daily Quests
            </h2>
            <p className="text-tx-muted text-sm mt-1">
              Complete tasks to earn rewards. Resets at 00:00 UTC.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-tx-muted hover:text-tx-main p-2 rounded-lg hover:bg-panel transition-colors"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-app-base/20">
          <QuestList quests={quests?.dailyQuests || []} />
        </div>
      </div>
    </div>
  );
}
