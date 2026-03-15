# Building a 100ms Game Loop in React

React is exceptional at building user interfaces, but it is fundamentally not designed to be a game engine. A classic game loop needs to run continuously (e.g., 60 frames per second), calculate logic, and update the screen. In React, rapidly updating state inside a `useEffect` loop often leads to catastrophic re-render storms and memory leaks.

To solve this in **TimeRing**, I built a custom hook called `useGameEngine.ts`. It acts as the heartbeat of the entire application, running independently from the UI components.

## The Heartbeat: `setInterval` and Delta Time

Instead of relying on requestAnimationFrame (which pauses entirely when the browser tab is inactive), the engine uses a robust `setInterval` running at a `TICK_RATE` of 100ms.

Crucially, the game does not assume that exactly 100ms has passed. Browsers actively throttle `setInterval` in inactive tabs to save battery. To ensure game math remains perfectly accurate regardless of browser throttling, the engine calculates **Delta Time (`deltaMs`)**:

```typescript
export const useGameEngine = () => {
  const { setState, checkDailyReset } = useGameStore();

  useEffect(() => {
    const TICK_RATE = 100;

    const interval = setInterval(() => {
      setState((state: FullStoreState) => {
        const now = Date.now();
        const last = state.lastTimestamp || now;
        const deltaMs = now - last; // The absolute truth of time passed

        if (deltaMs <= 0) return {};

        let updates: Partial<FullStoreState> = { lastTimestamp: now };

        // ... game logic applies deltaMs to progress bars
```

By multiplying skilling progress by deltaMs rather than a fixed number, a player chopping wood in a background tab progressing at 1 update per second receives the exact same amount of wood as a player staring at the active tab progressing at 10 updates per second.

## Batched Mutations

Calling setState multiple times inside a loop is a performance killer. To keep React rendering smooth, the engine gathers all necessary changes into a single updates object.

It checks combat, queue progression, and skill targets. Only at the very end of the tick does it commit the changes to the Zustand store:

```typescript
// --- Inside the interval ---

        if (currentAction.skill === "combat") {
          // Combat system returns a partial state object
          const combatUpdates = processCombatTick(state as unknown as GameState, deltaMs);
          updates = { ...updates, ...combatUpdates };
        } else {
          // Skilling logic adds to the inventory and handles XP
          updates.inventory = newInventory;
          updates.skills = newSkills;
        }

        // Only trigger a re-render if something actually changed
        return Object.keys(updates).length > 0 ? updates : {};
      });
    }, TICK_RATE);
```

## Sub-Ticks: 100ms vs 1 Second

Not everything needs to be calculated 10 times a second. Progress bars need to be smooth (100ms), but checking for achievements or regenerating HP only needs to happen once a second.

The engine handles this by calculating an isNewSecond boolean, optimizing performance by running heavy checks less frequently:

```typescript
const isNewSecond = Math.floor(last / 1000) !== Math.floor(now / 1000);

if (isNewSecond) {
  // Regenerate player HP based on gear
  // Check for unlocked achievements
  // Check if Daily Quests need to be reset
  const newUnlockIds = checkNewAchievements(state);
  // ...
}
```

Key Engineering Wins

1. Delta Time Accuracy: The game economy cannot be broken by lag or background tab throttling.

2. Render Optimization: By batching updates into a single Zustand setState call, the UI stays incredibly responsive without dropping frames.

3. Decoupled Logic: The React hook acts only as the conductor. The actual heavy lifting (math, RNG, logic) is delegated to pure systems like processCombatTick().
