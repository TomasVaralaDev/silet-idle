import { getItemDetails } from '../../data';
import type { QuestReward as RewardType } from '../../types';

interface QuestRewardProps {
  reward: RewardType;
}

export default function QuestReward({ reward }: QuestRewardProps) {
  const elements = [];

  if (reward.coins) {
    elements.push(
      <span key="coins" className="text-yellow-400 font-bold">
        {reward.coins} Fragments
      </span>
    );
  }

  if (reward.xpMap) {
    Object.entries(reward.xpMap).forEach(([skill, xp]) => {
      elements.push(
        <span key={skill} className="text-cyan-400 font-bold">
          +{xp} {skill} XP
        </span>
      );
    });
  }

  if (reward.items) {
    reward.items.forEach((item) => {
      const details = getItemDetails(item.itemId);
      elements.push(
        <span key={item.itemId} className="text-emerald-400 font-bold flex items-center gap-1">
          {details?.icon && <img src={details.icon} className="w-4 h-4 pixelated" alt="item" />}
          {item.amount}x {details?.name || item.itemId}
        </span>
      );
    });
  }

  return (
    <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs flex flex-wrap gap-x-2 items-center bg-slate-900/50 p-2 rounded relative z-10">
      <span className="text-slate-500 uppercase font-bold tracking-wider mr-2">Rewards:</span>
      {elements.map((el, i) => (
        <span key={i} className="flex items-center">
          {el}
          {i < elements.length - 1 && <span className="text-slate-600 mx-2">•</span>}
        </span>
      ))}
    </div>
  );
}