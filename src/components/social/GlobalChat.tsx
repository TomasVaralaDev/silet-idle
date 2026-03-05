import { useEffect, useState, useRef, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import {
  sendGlobalMessage,
  subscribeToGlobalChat,
} from "../../services/socialServices";

export default function GlobalChat({ myUid }: { myUid: string }) {
  const { social, setGlobalMessages, username } = useGameStore();
  const [input, setInput] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    return social?.globalMessages || [];
  }, [social?.globalMessages]);

  // KUUNTELIJA
  useEffect(() => {
    const unsubscribe = subscribeToGlobalChat((msgs) => {
      setGlobalMessages(msgs);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      setGlobalMessages([]);
    };
  }, [setGlobalMessages]);

  // Automaattinen skrollaus
  useEffect(() => {
    if (scrollRef.current && !isLoading) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Cooldown-logiikka
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
      await sendGlobalMessage(myUid, username, input);
      setInput("");
      setCooldownRemaining(10);
    } catch (err) {
      console.error("Tavern error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-tx-main font-sans text-left">
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-tx-muted animate-pulse font-serif italic">
              Entering the Tavern...
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

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 py-1 border-b border-border/10 hover:bg-panel/20 transition-colors"
                >
                  <span className="text-[10px] text-tx-muted font-mono mt-0.5 shrink-0 opacity-50">
                    [{timestamp}]
                  </span>
                  <div className="text-sm leading-relaxed">
                    <span
                      className={`font-bold mr-1.5 uppercase tracking-tight ${isMe ? "text-accent" : "text-warning"}`}
                    >
                      {msg.senderUsername}:
                    </span>
                    <span className="text-tx-main break-words font-medium">
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

      <form
        onSubmit={handleSend}
        className="p-3 bg-transparent border-t border-border/50"
      >
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              cooldownRemaining > 0
                ? `Waiting... (${cooldownRemaining}s)`
                : "Tell a tale..."
            }
            disabled={cooldownRemaining > 0 || isLoading}
            className="w-full bg-app-base/50 border border-border rounded px-3 py-2 text-sm text-tx-main focus:outline-none focus:border-accent/50 disabled:opacity-50 transition-all uppercase placeholder:text-tx-muted/20 placeholder:normal-case font-bold tracking-wider"
          />
          <button
            type="submit"
            disabled={!input.trim() || cooldownRemaining > 0 || isLoading}
            className={`absolute right-3 font-black px-3 py-1 rounded text-xs transition-all tracking-widest ${
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
