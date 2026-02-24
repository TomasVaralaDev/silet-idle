import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import QuestList from './QuestList';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestModal({ isOpen, onClose }: QuestModalProps) {
  const quests = useGameStore((state) => state.quests);
  const checkDailyReset = useGameStore((state) => state.checkDailyReset);

  useEffect(() => {
    if (isOpen) {
      checkDailyReset();
    }
  }, [isOpen, checkDailyReset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-xl shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-3">
              <img 
                src="/assets/ui/icon_quest.png" 
                className="w-8 h-8 pixelated" 
                alt="Quests" 
              />
              Daily Quests
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Complete tasks to earn rewards. Resets daily.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <QuestList quests={quests?.dailyQuests || []} />
        </div>
      </div>
    </div>
  );
}