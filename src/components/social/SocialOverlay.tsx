import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useAuth } from '../../hooks/useAuth';
import FriendList from './FriendList';
import ChatWindow from './ChatWindow';
import GlobalChat from './GlobalChat';

export default function SocialOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'global'>('friends');

  // Ikkunan koon hallinta
  const [size, setSize] = useState({ w: 448, h: 576 });
  const [isResizing, setIsResizing] = useState(false);

  const activeChatId = useGameStore((state) => state.social.activeChatFriendId);
  const { user } = useAuth();

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Lasketaan teoreettinen uusi koko
      const newWidth = window.innerWidth - e.clientX - 24;
      const newHeight = window.innerHeight - e.clientY - 96;

      // Määritetään maksimirajat (näytön koko miinus marginaali, jotta kahva ei karkaa)
      const maxWidth = window.innerWidth - 48; // 48px marginaali vasempaan reunaan
      const maxHeight = window.innerHeight - 120; // 120px marginaali yläreunaan

      setSize({
        // Pidetään koko minimin (320/400) ja maksimin (maxWidth/maxHeight) välissä
        w: Math.max(320, Math.min(newWidth, maxWidth)),
        h: Math.max(400, Math.min(newHeight, maxHeight)),
      });
    };

    const stopResizing = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  if (!user) return null;

  return (
    <>
      {/* PÄÄPAINIKE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all transform hover:scale-110 border-2 border-slate-700 ${
          isOpen ? 'bg-red-600 rotate-45' : 'bg-blue-600'
        }`}
      >
        <img
          src="/assets/ui/icon_social.png"
          alt="Social"
          className="w-8 h-8 rendering-pixelated"
        />
      </button>

      {/* YKSI JA SAMA IKKUNA KAIKILLE NÄKYMILLE */}
      {isOpen && (
        <div
          style={{ width: `${size.w}px`, height: `${size.h}px` }}
          className="fixed bottom-24 right-6 z-40 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* RESIZE-KAHVA (Ylä-vasen kulma) */}
          <div
            onMouseDown={startResizing}
            className="absolute top-0 left-0 w-8 h-8 cursor-nw-resize z-50 flex items-start justify-start p-1 group"
          >
            {/* Pieni visuaalinen ilmaisin kahvassa */}
            <div className="w-2 h-2 border-l-2 border-t-2 border-slate-500 group-hover:border-blue-400 transition-colors" />
          </div>

          {/* HEADER & TABS */}
          <div className="bg-slate-900 border-b border-slate-700 flex flex-col shrink-0">
            <div className="p-3 flex justify-between items-center bg-slate-950/50">
              <h3 className="font-bold text-white text-sm">
                {activeChatId ? 'Private Message' : 'Social Hub'}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                ID: {user.uid.slice(0, 6)}...
              </span>
            </div>

            {!activeChatId && (
              <div className="flex text-sm">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`flex-1 py-3 font-bold transition-colors ${
                    activeTab === 'friends'
                      ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`flex-1 py-3 font-bold transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'global'
                      ? 'bg-slate-800 text-yellow-500 border-b-2 border-yellow-500'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src="/assets/ui/icon_tavern.png"
                    className="w-4 h-4 rendering-pixelated"
                    alt=""
                  />
                  Tavern
                </button>
              </div>
            )}
          </div>

          {/* SISÄLTÖALUE */}
          <div className="flex-1 overflow-hidden relative bg-slate-800">
            {activeChatId ? (
              <ChatWindow myUid={user.uid} friendUid={activeChatId} />
            ) : activeTab === 'friends' ? (
              <FriendList myUid={user.uid} />
            ) : (
              <GlobalChat myUid={user.uid} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
