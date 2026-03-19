import { useState } from "react";
import { WIKI_TABS, type WikiTabId } from "./wikiConfig";

export default function WikiView() {
  const [activeTab, setActiveTab] = useState<WikiTabId>("basics");

  // Hakee oikean komponentin lennosta config-listasta
  const ActiveComponent = WIKI_TABS.find(
    (tab) => tab.id === activeTab,
  )?.component;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden text-left">
      {/* HEADER: Skaalattu mobiiliin */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-4 md:gap-6 sticky top-0 z-30 backdrop-blur-sm shrink-0">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-warning/20 border border-warning/30 shadow-lg shrink-0">
          <img
            src="/assets/ui/icon_guide.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain"
            alt="Guide"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-warning mb-0.5 md:mb-1">
            System Manual
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium italic line-clamp-1">
            "Knowledge is the sharpest blade in a hero's arsenal."
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xl md:text-2xl font-black text-tx-main uppercase tracking-tighter">
            Volume II
          </div>
          <div className="text-[10px] font-mono text-tx-muted mt-1 uppercase tracking-widest">
            Chronicles: <span className="text-warning">Active</span>
          </div>
        </div>
      </div>

      {/* GOLD ACCENT LINE */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.5)] w-full"></div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* NAVIGATION: Mobiilissa vaakasuora, Työpöydällä sivupalkki */}
        <nav className="w-full md:w-72 bg-panel/20 border-b md:border-b-0 md:border-r border-border/50 flex shrink-0 z-20">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto custom-scrollbar p-2 md:p-4 gap-1 md:gap-2 w-full snap-x">
            <div className="hidden md:block text-[10px] font-black text-tx-muted uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
              Chapters
            </div>

            {WIKI_TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`snap-start shrink-0 flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl transition-all border group whitespace-nowrap md:whitespace-normal
                  ${
                    activeTab === item.id
                      ? "bg-warning/15 border-warning/40 shadow-inner"
                      : "bg-transparent border-transparent hover:bg-panel-hover hover:border-border-hover"
                  }
                `}
              >
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-lg border flex items-center justify-center shrink-0 transition-all
                  ${activeTab === item.id ? "bg-warning/20 border-warning/50 scale-105" : "bg-panel border-border"}
                `}
                >
                  <img
                    src={item.icon}
                    className="w-5 h-5 md:w-8 md:h-8 pixelated"
                    alt=""
                  />
                </div>

                <div className="text-left overflow-hidden pr-2">
                  <div
                    className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none
                    ${activeTab === item.id ? "text-warning" : "text-tx-main"}
                  `}
                  >
                    {item.label}
                  </div>
                  <div className="hidden md:block text-[9px] text-tx-muted mt-1 truncate uppercase font-bold opacity-60">
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}

            <div className="hidden md:block mt-auto p-4 bg-warning/5 border border-warning/10 rounded-xl">
              <p className="text-[8px] text-tx-muted uppercase font-bold text-center leading-relaxed">
                May your steel never dull and your courage never falter.
              </p>
            </div>
          </div>
        </nav>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-app-base/30 pb-24 md:pb-8">
          <div className="max-w-3xl mx-auto">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
