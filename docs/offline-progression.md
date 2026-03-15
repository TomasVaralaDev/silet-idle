# The Math of Offline Progression

A core pillar of any Idle RPG is rewarding the player when they return to the game. However, calculating offline progression accurately without breaking the game's economy or duplicating logic is a significant engineering challenge.

The `offlineSystem.ts` handles this by taking the exact timestamp of when the player left and calculating the delta upon their return. Instead of just "guessing" the rewards, it deterministically simulates the game state.

## The Simulation Cap

To prevent integer overflows and maintain game balance, the offline progression is capped at 12 hours (`43200` seconds).

```typescript
export const calculateOfflineProgress = (
  initialState: GameState,
  elapsedSeconds: number,
): { updatedState: GameState; summary: OfflineSummary } => {
  const maxSeconds = 43200; // 12h cap
  let remainingSeconds = Math.min(elapsedSeconds, maxSeconds);
  // ...
```

The system then branches into two distinct calculation methods depending on what the player was doing when they closed the game: Queue Processing or Endless Actions.

## Scenario 1: The Queue & The Material Bottleneck

If the player left tasks in the crafting Queue, the system cannot simply use a time-based multiplication formula. Crafting requires resources (e.g., Smelting Iron requires Iron Ore). If the player runs out of ore after 2 hours, the simulation must stop processing that task, even if they were offline for 10 hours.

The system uses a while loop to iterate through the queue, strictly checking both the time available and the materials required:

```typescript
// --- MATERIAL CHECK ---
let maxByMaterials = Infinity;
if (resource.inputs && resource.inputs.length > 0) {
  resource.inputs.forEach((input: Ingredient) => {
    const available = currentState.inventory[input.id] || 0;
    const possibleWithThisInput = Math.floor(available / input.count);
    maxByMaterials = Math.min(maxByMaterials, possibleWithThisInput);
  });
}

// Halt the queue task if out of materials
if (maxByMaterials === 0 && resource.inputs) break;

const possibleByTime = Math.floor(remainingSeconds / intervalSeconds);

// Process based on the tightest bottleneck (Time vs. Materials vs. Target Amount)
const actualCompletions = Math.min(todoCount, possibleByTime, maxByMaterials);
```

Once the bottleneck is determined, it deducts the exact materials used, adds the crafted items, grants the XP, and subtracts the consumed time from remainingSeconds. If time remains, it shifts to the next item in the queue.

## Scenario 2: Simulation vs. Multiplication

If the player was performing an "endless" skilling action (like Woodcutting), the math is a simple $O(1)$ multiplication:
completions = Math.floor(remainingSeconds / intervalSeconds)

However, Combat cannot be multiplied this way. Combat involves RNG drop tables, varying attack speeds, auto-eating mechanics, and enemy respawn timers.

To solve this accurately, the offline system re-uses the exact same pure function (processCombatTick) that the live game uses, running a fast $O(n)$ for loop to simulate the combat second-by-second:

```typescript
// COMBAT SIMULATION
const xpAtStart = { ...initialState.skills };

for (let i = 0; i < remainingSeconds; i++) {
  if (!currentState.activeAction) break; // Stop if player died

  // Re-use the live game logic!
  const updates = processCombatTick(currentState, 1000);
  Object.assign(currentState, updates);

  // Apply deep merges for stats and inventory...
}

// Generate an exact delta for the UI
summary.xpGained = calculateXpDifference(xpAtStart, currentState.skills);
summary.itemsGained = calculateItemDifference(
  initialState.inventory,
  currentState.inventory,
);
```

## The Offline Summary

Instead of forcing the UI to guess what changed, the calculateOfflineProgress function returns both the newly mutated state AND a clean OfflineSummary object.

This creates a seamless user experience where the UI simply renders a modal showing exactly what the player earned while they were asleep:

```typescript
export interface OfflineSummary {
  seconds: number;
  xpGained: Partial<Record<SkillType, number>>;
  itemsGained: Record<string, number>;
}
```

Key Engineering Wins

1. DRY Principle: The combat simulation doesn't reinvent the wheel; it imports the live combat logic and runs it in a fast-forward loop.

2. Economy Protection: By rigorously checking maxByMaterials, players cannot exploit offline time to craft items they don't have the resources for.

3. Pure Logic: Because this function takes an initialState and returns an updatedState without causing side effects, it is incredibly easy to unit test.
