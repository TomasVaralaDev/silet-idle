import { useGameStore } from '../store/useGameStore';
import { getItemDetails } from '../data';
import type { Rarity } from '../types';

export default function RewardModal() {
  const { rewardModal, closeRewardModal } = useGameStore();
  const { isOpen, title, rewards } = rewardModal || { isOpen: false, rewards: [] };

  if (!isOpen) return null;

  const getRarityColor = (rarity: Rarity | undefined) => {
    switch (rarity) {
      case 'legendary': return 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'epic': return 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'rare': return 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'uncommon': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
      default: return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={closeRewardModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 text-center border-b border-slate-800">
          
          {/* UUSI KUVAKE */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              {/* Taustahehku */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
              
              {/* Itse kuva */}
              <img 
                src="/assets/ui/icon_reward.png" 
                alt="Reward" 
                className="w-16 h-16 object-contain pixelated relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                onError={(e) => {
                   // Fallback: Jos kuvaa ei löydy, piilotetaan se ja näytetään emoji
                   e.currentTarget.style.display = 'none';
                   const parent = e.currentTarget.parentElement;
                   if (parent) parent.innerHTML = '<span class="text-4xl"></span>';
                }}
              />
            </div>
          </div>

          <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 drop-shadow-md">
            {title}
          </h2>
        </div>

        {/* Rewards Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-3">
            {rewards.map((reward, index) => {
              const item = getItemDetails(reward.itemId);
              const rarityStyle = getRarityColor(item?.rarity);
              
              return (
                <div 
                  key={`${reward.itemId}-${index}`}
                  className={`flex items-center gap-4 p-3 rounded-xl border ${rarityStyle} transition-transform hover:scale-[1.02]`}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-slate-950 rounded-lg border border-black/20 flex items-center justify-center shrink-0 relative overflow-hidden">
                    {item?.icon ? (
                      <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain pixelated" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">
                      {item?.name || reward.itemId}
                    </div>
                    <div className="text-xs opacity-70 uppercase font-mono tracking-wide">
                      {item?.rarity || 'Common'} Resource
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-lg font-mono font-bold">
                    +{reward.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <button 
            onClick={closeRewardModal}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
          >
            Collect Rewards
          </button>
        </div>
      </div>
    </div>
  );
}