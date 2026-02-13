import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_log', name: 'First Chop', icon: '/assets/resources/tree/pine_log.png', description: 'Chop your first pine log.', condition: (state) => (state.inventory['pine_log'] || 0) >= 1 },
  { id: 'rich_noob', name: 'Rich Noob', icon: '/assets/ui/coins.png', description: 'Accumulate 1000 coins.', condition: (state) => state.coins >= 1000 },
  { id: 'novice_woodcutter', name: 'Novice Woodcutter', icon: '/assets/skills/woodcutting.png', description: 'Reach Woodcutting Level 10.', condition: (state) => state.skills.woodcutting.level >= 10 },
  { id: 'combat_initiate', name: 'First Blood', icon: '/assets/skills/attack.png', description: 'Complete the first combat map.', condition: (state) => state.combatStats.maxMapCompleted >= 1 }
];