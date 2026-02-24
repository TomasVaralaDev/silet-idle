import { useState, useEffect } from 'react'; // KORJAUS: Lisätty useEffect
import { useGameStore } from '../store/useGameStore';
import { COMBAT_DATA } from '../data'; 
import WorldSelector from './combat/WorldSelector';
import BattleArena from './combat/BattleArena';
import ZoneSelector from './combat/ZoneSelector';
import CombatLog from './combat/CombatLog';
import FoodSelector from './combat/FoodSelector';
import { formatRemainingTime } from '../utils/formatUtils'; // KORJAUS: Importattu työkalu

export default function CombatView() {
  const combatStats = useGameStore((s) => s.combatStats);
  const [now, setNow] = useState(() => Date.now());

  // Päivitetään paikallista kelloa sekunnin välein, jos cooldown on päällä
  useEffect(() => {
    if (combatStats.cooldownUntil > now) {
      const timer = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(timer);
    }
  }, [combatStats.cooldownUntil, now]);

  const currentMap = combatStats.currentMapId 
    ? COMBAT_DATA.find(m => m.id === combatStats.currentMapId) 
    : null;
  
  const activeWorldId = currentMap?.world || (combatStats.currentMapId ? Math.ceil(combatStats.currentMapId / 10) : null);

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
    <div className="h-full w-full flex bg-slate-950 overflow-hidden text-slate-200 font-sans">
      
      <WorldSelector selectedWorld={selectedWorld} onSelectWorld={setSelectedWorld} />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* JÄÄHTYMISAIKA-OVERLAY */}
        {isRecovering && !combatStats.currentMapId && (
          <div className="absolute inset-0 z-[40] bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 mb-4 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
            <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">System Recovery</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              Severe trauma detected. Auto-repair protocols active.
            </p>
            <div className="mt-4 font-mono text-2xl font-bold text-white bg-red-900/30 px-4 py-2 rounded border border-red-500/30">
              {formatRemainingTime(cooldownLeft)}
            </div>
          </div>
        )}

        <div className="h-[45%] shrink-0 relative bg-slate-900 overflow-hidden border-b border-slate-800">
          <BattleArena selectedWorldId={selectedWorld} />
        </div>

        <div className="flex-1 min-h-0 bg-slate-950 flex z-20">
          <div className="w-1/2 border-r border-slate-800 p-4 flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">Consumables</h3>
            <div className="flex-1 min-h-0">
              <FoodSelector />
            </div>
          </div>

          <div className="w-1/2 flex flex-col bg-slate-950">
             <div className="p-2 px-4 border-b border-slate-800 bg-slate-900/30">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Combat Log</span>
             </div>
             <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0">
                  <CombatLog /> 
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="w-80 flex-shrink-0 border-l border-slate-800 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col">
        <ZoneSelector selectedWorldId={selectedWorld} />
      </div>

    </div>
  );
}