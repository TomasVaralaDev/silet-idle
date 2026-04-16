import { useEffect, useRef } from "react";

interface TowerCombatLogProps {
  combatLog: string[];
}

export default function TowerCombatLog({ combatLog }: TowerCombatLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Automaattinen scrollaus (jos tarpeen)
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combatLog]);

  return (
    // Samat wrapper-tyylit kuin normaalissa CombatLogissa
    <div className="flex-1 flex flex-col bg-app-base overflow-hidden shadow-inner border-t border-border/50 lg:border-t-0">
      {/* Header */}
      <div className="p-3 border-b border-border bg-panel/50 shrink-0">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted">
          Combat Log
        </h3>
      </div>

      {/* Log Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-[11px] custom-scrollbar text-left">
        {combatLog.length === 0 ? (
          <div className="text-tx-muted italic text-center mt-10 opacity-30 uppercase tracking-widest text-[9px]">
            - No ongoing Combat -
          </div>
        ) : (
          combatLog.map((log, index) => {
            // Default styling for standard log entries
            let logColor = "text-tx-muted";
            let fontWeight = "font-medium";
            let bgHighlight = "";

            // Dynamic styling based on log event type (Tukee sekä Towerin että Normi-combatin termejä)
            if (log.includes("Victory!")) {
              logColor = "text-warning";
              fontWeight = "font-black";
            } else if (log.includes("You hit")) {
              logColor = "text-tx-main"; // Pelaajan hyökkäys
              if (log.includes("CRIT")) {
                logColor = "text-warning";
                fontWeight = "font-black";
              }
            } else if (
              log.includes("Enemy hit") ||
              log.includes("Defeated") ||
              log.includes("Time's up")
            ) {
              logColor = "text-danger"; // Vihollisen hyökkäys tai pelaajan kuolema/aikaloppu
              bgHighlight = "bg-danger/5";
            } else if (
              log.includes("Cast") ||
              log.includes("Engaged") ||
              log.includes("afflicted")
            ) {
              logColor = "text-accent"; // Skillien käyttö ja bossin engege
              fontWeight = "font-bold";
            } else if (log.includes("Restored") || log.includes("Healed")) {
              logColor = "text-success"; // Parantaminen (esim. Divine Light)
              fontWeight = "font-bold";
            }

            return (
              <div
                key={index}
                className={`animate-in fade-in slide-in-from-left-2 duration-300 border-l-2 border-border/20 pl-2 py-0.5 ${bgHighlight}`}
              >
                <span className={`${logColor} ${fontWeight} leading-relaxed`}>
                  {/* Poistettiin ruma [Aikaleima], jotta näyttää 1:1 samalta kuin normi logi */}
                  {log}
                </span>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
