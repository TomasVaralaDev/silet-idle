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
}

const NavButton = ({ 
  view, 
  label, 
  icon, 
  level, 
  currentView, 
  onClick 
}: { 
  view: ViewType, 
  label: string, 
  icon: string, 
  level?: number,
  currentView: ViewType,
  onClick: (view: ViewType) => void
}) => {
  const isActive = currentView === view;
  let baseStyle = 'hover:bg-slate-800 text-slate-400';
  
  if (isActive) {
     if (view === 'inventory') baseStyle = 'bg-violet-600/20 text-violet-300 border border-violet-500/50';
     else if (view === 'shop') baseStyle = 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/50';
     else if (view === 'gamble') baseStyle = 'bg-pink-600/20 text-pink-300 border border-pink-500/50';
     else if (view === 'achievements') baseStyle = 'bg-yellow-900/20 text-yellow-200 border border-yellow-500/50';
     else if (view === 'combat') baseStyle = 'bg-red-900/20 text-red-300 border border-red-500/50';
     else if (view === 'cooking') baseStyle = 'bg-orange-600/20 text-orange-300 border border-orange-500/50';
     else baseStyle = 'bg-slate-700 text-white border border-slate-600';
  }

  return (
    <button onClick={() => onClick(view)} className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors mb-1 ${baseStyle}`}>
      <div className="flex items-center gap-3"><span className="text-lg">{icon}</span><span className="font-medium text-sm">{label}</span></div>
      {level !== undefined && <span className="text-[10px] font-bold bg-slate-950 px-1.5 py-0.5 rounded text-slate-500">Lv {level}</span>}
    </button>
  );
};

const StatRow = ({ label, level, xp, icon, textColor, bgColor }: { label: string, level: number, xp: number, icon: string, textColor: string, bgColor: string }) => {
  const nextLevelXp = level * 150;
  const progress = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));

  return (
    <div className="py-1.5 group cursor-help" title={`${Math.floor(xp)} / ${nextLevelXp} XP`}>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <div className="flex items-center gap-2">
          <span className="w-3 text-center">{icon}</span>
          <span className="text-slate-400 font-bold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
             {progress.toFixed(1)}%
           </span>
           <span className={`font-mono font-bold ${textColor}`}>Lv {level}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative shadow-inner">
        <div 
          className={`h-full ${bgColor} transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function Sidebar({ currentView, setView, coins, skills, onReset, onLogout, onStopAction }: SidebarProps) {
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const totalLevel = Object.values(skills).reduce((acc, skill) => acc + skill.level, 0);

  return (
    <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen z-10 overflow-hidden relative">
      
      {/* --- COMPACT HEADER (LOGO + PROFILE) --- */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/30">
        
        <div className="flex justify-between items-center mb-3">
          {/* LOGO */}
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black italic text-emerald-500 tracking-tighter leading-none">
              GGEZ <span className="text-slate-600 font-light">IDLE</span>
            </h1>
          </div>

          {/* PROFILE BUTTON (Right Side) */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:bg-slate-800 p-1 rounded-lg transition-all border border-transparent hover:border-slate-700"
            >
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-slate-300 leading-none">Mitsiio</div>
                <div className="text-[9px] text-yellow-600 font-mono leading-none mt-0.5">TL: {totalLevel}</div>
              </div>
              
              {/* Small Avatar */}
              <div className="w-8 h-8 bg-indigo-600 rounded-md border border-slate-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 <span className="text-sm">😎</span>
              </div>
            </button>

            {/* DROPDOWN MENU */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="px-2 py-1.5 border-b border-slate-700 mb-1">
                  <p className="text-xs font-bold text-white">Mitsiio</p>
                  <p className="text-[10px] text-slate-400">Total Level: {totalLevel}</p>
                </div>
                
                <button onClick={() => alert("Profile Coming Soon")} className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors text-left">
                  <span>👤</span> View Profile
                </button>
                <button onClick={() => alert("Settings Coming Soon")} className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors text-left">
                  <span>⚙️</span> Settings
                </button>
                <button onClick={() => alert("Char Switch Coming Soon")} className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors text-left">
                  <span>👥</span> Characters
                </button>
                
                <div className="h-px bg-slate-700 my-0.5"></div>
                
                <button onClick={onLogout} className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded text-xs font-medium transition-colors text-left">
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WALLET BAR */}
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-xs">💰</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Coins</span>
          </div>
          <span className="font-mono text-xs font-bold text-yellow-500">{coins.toLocaleString()}</span>
        </div>

      </div>
      
      {/* --- NAVIGATION SCROLL AREA --- */}
      <div className="p-3 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
        
        <div>
          <p className="text-[9px] font-black text-slate-700 uppercase px-2 mb-1.5 tracking-widest">General</p>
          <NavButton view="inventory" label="Inventory" icon="🎒" currentView={currentView} onClick={setView} />
          <NavButton view="shop" label="Shop" icon="🛒" currentView={currentView} onClick={setView} />
          <NavButton view="gamble" label="Casino" icon="🎲" currentView={currentView} onClick={setView} />
          <NavButton view="achievements" label="Achievements" icon="🏆" currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-[9px] font-black text-slate-700 uppercase px-2 mb-1.5 tracking-widest">Skills</p>
          <NavButton view="woodcutting" label="Woodcutting" icon="🪓" level={skills.woodcutting.level} currentView={currentView} onClick={setView} />
          <NavButton view="mining" label="Mining" icon="⛏️" level={skills.mining.level} currentView={currentView} onClick={setView} />
          <NavButton view="fishing" label="Fishing" icon="🎣" level={skills.fishing.level} currentView={currentView} onClick={setView} />
          <NavButton view="farming" label="Farming" icon="🌱" level={skills.farming.level} currentView={currentView} onClick={setView} />
          <NavButton view="crafting" label="Crafting" icon="🔨" level={skills.crafting.level} currentView={currentView} onClick={setView} />
          <NavButton view="cooking" label="Cooking" icon="🍳" level={skills.cooking.level} currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-[9px] font-black text-slate-700 uppercase px-2 mb-1.5 tracking-widest">Adventure</p>
          <NavButton view="combat" label="Combat" icon="⚔️" currentView={currentView} onClick={setView} />
          
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 mt-2 space-y-0.5">
            <StatRow label="Hitpoints" level={skills.hitpoints.level} xp={skills.hitpoints.xp} icon="❤️" textColor="text-red-400" bgColor="bg-red-500" />
            <StatRow label="Attack" level={skills.attack.level} xp={skills.attack.xp} icon="🗡️" textColor="text-orange-400" bgColor="bg-orange-500" />
            <StatRow label="Melee" level={skills.melee.level} xp={skills.melee.xp} icon="💪" textColor="text-red-500" bgColor="bg-red-600" />
            <StatRow label="Ranged" level={skills.ranged.level} xp={skills.ranged.xp} icon="🏹" textColor="text-emerald-400" bgColor="bg-emerald-500" />
            <StatRow label="Magic" level={skills.magic.level} xp={skills.magic.xp} icon="✨" textColor="text-blue-400" bgColor="bg-blue-500" />
            <StatRow label="Defense" level={skills.defense.level} xp={skills.defense.xp} icon="🛡️" textColor="text-slate-300" bgColor="bg-slate-400" />
          </div>
        </div>

      </div>

      <div className="p-3 border-t border-slate-800">
        <button onClick={onStopAction} className="w-full py-1.5 text-[10px] font-bold uppercase text-yellow-600 hover:text-yellow-500 hover:bg-yellow-900/10 rounded border border-slate-800 hover:border-yellow-900/30 transition-colors mb-2">
           Stop Action
        </button>

        <button onClick={onReset} className="w-full py-1.5 text-[10px] font-bold uppercase text-red-800 hover:text-red-500 hover:bg-red-900/10 rounded border border-transparent transition-colors">Reset Save</button>
        
        <p className="text-[9px] text-slate-700 text-center mt-1">Auto-save on</p>
      </div>
    </nav>
  );
}