import { useGameStore } from "../../store/useGameStore";

export default function CombatLog() {
  const combatStats = useGameStore((state) => state.combatStats);
  const logs = combatStats?.combatLog || [];

  return (
    <div className="h-full flex flex-col bg-app-base overflow-hidden">
      <div className="hidden md:block p-3 border-b border-border/50 bg-panel/30">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-tx-muted">
          Active Signals
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[10px] md:text-[11px] custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-tx-muted italic text-center mt-10 uppercase tracking-widest text-[9px] opacity-40">
            - Silence -
          </div>
        ) : (
          logs.map((log, index) => {
            let logColor = "text-tx-muted";
            if (log.includes("Victory!")) logColor = "text-warning font-black";
            else if (log.startsWith("Loot:"))
              logColor = "text-accent font-bold";
            else if (log.startsWith("Hit ")) logColor = "text-tx-main";
            else if (log.startsWith("Took ") || log.includes("Defeated!"))
              logColor = "text-danger";

            return (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-left-1 duration-200 border-l border-border/50 pl-2 py-0.5"
              >
                <span className={`${logColor} leading-relaxed`}>{log}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
