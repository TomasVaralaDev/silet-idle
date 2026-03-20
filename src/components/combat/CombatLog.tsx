import { useGameStore } from "../../store/useGameStore";

export default function CombatLog() {
  const combatStats = useGameStore((state) => state.combatStats);
  const logs = combatStats?.combatLog || [];

  return (
    <div className="h-full flex flex-col bg-app-base rounded-xl border border-border overflow-hidden shadow-inner">
      {/* HEADER */}
      <div className="p-3 border-b border-border bg-panel/50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted">
          Combat Log
        </h3>
      </div>

      {/* LOG CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-[11px] custom-scrollbar text-left">
        {logs.length === 0 ? (
          <div className="text-tx-muted italic text-center mt-10 opacity-30 uppercase tracking-widest text-[9px]">
            - No active signals -
          </div>
        ) : (
          logs.map((log, index) => {
            // Oletusväri ja tyyli
            let logColor = "text-tx-muted";
            let fontWeight = "font-medium";
            let bgHighlight = "";

            if (log.includes("Victory!")) {
              logColor = "text-warning";
              fontWeight = "font-black";
            } else if (log.startsWith("Loot:")) {
              logColor = "text-accent-hover";
              fontWeight = "font-bold";
            } else if (log.startsWith("Hit ")) {
              // Pelaajan iskut
              logColor = "text-tx-main";
              if (log.includes("Critical!")) {
                logColor = "text-warning";
                fontWeight = "font-black";
              }
            } else if (log.startsWith("Took ") || log.includes("Defeated!")) {
              // Vihollisen iskut tai kuolema
              logColor = "text-danger";
              bgHighlight = "bg-danger/5";
            } else if (log.includes("blocked!")) {
              // Blokattu isku
              logColor = "text-success opacity-80";
            } else if (log.includes("Healed")) {
              // Parantuminen
              logColor = "text-success";
              fontWeight = "font-bold";
            }

            return (
              <div
                key={index}
                className={`animate-in fade-in slide-in-from-left-2 duration-300 border-l-2 border-border/20 pl-2 py-0.5 ${bgHighlight}`}
              >
                <span className={`${logColor} ${fontWeight} leading-relaxed`}>
                  {log}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
