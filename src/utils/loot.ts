import type { WeightedDrop } from "../types";

/**
 * rollWeightedDrop
 * RNG loot generator. Uses weighted probabilities to select an item from a pool,
 * then generates a random quantity based on the drop's defined min/max bounds.
 */
export function rollWeightedDrop(
  drops: WeightedDrop[],
): { itemId: string; amount: number } | null {
  if (!drops || drops.length === 0) return null;

  const totalWeight = drops.reduce((sum, drop) => sum + drop.weight, 0);
  let random = Math.random() * totalWeight;

  for (const drop of drops) {
    if (random < drop.weight) {
      // Extract min and max amounts, defaulting to 1 if missing
      const min = drop.amount && drop.amount.length >= 1 ? drop.amount[0] : 1;
      const max = drop.amount && drop.amount.length >= 2 ? drop.amount[1] : min;

      const amount = Math.floor(Math.random() * (max - min + 1)) + min;

      return { itemId: drop.itemId, amount };
    }
    random -= drop.weight;
  }

  return null;
}
