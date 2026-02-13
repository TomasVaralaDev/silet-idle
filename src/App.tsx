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

export default function App() {
  // KORJAUS: 'any' vaihdettu 'ViewType' tyyppiin
  const [currentView, setCurrentView] = useState<ViewType>('woodcutting');
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // 1. Abstrahoidaan logiikka hookeihin
  const { user, loadingAuth } = useAuth();
  const { isDataLoaded, offlineSummary, setOfflineSummary } = useGameInitialization(user);
  const { saveStatus, handleForceSave } = useGameSync(user, isDataLoaded);
  
  const state = useGameStore();
  const { setState, gamble, sellItem, enchantItem, emitEvent } = useGameStore();

  // Käynnistetään keskitetty pelimoottori
  useGameEngine();

  // 2. Erityistilanteet (Latausruudut ja Kirjautuminen)
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

  // Pakotetaan käyttäjänimen valinta uusille pelaajille
  if (!state.username || state.username === 'Player') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative">
        <UsernameModal 
          onConfirm={(name) => {
            setState({ username: name });
            emitEvent('success', `Identity Confirmed: ${name}`, "/assets/ui/icon_check.png");
          }} 
          onLogout={() => signOut(auth)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden relative">
      {/* SOLID: Keskitetty ilmoitusten hallinta */}
      <NotificationManager />

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
      />

      <main className="flex-1 bg-slate-950 relative overflow-y-auto h-screen custom-scrollbar">
        {/* Pilvitallennuksen tila-indikaattori */}
        <div className="fixed top-4 right-6 z-50 pointer-events-none uppercase font-black text-[10px] tracking-tighter">
           {saveStatus === 'saving' && <span className="text-slate-500 animate-pulse">Syncing...</span>}
           {saveStatus === 'saved' && <span className="text-emerald-500">Cloud Ready</span>}
           {saveStatus === 'error' && <span className="text-red-500">Sync Error</span>}
        </div>

        {showSettings && (
          <SettingsModal 
            settings={state.settings} 
            username={state.username} 
            // KORJAUS: 'any' vaihdettu 'GameSettings' tyyppiin
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

        {/* Esineiden myyntimodali */}
        <SellModal 
          itemId={selectedItemForSale} 
          inventory={state.inventory} 
          onClose={() => setSelectedItemForSale(null)} 
          onSell={sellItem} 
        />

        {/* SOLID: ViewRouter hoitaa näkymien renderöinnin omana yksikkönään */}
        <ViewRouter 
          currentView={currentView} 
          state={state} 
          onSellClick={setSelectedItemForSale} 
          onGamble={(amt, cb) => cb(gamble(amt))} 
          onEnchant={enchantItem}
        />
      </main>
    </div>
  );
}