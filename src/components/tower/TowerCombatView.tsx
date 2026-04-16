import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { TOWER_FLOORS } from "../../data/tower";
import { getItemById } from "../../utils/itemUtils";
import { Trophy, Skull, LogOut, ArrowRight, ShieldAlert } from "lucide-react";

export default function TowerCombatView() {
  const tower = useGameStore((state) => state.tower) || {};
  const combatState = tower.combat;

  const processTowerTick = useGameStore((state) => state.processTowerTick);
  const leaveTowerCombat = useGameStore((state) => state.leaveTowerCombat);
  const claimTowerVictory = useGameStore((state) => state.claimTowerVictory);

  const avatar = useGameStore((state) => state.avatar);
  const hitpointsLevel = useGameStore(
    (state) => state.skills.hitpoints?.level || 1,
  );
  // Oletusarvona 100, jotta ei voi olla 0
  const playerMaxHp = 100 + hitpointsLevel * 10;

  // --- VFX STATES (Kopioitu BattleArenasta) ---
  const [isShaking, setIsShaking] = useState(false);
  const [playerFlash, setPlayerFlash] = useState(false);
  const [enemyFlash, setEnemyFlash] = useState(false);
  const processedIds = useRef<Set<string>>(new Set());
  const logEndRef = useRef<HTMLDivElement>(null);

  // Automaattinen scrollaus logille
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combatState?.combatLog]);

  // Taistelun Moottori (100ms Tick)
  useEffect(() => {
    // Varmistetaan, että taistelu on olemassa, käynnissä, JA että hp > 0 ennen tikitystä
    if (
      !combatState?.isActive ||
      combatState.status !== "fighting" ||
      combatState.playerHp <= 0
    )
      return;

    const interval = setInterval(() => {
      processTowerTick();
    }, 100);
    return () => clearInterval(interval);
  }, [
    combatState?.isActive,
    combatState?.status,
    combatState?.playerHp,
    processTowerTick,
  ]);

  // VFX Logic: Kuuntelee uusia popuppeja ja laukaisee animaatiot
  useEffect(() => {
    const popUps = combatState?.damagePopUps || [];
    if (popUps.length === 0) return;

    let triggeredShake = false;
    let triggeredPlayerFlash = false;
    let triggeredEnemyFlash = false;

    popUps.forEach((p) => {
      if (!processedIds.current.has(p.id)) {
        processedIds.current.add(p.id);
        if (p.type === "player") {
          triggeredPlayerFlash = true;
          triggeredShake = true;
        } else if (p.type === "enemy") {
          triggeredEnemyFlash = true;
        }
      }
    });

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

    if (processedIds.current.size > 50) processedIds.current.clear();
  }, [combatState?.damagePopUps]);

  // Turvatarkistus
  if (!combatState || !combatState.isActive || !combatState.floorNumber) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-app-base p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <ShieldAlert size={48} className="text-warning mb-4" />
          <p className="text-tx-muted uppercase tracking-widest font-black">
            Combat sequence aborted.
          </p>
          <button
            onClick={leaveTowerCombat}
            className="mt-4 px-6 py-2 bg-panel border border-border rounded uppercase text-[10px] font-bold"
          >
            Return to Tower
          </button>
        </div>
      </div>
    );
  }

  const floorData = TOWER_FLOORS.find(
    (f) => f.floorNumber === combatState.floorNumber,
  );
  if (!floorData) return null;

  const currentHp = Math.max(0, Math.min(combatState.playerHp, playerMaxHp));
  const playerHpPercent = Math.max(0, (currentHp / playerMaxHp) * 100);
  const enemyCurrentHp = Math.max(0, combatState.enemyCurrentHp);
  const enemyHpPercent = Math.max(
    0,
    (enemyCurrentHp / floorData.enemy.maxHp) * 100,
  );

  // Ajastin (combatTimer on millisekunteina)
  // Defaultataan 60 000 (60s), jos undefined
  const timerMs = combatState.combatTimer ?? 60000;

  // Apufunktio popupien renderöintiin (1:1 BattleArenan kanssa)
  const renderPopUps = (targetType: "player" | "enemy") => {
    if (combatState.playerHp <= 0 && targetType === "player") return null;
    return (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none z-[60] mb-2 flex items-end justify-center">
        {(combatState.damagePopUps || [])
          .filter((p) => p.type === targetType)
          .map((p, index) => {
            const offsetPx = -15 + ((index * 15) % 30);
            return (
              <div
                key={p.id}
                className={`absolute bottom-0 font-black animate-damage-pop whitespace-nowrap
                  ${p.amount.toString().startsWith("+") ? "text-emerald-400 text-xl" : p.isCrit ? "text-amber-400 text-4xl" : targetType === "player" ? "text-red-500 text-3xl" : "text-white text-3xl"}
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
    <div className="h-full w-full flex flex-col lg:flex-row bg-app-base overflow-hidden text-tx-main font-sans">
      {/* CENTER COLUMN: BATTLE ARENA & LOGS */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative border-y lg:border-y-0 border-border/50">
        {/* VICTORY OVERLAY */}
        {combatState.status === "victory" && (
          <div className="absolute inset-0 z-[70] bg-app-base/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full border-4 border-success/20 border-t-success shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center justify-center">
              <Trophy size={32} className="text-success" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] mb-2 text-success">
              Floor Cleared
            </h2>
            <p className="text-tx-muted text-xs md:text-sm max-w-xs font-medium italic mb-6">
              The {floorData.enemy.name} has been vanquished.
            </p>
            <button
              onClick={claimTowerVictory}
              className="px-8 py-4 bg-success hover:bg-success/80 text-white rounded-xl font-black uppercase tracking-[0.2em] flex justify-center items-center gap-3 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105"
            >
              Claim Rewards <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* DEFEAT OVERLAY */}
        {combatState.status === "defeat" && (
          <div className="absolute inset-0 z-[70] bg-app-base/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full border-4 border-danger/20 border-t-danger shadow-[0_0_30px_rgba(220,38,38,0.3)] flex items-center justify-center">
              <Skull size={32} className="text-danger" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] mb-2 text-danger">
              Defeated
            </h2>
            <p className="text-tx-muted text-xs md:text-sm max-w-xs font-medium italic mb-6">
              {combatState.combatLog[0]?.includes("Time's up")
                ? "Time ran out before you could defeat the enemy."
                : `You were struck down by the ${floorData.enemy.name}.`}
            </p>
            <button
              onClick={leaveTowerCombat}
              className="px-8 py-4 border border-border hover:bg-panel text-tx-main rounded-xl font-black uppercase tracking-[0.2em] flex justify-center items-center gap-3 transition-colors"
            >
              <LogOut size={18} /> Return to Tower
            </button>
          </div>
        )}

        {/* TOP SECTION: BATTLE ARENA */}
        <div
          className={`min-h-[35vh] lg:min-h-0 lg:h-[55%] shrink-0 relative bg-panel overflow-hidden border-b border-border shadow-inner ${isShaking ? "animate-shake" : ""}`}
        >
          <div className="absolute inset-0 bg-[url('./assets/backgrounds/bg_abyss.jpg')] bg-cover bg-center transition-all duration-1000 opacity-20 scale-105">
            <div className="absolute inset-0 bg-gradient-to-t from-app-base via-transparent to-app-base/40"></div>
          </div>

          {/* TIMER */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <div
              className={`
              px-6 py-2 rounded-full border-2 font-mono font-black text-2xl shadow-lg transition-all
              ${
                timerMs <= 10000
                  ? "bg-danger/20 border-danger text-danger animate-pulse scale-110"
                  : "bg-panel/80 border-border text-tx-main"
              }
            `}
            >
              {Math.max(0, timerMs / 1000).toFixed(1)}s
            </div>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-tx-muted mt-2 drop-shadow-md">
              Time Remaining
            </p>
          </div>

          <div className="relative h-full w-full flex justify-between items-end pb-12 px-10 md:px-24 max-w-5xl mx-auto">
            {/* PLAYER AREA */}
            <div className="flex flex-col items-center gap-3 relative w-32 z-10">
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
                  src={avatar || "./assets/ui/icon_user_avatar.png"}
                  alt="Player"
                  className={`w-20 h-20 object-contain pixelated transform scale-x-[-1] transition-transform ${playerFlash ? "animate-flash-red" : ""}`}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-md rounded-full"></div>
              </div>
              <button
                onClick={leaveTowerCombat}
                disabled={combatState.status !== "fighting"}
                className={`mt-2 text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded border transition-all
                  ${combatState.status !== "fighting" ? "opacity-0 cursor-default" : "text-danger hover:text-white bg-danger/10 hover:bg-danger border-danger/20 active:scale-95"}`}
              >
                Retreat
              </button>
            </div>

            {/* ENEMY AREA */}
            <div className="flex flex-col items-center justify-end gap-3 relative w-32 z-10 min-h-[180px]">
              {renderPopUps("enemy")}
              <div className="flex flex-col items-center w-full">
                <div className="w-32 h-2.5 bg-panel/80 rounded border border-border overflow-hidden mb-1 relative">
                  <div
                    className="h-full bg-danger transition-all duration-150"
                    style={{ width: `${enemyHpPercent}%` }}
                  />
                </div>
                <div className="text-[10px] font-black text-tx-muted mb-2 font-mono">
                  {Math.ceil(enemyCurrentHp)} / {floorData.enemy.maxHp}
                </div>
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <div className={enemyFlash ? "animate-flash-white" : ""}>
                    <img
                      src={floorData.enemy.icon}
                      className={`w-20 h-20 object-contain pixelated ${combatState.status === "victory" ? "grayscale opacity-50" : ""}`}
                      alt={floorData.enemy.name}
                      onError={(e) =>
                        (e.currentTarget.src = "./assets/ui/icon_boss.png")
                      }
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-md rounded-full"></div>
                </div>
                <div className="bg-panel/60 px-3 py-1.5 rounded border border-border text-[10px] font-black uppercase tracking-widest text-tx-main mt-2 backdrop-blur-md text-center leading-tight">
                  {floorData.enemy.name} <br />
                  <span className="text-danger ml-1 font-mono">
                    Lvl {floorData.enemy.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COMBAT LOG */}
        <div className="flex-1 bg-app-base flex flex-col min-h-[30vh] lg:min-h-0 z-20">
          <div className="p-3 bg-panel/80 border-b border-border shadow-sm flex items-center justify-between shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted">
              Combat Log
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-[#0a0a0c] font-mono text-[10px] md:text-xs leading-relaxed flex flex-col-reverse relative">
            <div ref={logEndRef} />
            {combatState.combatLog.map((log, index) => (
              <div
                key={index}
                className="py-1.5 border-b border-white/5 opacity-90 hover:opacity-100 transition-opacity"
              >
                <span className="text-tx-muted/50 mr-3 select-none">
                  [{new Date().toLocaleTimeString([], { hour12: false })}]
                </span>
                <span
                  className={`
                      ${log.includes("Victory") ? "text-success font-bold" : ""}
                      ${log.includes("Defeated") || log.includes("Time's up") ? "text-danger font-bold" : ""}
                      ${log.includes("You hit") ? "text-amber-200" : ""}
                      ${log.includes("Enemy hit") ? "text-red-400" : ""}
                      ${log.includes("Engaged") ? "text-accent font-bold" : ""}
                   `}
                >
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: TOWER INTEL */}
      <div className="w-full lg:w-80 flex-shrink-0 lg:border-l border-border bg-panel/80 backdrop-blur-sm z-20 flex flex-col h-auto lg:h-full">
        <div className="p-4 border-b border-border bg-panel/90 shadow-sm shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-danger block mb-1">
            Endless Tower
          </span>
          <span className="text-sm font-bold text-tx-main">
            Floor {floorData.floorNumber}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted mb-3 border-b border-border pb-1">
              Target Intel
            </h3>
            <div className="bg-app-base border border-border p-3 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-tx-muted">Target:</span>
                <span className="text-tx-main font-bold">
                  {floorData.enemy.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-tx-muted">Health:</span>
                <span className="text-success">{floorData.enemy.maxHp}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-tx-muted">Attack:</span>
                <span className="text-danger">{floorData.enemy.attack}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-tx-muted">Defense:</span>
                <span className="text-warning">{floorData.enemy.defense}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted mb-3 border-b border-border pb-1">
              Bounty
            </h3>
            <div className="flex flex-col gap-2">
              {floorData.firstClearRewards.map((reward, i) => {
                const item = getItemById(reward.itemId);
                if (!item) return null;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-app-base border border-border p-2 rounded-lg hover:bg-panel-hover transition-colors"
                  >
                    <div className="w-8 h-8 bg-panel border border-border rounded flex items-center justify-center shrink-0">
                      <img
                        src={item.icon}
                        className="w-5 h-5 pixelated"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest truncate"
                        style={{ color: item.color || "white" }}
                      >
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-tx-muted">
                        QTY: {reward.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
