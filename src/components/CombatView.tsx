import { useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { COMBAT_DATA } from "../data";
import WorldSelector from "./combat/WorldSelector";
import BattleArena from "./combat/BattleArena";
import ZoneSelector from "./combat/ZoneSelector";
import CombatLog from "./combat/CombatLog";
import FoodSelector from "./combat/FoodSelector";
import { formatRemainingTime } from "../utils/formatUtils";

export default function CombatView() {
  const combatStats = useGameStore((s) => s.combatStats);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (combatStats.cooldownUntil > now) {
      const timer = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(timer);
    }
  }, [combatStats.cooldownUntil, now]);

  const currentMap = combatStats.currentMapId
    ? COMBAT_DATA.find((m) => m.id === combatStats.currentMapId)
    : null;

  const activeWorldId =
    currentMap?.world ||
    (combatStats.currentMapId
      ? Math.ceil(combatStats.currentMapId / 10)
      : null);

  const [prevActiveWorldId, setPrevActiveWorldId] = useState(activeWorldId);
  const [selectedWorld, setSelectedWorld] = useState(() => {
    if (activeWorldId) return activeWorldId;
    const maxMap = combatStats.maxMapCompleted || 1;
    return Math.ceil(maxMap / 10) || 1;
  });

  if (activeWorldId !== prevActiveWorldId) {
    setPrevActiveWorldId(activeWorldId);
    setSelectedWorld(activeWorldId || 1);
  }

  const cooldownLeft = combatStats.cooldownUntil - now;
  const isRecovering = cooldownLeft > 0;

  return (
    <div className="h-full w-full flex bg-app-base overflow-hidden text-tx-main font-sans selection:bg-accent/30 selection:text-accent">
      {/* LEFT: WORLD NAVIGATION */}
      <WorldSelector
        selectedWorld={selectedWorld}
        onSelectWorld={setSelectedWorld}
      />

      {/* CENTER: BATTLE ZONE */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* RECOVERY OVERLAY */}
        {isRecovering && !combatStats.currentMapId && (
          <div className="absolute inset-0 z-[40] bg-app-base/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 mb-6 rounded-full border-4 border-danger/20 border-t-danger animate-spin shadow-[0_0_20px_rgb(var(--color-danger)/0.2)]" />

            <h2 className="text-2xl font-black text-danger uppercase tracking-[0.3em] mb-2">
              System Recovery
            </h2>
            <p className="text-tx-muted text-sm max-w-xs font-medium italic">
              Severe trauma detected. Auto-repair protocols active.
            </p>

            <div className="mt-6 font-mono text-3xl font-black text-tx-main bg-danger/10 px-6 py-3 rounded-lg border border-danger/30 shadow-2xl">
              {formatRemainingTime(cooldownLeft)}
            </div>
          </div>
        )}

        {/* TOP PANEL: ARENA */}
        <div className="h-[45%] shrink-0 relative bg-panel overflow-hidden border-b border-border shadow-inner">
          <BattleArena selectedWorldId={selectedWorld} />
        </div>

        {/* BOTTOM PANEL: LOGS & CONSUMABLES */}
        <div className="flex-1 min-h-0 bg-app-base flex z-20">
          {/* CONSUMABLES SECTION */}
          <div className="w-1/2 border-r border-border p-5 flex flex-col bg-panel/30">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Consumables
            </h3>
            <div className="flex-1 min-h-0">
              <FoodSelector />
            </div>
          </div>

          {/* LOG SECTION - Siivottu ylimääräinen header pois */}
          <div className="w-1/2 flex flex-col bg-app-base">
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0">
                <CombatLog />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: ZONE SELECTOR */}
      <div className="w-80 flex-shrink-0 border-l border-border bg-panel/80 backdrop-blur-sm z-20 flex flex-col">
        <ZoneSelector selectedWorldId={selectedWorld} />
      </div>
    </div>
  );
}
