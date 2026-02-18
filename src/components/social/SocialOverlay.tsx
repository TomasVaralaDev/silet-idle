import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useAuth } from '../../hooks/useAuth';
import FriendList from './FriendList';
import ChatWindow from './ChatWindow';
import GlobalChat from './GlobalChat'; // Importtaa uusi komponentti

export default function SocialOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  // Lisätään 'global' tab-tilaan
  const [activeTab, setActiveTab] = useState<'friends' | 'global'>('friends');

  const activeChatId = useGameStore((state) => state.social.activeChatFriendId);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 border-2 border-slate-700 ${
          isOpen ? 'bg-red-600 rotate-45' : 'bg-blue-600'
        }`}
      >
        <span className="text-2xl">💬</span>
      </button>

      {isOpen && (
        // MUUTOS: Suurempi ikkuna (w-96 -> w-[28rem], h-96 -> h-[32rem] tai jopa isompi)
        <div className="fixed bottom-24 right-6 z-40 w-[28rem] h-[36rem] bg-slate-800 border border-slate-600 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header & Tabs */}
          <div className="bg-slate-900 border-b border-slate-700 flex flex-col">
            <div className="p-3 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                🎮 Social Hub
              </h3>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                ID: {user.uid.slice(0, 6)}...
              </span>
            </div>

            {/* TAB NAVIGATION: Vain jos yksityischat EI ole auki */}
            {!activeChatId && (
              <div className="flex text-sm">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`flex-1 py-2 text-center font-bold transition-colors ${
                    activeTab === 'friends'
                      ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  Friends & Requests
                </button>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`flex-1 py-2 text-center font-bold transition-colors ${
                    activeTab === 'global'
                      ? 'bg-slate-800 text-yellow-400 border-b-2 border-yellow-400'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  Global Chat 🌍
                </button>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative bg-slate-800">
            {activeChatId ? (
              // Jos yksityischat on auki, näytä se
              <ChatWindow myUid={user.uid} friendUid={activeChatId} />
            ) : // Muuten näytä valittu tabi
            activeTab === 'friends' ? (
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
