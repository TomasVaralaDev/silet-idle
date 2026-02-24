import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // WEALTH
  { 
    id: 'rich_noob', 
    category: 'wealth',
    name: 'Rich Noob', 
    icon: '/assets/ui/coins.png', 
    description: 'Accumulate 1,000 fragments.', 
    condition: (state) => state.coins >= 1000 
  },
  { 
    id: 'fragment_hoarder', 
    category: 'wealth',
    name: 'Data Hoarder', 
    icon: '/assets/ui/coins.png', 
    description: 'Accumulate 100,000 fragments.', 
    condition: (state) => state.coins >= 100000 
  },

  // SKILLS
  { 
    id: 'first_log', 
    category: 'skills',
    name: 'First Chop', 
    icon: '/assets/resources/tree/pine_log.png', 
    description: 'Chop your first pine log.', 
    condition: (state) => (state.inventory['pine_log'] || 0) >= 1 
  },
  { 
    id: 'novice_woodcutter', 
    category: 'skills',
    name: 'Novice Woodcutter', 
    icon: '/assets/skills/woodcutting.png', 
    description: 'Reach Woodcutting Level 10.', 
    condition: (state) => state.skills.woodcutting.level >= 10 
  },

  // COMBAT
  { 
    id: 'combat_initiate', 
    category: 'combat',
    name: 'First Blood', 
    icon: '/assets/skills/attack.png', 
    description: 'Complete the first combat map.', 
    condition: (state) => state.combatStats.maxMapCompleted >= 1 
  },
  { 
    id: 'combat_veteran', 
    category: 'combat',
    name: 'Zone Stabilizer', 
    icon: '/assets/skills/defense.png', 
    description: 'Complete 10 different combat zones.', 
    condition: (state) => state.combatStats.maxMapCompleted >= 10 
  }
];