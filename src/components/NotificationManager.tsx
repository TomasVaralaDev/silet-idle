import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameEvent } from '../types';

/**
 * Yksittäinen ilmoituskomponentti, joka hoitaa oman ajastimensa.
 */
function NotificationItem({ event, onClear }: { event: GameEvent, onClear: (id: string) => void }) {
  useEffect(() => {
    // Asetetaan ajastin 3 sekuntiin (3000ms)
    const timer = setTimeout(() => {
      onClear(event.id);
    }, 3000);

    // Siivotaan ajastin, jos komponentti poistuu ennen aikojaan (esim. klikkaus pois)
    return () => clearTimeout(timer);
  }, [event.id, onClear]);

  // Määritellään värit tyypin mukaan
  const isWarning = event.type === 'warning';
  const isError = event.type === 'error';
  const isSuccess = event.type === 'success';

  let borderColor = 'border-blue-500';
  let textColor = 'text-blue-500';
  
  if (isWarning) { borderColor = 'border-yellow-500'; textColor = 'text-yellow-500'; }
  if (isError) { borderColor = 'border-red-500'; textColor = 'text-red-500'; }
  if (isSuccess) { borderColor = 'border-emerald-500'; textColor = 'text-emerald-500'; }

  return (
    <div 
      className={`
        pointer-events-auto flex items-center gap-4 p-4 rounded-xl shadow-2xl border-l-4 min-w-[300px]
        bg-slate-900/95 backdrop-blur-md transition-all duration-300
        animate-in slide-in-from-right fade-in duration-300
        ${borderColor}
      `}
      onClick={() => onClear(event.id)}
    >
      {event.icon && (
        <div className="w-10 h-10 shrink-0 bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={event.icon} className="w-8 h-8 pixelated" alt="" />
        </div>
      )}
      
      <div className="flex-1">
        <p className={`text-[10px] uppercase font-black tracking-widest ${textColor}`}>
          {event.type}
        </p>
        <p className="text-sm font-bold text-white leading-tight">{event.message}</p>
      </div>

      <button 
        className="ml-2 text-slate-600 hover:text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); onClear(event.id); }}
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
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-2 pointer-events-none">
      {events.map((event) => (
        <NotificationItem 
          key={event.id} 
          event={event} 
          onClear={clearEvent} 
        />
      ))}
    </div>
  );
}