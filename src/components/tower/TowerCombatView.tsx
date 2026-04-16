import { useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { TOWER_FLOORS } from "../../data/tower";
import { ShieldAlert, Trophy, Skull, LogOut, ArrowRight } from "lucide-react";

export default function TowerCombatView() {
  const combatState = useGameStore((state) => state.tower.combat);
  const processTowerTick = useGameStore((state) => state.processTowerTick);
  const leaveTowerCombat = useGameStore((state) => state.leaveTowerCombat);
  const claimTowerVictory = useGameStore((state) => state.claimTowerVictory);

  const playerAvatar = useGameStore((state) => state.avatar);
  const playerUsername = useGameStore((state) => state.username);

  // Pelaajan maksimi HP (visuaalista palkkia varten)
  const hitpointsLevel = useGameStore(
    (state) => state.skills.hitpoints?.level || 1,
  );
  const playerMaxHp = 100 + hitpointsLevel * 10; // Yksinkertaistettu maksimi HP

  // Automaattinen scrollaus logille
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combatState.combatLog]);

  // Taistelun "Sydänlyönti" (Tick)
  useEffect(() => {
    if (!combatState.isActive || combatState.status !== "fighting") return;

    const interval = setInterval(() => {
      processTowerTick();
    }, 100); // 100ms välein kuten normaalissakin taistelussa

    return () => clearInterval(interval);
  }, [combatState.isActive, combatState.status, processTowerTick]);

  // Jos pelaaja eksyy tänne vahingossa, palautetaan hänet takaisin
  if (!combatState.isActive || !combatState.floorNumber) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <ShieldAlert size={48} className="text-warning mb-4" />
          <p className="text-tx-muted uppercase tracking-widest font-black">
            Combat not initialized.
          </p>
          <button
            onClick={leaveTowerCombat}
            className="mt-4 px-6 py-2 bg-panel border border-border rounded uppercase text-[10px] font-bold"
          >
            Return
          </button>
        </div>
      </div>
    );
  }

  const floorData = TOWER_FLOORS.find(
    (f) => f.floorNumber === combatState.floorNumber,
  );
  if (!floorData) return null;

  // Laske HP prosentit
  const playerHpPct = Math.max(
    0,
    Math.min(100, (combatState.playerHp / playerMaxHp) * 100),
  );
  const enemyHpPct = Math.max(
    0,
    Math.min(100, (combatState.enemyCurrentHp / floorData.enemy.maxHp) * 100),
  );

  return (
    <div className="h-full flex flex-col bg-app-base relative animate-in fade-in zoom-in-95 duration-300">
      {/* --- HEADER --- */}
      <div className="shrink-0 p-4 border-b border-border/50 bg-panel/50 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-danger/20 border border-danger/50 rounded flex items-center justify-center text-danger font-black">
            {combatState.floorNumber}
          </div>
          <h2 className="text-sm font-black text-tx-main uppercase tracking-widest">
            Tower Combat
          </h2>
        </div>

        {combatState.status === "fighting" && (
          <button
            onClick={leaveTowerCombat}
            className="flex items-center gap-2 text-[10px] font-bold uppercase text-tx-muted hover:text-danger transition-colors px-3 py-1.5 border border-transparent hover:border-danger/30 rounded"
          >
            <LogOut size={14} /> Retreat
          </button>
        )}
      </div>

      {/* --- ARENA (VS SCREEN) --- */}
      <div className="flex-1 flex flex-col justify-center p-4 md:p-10 relative overflow-hidden">
        {/* Taustagrafiikka / Vinoviiva erottamaan puolet */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="w-[150%] h-32 bg-tx-main -rotate-12 transform origin-center"></div>
        </div>

        <div className="flex justify-between items-center max-w-4xl mx-auto w-full relative z-10 gap-4">
          {/* PLAYER SIDE */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-panel border-2 border-accent rounded-xl shadow-[0_0_20px_rgba(var(--color-accent),0.2)] mb-4 flex items-center justify-center">
              <img
                src={playerAvatar || "./assets/ui/icon_user_avatar.png"}
                alt="Player"
                className="w-3/4 h-3/4 object-contain pixelated"
              />
              {/* Player Damage Popups */}
              {combatState.damagePopUps
                .filter((p) => p.type === "player")
                .map((p) => (
                  <span
                    key={p.id}
                    className="absolute font-black text-danger text-lg md:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 fade-out duration-500 pointer-events-none"
                    style={{
                      left: `${40 + Math.random() * 20}%`,
                      top: `${-10 - Math.random() * 20}%`,
                    }}
                  >
                    -{p.amount}
                  </span>
                ))}
            </div>
            <h3 className="font-black text-tx-main uppercase tracking-widest mb-1">
              {playerUsername}
            </h3>

            {/* Player HP Bar */}
            <div className="w-full max-w-[200px]">
              <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
                <span className="text-success">HP</span>
                <span className="text-tx-main">
                  {Math.floor(combatState.playerHp)} / {playerMaxHp}
                </span>
              </div>
              <div className="w-full h-2 bg-panel border border-border/50 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-100 ease-linear"
                  style={{ width: `${playerHpPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* VS BADGE */}
          <div className="shrink-0 flex flex-col items-center justify-center px-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-app-base border-2 border-danger/50 rounded-full flex items-center justify-center text-danger font-black italic text-xl md:text-2xl shadow-[0_0_15px_rgba(220,38,38,0.3)] z-10">
              VS
            </div>
          </div>

          {/* ENEMY SIDE */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-panel border-2 border-danger rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] mb-4 flex items-center justify-center">
              <img
                src={floorData.enemy.icon}
                alt={floorData.enemy.name}
                className={`w-3/4 h-3/4 object-contain pixelated ${combatState.status === "victory" ? "grayscale opacity-50" : "animate-pulse"}`}
                onError={(e) =>
                  (e.currentTarget.src = "./assets/ui/icon_boss.png")
                }
              />
              {/* Enemy Damage Popups */}
              {combatState.damagePopUps
                .filter((p) => p.type === "enemy")
                .map((p) => (
                  <span
                    key={p.id}
                    className={`absolute font-black text-lg md:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 fade-out duration-500 pointer-events-none ${p.isCrit ? "text-warning text-2xl scale-125" : "text-white"}`}
                    style={{
                      left: `${40 + Math.random() * 20}%`,
                      top: `${-10 - Math.random() * 20}%`,
                    }}
                  >
                    {p.isCrit ? "CRIT " : ""}-{p.amount}
                  </span>
                ))}
            </div>
            <h3 className="font-black text-tx-main uppercase tracking-widest mb-1 text-center">
              {floorData.enemy.name}
            </h3>

            {/* Enemy HP Bar */}
            <div className="w-full max-w-[200px]">
              <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
                <span className="text-danger">HP</span>
                <span className="text-tx-main">
                  {Math.floor(combatState.enemyCurrentHp)} /{" "}
                  {floorData.enemy.maxHp}
                </span>
              </div>
              <div className="w-full h-2 bg-panel border border-border/50 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-danger transition-all duration-100 ease-linear"
                  style={{ width: `${enemyHpPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- COMBAT LOG --- */}
      <div className="shrink-0 h-32 md:h-40 bg-panel/80 border-t border-border/50 p-2 md:p-4 overflow-y-auto custom-scrollbar font-mono text-[9px] md:text-[10px] flex flex-col-reverse shadow-inner relative z-10">
        <div ref={logEndRef} />
        {combatState.combatLog.map((log, i) => (
          <div
            key={i}
            className={`py-1 border-b border-border/20 ${i === 0 ? "text-tx-main font-bold" : "text-tx-muted"}`}
          >
            <span className="opacity-50 mr-2">
              [{new Date().toLocaleTimeString()}]
            </span>
            <span
              className={`${log.includes("Victory") ? "text-success" : log.includes("Defeated") ? "text-danger" : log.includes("CRIT") ? "text-warning" : ""}`}
            >
              {log}
            </span>
          </div>
        ))}
      </div>

      {/* --- OVERLAYS FOR END CONDITIONS --- */}
      {combatState.status === "victory" && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-panel border border-success/50 p-8 rounded-2xl flex flex-col items-center text-center max-w-md w-full shadow-[0_0_50px_rgba(34,197,94,0.2)] transform animate-in zoom-in-90">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
              <Trophy size={40} className="text-success" />
            </div>
            <h2 className="text-2xl font-black text-success uppercase tracking-widest mb-2">
              Floor Cleared!
            </h2>
            <p className="text-tx-muted text-xs uppercase tracking-widest mb-8">
              You have conquered the {floorData.enemy.name}.
            </p>
            <button
              onClick={claimTowerVictory}
              className="w-full py-4 bg-success hover:bg-success/80 text-white rounded-xl font-black uppercase tracking-[0.2em] flex justify-center items-center gap-3 transition-colors shadow-lg"
            >
              Claim Rewards <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {combatState.status === "defeat" && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-panel border border-danger/50 p-8 rounded-2xl flex flex-col items-center text-center max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.2)] transform animate-in zoom-in-90">
            <div className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Skull size={40} className="text-danger" />
            </div>
            <h2 className="text-2xl font-black text-danger uppercase tracking-widest mb-2">
              Defeated
            </h2>
            <p className="text-tx-muted text-xs uppercase tracking-widest mb-8">
              You were struck down by the {floorData.enemy.name}.
            </p>
            <button
              onClick={leaveTowerCombat}
              className="w-full py-4 border border-border hover:bg-panel-hover text-tx-main rounded-xl font-black uppercase tracking-[0.2em] flex justify-center items-center gap-3 transition-colors"
            >
              <LogOut size={18} /> Retreat & Recover
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
