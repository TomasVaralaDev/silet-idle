import type { QuestTemplate } from '../types';

export const QUEST_DATABASE: QuestTemplate[] = [
  // MINING
  {
    id: 'q_mine_copper', title: 'Copper Miner', description: 'Mine 50 Copper Ore.',
    type: 'GATHER', targetId: 'ore_copper', targetAmount: 50, requiredLevel: 1, requiredSkill: 'mining',
    reward: { coins: 100, xpMap: { mining: 500 } }
  },
  {
    id: 'q_mine_iron', title: 'Iron Resolve', description: 'Mine 100 Iron Ore.',
    type: 'GATHER', targetId: 'ore_iron', targetAmount: 100, requiredLevel: 10, requiredSkill: 'mining',
    reward: { coins: 300, items: [{ itemId: 'ore_iron_smelted', amount: 10 }] }
  },
  
  // WOODCUTTING
  {
    id: 'q_chop_pine', title: 'Lumberjack Trainee', description: 'Chop 50 Pine Logs.',
    type: 'GATHER', targetId: 'pine_log', targetAmount: 50, requiredLevel: 1, requiredSkill: 'woodcutting',
    reward: { coins: 100, xpMap: { woodcutting: 500 } }
  },
  {
    id: 'q_chop_oak', title: 'Oak Cleaver', description: 'Chop 100 Oak Logs.',
    type: 'GATHER', targetId: 'oak_log', targetAmount: 100, requiredLevel: 15, requiredSkill: 'woodcutting',
    reward: { coins: 300, items: [{ itemId: 'pine_plank', amount: 20 }] }
  },

  // COMBAT
  {
    id: 'q_kill_slime', title: 'Slime Slayer', description: 'Defeat 20 Harmless Slimes.',
    type: 'KILL', targetId: '1', targetAmount: 20, requiredLevel: 1, requiredSkill: 'combat',
    reward: { coins: 200, xpMap: { hitpoints: 1000 } }
  },
  {
    id: 'q_kill_boss_w1', title: 'Guardian Down', description: 'Defeat the Oakroot Guardian (World 1 Boss).',
    type: 'KILL', targetId: '10', targetAmount: 1, requiredLevel: 10, requiredSkill: 'combat',
    reward: { coins: 1000, items: [{ itemId: 'bosskey_w2', amount: 1 }] }
  },
];