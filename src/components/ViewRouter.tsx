import CombatView from './CombatView';
import ScavengingView from './scavenging/ScavengingView';
import EnchantingView from './EnchantingView';
import SkillView from './SkillView';
import InventoryView from './Inventory';
import ShopView from './Shop';
import AchievementsView from './AchievementsView';
import WorldShopView from './worldShop/WorldShopView';
import MarketplaceView from './marketplace/MarketplaceView';
import type { FullStoreState } from '../store/useGameStore';
import type { ViewType, SkillType } from '../types';

interface Props {
  currentView: ViewType;
  state: FullStoreState;
  onSellClick: (id: string) => void;
}

export default function ViewRouter({
  currentView,
  state,
  onSellClick,
}: Props) {
  // CORE SYSTEMS
  if (currentView === 'combat') return <CombatView />;
  if (currentView === 'scavenger') return <ScavengingView />;
  if (currentView === 'inventory') return <InventoryView onSellClick={onSellClick} />;
  if (currentView === 'shop') return <ShopView />;
  if (currentView === 'enchanting') return <EnchantingView />;
  if (currentView === 'worldmarket') return <WorldShopView />;
  if (currentView === 'marketplace') return <MarketplaceView />;

  // MILESTONES (KORJATTU: Ei enää achievements-propsia, vain unlockedIds)
  if (currentView === 'achievements') {
    return <AchievementsView unlockedIds={state.unlockedAchievements || []} />;
  }

  // SKILLS (Gathering & Production)
  const skillList: SkillType[] = [
    'woodcutting', 'mining', 'fishing', 'foraging', 
    'crafting', 'smithing', 'alchemy'
  ];

  if (skillList.includes(currentView as SkillType)) {
    return <SkillView skill={currentView as SkillType} />;
  }

  return null;
}