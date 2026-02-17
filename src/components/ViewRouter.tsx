import CombatView from './CombatView';
import ScavengerView from './scavenging/ScavengingView';
import EnchantingView from './EnchantingView';
import SkillView from './SkillView';
import InventoryView from './Inventory';
import ShopView from './Shop';
import GambleView from './Gamble';
import AchievementsView from './AchievementsView';
import WorldMarketView from './worldShop/WorldShopView'; 

import { ACHIEVEMENTS } from '../data';
import type { ViewType, SkillType, GameState } from '../types';

interface Props {
  currentView: ViewType;
  state: GameState;
  onSellClick: (id: string) => void;
  onGamble: (amount: number, callback: (win: boolean) => void) => void;
}

export default function ViewRouter({ currentView, state, onSellClick, onGamble }: Props) {
  
  // CORE SYSTEMS
  if (currentView === 'combat') return <CombatView />;
  if (currentView === 'scavenger') return <ScavengerView />;
  
  // Inventory tarvitsee yhä onSellClick
  if (currentView === 'inventory') return <InventoryView onSellClick={onSellClick} />;
  
  if (currentView === 'shop') return <ShopView />;
  if (currentView === 'gamble') return <GambleView coins={state.coins} onGamble={onGamble} />;
  if (currentView === 'achievements') return <AchievementsView achievements={ACHIEVEMENTS} unlockedIds={state.unlockedAchievements} />;
  
  // Enchanting hoitaa nyt logiikan itse storesta -> ei propseja
  if (currentView === 'enchanting') return <EnchantingView />;
  
  // World Market (Core System)
  if (currentView === 'worldmarket') return <WorldMarketView />;
  
  // SKILLS (Gathering & Production)
  // Tarkistetaan onko currentView jokin SkillType
  const skills: SkillType[] = [
    'woodcutting', 
    'mining', 
    'fishing', 
    'farming', 
    'foraging', // LISÄTTY: foraging
    'crafting', 
    'smithing', 
    'cooking'
  ];
  
  if (skills.includes(currentView as SkillType)) {
      return <SkillView skill={currentView as SkillType} />;
  }

  return null;
}