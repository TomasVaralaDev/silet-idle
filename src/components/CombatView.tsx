import { useState } from 'react';
import WorldSelector from './combat/WorldSelector';
import BattleArena from './combat/BattleArena';
import CombatLog from './combat/CombatLog';
import ZoneSelector from './combat/ZoneSelector';
import FoodSelector from './combat/FoodSelector';

export default function CombatView() {
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden text-slate-200">
      
      {/* 1. VASEN LAITA: Maailman valinta */}
      <WorldSelector 
        selectedWorld={selectedWorldId} 
        onSelectWorld={setSelectedWorldId} 
      />

      {/* 2. KESKIALUE: Areena, Consumables ja Loki */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/10">
        
        {/* Taisteluareena ylhäällä */}
        <div className="h-[520px] p-4 shrink-0">
          <BattleArena selectedWorldId={selectedWorldId} />
        </div>
        
        {/* Alarivi: Consumables + Combat Log 50/50 split */}
        <div className="flex border-t border-slate-800/60 bg-slate-950/20 h-72 shrink-0">
          {/* Vasen 50%: Consumables */}
          <div className="flex-1 border-r border-slate-800/60 p-4 overflow-y-auto custom-scrollbar">
            <FoodSelector />
          </div>

          {/* Oikea 50%: Combat Log */}
          <div className="flex-1 min-w-0">
            <CombatLog />
          </div>
        </div>

        {/* Tyhjä tila alhaalla */}
        <div className="flex-1 bg-slate-950/40" />
      </div>

      {/* 3. OIKEA LAITA: Mapit (Koko korkeus) */}
      <div className="w-80 flex flex-col border-l border-slate-800 bg-slate-950/60 shrink-0 h-full">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 px-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Campaign Zones</h3>
          </div>
          
          <div className="flex-1 min-h-0">
            <ZoneSelector selectedWorldId={selectedWorldId} />
          </div>
        </div>
      </div>

    </div>
  );
}