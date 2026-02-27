import { useEffect, useState, useCallback } from 'react'; // Lisätty useCallback
import { MailboxService } from '../../services/mailboxService';
import { useGameStore } from '../../store/useGameStore';
import type { MailMessage } from '../../types';
import { getItemById } from '../../utils/itemUtils';

interface Props {
  userId: string;
}

export default function MailboxView({ userId }: Props) {
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const setState = useGameStore((state) => state.setState);

  // 1. Memoisoidaan fetchMail, jotta se on stabiili riippuvuus
  const fetchMail = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const msgs = await MailboxService.getMessages(userId);
      setMessages(msgs);
    } catch (error) {
      console.error('Relay connection failed:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Funktio päivittyy vain jos userId vaihtuu

  // 2. Efekti on nyt puhdas ja linter-ystävällinen
  useEffect(() => {
    fetchMail();
  }, [fetchMail]);

  const handleClaim = async (msg: MailMessage) => {
    setState((state) => {
      const newCoins = state.coins + (msg.coinsAttached || 0);
      const newInventory = { ...state.inventory };

      if (msg.itemsAttached) {
        msg.itemsAttached.forEach((item) => {
          newInventory[item.itemId] =
            (newInventory[item.itemId] || 0) + item.amount;
        });
      }

      return {
        ...state,
        coins: newCoins,
        inventory: newInventory,
      };
    });

    try {
      await MailboxService.deleteMessage(userId, msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (error) {
      console.error('Failed to purge message from relay:', error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-tx-muted font-mono animate-pulse tracking-widest uppercase text-xs">
        Establishing link to Relay...
      </div>
    );

  return (
    <div className="p-4 h-full overflow-y-auto custom-scrollbar bg-app-base/20">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 opacity-50">
          <img
            src="/assets/ui/icon_mail_empty.png"
            className="w-16 h-16 mb-4 pixelated grayscale opacity-20"
            alt="Empty"
          />
          <p className="text-tx-muted font-mono uppercase tracking-widest text-xs">
            Communications array clear
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-panel border border-border p-4 rounded-lg flex items-center gap-4 hover:border-accent/50 transition-all shadow-sm group"
            >
              <div className="w-12 h-12 bg-app-base rounded flex items-center justify-center shrink-0 border border-border group-hover:border-accent/30 transition-colors">
                <img
                  src="/assets/ui/icon_mail.png"
                  className="w-8 h-8 pixelated"
                  alt="Mail"
                />
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-accent font-black text-sm uppercase tracking-tight">
                  {msg.title}
                </h4>
                <p className="text-tx-muted text-xs mt-1 leading-tight">
                  {msg.message}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.coinsAttached && (
                    <div className="flex items-center gap-1.5 text-warning font-mono text-[10px] font-bold bg-warning/10 px-2 py-1 rounded border border-warning/20">
                      <img
                        src="/assets/ui/coins.png"
                        className="w-3 h-3 pixelated"
                        alt="C"
                      />
                      +{msg.coinsAttached.toLocaleString()}
                    </div>
                  )}
                  {msg.itemsAttached?.map((item, idx) => {
                    const itemData = getItemById(item.itemId);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-tx-main font-mono text-[10px] bg-panel-hover px-2 py-1 rounded border border-border"
                      >
                        {itemData && (
                          <img
                            src={itemData.icon}
                            className="w-3 h-3 pixelated"
                            alt="I"
                          />
                        )}
                        <span className="font-bold text-accent">
                          {item.amount}x
                        </span>{' '}
                        {itemData?.name || item.itemId}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleClaim(msg)}
                className="bg-success hover:bg-success/80 text-white font-black text-[10px] uppercase px-5 py-3 rounded border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
              >
                Claim
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
