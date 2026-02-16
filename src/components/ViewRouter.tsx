import CombatView from './CombatView';
import ScavengerView from './scavenging/ScavengingView';
import EnchantingView from './EnchantingView';
import SkillView from './SkillView';
import Inventory from './Inventory';
import Shop from './Shop';
import Gamble from './Gamble';
import AchievementsView from './AchievementsView';
import { ACHIEVEMENTS } from '../data';
import type { ViewType, SkillType, GameState } from '../types';

interface Props {
  currentView: ViewType;
  state: GameState;
  onSellClick: (id: string) => void;
  onGamble: (amount: number, callback: (win: boolean) => void) => void;
  // KORJAUS: Määritetty tarkka tyyppi funktiolle
  onEnchant: (originalId: string, newId: string, cost: number) => void;
}

export default function ViewRouter({ currentView, state, onSellClick, onGamble, onEnchant }: Props) {
  if (currentView === 'combat') return <CombatView />;
  if (currentView === 'scavenger') return <ScavengerView />;
  if (currentView === 'enchanting') return <EnchantingView inventory={state.inventory} equipment={state.equipment} coins={state.coins} onEnchant={onEnchant} />;
  
  // Lista taitonäkymistä
  const skills: SkillType[] = ['woodcutting', 'mining', 'fishing', 'farming', 'crafting', 'smithing', 'cooking'];
  if (skills.includes(currentView as SkillType)) return <SkillView skill={currentView as SkillType} />;

  if (currentView === 'inventory') return <Inventory onSellClick={onSellClick} />;
  if (currentView === 'shop') return <Shop />;
  if (currentView === 'gamble') return <Gamble coins={state.coins} onGamble={onGamble} />;
  if (currentView === 'achievements') return <AchievementsView achievements={ACHIEVEMENTS} unlockedIds={state.unlockedAchievements} />;

  return null;
}