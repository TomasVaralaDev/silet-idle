import { useEffect, useState, useCallback } from "react";
import { MailboxService } from "../../services/mailboxService";
import { useGameStore } from "../../store/useGameStore";
import type { MailMessage } from "../../types";
import { getItemById } from "../../utils/itemUtils";

interface Props {
  userId: string;
}

export default function MailboxView({ userId }: Props) {
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const setState = useGameStore((state) => state.setState);

  // Fetch pending messages from the relay service
  const fetchMail = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const msgs = await MailboxService.getMessages(userId);
      setMessages(msgs);
    } catch (error) {
      console.error("Relay connection failed:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMail();
  }, [fetchMail]);

  // Transfer attached coins and items to the local game store state
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
      // Remove message from the database after successful state transfer
      await MailboxService.deleteMessage(userId, msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (error) {
      console.error("Failed to purge message from relay:", error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-tx-muted font-mono animate-pulse tracking-widest uppercase text-xs">
        Running to mailbox...
      </div>
    );

  return (
    <div className="p-2 sm:p-4 h-full overflow-y-auto custom-scrollbar bg-app-base/20">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 opacity-50">
          <img
            src="./assets/ui/icon_mail.png"
            className="w-12 h-12 sm:w-16 sm:h-16 mb-4 pixelated grayscale opacity-20"
            alt="Empty"
          />
          <p className="text-tx-muted font-mono uppercase tracking-widest text-[10px] sm:text-xs">
            No new mail...
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-panel border border-border p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:border-accent/50 transition-all shadow-sm group"
            >
              {
                // Content section: Groups icon, text, and attachments
              }
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-app-base rounded flex items-center justify-center shrink-0 border border-border group-hover:border-accent/30 transition-colors">
                  <img
                    src="./assets/ui/icon_mail.png"
                    className="w-6 h-6 sm:w-8 sm:h-8 pixelated"
                    alt="Mail"
                  />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-accent font-black text-xs sm:text-sm uppercase tracking-tight truncate">
                    {msg.title}
                  </h4>
                  <p className="text-tx-muted text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-tight">
                    {msg.message}
                  </p>

                  {
                    // Visual list of attached rewards
                  }
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {msg.coinsAttached && (
                      <div className="flex items-center gap-1.5 text-warning font-mono text-[9px] sm:text-[10px] font-bold bg-warning/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-warning/20">
                        <img
                          src="./assets/ui/coins.png"
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 pixelated"
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
                          className="flex items-center gap-1.5 text-tx-main font-mono text-[9px] sm:text-[10px] bg-panel-hover px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-border"
                        >
                          {itemData && (
                            <img
                              src={itemData.icon}
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 pixelated"
                              alt="I"
                            />
                          )}
                          <span className="font-bold text-accent">
                            {item.amount}x
                          </span>{" "}
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {itemData?.name || item.itemId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {
                // Claim Button: Full width on mobile for better ergonomics
              }
              <button
                onClick={() => handleClaim(msg)}
                className="w-full sm:w-auto mt-1 sm:mt-0 bg-success hover:bg-success/80 text-white font-black text-[10px] uppercase px-5 py-2.5 sm:py-3 rounded border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all shadow-lg shrink-0"
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
