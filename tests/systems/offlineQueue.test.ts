import { describe, it, expect, vi } from "vitest";
import { calculateOfflineProgress } from "../../src/systems/offlineSystem";
import { DEFAULT_STATE } from "../../src/store/useGameStore";
import type { GameState, QueueItem } from "../../src/types";

// MOCK: Varmistetaan että peli varmasti löytää nämä testiesineet.
vi.mock("../../src/data", () => ({
  GAME_DATA: {
    woodcutting: [
      { id: "pine_tree", interval: 3000, xpReward: 10 },
      { id: "oak_tree", interval: 3000, xpReward: 25 },
    ],
    smithing: [
      {
        id: "iron_bar",
        interval: 5000,
        xpReward: 50,
        inputs: [{ id: "iron_ore", count: 2 }], // Vaatii 2 malmia per kanki
      },
    ],
  },
}));

describe("Offline Queue Integration", () => {
  it("should process multiple queue items during offline period", () => {
    const initialQueue: QueueItem[] = [
      {
        id: "q1",
        skill: "woodcutting",
        resourceId: "pine_tree",
        amount: 10,
        completed: 0,
      },
      {
        id: "q2",
        skill: "woodcutting",
        resourceId: "oak_tree",
        amount: 10,
        completed: 0,
      },
    ];

    const state: GameState = {
      ...DEFAULT_STATE,
      queue: initialQueue,
      activeAction: {
        skill: "woodcutting",
        resourceId: "pine_tree",
        progress: 0,
        targetTime: 3000,
      },
    };

    // Simuloidaan 60 sekuntia (10 mäntyä = 30s, 10 tammea = 30s)
    const elapsedSeconds = 60;

    const { updatedState, summary } = calculateOfflineProgress(
      state,
      elapsedSeconds,
    );

    expect(updatedState.inventory["pine_tree"]).toBe(10);
    expect(updatedState.inventory["oak_tree"]).toBe(10);
    expect(updatedState.queue.length).toBe(0); // Koko jono tuli valmiiksi
    expect(summary.itemsGained["pine_tree"]).toBe(10);
  });

  it("should cap simulation at 12 hours but keep remaining queue", () => {
    const longQueue: QueueItem[] = [
      {
        id: "q1",
        skill: "woodcutting",
        resourceId: "pine_tree",
        amount: 99999,
        completed: 0,
      },
    ];

    const state: GameState = { ...DEFAULT_STATE, queue: longQueue };
    const fifteenHours = 15 * 3600;

    const { summary } = calculateOfflineProgress(state, fifteenHours);

    expect(summary.seconds).toBe(43200); // 12h = 43200s
  });

  it("should consume materials and stop when they run out", () => {
    // Asetus: Jonossa 10 rautakankea, mutta repussa vain 10 malmia (riittää 5 kankeen)
    const initialQueue: QueueItem[] = [
      {
        id: "q1",
        skill: "smithing",
        resourceId: "iron_bar",
        amount: 10,
        completed: 0,
      },
    ];

    const state: GameState = {
      ...DEFAULT_STATE,
      inventory: { iron_ore: 10 },
      queue: initialQueue,
      activeAction: {
        skill: "smithing",
        resourceId: "iron_bar",
        progress: 0,
        targetTime: 5000,
      },
    };

    // Simuloidaan 1 tunti (aikaa olisi vaikka kuinka paljon, mutta materiaalit loppuvat)
    const { updatedState, summary } = calculateOfflineProgress(state, 3600);

    // Tarkistukset
    expect(updatedState.inventory["iron_ore"]).toBe(0); // Malmit on syöty
    expect(updatedState.inventory["iron_bar"]).toBe(5); // Vain 5 kankea tehty

    // Jonon pitäisi olla edelleen tallessa, koska se jäi kesken
    expect(updatedState.queue.length).toBe(1);
    expect(updatedState.queue[0].completed).toBe(5);

    expect(summary.itemsGained["iron_bar"]).toBe(5);
  });
});
