import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useAuth } from "../../hooks/useAuth";
import FriendList from "./FriendList";
import ChatWindow from "./ChatWindow";
import GlobalChat from "./GlobalChat";

export default function SocialOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "global">("global");

  const [width, setWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);

  const activeChatId = useGameStore((state) => state.social.activeChatFriendId);
  const { user } = useAuth();

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(280, Math.min(newWidth, 800)));
    };

    const stopResizing = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "auto";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  if (!user) return null;

  return (
    <>
      {/* AVAUSPAINIKE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-1/2 right-0 -translate-y-1/2 z-40 bg-panel border border-r-0 border-border/50 text-tx-muted hover:text-accent py-4 px-1.5 rounded-l-md shadow-[-5px_0_15px_rgba(0,0,0,0.5)] hover:bg-panel-hover transition-colors group"
        >
          <span className="[writing-mode:vertical-lr] font-black uppercase tracking-widest text-[10px] rotate-180 group-hover:-translate-x-0.5 transition-transform">
            Social Hub
          </span>
        </button>
      )}

      {/* OIKEAN REUNAN PANEELI (LÄPINÄKYVÄ + BLUR) */}
      <div
        style={{
          width: isOpen ? `${width}px` : "0px",
          borderLeftWidth: isOpen ? "1px" : "0px",
        }}
        // MUUTOS: bg-app-base -> bg-app-base/80 backdrop-blur-md
        className="fixed top-0 right-0 h-screen z-50 bg-app-base/80 backdrop-blur-md border-border/50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.6)] transition-[width] duration-300 ease-in-out"
      >
        {/* RESIZE-KAHVA */}
        {isOpen && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 -left-1 w-2 h-full cursor-col-resize hover:bg-accent/20 transition-colors z-50"
          />
        )}

        {/* PANEELIN SISÄLTÖ */}
        {isOpen && (
          <div className="flex flex-col h-full w-full min-w-[280px] animate-in fade-in duration-500">
            {/* HEADER & TABS (LÄPINÄKYVÄMPI) */}
            {/* MUUTOS: bg-panel -> bg-panel/60 */}
            <div className="bg-panel/60 border-b border-border/50 flex flex-col shrink-0">
              <div className="p-3 flex justify-between items-center bg-app-base/30">
                <h3 className="font-bold text-tx-main text-sm uppercase tracking-widest truncate mr-2">
                  {activeChatId ? "Secure Channel" : "Social Hub"}
                </h3>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-tx-muted font-mono bg-panel/50 px-2 py-1 rounded border border-border/50 hidden sm:block">
                    ID: {user.uid.slice(0, 6)}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-tx-muted hover:text-danger hover:bg-danger/10 w-6 h-6 rounded flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {!activeChatId && (
                <div className="flex text-sm">
                  <button
                    onClick={() => setActiveTab("global")}
                    className={`flex-1 py-3 font-bold uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${
                      activeTab === "global"
                        ? "bg-panel-hover/80 text-warning border-b-2 border-warning"
                        : "text-tx-muted hover:text-tx-main hover:bg-panel-hover/40"
                    }`}
                  >
                    <img
                      src="/assets/ui/icon_tavern.png"
                      className="w-4 h-4 rendering-pixelated"
                      alt=""
                    />
                    Tavern
                  </button>
                  <button
                    onClick={() => setActiveTab("friends")}
                    className={`flex-1 py-3 font-bold uppercase tracking-tighter transition-all ${
                      activeTab === "friends"
                        ? "bg-panel-hover/80 text-accent border-b-2 border-accent"
                        : "text-tx-muted hover:text-tx-main hover:bg-panel-hover/40"
                    }`}
                  >
                    Friends
                  </button>
                </div>
              )}
            </div>

            {/* SISÄLTÖALUE */}
            <div className="flex-1 overflow-hidden relative">
              {activeChatId ? (
                <ChatWindow myUid={user.uid} friendUid={activeChatId} />
              ) : activeTab === "friends" ? (
                <FriendList myUid={user.uid} />
              ) : (
                <GlobalChat myUid={user.uid} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
