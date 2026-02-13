import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore, DEFAULT_STATE } from './store/useGameStore';
import { loadGameData, saveGameData, resetGameData } from './services/gameService';

// HOOKS (GAME ENGINE)
import { useScavengerLoop } from './hooks/useScavengerLoop';
import { useSkillLoop } from './hooks/useSkillLoop';
import { useCombatLoop } from './hooks/useCombatLoop';

// SYSTEMS
import { calculateOfflineProgress, type OfflineResults } from './systems/offlineSystem';

// TYPES & DATA
import type { SkillType, ViewType, GameSettings, GameState } from './types';
import { ACHIEVEMENTS } from './data';

// FIREBASE
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { auth, db } from './firebase'; 
import Auth from './components/Auth';

// VIEWS & MODALS
import Sidebar from './components/Sidebar';
import SkillView from './components/SkillView';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import Gamble from './components/Gamble';
import SellModal from './components/SellModal';
import AchievementsView from './components/AchievementsView';
import CombatView from './components/CombatView';
import ScavengerView from './components/ScavengerView';
import EnchantingView from './components/EnchantingView'; 
import UsernameModal from './components/UsernameModal';
import SettingsModal from './components/SettingsModal';
import OfflineSummaryModal from './components/OfflineSummaryModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('woodcutting');
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);
  
  // Offline-tilan seuranta
  const [offlineSummary, setOfflineSummary] = useState<OfflineResults | null>(null);

  // --- ZUSTAND STORE ---
  const state = useGameStore(); 
  const { 
    setState, 
    notification, 
    setNotification,
    sellItem, 
    gamble, 
    enchantItem
  } = useGameStore();

  // --- GAME ENGINE LOOPS ---
  useScavengerLoop();
  useSkillLoop();
  useCombatLoop();

  // AUTH: Seurataan kirjautumistilaa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // LOAD & OFFLINE PROGRESS: Ajetaan kun peli käynnistyy
  useEffect(() => {
    const initGame = async () => {
      if (!user) return;
      setIsDataLoaded(false);
      
      const loadedState = await loadGameData(user.uid);
      
      // Tarkistetaan ja suoritetaan offline progress
      if (loadedState && loadedState.lastTimestamp) {
        const { newState, results } = calculateOfflineProgress(loadedState);
        
        if (results.secondsPassed > 60) {
          setState(newState);
          setOfflineSummary(results); // Näyttää modalin
        } else {
          setState(loadedState);
        }
      } else {
        setState(loadedState || DEFAULT_STATE);
      }
      
      setIsDataLoaded(true);
    };

    if (!loadingAuth) initGame();
  }, [user, loadingAuth, setState]);

  // SAVE SYSTEM: Käytetään refiä staten tallentamiseen
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const handleForceSave = useCallback(async () => {
    if (!user || !isDataLoaded) return;
    setSaveStatus('saving');
    
    // Päivitetään aikaleima storeen ja tallennetaan kopio pilveen
    const now = Date.now();
    setState((prev: GameState) => ({ ...prev, lastTimestamp: now }));

    const currentState = {
      ...JSON.parse(JSON.stringify(stateRef.current)),
      lastTimestamp: now
    }; 
    
    const success = await saveGameData(user.uid, currentState);
    setSaveStatus(success ? 'saved' : 'error');
    if (success) setTimeout(() => setSaveStatus('idle'), 2000);
  }, [user, isDataLoaded, setState]);

  // AUTOSAVE & TIMESTAMP UPDATE: 30 sekunnin välein
  useEffect(() => {
    if (!user || !isDataLoaded) return;
    
    const interval = setInterval(() => {
      handleForceSave();
    }, 300000); // Pilvitallennus 5 min välein

    // Erillinen nopea aikaleimapäivitys storeen (offline-laskentaa varten jos välilehti suljetaan)
    const timestampInterval = setInterval(() => {
      setState((prev: GameState) => ({ ...prev, lastTimestamp: Date.now() }));
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(timestampInterval);
    };
  }, [user, isDataLoaded, handleForceSave, setState]);

  // --- LOCAL UI ACTIONS ---

  const handleSetUsername = async (name: string) => {
    setState((prev: GameState) => ({ ...prev, username: name }));
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { username: name }, { merge: true });
        setNotification({ message: `Identity Confirmed: ${name}`, icon: "/assets/ui/icon_check.png" });
        setTimeout(() => setNotification(null), 3000);
      } catch (e) { console.error("Failed to save username", e); }
    }
  };

  const handleUpdateSettings = (newSettings: GameSettings) => 
    setState((prev: GameState) => ({ ...prev, settings: newSettings }));

  const hardReset = async () => {
    if (confirm("This will PERMANENTLY wipe your progress. Are you sure?")) {
      if (user) await resetGameData(user.uid);
      setState(DEFAULT_STATE);
      setCurrentView('woodcutting');
    }
  };

  // KORJAUS: Poistettu initializer (isWin: boolean = false) ja korjattu tyyppi
  const handleGamble = (amount: number, callback: (isWin: boolean) => void) => {
    const isWin = gamble(amount);
    callback(isWin);
  };

  // --- RENDER ---

  if (loadingAuth) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono">Lataillaan käyttäjää...</div>;
  if (!user) return <Auth />;
  if (!isDataLoaded) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono">Synkronoidaan tallennusta...</div>;

  if (!state.username || state.username === 'Player') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative">
        <UsernameModal onConfirm={handleSetUsername} onLogout={() => signOut(auth)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* OFFLINE MODAL: Näkyy vain jos on kerättyä offline-progressia */}
      {offlineSummary && (
        <OfflineSummaryModal 
          results={offlineSummary} 
          onClose={() => setOfflineSummary(null)} 
        />
      )}

      <Sidebar 
        currentView={currentView} setView={setCurrentView}
        onReset={hardReset} onLogout={() => signOut(auth)} 
        onStopAction={() => setState((prev: GameState) => ({ ...prev, activeAction: null }))}
        onForceSave={handleForceSave} onOpenSettings={() => setShowSettings(true)}
      />

      <main className="flex-1 bg-slate-950 relative overflow-y-auto h-screen custom-scrollbar">
        {/* TALLENNUS-ILMOITUS */}
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2 pointer-events-none">
           {saveStatus === 'saving' && <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 text-[10px] text-slate-300 animate-pulse uppercase tracking-widest">Saving State...</div>}
           {saveStatus === 'saved' && <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-emerald-900/50 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Cloud Synced</div>}
        </div>

        {showSettings && (
          <SettingsModal 
            settings={state.settings} username={state.username} onUpdateSettings={handleUpdateSettings}
            onClose={() => setShowSettings(false)} onForceSave={handleForceSave} onReset={hardReset} onLogout={() => signOut(auth)}
          />
        )}

        {notification && (
          <div className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-yellow-400 p-4 rounded shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300 z-50">
            <img src={notification.icon} className="w-10 h-10 pixelated" alt="Notify" />
            <div>
              <p className="font-bold text-yellow-400 text-[10px] uppercase tracking-widest">Protocol Alert</p>
              <p className="font-bold text-sm text-white">{notification.message}</p>
            </div>
          </div>
        )}

        <SellModal itemId={selectedItemForSale} inventory={state.inventory} onClose={() => setSelectedItemForSale(null)} onSell={sellItem} />

        {/* VIEW ROUTING */}
        {currentView === 'combat' && <CombatView />}
        {currentView === 'scavenger' && <ScavengerView />}
        {currentView === 'enchanting' && (
          <EnchantingView inventory={state.inventory} equipment={state.equipment} coins={state.coins} onEnchant={enchantItem} />
        )}

        {['woodcutting', 'mining', 'fishing', 'farming', 'crafting', 'smithing', 'cooking'].includes(currentView) && (
          <SkillView skill={currentView as SkillType} />
        )}

        {currentView === 'inventory' && <Inventory onSellClick={setSelectedItemForSale} />}
        {currentView === 'shop' && <Shop />}
        {currentView === 'gamble' && <Gamble coins={state.coins} onGamble={handleGamble} />}
        {currentView === 'achievements' && <AchievementsView achievements={ACHIEVEMENTS} unlockedIds={state.unlockedAchievements} />}
      </main>
    </div>
  );
}