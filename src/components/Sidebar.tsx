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
     else baseStyle = 'bg-slate-700 text-white border border-slate-600';
  }

  return (
    <button onClick={() => onClick(view)} className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors mb-2 ${baseStyle}`}>
      <div className="flex items-center gap-3"><span>{icon}</span><span className="font-medium">{label}</span></div>
      {level !== undefined && <span className="text-xs font-bold bg-slate-950 px-2 py-1 rounded text-slate-500">Lv {level}</span>}
    </button>
  );
};

const StatRow = ({ label, level, xp, icon, textColor, bgColor }: { label: string, level: number, xp: number, icon: string, textColor: string, bgColor: string }) => {
  const nextLevelXp = level * 150;
  const progress = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));

  return (
    <div className="py-2 group cursor-help" title={`${Math.floor(xp)} / ${nextLevelXp} XP`}>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-2">
          <span className="w-4 text-center">{icon}</span>
          <span className="text-slate-400 font-bold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
             {progress.toFixed(1)}%
           </span>
           <span className={`font-mono font-bold ${textColor}`}>Lv {level}</span>
        </div>
      </div>
      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative shadow-inner">
        <div 
          className={`h-full ${bgColor} transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function Sidebar({ currentView, setView, coins, skills, onReset, onLogout, onStopAction }: SidebarProps) {
  return (
    <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen z-10 overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black italic text-emerald-500">MELVOR <span className="text-slate-400 font-light">CLONE</span></h1>
        <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-700 flex items-center justify-between text-yellow-400 shadow-inner">
          <span className="text-sm uppercase font-bold tracking-wider text-yellow-600">Coins</span>
          <span className="font-mono text-xl">{coins.toLocaleString()} 🟡</span>
        </div>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 tracking-wider">General</p>
          <NavButton view="inventory" label="Inventory" icon="🎒" currentView={currentView} onClick={setView} />
          <NavButton view="shop" label="Shop" icon="🛒" currentView={currentView} onClick={setView} />
          <NavButton view="gamble" label="Casino" icon="🎲" currentView={currentView} onClick={setView} />
          <NavButton view="achievements" label="Achievements" icon="🏆" currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 tracking-wider">Skills</p>
          <NavButton view="woodcutting" label="Woodcutting" icon="🪓" level={skills.woodcutting.level} currentView={currentView} onClick={setView} />
          <NavButton view="mining" label="Mining" icon="⛏️" level={skills.mining.level} currentView={currentView} onClick={setView} />
          <NavButton view="fishing" label="Fishing" icon="🎣" level={skills.fishing.level} currentView={currentView} onClick={setView} />
          <NavButton view="farming" label="Farming" icon="🌱" level={skills.farming.level} currentView={currentView} onClick={setView} />
          <NavButton view="crafting" label="Crafting" icon="🔨" level={skills.crafting.level} currentView={currentView} onClick={setView} />
          {/* UUSI: COOKING */}
          <NavButton view="cooking" label="Cooking" icon="🍳" level={skills.cooking.level} currentView={currentView} onClick={setView} />
        </div>

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-2 tracking-wider">Adventure</p>
          <NavButton view="combat" label="Combat" icon="⚔️" currentView={currentView} onClick={setView} />
          
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 mt-2 space-y-1">
            <StatRow label="Hitpoints" level={skills.hitpoints.level} xp={skills.hitpoints.xp} icon="❤️" textColor="text-red-400" bgColor="bg-red-500" />
            <StatRow label="Attack" level={skills.attack.level} xp={skills.attack.xp} icon="🗡️" textColor="text-orange-400" bgColor="bg-orange-500" />
            <StatRow label="Melee" level={skills.melee.level} xp={skills.melee.xp} icon="💪" textColor="text-red-500" bgColor="bg-red-600" />
            <StatRow label="Ranged" level={skills.ranged.level} xp={skills.ranged.xp} icon="🏹" textColor="text-emerald-400" bgColor="bg-emerald-500" />
            <StatRow label="Magic" level={skills.magic.level} xp={skills.magic.xp} icon="✨" textColor="text-blue-400" bgColor="bg-blue-500" />
            <StatRow label="Defense" level={skills.defense.level} xp={skills.defense.xp} icon="🛡️" textColor="text-slate-300" bgColor="bg-slate-400" />
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button onClick={onStopAction} className="w-full py-2 text-xs font-bold uppercase text-yellow-500 hover:bg-yellow-900/20 rounded border border-transparent hover:border-yellow-900/50 transition-colors mb-2">
           Stop Current Action
        </button>

        <button onClick={onReset} className="w-full py-2 text-xs font-bold uppercase text-red-500 hover:bg-red-900/20 rounded border border-transparent hover:border-red-900/50 transition-colors">Reset Save Data</button>
        
        <button onClick={onLogout} className="w-full py-2 text-xs font-bold uppercase text-slate-400 hover:bg-slate-800 rounded border border-slate-700 hover:border-slate-500 transition-colors">
          Log Out
        </button>
        
        <p className="text-[10px] text-slate-600 text-center mt-2">Auto-save on</p>
      </div>
    </nav>
  );
}