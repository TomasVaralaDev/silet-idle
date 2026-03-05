import { useEffect, useState, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { subscribeToChat, sendMessage } from "../../services/socialServices";
import type { ChatMessage } from "../../types";

interface Props {
  myUid: string;
  friendUid: string;
}

export default function ChatWindow({ myUid, friendUid }: Props) {
  const { setActiveChat, social } = useGameStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const dummyScrollRef = useRef<HTMLDivElement>(null);

  const friendName =
    social.friends.find((f) => f.uid === friendUid)?.username || "Friend";

  // 1. Tilaa viestit (Subscribe)
  useEffect(() => {
    const unsubscribe = subscribeToChat(myUid, friendUid, (msgs) => {
      setMessages(msgs);
      // Scrollaa alas kun uusi viesti tulee
      setTimeout(
        () => dummyScrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    });
    return () => unsubscribe();
  }, [myUid, friendUid]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(myUid, friendUid, input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-transparent border-l border-border/50 text-left font-sans">
      {/* Chat Header (Back button) */}
      <div className="bg-panel/50 p-3 flex items-center gap-3 border-b border-border/50 backdrop-blur-sm">
        <button
          onClick={() => setActiveChat(null)}
          className="text-tx-muted hover:text-accent px-2 transition-colors text-lg"
        >
          &larr;
        </button>
        <span className="font-black uppercase tracking-widest text-accent truncate">
          {friendName}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderId === myUid;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded border text-sm shadow-sm ${
                  isMe
                    ? "bg-accent/10 border-accent/30 text-accent rounded-tr-none"
                    : // MUUTOS 2: bg-panel -> bg-panel/50 (Kaverin viestikupla kuultaa läpi)
                      "bg-panel/50 border-border/50 text-tx-main rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={dummyScrollRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-border/50 bg-panel/20 flex gap-2"
      >
        {/* MUUTOS 3: bg-app-base -> bg-app-base/50 ja border-border -> border-border/50 */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TYPE MESSAGE..."
          className="flex-1 bg-app-base/50 border border-border/50 rounded px-3 py-2 text-tx-main text-xs font-bold tracking-wider focus:outline-none focus:border-accent/50 transition-colors uppercase placeholder:text-tx-muted/20"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
            input.trim()
              ? "bg-accent text-slate-950 hover:bg-accent-hover shadow-lg shadow-accent/20"
              : "bg-panel/50 text-tx-muted/40 border border-border/50 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
