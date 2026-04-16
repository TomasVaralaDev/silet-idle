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
  RoadmapView,
  PatchNotesView,
  FaqView,
  PrivacyPolicyView,
} from "./meta/MetaViews";
import WikiView from "./wiki/wikiView";
import type { ViewType, SkillType } from "../types";
import TowerView from "./tower/towerView";
interface Props {
  currentView: ViewType;
  onSellClick: (id: string) => void;
}

export default function ViewRouter({ currentView, onSellClick }: Props) {
  {
    // CORE SYSTEMS
  }
  if (currentView === "combat") return <CombatView />;
  if (currentView === "scavenger") return <ScavengingView />;
  if (currentView === "inventory")
    return <InventoryView onSellClick={onSellClick} />;
  if (currentView === "leaderboard") return <LeaderboardView />;
  if (currentView === "enchanting") return <EnchantingView />;
  if (currentView === "worldmarket") return <WorldShopView />;
  if (currentView === "marketplace") return <MarketplaceView />;
  if (currentView === "premium_shop") return <PremiumShopView />;
  if (currentView === "tower") return <TowerView />;
  {
    // META SYSTEMS
  }
  if (currentView === "roadmap") return <RoadmapView />;
  if (currentView === "patch_notes") return <PatchNotesView />;
  if (currentView === "faq") return <FaqView />;
  if (currentView === "privacy_policy") return <PrivacyPolicyView />;
  if (currentView === "wiki") return <WikiView />;

  {
    // MILESTONES
  }
  if (currentView === "achievements") {
    return <AchievementsView />;
  }

  {
    // SKILLS (Gathering & Production)
  }
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
