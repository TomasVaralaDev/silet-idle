import CombatView from "./CombatView";
import ScavengingView from "./scavenging/ScavengingView";
import EnchantingView from "./enchanting/EnchantingView"; // Päivitetty polku
import SkillView from "./skills/SkillView"; // Päivitetty polku
import InventoryView from "./inventory/Inventory"; // Päivitetty polku
import AchievementsView from "./achievements/AchievementsView";
import WorldShopView from "./worldShop/WorldShopView";
import MarketplaceView from "./marketplace/MarketplaceView";
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
  if (currentView === "enchanting") return <EnchantingView />;
  if (currentView === "worldmarket") return <WorldShopView />;
  if (currentView === "marketplace") return <MarketplaceView />;

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
