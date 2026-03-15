# ⏳ TimeRing - Idle RPG System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-Bear-brown?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

> **Play the Live Demo:** [Insert Link to Hosted Game Here]

**TimeRing** is a modern, feature-rich Idle RPG built with **React**, **TypeScript**, and **Zustand**. Players take on the role of a "Restorer," gathering resources, crafting powerful gear, and battling through corrupted time zones to stabilize the world.

This project was built to demonstrate advanced front-end architecture, complex state management, custom React game loops, and real-time database synchronization.

![Gameplay Screenshot](docs/gameplay_showcase.png) ---

## Key Features

### Combat & Progression

- **8 Distinct Worlds:** From the grassy _Greenvale_ to the cosmic _Eternal Nexus_.
- **80+ Enemies & World Bosses:** Unique stats, sprites, and advanced drop tables with tiered rarities (Common Dust to Exotic Elite Fragments).
- **Auto-Battler System:** Fully automated combat loop with configurable **Auto-Eat** thresholds.
- **Enchanting System:** Risk/reward upgrade mechanics to enhance gear stats dynamically.

### Skilling & Economy

- **7 Interconnected Skills:** Woodcutting, Mining, Fishing, Farming, Smithing, Crafting, and Cooking.
- **Action Queuing:** Players can queue up multiple crafting/smelting actions for optimized idle gameplay.
- **Daily Quests & Achievements:** A robust milestone and daily task tracking system.
- **Player-Driven Marketplace:** Real-time integration with Firebase allowing players to trade items securely.

### Technical Highlights (For Developers)

- **Offline Progression System:** Complex math accurately calculates elapsed time, granting exact XP, loot, and queue completions upon returning to the game.
- **Cloud Save & Sync:** Seamless cross-device progression via Firebase Auth and Firestore, with local storage fallbacks.

---

## Technical Architecture

Building a game entirely in React presents unique challenges regarding re-renders and managing continuous data streams. TimeRing solves these with a scalable architecture:

### 1. Custom React Game Engine (`useGameEngine.ts`)

Instead of erratic `useEffect` chains, the core logic is driven by a single centralized `setInterval` running at 100ms. The loop calculates `deltaTime` and dispatches batched state updates, ensuring the UI remains perfectly in sync with the underlying math without causing render storms.

### 2. Modular State Management (Zustand Slices)

A massive state object is difficult to maintain. The game's global state is modularized using the **Slice pattern** (`src/store/slices/`). State is fragmented into logical domains (Combat, Inventory, Skills, Quests), keeping the global store extremely clean and testable.

### 3. Separation of Concerns (Systems vs. State)

Business logic is strictly decoupled from UI components:

- `store/`: Only contains state definitions and atomic actions.
- `systems/`: Pure, testable functions (`combatSystem.ts`, `questSystem.ts`) that take the current state, apply game math/RNG, and return the mutated state.
- `utils/`: Reusable math, drop table generators, and scaling formulas.

### 4. Automated Testing (Vitest)

Unit tests are utilized extensively to guarantee data integrity and balance. Tests verify ID mappings across databases, ensure accurate enchanting probabilities, and validate the progression tracking of the Quest System.

---

## Getting Started (Local Development)

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone [https://github.com/yourusername/timering-idle.git](https://github.com/yourusername/timering-idle.git)
cd timering-idle
```

2. **Install dependencies**

3. **Configure Firebase**

Create a file named .env in the root directory and add your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Run the development server**

```
npm run dev
```

5. **Run tests**

```
npm run test
```

### Project Structure (Overview)

```
src/
├── assets/         # Game images, sprites, UI icons
├── components/     # React UI components separated by domain (inventory, combat, enchanting)
├── config/         # Constant variables and skill definitions
├── data/           # Static game databases (Loot tables, Quests, Items, Enemies)
├── hooks/          # Core game loops (useGameEngine) and utility hooks
├── services/       # External API and Firebase logic (Leaderboard, Marketplace)
├── store/          # Zustand global store and individual feature slices
├── systems/        # Pure business logic (Skill, Combat, Offline, Quest systems)
└── utils/          # Math, scaling formulas, and mechanics
```

### Gameplay Guide

1. Start: Choose a unique Unit ID.

2. Gather: Use Woodcutting or Mining to collect base materials.

3. Refine & Queue: Use Smithing (ingots) or Crafting (planks) to process materials. Utilize the Queue system to automate production.

4. Gear Up: Craft armor and weapons, and risk enchanting them for massive power boosts.

5. Fight: Enter the Stabilization Zone. Defeat enemies, monitor your auto-eat thresholds, and collect loot.

6. Bosses: Hunt for Zone Keys to unlock and challenge powerful World Bosses to progress to new cosmic zones.
