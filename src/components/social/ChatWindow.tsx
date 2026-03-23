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

  useEffect(() => {
    const unsubscribe = subscribeToChat(myUid, friendUid, (msgs) => {
      setMessages(msgs);
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
    <div className="flex flex-col h-full bg-transparent border-l border-border/50 text-left font-sans overflow-hidden">
      {/* Chat Header */}
      <div className="bg-panel/50 p-3 flex items-center gap-3 border-b border-border/50 backdrop-blur-sm shrink-0">
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
                className={`max-w-[85%] px-3 py-2 rounded border text-sm shadow-sm break-words whitespace-pre-wrap ${
                  isMe
                    ? "bg-accent/10 border-accent/30 text-accent rounded-tr-none"
                    : "bg-panel/50 border-border/50 text-tx-main rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={dummyScrollRef} />
      </div>

      {/* Input Area - MUOKATTU TÄSMÄÄMÄÄN GLOBAL CHATTIIN */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-border/50 bg-panel/20 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE MESSAGE..."
            className="w-full bg-app-base/50 border border-border/50 rounded-sm px-3 py-2 pr-16 text-tx-main text-xs font-bold tracking-wider focus:outline-none focus:border-accent/50 transition-all placeholder:text-tx-muted/20"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 font-black px-3 py-1 rounded text-xs transition-all tracking-widest ${
              input.trim()
                ? "text-accent hover:text-accent-hover"
                : "text-tx-muted/40 cursor-not-allowed"
            }`}
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  );
}
