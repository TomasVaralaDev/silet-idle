import CombatView from "./combat/CombatView";
import ScavengingView from "./scavenging/ScavengingView";
import EnchantingView from "./enchanting/EnchantingView";
import SkillView from "./skills/SkillView";
import InventoryView from "./inventory/Inventory";
import AchievementsView from "./achievements/AchievementsView";
import WorldShopView from "./worldShop/WorldShopView";
import MarketplaceView from "./marketplace/MarketplaceView";
import LeaderboardView from "./leaderboard/LeaderboardView";
import PremiumShopView from "./premiumShop/PremiumShopView";
import {
  AnnouncementsView,
  PatchNotesView,
  FaqView,
  PrivacyPolicyView,
} from "./meta/MetaViews";
import WikiView from "./wiki/wikiView";
import GuideView from "./guide/GuideView";

// Poistettu FullStoreState import, koska sitä ei enää käytetä tässä
import type { ViewType, SkillType } from "../types";

interface Props {
  currentView: ViewType;
  // KORJATTU: 'state' poistettu propeista
  onSellClick: (id: string) => void;
}

// KORJATTU: 'state' poistettu argumenteista
export default function ViewRouter({ currentView, onSellClick }: Props) {
  // CORE SYSTEMS
  if (currentView === "combat") return <CombatView />;
  if (currentView === "scavenger") return <ScavengingView />;
  if (currentView === "inventory")
    return <InventoryView onSellClick={onSellClick} />;
  if (currentView === "leaderboard") return <LeaderboardView />;
  if (currentView === "enchanting") return <EnchantingView />;
  if (currentView === "worldmarket") return <WorldShopView />;
  if (currentView === "marketplace") return <MarketplaceView />;
  if (currentView === "premium_shop") return <PremiumShopView />;

  // META SYSTEMS
  if (currentView === "announcements") return <AnnouncementsView />;
  if (currentView === "patch_notes") return <PatchNotesView />;
  if (currentView === "guide") return <GuideView />;
  if (currentView === "faq") return <FaqView />;
  if (currentView === "privacy_policy") return <PrivacyPolicyView />;
  if (currentView === "wiki") return <WikiView />;

  // MILESTONES
  if (currentView === "achievements") {
    return <AchievementsView />;
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
