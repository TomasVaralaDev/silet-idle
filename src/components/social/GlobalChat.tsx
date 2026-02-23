import { useEffect, useState, useRef, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import {
  sendGlobalMessage,
  subscribeToGlobalChat,
} from '../../services/socialServices';

export default function GlobalChat({ myUid }: { myUid: string }) {
  const { social, setGlobalMessages, username } = useGameStore();
  const [input, setInput] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // 1. KORJAUS: Asetetaan oletukseksi 'true', jolloin emme tarvitse
  // setIsLoading(true) kutsua efektin sisällä.
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    return social?.globalMessages || [];
  }, [social?.globalMessages]);

  // KUUNTELIJA
  useEffect(() => {
    // 2. KORJAUS: Poistettu setIsLoading(true) täältä.
    // Tila on jo valmiiksi true, joten renderöinti alkaa suoraan latausruudulla.

    const unsubscribe = subscribeToGlobalChat((msgs) => {
      setGlobalMessages(msgs);
      setIsLoading(false); // Tämä on asynkroninen callback, joka on sallittu!
    });

    return () => {
      unsubscribe();
      setGlobalMessages([]);
    };
  }, [setGlobalMessages]);
  // Automaattinen skrollaus
  useEffect(() => {
    if (scrollRef.current && !isLoading) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Cooldown-logiikka... (pidetään samana kuin aiemmin)
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
      setInput('');
      setCooldownRemaining(10);
    } catch (err) {
      console.error('Tavern error:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-500 animate-pulse font-serif italic">
              Entering the Tavern...
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = msg.senderUid === myUid;
              const timestamp = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 py-0.5 border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 shrink-0">
                    [{timestamp}]
                  </span>
                  <div className="text-sm leading-relaxed">
                    <span
                      className={`font-bold mr-1.5 ${isMe ? 'text-blue-400' : 'text-yellow-500'}`}
                    >
                      {msg.senderUsername}:
                    </span>
                    <span className="text-white break-words">{msg.text}</span>
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
        className="p-3 bg-slate-800 border-t border-slate-700"
      >
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              cooldownRemaining > 0
                ? `Waiting... (${cooldownRemaining}s)`
                : 'Tell a tale...'
            }
            disabled={cooldownRemaining > 0 || isLoading}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || cooldownRemaining > 0 || isLoading}
            className={`absolute right-1.5 font-bold px-3 py-1 rounded text-xs transition-all ${
              cooldownRemaining > 0
                ? 'text-slate-600'
                : 'text-blue-500 hover:text-blue-400'
            }`}
          >
            {cooldownRemaining > 0 ? `${cooldownRemaining}s` : 'SEND'}
          </button>
        </div>
      </form>
    </div>
  );
}
