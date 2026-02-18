import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';

interface ConsumableItem {
  healing?: number;
  category?: string;
  slot?: string;
}

export default function FoodSelector() {
  const inventory = useGameStore(state => state.inventory);
  const equippedFood = useGameStore(state => state.equippedFood);
  const equipItem = useGameStore(state => state.equipItem);
  const combatSettings = useGameStore(state => state.combatSettings);
  const setState = useGameStore(state => state.setState);

  // Haetaan ja suodatetaan ruokaitemit
  const foodItems = Object.entries(inventory).filter(([id]) => {
    const details = getItemDetails(id);
    const item = details as unknown as ConsumableItem;
    // Tarkistetaan onko item ruokaa (healing > 0, kategoria 'food'/'potion' tai slot 'food')
    return (item?.healing || 0) > 0 || details?.category === 'potion' || details?.slot === 'food';
  });

  const activeFoodDetails = equippedFood ? getItemDetails(equippedFood.itemId) : null;

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      combatSettings: {
        ...state.combatSettings,
        autoEatThreshold: parseInt(e.target.value)
      }
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* ACTIVE FOOD & SETTINGS */}
      <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
         <div className={`w-12 h-12 bg-slate-950 border rounded flex items-center justify-center relative shrink-0 ${activeFoodDetails ? 'border-emerald-500/50' : 'border-slate-800'}`}>
            {activeFoodDetails ? (
                <img src={activeFoodDetails.icon} className="w-8 h-8 pixelated object-contain" alt={activeFoodDetails.name} />
            ) : (
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            )}
            {equippedFood && (
                <span className="absolute -top-2 -right-2 bg-emerald-900 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {equippedFood.count}
                </span>
            )}
         </div>
         <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Auto-Eat</span>
                <span className="text-[9px] text-emerald-400 font-bold">{combatSettings.autoEatThreshold}% HP</span>
            </div>
            <input 
                type="range" 
                min="0" max="100" 
                value={combatSettings.autoEatThreshold}
                onChange={handleSettingChange}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
             />
         </div>
      </div>

      {/* INVENTORY GRID */}
      <div className="overflow-y-auto custom-scrollbar max-h-[150px]">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {foodItems.map(([id, count]) => {
                const item = getItemDetails(id);
                const isEquipped = equippedFood?.itemId === id;
                return (
                    <button 
                        key={id}
                        // Käytä equipItem ilman määrää (se ottaa kaikki tai 1 riippuen toteutuksesta, tässä tapauksessa equipItem siirtää slotin)
                        onClick={() => equipItem(id)}
                        className={`
                            aspect-square bg-slate-900 border rounded flex flex-col items-center justify-center relative group transition-all
                            ${isEquipped ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-600'}
                        `}
                        title={`${item?.name} (Heals ${item?.healing || 0} HP)`}
                    >
                        {item?.icon && <img src={item.icon} className="w-6 h-6 pixelated object-contain" alt={item.name} />}
                        <span className="absolute bottom-0 right-1 text-[9px] text-slate-400 bg-slate-950/80 px-1 rounded">{count as number}</span>
                        
                        {/* Healing indicator overlay */}
                        {(item?.healing || 0) > 0 && (
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                        )}
                    </button>
                )
            })}
            {foodItems.length === 0 && (
                <div className="col-span-full text-[10px] text-slate-600 italic py-2 text-center border border-dashed border-slate-800 rounded">
                    No consumables found.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}