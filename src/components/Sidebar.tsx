import { useState, useRef, useEffect } from 'react';
import type { GameState, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  coins: number;
  skills: GameState['skills'];
  onReset: () => void;
  onLogout: () => void;
  onStopAction: () => void;
  onForceSave: () => void;
}

const NavButton = ({ 
  view, 
  label, 
  iconPath, 
  level, 
  currentView, 
  onClick 
}: { 
  view: ViewType, 
  label: string, 
  iconPath: string, 
  level?: number,
  currentView: ViewType,
  onClick: (view: ViewType) => void
}) => {
  const isActive = currentView === view;
  // Tech/System aesthetic for active state
  let baseStyle = 'hover:bg-slate-800/80 text-slate-400 border border-transparent';
  
  if (isActive) {
     if (['inventory', 'shop', 'gamble', 'achievements'].includes(view)) baseStyle = 'bg-slate-800/90 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-bold';
     else if (view === 'combat') baseStyle = 'bg-red-950/40 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(248,113,113,0.15)] font-bold';
     else baseStyle = 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.15)] font-bold';
  }

  return (
    <button onClick={() => onClick(view)} className={`w-full text-left p-3 rounded flex items-center justify-between transition-all duration-200 mb-1.5 font-mono group ${baseStyle}`}>
      <div className="flex items-center gap-3">
        <img src={iconPath} alt={label} className="w-6 h-6 pixelated opacity-90 group-hover:scale-110 transition-transform" />
        <span className="text-sm uppercase tracking-wider">{label}</span>
      </div>
      {level !== undefined && <span className="text-xs font-bold bg-slate-950 px-2 py-1 rounded text-slate-500 border border-slate-800">Lv.{level}</span>}
    </button>
  );
};

const StatRow = ({ label, level, xp, iconPath, textColor, bgColor }: { label: string, level: number, xp: number, iconPath: string, textColor: string, bgColor: string }) => {
  const nextLevelXp = level * 150;
  const progress = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));

  return (
    <div className="py-2 group cursor-help" title={`${Math.floor(xp)} / ${nextLevelXp} XP`}>
      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
        <div className="flex items-center gap-2">
          <img src={iconPath} alt={label} className="w-5 h-5 pixelated opacity-80" />
          <span className="text-slate-400 uppercase tracking-tight font-bold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
             {progress.toFixed(1)}%
           </span>
           <span className={`font-bold text-sm ${textColor}`}>L.{level}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-950/80 overflow-hidden border border-slate-800/50 rounded-sm">
        <div 
          className={`h-full ${bgColor} opacity-90`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function Sidebar({ currentView, setView, coins, skills, onReset, onLogout, onStopAction, onForceSave }: SidebarProps) {
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [saveCooldown, setSaveCooldown] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    let timer: number;
    if (saveCooldown > 0) {
      timer = window.setInterval(() => {
        setSaveCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [saveCooldown]);

  const handleForceSaveClick = () => {
    if (saveCooldown === 0) {
      onForceSave();
      setSaveCooldown(60);
    }
  };

  const totalLevel = Object.values(skills).reduce((acc, skill) => acc + skill.level, 0);

  return (
    <nav className="w-full md:w-72 bg-slate-950 border-r border-slate-800/50 flex-shrink-0 flex flex-col h-screen z-10 overflow-hidden relative font-sans">
      
      {/* --- HEADER --- */}
      <div className="p-5 border-b border-slate-800/50 bg-slate-950 relative z-20">
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/20 pointer-events-none opacity-20" style={{backgroundSize: '100% 4px'}}></div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-slate-200 tracking-widest uppercase flex flex-col leading-none">
              Time<span className="text-cyan-500 text-3xl">Ring</span>
            </h1>
            <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase mt-1">System v1.0</span>
          </div>

          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-slate-900 p-2 rounded border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">Restorer</div>
                <div className="text-[10px] text-cyan-500 font-mono leading-none mt-1">SYNC: {totalLevel}</div>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded border border-slate-700 flex items-center justify-center relative overflow-hidden">
                 <img src="/assets/ui/avatar.png" alt="Restorer" className="w-full h-full object-cover pixelated opacity-90 hover:opacity-100" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-1 flex flex-col gap-0.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs text-slate-400 uppercase">Unit ID: Mitsiio</p>
                  <p className="text-xs text-cyan-500 font-mono">Status: Active</p>
                </div>
                
                <button onClick={() => alert("Profile View Coming Soon")} className="w-full py-3 px-3 hover:bg-slate-800 text-slate-300 text-xs uppercase tracking-wider text-left flex items-center gap-2">
                  <span className="text-cyan-500">👤</span> Access Profile
                </button>
                
                <button onClick={() => alert("Settings Coming Soon")} className="w-full py-3 px-3 hover:bg-slate-800 text-slate-300 text-xs uppercase tracking-wider text-left flex items-center gap-2">
                  <span className="text-amber-500">⚙️</span> System Config
                </button>

                <div className="h-px bg-slate-800 my-0.5"></div>
                
                <button onClick={onLogout} className="w-full py-3 px-3 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-xs uppercase tracking-wider text-left flex items-center gap-2">
                  <span>🚪</span> Terminate Session
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 border-l-4 border-l-amber-600/50 border-y border-r border-slate-800/50 flex items-center justify-between relative z-0">
          <div className="flex items-center gap-3">
            <img src="/assets/ui/coins.png" className="w-5 h-5 pixelated opacity-90" alt="Memory" />
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Memory Fragments</span>
          </div>
          <span className="font-mono text-base font-bold text-amber-500">{coins.toLocaleString()}</span>
        </div>
      </div>
      
      {/* --- NAVIGATION --- */}
      <div className="p-4 space-y-8 overflow-y-auto flex-1 custom-scrollbar relative z-10">
        
        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase px-2 mb-3 tracking-[0.2em] border-b border-slate-800/50 pb-1">Core Systems</p>
          <NavButton view="inventory" label="Fragment Storage" iconPath="/assets/ui/icon_inventory.png" currentView={currentView} onClick={setView} />
          <NavButton view="shop" label="Requisition" iconPath="/assets/ui/icon_shop.png" currentView={currentView} onClick={setView} />
          <NavButton view="achievements" label="Milestones" iconPath="/assets/ui/icon_achievements.png" currentView={currentView} onClick={setView} />
          <NavButton view="gamble" label="Entropy" iconPath="/assets/ui/icon_casino.png" currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase px-2 mb-3 tracking-[0.2em] border-b border-slate-800/50 pb-1">Restoration Protocols</p>
          <NavButton view="woodcutting" label="Excavation" iconPath="/assets/skills/woodcutting.png" level={skills.woodcutting.level} currentView={currentView} onClick={setView} />
          <NavButton view="mining" label="Salvaging" iconPath="/assets/skills/mining.png" level={skills.mining.level} currentView={currentView} onClick={setView} />
          <NavButton view="fishing" label="Gathering" iconPath="/assets/skills/fishing.png" level={skills.fishing.level} currentView={currentView} onClick={setView} />
          <NavButton view="farming" label="Cultivation" iconPath="/assets/skills/farming.png" level={skills.farming.level} currentView={currentView} onClick={setView} />
          
          <NavButton view="smithing" label="Foundry" iconPath="/assets/skills/crafting.png" level={skills.smithing.level} currentView={currentView} onClick={setView} />
          <NavButton view="crafting" label="Assembly" iconPath="/assets/skills/crafting.png" level={skills.crafting.level} currentView={currentView} onClick={setView} />
          
          <NavButton view="cooking" label="Refining" iconPath="/assets/skills/cooking.png" level={skills.cooking.level} currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase px-2 mb-3 tracking-[0.2em] border-b border-slate-800/50 pb-1">Stabilization</p>
          <NavButton view="combat" label="Stabilize Zone" iconPath="/assets/skills/combat.png" currentView={currentView} onClick={setView} />
          
          <div className="bg-slate-900/30 p-3 border border-slate-800/50 mt-4 rounded">
            <p className="text-[9px] text-slate-500 uppercase mb-3 text-center tracking-widest font-bold">Unit Metrics</p>
            <div className="space-y-1">
              <StatRow label="Integrity" level={skills.hitpoints.level} xp={skills.hitpoints.xp} iconPath="/assets/skills/hitpoints.png" textColor="text-red-400" bgColor="bg-red-900" />
              <StatRow label="Force" level={skills.attack.level} xp={skills.attack.xp} iconPath="/assets/skills/attack.png" textColor="text-orange-400" bgColor="bg-orange-900" />
              <StatRow label="Shielding" level={skills.defense.level} xp={skills.defense.xp} iconPath="/assets/skills/defense.png" textColor="text-cyan-400" bgColor="bg-cyan-900" />
              <StatRow label="Melee Sys" level={skills.melee.level} xp={skills.melee.xp} iconPath="/assets/skills/melee.png" textColor="text-slate-400" bgColor="bg-slate-700" />
              <StatRow label="Ranged Sys" level={skills.ranged.level} xp={skills.ranged.xp} iconPath="/assets/skills/ranged.png" textColor="text-emerald-400" bgColor="bg-emerald-900" />
              <StatRow label="Magic Sys" level={skills.magic.level} xp={skills.magic.xp} iconPath="/assets/skills/magic.png" textColor="text-blue-400" bgColor="bg-blue-900" />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-950/50 relative z-20">
        <button onClick={onStopAction} className="w-full py-3 text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 border border-amber-900/30 hover:bg-amber-900/10 mb-3 transition-colors rounded-sm">
           Halt Process
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onReset} 
            className="py-3 text-[10px] font-bold uppercase tracking-wider text-red-500/70 hover:text-red-400 border border-red-900/20 hover:bg-red-900/10 transition-colors rounded-sm"
          >
            Reboot
          </button>

          <button 
            onClick={handleForceSaveClick} 
            disabled={saveCooldown > 0}
            className={`py-3 text-[10px] font-bold uppercase tracking-wider border transition-colors rounded-sm flex items-center justify-center
              ${saveCooldown > 0 
                ? 'text-slate-600 border-slate-800 bg-slate-900 cursor-not-allowed' 
                : 'text-emerald-500/70 hover:text-emerald-400 border-emerald-900/20 hover:bg-emerald-900/10'
              }`}
          >
            {saveCooldown > 0 ? (
              <span className="font-mono">{saveCooldown}s</span>
            ) : (
              "Cloud Save"
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500 italic leading-tight">
            "The world didn't need a hero.<br/>It needed a Restorer."
          </p>
        </div>
      </div>
    </nav>
  );
}