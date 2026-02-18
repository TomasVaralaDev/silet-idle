import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';

export default function StatsPanel() {
  const { 
    equipment, 
    equippedFood, 
    skills, 
    unequipItem, 
    combatSettings, 
    setState, 
    combatStats 
  } = useGameStore();

  const stats = useMemo(() => {
    let bonusAttack = 0;
    let bonusDefense = 0;
    let bonusHp = 0;
    let overrideSpeed = null;

    Object.values(equipment).forEach((itemId) => {
      if (!itemId) return;
      const item = getItemDetails(itemId);
      if (!item || !item.stats) return;

      if (item.stats.attack) bonusAttack += item.stats.attack;
      if (item.stats.defense) bonusDefense += item.stats.defense;
      
      const itemStats = item.stats as Record<string, number | undefined>;
      if (itemStats.hp) bonusHp += itemStats.hp;
      
      if (item.slot === 'weapon' && item.interval) {
        overrideSpeed = item.interval;
      }
    });

    const maxHp = 100 + (skills.hitpoints.level * 10) + bonusHp;
    const attackDamage = 1 + skills.attack.level + bonusAttack;
    const armor = skills.defense.level + bonusDefense;
    const attackSpeed = overrideSpeed || 2500;
    const critChance = 1;

    return { maxHp, attackDamage, armor, attackSpeed, critChance };
  }, [equipment, skills]);

  const foodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;

  // --- COOLDOWN LOGIIKKA ---
  const foodTimer = combatStats?.foodTimer || 0;
  const isCooldown = foodTimer > 0;
  
  // Lasketaan kuinka monta prosenttia on KULUNUT (0% -> 100%)
  // Kun peli alkaa (10s), progress on 0%. Kun peli loppuu (0s), progress on 100%.
  const cooldownProgress = Math.max(0, Math.min(100, ((10000 - foodTimer) / 10000) * 100));

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value);
    setState((state) => ({
      combatSettings: {
        ...state.combatSettings,
        autoEatThreshold: newVal
      }
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-inner overflow-hidden">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
        Player Stats
      </h3>

      <div className="mb-4 pb-4 border-b border-slate-800/50 shrink-0">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
          Active Consumable
        </h4>
        
        <button
          onClick={() => !isCooldown && equippedFood && unequipItem('food')}
          disabled={!equippedFood}
          className={`
            w-full p-2 rounded-lg border transition-all flex items-center gap-3 group relative text-left mb-3 overflow-hidden
            ${foodItem 
              ? isCooldown 
                ? 'bg-slate-950 border-slate-800 cursor-not-allowed' 
                : 'bg-slate-800 border-slate-700 hover:border-emerald-500/30 cursor-pointer' 
              : 'bg-slate-950/50 border-slate-800 border-dashed cursor-default'}
          `}
        >
          {foodItem ? (
            <>
              {/* 1. HARMAA POHJA (Kun CD on päällä) */}
              {isCooldown && (
                <div className="absolute inset-0 bg-slate-900 z-0" />
              )}

              {/* 2. SWIPE-EFEKTI (Harmaa kerros joka väistyy oikealle) */}
              {/* Tämä div "pyyhkii" harmaan pois paljastaen vihreän/normaalin taustan alta */}
              {isCooldown && (
                <div 
                  className="absolute inset-0 bg-slate-800/80 z-10 transition-transform duration-100 ease-linear shadow-[5px_0_15px_rgba(0,0,0,0.5)]"
                  style={{ 
                    transform: `translateX(${cooldownProgress}%)`,
                    width: '100%'
                  }}
                />
              )}

              {/* 3. LIIKKUVA VALOVIIVA (Swipeen reuna) */}
              {isCooldown && (
                <div 
                  className="absolute inset-0 w-1 bg-emerald-500/50 shadow-[0_0_10px_#10b981] z-20 transition-transform duration-100 ease-linear"
                  style={{ transform: `translateX(${cooldownProgress}%)` }}
                />
              )}

              {/* IKONI */}
              <div className={`w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 z-30 transition-all ${isCooldown ? 'grayscale opacity-40 scale-90' : ''}`}>
                <img src={foodItem.icon} alt={foodItem.name} className="w-6 h-6 pixelated object-contain" />
              </div>
              
              {/* TEKSTIT */}
              <div className={`flex-1 min-w-0 z-30 transition-all ${isCooldown ? 'opacity-40' : ''}`}>
                <div className="text-xs font-bold text-slate-200 truncate">{foodItem.name}</div>
                <div className="text-[10px] font-medium text-emerald-400">
                  {isCooldown 
                    ? `RECHARGING: ${(foodTimer / 1000).toFixed(1)}s` 
                    : `READY (+${foodItem.healing || 0} HP)`}
                </div>
              </div>

              {/* MÄÄRÄ */}
              <div className={`text-sm font-black z-30 pr-1 transition-colors ${isCooldown ? 'text-slate-700' : 'text-slate-500 group-hover:text-emerald-400'}`}>
                x{equippedFood?.count || 0}
              </div>

              {/* UNEQUIP HOVER */}
              {!isCooldown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-red-400 text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 rounded-lg backdrop-blur-[1px] transition-opacity z-40">
                  Unequip
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-slate-600 font-medium w-full text-center py-1">
              Empty Slot
            </div>
          )}
        </button>

        {/* SLIDER PYSYY SAMANA */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Auto-Eat Threshold</span>
            <span className={`text-xs font-bold ${combatSettings.autoEatThreshold > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
              {combatSettings.autoEatThreshold}% HP
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={combatSettings.autoEatThreshold}
            onChange={handleThresholdChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
        </div>
      </div>

      {/* STATS LIST PYSYY SAMANA */}
      <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Max Health</span>
          <span className="font-bold text-emerald-400">{stats.maxHp} HP</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Attack Power</span>
          <span className="font-bold text-red-400">{stats.attackDamage}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Defense</span>
          <span className="font-bold text-blue-400">{stats.armor}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Attack Speed</span>
          <span className="font-bold text-yellow-400">{(stats.attackSpeed / 1000).toFixed(1)}s</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Crit Chance</span>
          <span className="font-bold text-purple-400">{stats.critChance}%</span>
        </div>
      </div>
    </div>
  );
}