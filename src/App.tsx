import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useGameStore, DEFAULT_STATE } from './store/useGameStore';

// CUSTOM HOOKS
import { useAuth } from './hooks/useAuth';
import { useGameInitialization } from './hooks/useGameInitialization';
import { useGameSync } from './hooks/useGameSync';
import { useGameEngine } from './hooks/useGameEngine';

// TYPES & DATA
import type { ViewType, GameSettings } from './types';

// COMPONENTS
import Sidebar from './components/Sidebar';
import ViewRouter from './components/ViewRouter';
import NotificationManager from './components/NotificationManager';
import OfflineSummaryModal from './components/OfflineSummaryModal';
import SellModal from './components/SellModal';
import UsernameModal from './components/UsernameModal';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';
import RewardModal from './components/RewardModal';
import UserConfigModal from './components/UserConfigModal'; 

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('woodcutting');
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);

  // 1. Hookit
  const { user, loadingAuth } = useAuth();
  const { isDataLoaded, offlineSummary, setOfflineSummary } = useGameInitialization(user);
  const { saveStatus, handleForceSave } = useGameSync(user, isDataLoaded);
  
  // KORJAUS: Poistettu 'activeAction' tästä listasta, koska sitä ei käytetä tässä komponentissa
  const { 
    username, 
    avatar, 
    settings, 
    inventory, 
    setState, 
    gamble, 
    sellItem, 
    emitEvent 
  } = useGameStore();
  
  // Käytetään koko storea ViewRouterille
  const fullState = useGameStore();

  useGameEngine();

  // 2. Erityistilanteet
  if (loadingAuth) return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono uppercase tracking-widest">
      Initializing Neural Links...
    </div>
  );

  if (!user) return <Auth />;

  if (!isDataLoaded) return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono uppercase tracking-widest">
      Syncing Save Data...
    </div>
  );

  // Käyttäjänimen valinta (ensikertalaiselle)
  if (!username || username === 'Player') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative">
        <UsernameModal 
          onConfirm={(name, avatarUrl) => {
            setState({ username: name, avatar: avatarUrl });
            emitEvent('success', `Identity Confirmed: ${name}`, "/assets/ui/icon_check.png");
          }} 
          onLogout={() => signOut(auth)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden relative">
      <NotificationManager />
      <RewardModal />

      {/* User Config Modal */}
      {showUserConfig && (
        <UserConfigModal
          currentUsername={username}
          currentAvatar={avatar}
          onSave={(name, avatarUrl) => {
            setState({ username: name, avatar: avatarUrl });
            emitEvent('info', `Identity Updated`, "/assets/ui/icon_check.png");
          }}
          onClose={() => setShowUserConfig(false)}
        />
      )}

      {/* Offline Progressin yhteenveto */}
      {offlineSummary && (
        <OfflineSummaryModal 
          results={offlineSummary} 
          onClose={() => setOfflineSummary(null)} 
        />
      )}

      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView}
        onReset={() => confirm("Reset all progress?") && setState(DEFAULT_STATE)} 
        onLogout={() => signOut(auth)} 
        onStopAction={() => setState({ activeAction: null })}
        onForceSave={handleForceSave} 
        onOpenSettings={() => setShowSettings(true)}
        onOpenUserConfig={() => setShowUserConfig(true)}
      />

      <main className="flex-1 bg-slate-950 relative overflow-y-auto h-screen custom-scrollbar">
        <div className="fixed top-4 right-6 z-50 pointer-events-none uppercase font-black text-[10px] tracking-tighter">
           {saveStatus === 'saving' && <span className="text-slate-500 animate-pulse">Syncing...</span>}
           {saveStatus === 'saved' && <span className="text-emerald-500">Cloud Ready</span>}
           {saveStatus === 'error' && <span className="text-red-500">Sync Error</span>}
        </div>

        {showSettings && (
          <SettingsModal 
            settings={settings} 
            username={username} 
            onUpdateSettings={(s: GameSettings) => setState({ settings: s })}
            onClose={() => setShowSettings(false)} 
            onForceSave={handleForceSave} 
            onReset={() => {
              if (confirm("This will PERMANENTLY wipe your save. Continue?")) {
                setState(DEFAULT_STATE);
                setShowSettings(false);
              }
            }} 
            onLogout={() => signOut(auth)}
          />
        )}

        <SellModal 
          itemId={selectedItemForSale} 
          inventory={inventory} 
          onClose={() => setSelectedItemForSale(null)} 
          onSell={sellItem} 
        />

        <ViewRouter 
          currentView={currentView} 
          state={fullState} 
          onSellClick={setSelectedItemForSale} 
          onGamble={gamble} 
        />
      </main>
    </div>
  );
}