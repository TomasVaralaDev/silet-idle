import { useState } from 'react';
import { getItemDetails } from '../data';
import { getEnchantLevel, getNextEnchantId, getEnchantCost, MAX_ENCHANT_LEVEL } from '../utils/enchanting';
import { getRarityStyle } from '../utils/rarity';
import type { GameState, Resource } from '../types'; // Poistettu EquipmentSlot

interface EnchantingViewProps {
  inventory: GameState['inventory']; // Pidetään tyypeissä yhteensopivuuden vuoksi
  equipment: GameState['equipment'];
  coins: number;
  onEnchant: (originalId: string, newId: string, cost: number) => void;
}

export default function EnchantingView({ equipment, coins, onEnchant }: EnchantingViewProps) {
  
  // Tila hyväksyy vain equipment-objektin avaimet (head, body, weapon jne.)
  const [selectedSlot, setSelectedSlot] = useState<keyof GameState['equipment'] | null>('weapon');

  // Haetaan itemi valitusta slotista
  const selectedItemId = selectedSlot ? equipment[selectedSlot] : null;
  const selectedItem = selectedItemId ? getItemDetails(selectedItemId) as Resource : null;

  const currentLevel = selectedItemId ? getEnchantLevel(selectedItemId) : 0;
  const isMaxLevel = currentLevel >= MAX_ENCHANT_LEVEL;
  const nextLevel = currentLevel + 1;
  
  // Lasketaan hinta
  const cost = selectedItem ? getEnchantCost(nextLevel, selectedItem.value) : 0;
  const canAfford = coins >= cost;

  // Ennustetaan seuraavan tason statit
  const nextItemPreview = (selectedItem && !isMaxLevel)
    ? getItemDetails(getNextEnchantId(selectedItemId!)) as Resource 
    : null;

  return (
    <div className="p-6 h-full bg-slate-950 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-8 items-start justify-center">
      
      {/* --- LEFT: ACTIVE LOADOUT DOLL --- */}
      <div className="flex-shrink-0 w-full max-w-md mx-auto lg:mx-0">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          
          <h2 className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">Active Gear</h2>

          {/* CHARACTER SILHOUETTE LAYOUT */}
          <div className="relative h-[420px] w-full flex justify-center items-center select-none">
             {/* Taustakuva/Siluetti */}
             <img src="/assets/ui/character_silhouette.png" className="absolute h-full opacity-5 pointer-events-none" alt="" />

             {/* HEAD */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2">
               <EnchantSlot slot="head" itemId={equipment.head} isSelected={selectedSlot === 'head'} onClick={() => setSelectedSlot('head')} />
             </div>

             {/* BODY */}
             <div className="absolute top-[25%] left-1/2 -translate-x-1/2">
               <EnchantSlot slot="body" itemId={equipment.body} isSelected={selectedSlot === 'body'} onClick={() => setSelectedSlot('body')} />
             </div>

             {/* LEGS */}
             <div className="absolute top-[50%] left-1/2 -translate-x-1/2">
               <EnchantSlot slot="legs" itemId={equipment.legs} isSelected={selectedSlot === 'legs'} onClick={() => setSelectedSlot('legs')} />
             </div>

             {/* WEAPON (Left Side) */}
             <div className="absolute top-[25%] left-[10%]">
               <EnchantSlot slot="weapon" itemId={equipment.weapon} isSelected={selectedSlot === 'weapon'} onClick={() => setSelectedSlot('weapon')} />
             </div>

             {/* SHIELD (Right Side) */}
             <div className="absolute top-[25%] right-[10%]">
               <EnchantSlot slot="shield" itemId={equipment.shield} isSelected={selectedSlot === 'shield'} onClick={() => setSelectedSlot('shield')} />
             </div>

             {/* JEWELRY ROW (Bottom) */}
             <div className="absolute bottom-0 w-full flex justify-center gap-2">
               <EnchantSlot slot="necklace" itemId={equipment.necklace} isSelected={selectedSlot === 'necklace'} onClick={() => setSelectedSlot('necklace')} />
               <EnchantSlot slot="ring" itemId={equipment.ring} isSelected={selectedSlot === 'ring'} onClick={() => setSelectedSlot('ring')} />
               <EnchantSlot slot="rune" itemId={equipment.rune} isSelected={selectedSlot === 'rune'} onClick={() => setSelectedSlot('rune')} />
             </div>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-6 italic">Select a slot to enchant equipped item.</p>
        </div>
      </div>

      {/* --- RIGHT: ENCHANTING PANEL --- */}
      <div className="flex-1 w-full lg:max-w-md bg-slate-900 border border-purple-900/50 rounded-xl p-6 flex flex-col items-center relative overflow-hidden shadow-2xl min-h-[450px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
        
        {selectedItem ? (
          <div className="relative z-10 w-full flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white tracking-wide">{selectedItem.name}</h3>
              <div className={`text-xs font-bold uppercase tracking-widest ${getRarityStyle(selectedItem.rarity).text}`}>
                {selectedItem.rarity || 'Common'} {selectedItem.category}
              </div>
            </div>
            
            {/* COMPARISON */}
            <div className="flex items-center justify-center gap-6 mb-8">
              {/* CURRENT */}
              <div className="flex flex-col items-center group">
                <div className={`w-20 h-20 bg-slate-950 border-2 ${getRarityStyle(selectedItem.rarity).border} rounded-xl flex items-center justify-center mb-3 shadow-lg relative`}>
                  <img src={selectedItem.icon} className="w-12 h-12 pixelated scale-110" alt="Current Item" />
                  <span className="absolute -top-3 bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">Current</span>
                </div>
                <div className="text-lg font-bold text-white">+{currentLevel}</div>
              </div>

              {!isMaxLevel && nextItemPreview && (
                <>
                  <div className="flex flex-col items-center animate-pulse">
                    <span className="text-purple-500 text-3xl">»</span>
                  </div>

                  {/* NEXT */}
                  <div className="flex flex-col items-center">
                    <div className={`w-20 h-20 bg-slate-950 border-2 ${getRarityStyle(nextItemPreview.rarity).border} rounded-xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] relative`}>
                      <div className="absolute inset-0 bg-purple-500/10 rounded-xl animate-pulse"></div>
                      <img src={nextItemPreview.icon} className="w-12 h-12 pixelated scale-110" alt="Next Item" />
                      <span className="absolute -top-3 bg-purple-900 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-700">Next</span>
                    </div>
                    <div className="text-lg font-bold text-purple-400">+{nextLevel}</div>
                  </div>
                </>
              )}
            </div>

            {/* STAT CHANGES */}
            {!isMaxLevel && nextItemPreview ? (
              <div className="w-full bg-slate-950/80 rounded-xl p-4 mb-6 border border-slate-800 backdrop-blur-sm">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 border-b border-slate-800 pb-1">Stat Improvements</h4>
                
                {selectedItem.stats?.attack && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-xs font-bold">Attack Power</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-mono">{selectedItem.stats.attack}</span>
                      <span className="text-slate-600">➜</span>
                      <span className="text-green-400 font-mono font-bold">{nextItemPreview.stats?.attack}</span>
                      <span className="text-[10px] text-green-600 ml-1">(+10%)</span>
                    </div>
                  </div>
                )}
                
                {selectedItem.stats?.defense && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-bold">Defense</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-mono">{selectedItem.stats.defense}</span>
                      <span className="text-slate-600">➜</span>
                      <span className="text-green-400 font-mono font-bold">{nextItemPreview.stats?.defense}</span>
                      <span className="text-[10px] text-green-600 ml-1">(+10%)</span>
                    </div>
                  </div>
                )}
              </div>
            ) : isMaxLevel && (
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="text-amber-500 font-bold text-xl uppercase tracking-widest border-y-2 border-amber-500/50 py-2 w-full text-center bg-amber-500/10">
                  Maximum Level
                </div>
              </div>
            )}

            {/* COST & BUTTON */}
            <div className="mt-auto w-full">
              {!isMaxLevel && (
                <>
                  <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-slate-800 mb-3">
                    <span className="text-xs text-slate-400 font-bold uppercase">Enchant Cost</span>
                    <div className="flex items-center gap-2">
                      <img src="/assets/ui/coins.png" className="w-4 h-4 pixelated" alt="Coins" />
                      <span className={`font-mono font-bold ${canAfford ? 'text-yellow-400' : 'text-red-500'}`}>{cost.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onEnchant(selectedItemId!, getNextEnchantId(selectedItemId!), cost)}
                    disabled={!canAfford}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group
                      ${canAfford 
                        ? 'bg-purple-700 hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                  >
                    {canAfford && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>✨</span> Enchant to +{nextLevel}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 z-10">
            <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center mb-4">
              <span className="text-4xl opacity-50">⚒️</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-wider">No Item Selected</p>
            <p className="text-xs mt-2 text-center max-w-[200px]">Click a gear slot on the left to begin the enchanting process.</p>
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
          {/* Item Icon */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/80 rounded-lg"></div>
          <img src={item.icon} className="w-10 h-10 sm:w-12 sm:h-12 pixelated relative z-10 drop-shadow-xl" alt={item.name} />
          
          {/* Enchant Level Badge */}
          {enchantLevel > 0 && (
            <div className={`absolute -top-2 -right-2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow border border-black/20 z-20
              ${enchantLevel >= MAX_ENCHANT_LEVEL ? 'bg-amber-500' : 'bg-purple-600'}`}>
              +{enchantLevel}
            </div>
          )}
          
          {/* Name Tooltip (visible on selected/hover) */}
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