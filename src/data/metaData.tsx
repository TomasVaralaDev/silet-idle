import type { PatchNote, FaqItem, GuideSection } from "../types";

export interface RoadmapItem {
  id: string;
  title: string;
  status: "Planned" | "In Development" | "Testing" | "Live";
  description: string;
  eta?: string;
}

export const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: "guilds",
    title: "Guild System",
    status: "In Development",
    description:
      "Ability to form alliances, share resources, and gain collective bonuses with other travelers.",
    eta: "Q2 2026",
  },
  {
    id: "dungeons",
    title: "Multiplayer Dungeons",
    status: "Planned",
    description:
      "Cooperative idle raids where players face powerful bosses together for exclusive loot pools.",
    eta: "Q2 2026",
  },
];
export const PATCH_NOTES: PatchNote[] = [
  {
    version: "v1.5.0",
    date: "04.03.2026",
    isMajor: true,
    changes: [
      "Meta Terminal: Added Patch Notes, Announcements, Privacy Policy, and FAQ pages.",
    ],
  },
  {
    version: "v1.4.1",
    date: "02.03.2026",
    changes: ["Combat: Fixed attack speed calculation logic."],
  },
  {
    version: "v1.4.0",
    date: "01.03.2026",
    isMajor: true,
    changes: [
      "Equipment: Added unique stats for weapons and armors.",
      "Inventory: Integrated item comparison system and revamped stat display.",
      "UI: Major visual updates to Crafting, Smithing, and Alchemy for better clarity.",
      "Combat: Fixed combat log to display accurate event data.",
      "Balance: Implemented crafting material scaling and HP level/base fixes.",
      "Enchanting: Progression balance adjustments.",
    ],
  },
  {
    version: "v1.3.0",
    date: "26.02 - 27.02.2026",
    changes: [
      "Architecture: Skill system splitting and Skill Factory implementation.",
      "Foraging: Resources refactored into individual interactable items.",
    ],
  },
  {
    version: "v1.2.0",
    date: "26.02.2026",
    changes: [
      "Testing: Comprehensive test suite implemented for XP, Leveling, Combat, and Offline Gains.",
      "Testing: Verified Inventory, Equipment, Quests, and Migration logic.",
      "Testing: Validated Loot, Rarity, Enchanting, Achievements, and Expeditions.",
    ],
  },
  {
    version: "v1.1.0",
    date: "25.02.2026",
    isMajor: true,
    changes: [
      "UI: Massive theme rework across all game views.",
      "Mailing: Integrated Firebase-powered mailing system and rule updates.",
      "Dev Tools: Added Developer Console for internal testing.",
    ],
  },
  {
    version: "v1.0.0",
    date: "24.02.2026",
    isMajor: true,
    changes: [
      "Marketplace: Added categories and material classification.",
      "Combat: Implemented death penalties, retreat cooldowns, and leveling fixes.",
      "Graphics: Added unique Rune imagery.",
      "System: Initial Roleplay (RP) logic refactoring started.",
      "Fixes: Extensive bug and UI polishing.",
    ],
  },
  {
    version: "v0.9.0",
    date: "23.02 - 24.02.2026",
    changes: [
      "Combat: Finalized player combat formulas and enemy/skilling scaling.",
      "Quests: Implemented Daily Quest system (Local time).",
      "Inventory: Added search bar, quick sell, and right-click equip support.",
      "UI: Integrated stat display within the inventory view.",
    ],
  },
  {
    version: "v0.8.0",
    date: "23.02.2026",
    changes: [
      "Social: Improved Chat UI and Firebase integration.",
      "Social: Added Chat icons for better visibility.",
      "Economy: Marketplace core logic implemented.",
      "Items: Added Runes system.",
    ],
  },
  {
    version: "v0.7.0",
    date: "18.02.2026",
    changes: [
      "Skills: Added Alchemy skill.",
      "Social: Integrated Friends system, Global Chat, and private Friend Chat.",
      "Combat: Fixed Auto-eat logic, UI, and added cooldowns.",
      "QoL: Fixed inventory bug where items got stuck at 0 amount.",
      "Visuals: Updated all skill icons and images.",
    ],
  },
  {
    version: "v0.6.0",
    date: "17.02.2026",
    changes: [
      "Skills: Added Foraging skill.",
      "Economy: Added World Item Shop items and daily purchase caps.",
      "Enchanting: Progression and balance changes.",
    ],
  },
  {
    version: "v0.5.0",
    date: "16.02.2026",
    changes: [
      "Social: Added user profile pictures.",
      "Expeditions: Fixed logic and reward scaling.",
      "Economy: Initial implementation of the World Item Shop.",
    ],
  },
  {
    version: "v0.4.0",
    date: "12.02 - 13.02.2026",
    isMajor: true,
    changes: [
      "Architecture: SOLID principles applied across the entire project.",
      "Engine: Decoupled game engine from UI and implemented Tick-based system.",
      "Engine: Integrated Offline Gains (Delta-time) and Item Factory pattern.",
      "Systems: Event-based notification system implemented.",
      "Data: Major refactoring - split data.ts into domain-specific modules.",
    ],
  },
  {
    version: "v0.3.0",
    date: "12.02.2026",
    changes: [
      "Items: Added Rarity system.",
      "Scavenger: Complete overhaul of the scavenging mechanics.",
    ],
  },
  {
    version: "v0.2.0",
    date: "11.02.2026",
    changes: [
      "Combat: Reworked core combat logic and log display.",
      "Equipment: Added Bows, Staves, and Shields.",
      "Documentation: Project README updated.",
    ],
  },
  {
    version: "v0.1.0",
    date: "10.02.2026",
    changes: [
      "User: Integrated usernames and authentication.",
      "UI: Added Settings screen and basic interface.",
    ],
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: "How do I heal during combat?",
    answer:
      "Equip food in your storage and set the Auto-Eat threshold in Combat Settings. The system will consume food automatically when your health drops below the set percentage.",
  },
  {
    question: "Does the game progress while closed?",
    answer:
      "Yes. The engine calculates the time difference since your last save and grants rewards based on your active action when you return.",
  },
  {
    question: "How can I earn money?",
    answer:
      "You can earn coins by selling items directly from your inventory or by trading with other players in the Marketplace. Additionally, completing Daily Quests provides a steady source of income.",
  },
  {
    question: "I'm not strong enough for the next enemy, what should I do?",
    answer:
      "To increase your power, focus on leveling up your combat skills and crafting superior gear. You can also use Enchanting to boost your current equipment stats or attempt to obtain rare weapons and armor from bosses.",
  },
  {
    question: "Does the game progress while it is closed?",
    answer:
      "Yes. The system uses Delta-Time calculation. When you return, the engine calculates the elapsed time and grants rewards based on your active action.",
  },
];

export const GUIDE_DATA: GuideSection[] = [
  {
    title: "Gathering & Production",
    content:
      "Collect raw materials using gathering skills like Foraging or Mining, then refine them into gear or potions via Smithing and Alchemy.",
    icon: "/assets/skills/foraging.png",
  },
];
