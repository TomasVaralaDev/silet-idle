import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";

interface ConsumableItem {
  healing?: number;
  category?: string;
  slot?: string;
}

export default function FoodSelector() {
  const inventory = useGameStore((state) => state.inventory);
  const equippedFood = useGameStore((state) => state.equippedFood);
  const equipItem = useGameStore((state) => state.equipItem);
  const combatSettings = useGameStore((state) => state.combatSettings);
  const setState = useGameStore((state) => state.setState);
  const combatStats = useGameStore((state) => state.combatStats);

  // --- COOLDOWN LOGIIKKA ---
  const foodTimer = combatStats?.foodTimer || 0;
  const isGlobalCooldown = foodTimer > 0;
  const cooldownProgress = Math.max(
    0,
    Math.min(100, ((10000 - foodTimer) / 10000) * 100)
  );

  const foodItems = Object.entries(inventory).filter(([id]) => {
    const details = getItemDetails(id);
    const item = details as unknown as ConsumableItem;
    return (
      (item?.healing || 0) > 0 ||
      details?.category === "potion" ||
      details?.slot === "food"
    );
  });

  const activeFoodDetails = equippedFood
    ? getItemDetails(equippedFood.itemId)
    : null;

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      combatSettings: {
        ...state.combatSettings,
        autoEatThreshold: parseInt(e.target.value),
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ACTIVE FOOD & SETTINGS (Yläpalkki) */}
      <div className="flex items-center gap-3 bg-panel/50 p-2 rounded-lg border border-border relative overflow-hidden text-left">
        {/* COOLDOWN SWIPE AKTIIVISELLE RUOALLE */}
        {isGlobalCooldown && activeFoodDetails && (
          <>
            <div className="absolute inset-0 bg-panel/40 z-0" />
            <div
              className="absolute inset-0 bg-app-base/60 z-10 transition-transform duration-100 ease-linear"
              style={{
                transform: `translateX(${cooldownProgress}%)`,
                width: "100%",
              }}
            />
            <div
              className="absolute inset-0 w-1 bg-success shadow-[0_0_10px_rgb(var(--color-success)/0.5)] z-20 transition-transform duration-100 ease-linear"
              style={{ transform: `translateX(${cooldownProgress}%)` }}
            />
          </>
        )}

        <div
          className={`w-12 h-12 bg-app-base border rounded flex items-center justify-center relative shrink-0 z-30 transition-all ${
            isGlobalCooldown
              ? "grayscale opacity-50 border-border"
              : "border-success/50"
          }`}
        >
          {activeFoodDetails ? (
            <img
              src={activeFoodDetails.icon}
              className="w-8 h-8 pixelated object-contain"
              alt={activeFoodDetails.name}
            />
          ) : (
            <div className="w-2 h-2 rounded-full bg-panel-hover"></div>
          )}
          {equippedFood && (
            <span className="absolute -top-2 -right-2 bg-success text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-black/20 shadow-sm">
              {equippedFood.count}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 z-30 pr-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-tx-muted font-black uppercase tracking-widest">
              {isGlobalCooldown
                ? `Recharging: ${(foodTimer / 1000).toFixed(1)}s`
                : "Auto-Eat Threshold"}
            </span>
            <span className="text-[9px] text-success font-black">
              {combatSettings.autoEatThreshold}% HP
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={combatSettings.autoEatThreshold}
            onChange={handleSettingChange}
            className="w-full h-1 bg-panel-hover rounded-lg appearance-none cursor-pointer accent-success transition-all"
          />
        </div>
      </div>

      {/* INVENTORY GRID (Vaihtoehdot) */}
      <div className="overflow-y-auto custom-scrollbar max-h-[150px]">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {foodItems.map(([id, count]) => {
            const item = getItemDetails(id);
            const isEquipped = equippedFood?.itemId === id;

            return (
              <button
                key={id}
                onClick={() => equipItem(id)}
                disabled={isGlobalCooldown}
                className={`
                            aspect-square bg-panel border rounded flex flex-col items-center justify-center relative group transition-all overflow-hidden
                            ${
                              isEquipped
                                ? "border-success ring-1 ring-success/20"
                                : "border-border hover:border-border-hover"
                            }
                            ${
                              isGlobalCooldown
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }
                        `}
                title={`${item?.name} (Heals ${item?.healing || 0} HP)`}
              >
                {/* COOLDOWN SWIPE PIENILLE IKONEILLE */}
                {isGlobalCooldown && (
                  <div
                    className="absolute inset-0 bg-app-base/80 z-10 transition-transform duration-100 ease-linear"
                    style={{
                      transform: `translateX(${cooldownProgress}%)`,
                      width: "100%",
                    }}
                  />
                )}

                {item?.icon && (
                  <img
                    src={item.icon}
                    className={`w-6 h-6 pixelated object-contain z-20 transition-all ${
                      isGlobalCooldown
                        ? "grayscale opacity-30"
                        : "group-hover:scale-110"
                    }`}
                    alt={item.name}
                  />
                )}

                <span className="absolute bottom-0 right-1 text-[9px] text-tx-muted bg-app-base/80 px-1 rounded z-30 font-mono">
                  {count as number}
                </span>

                {(item?.healing || 0) > 0 && !isGlobalCooldown && (
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-success/50 z-30 shadow-[0_0_5px_rgb(var(--color-success)/0.5)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
