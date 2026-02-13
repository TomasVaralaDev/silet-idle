import { useGameStore } from '../../store/useGameStore';

export default function CombatLog() {
  // Haetaan combatStats storesta
  const combatStats = useGameStore((state) => state.combatStats);

  // --- TURVALLISUUSKORJAUS ---
  // Varmistetaan, että combatLog on aina taulukko (array).
  // Jos combatStats tai combatLog on undefined, käytetään tyhjää taulukkoa [].
  const logs = combatStats?.combatLog || [];

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-900/50">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Combat Log
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs custom-scrollbar">
        {/* Tarkistetaan pituus turvallisesta 'logs'-muuttujasta */}
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-center mt-10 opacity-50">
            - No combat activity -
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-left-2 duration-300">
              {/* Väritetään lokit sen perusteella mitä tapahtui */}
              <span className={`
                ${log.includes("Victory") ? "text-yellow-400 font-bold" : ""}
                ${log.includes("Loot") ? "text-emerald-400" : ""}
                ${log.includes("Hit") ? "text-slate-300" : ""}
                ${log.includes("Take") ? "text-red-400" : ""}
                ${!log.includes("Victory") && !log.includes("Loot") && !log.includes("Hit") && !log.includes("Take") ? "text-slate-500" : ""}
              `}>
                {log}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}