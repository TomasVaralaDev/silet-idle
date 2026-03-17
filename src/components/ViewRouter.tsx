import CombatView from "./combat/CombatView";
import ScavengingView from "./scavenging/ScavengingView";
import EnchantingView from "./enchanting/EnchantingView";
import SkillView from "./skills/SkillView";
import InventoryView from "./inventory/Inventory";
import AchievementsView from "./achievements/AchievementsView";
import WorldShopView from "./worldShop/WorldShopView";
import MarketplaceView from "./marketplace/MarketplaceView";
import LeaderboardView from "./leaderboard/LeaderboardView"; // TUONNIT META-NÄKYMILLE - Lisätty puuttuvat PrivacyPolicyView ja AnnouncementsView
import {
  AnnouncementsView,
  PatchNotesView,
  FaqView,
  GuideView,
  PrivacyPolicyView,
} from "./meta/MetaViews";
import WikiView from "./wiki/wikiView";

import type { FullStoreState } from "../store/useGameStore";
import type { ViewType, SkillType } from "../types";

interface Props {
  currentView: ViewType;
  state: FullStoreState;
  onSellClick: (id: string) => void;
}

export default function ViewRouter({ currentView, state, onSellClick }: Props) {
  // CORE SYSTEMS
  if (currentView === "combat") return <CombatView />;
  if (currentView === "scavenger") return <ScavengingView />;
  if (currentView === "inventory")
    return <InventoryView onSellClick={onSellClick} />;
  if (currentView === "leaderboard") return <LeaderboardView />;
  if (currentView === "enchanting") return <EnchantingView />;
  if (currentView === "worldmarket") return <WorldShopView />;
  if (currentView === "marketplace") return <MarketplaceView />;

  // META SYSTEMS
  if (currentView === "announcements") return <AnnouncementsView />;
  if (currentView === "patch_notes") return <PatchNotesView />;
  if (currentView === "guide") return <GuideView />;
  if (currentView === "faq") return <FaqView />;
  if (currentView === "privacy_policy") return <PrivacyPolicyView />;
  if (currentView === "wiki") return <WikiView />;

  // MILESTONES
  if (currentView === "achievements") {
    return <AchievementsView unlockedIds={state.unlockedAchievements || []} />;
  }

  // SKILLS (Gathering & Production)
  const skillList: SkillType[] = [
    "woodcutting",
    "mining",
    "fishing",
    "foraging",
    "crafting",
    "smithing",
    "alchemy",
  ];

  if (skillList.includes(currentView as SkillType)) {
    return <SkillView skill={currentView as SkillType} />;
  }

  return null;
}
