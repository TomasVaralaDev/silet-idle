import { getItemDetails } from "../../data";
import type { QuestReward as RewardType } from "../../types";

interface QuestRewardProps {
  reward: RewardType;
}

export default function QuestReward({ reward }: QuestRewardProps) {
  const elements = [];

  // Fragments / Coins
  if (reward.coins) {
    elements.push(
      <span
        key="coins"
        className="text-warning font-bold flex items-center gap-1"
      >
        <img
          src="./assets/ui/coins.png"
          className="w-3.5 h-3.5 pixelated"
          alt=""
        />
        {reward.coins.toLocaleString()} Fragments
      </span>,
    );
  }

  // XP Rewards
  if (reward.xpMap) {
    Object.entries(reward.xpMap).forEach(([skill, xp]) => {
      elements.push(
        <span key={skill} className="text-accent font-bold">
          +{xp} {skill} XP
        </span>,
      );
    });
  }

  // Item Rewards
  if (reward.items) {
    reward.items.forEach((item) => {
      const details = getItemDetails(item.itemId);
      elements.push(
        <span
          key={item.itemId}
          className="text-success font-bold flex items-center gap-1.5"
        >
          {details?.icon && (
            <div className="bg-app-base p-0.5 rounded border border-border/30">
              <img
                src={details.icon}
                className="w-3.5 h-3.5 pixelated"
                alt="item"
              />
            </div>
          )}
          {item.amount}x {details?.name || item.itemId}
        </span>,
      );
    });
  }

  return (
    <div className="mt-4 pt-3 border-t border-border/50 text-[11px] flex flex-wrap gap-x-3 gap-y-2 items-center bg-app-base/40 p-3 rounded-lg relative z-10 shadow-inner">
      <span className="text-tx-muted uppercase font-black tracking-widest mr-1 opacity-70">
        Rewards:
      </span>
      {elements.map((el, i) => (
        <span key={i} className="flex items-center">
          {el}
          {i < elements.length - 1 && (
            <span className="text-border mx-3 font-black opacity-50 select-none">
              •
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
