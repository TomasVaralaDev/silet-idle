import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type { GameEvent } from "../types";

/**
 * Yksittäinen ilmoituskomponentti, joka hoitaa oman ajastimensa.
 */
function NotificationItem({
  event,
  onClear,
}: {
  event: GameEvent;
  onClear: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClear(event.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [event.id, onClear]);

  // Dynaaminen tyylitys eventin tyypin mukaan
  const getStyles = () => {
    switch (event.type) {
      case "warning":
        return { border: "border-warning", text: "text-warning" };
      case "error":
        return { border: "border-danger", text: "text-danger" };
      case "success":
        return { border: "border-success", text: "text-success" };
      default:
        return { border: "border-accent", text: "text-accent" };
    }
  };

  const { border, text } = getStyles();

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-4 p-4 rounded-xl shadow-2xl border-l-4 min-w-[320px]
        bg-panel/95 backdrop-blur-md transition-all duration-300
        animate-in slide-in-from-right fade-in duration-300
        ${border}
      `}
      onClick={() => onClear(event.id)}
    >
      {event.icon && (
        <div className="w-10 h-10 shrink-0 bg-app-base/40 rounded-lg flex items-center justify-center overflow-hidden border border-border/20 shadow-inner">
          <img
            src={event.icon}
            className="w-8 h-8 pixelated drop-shadow-md"
            alt=""
          />
        </div>
      )}

      <div className="flex-1 text-left">
        <p
          className={`text-[9px] uppercase font-black tracking-[0.2em] mb-0.5 ${text}`}
        >
          {event.type}
        </p>
        <p className="text-sm font-bold text-tx-main leading-tight tracking-tight">
          {event.message}
        </p>
      </div>

      <button
        className="ml-2 text-tx-muted/50 hover:text-tx-main transition-colors p-1"
        onClick={(e) => {
          e.stopPropagation();
          onClear(event.id);
        }}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Pääkomponentti, joka listaa ilmoitukset.
 */
export default function NotificationManager() {
  const { events, clearEvent } = useGameStore();

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
      {events.map((event) => (
        <NotificationItem key={event.id} event={event} onClear={clearEvent} />
      ))}
    </div>
  );
}
