import { useEffect, useState, useRef, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import {
  sendGlobalMessage,
  subscribeToGlobalChat,
} from "../../services/socialServices";
import { calculateTotalLevel } from "../../utils/gameUtils";

export default function GlobalChat({ myUid }: { myUid: string }) {
  const { social, setGlobalMessages, username, skills } = useGameStore();

  const [activeChannel, setActiveChannel] = useState<"global" | "beginner">(
    "global",
  );
  const [input, setInput] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    return social?.globalMessages || [];
  }, [social?.globalMessages]);

  const totalLevel = calculateTotalLevel(skills);

  const handleChannelChange = (newChannel: "global" | "beginner") => {
    if (newChannel === activeChannel) return;
    setIsLoading(true);
    setGlobalMessages([]);
    setActiveChannel(newChannel);
  };

  useEffect(() => {
    const unsubscribe = subscribeToGlobalChat(activeChannel, (msgs) => {
      setGlobalMessages(msgs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [activeChannel, setGlobalMessages]);

  useEffect(() => {
    if (scrollRef.current && !isLoading) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cooldownRemaining > 0) return;
    try {
      const displayName = `[Lv.${totalLevel}] ${username}`;
      await sendGlobalMessage(myUid, displayName, input, activeChannel);
      setInput("");
      setCooldownRemaining(10);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-tx-main font-sans text-left overflow-hidden">
      {/* KANAVAVALITSIN */}
      <div className="flex gap-1 p-2 bg-panel/30 border-b border-border/50 shrink-0">
        {(["global", "beginner"] as const).map((ch) => (
          <button
            key={ch}
            onClick={() => handleChannelChange(ch)}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-sm border transition-all ${
              activeChannel === ch
                ? "bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.1)]"
                : "border-transparent text-tx-muted hover:text-tx-main hover:bg-panel"
            }`}
          >
            {ch === "global" ? "Tavern (Global)" : "Beginner Hall"}
          </button>
        ))}
      </div>

      {/* VIESTIALUE */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] text-tx-muted animate-pulse font-mono uppercase tracking-[0.3em]">
              Connecting to{" "}
              {activeChannel === "global" ? "Tavern" : "Beginners"}...
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = msg.senderUid === myUid;
              const timestamp = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const rawName = msg.senderUsername || "Unknown";
              const match = rawName.match(/^(\[Lv\.\d+\])\s+(.*)$/);
              let levelTag = "";
              let cleanName = rawName;

              if (match) {
                levelTag = match[1];
                cleanName = match[2];
              }

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 py-1 border-b border-border/10 hover:bg-panel/20 transition-colors min-w-0"
                >
                  <span className="text-[10px] text-tx-muted font-mono mt-0.5 shrink-0 opacity-50">
                    [{timestamp}]
                  </span>

                  <div className="text-sm leading-relaxed flex items-baseline flex-wrap min-w-0">
                    {levelTag && (
                      <span className="text-[10px] font-mono text-tx-muted/70 bg-panel/40 px-1 py-0.5 rounded border border-border/30 mr-1.5 shrink-0">
                        {levelTag}
                      </span>
                    )}

                    <span
                      className={`font-bold mr-1.5 uppercase tracking-tight shrink-0 ${isMe ? "text-accent" : "text-warning"}`}
                    >
                      {cleanName}:
                    </span>

                    <span className="text-tx-main break-all whitespace-pre-wrap font-medium">
                      {msg.text}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* KIRJOITUSKENTTÄ */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-transparent border-t border-border/50 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              cooldownRemaining > 0
                ? `Waiting... (${cooldownRemaining}s)`
                : `Message ${activeChannel === "global" ? "Tavern" : "Beginners"}...`
            }
            disabled={cooldownRemaining > 0 || isLoading}
            /* KORJAUS: Lisätty pr-20 (Padding Right), jotta teksti ei mene napin alle */
            className="w-full min-w-0 bg-app-base/50 border border-border rounded-sm px-3 py-2 pr-20 text-sm text-tx-main focus:outline-none focus:border-accent/50 disabled:opacity-50 transition-all placeholder:text-tx-muted/20 placeholder:normal-case font-bold tracking-wider"
          />
          <button
            type="submit"
            disabled={!input.trim() || cooldownRemaining > 0 || isLoading}
            className={`absolute right-3 font-black px-3 py-1 rounded text-xs transition-all tracking-widest shrink-0 ${
              cooldownRemaining > 0
                ? "text-tx-muted/40"
                : "text-accent hover:text-accent-hover"
            }`}
          >
            {cooldownRemaining > 0 ? `${cooldownRemaining}s` : "SEND"}
          </button>
        </div>
      </form>
    </div>
  );
}
