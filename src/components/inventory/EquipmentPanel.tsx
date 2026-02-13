import { useGameStore } from '../../store/useGameStore';
import { getItemDetails } from '../../data';
import type { EquipmentSlot } from '../../types';

export default function EquipmentPanel() {
  const equipment = useGameStore(state => state.equipment);
  const unequipItem = useGameStore(state => state.unequipItem);

  // Apufunktio yksittäisen slotin renderöintiin (DRY periaate)
  // KORJAUS: Rajataan 'food' pois tyypistä, jotta TS ei valita record-indeksoinnista
  const renderSlot = (slot: Exclude<EquipmentSlot, 'food'>, isSmall: boolean = false) => {
    const itemId = equipment[slot];
    const item = itemId ? getItemDetails(itemId) : null;

    // Dynaamiset koot riippuen onko kyseessä päävaruste vai lisävaruste
    const containerSize = isSmall ? 'w-14 h-14' : 'w-24 h-24'; // Armor isompi, accessory pienempi
    const iconSize = isSmall ? 'w-8 h-8' : 'w-12 h-12';
    const textSize = isSmall ? 'text-[8px]' : 'text-[10px]';

    return (
      <div 
        onClick={() => item && unequipItem(slot)}
        className={`
          ${containerSize}
          rounded-xl border flex items-center justify-center relative transition-all shadow-sm
          ${item 
            ? 'bg-slate-800 border-slate-600 hover:border-red-500 hover:bg-red-900/20 cursor-pointer shadow-black/40' 
            : 'bg-slate-950/50 border-slate-800/60 border-dashed'
          }
        `}
        title={item ? `Unequip ${item.name}` : `Empty ${slot} slot`}
      >
        {/* Slot label jos tyhjä */}
        {!item && (
          <span className={`${textSize} text-slate-700 uppercase font-black text-center leading-none select-none tracking-wider`}>
            {slot}
          </span>
        )}

        {/* Item icon */}
        {item && (
          <img src={item.icon} alt={item.name} className={`${iconSize} pixelated drop-shadow-lg`} />
        )}

        {/* Rarity border bottom */}
        {item && (
          <div className={`absolute bottom-0 inset-x-0 h-1 rounded-b-xl opacity-80 ${
            item.rarity === 'legendary' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
            item.rarity === 'rare' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' :
            item.rarity === 'uncommon' ? 'bg-emerald-500' : 'bg-slate-500'
          }`} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center shadow-inner">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-left border-b border-slate-800 pb-2">
        Active Loadout
      </h3>
      
      {/* PÄÄVARUSTEET (Iso Ristikko) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Rivi 1: Tyhjä - Head - Tyhjä */}
        <div /> 
        {renderSlot('head')}
        <div />

        {/* Rivi 2: Weapon - Body - Shield */}
        {renderSlot('weapon')}
        {renderSlot('body')}
        {renderSlot('shield')}

        {/* Rivi 3: Tyhjä - Legs - Tyhjä */}
        <div />
        {renderSlot('legs')}
        <div />
      </div>

      {/* ALARIVI: ACCESSORIES (Pienemmät, 4 vierekkäin) */}
      <div className="w-full bg-slate-950/30 rounded-xl p-4 border border-slate-800/50">
        <div className="flex justify-center gap-3">
          {renderSlot('necklace', true)}
          {renderSlot('ring', true)}
          {renderSlot('rune', true)}
          {renderSlot('skill', true)} 
        </div>
      </div>
    </div>
  );
}