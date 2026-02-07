import type { GameState, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  coins: number;
  skills: GameState['skills'];
  onReset: () => void;
  onLogout: () => void; // UUSI: Lisätään tämä
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
     else baseStyle = 'bg-slate-700 text-white border border-slate-600';
  }

  return (
    <button onClick={() => onClick(view)} className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors mb-2 ${baseStyle}`}>
      <div className="flex items-center gap-3"><span>{icon}</span><span className="font-medium">{label}</span></div>
      {level !== undefined && <span className="text-xs font-bold bg-slate-950 px-2 py-1 rounded text-slate-500">Lv {level}</span>}
    </button>
  );
};

export default function Sidebar({ currentView, setView, coins, skills, onReset, onLogout }: SidebarProps) {
  return (
    <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen z-10">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black italic text-emerald-500">MELVOR <span className="text-slate-400 font-light">CLONE</span></h1>
        <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-700 flex items-center justify-between text-yellow-400 shadow-inner">
          <span className="text-sm uppercase font-bold tracking-wider text-yellow-600">Coins</span>
          <span className="font-mono text-xl">{coins.toLocaleString()} 🟡</span>
        </div>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
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
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button onClick={onReset} className="w-full py-2 text-xs font-bold uppercase text-red-500 hover:bg-red-900/20 rounded border border-transparent hover:border-red-900/50 transition-colors">Reset Save Data</button>
        
        {/* UUSI LOGOUT-NAPPI */}
        <button onClick={onLogout} className="w-full py-2 text-xs font-bold uppercase text-slate-400 hover:bg-slate-800 rounded border border-slate-700 hover:border-slate-500 transition-colors">
          Log Out
        </button>
        
        <p className="text-[10px] text-slate-600 text-center mt-2">Auto-save on</p>
      </div>
    </nav>
  );
}