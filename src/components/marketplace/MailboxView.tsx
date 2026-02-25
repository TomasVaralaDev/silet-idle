import { useEffect, useState } from "react";
import { MailboxService } from "../../services/mailboxService";
import { useGameStore } from "../../store/useGameStore";
// 1. KORJAUS: Lisätty 'type' importtiin
import type { MailMessage } from "../../types";
import { getItemById } from "../../utils/itemUtils";

interface Props {
  userId: string;
}

export default function MailboxView({ userId }: Props) {
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. KORJAUS: Tuodaan setState storesta erillisten funktioiden sijaan
  const setState = useGameStore((state) => state.setState);

  const fetchMail = async () => {
    setLoading(true);
    const msgs = await MailboxService.getMessages(userId);
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => {
    fetchMail();
  }, [userId]);

  const handleClaim = async (msg: MailMessage) => {
    // 1. Päivitetään lokaali tila (Store) yhdellä setState-kutsulla
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

    // 2. Poistetaan viesti Firebasesta
    await MailboxService.deleteMessage(userId, msg.id);

    // 3. Päivitetään UI:sta kyseinen viesti pois
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500 font-mono animate-pulse">
        Checking mailbox...
      </div>
    );

  return (
    <div className="p-4 h-full overflow-y-auto custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 opacity-50">
          <img
            src="/assets/ui/icon_mail_empty.png"
            className="w-16 h-16 mb-4 pixelated grayscale"
            alt="Empty"
          />
          <p className="text-slate-400 font-mono uppercase tracking-widest text-xs">
            Mailbox is empty
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-slate-900 border border-slate-700 p-4 rounded flex items-center gap-4 hover:border-slate-500 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center shrink-0 border border-slate-700">
                <img
                  src="/assets/ui/icon_mail.png"
                  className="w-8 h-8 pixelated"
                  alt="Mail"
                />
              </div>

              <div className="flex-1">
                <h4 className="text-cyan-400 font-bold text-sm uppercase">
                  {msg.title}
                </h4>
                <p className="text-slate-400 text-xs">{msg.message}</p>

                {/* Liitteet */}
                <div className="flex gap-3 mt-2">
                  {msg.coinsAttached && (
                    <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
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
                        className="flex items-center gap-1 text-slate-300 font-mono text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700"
                      >
                        {itemData && (
                          <img
                            src={itemData.icon}
                            className="w-3 h-3 pixelated"
                            alt="I"
                          />
                        )}
                        {item.amount}x {itemData?.name || item.itemId}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleClaim(msg)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase px-4 py-3 rounded border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
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
