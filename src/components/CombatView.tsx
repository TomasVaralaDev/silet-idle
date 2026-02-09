import type { CombatState, GameState, Resource } from '../types';
import { COMBAT_DATA, getItemDetails } from '../data';

interface CombatViewProps {
  combatState: CombatState;
  inventory: GameState['inventory'];
  equippedFood: GameState['equippedFood'];
  onEquipFood: (itemId: string, amount: number) => void;
  onStartCombat: (mapId: number) => void;
  onStopCombat: () => void;
}

export default function CombatView({ 
  combatState, 
  inventory, 
  equippedFood, 
  onEquipFood, 
  onStartCombat, 
  onStopCombat 
}: CombatViewProps) {

  // POISTETTU: const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
  // Taistelun tila tulee suoraan propsista 'combatState'

  // KORJAUS: Type assertion 'as Resource', jotta pääsemme käsiksi .healing propertyyn
  const foodItem = equippedFood ? (getItemDetails(equippedFood.itemId) as Resource) : null;

  // Find available food from inventory
  const availableFood = Object.entries(inventory)
    .map(([id, count]) => {
      const item = getItemDetails(id) as Resource;
      return item && item.healing ? { ...item, count, id } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => (b.healing || 0) - (a.healing || 0));

  const currentMap = combatState.currentMapId 
    ? COMBAT_DATA.find(m => m.id === combatState.currentMapId) 
    : null;

  const playerHpPercent = combatState.maxHp ? (combatState.hp / combatState.maxHp) * 100 : 0;
  const enemyHpPercent = currentMap ? (combatState.enemyCurrentHp / currentMap.enemyHp) * 100 : 0;

  return (
    <div className="p-6 h-full flex flex-col lg:flex-row gap-6 bg-slate-950 overflow-y-auto custom-scrollbar">
      
      {/* --- LEFT: BATTLE ARENA --- */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* ACTIVE COMBAT AREA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden min-h-[400px] flex flex-col shadow-2xl">
          
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('/assets/bg/combat_grid.png')] opacity-5 pointer-events-none"></div>
          
          {currentMap ? (
            <div className="flex-1 flex flex-col justify-between relative z-10">
              
              {/* ENEMY SECTION (TOP) */}
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="relative mb-4">
                   <div className="w-32 h-32 bg-slate-950/50 rounded-full border-2 border-red-900/50 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                      {/* Enemy Placeholder / Icon */}
                      <span className="text-4xl">👾</span>
                   </div>
                </div>
                
                <h2 className="text-xl font-bold text-red-400 uppercase tracking-widest mb-2">{currentMap.enemyName}</h2>
                
                {/* Enemy HP Bar */}
                <div className="w-full max-w-xs bg-slate-950 h-6 rounded-full border border-slate-700 relative overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${enemyHpPercent}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white drop-shadow-md">
                    {Math.ceil(combatState.enemyCurrentHp)} / {currentMap.enemyHp}
                  </span>
                </div>
              </div>

              {/* VS SEPARATOR */}
              <div className="text-center py-4 opacity-30 text-4xl font-black italic tracking-widest text-slate-700 select-none">
                VS
              </div>

              {/* PLAYER SECTION (BOTTOM) */}
              <div className="flex flex-col items-center">
                
                {/* Player HP Bar */}
                <div className="w-full max-w-xs bg-slate-950 h-8 rounded-full border border-slate-700 relative overflow-hidden mb-3 shadow-lg">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${playerHpPercent}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-mono font-bold text-white drop-shadow-md">
                    {Math.ceil(combatState.hp)} / {combatState.maxHp} HP
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  {/* FOOD SLOT */}
                  <div className="relative group">
                    <div 
                      className={`w-16 h-16 bg-slate-900 border-2 rounded-xl flex items-center justify-center relative
                        ${equippedFood ? 'border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]' : 'border-slate-700 border-dashed opacity-50'}`}
                    >
                      {foodItem ? (
                        <>
                          <img src={foodItem.icon} className="w-10 h-10 pixelated" alt="Food" />
                          <div className="absolute -top-2 -right-2 bg-slate-950 text-xs font-bold px-1.5 py-0.5 rounded border border-slate-700 text-white">
                            {equippedFood?.count}
                          </div>
                          {combatState.foodTimer > 0 && (
                            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                              <span className="text-xs font-mono text-white">{combatState.foodTimer}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 font-bold uppercase">No Food</span>
                      )}
                    </div>
                    {/* Tooltip for healing amount */}
                    {foodItem && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-green-400 text-xs px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                        Heals {foodItem.healing} HP
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTON */}
                  <button 
                    onClick={onStopCombat}
                    className="px-8 py-4 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700 rounded-lg font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
                  >
                    Retreat
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <span className="text-6xl mb-4 opacity-20">⚔️</span>
              <p className="text-sm font-mono uppercase tracking-widest">System Idle. Select a zone to stabilize.</p>
            </div>
          )}
        </div>

        {/* FOOD SELECTOR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Available Rationing</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {availableFood.length === 0 && <span className="text-xs text-slate-600 italic">No consumables in storage.</span>}
            {availableFood.map(food => (
              <button
                key={food.id}
                onClick={() => onEquipFood(food.id, food.count)}
                className={`flex-shrink-0 w-12 h-12 bg-slate-950 border border-slate-700 hover:border-green-500 rounded-lg flex items-center justify-center relative group transition-colors
                  ${equippedFood?.itemId === food.id ? 'border-green-500 ring-1 ring-green-500/50' : ''}`}
                title={`Equip ${food.name} (Heals ${food.healing})`}
              >
                <img src={food.icon} className="w-8 h-8 pixelated" alt={food.name} />
                <span className="absolute bottom-0 right-0 text-[9px] font-mono font-bold bg-slate-900/80 px-1 rounded-tl">
                  {food.count}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* --- RIGHT: MAP SELECTION --- */}
      <div className="w-full lg:w-96 flex-shrink-0 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Combat Zones</h3>
          <p className="text-xs text-slate-500 font-mono mt-1">World 1 - The Beginning</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {COMBAT_DATA.map((map) => {
            const isUnlocked = map.id === 1 || combatState.maxMapCompleted >= map.id - 1;
            const isCompleted = combatState.maxMapCompleted >= map.id;
            
            return (
              <button
                key={map.id}
                disabled={!isUnlocked || combatState.currentMapId !== null}
                onClick={() => onStartCombat(map.id)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all relative group
                  ${combatState.currentMapId === map.id 
                    ? 'bg-red-950/20 border-red-500/50 cursor-default' 
                    : !isUnlocked 
                      ? 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed grayscale' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-500 hover:bg-slate-800'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${combatState.currentMapId === map.id ? 'text-red-400' : 'text-slate-300'}`}>
                    {map.name}
                  </span>
                  {isCompleted && <span className="text-emerald-500 text-xs">✓</span>}
                  {!isUnlocked && <span className="text-slate-600 text-xs">🔒</span>}
                </div>
                
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                  <span>Lvl.{map.enemyAttack * 2} {map.enemyName}</span>
                  <span className="text-slate-600">•</span>
                  <span>HP {map.enemyHp}</span>
                </div>

                {map.isBoss && (
                  <div className="absolute top-2 right-2 text-red-500 animate-pulse text-xs font-bold">BOSS</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}