import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { subscribeToChat, sendMessage } from '../../services/socialServices';
import type { ChatMessage } from '../../types';

interface Props {
  myUid: string;
  friendUid: string;
}

export default function ChatWindow({ myUid, friendUid }: Props) {
  const { setActiveChat, social } = useGameStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const dummyScrollRef = useRef<HTMLDivElement>(null);

  const friendName =
    social.friends.find((f) => f.uid === friendUid)?.username || 'Friend';

  // 1. Tilaa viestit (Subscribe)
  useEffect(() => {
    const unsubscribe = subscribeToChat(myUid, friendUid, (msgs) => {
      setMessages(msgs);
      // Scrollaa alas kun uusi viesti tulee
      setTimeout(
        () => dummyScrollRef.current?.scrollIntoView({ behavior: 'smooth' }),
        100,
      );
    });
    return () => unsubscribe();
  }, [myUid, friendUid]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(myUid, friendUid, input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Chat Header (Back button) */}
      <div className="bg-slate-800 p-2 flex items-center gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveChat(null)}
          className="text-slate-400 hover:text-white px-2"
        >
          &larr;
        </button>
        <span className="font-bold text-white truncate">{friendName}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === myUid;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  isMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200'
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
        className="p-2 border-t border-slate-700 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}
