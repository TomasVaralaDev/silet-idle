import { useEffect } from "react";
import type { PremiumShopItem } from "../../types";
import { getItemById } from "../../utils/itemUtils";
import { useTooltipStore } from "../../store/useToolTipStore"; // LISÄTTY

interface BundlePreviewModalProps {
  isOpen: boolean;
  item: PremiumShopItem | null;
  onClose: () => void;
  onConfirm: (item: PremiumShopItem) => void;
  userGems: number;
  isProcessing: boolean;
}

export default function BundlePreviewModal({
  isOpen,
  item,
  onClose,
  onConfirm,
  userGems,
  isProcessing,
}: BundlePreviewModalProps) {
  const { showTooltip, hideTooltip } = useTooltipStore(); // LISÄTTY

  // LISÄTTY: Varmistetaan, että tooltip katoaa aina, kun modaali suljetaan tai unmountataan
  useEffect(() => {
    if (!isOpen) {
      hideTooltip();
    }
    return () => hideTooltip();
  }, [isOpen, hideTooltip]);

  if (!isOpen || !item) return null;

  const canAfford = userGems >= item.priceGems;

  const getIconForReward = (key: string) => {
    if (key === "gems") return "assets/ui/icon_gem.png";
    if (key === "coins") return "assets/ui/icon_coin.png";
    if (key.includes("Slots")) return "assets/ui/icon_upgrade.png";

    const itemData = getItemById(key);
    if (itemData?.icon) {
      return itemData.icon;
    }

    return `assets/items/${key}.png`;
  };

  const handleClose = () => {
    hideTooltip();
    onClose();
  };

  const handleConfirm = (bundleItem: PremiumShopItem) => {
    hideTooltip();
    onConfirm(bundleItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-panel border-2 border-border/50 rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* SULJE-NAPPI */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 text-tx-muted hover:text-white hover:bg-danger/20 transition-all z-10 disabled:opacity-50"
        >
          ✕
        </button>

        {/* HEADER & KUVA */}
        <div className="bg-app-base/80 p-6 flex flex-col items-center justify-center border-b border-border/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full scale-150"></div>

          <img
            src={item.icon}
            className="w-24 h-24 pixelated drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10 animate-pulse-slow"
            alt={item.name}
          />
          <h2 className="text-2xl font-black text-tx-main uppercase tracking-widest mt-4 text-center z-10 drop-shadow-md">
            {item.name}
          </h2>
          <p className="text-tx-muted text-xs text-center mt-2 max-w-[80%] z-10 font-medium">
            {item.description}
          </p>
        </div>

        {/* SISÄLTÖ / PALKINNOT */}
        <div className="p-6 bg-panel">
          <h3 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4 text-center">
            Bundle Contents
          </h3>

          <div className="space-y-2">
            {/* Gemit */}
            {item.rewards?.rewardGems && (
              <div className="flex items-center justify-between p-3 bg-app-base/50 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <img
                    src="assets/ui/icon_gem.png"
                    className="w-6 h-6 pixelated"
                    alt="Gems"
                  />
                  <span className="font-bold text-tx-main">Gems</span>
                </div>
                <span className="font-black text-accent">
                  +{item.rewards.rewardGems}
                </span>
              </div>
            )}

            {/* Expedition Stats */}
            {item.rewards?.stats?.expeditionSlotsIncrement && (
              <div className="flex items-center justify-between p-3 bg-app-base/50 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <img
                    src="assets/ui/icon_upgrade.png"
                    className="w-6 h-6 pixelated"
                    alt="Expedition Slots"
                    onError={(e) =>
                      (e.currentTarget.src = "assets/ui/icon_star.png")
                    }
                  />
                  <span className="font-bold text-tx-main">
                    Expedition Slots
                  </span>
                </div>
                <span className="font-black text-warning">
                  +{item.rewards.stats.expeditionSlotsIncrement}
                </span>
              </div>
            )}

            {/* Queue Stats */}
            {item.rewards?.stats?.queueSlotsSet && (
              <div className="flex items-center justify-between p-3 bg-app-base/50 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <img
                    src="assets/ui/icon_upgrade.png"
                    className="w-6 h-6 pixelated"
                    alt="Queue Slots"
                    onError={(e) =>
                      (e.currentTarget.src = "assets/ui/icon_star.png")
                    }
                  />
                  <span className="font-bold text-tx-main">
                    Max Queue Slots
                  </span>
                </div>
                <span className="font-black text-warning">
                  Unlock All ({item.rewards.stats.queueSlotsSet})
                </span>
              </div>
            )}

            {/* Tavarat - LISÄTTY TOOLTIP EVENTIT */}
            {item.rewards?.items &&
              Object.entries(item.rewards.items).map(([itemId, amount]) => (
                <div
                  key={itemId}
                  className="flex items-center justify-between p-3 bg-app-base/50 rounded-lg border border-border/30 hover:border-accent/40 hover:bg-panel-hover transition-colors cursor-help"
                  onMouseEnter={(e) =>
                    showTooltip(itemId, e.clientX, e.clientY)
                  }
                  onMouseMove={(e) => showTooltip(itemId, e.clientX, e.clientY)}
                  onMouseLeave={hideTooltip}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getIconForReward(itemId)}
                      className="w-6 h-6 pixelated"
                      alt={itemId}
                      onError={(e) => {
                        e.currentTarget.src = "assets/ui/icon_unknown.png";
                      }}
                    />
                    <span className="font-bold text-tx-main capitalize">
                      {itemId.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="font-black text-info">x{amount}</span>
                </div>
              ))}
          </div>
        </div>

        {/* ALATUNNISTE / OSTONAPPI */}
        <div className="p-4 border-t border-border/50 bg-app-base/80">
          <button
            disabled={!canAfford || isProcessing}
            onClick={() => handleConfirm(item)}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all font-black text-sm uppercase tracking-widest border-2 ${
              isProcessing
                ? "bg-accent/20 text-accent border-accent/50 cursor-wait"
                : canAfford
                  ? "bg-accent hover:bg-accent-hover text-white border-accent/50 shadow-[0_0_15px_rgba(var(--color-accent),0.4)]"
                  : "bg-panel border-danger/30 text-danger cursor-not-allowed opacity-70"
            }`}
          >
            {isProcessing ? (
              "PROCESSING..."
            ) : (
              <>
                <span>Confirm Purchase</span>
                <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                  <img
                    src="assets/ui/icon_gem.png"
                    className="w-4 h-4 pixelated"
                    alt="gem"
                  />
                  <span>{item.priceGems}</span>
                </div>
              </>
            )}
          </button>
          {!canAfford && !isProcessing && (
            <p className="text-center text-danger text-[10px] mt-2 font-bold uppercase tracking-wider">
              Not enough gems
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
