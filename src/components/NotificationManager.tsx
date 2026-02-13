import { useGameStore } from '../store/useGameStore';

export default function NotificationManager() {
  const { events, clearEvent } = useGameStore();

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {events.map((event) => (
        <div 
          key={event.id}
          className={`
            pointer-events-auto flex items-center gap-4 p-4 rounded-xl shadow-2xl border-l-4 min-w-[300px]
            animate-in slide-in-from-right duration-300
            ${event.type === 'warning' ? 'bg-slate-900 border-yellow-500' : 'bg-slate-900 border-blue-500'}
          `}
          onClick={() => clearEvent(event.id)}
        >
          {event.icon && <img src={event.icon} className="w-10 h-10 pixelated" alt="" />}
          <div>
            <p className={`text-[10px] uppercase font-black tracking-widest ${event.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
              {event.type}
            </p>
            <p className="text-sm font-bold text-white">{event.message}</p>
          </div>
          <button 
            className="ml-auto text-slate-500 hover:text-white text-xs"
            onClick={(e) => { e.stopPropagation(); clearEvent(event.id); }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}