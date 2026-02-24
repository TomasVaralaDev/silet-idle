import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';
import { getPlayerStats } from '../../utils/combatMechanics';
import { formatNumber } from '../../utils/formatUtils';
import type { CombatStyle, Resource } from '../../types';

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

  // 1. LASKETAAN STATSIT SYNROSSA COMBAT MOOTTORIN KANSSA
  const playerCombatStats = useMemo(() => {
    // Lasketaan varusteiden yhteissummat
    const gearTotals = Object.values(equipment).reduce((acc, itemId) => {
      if (!itemId) return acc;
      const item = getItemDetails(itemId) as Resource;
      if (item?.stats) {
        acc.damage += (item.stats.attack || 0);
        acc.armor += (item.stats.defense || 0);
        // Huomioidaan myös mahdollinen bonus HP esineistä
        const itemStats = item.stats as Record<string, number | undefined>;
        acc.hp += (itemStats.hp || 0);
      }
      return acc;
    }, { damage: 0, armor: 0, hp: 0 });

    // Määritetään taistelutyyli aseen mukaan
    const weaponItem = equipment.weapon ? getItemDetails(equipment.weapon) as Resource : null;
    const style: CombatStyle = weaponItem?.combatStyle || 'melee';

    // Haetaan viralliset statsit moottorista
    const baseStats = getPlayerStats(skills, style, { 
      damage: gearTotals.damage, 
      armor: gearTotals.armor 
    });

    // Lisätään varusteista tullut HP (moottori laskee vain skillistä)
    const finalMaxHp = baseStats.maxHp + gearTotals.hp;

    // Lasketaan Max Hit (BaseHit kaava combatMechanicsista)
    const maxHit = (baseStats.weaponBase + (0.5 * baseStats.mainStat)) * (1 + baseStats.bonusDamage);

    return {
      ...baseStats,
      maxHp: finalMaxHp,
      maxHit: Math.floor(maxHit),
      minHit: Math.floor(maxHit * 0.5), // 50% varianssi
      style
    };
  }, [equipment, skills]);

  const foodItem = equippedFood ? getItemDetails(equippedFood.itemId) : null;
  const foodTimer = combatStats?.foodTimer || 0;
  const isCooldown = foodTimer > 0;
  const cooldownProgress = Math.max(0, Math.min(100, ((10000 - foodTimer) / 10000) * 100));

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value);
    setState((state) => ({
      combatSettings: { ...state.combatSettings, autoEatThreshold: newVal }
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col shadow-2xl overflow-hidden">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-800 pb-2 flex justify-between">
        Combat Readiness
        <span className="text-cyan-500">v2.0</span>
      </h3>

      {/* CONSUMABLE SECTION */}
      <div className="mb-6 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
        <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Auto-Recovery System
        </h4>
        
        <button
          onClick={() => !isCooldown && equippedFood && unequipItem('food')}
          disabled={!equippedFood}
          className={`
            w-full p-2 rounded-lg border transition-all flex items-center gap-3 group relative text-left mb-4 overflow-hidden
            ${foodItem 
              ? isCooldown 
                ? 'bg-slate-950 border-slate-800 cursor-not-allowed' 
                : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 cursor-pointer' 
              : 'bg-slate-950/30 border-slate-800 border-dashed cursor-default'}
          `}
        >
          {foodItem ? (
            <>
              {isCooldown && <div className="absolute inset-0 bg-slate-900/40 z-0" />}
              {isCooldown && (
                <div 
                  className="absolute inset-0 bg-slate-800/90 z-10 transition-transform duration-100 ease-linear"
                  style={{ transform: `translateX(${cooldownProgress}%)`, width: '100%' }}
                />
              )}
              <div className={`w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 z-30 ${isCooldown ? 'grayscale opacity-40' : ''}`}>
                <img src={foodItem.icon} alt={foodItem.name} className="w-6 h-6 pixelated object-contain" />
              </div>
              <div className={`flex-1 min-w-0 z-30 ${isCooldown ? 'opacity-40' : ''}`}>
                <div className="text-[11px] font-bold text-slate-200 truncate">{foodItem.name}</div>
                <div className="text-[9px] font-medium text-emerald-400">
                  {isCooldown ? `REBOOTING...` : `HEALS ${foodItem.healing} HP`}
                </div>
              </div>
              <div className="text-xs font-black z-30 pr-1 text-slate-500">x{equippedFood?.count}</div>
              {!isCooldown && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 text-red-400 text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity z-40 backdrop-blur-[1px]">
                  Remove
                </div>
              )}
            </>
          ) : (
            <div className="text-[10px] text-slate-700 font-bold w-full text-center py-1 uppercase tracking-tighter">No Food Equipped</div>
          )}
        </button>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] uppercase font-bold text-slate-500">Threshold</span>
            <span className="text-[10px] font-mono font-bold text-emerald-500">{combatSettings.autoEatThreshold}%</span>
          </div>
          <input
            type="range" min="0" max="90" step="5"
            value={combatSettings.autoEatThreshold}
            onChange={handleThresholdChange}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* HP */}
        <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-red-500">❤️</span> Vitality
          </div>
          <div className="text-sm font-mono font-bold text-slate-200">
            {formatNumber(playerCombatStats.maxHp)} <span className="text-[10px] text-slate-500 font-normal">HP</span>
          </div>
        </div>

        {/* Defense */}
        <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-blue-500">🛡️</span> Armor
          </div>
          <div className="text-sm font-mono font-bold text-slate-200">
            {formatNumber(playerCombatStats.armor)}
          </div>
        </div>

        {/* Damage */}
        <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-orange-500">⚔️</span> Damage
          </div>
          <div className="text-sm font-mono font-bold text-slate-200">
            {playerCombatStats.minHit}-{playerCombatStats.maxHit}
          </div>
        </div>

        {/* Crit */}
        <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
            <span className="text-purple-500">🎯</span> Precision
          </div>
          <div className="text-sm font-mono font-bold text-slate-200">
            {(playerCombatStats.critChance * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* EXTRA INFO AREA */}
      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center opacity-60">
        <div className="text-[9px] uppercase font-black text-slate-500">Style: <span className="text-cyan-500">{playerCombatStats.style}</span></div>
        <div className="text-[9px] uppercase font-black text-slate-500">Speed: <span className="text-yellow-500">{playerCombatStats.attackSpeed.toFixed(1)}s</span></div>
      </div>
    </div>
  );
}