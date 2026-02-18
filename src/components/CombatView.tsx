import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { COMBAT_DATA } from '../data'; 
import WorldSelector from './combat/WorldSelector';
import BattleArena from './combat/BattleArena';
import ZoneSelector from './combat/ZoneSelector';
import CombatLog from './combat/CombatLog';
import FoodSelector from './combat/FoodSelector';

export default function CombatView() {
  const combatStats = useGameStore((s) => s.combatStats);

  // --- 1. LASKE NYKYINEN AKTIIVINEN MAAILMA ---
  const currentMap = combatStats.currentMapId 
    ? COMBAT_DATA.find(m => m.id === combatStats.currentMapId) 
    : null;
  
  const activeWorldId = currentMap?.world || (combatStats.currentMapId ? Math.ceil(combatStats.currentMapId / 10) : null);

  // --- 2. TILAN HALLINTA ---
  // Säilytetään tieto siitä, mikä oli "edellinen" aktiivinen maailma, jotta tunnistamme muutoksen
  const [prevActiveWorldId, setPrevActiveWorldId] = useState(activeWorldId);
  
  // selectedWorld on se, mitä UI näyttää
  const [selectedWorld, setSelectedWorld] = useState(() => {
    if (activeWorldId) return activeWorldId;
    const maxMap = combatStats.maxMapCompleted || 1;
    return Math.ceil(maxMap / 10) || 1;
  });

  // --- 3. SYNKRONOINTI ILMAN EFFECTIÄ (React 18+ suositus) ---
  // Jos taistelu siirtyy uuteen maailmaan (esim. auto-progress), päivitetään näkymä automaattisesti.
  // Tämä suoritetaan renderöinnin aikana, mikä on tehokkaampaa kuin useEffect.
  if (activeWorldId !== prevActiveWorldId) {
    setPrevActiveWorldId(activeWorldId);
    setSelectedWorld(activeWorldId || 1);
  }

  return (
    <div className="h-full w-full flex bg-slate-950 overflow-hidden text-slate-200 font-sans">
      
      {/* VASEN: World Selector */}
      <WorldSelector selectedWorld={selectedWorld} onSelectWorld={setSelectedWorld} />

      {/* KESKIOSA: Arena & Alapalkit */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* YLÄOSA: Visuaalinen Areena */}
        <div className="h-[45%] shrink-0 relative bg-slate-900 overflow-hidden border-b border-slate-800">
          <BattleArena selectedWorldId={selectedWorld} />
        </div>

        {/* ALAOSA: Consumables ja Log */}
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

      {/* OIKEA PALKKI: Zone Selector (Kartat) */}
      <div className="w-80 flex-shrink-0 border-l border-slate-800 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col">
        <ZoneSelector selectedWorldId={selectedWorld} />
      </div>

    </div>
  );
}