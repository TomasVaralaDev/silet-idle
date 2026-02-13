import type { SkillType } from '../types'; // Korjattu 'import type'

export interface SkillDefinition {
  id: SkillType;
  label: string;
  icon: string;
  category: 'gathering' | 'production' | 'combat';
  color: string;
  bgColor: string;
  sidebarLabel: string;
}

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // GATHERING
  { id: 'woodcutting', label: 'Woodcutting', sidebarLabel: 'Excavation', icon: '/assets/skills/woodcutting.png', category: 'gathering', color: 'text-emerald-400', bgColor: 'bg-emerald-900' },
  { id: 'mining', label: 'Mining', sidebarLabel: 'Salvaging', icon: '/assets/skills/mining.png', category: 'gathering', color: 'text-slate-300', bgColor: 'bg-slate-700' },
  { id: 'fishing', label: 'Fishing', sidebarLabel: 'Gathering', icon: '/assets/skills/fishing.png', category: 'gathering', color: 'text-blue-400', bgColor: 'bg-blue-900' },
  { id: 'farming', label: 'Farming', sidebarLabel: 'Cultivation', icon: '/assets/skills/farming.png', category: 'gathering', color: 'text-green-400', bgColor: 'bg-green-900' },
  
  // PRODUCTION
  { id: 'smithing', label: 'Smithing', sidebarLabel: 'Foundry', icon: '/assets/skills/smithing.png', category: 'production', color: 'text-orange-400', bgColor: 'bg-orange-900' },
  { id: 'crafting', label: 'Crafting', sidebarLabel: 'Assembly', icon: '/assets/skills/crafting.png', category: 'production', color: 'text-cyan-400', bgColor: 'bg-cyan-900' },
  { id: 'cooking', label: 'Cooking', sidebarLabel: 'Refining', icon: '/assets/skills/cooking.png', category: 'production', color: 'text-amber-400', bgColor: 'bg-amber-900' },

  // COMBAT
  { id: 'hitpoints', label: 'Integrity', sidebarLabel: 'Integrity', icon: '/assets/skills/hitpoints.png', category: 'combat', color: 'text-red-400', bgColor: 'bg-red-900' },
  { id: 'attack', label: 'Force', sidebarLabel: 'Force', icon: '/assets/skills/attack.png', category: 'combat', color: 'text-orange-400', bgColor: 'bg-orange-900' },
  { id: 'defense', label: 'Shielding', sidebarLabel: 'Shielding', icon: '/assets/skills/defense.png', category: 'combat', color: 'text-cyan-400', bgColor: 'bg-cyan-900' },
  { id: 'melee', label: 'Melee Sys', sidebarLabel: 'Melee Sys', icon: '/assets/skills/melee.png', category: 'combat', color: 'text-slate-400', bgColor: 'bg-slate-700' },
  { id: 'ranged', label: 'Ranged Sys', sidebarLabel: 'Ranged Sys', icon: '/assets/skills/ranged.png', category: 'combat', color: 'text-emerald-400', bgColor: 'bg-emerald-900' },
  { id: 'magic', label: 'Magic Sys', sidebarLabel: 'Magic Sys', icon: '/assets/skills/magic.png', category: 'combat', color: 'text-blue-400', bgColor: 'bg-blue-900' },
];