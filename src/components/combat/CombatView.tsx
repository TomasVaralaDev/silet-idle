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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (combatStats.cooldownUntil > now) {
      interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [combatStats.cooldownUntil, now]);

  const rawDiff = combatStats.cooldownUntil - now;
  const cooldownLeft = rawDiff > 0 ? rawDiff : 0;
  const isRecovering = cooldownLeft > 0;

  const isRetreat = combatStats.cooldownReason === "retreat";

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

  return (
    // 1. PÄÄCONTAINER: Mobiilissa flex-col (allekkain), lg-koossa flex-row (vierekkäin)
    <div className="h-full w-full flex flex-col lg:flex-row bg-app-base overflow-y-auto lg:overflow-hidden text-tx-main font-sans selection:bg-accent/30 selection:text-accent custom-scrollbar">
      {/* LEFT: WORLD NAVIGATION */}
      {/* Wrapperia ei välttämättä tarvita tässä, jos WorldSelector hoitaa oman skaalautuvuutensa, mutta se asettuu nyt mobiilissa ylimmäksi */}
      <WorldSelector
        selectedWorld={selectedWorld}
        onSelectWorld={setSelectedWorld}
      />

      {/* CENTER: BATTLE ZONE */}
      {/* Mobiilissa tämä ottaa tarvitsemansa tilan, lg-koossa se joustaa keskelle (flex-1) */}
      <div className="flex-1 flex flex-col min-w-0 h-auto lg:h-full relative border-y lg:border-y-0 border-border/50">
        {/* RECOVERY OVERLAY */}
        {isRecovering && !combatStats.currentMapId && (
          <div className="absolute inset-0 z-[40] bg-app-base/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full border-4 animate-spin shadow-lg ${
                isRetreat
                  ? "border-warning/20 border-t-warning shadow-warning/20"
                  : "border-danger/20 border-t-danger shadow-danger/20"
              }`}
            />
            <h2
              className={`text-xl md:text-2xl font-black uppercase tracking-[0.3em] mb-2 ${
                isRetreat ? "text-warning" : "text-danger"
              }`}
            >
              {isRetreat ? "Tactical Retreat" : "Defeated"}
            </h2>
            <p className="text-tx-muted text-xs md:text-sm max-w-xs font-medium italic">
              {isRetreat
                ? "Falling back to regroup and catch your breath. Prepare for the next encounter."
                : "You were defeated in combat. Returning to safety and recovering your strength."}
            </p>
            <div
              className={`mt-6 font-mono text-2xl md:text-3xl font-black text-tx-main px-6 py-3 rounded-lg border shadow-2xl ${
                isRetreat
                  ? "bg-warning/10 border-warning/30"
                  : "bg-danger/10 border-danger/30"
              }`}
            >
              {formatRemainingTime(cooldownLeft)}
            </div>
          </div>
        )}

        {/* TOP PANEL: ARENA */}
        {/* Mobiilissa asetetaan kiinteä minimikorkeus (esim 35vh), lg-koossa ottaa 45% */}
        <div className="min-h-[35vh] lg:min-h-0 lg:h-[45%] shrink-0 relative bg-panel overflow-hidden border-b border-border shadow-inner">
          <BattleArena selectedWorldId={selectedWorld} />
        </div>

        {/* BOTTOM PANEL: LOGS & CONSUMABLES */}
        {/* Mobiilissa allekkain (flex-col), md-koossa vierekkäin (flex-row) */}
        <div className="flex-1 min-h-[40vh] lg:min-h-0 bg-app-base flex flex-col md:flex-row z-20">
          {/* CONSUMABLES (Food) */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border p-3 md:p-5 flex flex-col bg-panel/30">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted mb-2 md:mb-4 flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Consumables
            </h3>
            <div className="flex-1 min-h-[150px] md:min-h-0">
              <FoodSelector />
            </div>
          </div>

          {/* COMBAT LOGS */}
          <div className="w-full md:w-1/2 flex flex-col bg-app-base min-h-[200px] md:min-h-0">
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0">
                <CombatLog />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: ZONE SELECTOR */}
      {/* Mobiilissa tämä ottaa koko leveyden (w-full) ja menee alimmaiseksi, työpöydällä se on oikeassa reunassa (lg:w-80) */}
      <div className="w-full lg:w-80 flex-shrink-0 lg:border-l border-border bg-panel/80 backdrop-blur-sm z-20 flex flex-col h-auto lg:h-full">
        <ZoneSelector selectedWorldId={selectedWorld} />
      </div>
    </div>
  );
}
