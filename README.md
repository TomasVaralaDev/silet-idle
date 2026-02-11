# TimeRing - Idle RPG System

**TimeRing** is a modern, feature-rich Idle RPG built with **React**, **TypeScript**, and **Tailwind CSS**. Players take on the role of a "Restorer," gathering resources, crafting powerful gear, and battling through corrupted time zones to stabilize the world.

![Version](https://img.shields.io/badge/version-1.0.4-blue)
![Status](https://img.shields.io/badge/status-Active_Development-green)
![Tech](https://img.shields.io/badge/tech-React_|_Firebase_|_Tailwind-38bdf8)

## Features

### Skilling & Resources
- **7 Unique Skills:** Woodcutting, Mining, Fishing, Farming, Smithing, Crafting, and Cooking.
- **Progression:** Level up skills to unlock better resources (e.g., Pine → Bloodwood, Copper → Starfall Ore).
- **Automation:** Idle mechanics allow gathering while managing other tasks.

### Combat System
- **8 Distinct Worlds:** From the grassy *Greenvale* to the cosmic *Eternal Nexus*.
- **80+ Enemies:** Unique stats, sprites, and drop tables for every enemy.
- **Auto-Battler:** Automated combat loop with configurable **Auto-Eat** threshold and **Auto-Progress**.
- **Boss Fights:** Collect rare keys to challenge powerful World Bosses.

### Loot & Economy
- **Weighted Loot System:** Advanced drop tables with tiered rarities (Common Dust, Rare Gems, Exotic Elite Fragments).
- **Inventory Management:** Slot-based equipment system, consumable food, and resource storage.
- **Requisition Shop:** Buy upgrades, speed multipliers (including God Mode tools), and XP Tomes (5x XP).
- **Gamble System:** "Entropy" mechanic for sinking coins.

### Technical Features
- **Cloud Save (Firebase):** Seamless cross-device progression with Google Authentication.
- **Local Fallback:** Auto-saves to local storage if offline.
- **Username System:** Unique "Unit ID" registration for every player.
- **Responsive UI:** Dark-themed, cyber-fantasy aesthetic optimized for Desktop and Tablet.
- **Settings:** Toggle audio, notifications, and manage data.

## Tech Stack

- **Frontend:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend / Auth:** Firebase (Firestore, Auth)
- **State Management:** React Hooks (Custom implementation)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/timering-idle.git](https://github.com/yourusername/timering-idle.git)
   cd timering-idle
  ```

2. **Install dependencies**
    ```bash
      npm install
  ```

3. **Configure Firebase Create a file named .env in the root directory and add your Firebase credentials:**
    ```bash
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
  ```

4. **Run the development server**
    ```bash
    npm run dev
  ```

### Project Structure
    ```bash
    src/
├── assets/          # Game images (items, enemies, UI icons)
├── components/      # React components (Sidebar, Inventory, CombatView, etc.)
├── App.tsx          # Main game loop and state management
├── data.ts          # Static game data (Loot tables, Enemies, Items)
├── types.ts         # TypeScript interfaces and types
├── firebase.ts      # Firebase initialization
└── index.css        # Tailwind directives and global styles
  ```

### Gameplay Guide
1. Start: Choose a unique Unit ID.

2. Gather: Use Woodcutting or Mining to get base materials.

3. Refine: Use Smithing (ingots) or Crafting (planks) to process materials.

4. Gear Up: Craft armor and weapons to increase your Force and Shielding.

5. Fight: Enter the Stabilization Zone (Combat). Start at World 1.

6. Loot: Hunt for Keys to unlock the World Boss.

7. Upgrade: Sell excess loot for Memory Fragments (Coins) to buy speed upgrades.

**"The world didn't need a hero. It needed a Restorer."**