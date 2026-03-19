import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useGameStore, DEFAULT_STATE } from "./store/useGameStore";
import ItemTooltip from "./components/tooltips/ItemTooltip";
import { useAuth } from "./hooks/useAuth";
import { useGameInitialization } from "./hooks/useGameInitialization";
import { useGameSync } from "./hooks/useGameSync";
import { useGameEngine } from "./hooks/useGameEngine";

import type { ViewType, GameSettings } from "./types";
import SocialOverlay from "./components/social/SocialOverlay";
import Sidebar from "./components/Sidebar";
import ViewRouter from "./components/ViewRouter";
import NotificationManager from "./components/NotificationManager";
import OfflineSummaryModal from "./components/modals/OfflineSummaryModal";
import SellModal from "./components/modals/SellModal";
import UsernameModal from "./components/modals/UsernameModal";
import SettingsModal from "./components/modals/SettingsModal";
import RewardModal from "./components/modals/RewardModal";
import UserConfigModal from "./components/modals/UserConfigModal";
import QuestModal from "./components/quests/QuestModal";
import Auth from "./components/Auth";
import DevManager from "./components/DevManager";

import { Menu, X } from "lucide-react";

const THEMES = [
  "theme-neon",
  "theme-tavern",
  "theme-abyss",
  "theme-frost",
  "theme-arcane",
  "theme-sakura",
  "theme-matte",
  "theme-hc",
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("woodcutting");
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(
    null,
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loadingAuth } = useAuth();
  const { isDataLoaded } = useGameInitialization(user);
  const { saveStatus, handleForceSave } = useGameSync(user, isDataLoaded);

  const {
    username,
    avatar,
    settings,
    inventory,
    setState,
    sellItem,
    emitEvent,
    offlineSummary,
    setOfflineSummary,
  } = useGameStore();

  const fullState = useGameStore();

  useEffect(() => {
    const currentTheme = settings?.theme || "theme-neon";
    if (!document.body.classList.contains(currentTheme)) {
      document.body.classList.remove(...THEMES);
      document.body.classList.add(currentTheme);
    }
  }, [settings?.theme]);

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
          onSave={(name: string, avatarUrl: string, newTheme: string) => {
            setState((state) => ({
              username: name,
              avatar: avatarUrl,
              settings: {
                ...(state.settings || DEFAULT_STATE.settings),
                theme: newTheme,
              },
            }));
            emitEvent(
              "info",
              `Identity & Theme Updated`,
              "/assets/ui/icon_check.png",
            );
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

      {/* --- MOBIILI HEADER --- */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-panel/90 backdrop-blur-md z-50 sticky top-0">
        <h1 className="text-xl font-bold uppercase tracking-widest flex items-center gap-1">
          Time<span className="text-accent">Ring</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded bg-panel hover:bg-panel-hover border border-border transition-colors"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-accent" />
          ) : (
            <Menu size={20} className="text-accent" />
          )}
        </button>
      </div>

      {/* --- SIDEBAR WRAPPER --- */}
      <div
        className={`
        fixed inset-0 top-[65px] md:top-0 z-[60] bg-black/80 md:bg-transparent md:relative md:flex md:w-72 md:translate-x-0 transition-transform duration-300 ease-in-out backdrop-blur-sm md:backdrop-blur-none
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar
          currentView={currentView}
          setView={(v) => {
            setCurrentView(v);
            setIsMobileMenuOpen(false);
          }}
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
      </div>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 bg-app-base relative overflow-y-auto custom-scrollbar h-[calc(100vh-65px)] md:h-screen">
        <div className="fixed top-4 right-6 z-[40] pointer-events-none uppercase font-black text-[10px] tracking-tighter text-right hidden md:block">
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
