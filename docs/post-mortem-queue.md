# Post-Mortem: The Queue Synchronization Bug

In software engineering, the most frustrating bugs are often not syntax errors, but architectural desyncs. This is a post-mortem of a subtle logic bug that occurred within the game's progression systems, how it was tracked down using Vitest, and what it taught me about centralized state mutations.

## The Symptom

During playtesting, a critical issue emerged with the **Daily Quest System**:

- Quests related to combat (e.g., "Defeat 20 Slimes") were tracking correctly.
- Quests related to skilling (e.g., "Chop 50 Pine Logs") were **stuck at 0 progress**, even though the player's inventory was filling up with wood and the progression bars were animating normally.

## The Investigation

### Hypothesis 1: Broken Quest Logic

Initially, I assumed the `processQuestProgress` function in `questSystem.ts` was failing to recognize gathering actions. To test this, I added the tracking trigger to `skillSystem.ts` (the module responsible for processing individual skill ticks).

Result: **Failure.** The progress bar in the UI still didn't move.

### Hypothesis 2: Data Integrity Mismatch

In an RPG with hundreds of items, an ID mismatch is a common culprit. If the quest requires `targetId: 'pine_log'` but the actual game data outputs `resource.id: 'pine_tree'`, the quest will never trigger.

Instead of hunting through code manually with `console.log`, I wrote an automated Vitest suite (`tests/systems/questTracking.test.ts`):

```typescript
describe("1. Data Integrity (ID Mismatch Check)", () => {
  it("should verify that every quest targetId actually exists in GAME_DATA", () => {
    QUEST_DATABASE.forEach((quest) => {
      const skillData = GAME_DATA[quest.requiredSkill];
      const targetResource = skillData?.find((r) => r.id === quest.targetId);

      expect(
        targetResource,
        `CRITICAL MISMATCH: Quest '${quest.id}' is looking for '${quest.targetId}'`,
      ).toBeDefined();
    });
  });
});
```

Result: The tests passed green. There was no ID mismatch, and an isolated unit test proved that the skillSystem updated the quest state perfectly.

## The Root Cause: Bypassed Systems

If the logic worked perfectly in an isolated test, the bug had to be in the integration layer.

I traced the execution path of the game's idle Queue system. Because TimeRing heavily relies on an automated action queue (allowing players to queue up 100 logs to be chopped automatically), the main React game loop (useGameEngine.ts) was optimizing the ticks.

To prevent massive re-renders and batch multiple state updates (inventory, XP, active action, queue popping) into a single Zustand setState call, useGameEngine.ts was executing the item-granting logic inline. It completely bypassed the skillSystem.ts file where I had placed the quest tracking hook. Combat quests worked because combat used a different, isolated loop (processCombatTick).

## The Fix

The solution was to inject the quest tracking directly into the batched updates inside the main game loop, ensuring it catches both manual clicks and automated Queue completions.

```typescript
// Inside useGameEngine.ts (The 100ms Game Loop)
if (possibleCompletions > 0) {
  // 1. Grant Items
  newInventory[resource.id] = (newInventory[resource.id] || 0) + possibleCompletions;

  // 2. Grant XP
  const { level: newLevel, xp: newXp } = calculateXpGain(...);

  // 3. FIX: Trigger Quest Progress directly in the engine's batch
  const questType = resource.inputs && resource.inputs.length > 0 ? 'CRAFT' : 'GATHER';
  const updatedDailyQuests = processQuestProgress(
    currentState.quests.dailyQuests,
    questType,
    resource.id,
    possibleCompletions // Pass the exact amount crafted/gathered from the queue
  );

  updates.quests = { ...currentState.quests, dailyQuests: updatedDailyQuests };
}
```

## Lessons Learned

1. Trust the Tests: When the unit tests for a system pass but the feature is broken in production, the bug is almost always in the integration layer or how the system is being invoked.

2. The Danger of Duplicated Logic: The root cause existed because the logic to "give the player an item" existed in two places (a pure system function and the engine loop). Refactoring to ensure a Single Source of Truth for state mutations prevents these desyncs.

3. Automated Diagnostics: Writing the Data Integrity Check test was incredibly valuable. Instead of fixing a bug once, that test will now run on every future commit, ensuring I never accidentally misspell an item ID in the quest database again.
