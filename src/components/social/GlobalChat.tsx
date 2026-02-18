import { useEffect, useState, useRef, useMemo } from 'react'; // LISÄTTY useMemo
import { useGameStore } from '../../store/useGameStore';
import {
  sendGlobalMessage,
  subscribeToGlobalChat,
} from '../../services/socialServices';

export default function GlobalChat({ myUid }: { myUid: string }) {
  const { social, setGlobalMessages, username } = useGameStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // KORJAUS: Muistetaan viestit, jotta uusi [] ei luoda turhaan joka renderöinnillä
  const messages = useMemo(() => {
    return social?.globalMessages || [];
  }, [social?.globalMessages]);

  // Tilaa viestit kun komponentti avataan
  useEffect(() => {
    const unsub = subscribeToGlobalChat((msgs) => {
      setGlobalMessages(msgs);
    });
    return () => unsub();
  }, [setGlobalMessages]);

  // Skrollaa alas aina kun viestit päivittyvät
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Nyt 'messages' on vakaa dependenssi

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendGlobalMessage(myUid, username, input);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderUid === myUid;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-baseline gap-2 mb-0.5">
                {!isMe && (
                  <span className="text-[10px] text-yellow-500 font-bold">
                    {msg.senderUsername}
                  </span>
                )}
                <span className="text-[9px] text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div
                className={`max-w-[85%] px-3 py-1.5 rounded-lg text-sm break-words ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-700 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something to everyone..."
          className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-4 py-2 rounded text-sm transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
