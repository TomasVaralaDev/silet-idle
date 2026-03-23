import { BookOpen, ArrowRight } from "lucide-react";
import { WIKI_TABS, type WikiTabId } from "../wikiConfig";

interface Props {
  setActiveTab: (id: WikiTabId) => void;
}

export default function IndexArticle({ setActiveTab }: Props) {
  // Suodatetaan pois tämä etusivu itse
  const chapters = WIKI_TABS.filter((tab) => tab.id !== "index");

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-10 text-left relative z-10">
      {/* WELCOME HEADER */}
      <header className="text-center border-b-2 border-warning/20 pb-8 relative">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center border-2 border-warning/30 shadow-[0_0_30px_rgba(var(--color-warning)/0.2)]">
            <BookOpen size={40} className="text-warning" />
          </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md mb-4">
          Adventurer's Index
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Welcome to the official TimeRing System Manual. Select a chapter below
          to learn about the world, its mechanics, and how to maximize your
          potential as a Restorer.
        </p>
      </header>

      {/* CHAPTER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => setActiveTab(chapter.id)}
            className="bg-panel border border-border hover:border-warning/50 hover:bg-panel-hover transition-all p-5 rounded-2xl flex flex-col text-left group shadow-md relative overflow-hidden"
          >
            {/* Luvun numero taustalla */}
            <div className="absolute right-2 bottom-0 text-7xl font-black text-tx-muted/5 group-hover:text-warning/5 transition-colors pointer-events-none select-none">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 bg-app-base border border-border rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-warning/50 transition-all shadow-inner">
                <img
                  src={chapter.icon}
                  className="w-8 h-8 pixelated opacity-80 group-hover:opacity-100"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono text-warning uppercase tracking-widest mb-1">
                  Chapter {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm md:text-base font-black text-tx-main uppercase tracking-wider mb-2 group-hover:text-warning transition-colors">
                  {chapter.label}
                </h3>
                <p className="text-xs text-tx-muted leading-relaxed line-clamp-2">
                  {chapter.desc}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex justify-end relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-tx-muted group-hover:text-warning flex items-center gap-2 transition-colors">
                Read Chapter{" "}
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
