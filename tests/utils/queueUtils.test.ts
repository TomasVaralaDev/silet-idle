import { describe, it, expect } from "vitest";
import { calculateQueueTimeLeft } from "../../src/utils/queueUtils";
import type {
  QueueItem,
  ActiveAction,
  GameState,
  Resource,
} from "../../src/types";

describe("calculateQueueTimeLeft", () => {
  // Mockataan GameData ja castataan se Resource-tyypiksi jotta TypeScript on tyytyväinen
  const mockGameData: Record<string, Resource[]> = {
    woodcutting: [{ id: "pine_tree", interval: 3000 } as Resource],
  };

  // KORJAUS: Otettu 'id' argumentti pois, koska sitä ei käytetä (ESLint tykkää)
  const mockGetItemDetails = () => null;

  // Luodaan tyhjä varuste-objekti testejä varten
  const emptyEquipment: GameState["equipment"] = {
    head: null,
    body: null,
    legs: null,
    weapon: null,
    shield: null,
    necklace: null,
    ring: null,
    rune: null,
    skill: null,
  };

  it("should return 0 if queue is empty", () => {
    expect(
      calculateQueueTimeLeft(
        [],
        null,
        [],
        emptyEquipment,
        mockGameData,
        mockGetItemDetails,
      ),
    ).toBe(0);
  });

  it("should calculate base time for queued items correctly", () => {
    const queue: QueueItem[] = [
      {
        id: "1",
        skill: "woodcutting",
        resourceId: "pine_tree",
        amount: 5,
        completed: 0,
      },
    ];

    // 5 kpl * 3000ms = 15000ms
    const result = calculateQueueTimeLeft(
      queue,
      null,
      [],
      emptyEquipment,
      mockGameData,
      mockGetItemDetails,
    );
    expect(result).toBe(15000);
  });

  it("should account for active action progress (live countdown)", () => {
    const queue: QueueItem[] = [
      {
        id: "1",
        skill: "woodcutting",
        resourceId: "pine_tree",
        amount: 5,
        completed: 0,
      },
    ];

    // Tämä simuloituu tilannetta missä on hakattu 1 sekunti (1000ms) nykyistä puuta
    const activeAction: ActiveAction = {
      skill: "woodcutting",
      resourceId: "pine_tree",
      progress: 1000,
      targetTime: 3000,
    };

    // Nykyinen puu: 3000ms - 1000ms = 2000ms.
    // Loput 4 puuta: 4 * 3000ms = 12000ms.
    // Yhteensä: 14000ms.
    const result = calculateQueueTimeLeft(
      queue,
      activeAction,
      [],
      emptyEquipment,
      mockGameData,
      mockGetItemDetails,
    );
    expect(result).toBe(14000);
  });
});
