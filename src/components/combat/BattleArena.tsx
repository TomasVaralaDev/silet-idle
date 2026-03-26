import { useGameStore } from "../../store/useGameStore";
import { WORLD_INFO } from "../../data/worlds";
import { getItemDetails } from "../../data";
import { getPlayerStats } from "../../utils/combatMechanics";
import type { Resource, CombatStyle } from "../../types";
import { useMemo, useState, useEffect, useRef } from "react";

export default function BattleArena({
  selectedWorldId,
}: {
  selectedWorldId: number;
}) {
  const { enemy, combatStats, stopCombat, skills, avatar, equipment } =
    useGameStore();

  // Local states for handling visual effects (VFX)
  const [isShaking, setIsShaking] = useState(false);
  const [playerFlash, setPlayerFlash] = useState(false);
  const [enemyFlash, setEnemyFlash] = useState(false);

  // Ref tracks already processed damage numbers to prevent duplicate animations
  const processedIds = useRef<Set<string>>(new Set());

  // VFX Logic: Monitors the store for new damage popups and triggers animations
  useEffect(() => {
    const popUps = combatStats.damagePopUps || [];
    if (popUps.length === 0) return;

    let triggeredShake = false;
    let triggeredPlayerFlash = false;
    let triggeredEnemyFlash = false;

    popUps.forEach((p) => {
      if (!processedIds.current.has(p.id)) {
        processedIds.current.add(p.id);

        if (p.type === "player") {
          triggeredPlayerFlash = true;
          triggeredShake = true; // Shake the screen when player takes damage
        } else if (p.type === "enemy") {
          triggeredEnemyFlash = true;
        }
      }
    });

    // requestAnimationFrame used to avoid ESLint "cascading renders" warnings
    requestAnimationFrame(() => {
      if (triggeredShake) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 150);
      }
      if (triggeredPlayerFlash) {
        setPlayerFlash(true);
        setTimeout(() => setPlayerFlash(false), 200);
      }
      if (triggeredEnemyFlash) {
        setEnemyFlash(true);
        setTimeout(() => setEnemyFlash(false), 150);
      }
    });

    // Keep the set clean to prevent memory leaks over long sessions
    if (processedIds.current.size > 50) {
      processedIds.current.clear();
    }
  }, [combatStats.damagePopUps]);

  const bgImage = WORLD_INFO[selectedWorldId]?.image || "";

  // Calculate live player stats based on current equipment
  const playerCombatStats = useMemo(() => {
    const gearTotals = Object.values(equipment).reduce(
      (acc, itemId) => {
        if (!itemId) return acc;
        const item = getItemDetails(itemId) as Resource;
        if (item?.stats) {
          acc.hpBonus += item.stats.hpBonus || 0;
        }
        return acc;
      },
      { hpBonus: 0 },
    );

    const weaponItem = equipment.weapon
      ? (getItemDetails(equipment.weapon) as Resource)
      : null;
    const style: CombatStyle = weaponItem?.combatStyle || "melee";

    return getPlayerStats(skills, style, { hpBonus: gearTotals.hpBonus });
  }, [equipment, skills]);

  const playerMaxHp = playerCombatStats.maxHp;
  const currentHp = Math.min(combatStats.hp, playerMaxHp);
  const playerHpPercent = Math.max(0, (currentHp / playerMaxHp) * 100);

  const enemyMaxHp = enemy?.maxHp || 100;
  const enemyHpPercent = Math.max(
    0,
    (combatStats.enemyCurrentHp / enemyMaxHp) * 100,
  );

  // Helper to render floating damage numbers above the target
  const renderPopUps = (targetType: "player" | "enemy") => {
    // Safety check: Don't render popups if player is dead
    if (combatStats.hp <= 0) return null;

    return (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none z-[60] mb-2 flex items-end justify-center">
        {(combatStats.damagePopUps || [])
          .filter((p) => p.type === targetType)
          .map((p, index) => {
            // Stable offset based on index prevents overlapping numbers
            const offsetPx = -15 + ((index * 15) % 30);

            return (
              <div
                key={p.id}
                className={`absolute bottom-0 font-black animate-damage-pop whitespace-nowrap
                  ${
                    p.amount.toString().startsWith("+")
                      ? "text-emerald-400 text-xl"
                      : p.isCrit
                        ? "text-amber-400 text-4xl"
                        : targetType === "player"
                          ? "text-red-500 text-3xl"
                          : "text-white text-3xl"
                  }
                `}
                style={{
                  left: "50%",
                  marginLeft: `${offsetPx}px`,
                  textShadow:
                    "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 4px 6px rgba(0,0,0,0.5)",
                }}
              >
                {p.amount}
                {p.isCrit && (
                  <span className="block text-[12px] uppercase -mt-2 text-center text-amber-200">
                    CRIT!
                  </span>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div
      className={`h-full w-full relative bg-app-base select-none overflow-hidden ${isShaking ? "animate-shake" : ""}`}
    >
      {
        // Background Map Image
      }
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-30 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-app-base via-transparent to-app-base/40"></div>
      </div>

      <div className="relative h-full w-full flex justify-between items-end pb-12 px-16 max-w-6xl mx-auto">
        {
          // Player Area (Left Side)
        }
        <div className="flex flex-col items-center gap-3 relative group w-32">
          {renderPopUps("player")}

          <div className="w-32 h-2.5 bg-panel/80 rounded border border-border overflow-hidden mb-1 relative">
            <div
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${playerHpPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-black text-tx-muted mb-2 font-mono">
            {Math.ceil(currentHp)} / {playerMaxHp}
          </div>

          <div className="w-24 h-24 relative flex items-center justify-center">
            <img
              src={avatar || "/assets/ui/icon_user_avatar.png"}
              alt="Player"
              className={`w-20 h-20 object-contain pixelated transform scale-x-[-1] transition-transform ${playerFlash ? "animate-flash-red" : ""}`}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://ui-avatars.com/api/?name=P&background=0f172a")
              }
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-md rounded-full"></div>
          </div>

          <button
            onClick={stopCombat}
            className="mt-2 text-[10px] uppercase font-black tracking-widest text-danger hover:text-white bg-danger/10 hover:bg-danger px-4 py-1.5 rounded border border-danger/20 transition-all active:scale-95"
          >
            Retretreat
          </button>
        </div>

        {
          // Center Information (Respawn Timer)
        }
        <div className="mb-20 flex flex-col items-center gap-2">
          {combatStats.respawnTimer > 0 && (
            <div className="px-5 py-2 bg-panel/90 rounded border border-warning/30 text-warning text-xs font-mono font-black animate-pulse shadow-2xl backdrop-blur-sm">
              RESPAWN {(combatStats.respawnTimer / 1000).toFixed(1)}s
            </div>
          )}
        </div>

        {
          // Enemy Area (Right Side)
        }
        <div className="flex flex-col items-center justify-end gap-3 relative w-32 min-h-[180px]">
          {renderPopUps("enemy")}

          {enemy ? (
            <div className="flex flex-col items-center animate-in fade-in duration-500 w-full">
              <div className="w-32 h-2.5 bg-panel/80 rounded border border-border overflow-hidden mb-1 relative">
                <div
                  className="h-full bg-danger transition-all duration-150"
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
              <div className="text-[10px] font-black text-tx-muted mb-2 font-mono">
                {Math.ceil(combatStats.enemyCurrentHp)} / {enemyMaxHp}
              </div>

              <div className="w-24 h-24 relative flex items-center justify-center">
                <div className={enemyFlash ? "animate-flash-white" : ""}>
                  {enemy.icon ? (
                    <img
                      src={enemy.icon}
                      className="w-20 h-20 object-contain pixelated"
                      alt={enemy.name}
                    />
                  ) : (
                    <span className="text-6xl">👾</span>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-md rounded-full"></div>
              </div>

              <div className="bg-panel/60 px-3 py-1.5 rounded border border-border text-[10px] font-black uppercase tracking-widest text-tx-main mt-2 backdrop-blur-md">
                {enemy.name}{" "}
                <span className="text-tx-muted ml-1 font-mono">
                  Lvl {enemy.level}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center pb-8 opacity-20 text-tx-muted text-xs font-mono gap-3">
              {!combatStats.respawnTimer && (
                <>
                  <img
                    src="/assets/ui/icon_battle.png"
                    className="w-10 h-10 pixelated grayscale"
                    alt=""
                  />
                  <span className="tracking-[0.3em] font-black uppercase text-[10px]">
                    No Target
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
