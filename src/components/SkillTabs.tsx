import type { TabConfig } from '../config/skillTabs';

interface Props {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function SkillTabs({ tabs, activeTab, onTabChange }: Props) {
  // Jos ei ole tabeja tai vain "All", ei renderöidä mitään
  if (!tabs || tabs.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all
            ${activeTab === tab.id 
              ? 'bg-emerald-500 text-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
              : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300 border border-slate-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}