import { useState } from "react";
import { WIKI_TABS, type WikiTabId } from "./wikiConfig";

export default function WikiView() {
  const [activeTab, setActiveTab] = useState<WikiTabId>("basics");

  // Hakee oikean komponentin lennosta config-listasta
  const ActiveComponent = WIKI_TABS.find(
    (tab) => tab.id === activeTab,
  )?.component;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-warning/20 border border-warning/30 shadow-lg shrink-0">
          <img
            src="/assets/ui/icon_guide.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Guide"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black uppercase tracking-widest text-warning mb-1">
            System Manual
          </h1>
          <p className="text-tx-muted text-sm font-medium italic">
            "Knowledge is the sharpest blade in a hero's arsenal."
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
            Volume II
          </div>
          <div className="text-xs font-mono text-tx-muted mt-1 uppercase tracking-widest">
            Chronicles: <span className="text-warning">Active</span>
          </div>
        </div>
      </div>

      {/* GOLD ACCENT LINE */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.5)] w-full"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PERSISTENT SIDEBAR - Loopataan suoraan configista */}
        <div className="w-72 bg-panel/20 border-r border-border/50 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar shrink-0">
          {WIKI_TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all border group
                ${
                  activeTab === item.id
                    ? "bg-warning/15 border-warning/40 shadow-inner"
                    : "bg-transparent border-transparent hover:bg-panel-hover hover:border-border-hover"
                }
              `}
            >
              <div
                className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 transition-all
                ${activeTab === item.id ? "bg-warning/20 border-warning/50 scale-105" : "bg-panel border-border"}
              `}
              >
                <img src={item.icon} className="w-8 h-8 pixelated" alt="" />
              </div>
              <div className="text-left overflow-hidden">
                <div
                  className={`text-[10px] font-black uppercase tracking-widest leading-none
                  ${activeTab === item.id ? "text-warning" : "text-tx-main"}
                `}
                >
                  {item.label}
                </div>
                <div className="text-[9px] text-tx-muted mt-1 truncate uppercase font-bold opacity-60">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}

          <div className="mt-auto p-4 bg-warning/5 border border-warning/10 rounded-xl">
            <p className="text-[8px] text-tx-muted uppercase font-bold text-center leading-relaxed">
              May your steel never dull and your courage never falter.
            </p>
          </div>
        </div>

        {/* DYNAMIC CONTENT AREA - Renderöi suoraan sen komponentin, joka on aktiivisena! */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-app-base/30">
          <div className="max-w-3xl">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
