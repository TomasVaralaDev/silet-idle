import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SKILL_DEFINITIONS } from '../config/skillDefinitions';
import type { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onReset: () => void;
  onLogout: () => void;
  onStopAction: () => void;
  onForceSave: () => void;
  onOpenSettings: () => void;
  onOpenUserConfig: () => void; // UUSI PROP
}

// --- HELPER COMPONENTS ---

interface NavButtonProps {
  view: ViewType;
  label: string;
  iconPath: string;
  level?: number;
  currentView: ViewType;
  onClick: (view: ViewType) => void;
}

const NavButton = ({ view, label, iconPath, level, currentView, onClick }: NavButtonProps) => {
  const isActive = currentView === view;
  let baseStyle = 'hover:bg-slate-800/80 text-slate-400 border border-transparent';
  
  if (isActive) {
     if (['inventory', 'shop', 'gamble', 'achievements', 'enchanting'].includes(view)) 
        baseStyle = 'bg-slate-800/90 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-bold';
     else if (view === 'combat') 
        baseStyle = 'bg-red-950/40 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(248,113,113,0.15)] font-bold';
     else if (view === 'scavenger' || view === 'scavenging') 
        baseStyle = 'bg-indigo-900/40 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)] font-bold'; 
     else 
        baseStyle = 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.15)] font-bold';
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

interface StatRowProps {
  label: string;
  level: number;
  xp: number;
  iconPath: string;
  textColor: string;
  bgColor: string;
}

const StatRow = ({ label, level, xp, iconPath, textColor, bgColor }: StatRowProps) => {
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
           <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{progress.toFixed(1)}%</span>
           <span className={`font-bold text-sm ${textColor}`}>L.{level}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-950/80 overflow-hidden border border-slate-800/50 rounded-sm">
        <div className={`h-full ${bgColor} opacity-90`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function Sidebar({ currentView, setView, onReset, onLogout, onStopAction, onForceSave, onOpenSettings, onOpenUserConfig }: SidebarProps) {
  const coins = useGameStore(state => state.coins);
  const skills = useGameStore(state => state.skills);
  const username = useGameStore(state => state.username);
  const avatar = useGameStore(state => state.avatar);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [saveCooldown, setSaveCooldown] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let timer: number;
    if (saveCooldown > 0) timer = window.setInterval(() => setSaveCooldown(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [saveCooldown]);

  const handleForceSaveClick = () => {
    if (saveCooldown === 0) {
      onForceSave();
      setSaveCooldown(60);
    }
  };

  const totalLevel = (Object.values(skills) as { level: number }[]).reduce((acc, s) => acc + s.level, 0);

  return (
    <nav className="w-full md:w-72 bg-slate-950 border-r border-slate-800/50 flex-shrink-0 flex flex-col h-screen z-10 overflow-hidden relative font-sans">
      
      {/* HEADER */}
      <div className="p-5 border-b border-slate-800/50 bg-slate-950 relative z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-200 tracking-widest uppercase flex flex-col leading-none">
              Time<span className="text-cyan-500 text-3xl">Ring</span>
            </h1>
            <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase mt-1">System v1.0</span>
          </div>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 hover:bg-slate-900 p-2 rounded border border-slate-800 transition-all">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-300 truncate max-w-[100px]">{username || "Restorer"}</div>
                <div className="text-[10px] text-cyan-500 font-mono">SYNC: {totalLevel}</div>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded border border-slate-700 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={avatar || "/assets/ui/icon_user_avatar.png"} 
                    alt="User" 
                    className="w-full h-full object-cover pixelated" 
                    onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=U&background=0f172a'} 
                  />
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] p-2 animate-in fade-in zoom-in-95 duration-100">
                
                {/* UUSI: User Config Button */}
                <button onClick={() => { setIsProfileOpen(false); onOpenUserConfig(); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-3">
                   <span className="text-base">👤</span> User Config
                </button>
                
                {/* System Config Button */}
                <button onClick={() => { setIsProfileOpen(false); onOpenSettings(); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-3">
                   <span className="text-base">⚙️</span> System Config
                </button>
                
                <div className="h-px bg-slate-800 my-1 mx-2"></div>

                {/* Terminate Session Button */}
                <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded hover:bg-red-900/20 text-xs font-bold text-red-400 flex items-center gap-3">
                   <span className="text-base">🔌</span> Terminate Session
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 border border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/ui/coins.png" className="w-5 h-5 pixelated" alt="Memory" />
            <span className="text-xs font-bold text-slate-400 uppercase">Fragments</span>
          </div>
          <span className="font-mono text-base font-bold text-amber-500">{coins.toLocaleString()}</span>
        </div>
      </div>
      
      {/* NAVIGATION */}
      <div className="p-4 space-y-8 overflow-y-auto flex-1 custom-scrollbar relative z-10">
        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase px-2 mb-3 tracking-[0.2em] border-b border-slate-800/50 pb-1">Core Systems</p>
          <NavButton view="inventory" label="Storage" iconPath="/assets/ui/icon_inventory.png" currentView={currentView} onClick={setView} />
          <NavButton view="shop" label="Requisition" iconPath="/assets/ui/icon_shop.png" currentView={currentView} onClick={setView} />
          <NavButton view="enchanting" label="Enchanting" iconPath="/assets/ui/icon_anvil.png" currentView={currentView} onClick={setView} />
          <NavButton view="achievements" label="Milestones" iconPath="/assets/ui/icon_achievements.png" currentView={currentView} onClick={setView} />
          <NavButton view="gamble" label="Entropy" iconPath="/assets/ui/icon_casino.png" currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase px-2 mb-3 tracking-[0.2em] border-b border-slate-800/50 pb-1">Protocols</p>
          <NavButton view="scavenger" label="Expeditions" iconPath="/assets/skills/scavenging.png" currentView={currentView} onClick={setView} />
          
          {SKILL_DEFINITIONS
            .filter(def => def.category === 'gathering' || def.category === 'production')
            .map(def => (
              <NavButton key={def.id} view={def.id} label={def.sidebarLabel} iconPath={def.icon} level={skills[def.id].level} currentView={currentView} onClick={setView} />
            ))}
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase px-2 mb-3 tracking-[0.2em] border-b border-slate-800/50 pb-1">Stabilization</p>
          <NavButton view="combat" label="Stabilize Zone" iconPath="/assets/skills/combat.png" currentView={currentView} onClick={setView} />
          <div className="bg-slate-900/30 p-3 border border-slate-800/50 mt-4 rounded space-y-1">
            {SKILL_DEFINITIONS
              .filter(def => def.category === 'combat')
              .map(def => (
                <StatRow key={def.id} label={def.sidebarLabel} level={skills[def.id].level} xp={skills[def.id].xp} iconPath={def.icon} textColor={def.color} bgColor={def.bgColor} />
              ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-950/50">
        <button onClick={onStopAction} className="w-full py-3 text-xs font-bold text-amber-500 hover:bg-amber-900/10 border border-amber-900/30 mb-3 transition-colors rounded-sm uppercase">Halt Process</button>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onReset} className="py-2 text-[10px] font-bold text-red-500 border border-red-900/20 hover:bg-red-900/10 rounded-sm uppercase">Reboot</button>
          <button onClick={handleForceSaveClick} disabled={saveCooldown > 0} className={`py-2 text-[10px] font-bold border rounded-sm uppercase ${saveCooldown > 0 ? 'text-slate-600 border-slate-800 cursor-not-allowed' : 'text-emerald-500 border-emerald-900/20 hover:bg-emerald-900/10'}`}>
            {saveCooldown > 0 ? `${saveCooldown}s` : "Save"}
          </button>
        </div>
      </div>
    </nav>
  );
}