import { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore'; // KORJAUS: Haetaan storesta
import { getItemDetails } from '../data';
import { getEnchantLevel, getEnchantCost, MAX_ENCHANT_LEVEL, getSuccessChance } from '../utils/enchanting';
import { getRarityStyle } from '../utils/rarity';
import type { Resource } from '../types';

// Ei enää propsien kautta funktioita! UI hakee kaiken itse.
export default function EnchantingView() {
  const { inventory, equipment, coins, attemptEnchant } = useGameStore(); // Haetaan storesta

  const [selectedSlot, setSelectedSlot] = useState<keyof typeof equipment | null>('weapon');
  const [selectedScrollId, setSelectedScrollId] = useState<string | null>(null);

  const selectedItemId = selectedSlot ? equipment[selectedSlot] : null;
  const selectedItem = selectedItemId ? getItemDetails(selectedItemId) as Resource : null;
  const currentLevel = selectedItemId ? getEnchantLevel(selectedItemId) : 0;
  const isMaxLevel = currentLevel >= MAX_ENCHANT_LEVEL;
  const nextLevel = currentLevel + 1;
  const cost = selectedItem ? getEnchantCost(nextLevel, selectedItem.value) : 0;
  const canAfford = coins >= cost;

  // 1. Haetaan scrollit ja parsitaan niiden TIER
  const availableScrolls = useMemo(() => {
    return Object.keys(inventory)
      .filter(id => id.startsWith('scroll_enchant_'))
      .map(id => {
        const item = getItemDetails(id);
        const tier = parseInt(id.split('_').pop()?.replace('w', '') || '0');
        return { id, count: inventory[id], name: item?.name, icon: item?.icon, tier };
      })
      .sort((a, b) => b.tier - a.tier);
  }, [inventory]);

  // 2. Lasketaan Chance
  const activeScroll = selectedScrollId ? availableScrolls.find(s => s.id === selectedScrollId) : null;
  const scrollTier = activeScroll?.tier || 0;
  
  const successChance = getSuccessChance(currentLevel, scrollTier);

  // 3. Validointi: Onko scroll valittu?
  const isScrollSelected = selectedScrollId !== null;
  const canEnchant = canAfford && isScrollSelected && !isMaxLevel;

  let chanceColor = 'text-slate-500';
  if (isScrollSelected) {
      if (successChance >= 80) chanceColor = 'text-emerald-400';
      else if (successChance >= 50) chanceColor = 'text-yellow-400';
      else chanceColor = 'text-red-500';
  }

  return (
    <div className="p-6 h-full bg-slate-950 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-8 items-start justify-center">
      
      {/* LEFT SIDE: Loadout */}
      <div className="flex-shrink-0 w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <h2 className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">Active Gear</h2>
              
              <div className="relative h-[420px] w-full flex justify-center items-center select-none">
                  <img src="/assets/ui/character_silhouette.png" className="absolute h-full opacity-5 pointer-events-none" alt="" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2"><EnchantSlot slot="head" itemId={equipment.head} isSelected={selectedSlot === 'head'} onClick={() => setSelectedSlot('head')} /></div>
                  <div className="absolute top-[25%] left-1/2 -translate-x-1/2"><EnchantSlot slot="body" itemId={equipment.body} isSelected={selectedSlot === 'body'} onClick={() => setSelectedSlot('body')} /></div>
                  <div className="absolute top-[50%] left-1/2 -translate-x-1/2"><EnchantSlot slot="legs" itemId={equipment.legs} isSelected={selectedSlot === 'legs'} onClick={() => setSelectedSlot('legs')} /></div>
                  <div className="absolute top-[25%] left-[10%]"><EnchantSlot slot="weapon" itemId={equipment.weapon} isSelected={selectedSlot === 'weapon'} onClick={() => setSelectedSlot('weapon')} /></div>
                  <div className="absolute top-[25%] right-[10%]"><EnchantSlot slot="shield" itemId={equipment.shield} isSelected={selectedSlot === 'shield'} onClick={() => setSelectedSlot('shield')} /></div>
                  <div className="absolute bottom-0 w-full flex justify-center gap-2">
                     <EnchantSlot slot="necklace" itemId={equipment.necklace} isSelected={selectedSlot === 'necklace'} onClick={() => setSelectedSlot('necklace')} />
                     <EnchantSlot slot="ring" itemId={equipment.ring} isSelected={selectedSlot === 'ring'} onClick={() => setSelectedSlot('ring')} />
                     <EnchantSlot slot="rune" itemId={equipment.rune} isSelected={selectedSlot === 'rune'} onClick={() => setSelectedSlot('rune')} />
                  </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-6 italic">Select a slot to enchant equipped item.</p>
          </div>
      </div>

      {/* RIGHT SIDE: Panel */}
      <div className="flex-1 w-full lg:max-w-md bg-slate-900 border border-purple-900/50 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-2xl min-h-[550px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>

        {selectedItem ? (
          <div className="relative z-10 w-full flex flex-col h-full gap-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white tracking-wide">{selectedItem.name}</h3>
              <div className={`text-xs font-bold uppercase tracking-widest ${getRarityStyle(selectedItem.rarity).text}`}>
                Current Level: +{currentLevel}
              </div>
            </div>

            {/* SCROLL SELECTION (PAKOLLINEN) */}
            {!isMaxLevel && (
              <div className={`rounded-lg p-3 border transition-colors ${!isScrollSelected ? 'bg-red-900/10 border-red-500/30 animate-pulse' : 'bg-slate-950/50 border-slate-800'}`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex justify-between items-center">
                  <span className={!isScrollSelected ? 'text-red-400' : ''}>
                    {isScrollSelected ? 'Catalyst Selected' : 'Select a Catalyst (Required)'}
                  </span>
                  {selectedScrollId && <button onClick={() => setSelectedScrollId(null)} className="text-xs text-slate-500 hover:text-white">Clear</button>}
                </div>
                
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 min-h-[80px]">
                  {availableScrolls.length > 0 ? (
                    availableScrolls.map(scroll => (
                      <button
                        key={scroll.id}
                        onClick={() => setSelectedScrollId(selectedScrollId === scroll.id ? null : scroll.id)}
                        className={`
                          flex-shrink-0 w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center relative transition-all group
                          ${selectedScrollId === scroll.id 
                            ? 'bg-purple-900/40 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'}
                        `}
                      >
                         <img src={scroll.icon} className="w-8 h-8 pixelated group-hover:scale-110 transition-transform" alt="" />
                         <span className="text-[10px] font-bold text-emerald-400 mt-1">T{scroll.tier}</span>
                         <span className="absolute -top-1.5 -right-1.5 bg-slate-800 text-[9px] font-bold text-white px-1.5 rounded-full border border-slate-600 shadow-sm z-10">
                            {scroll.count}
                         </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-slate-600 italic w-full text-center py-6">No scrolls in inventory</div>
                  )}
                </div>
              </div>
            )}

            {/* INFO PANEL */}
            {!isMaxLevel && (
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800 space-y-4">
                 <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                    <span className="text-xs text-slate-400 font-bold uppercase">Success Rate</span>
                    <span className={`text-2xl font-black ${chanceColor}`}>{successChance}%</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">Cost</span>
                    <div className="flex items-center gap-2">
                       <img src="/assets/ui/coins.png" className="w-4 h-4" alt="Coins" />
                       <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>{cost.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            {!isMaxLevel && (
              <button
                // KORJAUS: Kutsutaan storen attemptEnchant-funktiota suoraan!
                onClick={() => isScrollSelected && attemptEnchant(selectedItemId!, selectedScrollId!)}
                disabled={!canEnchant}
                className={`w-full py-4 mt-auto rounded-xl font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group
                  ${canEnchant 
                    ? 'bg-purple-700 hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
              >
                {!isScrollSelected ? 'Select Scroll to Enchant' : canAfford ? 'Attempt Enchant' : 'Insufficient Coins'}
              </button>
            )}

            {isMaxLevel && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-amber-500 font-bold text-xl uppercase tracking-widest bg-amber-500/10 px-6 py-3 rounded border border-amber-500/20">Max Level</div>
                </div>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600">
            <p className="text-sm font-bold uppercase">No Item Selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- HELPER: ENCHANT SLOT ---
function EnchantSlot({ slot, itemId, isSelected, onClick }: { slot: string, itemId: string | null, isSelected: boolean, onClick: () => void }) {
  const item = itemId ? getItemDetails(itemId) as Resource : null;
  const rarityStyle = item ? getRarityStyle(item.rarity) : null;
  const enchantLevel = item && itemId ? getEnchantLevel(itemId) : 0;

  const getPlaceholder = (s: string) => {
    switch(s) {
      case 'head': return '/assets/ui/slots/slot_head.png';
      case 'body': return '/assets/ui/slots/slot_body.png';
      case 'legs': return '/assets/ui/slots/slot_legs.png';
      case 'weapon': return '/assets/ui/slots/slot_weapon.png';
      case 'shield': return '/assets/ui/slots/slot_shield.png';
      case 'necklace': return '/assets/ui/slots/slot_necklace.png';
      case 'ring': return '/assets/ui/slots/slot_ring.png';
      case 'rune': return '/assets/ui/slots/slot_rune.png';
      default: return '/assets/ui/slots/slot_default.png';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 relative group
        ${isSelected 
          ? `bg-slate-800 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-110 z-10` 
          : `bg-slate-950 border-2 ${rarityStyle ? rarityStyle.border : 'border-slate-800'} hover:border-slate-600`
        }
      `}
    >
      {item ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/80 rounded-lg"></div>
          <img src={item.icon} className="w-10 h-10 sm:w-12 sm:h-12 pixelated relative z-10 drop-shadow-xl" alt={item.name} />
          {enchantLevel > 0 && (
            <div className={`absolute -top-2 -right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow border border-black/20 z-20
              ${enchantLevel >= MAX_ENCHANT_LEVEL ? 'bg-amber-500' : 'bg-purple-600'}`}>
              +{enchantLevel}
            </div>
          )}
          <div className={`absolute -bottom-6 w-32 text-center text-[9px] bg-black/90 text-white px-2 py-1 rounded border border-slate-700 pointer-events-none transition-opacity
              ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} z-30`}>
              {item.name}
          </div>
        </>
      ) : (
        <img src={getPlaceholder(slot)} className="w-8 h-8 opacity-20 grayscale pixelated" alt="Empty Slot" />
      )}
    </div>
  );
}