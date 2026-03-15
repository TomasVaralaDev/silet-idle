# Scaling State with Zustand Slices

One of the biggest architectural challenges in building a browser-based RPG in React is state management. An idle game requires constant, massive state updates: combat calculations running every second, queues ticking down, and inventory numbers constantly shifting.

Using React's built-in `Context API` for this would result in catastrophic performance issues due to continuous re-rendering of the entire component tree. Using Redux would introduce significant boilerplate.

I chose **Zustand** for its atomic update capabilities, lightweight API, and excellent TypeScript support. However, putting the entire game state into a single file would create an unmaintainable monolith. To solve this, I implemented the **Slice Pattern**.

## The Slice Pattern

Instead of one massive store, the game's domains are broken down into logical "Slices". Each slice handles its own data and the specific actions (mutations) that apply to it.

For example, the Inventory domain (`inventorySlice.ts`) strictly handles coins, equipment, and item manipulation:

```typescript
export interface InventorySlice {
  inventory: Record<string, number>;
  coins: number;
  equipment: Record<Exclude<EquipmentSlot, "food">, string | null>;
  equippedFood: { itemId: string; count: number } | null;

  sellItem: (itemId: string, amount: number | "all") => void;
  equipItem: (itemId: string) => void;
  enchantItem: (originalId: string, newId: string, cost: number) => void;
  // ...
}
```

These independent slices are then merged into a single useGameStore using a centralized initialization file (useGameStore.ts). This provides a unified state tree while keeping the codebase strictly modular:

```typescript
export type FullStoreState = GameState &
  InventorySlice &
  SkillSlice &
  CombatSlice &
  QuestSlice &
  // ... other slices

export const useGameStore = create<FullStoreState>()(
  persist(
    (set, get, ...args) => ({
      ...DEFAULT_STATE,
      ...createInventorySlice(set, get, ...args),
      ...createSkillSlice(set, get, ...args),
      ...createCombatSlice(set, get, ...args),
      ...createQuestSlice(set, get, ...args),
      // ...
    }),
    {
      name: "ggez-idle-storage",
      version: 1,
      merge: (persisted, current) => customMerge(persisted, current as FullStoreState),
    }
  )
);
```

## Safe State Mutations

Because Zustand allows updating state from outside React components, we can decouple our heavy business logic from our UI.

Furthermore, functions inside slices act as robust gatekeepers. A great example of this is the sellItem function. UI inputs can be unpredictable, so the slice logic includes failsafes to ensure game economy integrity:

```typescript
sellItem: (itemId, amount) =>
  set((state) => {
    const item = getItemDetails(itemId);
    const currentCount = state.inventory[itemId] || 0;

    if (!item || currentCount <= 0) return {};

    // Failsafe: Handle UI string "all" or sanitize numeric inputs
    let parsedAmount = 0;
    if (amount === "all") {
      parsedAmount = currentCount;
    } else {
      parsedAmount = Number(amount) || 0;
    }

    if (parsedAmount <= 0) return {};

    const actualSellAmount = Math.min(parsedAmount, currentCount);
    const profit = actualSellAmount * (item.value || 0);

    const newInventory = { ...state.inventory };
    newInventory[itemId] = currentCount - actualSellAmount;
    if (newInventory[itemId] <= 0) delete newInventory[itemId];

    return {
      coins: state.coins + profit,
      inventory: newInventory,
    };
  }),
```

## Performance Benefits

By using Zustand with the slice pattern, components only subscribe to the exact pieces of state they need.

```typescript
// The UI only re-renders when the player's coins change.
// It ignores the 10-times-a-second updates happening to the combat timer.
const coins = useGameStore((state) => state.coins);
```

Key Takeaways

1. Separation of Concerns: UI components are "dumb" and only trigger slice actions. The slices contain the rules for state mutation.

2. Scalability: Adding a new feature (like a Guild System) simply means creating a guildSlice.ts and merging it into the main store.

3. Data Integrity: Slices act as a protective layer, validating inputs and preventing the UI from accidentally breaking the game's economy or logic.
