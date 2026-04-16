import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { TOWER_FLOORS } from "../../data/tower";
import { getItemById } from "../../utils/itemUtils";
import { Swords, FastForward, Lock, CheckCircle } from "lucide-react";
import TowerCombatView from "./TowerCombatView";

const SWEEP_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export default function TowerView() {
  // 1. TÄYSIN TURVALLISET TILAN HAUT
  // Otetaan koko 'tower' tila ulos storesta.
  // Jos sitä ei syystä tai toisesta ole vielä olemassa (välimuistiongelma tms.),
  // defaultataan se tyhjään objektiin, jotta mikään property-luku ei kaadu.
  const tower = useGameStore((state) => state.tower) || {};

  // Puretaan arvot turvallisesti (optional chaining ja nullish coalescing)
  const isCombatActive = tower?.combat?.isActive ?? false;
  const highestFloor = tower?.highestFloorCompleted ?? 0;
  const lastSweep = tower?.lastSweepTime ?? 0;

  const emitEvent = useGameStore((state) => state.emitEvent);
  const startTowerCombat = useGameStore((state) => state.startTowerCombat);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Määritetään kerrokset
  const currentFloorNumber = highestFloor + 1;
  const currentFloorData = TOWER_FLOORS.find(
    (f) => f.floorNumber === currentFloorNumber,
  );
  const hasCompletedAll = !currentFloorData;

  // Laske Sweep Cooldown
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const timeSinceLastSweep = now - lastSweep;
      const remaining = Math.max(0, SWEEP_COOLDOWN_MS - timeSinceLastSweep);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastSweep]);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const handleChallenge = () => {
    if (!currentFloorData) return;
    startTowerCombat(currentFloorData.floorNumber);
  };

  const handleSweep = () => {
    if (timeLeft > 0) {
      emitEvent("warning", "Sweep is on cooldown.");
      return;
    }
    if (highestFloor === 0) {
      emitEvent("warning", "You must complete at least one floor to sweep.");
      return;
    }

    emitEvent("success", "Tower swept successfully!");
    useGameStore.getState().setState((state) => ({
      tower: { ...state.tower, lastSweepTime: Date.now() },
    }));
  };

  // 2. RENDERÖINTI
  // Jos taistelu on aktiivinen, palautetaan uusi taistelunäkymä
  if (isCombatActive) {
    return <TowerCombatView />;
  }

  // Muussa tapauksessa renderöidään tuttu aula
  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* --- HEADER --- */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] text-tx-main drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          The Endless Tower
        </h1>
        <p className="text-[10px] md:text-xs text-tx-muted font-mono tracking-widest mt-2 uppercase">
          Highest Floor Cleared:{" "}
          <span className="text-accent">{highestFloor}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full">
        {/* --- LEFT PANEL: CURRENT FLOOR CHALLENGE --- */}
        <div className="flex-[2] bg-panel/30 border border-border rounded-xl p-6 flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-danger to-transparent opacity-50"></div>

          <h2 className="text-xs font-black text-tx-muted uppercase tracking-[0.2em] mb-6 border-b border-border/50 pb-2">
            Current Target
          </h2>

          {hasCompletedAll ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-10">
              <CheckCircle size={48} className="text-success opacity-50" />
              <p className="text-sm font-black uppercase tracking-widest text-success">
                Tower Conquered
              </p>
              <p className="text-[10px] text-tx-muted uppercase tracking-widest">
                More floors coming soon.
              </p>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-app-base border border-border rounded-lg flex items-center justify-center p-2 shadow-inner shrink-0">
                  <img
                    src={currentFloorData.enemy.icon}
                    alt={currentFloorData.enemy.name}
                    className="w-full h-full object-contain pixelated"
                    onError={(e) =>
                      (e.currentTarget.src = "./assets/ui/icon_boss.png")
                    }
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-danger uppercase tracking-[0.3em] mb-1">
                    Floor {currentFloorData.floorNumber}
                  </p>
                  <h3 className="text-lg md:text-xl font-black text-tx-main uppercase tracking-widest">
                    {currentFloorData.enemy.name}
                  </h3>
                  <div className="flex gap-4 mt-3 text-[10px] font-mono text-tx-muted uppercase">
                    <span>
                      HP:{" "}
                      <span className="text-success">
                        {currentFloorData.enemy.maxHp}
                      </span>
                    </span>
                    <span>
                      ATK:{" "}
                      <span className="text-danger">
                        {currentFloorData.enemy.attack}
                      </span>
                    </span>
                    <span>
                      DEF:{" "}
                      <span className="text-warning">
                        {currentFloorData.enemy.defense}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-3">
                  First Clear Rewards
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentFloorData.firstClearRewards.map((reward, i) => {
                    const item = getItemById(reward.itemId);
                    if (!item) return null;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-app-base border border-border p-2 rounded-lg"
                      >
                        <img
                          src={item.icon}
                          className="w-6 h-6 pixelated"
                          alt=""
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-[9px] font-black uppercase tracking-widest truncate max-w-[80px]"
                            style={{ color: item.color || "white" }}
                          >
                            {item.name}
                          </span>
                          <span className="text-[9px] font-mono text-tx-muted">
                            x{reward.amount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={handleChallenge}
                  className="w-full py-4 bg-danger hover:bg-danger/80 border border-danger text-white rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                >
                  <Swords size={18} />
                  Challenge Floor {currentFloorData.floorNumber}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT PANEL: SWEEP & INFO --- */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-panel/30 border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

            <h2 className="text-xs font-black text-tx-muted uppercase tracking-[0.2em] mb-4 border-b border-border/50 pb-2">
              Daily Sweep
            </h2>

            <p className="text-[10px] text-tx-muted uppercase tracking-widest leading-relaxed mb-6">
              Instantly claim sweep rewards from all previously conquered
              floors. Available once every 24 hours.
            </p>

            <button
              onClick={handleSweep}
              disabled={timeLeft > 0 || highestFloor === 0}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border shadow-sm
                ${
                  timeLeft > 0 || highestFloor === 0
                    ? "bg-panel border-border text-tx-muted/50 cursor-not-allowed"
                    : "bg-accent hover:bg-accent-hover border-accent text-white shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"
                }
              `}
            >
              {highestFloor === 0 ? (
                <>
                  <Lock size={16} /> Locked
                </>
              ) : timeLeft > 0 ? (
                <>{formatTime(timeLeft)}</>
              ) : (
                <>
                  <FastForward size={16} /> Sweep Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
