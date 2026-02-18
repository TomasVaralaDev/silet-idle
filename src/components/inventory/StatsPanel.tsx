import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';

export default function StatsPanel() {
  const { equipment, equippedFood, skills, unequipItem, combatSettings, setState } = useGameStore();

  const stats = useMemo(() => {
    let bonusAttack = 0;
    let bonusDefense = 0;
    let overrideSpeed = null;

    Object.values(equipment).forEach((itemId) => {
      if (!itemId) return;
      const item = getItemDetails(itemId);
      if (!item || !item.stats) return;

      if (item.stats.attack) bonusAttack += item.stats.attack;
      if (item.stats.defense) bonusDefense += item.stats.defense;
      
      if (item.slot === 'weapon' && item.interval) {
        overrideSpeed = item.interval;
      }
    });

    const maxHp = 100 + (skills.hitpoints.level * 10);
    const attackDamage = 1 + skills.attack.level + bonusAttack;
    const armor = skills.defense.level + bonusDefense;
    const attackSpeed = overrideSpeed || 2500;
    const critChance = 1;

    return { maxHp, attackDamage, armor, attackSpeed, critChance };
  }, [equipment, skills]);

  const foodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      combatSettings: {
        ...prev.combatSettings,
        autoEatThreshold: Number(e.target.value)
      }
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-inner">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
        Player Stats
      </h3>

      {/* --- 1. CONSUMABLES & SETTINGS (SIIRRETTY YLÖS) --- */}
      <div className="mb-6 pb-6 border-b border-slate-800/50">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
          Active Consumable
        </h4>
        
        {/* UNEQUIP BUTTON */}
        <button
          onClick={() => equippedFood && unequipItem('food')}
          disabled={!equippedFood}
          className={`
            w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 group relative text-left mb-3
            ${foodItem 
              ? 'bg-slate-800 border-emerald-600/30 hover:border-red-500/50 hover:bg-red-900/10 cursor-pointer' 
              : 'bg-slate-950/50 border-slate-800 border-dashed cursor-default'}
          `}
          title={foodItem ? "Click to unequip" : "No food equipped"}
        >
          {foodItem ? (
            <>
              <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                <img src={foodItem.icon} alt={foodItem.name} className="w-8 h-8 pixelated object-contain" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">{foodItem.name}</div>
                <div className="text-[10px] text-emerald-400">Heals {foodItem.healing || 0} HP</div>
              </div>

              <div className="text-lg font-black text-slate-500 group-hover:text-red-400 transition-colors">
                x{equippedFood?.count || 0}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-red-200 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 rounded-lg backdrop-blur-[1px] transition-opacity">
                Unequip
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-600 font-medium w-full text-center py-2">
              No consumable equipped
            </div>
          )}
        </button>

        {/* AUTO-EAT THRESHOLD SLIDER */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Auto-Eat Threshold</span>
            <span className="text-xs font-bold text-emerald-400">{combatSettings.autoEatThreshold}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={combatSettings.autoEatThreshold}
            onChange={handleThresholdChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
        </div>
      </div>

      {/* --- 2. STATS LIST (SIIRRETTY ALAS) --- */}
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Health</span>
          <span className="text-sm font-bold text-emerald-400">{stats.maxHp} HP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Attack Power</span>
          <span className="text-sm font-bold text-red-400">{stats.attackDamage}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Defense</span>
          <span className="text-sm font-bold text-blue-400">{stats.armor}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Attack Speed</span>
          <span className="text-sm font-bold text-yellow-400">{(stats.attackSpeed / 1000).toFixed(1)}s</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Crit Chance</span>
          <span className="text-sm font-bold text-purple-400">{stats.critChance}%</span>
        </div>
      </div>
    </div>
  );
}