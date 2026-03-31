import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import type { Resource } from "../../types";

export default function FoodSelector() {
  const inventory = useGameStore((state) => state.inventory);
  const equippedFood = useGameStore((state) => state.equippedFood);
  const equipItem = useGameStore((state) => state.equipItem);
  const combatSettings = useGameStore((state) => state.combatSettings);
  const setState = useGameStore((state) => state.setState);
  const combatStats = useGameStore((state) => state.combatStats);

  // Global cooldown logic for consuming items
  const foodTimer = combatStats?.foodTimer || 0;
  const isGlobalCooldown = foodTimer > 0;
  const cooldownProgress = Math.max(
    0,
    Math.min(100, ((10000 - foodTimer) / 10000) * 100),
  );

  // LISÄTTY: Lasketaan jäljellä oleva aika sekunteina yhden desimaalin tarkkuudella
  const timeLeft = (foodTimer / 1000).toFixed(1);

  // Filter inventory for consumable items and sort by healing power (highest first)
  const foodItems = Object.entries(inventory)
    .filter(([id, count]) => {
      if (count <= 0) return false;
      const details = getItemDetails(id) as Resource | undefined;
      return (
        (details?.healing || 0) > 0 ||
        details?.category === "potion" ||
        details?.slot === "food"
      );
    })
    .sort(([idA], [idB]) => {
      const a = getItemDetails(idA) as Resource | undefined;
      const b = getItemDetails(idB) as Resource | undefined;
      return (b?.healing || 0) - (a?.healing || 0);
    });

  const activeFoodDetails = equippedFood
    ? (getItemDetails(equippedFood.itemId) as Resource | undefined)
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
    <div className="flex flex-col h-full bg-app-base overflow-hidden">
      {/* 1. Auto-Eat Threshold Slider */}
      <div className="bg-panel border-b border-border/50 p-3 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-tx-muted flex items-center gap-1.5">
            Auto-Eat Threshold
          </span>
          <span className="text-[10px] font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20 shadow-sm">
            {combatSettings.autoEatThreshold}% HP
          </span>
        </div>

        {/* Custom Slider Implementation */}
        <div className="relative w-full h-1.5 bg-app-base rounded-full border border-border/50">
          <div
            className="absolute left-0 top-0 bottom-0 bg-success/30 rounded-full"
            style={{ width: `${combatSettings.autoEatThreshold}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={combatSettings.autoEatThreshold}
            onChange={handleSettingChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Visual slider handle */}
          <div
            className="absolute top-1/2 -mt-2 -ml-2 w-4 h-4 bg-panel border-2 border-success rounded-full shadow-[0_0_5px_rgb(var(--color-success)/0.5)] pointer-events-none"
            style={{ left: `${combatSettings.autoEatThreshold}%` }}
          />
        </div>
      </div>

      {/* 2. Inventory Grid & Active Item */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {foodItems.length === 0 && !equippedFood ? (
          <div className="h-full flex flex-col items-center justify-center text-tx-muted opacity-50">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              No consumables
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {/* Active Item (Always displayed first) */}
            {equippedFood && activeFoodDetails && (
              <button
                disabled={isGlobalCooldown}
                className="aspect-square bg-success/5 border border-success ring-1 ring-success/30 rounded-xl flex flex-col items-center justify-center relative group transition-all shadow-[0_0_15px_rgba(var(--color-success)/0.15)] col-start-1"
                title={`Unequip ${activeFoodDetails.name}`}
                onClick={() => equipItem(equippedFood.itemId)}
              >
                {/* Cooldown overlay for the active item */}
                {isGlobalCooldown && (
                  <>
                    <div
                      className="absolute inset-0 bg-app-base/80 z-10 transition-transform duration-100 ease-linear rounded-xl origin-left"
                      style={{
                        transform: `scaleX(${cooldownProgress / 100})`,
                      }}
                    />
                    {/* LISÄTTY: Ajastimen teksti */}
                    <div className="absolute inset-0 flex items-center justify-center z-40">
                      <span className="text-[11px] font-black text-danger font-mono bg-panel/80 px-1.5 py-0.5 rounded border border-danger/30 shadow-md">
                        {timeLeft}s
                      </span>
                    </div>
                  </>
                )}

                <img
                  src={activeFoodDetails.icon}
                  className={`w-8 h-8 pixelated object-contain z-20 transition-transform ${isGlobalCooldown ? "opacity-50" : "group-hover:scale-110"}`}
                  alt={activeFoodDetails.name}
                />

                <span className="absolute top-1 left-1 bg-success text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow z-30">
                  ACTIVE
                </span>

                <span className="absolute bottom-1 right-1 text-[9px] font-mono text-tx-main bg-panel/90 px-1.5 py-0.5 rounded border border-border z-30 shadow-sm">
                  {equippedFood.count}
                </span>
              </button>
            )}

            {/* Other available consumables */}
            {foodItems.map(([id, count]) => {
              if (id === equippedFood?.itemId) return null; // Skip if already active
              const item = getItemDetails(id) as Resource | undefined;
              if (!item) return null;

              return (
                <button
                  key={id}
                  onClick={() => equipItem(id)}
                  disabled={isGlobalCooldown}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center relative group transition-all overflow-hidden border
                    ${isGlobalCooldown ? "cursor-not-allowed bg-app-base border-border/50 opacity-60" : "bg-panel border-border hover:border-tx-main/50 hover:bg-panel-hover shadow-sm"}
                  `}
                  title={`${item.name}\nHeals: ${item.healing || 0} HP`}
                >
                  <img
                    src={item.icon}
                    className="w-7 h-7 pixelated object-contain z-20 transition-transform group-hover:scale-110"
                    alt={item.name}
                  />

                  <span className="absolute bottom-1 right-1 text-[9px] font-mono text-tx-muted group-hover:text-tx-main bg-app-base/90 px-1 rounded z-30">
                    {count as number}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
