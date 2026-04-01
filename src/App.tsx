import { useState, useEffect } from "react";
import { signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "./firebase";
import { useGameStore, DEFAULT_STATE } from "./store/useGameStore";
import ItemTooltip from "./components/tooltips/ItemTooltip";
import { useAuth } from "./hooks/useAuth";
import { useGameInitialization } from "./hooks/useGameInitialization";
import { useGameSync } from "./hooks/useGameSync";
import { useGameEngine } from "./hooks/useGameEngine";

import type { ViewType } from "./types";
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
import TutorialOverlay from "./components/TutorialOverlay";

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
  // Global UI States
  const [currentView, setCurrentView] = useState<ViewType>("inventory");
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(
    null,
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hook-driven Subsystems
  const { user, loadingAuth } = useAuth();
  const { isDataLoaded } = useGameInitialization(user);
  const { saveStatus, handleForceSave } = useGameSync(user, isDataLoaded);

  // Global Game Store mapping
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
    updateUserProfile,
  } = useGameStore();

  // Apply visual theme to document body
  useEffect(() => {
    const currentTheme = settings?.theme || "theme-neon";
    if (!document.body.classList.contains(currentTheme)) {
      document.body.classList.remove(...THEMES);
      document.body.classList.add(currentTheme);
    }
  }, [settings?.theme]);

  // Boot up the main 100ms game loop
  useGameEngine();

  const handleReportBug = () => {
    window.open("https://forms.gle/SdJ7jWvqD3m6FFgd9", "_blank");
  };

  /**
   * handleDeleteAccount
   * Securely purges user document from Firestore and deletes the Firebase Auth identity.
   */
  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);
      await deleteUser(user);

      setState(DEFAULT_STATE);
      setShowSettings(false);
    } catch (error: unknown) {
      console.error("Error deleting account:", error);

      // Firebase mandates fresh credentials for destructive actions
      if (
        error instanceof FirebaseError &&
        error.code === "auth/requires-recent-login"
      ) {
        emitEvent(
          "error",
          "Security requirement: Please log out and log back in to delete your account.",
          "./assets/ui/icon_error.png",
        );
      } else {
        emitEvent(
          "error",
          "Account deletion failed. Please contact support.",
          "./assets/ui/icon_error.png",
        );
      }
    }
  };

  // ---------------------------------------------------------------------------
  // INITIALIZATION GUARDS
  // Prevent rendering the UI until Auth and Cloud Data are completely resolved
  // ---------------------------------------------------------------------------
  if (loadingAuth)
    return (
      <div className="min-h-[100dvh] bg-app-base text-tx-main flex items-center justify-center font-mono uppercase tracking-widest">
        Getting out of bed...
      </div>
    );

  if (!user) return <Auth />;

  if (!isDataLoaded)
    return (
      <div className="min-h-[100dvh] bg-app-base text-tx-main flex items-center justify-center font-mono uppercase tracking-widest">
        Syncing Save Data...
      </div>
    );

  // Force new users through the character creation flow
  if (!username || username === "Player") {
    return (
      <div className="min-h-[100dvh] bg-app-base flex items-center justify-center relative">
        <UsernameModal
          onConfirm={(
            name: string,
            avatarUrl: string,
            initialTheme: string,
          ) => {
            setState({
              username: name,
              avatar: avatarUrl,
              settings: {
                ...DEFAULT_STATE.settings,
                theme: initialTheme,
                chatColor: "default",
              },
            });
            emitEvent(
              "success",
              `Identity Confirmed: ${name}`,
              "./assets/ui/icon_check.png",
            );
          }}
          onLogout={() => signOut(auth)}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN GAME UI RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="h-[100dvh] w-full bg-app-base text-tx-main font-sans flex flex-col md:flex-row overflow-hidden relative">
      {/* Global Overlays & Notifications */}
      <NotificationManager />
      <RewardModal />
      <QuestModal isOpen={showQuests} onClose={() => setShowQuests(false)} />

      {showUserConfig && (
        <UserConfigModal
          currentUsername={username}
          currentAvatar={avatar}
          onSave={async (
            name: string,
            avatarUrl: string,
            newTheme: string,
            newChatColor: string,
          ) => {
            const success = await updateUserProfile(
              name,
              avatarUrl,
              newTheme,
              newChatColor,
            );
            if (success) {
              setShowUserConfig(false);
            }
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

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex shrink-0 items-center justify-between p-4 border-b border-border/50 bg-panel/90 backdrop-blur-md z-50">
        <h1 className="text-xl font-bold uppercase tracking-widest flex items-center gap-1">
          Nexus<span className="text-accent">Idle</span>
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

      {/* Left Sidebar Navigation */}
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

      {/* Main Dynamic Viewport */}
      <main className="flex-1 bg-app-base relative overflow-y-auto custom-scrollbar h-full min-h-0">
        {/* Floating Cloud Sync Indicator */}
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
            username={username}
            onClose={() => setShowSettings(false)}
            onReset={() => {
              setState(DEFAULT_STATE);
              setShowSettings(false);
            }}
            onDeleteAccount={handleDeleteAccount}
            onReportBug={handleReportBug}
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
          onSellClick={setSelectedItemForSale}
        />
      </main>

      <TutorialOverlay />
      <SocialOverlay />
      <ItemTooltip />
    </div>
  );
}
