import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';

// Määritellään paikallinen tyyppi, jotta vältetään import-virheet
interface FoodItemDisplay {
  id: string;
  name: string;
  icon: string;
  healing?: number;
  category?: string;
  count: number;
}

export default function FoodSelector() {
  const inventory = useGameStore(state => state.inventory);
  const equippedFood = useGameStore(state => state.equippedFood);
  const equipFood = useGameStore(state => state.equipFood);

  // Etsitään ruoat ja yhdistetään niihin repun määrät
  const foodItems = Object.entries(inventory)
    .map(([id, count]) => {
      const details = getItemDetails(id);
      if (!details || (details.category !== 'Food' && !details.healing)) return null;
      return { ...details, id, count } as FoodItemDisplay;
    })
    .filter((i): i is FoodItemDisplay => i !== null);

  const activeFoodDetails = equippedFood ? getItemDetails(equippedFood.itemId) : null;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Otsikko */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Consumables</h3>
        <span className="text-[9px] text-slate-600 font-mono uppercase">Slot 1/1</span>
      </div>
      
      {/* ACTIVE SLOT - Isompi ja selkeämpi bar */}
      <div className="flex items-center gap-4 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl">
        <div className={`w-14 h-14 rounded-lg border flex items-center justify-center shrink-0 ${activeFoodDetails ? 'border-emerald-500/50 bg-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'border-slate-800 border-dashed opacity-30'}`}>
           {activeFoodDetails ? (
             <img src={activeFoodDetails.icon} alt={activeFoodDetails.name} className="w-10 h-10 pixelated" />
           ) : (
             <div className="w-4 h-4 rounded-full bg-slate-800" />
           )}
        </div>
        <div className="flex-1 min-w-0">
           <div className="text-xs font-black text-slate-100 truncate uppercase tracking-tight">
             {activeFoodDetails ? activeFoodDetails.name : 'No Food Equipped'}
           </div>
           {activeFoodDetails && (
             <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+{activeFoodDetails.healing} HP per use</div>
           )}
        </div>
        {equippedFood && (
          <div className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20">
            x{equippedFood.count}
          </div>
        )}
      </div>

      {/* QUICK SELECT GRID - Kasvatettu ikonikoko (w-12) */}
      <div className="flex flex-wrap gap-2 mt-2 content-start">
        {foodItems.map(food => (
          <button
            key={food.id}
            onClick={() => equipFood(food.id, food.count)}
            className={`
              relative w-12 h-12 rounded-lg bg-slate-950 border transition-all flex items-center justify-center group
              ${equippedFood?.itemId === food.id 
                ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20' 
                : 'border-slate-800 hover:border-slate-500 hover:bg-slate-900'
              }
            `}
            title={`${food.name} (+${food.healing} HP)`}
          >
            <img src={food.icon} className="w-9 h-9 pixelated transition-transform group-hover:scale-110" />
            
            {/* Määrä-badge alareunassa */}
            <span className="absolute -bottom-1.5 -right-1.5 text-[8px] font-mono font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 shadow-xl z-10">
              {food.count}
            </span>
          </button>
        ))}
        
        {foodItems.length === 0 && (
          <div className="w-full text-[10px] text-slate-700 italic py-4 px-2 border border-dashed border-slate-800/40 rounded-lg text-center">
            Your inventory has no food...
          </div>
        )}
      </div>
    </div>
  );
}