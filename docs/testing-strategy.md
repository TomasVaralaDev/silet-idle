# Robust Game Logic: Testing Strategy with Vitest

Idle games are fundamentally complex state machines driven by math, RNG (Random Number Generation), and time. A single typo in a loot table or a slight miscalculation in an exponential scaling formula can completely break the game's economy.

To ensure stability, balance, and data integrity, **TimeRing** employs a robust automated testing suite using **Vitest**. The tests are strictly categorized to mirror the project's architectural separation of concerns.

## Testing Architecture

### 1. Pure Functions & Probability (`tests/utils/`)

Utility functions are the bedrock of the game's math. Because they are pure functions (output is solely determined by input with no side effects), they are highly testable.

- **`loot.test.ts` & `enchanting.test.ts`:** Testing RNG is notoriously difficult. These tests verify the weighted drop systems. For example, testing that a `1%` drop rate actually normalizes to ~100 drops over 10,000 simulated iterations, and verifying that upgrading an item to `+5` correctly applies the compounding risk of item destruction.
- **`skillScaling.test.ts` & `gameUtils.test.ts`:** Ensures that exponential XP requirements (`calculateXpGain`) and level caps behave correctly at extreme edge cases (e.g., Level 99).

### 2. Business Logic & System Boundaries (`tests/systems/`)

Systems take the current game state, apply rules, and return the mutated state. Tests here ensure the rules of the game are strictly followed.

- **`offlineSystem.test.ts`:** Simulates giving the system a player state and an elapsed time of `43200` seconds (12 hours). The test asserts that the player does not receive more items than their input materials would allow, preventing infinite item exploits.
- **`combatSystem.test.ts`:** Verifies the combat boundaries. For example, ensuring a player's HP cannot drop below `0`, and that the `autoEatThreshold` triggers the consumption of exactly one food item when the HP condition is met.

### 3. Data Integrity Validation (`tests/systems/questTracking.test.ts`)

In an RPG with hundreds of items, enemies, and skills, "silent bugs" often occur due to simple typos in the configuration files.

Instead of just testing code execution, tests are used to validate the databases. The **Quest Tracking** suite includes an automated diagnostic that loops through the entire `QUEST_DATABASE` and asserts that every `targetId` required by a quest actually exists in the `GAME_DATA`.

```typescript
describe("Data Integrity (ID Mismatch Check)", () => {
  it("should verify that every quest targetId actually exists in GAME_DATA", () => {
    QUEST_DATABASE.forEach((quest) => {
      const skillData = GAME_DATA[quest.requiredSkill];
      const targetResource = skillData?.find((r) => r.id === quest.targetId);

      // Catches typos in configuration data instantly!
      expect(
        targetResource,
        `CRITICAL MISMATCH: Quest '${quest.id}' is looking for '${quest.targetId}'`,
      ).toBeDefined();
    });
  });
});
```

### State Management & Hydration (`tests/store/persist.test.ts`)

Because the game uses Zustand with local storage persistence (`zustand/middleware`), game updates can easily break older save files if the state structure changes (e.g., adding a new skill).

- **`persist.test.ts`** verifies the customMerge function. It simulates loading an outdated v1.0 save file into a v1.1 game engine, asserting that missing default values (like newly added unlocked queue slots) are injected safely without overwriting the player's existing progress.

## Test Suite Structure

The following tree demonstrates the organized approach to quality assurance, covering state mutations, core systems, and mathematical utilities:

```text
tests/
├── slices/
│   └── scavenger.test.ts      # State logic for expeditions
├── store/
│   └── persist.test.ts        # Migration & hydration safety
├── systems/
│   ├── achievementSystem.test.ts
│   ├── combatSystem.test.ts   # Real-time battle logic
│   ├── offlineQueue.test.ts   # Simulation accuracy
│   ├── offlineSystem.test.ts  # Time-delta calculations
│   ├── questSystem.test.ts
│   └── questTracking.test.ts  # Data integrity & integration
└── utils/
    ├── enchanting.test.ts     # RNG & probability curves
    ├── gameUtils.test.ts      # Experience & scaling math
    ├── itemUtils.test.ts
    ├── loot.test.ts           # Weighted drop table validation
    └── queueUtils.test.ts     # Speed multiplier logic
```

## Why This Matters

1. Fearless Refactoring: I can completely rewrite the combat formula, run npm test, and know instantly if I accidentally broke the early-game balance.

2. Balancing Tool: Automated tests are used not just for finding bugs, but for simulating thousands of hours of gameplay in milliseconds to fine-tune the economy.

3. Data Safety: Testing the state hydration prevents game-breaking bugs when pushing updates to active players.
