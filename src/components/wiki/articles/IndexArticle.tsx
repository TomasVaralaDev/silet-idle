import { ArrowRight } from "lucide-react";
import { WIKI_TABS, type WikiTabId } from "../wikiConfig";

interface Props {
  setActiveTab: (id: WikiTabId) => void;
}

export default function IndexArticle({ setActiveTab }: Props) {
  {
    // Filter out index tab from the list
  }
  const chapters = WIKI_TABS.filter((tab) => tab.id !== "index");

  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-3xl mx-auto relative z-10">
      {
        // HEADER
      }
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Index
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          Nexus Idle Guide
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4 max-w-2xl">
          Welcome to the official survival and progression guide. Select a
          chapter below to learn about the world, its mechanics, and how to
          maximize your potential across the realms.
        </p>
      </header>

      {
        // CHAPTER SELECTION
      }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => setActiveTab(chapter.id)}
            className="bg-panel/5 border border-border/50 hover:bg-panel/10 hover:border-border transition-all p-5 rounded-lg flex flex-col text-left group relative overflow-hidden"
          >
            {
              // Chapter number background display
            }
            <div className="absolute right-4 bottom-2 text-6xl font-black text-tx-muted/5 group-hover:text-tx-muted/10 transition-colors pointer-events-none select-none">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="flex items-start gap-4 relative z-10">
              {
                // Icon container
              }
              <div className="w-12 h-12 bg-panel/10 border border-border/50 rounded flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={chapter.icon}
                  className="w-6 h-6 pixelated opacity-70 group-hover:opacity-100 transition-opacity"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-tx-muted uppercase tracking-widest mb-1">
                  Chapter {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm font-bold text-tx-main uppercase tracking-wider mb-2">
                  {chapter.label}
                </h3>
                <p className="text-[11px] text-tx-muted leading-relaxed line-clamp-2 pr-4">
                  {chapter.desc}
                </p>
              </div>
            </div>

            {
              // Footer link
            }
            <div className="mt-4 pt-3 border-t border-border/20 flex justify-end relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted group-hover:text-tx-main flex items-center gap-2 transition-colors">
                Open Chapter{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
