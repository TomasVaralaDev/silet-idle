import { useGameStore } from "../../store/useGameStore";
import { getRequiredXpForLevel } from "../../utils/gameUtils";
import { getItemDetails } from "../../data";
import type { Resource } from "../../types";

export default function PlayerStats() {
  const { skills, combatStats, username, equipment } = useGameStore();

  // 1. Calculate HP bonus from equipped items
  const gearHpBonus = (Object.values(equipment) as (string | null)[]).reduce(
    (acc, itemId) => {
      if (!itemId) return acc;
      const item = getItemDetails(itemId) as Resource;
      return acc + (item?.stats?.hpBonus || 0);
    },
    0,
  );

  // 2. Calculate final Max HP (Ensures formula consistency with combatMechanics)
  const currentHpLevel = skills.hitpoints?.level || 10;
  const baseHp = currentHpLevel * 10;
  const maxHp = baseHp + gearHpBonus;

  // 3. Current HP logic (Includes visual clamp to prevent exceeding max)
  const currentHp = Math.min(combatStats.hp, maxHp);
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  const hitpointsXp = skills.hitpoints?.xp || 0;
  const hitpointsReq = getRequiredXpForLevel(currentHpLevel);
  const hpXpPercent = Math.min(100, (hitpointsXp / hitpointsReq) * 100);

  return (
    <div className="bg-panel/50 rounded-xl border border-border p-4 shadow-sm backdrop-blur-sm">
      {
        // Profile and XP Section
      }
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-accent/20 rounded-full border border-accent/30 flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-xl">👤</span>
        </div>

        <div className="flex-1 overflow-hidden text-left">
          <h3 className="font-black text-tx-main truncate uppercase tracking-tight">
            {username}
          </h3>

          <div className="text-[10px] text-tx-muted flex justify-between mt-1 font-mono">
            <span className="uppercase tracking-tighter">
              HP Lvl:{" "}
              <span className="text-tx-main font-bold">{currentHpLevel}</span>
            </span>
            <span>
              {Math.floor(hitpointsXp).toLocaleString()} /{" "}
              {hitpointsReq.toLocaleString()} XP
            </span>
          </div>

          {
            // HP XP Progress Bar
          }
          <div className="h-1 bg-app-base rounded-full mt-1 border border-border/50 overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 shadow-[0_0_8px_rgb(var(--color-accent)/0.4)]"
              style={{ width: `${hpXpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {
        // Main Health Bar (Actual current HP)
      }
      <div className="space-y-1 mt-3">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest px-1">
          <span className="text-danger">Vital Signs</span>
          <span className="text-tx-main font-mono">
            {Math.floor(currentHp)} / {maxHp}
          </span>
        </div>
        <div className="h-3 bg-app-base rounded-full overflow-hidden border border-border shadow-inner">
          <div
            className="h-full bg-danger transition-all duration-300 ease-out shadow-[0_0_10px_rgb(var(--color-danger)/0.3)]"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {
        // Combat Statistics Grid
      }
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/30">
        <div className="text-center group">
          <div className="text-[9px] text-tx-muted uppercase font-black tracking-[0.2em] group-hover:text-accent transition-colors">
            ATK
          </div>
          <div className="font-mono text-sm font-black text-tx-main">
            {skills.attack?.level || 1}
          </div>
        </div>
        <div className="text-center group">
          <div className="text-[9px] text-tx-muted uppercase font-black tracking-[0.2em] group-hover:text-accent transition-colors">
            DEF
          </div>
          <div className="font-mono text-sm font-black text-tx-main">
            {skills.defense?.level || 1}
          </div>
        </div>
        <div className="text-center group">
          <div className="text-[9px] text-tx-muted uppercase font-black tracking-[0.2em] group-hover:text-accent transition-colors">
            STR
          </div>
          <div className="font-mono text-sm font-black text-tx-main">
            {skills.melee?.level || 1}
          </div>
        </div>
      </div>
    </div>
  );
}
