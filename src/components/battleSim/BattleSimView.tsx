import { createPortal } from "react-dom";
import BattleSimulator from "./BattleSimulator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BattleSimView({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  // Use createPortal to render the modal into document.body
  // This bypasses local CSS constraints and ensures the simulator stays on top of all UI layers
  return createPortal(
    <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      {
        // Modal Container
      }
      <div className="bg-slate-900 border border-slate-700/50 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden relative ring-1 ring-accent/20">
        {
          // Modal Header - Contains status indicator and close controls
        }
        <div className="bg-slate-950 border-b border-slate-700/50 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            {
              // Animated Status Indicator
            }
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <h2 className="text-accent font-black tracking-widest uppercase text-lg drop-shadow-[0_0_8px_rgba(var(--color-accent),0.5)]">
              Live Combat Simulation Interface
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold px-4 py-1.5 rounded border border-slate-700 hover:border-red-400 text-xs tracking-widest uppercase"
          >
            Close [Esc]
          </button>
        </div>

        {
          // Modal Content - Wraps the combat logic component
        }
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-slate-900 to-slate-950">
          <BattleSimulator />
        </div>
      </div>
    </div>,
    document.body, // Target the document body to escape current component tree limits
  );
}
