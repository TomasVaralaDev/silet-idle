import { useState, useRef, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { SKILL_DEFINITIONS } from "../config/skillDefinitions";
import type { ViewType } from "../types";
import { formatNumber } from "../utils/formatUtils";
import { getRequiredXpForLevel } from "../utils/gameUtils";
import QueuePanel from "./QueuePanel"; // UUSI: Importtaa QueuePanel!

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onReset: () => void;
  onLogout: () => void;
  onStopAction: () => void;
  onForceSave: () => void;
  onOpenSettings: () => void;
  onOpenUserConfig: () => void;
  onOpenQuests: () => void;
}

// --- HELPER COMPONENTS ---

interface NavButtonProps {
  view: ViewType;
  icon: string;
  label: string;
  isActive: boolean;
  level?: number;
  onClick: (view: ViewType) => void;
}

function NavButton({
  view,
  icon,
  label,
  isActive,
  level,
  onClick,
}: NavButtonProps) {
  return (
    <button
      onClick={() => onClick(view)}
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group mb-1
        ${
          isActive
            ? "bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_rgb(var(--color-accent)/0.2)]"
            : "text-tx-muted hover:bg-panel-hover hover:text-tx-main border border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <img
          src={icon}
          className={`w-5 h-5 pixelated transition-transform group-hover:scale-110 ${
            isActive ? "brightness-125" : "opacity-70 group-hover:opacity-100"
          }`}
          alt=""
        />
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      {level !== undefined && (
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
            isActive ? "bg-accent/10 text-accent" : "bg-panel text-tx-muted/80"
          }`}
        >
          Lv.{level}
        </span>
      )}
    </button>
  );
}

interface StatRowProps {
  label: string;
  level: number;
  xp: number;
  iconPath: string;
  textColor: string;
  bgColor: string;
}

const StatRow = ({
  label,
  level,
  xp,
  iconPath,
  textColor,
  bgColor,
}: StatRowProps) => {
  const nextLevelXp = getRequiredXpForLevel(level);
  const progress = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));

  return (
    <div
      className="py-2 group cursor-help"
      title={`${Math.floor(xp)} / ${nextLevelXp} XP`}
    >
      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
        <div className="flex items-center gap-2">
          <img
            src={iconPath}
            alt={label}
            className="w-5 h-5 pixelated opacity-80"
          />
          <span className="text-tx-muted uppercase tracking-tight font-bold">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-tx-muted/70 opacity-0 group-hover:opacity-100 transition-opacity">
            {progress.toFixed(1)}%
          </span>
          <span className={`font-bold text-sm ${textColor}`}>L.{level}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-app-base/80 overflow-hidden border border-border/50 rounded-sm">
        <div
          className={`h-full ${bgColor} opacity-90`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function Sidebar({
  currentView,
  setView,
  onReset,
  onLogout,
  onStopAction,
  onForceSave,
  onOpenSettings,
  onOpenUserConfig,
  onOpenQuests,
}: SidebarProps) {
  const coins = useGameStore((state) => state.coins);
  const skills = useGameStore((state) => state.skills);
  const username = useGameStore((state) => state.username);
  const avatar = useGameStore((state) => state.avatar);
  const quests = useGameStore((state) => state.quests);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [saveCooldown, setSaveCooldown] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let timer: number;
    if (saveCooldown > 0)
      timer = window.setInterval(() => setSaveCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [saveCooldown]);

  const handleForceSaveClick = () => {
    if (saveCooldown === 0) {
      onForceSave();
      setSaveCooldown(60);
    }
  };

  const totalLevel = (Object.values(skills) as { level: number }[]).reduce(
    (acc, s) => acc + s.level,
    0,
  );

  const hasCompletableQuests = quests.dailyQuests.some(
    (q) => q.isCompleted && !q.isClaimed,
  );

  return (
    <nav className="w-full md:w-72 bg-app-base border-r border-border/50 flex-shrink-0 flex flex-col h-screen z-10 overflow-hidden relative font-sans">
      {/* HEADER */}
      <div className="p-5 border-b border-border/50 bg-app-base relative z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-bold text-tx-main tracking-widest uppercase flex flex-col leading-none">
              Time<span className="text-accent text-3xl">Ring</span>
            </h1>
            <span className="text-[10px] text-tx-muted/70 tracking-[0.3em] uppercase mt-1">
              System v1.0
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-panel p-2 rounded border border-border transition-all"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-tx-main truncate max-w-[100px]">
                  {username || "Restorer"}
                </div>
                <div className="text-[10px] text-accent font-mono">
                  Level: {totalLevel}
                </div>
              </div>
              <div className="w-10 h-10 bg-panel rounded border border-border-hover flex items-center justify-center relative overflow-hidden text-left">
                <img
                  src={avatar || "/assets/ui/icon_user_avatar.png"}
                  alt="User"
                  className="w-full h-full object-cover pixelated"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=U&background=0f172a")
                  }
                />
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-panel border border-border-hover rounded-xl shadow-2xl z-[100] p-2 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenUserConfig();
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-panel-hover text-xs font-bold text-tx-main flex items-center gap-3"
                >
                  <span className="text-base">👤</span> User Settings
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-panel-hover text-xs font-bold text-tx-main flex items-center gap-3"
                >
                  <span className="text-base">⚙️</span> Settings
                </button>
                <div className="h-px bg-border/50 my-1 mx-2"></div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 rounded hover:bg-danger/10 text-xs font-bold text-danger flex items-center gap-3"
                >
                  <span className="text-base">🔌</span> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FRAGMENTS & QUESTS ROW */}
        <div className="flex gap-2">
          <div className="bg-panel/50 p-3 border border-border/50 flex items-center justify-between flex-1 rounded overflow-hidden">
            <div className="flex items-center gap-3 shrink-0">
              <img
                src="/assets/ui/coins.png"
                className="w-5 h-5 pixelated"
                alt="Memory"
              />
              <span className="text-xs font-bold text-tx-muted uppercase">
                Coins
              </span>
            </div>
            <span
              className="font-mono text-base font-bold text-warning truncate ml-2"
              title={(coins || 0).toLocaleString()} // KORJATTU: Fallback nollaan jos coins on null/undefined
            >
              {formatNumber(coins || 0)}
            </span>
          </div>

          <button
            onClick={onOpenQuests}
            className="bg-panel/50 p-3 border border-border/50 rounded hover:bg-panel-hover transition-colors relative flex items-center justify-center shrink-0 w-12"
            title="Daily Quests"
          >
            <img
              src="/assets/ui/icon_quest.png"
              className="w-6 h-6 pixelated"
              alt="Quests"
            />
            {hasCompletableQuests && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full animate-ping border border-app-base"></span>
            )}
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="p-4 space-y-8 overflow-y-auto flex-1 custom-scrollbar relative z-10">
        {/* LOHKO 1: GENERAL */}
        <div>
          <p className="text-[10px] font-bold text-tx-muted/80 uppercase px-2 mb-3 tracking-[0.2em] border-b border-border/50 pb-1 text-left">
            General
          </p>
          <NavButton
            view="inventory"
            label="Storage"
            icon="/assets/ui/icon_inventory.png"
            isActive={currentView === "inventory"}
            onClick={setView}
          />
          <NavButton
            view="enchanting"
            label="Enchanting"
            icon="/assets/ui/icon_enchanting.png"
            isActive={currentView === "enchanting"}
            onClick={setView}
          />
          <NavButton
            view="achievements"
            label="Milestones"
            icon="/assets/ui/icon_achievements.png"
            isActive={currentView === "achievements"}
            onClick={setView}
          />
          <NavButton
            view="worldmarket"
            label="World Vendors"
            icon="/assets/ui/icon_market.png"
            isActive={currentView === "worldmarket"}
            onClick={setView}
          />
          <NavButton
            view="marketplace"
            label="Marketplace"
            icon="/assets/ui/icon_market.png"
            isActive={currentView === "marketplace"}
            onClick={setView}
          />
          <NavButton
            view="leaderboard"
            label="Leaderboards"
            icon="/assets/ui/icon_leaderboard.png"
            isActive={currentView === "leaderboard"}
            onClick={setView}
          />
        </div>

        {/* LOHKO 2: SKILLS */}
        <div>
          <p className="text-[10px] font-bold text-tx-muted/80 uppercase px-2 mb-3 tracking-[0.2em] border-b border-border/50 pb-1 text-left">
            Skills
          </p>
          <NavButton
            view="scavenger"
            label="Expeditions"
            icon="/assets/skills/scavenging.png"
            isActive={currentView === "scavenger"}
            onClick={setView}
          />

          {SKILL_DEFINITIONS.filter(
            (def) =>
              def.category === "gathering" || def.category === "production",
          ).map((def) => (
            <NavButton
              key={def.id}
              view={def.id}
              label={def.sidebarLabel}
              icon={def.icon}
              level={skills[def.id]?.level || 1}
              isActive={currentView === def.id}
              onClick={setView}
            />
          ))}
        </div>

        {/* LOHKO 3: COMBAT */}
        <div>
          <p className="text-[10px] font-bold text-tx-muted/80 uppercase px-2 mb-3 tracking-[0.2em] border-b border-border/50 pb-1 text-left">
            Combat
          </p>
          <NavButton
            view="combat"
            label="Maps"
            icon="/assets/skills/combat.png"
            isActive={currentView === "combat"}
            onClick={setView}
          />
          <div className="bg-panel/30 p-3 border border-border/50 mt-4 rounded space-y-1">
            {SKILL_DEFINITIONS.filter((def) => def.category === "combat").map(
              (def) => (
                <StatRow
                  key={def.id}
                  label={def.sidebarLabel}
                  level={skills[def.id]?.level || 1}
                  xp={skills[def.id]?.xp || 0}
                  iconPath={def.icon}
                  textColor={def.color}
                  bgColor={def.bgColor}
                />
              ),
            )}
          </div>
        </div>

        {/* LOHKO 4: SYSTEM INFORMATION */}
        <div>
          <p className="text-[10px] font-bold text-tx-muted/80 uppercase px-2 mb-3 tracking-[0.2em] border-b border-border/50 pb-1 text-left">
            System Information
          </p>
          <NavButton
            view="announcements"
            label="Announcements"
            icon="/assets/ui/icon_announcements.png"
            isActive={currentView === "announcements"}
            onClick={setView}
          />
          <NavButton
            view="wiki"
            label="System Manual"
            icon="/assets/ui/icon_wiki.png"
            isActive={currentView === "wiki"}
            onClick={setView}
          />
          <NavButton
            view="patch_notes"
            label="Patch Notes"
            icon="/assets/ui/icon_patch_notes.png"
            isActive={currentView === "patch_notes"}
            onClick={setView}
          />
          <NavButton
            view="guide"
            label="Game Guide"
            icon="/assets/ui/icon_guide.png"
            isActive={currentView === "guide"}
            onClick={setView}
          />
          <NavButton
            view="faq"
            label="F.A.Q."
            icon="/assets/ui/icon_faq.png"
            isActive={currentView === "faq"}
            onClick={setView}
          />
          <NavButton
            view="privacy_policy"
            label="Privacy Policy"
            icon="/assets/ui/icon_privacy.png"
            isActive={currentView === "privacy_policy"}
            onClick={setView}
          />
        </div>
      </div>

      {/* TÄHÄN TULEE JONO (QUEUE)! */}
      <QueuePanel />

      {/* FOOTER */}
      <div className="p-4 border-t border-border/50 bg-app-base/50 relative z-20">
        <button
          onClick={onStopAction}
          className="w-full py-3 text-xs font-bold text-warning hover:bg-warning/10 border border-warning/30 mb-3 transition-colors rounded-sm uppercase"
        >
          Stop
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReset}
            className="py-2 text-[10px] font-bold text-danger border border-danger/20 hover:bg-danger/10 rounded-sm uppercase"
          >
            Reset
          </button>
          <button
            onClick={handleForceSaveClick}
            disabled={saveCooldown > 0}
            className={`py-2 text-[10px] font-bold border rounded-sm uppercase ${
              saveCooldown > 0
                ? "text-tx-muted/60 border-border cursor-not-allowed"
                : "text-success border-success/20 hover:bg-success/10"
            }`}
          >
            {saveCooldown > 0 ? `${saveCooldown}s` : "Save"}
          </button>
        </div>
      </div>
    </nav>
  );
}
