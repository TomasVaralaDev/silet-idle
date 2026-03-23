import type { PremiumShopItem } from "../../types";

interface PremiumItemCardProps {
  item: PremiumShopItem;
  gems: number;
  isOwned: boolean;
  isPurchasing: boolean;
  purchaseCount: number;
  onClick: (item: PremiumShopItem) => void;
}

export default function PremiumItemCard({
  item,
  gems,
  isOwned,
  isPurchasing,
  purchaseCount,
  onClick,
}: PremiumItemCardProps) {
  const isMaxedOut =
    item.maxPurchases !== undefined && purchaseCount >= item.maxPurchases;

  // Tuote on poissa pelistä, jos se on OneTime ja jo ostettu, TAI jos sen maksimiostomäärä on saavutettu
  const isDisabled = isOwned || isMaxedOut || isPurchasing;

  return (
    <div
      className={`bg-panel border-2 rounded-xl overflow-hidden flex flex-col group transition-all shadow-md ${
        isDisabled
          ? "opacity-50 border-border/20 grayscale-[0.5]"
          : "border-border hover:border-accent/40 hover:shadow-xl cursor-pointer"
      }`}
      onClick={() => !isDisabled && onClick(item)}
    >
      <div className="h-24 md:h-40 bg-app-base/50 flex items-center justify-center relative p-2 md:p-4 border-b border-border/30">
        <img
          src={item.icon}
          className={`w-12 h-12 md:w-20 md:h-20 pixelated drop-shadow-2xl transition-transform ${!isDisabled && "group-hover:scale-110"}`}
          alt={item.name}
        />
      </div>

      <div className="p-3 md:p-5 flex-1 flex flex-col pointer-events-none">
        <h3 className="text-xs md:text-lg font-bold text-tx-main mb-1 uppercase tracking-tight line-clamp-1">
          {item.name}
        </h3>

        <p className="text-[9px] md:text-[11px] text-tx-muted mb-3 flex-1 opacity-80 leading-tight md:leading-snug font-medium line-clamp-2 md:line-clamp-none">
          {item.description}
        </p>

        {/* Kauppamaiset rajoitus-indikaattorit napin yläpuolella (yksinkertaistettu tyyli) */}
        <div className="mb-3 md:mb-4 flex flex-col gap-1.5 mt-auto">
          {item.isOneTime ? (
            <div className="text-[9px] md:text-[10px] font-bold text-warning uppercase tracking-wider">
              One-Time Purchase
            </div>
          ) : item.maxPurchases !== undefined ? (
            <div className="text-[9px] md:text-[10px] font-bold text-info uppercase tracking-wider flex items-center justify-between w-full">
              <span>Stock Available</span>
              <span className="text-white">
                {item.maxPurchases - purchaseCount} / {item.maxPurchases}
              </span>
            </div>
          ) : null}
        </div>

        <button
          disabled={isDisabled}
          className={`w-full py-2 md:py-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-3 transition-all font-black border uppercase tracking-widest text-[10px] md:text-xs pointer-events-auto ${
            isDisabled
              ? "bg-app-base text-tx-muted cursor-not-allowed border-transparent"
              : "bg-panel-hover group-hover:bg-accent group-hover:text-white border-border group-hover:border-accent shadow-inner"
          }`}
        >
          {isOwned ? (
            "OWNED"
          ) : isMaxedOut ? (
            "SOLD OUT"
          ) : (
            <>
              <img
                src="assets/ui/icon_gem.png"
                className="w-3 h-3 md:w-4 md:h-4 pixelated"
                alt="gem"
              />
              <span
                className={
                  gems >= item.priceGems ? "text-inherit" : "text-danger"
                }
              >
                {item.priceGems}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
