import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useGameStore, DEFAULT_STATE } from "./store/useGameStore";
import ItemTooltip from "./components/tooltips/ItemTooltip"; // CUSTOM HOOKS
import { useAuth } from "./hooks/useAuth";
import { useGameInitialization } from "./hooks/useGameInitialization";
import { useGameSync } from "./hooks/useGameSync";
import { useGameEngine } from "./hooks/useGameEngine";

// TYPES & DATA
import type { ViewType, GameSettings } from "./types";

// COMPONENTS
import SocialOverlay from "./components/social/SocialOverlay";
import Sidebar from "./components/Sidebar";
import ViewRouter from "./components/ViewRouter";
import NotificationManager from "./components/NotificationManager";

// MODALS (Siirretty uuteen kansioon)
import OfflineSummaryModal from "./components/modals/OfflineSummaryModal";
import SellModal from "./components/modals/SellModal";
import UsernameModal from "./components/modals/UsernameModal";
import SettingsModal from "./components/modals/SettingsModal";
import RewardModal from "./components/modals/RewardModal";
import UserConfigModal from "./components/modals/UserConfigModal";
import QuestModal from "./components/quests/QuestModal";

import Auth from "./components/Auth";

//DEV MANAGER POISTA PRODIIN
import DevManager from "./components/DevManager";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("woodcutting");
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(
    null,
  );

  const [showSettings, setShowSettings] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  // 1. Hookit
  const { user, loadingAuth } = useAuth();
  const { isDataLoaded, offlineSummary, setOfflineSummary } =
    useGameInitialization(user);
  const { saveStatus, handleForceSave } = useGameSync(user, isDataLoaded);

  const {
    username,
    avatar,
    settings,
    inventory,
    setState,
    sellItem,
    emitEvent,
  } = useGameStore();

  const fullState = useGameStore();

  useGameEngine();

  if (loadingAuth)
    return (
      <div className="min-h-screen bg-app-base text-tx-main flex items-center justify-center font-mono uppercase tracking-widest">
        Getting out of bed...
      </div>
    );

  if (!user) return <Auth />;

  if (!isDataLoaded)
    return (
      <div className="min-h-screen bg-app-base text-tx-main flex items-center justify-center font-mono uppercase tracking-widest">
        Syncing Save Data...
      </div>
    );

  if (!username || username === "Player") {
    return (
      <div className="min-h-screen bg-app-base flex items-center justify-center relative">
        <UsernameModal
          // LISÄTTY: Tyyppimäärittelyt name ja avatarUrl parametreille
          onConfirm={(name: string, avatarUrl: string) => {
            setState({ username: name, avatar: avatarUrl });
            emitEvent(
              "success",
              `Identity Confirmed: ${name}`,
              "/assets/ui/icon_check.png",
            );
          }}
          onLogout={() => signOut(auth)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-base text-tx-main font-sans flex flex-col md:flex-row overflow-hidden relative">
      <NotificationManager />
      <RewardModal />
      <QuestModal isOpen={showQuests} onClose={() => setShowQuests(false)} />

      {showUserConfig && (
        <UserConfigModal
          currentUsername={username}
          currentAvatar={avatar}
          // LISÄTTY: Tyyppimäärittelyt name ja avatarUrl parametreille
          onSave={(name: string, avatarUrl: string) => {
            setState({ username: name, avatar: avatarUrl });
            emitEvent("info", `Identity Updated`, "/assets/ui/icon_check.png");
          }}
          onClose={() => setShowUserConfig(false)}
        />
      )}

      {offlineSummary && (
        <OfflineSummaryModal
          results={offlineSummary}
          onClose={() => setOfflineSummary(null)}
        />
      )}

      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        onReset={() =>
          confirm("Reset all progress?") && setState(DEFAULT_STATE)
        }
        onLogout={() => signOut(auth)}
        onStopAction={() => setState({ activeAction: null })}
        onForceSave={handleForceSave}
        onOpenSettings={() => setShowSettings(true)}
        onOpenUserConfig={() => setShowUserConfig(true)}
        onOpenQuests={() => setShowQuests(true)}
      />

      <main className="flex-1 bg-app-base relative overflow-y-auto h-screen custom-scrollbar">
        <div className="fixed top-4 right-6 z-50 pointer-events-none uppercase font-black text-[10px] tracking-tighter text-right">
          {saveStatus === "saving" && (
            <span className="text-tx-muted animate-pulse">Syncing...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-success">Cloud Ready</span>
          )}
          {saveStatus === "error" && (
            <span className="text-danger">Sync Error</span>
          )}
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
        />
      </main>
      <SocialOverlay />
      <DevManager />
      <ItemTooltip />
    </div>
  );
}
