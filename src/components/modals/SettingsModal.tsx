import { useState } from "react";
import {
  X,
  Trash2,
  LogOut,
  MessageSquare,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

interface SettingsModalProps {
  username: string;
  onClose: () => void;
  onReset: () => void;
  onDeleteAccount: () => void;
  onReportBug: () => void;
  onLogout: () => void;
}

export default function SettingsModal({
  username,
  onClose,
  onReset,
  onDeleteAccount,
  onReportBug,
  onLogout,
}: SettingsModalProps) {
  // Toggle between main view and specific confirmation view
  const [confirmState, setConfirmState] = useState<"reset" | "delete" | null>(
    null,
  );

  const handleConfirm = () => {
    if (confirmState === "reset") onReset();
    if (confirmState === "delete") onDeleteAccount();
    setConfirmState(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-panel p-8 rounded-2xl border border-border shadow-2xl w-full max-w-md relative overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 min-h-[400px] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

        <button
          onClick={() => (confirmState ? setConfirmState(null) : onClose())}
          className="absolute top-4 right-4 text-tx-muted hover:text-danger transition-colors p-1 z-20"
        >
          <X size={20} />
        </button>

        {confirmState ? (
          // CONFIRMATION VIEW
          <div className="flex flex-col h-full justify-center flex-1 animate-in fade-in slide-in-from-bottom-4 duration-200 pt-4">
            <div className="flex justify-center mb-4">
              <AlertTriangle
                size={48}
                className={
                  confirmState === "delete" ? "text-danger" : "text-warning"
                }
              />
            </div>

            <h2
              className={`text-lg font-black uppercase tracking-widest text-center mb-4 ${confirmState === "delete" ? "text-danger" : "text-warning"}`}
            >
              {confirmState === "delete" ? "Delete Account" : "Reset Progress"}
            </h2>

            <p className="text-xs text-tx-muted text-center leading-relaxed mb-8 px-2 font-medium">
              {confirmState === "delete"
                ? "WARNING: Account deletion is permanent. All purchases, progress, and data will be lost forever. This action cannot be undone. Are you absolutely sure?"
                : "Are you sure you want to reset all progress? Your account and purchases will remain intact, but all game progress will be wiped. This cannot be undone."}
            </p>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => setConfirmState(null)}
                className="flex-1 py-3 bg-panel border border-border rounded-xl text-[10px] font-black text-tx-main uppercase tracking-widest hover:bg-panel-hover transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                  confirmState === "delete"
                    ? "bg-danger hover:bg-danger/80 text-white border border-danger/50"
                    : "bg-warning hover:bg-warning/80 text-black border border-warning/50"
                }`}
              >
                {confirmState === "delete" ? "Confirm Delete" : "Confirm Reset"}
              </button>
            </div>
          </div>
        ) : (
          // MAIN SETTINGS VIEW
          <>
            <h2 className="text-xl font-black uppercase tracking-widest text-center mb-1 text-tx-main flex items-center justify-center gap-3">
              <img
                src="./assets/profile/user_settings.png"
                alt=""
                className="w-6 h-6 pixelated object-contain"
              />
              System Config
            </h2>
            <p className="text-[10px] text-accent font-mono uppercase tracking-widest text-center mb-8">
              User: {username}
            </p>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 pb-2">
              <button
                onClick={onReportBug}
                className="w-full py-4 bg-panel hover:bg-panel-hover border border-border rounded-xl text-[10px] font-black text-tx-main uppercase tracking-widest transition-all flex items-center justify-center gap-3 group shadow-sm"
              >
                <MessageSquare
                  size={16}
                  className="text-accent group-hover:scale-110 transition-transform"
                />
                Support & Bug Report
              </button>

              <button
                onClick={onLogout}
                className="w-full py-4 bg-panel hover:bg-panel-hover border border-border rounded-xl text-[10px] font-black text-tx-muted hover:text-tx-main uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <LogOut size={16} />
                Sign Out
              </button>

              <div className="pt-4 mt-4 border-t border-border/50 space-y-4">
                <button
                  onClick={() => setConfirmState("reset")}
                  className="w-full py-4 bg-warning/5 hover:bg-warning/10 border border-warning/30 rounded-xl text-[10px] font-black text-warning uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm group"
                >
                  <RefreshCcw
                    size={16}
                    className="group-hover:-rotate-90 transition-transform duration-300"
                  />
                  Reset Progress
                </button>

                <button
                  onClick={() => setConfirmState("delete")}
                  className="w-full py-4 bg-danger/5 hover:bg-danger hover:text-white border border-danger/30 hover:border-danger rounded-xl text-[10px] font-black text-danger uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm group"
                >
                  <Trash2
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Delete Account
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
