import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';
import { getPlayerStats } from '../../utils/combatMechanics';

export default function StatsPanel() {
  // KORJAUS: Poistettu 'equipment' tästä listasta, koska sitä ei käytetty
  const { 
    skills, equippedFood, combatSettings, 
    updateCombatSettings, unequipFood 
  } = useGameStore();

  // Lasketaan pelaajan statsit "lennosta" visualisointia varten
  // Huom: Tässä käytetään nyt yksinkertaistettuja statseja koska equipment-dataa ei suoraan lueta tässä komponentissa
  // Jos haluat tarkat statsit (ml. kamat), getPlayerStats pitää päivittää ottamaan equipment huomioon
  const stats = getPlayerStats(skills, 'melee', {
    attackDamage: 0, armor: 0 
  });

  // Haetaan ruoan tiedot
  const foodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. FOOD & SETTINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consumables</h3>
        
        {/* Food Slot */}
        <div className="flex items-center gap-4">
          <div 
            onClick={unequipFood}
            className={`w-12 h-12 rounded-lg border flex items-center justify-center cursor-pointer relative group ${foodItem ? 'bg-slate-800 border-emerald-500' : 'bg-slate-950 border-slate-800 border-dashed'}`}
          >
            {foodItem ? (
              <>
                <img src={foodItem.icon} className="w-8 h-8 pixelated" alt="Food" />
                <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-xs text-white font-bold">X</div>
              </>
            ) : (
              <span className="text-[10px] text-slate-600">EMPTY</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-200">{foodItem ? foodItem.name : "No Food"}</div>
            {foodItem && <div className="text-xs text-emerald-400">+{foodItem.healing} HP / eat</div>}
            {equippedFood && <div className="text-xs text-slate-400 mt-0.5">Quantity: {equippedFood.count}</div>}
          </div>
        </div>

        {/* Auto-Eat Slider */}
        <div className="pt-2 border-t border-slate-800/50">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Auto-Eat at HP%</span>
            <span className="text-emerald-400 font-mono font-bold">{combatSettings.autoEatThreshold}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="95" 
            value={combatSettings.autoEatThreshold}
            onChange={(e) => updateCombatSettings({ autoEatThreshold: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
        </div>
      </div>

      {/* 2. STATS DISPLAY */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Base Stats</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
            <span className="text-slate-400">Max HP</span>
            <span className="text-emerald-400 font-mono font-bold">{stats.maxHp}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Attack</span>
            <span className="text-amber-400 font-mono font-bold">{stats.attackLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Defense</span>
            <span className="text-blue-400 font-mono font-bold">{stats.defenseLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Strength</span>
            <span className="text-red-400 font-mono font-bold">{stats.strengthLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}