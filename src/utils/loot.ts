import type { WeightedDrop } from '../types';

export function rollWeightedDrop(drops: WeightedDrop[]): { itemId: string; amount: number } | null {
  if (!drops || drops.length === 0) return null;

  const totalWeight = drops.reduce((sum, drop) => sum + drop.weight, 0);
  let random = Math.random() * totalWeight;

  for (const drop of drops) {
    if (random < drop.weight) {
      // KORJAUS: Tarkistetaan löytyykö amount ja onko siinä vähintään kaksi arvoa
      // Jos ei löydy, käytetään oletuksena määrää 1 (eli [1, 1])
      const min = drop.amount && drop.amount.length >= 1 ? drop.amount[0] : 1;
      const max = drop.amount && drop.amount.length >= 2 ? drop.amount[1] : min;
      
      const amount = Math.floor(Math.random() * (max - min + 1)) + min;
      
      return { itemId: drop.itemId, amount };
    }
    random -= drop.weight;
  }

  return null;
}