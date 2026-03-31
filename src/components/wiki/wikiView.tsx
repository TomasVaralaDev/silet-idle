import { useState } from "react";
import { WIKI_TABS, type WikiTabId } from "./wikiConfig";
import { Home, ArrowLeft, ArrowRight, BookOpen } from "lucide-react"; // LISÄTTY IKONIT

export default function WikiView() {
  const [activeTab, setActiveTab] = useState<WikiTabId>("index");

  const ActiveComponent = WIKI_TABS.find(
    (tab) => tab.id === activeTab,
  )?.component;

  // LASKETAAN SEURAAVA JA EDELLINEN LUKU
  const sequence = WIKI_TABS.filter((t) => t.id !== "index");
  const currentIndex = sequence.findIndex((t) => t.id === activeTab);
  const prevChapter = currentIndex > 0 ? sequence[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < sequence.length - 1
      ? sequence[currentIndex + 1]
      : null;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden text-left relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('./assets/ui/paper_texture.jpg')] mix-blend-overlay z-0" />

      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/80 flex items-center gap-4 md:gap-6 sticky top-0 z-30 backdrop-blur-md shrink-0 shadow-sm">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-warning/10 border border-warning/30 shadow-[0_0_15px_rgba(var(--color-warning)/0.2)] shrink-0">
          <img
            src="./assets/ui/icon_guide.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated object-contain drop-shadow-md"
            alt="Guide"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-warning mb-0.5 md:mb-1 drop-shadow-sm">
            Adventurer's Guide
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium italic line-clamp-1">
            "Knowledge is the sharpest blade in a hero's arsenal."
          </p>
        </div>

        {activeTab !== "index" && (
          <button
            onClick={() => setActiveTab("index")}
            className="bg-panel border border-border hover:border-warning/50 hover:bg-warning/10 text-tx-muted hover:text-warning px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
          >
            <Home size={16} /> <span className="hidden md:inline">Index</span>
          </button>
        )}

        <div className="text-right hidden lg:block ml-4">
          <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
            Volume II
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative z-10">
        {/* NAVIGATION SIDEBAR / TOP BAR */}
        <nav className="w-full md:w-72 bg-panel/30 border-b md:border-b-0 md:border-r border-border/50 flex shrink-0 z-20 shadow-lg md:shadow-none">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto custom-scrollbar p-2 md:p-6 gap-2 w-full snap-x">
            <div className="hidden md:flex items-center gap-3 text-[10px] font-black text-warning uppercase tracking-[0.2em] mb-4 px-2 opacity-80 border-b border-warning/20 pb-2">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              Table of Contents
            </div>

            {WIKI_TABS.filter((t) => t.id !== "index").map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`snap-start shrink-0 flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl transition-all border group whitespace-nowrap md:whitespace-normal relative overflow-hidden
                  ${
                    activeTab === item.id
                      ? "bg-warning/10 border-warning/50 shadow-[inset_0_0_20px_rgba(var(--color-warning)/0.1)]"
                      : "bg-app-base/50 border-border/50 hover:bg-panel hover:border-border"
                  }
                `}
              >
                <div className="hidden md:block absolute -right-2 -top-4 text-6xl font-black text-tx-muted/5 group-hover:text-warning/5 transition-colors pointer-events-none select-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border flex items-center justify-center shrink-0 transition-all z-10
                  ${activeTab === item.id ? "bg-warning/20 border-warning/50 scale-110 shadow-lg" : "bg-panel border-border/50 group-hover:border-border"}
                `}
                >
                  <img
                    src={item.icon}
                    className="w-5 h-5 md:w-6 md:h-6 pixelated opacity-90 group-hover:opacity-100"
                    alt=""
                  />
                </div>

                <div className="text-left overflow-hidden pr-4 z-10 flex-1">
                  <div
                    className={`text-[9px] md:text-xs font-black uppercase tracking-widest leading-none mb-1 transition-colors
                    ${activeTab === item.id ? "text-warning" : "text-tx-main group-hover:text-warning/70"}
                  `}
                  >
                    {item.label}
                  </div>
                  <div className="hidden md:block text-[10px] text-tx-muted truncate font-medium">
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-10 bg-app-base/50 pb-32 md:pb-12">
          <div className="max-w-3xl mx-auto bg-panel/30 rounded-2xl md:rounded-3xl border border-border/50 p-6 md:p-10 shadow-2xl backdrop-blur-sm relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-l-2xl md:rounded-l-3xl" />

            {/* RENDER ACTIVE ARTICLE */}
            {ActiveComponent && <ActiveComponent setActiveTab={setActiveTab} />}

            {/* --- CHAPTER NAVIGATION (NÄKYY ARTIKKELIN LOPUSSA) --- */}
            {activeTab !== "index" && (
              <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
                {/* PREV BUTTON */}
                {prevChapter ? (
                  <button
                    onClick={() => setActiveTab(prevChapter.id)}
                    className="flex items-center gap-4 text-tx-muted hover:text-tx-main transition-colors w-full sm:w-auto p-4 rounded-xl border border-border bg-panel/50 hover:bg-panel group shadow-sm"
                  >
                    <ArrowLeft
                      size={20}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    <div className="text-left">
                      <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1">
                        Previous
                      </div>
                      <div className="text-sm font-black tracking-wide">
                        {prevChapter.label}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="hidden sm:block" /> // Täyte, jos ei ole edellistä
                )}

                {/* NEXT BUTTON */}
                {nextChapter ? (
                  <button
                    onClick={() => setActiveTab(nextChapter.id)}
                    className="flex items-center justify-end gap-4 text-warning hover:text-warning transition-colors w-full sm:w-auto p-4 rounded-xl border border-warning/30 bg-warning/10 hover:bg-warning/20 group shadow-[0_0_15px_rgba(var(--color-warning)/0.1)] text-right"
                  >
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold mb-1">
                        Next Chapter
                      </div>
                      <div className="text-sm font-black tracking-wide">
                        {nextChapter.label}
                      </div>
                    </div>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("index")}
                    className="flex items-center justify-end gap-4 text-success hover:text-success transition-colors w-full sm:w-auto p-4 rounded-xl border border-success/30 bg-success/10 hover:bg-success/20 group text-right"
                  >
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold mb-1">
                        Guide Completed
                      </div>
                      <div className="text-sm font-black tracking-wide">
                        Back to Index
                      </div>
                    </div>
                    <BookOpen
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
