import { useState } from "react";
import { TreePine, Hammer, Map, Crown, ArrowRight } from "lucide-react";
import Phase1Awakening from "./phases/Phase1Awakening";
import Phase2FirstForge from "./phases/Phase2FirstForge";
import Phase3WorldWalker from "./phases/Phase3WorldWalker";
import Phase4Endgame from "./phases/Phase4Endgame";

export type PhaseId = 1 | 2 | 3 | 4 | null;

export default function GuideView() {
  const [activePhase, setActivePhase] = useState<PhaseId>(null);

  if (activePhase === 1)
    return <Phase1Awakening onBack={() => setActivePhase(null)} />;
  if (activePhase === 2)
    return <Phase2FirstForge onBack={() => setActivePhase(null)} />;
  if (activePhase === 3)
    return <Phase3WorldWalker onBack={() => setActivePhase(null)} />;
  if (activePhase === 4)
    return <Phase4Endgame onBack={() => setActivePhase(null)} />;

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 text-left pb-32">
      <header className="text-center space-y-4 mb-16 relative">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-tx-main drop-shadow-md relative z-10">
          Restorer's Roadmap
        </h2>
        <p className="text-tx-muted text-sm md:text-base max-w-2xl mx-auto relative z-10 leading-relaxed">
          Select a phase to read the detailed playthrough guide. Follow this to
          ensure you are always progressing efficiently.
        </p>
      </header>

      <div className="relative pl-6 md:pl-10 border-l-2 border-border/50 space-y-16">
        {/* PHASE 1 */}
        <div
          className="relative group cursor-pointer"
          onClick={() => setActivePhase(1)}
        >
          <div className="absolute -left-[35px] md:-left-[51px] bg-app-base border-4 border-success p-2 rounded-full z-10 shadow-[0_0_15px_rgb(var(--color-success)/0.3)] group-hover:scale-110 transition-transform">
            <TreePine className="text-success" size={24} />
          </div>
          <div className="bg-panel/50 border border-border hover:border-success/50 transition-colors p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden group-hover:bg-panel">
            <div className="absolute top-0 right-0 bg-success/10 text-success text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest border-b border-l border-success/20">
              Phase I: Early Game
            </div>
            <h3 className="text-2xl font-black text-tx-main uppercase tracking-widest mb-4 mt-2">
              The Awakening
            </h3>
            <p className="text-sm text-tx-muted leading-relaxed mb-6">
              Establish a basic economy, craft your first set of gear, and
              survive the initial zones of World 1.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-success uppercase tracking-widest mt-4">
              Read Full Guide{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* PHASE 2 */}
        <div
          className="relative group cursor-pointer"
          onClick={() => setActivePhase(2)}
        >
          <div className="absolute -left-[35px] md:-left-[51px] bg-app-base border-4 border-warning p-2 rounded-full z-10 shadow-[0_0_15px_rgb(var(--color-warning)/0.3)] group-hover:scale-110 transition-transform">
            <Hammer className="text-warning" size={24} />
          </div>
          <div className="bg-panel/50 border border-border hover:border-warning/50 transition-colors p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden group-hover:bg-panel">
            <div className="absolute top-0 right-0 bg-warning/10 text-warning text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest border-b border-l border-warning/20">
              Phase II: Mid Game
            </div>
            <h3 className="text-2xl font-black text-tx-main uppercase tracking-widest mb-4 mt-2">
              The First Forge
            </h3>
            <p className="text-sm text-tx-muted leading-relaxed mb-6">
              Prepare for the first World Boss and unlock the power of
              Enchanting.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-warning uppercase tracking-widest mt-4">
              Read Full Guide{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* PHASE 3 */}
        <div
          className="relative group cursor-pointer"
          onClick={() => setActivePhase(3)}
        >
          <div className="absolute -left-[35px] md:-left-[51px] bg-app-base border-4 border-accent p-2 rounded-full z-10 shadow-[0_0_15px_rgb(var(--color-accent)/0.3)] group-hover:scale-110 transition-transform">
            <Map className="text-accent" size={24} />
          </div>
          <div className="bg-panel/50 border border-border hover:border-accent/50 transition-colors p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden group-hover:bg-panel">
            <div className="absolute top-0 right-0 bg-accent/10 text-accent text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest border-b border-l border-accent/20">
              Phase III: Late Game
            </div>
            <h3 className="text-2xl font-black text-tx-main uppercase tracking-widest mb-4 mt-2">
              The World Walker
            </h3>
            <p className="text-sm text-tx-muted leading-relaxed mb-6">
              Utilize World Vendors, explore Alchemy, and send followers on
              Expeditions.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest mt-4">
              Read Full Guide{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* PHASE 4 */}
        <div
          className="relative group cursor-pointer"
          onClick={() => setActivePhase(4)}
        >
          <div className="absolute -left-[35px] md:-left-[51px] bg-app-base border-4 border-danger p-2 rounded-full z-10 shadow-[0_0_15px_rgb(var(--color-danger)/0.3)] group-hover:scale-110 transition-transform">
            <Crown className="text-danger" size={24} />
          </div>
          <div className="bg-panel/50 border border-border hover:border-danger/50 transition-colors p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden group-hover:bg-panel">
            <div className="absolute top-0 right-0 bg-danger/10 text-danger text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest border-b border-l border-danger/20">
              Phase IV: Endgame
            </div>
            <h3 className="text-2xl font-black text-tx-main uppercase tracking-widest mb-4 mt-2 flex items-center gap-3">
              Master of Time
            </h3>
            <p className="text-sm text-tx-muted leading-relaxed mb-6">
              Min-max your setup, dominate the economy, and carve your name into
              history.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-danger uppercase tracking-widest mt-4">
              Read Full Guide{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
