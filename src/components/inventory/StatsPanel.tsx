import { useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import { getPlayerStats } from "../../utils/combatMechanics";
import { formatNumber } from "../../utils/formatUtils";
import type { CombatStyle, Resource } from "../../types";

export default function StatsPanel() {
  const {
    equipment,
    equippedFood,
    skills,
    unequipItem,
    combatSettings,
    setState,
    combatStats,
  } = useGameStore();

  const playerCombatStats = useMemo(() => {
    const gearTotals = Object.values(equipment).reduce(
      (acc, itemId) => {
        if (!itemId) return acc;
        const item = getItemDetails(itemId) as Resource;
        if (item?.stats) {
          acc.damage += item.stats.attack || 0;
          acc.armor += item.stats.defense || 0;
          const itemStats = item.stats as Record<string, number | undefined>;
          acc.hp += itemStats.hp || 0;
        }
        return acc;
      },
      { damage: 0, armor: 0, hp: 0 }
    );

    const weaponItem = equipment.weapon
      ? (getItemDetails(equipment.weapon) as Resource)
      : null;
    const style: CombatStyle = weaponItem?.combatStyle || "melee";

    const baseStats = getPlayerStats(skills, style, {
      damage: gearTotals.damage,
      armor: gearTotals.armor,
    });

    const finalMaxHp = baseStats.maxHp + gearTotals.hp;
    const maxHit =
      (baseStats.weaponBase + 0.5 * baseStats.mainStat) *
      (1 + baseStats.bonusDamage);

    return {
      ...baseStats,
      maxHp: finalMaxHp,
      maxHit: Math.floor(maxHit),
      minHit: Math.floor(maxHit * 0.5),
      style,
    };
  }, [equipment, skills]);

  const foodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;
  const foodTimer = combatStats?.foodTimer || 0;
  const isCooldown = foodTimer > 0;
  const cooldownProgress = Math.max(
    0,
    Math.min(100, ((10000 - foodTimer) / 10000) * 100)
  );

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value);
    setState((state) => ({
      combatSettings: { ...state.combatSettings, autoEatThreshold: newVal },
    }));
  };

  return (
    <div className="bg-panel border border-border rounded-xl p-4 flex flex-col shadow-2xl overflow-hidden">
      <h3 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4 border-b border-border pb-2 flex justify-between">
        Combat Readiness
        <span className="text-accent">v2.0</span>
      </h3>

      {/* CONSUMABLE SECTION */}
      <div className="mb-6 bg-app-base/50 p-3 rounded-lg border border-border/50">
        <h4 className="text-[9px] font-bold text-tx-muted/80 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
          Auto-Recovery System
        </h4>

        <button
          onClick={() => !isCooldown && equippedFood && unequipItem("food")}
          disabled={!equippedFood}
          className={`
            w-full p-2 rounded-lg border transition-all flex items-center gap-3 group relative text-left mb-4 overflow-hidden
            ${
              foodItem
                ? isCooldown
                  ? "bg-app-base border-border cursor-not-allowed"
                  : "bg-panel-hover/50 border-border hover:border-success/30 cursor-pointer"
                : "bg-app-base/30 border-border border-dashed cursor-default"
            }
          `}
        >
          {foodItem ? (
            <>
              {isCooldown && (
                <div className="absolute inset-0 bg-app-base/40 z-0" />
              )}
              {isCooldown && (
                <div
                  className="absolute inset-0 bg-panel-hover/90 z-10 transition-transform duration-100 ease-linear"
                  style={{
                    transform: `translateX(${cooldownProgress}%)`,
                    width: "100%",
                  }}
                />
              )}
              <div
                className={`w-8 h-8 rounded bg-app-base border border-border flex items-center justify-center shrink-0 z-30 ${
                  isCooldown ? "grayscale opacity-40" : ""
                }`}
              >
                <img
                  src={foodItem.icon}
                  alt={foodItem.name}
                  className="w-6 h-6 pixelated object-contain"
                />
              </div>
              <div
                className={`flex-1 min-w-0 z-30 ${
                  isCooldown ? "opacity-40" : ""
                }`}
              >
                <div className="text-[11px] font-bold text-tx-main truncate">
                  {foodItem.name}
                </div>
                <div className="text-[9px] font-medium text-success">
                  {isCooldown ? `REBOOTING...` : `HEALS ${foodItem.healing} HP`}
                </div>
              </div>
              <div className="text-xs font-black z-30 pr-1 text-tx-muted">
                x{equippedFood?.count}
              </div>
              {!isCooldown && (
                <div className="absolute inset-0 flex items-center justify-center bg-danger/10 text-danger text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity z-40 backdrop-blur-[1px]">
                  Remove
                </div>
              )}
            </>
          ) : (
            <div className="text-[10px] text-tx-muted/40 font-bold w-full text-center py-1 uppercase tracking-tighter">
              No Food Equipped
            </div>
          )}
        </button>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] uppercase font-bold text-tx-muted">
              Threshold
            </span>
            <span className="text-[10px] font-mono font-bold text-success">
              {combatSettings.autoEatThreshold}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={combatSettings.autoEatThreshold}
            onChange={handleThresholdChange}
            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-success"
          />
        </div>
      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* HP */}
        <div className="bg-app-base/40 p-2 rounded border border-border/50">
          <div className="text-[9px] text-tx-muted uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-danger">❤️</span> Vitality
          </div>
          <div className="text-sm font-mono font-bold text-tx-main">
            {formatNumber(playerCombatStats.maxHp)}{" "}
            <span className="text-[10px] text-tx-muted font-normal">HP</span>
          </div>
        </div>

        {/* Defense */}
        <div className="bg-app-base/40 p-2 rounded border border-border/50">
          <div className="text-[9px] text-tx-muted uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-accent">🛡️</span> Armor
          </div>
          <div className="text-sm font-mono font-bold text-tx-main">
            {formatNumber(playerCombatStats.armor)}
          </div>
        </div>

        {/* Damage */}
        <div className="bg-app-base/40 p-2 rounded border border-border/50">
          <div className="text-[9px] text-tx-muted uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-warning">⚔️</span> Damage
          </div>
          <div className="text-sm font-mono font-bold text-tx-main">
            {playerCombatStats.minHit}-{playerCombatStats.maxHit}
          </div>
        </div>

        {/* Crit */}
        <div className="bg-app-base/40 p-2 rounded border border-border/50">
          <div className="text-[9px] text-tx-muted uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-accent-hover opacity-80">🎯</span> Precision
          </div>
          <div className="text-sm font-mono font-bold text-tx-main">
            {(playerCombatStats.critChance * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* EXTRA INFO AREA */}
      <div className="mt-auto pt-4 border-t border-border flex justify-between items-center opacity-60">
        <div className="text-[9px] uppercase font-black text-tx-muted">
          Style: <span className="text-accent">{playerCombatStats.style}</span>
        </div>
        <div className="text-[9px] uppercase font-black text-tx-muted">
          Speed:{" "}
          <span className="text-warning">
            {playerCombatStats.attackSpeed.toFixed(1)}s
          </span>
        </div>
      </div>
    </div>
  );
}