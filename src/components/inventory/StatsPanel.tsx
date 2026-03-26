import { useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import {
  getPlayerStats,
  calculateCombatPower,
} from "../../utils/combatMechanics";
import { formatNumber, formatAttackSpeed } from "../../utils/formatUtils";
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
          acc.hpBonus += item.stats.hpBonus || 0;
          acc.critChance += item.stats.critChance || 0;

          if (item.stats.critMulti && item.stats.critMulti > acc.critMulti) {
            acc.critMulti = item.stats.critMulti;
          }
          if (item.slot === "weapon" && item.stats.attackSpeed) {
            acc.attackSpeed = item.stats.attackSpeed;
          }
        }
        return acc;
      },
      {
        damage: 0,
        armor: 0,
        hpBonus: 0,
        critChance: 0,
        critMulti: 1.5,
        attackSpeed: 2400,
      },
    );

    const weaponItem = equipment.weapon
      ? (getItemDetails(equipment.weapon) as Resource)
      : null;
    const style: CombatStyle = weaponItem?.combatStyle || "melee";

    const baseStats = getPlayerStats(skills, style, {
      damage: gearTotals.damage,
      armor: gearTotals.armor,
      hpBonus: gearTotals.hpBonus,
      attackSpeed: gearTotals.attackSpeed,
      critChance: gearTotals.critChance,
      critMulti: gearTotals.critMulti,
    });

    const maxHit =
      (baseStats.weaponBase + 0.5 * baseStats.mainStat) *
      (1 + baseStats.bonusDamage);

    const combatPower = calculateCombatPower({
      maxHit,
      attackSpeed: baseStats.attackSpeed,
      critChance: baseStats.critChance,
      critMultiplier: baseStats.critMultiplier,
      maxHp: baseStats.maxHp,
      armor: baseStats.armor,
    });

    return {
      ...baseStats,
      maxHit: Math.floor(maxHit),
      minHit: Math.floor(maxHit * 0.5),
      combatPower,
      style,
      gearHpBonus: gearTotals.hpBonus,
    };
  }, [equipment, skills]);

  const foodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;
  const foodTimer = combatStats?.foodTimer || 0;
  const isCooldown = foodTimer > 0;
  const cooldownProgress = Math.max(
    0,
    Math.min(100, ((10000 - foodTimer) / 10000) * 100),
  );

  return (
    <div className="bg-panel border border-border rounded-xl flex flex-col shadow-2xl overflow-hidden shrink-0">
      {/* HEADER WITH COMBAT POWER */}
      <div className="p-4 border-b border-border bg-app-base/30 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em]">
            Combat Stats
          </h3>
          <div className="text-[9px] text-accent uppercase font-bold mt-0.5">
            Style: {playerCombatStats.style}
          </div>
        </div>
        <div className="text-right flex flex-col items-end justify-center">
          <div className="text-[9px] font-bold text-tx-muted uppercase mb-1">
            Combat Power
          </div>
          <div className="text-xl font-black text-warning leading-none">
            {formatNumber(playerCombatStats.combatPower)}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* OFFENSIVE SECTION */}
        <section>
          <h4 className="text-[9px] font-black text-warning uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-warning/20"></span> Offensive Stats{" "}
            <span className="h-px flex-1 bg-warning/20"></span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="Damage"
              value={`${playerCombatStats.minHit}-${playerCombatStats.maxHit}`}
              icon="/assets/ui/icon_damage.png"
              color="text-warning"
            />
            <StatBox
              label="Attack Speed"
              value={formatAttackSpeed(playerCombatStats.attackSpeed)}
              icon="/assets/ui/icon_attackspeed.png"
              color="text-accent"
            />
            <StatBox
              label="Crit Chance"
              value={`${(playerCombatStats.critChance * 100).toFixed(1)}%`}
              icon="/assets/ui/icon_critchance.png"
              color="text-danger"
            />
            <StatBox
              label="Crit Multi"
              value={`${playerCombatStats.critMultiplier.toFixed(1)}x`}
              icon="/assets/ui/icon_critmulti.png"
              color="text-danger"
            />
          </div>
        </section>

        {/* DEFENSIVE SECTION */}
        <section>
          <h4 className="text-[9px] font-black text-success uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-success/20"></span> Defensive Stats{" "}
            <span className="h-px flex-1 bg-success/20"></span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="Vitality"
              value={formatNumber(playerCombatStats.maxHp)}
              subValue={`+${playerCombatStats.gearHpBonus} gear`}
              icon="/assets/ui/icon_vitality.png"
              color="text-danger"
            />
            <StatBox
              label="Armor"
              value={formatNumber(playerCombatStats.armor)}
              subValue={`${Math.floor((1 - 1 / (1 + playerCombatStats.armor / 100)) * 100)}% reduction`}
              icon="/assets/ui/icon_armorstat.png"
              color="text-accent"
            />
          </div>
        </section>

        {/* AUTO-RECOVERY SECTION */}
        <section className="bg-app-base/40 rounded-xl p-3 border border-border/50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[9px] font-black text-tx-muted uppercase tracking-widest">
              Auto-Heal
            </h4>
            <span className="text-[10px] font-mono font-bold text-success">
              {combatSettings.autoEatThreshold}% HP
            </span>
          </div>

          <button
            onClick={() => !isCooldown && equippedFood && unequipItem("food")}
            disabled={!equippedFood}
            className={`w-full p-2 rounded-lg border transition-all flex items-center gap-3 relative mb-3 overflow-hidden ${
              foodItem
                ? isCooldown
                  ? "bg-app-base opacity-80"
                  : "bg-panel-hover/50 hover:border-success/30"
                : "border-dashed opacity-40"
            }`}
          >
            {foodItem ? (
              <>
                {isCooldown && (
                  <div
                    className="absolute inset-0 bg-panel-hover/90 z-10 origin-left transition-transform duration-100"
                    style={{
                      transform: `scaleX(${1 - cooldownProgress / 100})`,
                    }}
                  />
                )}
                <img
                  src={foodItem.icon}
                  className="w-6 h-6 pixelated z-20"
                  alt=""
                />
                <div className="flex-1 text-left z-20 overflow-hidden">
                  <div className="text-[10px] font-bold truncate">
                    {foodItem.name}
                  </div>
                  <div className="text-[8px] text-success">
                    Heals {foodItem.healing} HP
                  </div>
                </div>
                <div className="text-[10px] font-black z-20 pl-2">
                  x{equippedFood?.count}
                </div>
              </>
            ) : (
              <div className="text-[9px] uppercase font-bold w-full text-center py-1 tracking-tighter">
                Empty Slot
              </div>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={combatSettings.autoEatThreshold}
            onChange={(e) =>
              setState((s) => ({
                combatSettings: {
                  ...s.combatSettings,
                  autoEatThreshold: parseInt(e.target.value),
                },
              }))
            }
            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-success"
          />
        </section>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  subValue,
  icon,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-app-base/40 p-2.5 rounded-lg border border-border/40 hover:border-border transition-colors shadow-inner flex flex-col justify-center">
      <div className="text-[8px] text-tx-muted uppercase font-black mb-1 flex items-center gap-1.5">
        <img src={icon} className="w-3 h-3 pixelated opacity-80" alt={label} />
        {label}
      </div>
      <div className={`text-sm font-mono font-black ${color}`}>{value}</div>
      {subValue && (
        <div className="text-[7px] text-tx-muted/60 font-bold uppercase mt-0.5 tracking-wide">
          {subValue}
        </div>
      )}
    </div>
  );
}
