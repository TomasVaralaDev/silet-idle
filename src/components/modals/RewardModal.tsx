import { useGameStore } from "../../store/useGameStore";
import { useTooltipStore } from "../../store/useToolTipStore"; // 1. TUONTI
import { getItemDetails } from "../../data";
import { getRarityStyle } from "../../utils/rarity";

export default function RewardModal() {
  const { rewardModal, closeRewardModal } = useGameStore();

  // 2. TOOLTIP OHJAIMET
  const showTooltip = useTooltipStore((s) => s.showTooltip);
  const hideTooltip = useTooltipStore((s) => s.hideTooltip);

  const { isOpen, title, rewards } = rewardModal || {
    isOpen: false,
    rewards: [],
  };

  if (!isOpen) return null;

  // Varmistetaan, että tooltip katoaa, kun modal suljetaan
  const handleClose = () => {
    hideTooltip();
    closeRewardModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-app-base/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="relative bg-panel border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-panel/50 p-6 text-center border-b border-border">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
              <img
                src="/assets/ui/icon_reward.png"
                alt="Reward"
                className="w-16 h-16 object-contain pixelated relative z-10"
              />
            </div>
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest text-tx-main">
            {title}
          </h2>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
          {rewards.map((reward, index) => {
            const item = getItemDetails(reward.itemId);
            const rarityTheme = getRarityStyle(item?.rarity || "common");

            return (
              <div
                key={`${reward.itemId}-${index}`}
                // 3. HOVER LOGIIKKA RIVIIN
                onMouseEnter={(e) =>
                  showTooltip(reward.itemId, e.clientX, e.clientY)
                }
                onMouseMove={(e) =>
                  showTooltip(reward.itemId, e.clientX, e.clientY)
                }
                onMouseLeave={hideTooltip}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-help ${rarityTheme.border} ${rarityTheme.lightBg} bg-opacity-10`}
              >
                <div
                  className={`w-12 h-12 bg-app-base rounded-lg border ${rarityTheme.border} flex items-center justify-center shrink-0 relative overflow-hidden`}
                >
                  {item?.icon ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-8 h-8 object-contain pixelated relative z-10"
                    />
                  ) : (
                    <span className="text-2xl relative z-10">📦</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-bold truncate ${rarityTheme.text}`}
                  >
                    {item?.name || reward.itemId}
                  </div>
                  <div className="text-[10px] opacity-70 uppercase font-bold tracking-wider text-tx-muted">
                    {item?.rarity || "Common"} {item?.category || "Item"}
                  </div>
                </div>

                <div className="text-lg font-mono font-black text-tx-main">
                  +{reward.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-panel/30 border-t border-border">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-panel-hover hover:bg-accent hover:text-white text-tx-main font-black rounded-xl uppercase tracking-wider border border-border transition-all active:scale-95 shadow-lg"
          >
            Collect Rewards
          </button>
        </div>
      </div>
    </div>
  );
}
