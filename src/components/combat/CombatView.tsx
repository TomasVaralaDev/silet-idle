import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { COMBAT_DATA } from "../../data";
import WorldSelector from "./WorldSelector";
import BattleArena from "./BattleArena";
import ZoneSelector from "./ZoneSelector";
import CombatLog from "./CombatLog";
import FoodSelector from "./FoodSelector";
import { formatRemainingTime } from "../../utils/formatUtils";

export default function CombatView() {
  const combatStats = useGameStore((s) => s.combatStats);
  const [now, setNow] = useState(() => Date.now());
  const [mobileTab, setMobileTab] = useState<"logs" | "food">("logs");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (combatStats.cooldownUntil > now) {
      interval = setInterval(() => setNow(Date.now()), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [combatStats.cooldownUntil, now]);

  const rawDiff = combatStats.cooldownUntil - now;
  const cooldownLeft = rawDiff > 0 ? Math.min(rawDiff, 60000) : 0;
  const isRecovering = cooldownLeft > 0;

  const currentMap = combatStats.currentMapId
    ? COMBAT_DATA.find((m) => m.id === combatStats.currentMapId)
    : null;

  const activeWorldId =
    currentMap?.world ||
    (combatStats.currentMapId
      ? Math.ceil(combatStats.currentMapId / 10)
      : null);

  const [selectedWorld, setSelectedWorld] = useState(() => {
    if (activeWorldId) return activeWorldId;
    const maxMap = combatStats.maxMapCompleted || 1;
    return Math.ceil(maxMap / 10) || 1;
  });

  if (activeWorldId && activeWorldId !== selectedWorld) {
    setSelectedWorld(activeWorldId);
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row bg-app-base overflow-hidden text-tx-main font-sans">
      {/* WORLD SELECTOR */}
      <WorldSelector
        selectedWorld={selectedWorld}
        onSelectWorld={setSelectedWorld}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* RECOVERY OVERLAY */}
        {isRecovering && !combatStats.currentMapId && (
          <div className="absolute inset-0 z-[50] bg-app-base/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full border-4 border-danger/20 border-t-danger animate-spin shadow-[0_0_30px_rgba(var(--color-danger)/0.3)]" />
            <h2 className="text-xl md:text-2xl font-black text-danger uppercase tracking-[0.3em] mb-2">
              Defeated
            </h2>
            <p className="text-tx-muted text-xs md:text-sm max-w-xs font-medium italic mb-6">
              Recovering vital signs...
            </p>
            <div className="font-mono text-2xl md:text-3xl font-black text-tx-main bg-danger/10 px-6 py-3 rounded border border-danger/30">
              {formatRemainingTime(cooldownLeft)}
            </div>
          </div>
        )}

        {/* ZONE SELECTOR (Mobile) */}
        <div className="md:hidden w-full bg-panel/30 border-b border-border/50">
          <ZoneSelector selectedWorldId={selectedWorld} isMobile={true} />
        </div>

        {/* BATTLE ARENA */}
        <div className="flex-1 min-h-0 relative bg-app-base overflow-hidden shadow-inner">
          <BattleArena selectedWorldId={selectedWorld} />
        </div>

        {/* MOBILE TABS */}
        <div className="md:hidden flex flex-col h-[40%] border-t border-border/50 bg-panel/10">
          <div className="flex border-b border-border/50 bg-app-base/40 shrink-0">
            <button
              onClick={() => setMobileTab("logs")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mobileTab === "logs" ? "text-accent bg-accent/5" : "text-tx-muted"}`}
            >
              Combat Logs
            </button>
            <button
              onClick={() => setMobileTab("food")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${mobileTab === "food" ? "text-accent bg-accent/5" : "text-tx-muted"}`}
            >
              Consumables
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {mobileTab === "logs" ? (
              <CombatLog />
            ) : (
              <div className="p-4 h-full">
                <FoodSelector />
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP PANELS */}
        <div className="hidden md:flex h-[35%] shrink-0 border-t border-border/50 bg-app-base z-20">
          <div className="w-1/2 border-r border-border/50 p-5 flex flex-col bg-panel/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Inventory
            </h3>
            <div className="flex-1 min-h-0">
              <FoodSelector />
            </div>
          </div>
          <div className="w-1/2 flex flex-col">
            <CombatLog />
          </div>
        </div>
      </div>

      {/* DESKTOP ZONE SELECTOR */}
      <div className="hidden md:flex w-80 flex-shrink-0 border-l border-border/50 bg-panel/30 z-20">
        <ZoneSelector selectedWorldId={selectedWorld} />
      </div>
    </div>
  );
}
