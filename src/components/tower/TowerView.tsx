import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { TOWER_DATA, type TowerTier } from "../../data/tower";
import { getItemById } from "../../utils/itemUtils";
import TowerCombatView from "./TowerCombatView";
import type { Resource } from "../../types";
import type { FullStoreState } from "../../store/useGameStore";

export default function TowerView() {
  const tower = useGameStore((state: FullStoreState) => state.tower) || {};
  const lastWorldShopReset = useGameStore(
    (state: FullStoreState) => state.worldShop?.lastResetTime || 0,
  );

  const emitEvent = useGameStore((state: FullStoreState) => state.emitEvent);
  const startTowerCombat = useGameStore(
    (state: FullStoreState) => state.startTowerCombat,
  );
  const setTowerTier = useGameStore(
    (state: FullStoreState) => state.setTowerTier,
  );

  // --- PROGRESSION & TIER DATA ---
  const activeTier = tower.activeTier || "easy";

  // Varmistetaan yhteensopivuus vanhojen tallennusten kanssa
  const highestFloors =
    typeof tower.highestFloorCompleted === "object"
      ? tower.highestFloorCompleted
      : { easy: tower.highestFloorCompleted || 0, medium: 0, hard: 0 };

  const highestFloor = highestFloors[activeTier] || 0;
  const isCombatActive = tower?.combat?.isActive ?? false;
  const lastSweep = tower?.lastSweepTime ?? 0;

  const currentTowerFloors = TOWER_DATA[activeTier];
  const maxFloor =
    currentTowerFloors.length > 0
      ? currentTowerFloors[currentTowerFloors.length - 1].floorNumber
      : 50;

  const currentTargetFloor = highestFloor + 1;
  const hasCompletedAll = highestFloor >= maxFloor;
  const currentFloorData = currentTowerFloors.find(
    (f) => f.floorNumber === currentTargetFloor,
  );

  const reversedFloors = [...currentTowerFloors].reverse();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const activeFloorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeFloorRef.current) {
      activeFloorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTargetFloor, activeTier]);

  // --- RESET LOGIIKKA ---
  const getLastMidnightUTC = () => {
    const now = new Date();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
    );
  };

  const getNextMidnightUTC = () => {
    const now = new Date();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    );
  };

  const actualLastReset =
    lastWorldShopReset > 0 ? lastWorldShopReset : getLastMidnightUTC();
  const hasSweptToday = lastSweep >= actualLastReset;

  // Tarkistetaan onko pelaajalla ylipäätään mitään sweepattavaa (vähintään easy kerros 1 voitettu)
  const canSweepAnything =
    highestFloors.easy > 0 ||
    highestFloors.medium > 0 ||
    highestFloors.hard > 0;

  useEffect(() => {
    const updateTimer = () => {
      if (hasSweptToday) {
        const now = Date.now();
        const nextReset = getNextMidnightUTC();
        setTimeLeft(Math.max(0, nextReset - now));
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [hasSweptToday]);

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
    if (hasSweptToday) {
      emitEvent(
        "warning",
        "You have already swept the tower today. Resets at 00:00 UTC.",
      );
      return;
    }
    if (!canSweepAnything) {
      emitEvent("warning", "You must complete at least one floor to sweep.");
      return;
    }

    // Kerätään KAIKKI Sweep-palkinnot KAIKILTA vaikeustasoilta yhteen!
    const aggregatedRewards: { [itemId: string]: number } = {};

    (["easy", "medium", "hard"] as TowerTier[]).forEach((tier) => {
      const tierHighest = highestFloors[tier] || 0;
      const tierFloors = TOWER_DATA[tier];

      for (let i = 1; i <= tierHighest; i++) {
        const floorData = tierFloors.find((f) => f.floorNumber === i);
        if (floorData) {
          floorData.sweepRewards.forEach((reward) => {
            aggregatedRewards[reward.itemId] =
              (aggregatedRewards[reward.itemId] || 0) + reward.amount;
          });
        }
      }
    });

    const rewardArray = Object.entries(aggregatedRewards).map(
      ([itemId, amount]) => ({ itemId, amount }),
    );

    useGameStore.getState().setState((state: FullStoreState) => {
      const newInventory = { ...state.inventory };
      let newCoins = state.coins;

      rewardArray.forEach((reward) => {
        if (reward.itemId === "coins") {
          newCoins += reward.amount;
        } else {
          newInventory[reward.itemId] =
            (newInventory[reward.itemId] || 0) + reward.amount;
        }
      });

      return {
        coins: newCoins,
        inventory: newInventory,
        tower: { ...state.tower, lastSweepTime: Date.now() },
        rewardModal: {
          isOpen: true,
          title: "Global Tower Sweep Complete!",
          rewards: rewardArray,
        },
      };
    });
  };

  if (isCombatActive) {
    return <TowerCombatView />;
  }

  // Määritetään taustakuva vaikeustason mukaan
  const getBackgroundImage = () => {
    switch (activeTier) {
      case "hard":
        return "./assets/backgrounds/bg_tower_hard.png";
      case "medium":
        return "./assets/backgrounds/bg_tower_medium.png";
      case "easy":
      default:
        return "./assets/backgrounds/bg_tower.png";
    }
  };

  return (
    <div className="h-full flex flex-col bg-app-base text-tx-main overflow-hidden font-sans text-left relative">
      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-4 md:gap-6 sticky top-0 z-30 backdrop-blur-md shrink-0">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-danger/20 border border-danger/30 shadow-lg shrink-0">
          <img
            src="./assets/ui/icon_tower.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
            alt="Tower"
            onError={(e) => (e.currentTarget.src = "./assets/ui/icon_boss.png")}
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-danger mb-0.5 md:mb-1">
                Endless Tower
              </h1>
              <p className="text-tx-muted text-[10px] md:text-sm font-medium">
                Progression:{" "}
                <span className="text-tx-main font-bold">
                  {highestFloor} / {maxFloor} Floors
                </span>
              </p>
            </div>

            {/* VAIKEUSTASON VALINTA */}
            <div className="flex gap-2 bg-app-base/50 p-1 rounded-lg border border-border/50">
              {(["easy", "medium", "hard"] as TowerTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTowerTier(tier)}
                  className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${
                    activeTier === tier
                      ? "bg-danger text-white shadow-md"
                      : "text-tx-muted hover:text-tx-main hover:bg-panel"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* PROGRESS LADDER */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border/50 overflow-y-auto bg-app-base/80 backdrop-blur-sm z-20 custom-scrollbar flex flex-col shrink-0 relative">
          <div className="p-4 border-b border-border/30 bg-panel/40 sticky top-0 z-10 backdrop-blur-md flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-tx-muted">
              {activeTier} Path
            </h3>
          </div>

          <div className="p-4 flex flex-col gap-2 relative">
            <div className="absolute left-9 top-6 bottom-6 w-1 bg-panel/50 hidden md:block z-0 rounded-full"></div>

            {reversedFloors.map((floor) => {
              const isLocked = floor.floorNumber > currentTargetFloor;
              const isCompleted = floor.floorNumber <= highestFloor;
              const isCurrent = floor.floorNumber === currentTargetFloor;

              return (
                <div
                  key={floor.floorNumber}
                  ref={isCurrent ? activeFloorRef : null}
                  className={`flex items-center gap-3 p-3 rounded-xl border relative z-10 transition-all ${
                    isCurrent
                      ? "bg-danger/10 border-danger shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                      : isCompleted
                        ? "bg-panel/30 border-border/30 opacity-70"
                        : "bg-app-base border-border/20 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-inner ${
                      isCurrent
                        ? "bg-app-base border-danger/50"
                        : "bg-panel border-border/30"
                    }`}
                  >
                    <img
                      src={floor.enemy.icon}
                      className={`w-8 h-8 pixelated transition-all duration-500
                        ${isLocked ? "blur-sm opacity-50 grayscale" : ""} 
                        ${isCompleted ? "grayscale opacity-60" : ""} 
                        ${isCurrent ? "drop-shadow-md" : ""}
                      `}
                      alt={isLocked ? "???" : floor.enemy.name}
                      onError={(e) =>
                        (e.currentTarget.src = "./assets/ui/icon_death.png")
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-[8px] font-black tracking-widest uppercase ${
                        isCompleted
                          ? "text-success"
                          : isCurrent
                            ? "text-danger animate-pulse"
                            : "text-tx-muted/50"
                      }`}
                    >
                      {isCompleted
                        ? "Cleared"
                        : isCurrent
                          ? "Target"
                          : "Locked"}
                    </div>
                    <div
                      className={`font-black uppercase tracking-tighter text-xs truncate ${
                        isCurrent
                          ? "text-tx-main"
                          : isLocked
                            ? "text-tx-muted/40"
                            : "text-tx-muted"
                      }`}
                    >
                      Floor {floor.floorNumber}
                    </div>
                  </div>

                  <div className="ml-auto shrink-0 flex items-center justify-center w-5 h-5">
                    {isCompleted && (
                      <img
                        src="./assets/ui/icon_check.png"
                        className="w-4 h-4 pixelated opacity-80"
                        alt="Cleared"
                      />
                    )}
                    {isLocked && (
                      <img
                        src="./assets/ui/icon_locked.png"
                        className="w-4 h-4 pixelated opacity-30"
                        alt="Locked"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ITEM DISPLAY AREA */}
        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-20 md:opacity-40"
              style={{
                backgroundImage: `url(${getBackgroundImage()})`,
              }}
            />
            <div className="absolute inset-0 bg-black/90 md:bg-app-base/80 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 h-full p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
                  <div className="bg-panel/60 border border-border/50 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-6 border-b border-border/50 pb-2">
                      Current Target ({activeTier})
                    </h2>

                    {hasCompletedAll || !currentFloorData ? (
                      <div className="flex flex-col items-center justify-center text-center py-12">
                        <img
                          src="./assets/ui/icon_check.png"
                          className="w-12 h-12 pixelated opacity-50 mb-4"
                          alt="Conquered"
                        />
                        <p className="text-sm font-black uppercase tracking-widest text-success">
                          Tower Conquered
                        </p>
                        <p className="text-[10px] text-tx-muted uppercase tracking-widest mt-2">
                          Await further challenges.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-app-base border border-border/50 rounded-xl flex items-center justify-center p-3 shadow-inner shrink-0 relative group">
                            <div className="absolute inset-0 bg-danger/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <img
                              src={currentFloorData.enemy.icon}
                              alt={currentFloorData.enemy.name}
                              className="w-full h-full object-contain pixelated drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
                              onError={(e) =>
                                (e.currentTarget.src =
                                  "./assets/ui/icon_boss.png")
                              }
                            />
                          </div>

                          <div className="flex-1 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 bg-danger/10 border border-danger/20 px-2 py-0.5 rounded text-[9px] font-black text-danger uppercase tracking-[0.2em] mb-2">
                              <img
                                src="./assets/ui/icon_boss.png"
                                className="w-2.5 h-2.5 pixelated"
                                alt=""
                              />{" "}
                              Lvl {currentFloorData.enemy.level}
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-tx-main uppercase tracking-widest mb-4">
                              {currentFloorData.enemy.name}
                            </h3>

                            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto sm:mx-0">
                              <div className="bg-app-base border border-border/50 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-[8px] text-tx-muted uppercase font-black tracking-widest mb-1">
                                  Health
                                </span>
                                <span className="text-[10px] md:text-xs font-mono font-black text-success">
                                  {currentFloorData.enemy.maxHp.toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-app-base border border-border/50 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-[8px] text-tx-muted uppercase font-black tracking-widest mb-1">
                                  Attack
                                </span>
                                <span className="text-[10px] md:text-xs font-mono font-black text-danger">
                                  {currentFloorData.enemy.attack.toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-app-base border border-border/50 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-[8px] text-tx-muted uppercase font-black tracking-widest mb-1">
                                  Defense
                                </span>
                                <span className="text-[10px] md:text-xs font-mono font-black text-warning">
                                  {currentFloorData.enemy.defense.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-3">
                            First Clear Bounty
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentFloorData.firstClearRewards.map(
                              (reward, i) => {
                                const item = getItemById(
                                  reward.itemId,
                                ) as Resource;
                                if (!item) return null;
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 bg-app-base/50 border border-border/50 p-2.5 rounded-xl hover:bg-panel transition-colors"
                                  >
                                    <div className="w-8 h-8 bg-panel border border-border/50 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
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
                                      <span className="text-[10px] font-mono text-tx-muted font-bold">
                                        x{reward.amount.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>

                        <button
                          onClick={handleChallenge}
                          className="w-full py-4 bg-danger hover:bg-danger/90 border border-danger text-white rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] active:scale-95 mt-auto"
                        >
                          <img
                            src="./assets/ui/icon_battle.png"
                            className="w-4 h-4 pixelated"
                            alt=""
                          />
                          Initiate Combat
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="bg-panel/60 border border-border/50 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
                    <h2 className="text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4 border-b border-border/50 pb-2">
                      Global Sweep
                    </h2>

                    <p className="text-[10px] text-tx-muted uppercase tracking-widest leading-relaxed mb-6 font-medium">
                      Instantly claim sweep rewards from{" "}
                      <span className="text-tx-main font-bold">
                        all tiers and floors
                      </span>{" "}
                      you have conquered. Resets at 00:00 UTC.
                    </p>

                    <button
                      onClick={handleSweep}
                      disabled={hasSweptToday || !canSweepAnything}
                      className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border active:scale-95 mt-auto
                        ${
                          hasSweptToday || !canSweepAnything
                            ? "bg-app-base border-border text-tx-muted/50 cursor-not-allowed"
                            : "bg-accent hover:bg-accent-hover border-accent text-white shadow-[0_0_15px_rgba(var(--color-accent),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-accent),0.5)]"
                        }
                      `}
                    >
                      {!canSweepAnything ? (
                        <>
                          <img
                            src="./assets/ui/icon_lock.png"
                            className="w-4 h-4 pixelated opacity-50"
                            alt=""
                          />{" "}
                          Locked
                        </>
                      ) : hasSweptToday ? (
                        <>{formatTime(timeLeft)}</>
                      ) : (
                        <>
                          <img
                            src="./assets/ui/icon_battle.png"
                            className="w-4 h-4 pixelated"
                            alt=""
                          />{" "}
                          Sweep All
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
