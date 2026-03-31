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
    version: "0.8.0",
    date: "31.03.2026",
    isMajor: true,
    changes: ["New Domain Deployed"],
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
    icon: "./assets/skills/foraging.png",
  },
];
