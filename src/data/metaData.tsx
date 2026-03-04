import type { PatchNote, FaqItem, GuideSection } from "../types";

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

export const ANNOUNCEMENTS = [
  {
    id: "launch_v1",
    title: "TimeRing System Active",
    date: "04.03.2026",
    content:
      "Welcome, Restorer. The stabilization process has begun. Use the new Meta Terminal to stay updated on system changes.",
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

export const PRIVACY_POLICY_TEXT = `
# Privacy Policy

**Last Updated:** March 4, 2026

TimeRing is committed to protecting the privacy of its users. This Privacy Policy describes how we collect, use, and handle game data, as well as your rights regarding this information under the General Data Protection Regulation (GDPR).

### 1. Data Collection and Use
TimeRing is a local-first application. Your game progress is primarily stored in your browser's local storage. For the purpose of synchronizing game state across devices, we use **Google Firebase**.

The data collected is strictly limited to information necessary for game functionality:
* **Game State:** Levels, experience points (XP), inventory items, currency, and achievements.
* **User Identifier:** A unique, anonymous identifier (UID) generated by Firebase Authentication to link your game data to your account.
* **Timestamps:** Timestamps of the last save to calculate offline progress.

We do not collect or store personal information such as real names, phone numbers, or physical addresses.

### 2. Data Sharing and Third Parties
Your privacy is our priority:
* **No Sale of Data:** We do not sell, rent, or trade your game data or identifiers to third parties for marketing or any other purposes.
* **Service Providers:** Data is processed solely through Google Firebase's secure servers to enable game synchronization and authentication.

### 3. GDPR and Your Rights
In accordance with the General Data Protection Regulation (GDPR), you have the following rights regarding your data:

* **Right to Erasure (Right to be Forgotten):** You have the right to delete your account and all associated game data at any time. This can be performed directly through the in-game settings. Upon deletion, all your data will be permanently removed from our Firebase database.
* **Data Access:** Since all game-related data is visible within the game interface (e.g., Stats, Inventory), you have constant access to your data.
* **Manual Requests:** If you are unable to delete your data through the provided in-game tools or have questions regarding data handling, you may contact the administration to request manual deletion.

### 4. Local Storage and Cookies
The game utilizes the browser's **LocalStorage** to store game states temporarily. This ensures that progress is maintained during session interruptions or offline play.

### 5. Contact Information
For any inquiries regarding this Privacy Policy or to exercise your data rights, please contact the game administration through the official channels.

---

By continuing to use TimeRing and signing in to your account, you acknowledge that you have read and understood this Privacy Policy.
`;
