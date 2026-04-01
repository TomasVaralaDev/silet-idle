import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import {
  createListing,
  purchaseListing,
  cancelListing,
} from "../../src/services/marketService";
import { useGameStore, DEFAULT_STATE } from "../../src/store/useGameStore";
import { httpsCallable } from "firebase/functions";

// ============================================================================
// SILENCE ZUSTAND PERSIST WARNING (Missing browser environment)
// ============================================================================
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("zustand persist middleware")
  )
    return;
  originalConsoleWarn(...args);
};

// ============================================================================
// 1. MOCK FIREBASE FIRESTORE (For local transactions & queries)
// ============================================================================
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn((db, path, id) => `${path}/${id || "new_id"}`),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    getDocs: vi.fn(async () => ({
      docs: [], // MOCK: Return empty active listings so the listing limit is never reached in these tests
    })),
    runTransaction: vi.fn(async (db, cb) => {
      const mockTransaction = {
        get: vi.fn(async (refStr: string) => {
          const path = String(refStr);

          // NOTE: "poorbuyer" must be checked BEFORE "buyer"
          if (path.includes("poorbuyer")) {
            return {
              exists: (): boolean => true,
              data: () => ({ coins: 10, inventory: {} }),
            };
          }
          if (path.includes("buyer")) {
            return {
              exists: (): boolean => true,
              data: () => ({ coins: 1000, inventory: {} }),
            };
          }
          if (path.includes("seller")) {
            return {
              exists: (): boolean => true,
              data: () => ({ coins: 500, inventory: { wood: 50 } }),
            };
          }
          if (path.includes("listing")) {
            return {
              exists: (): boolean => true,
              data: () => ({
                id: "listing_123",
                sellerUid: "seller",
                itemId: "wood",
                amount: 10,
                pricePerItem: 50,
                totalPrice: 500,
                status: "active",
              }),
            };
          }
          return { exists: (): boolean => false };
        }),
        update: vi.fn(),
        set: vi.fn(),
      };

      await cb(mockTransaction);
      return mockTransaction;
    }),
  };
});

// ============================================================================
// 2. MOCK FIREBASE CLOUD FUNCTIONS
// ============================================================================
vi.mock("firebase/functions", () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: vi.fn(),
}));

vi.mock("../../src/firebase", () => ({
  db: {},
}));

// ============================================================================
// 3. TESTS
// ============================================================================
describe("Market Service Logic", () => {
  beforeEach(() => {
    // Reset store and provide test buyer with initial 1000 coins
    useGameStore.setState({
      ...DEFAULT_STATE,
      coins: 1000,
      inventory: {},
    });
    vi.clearAllMocks();
  });

  describe("createListing()", () => {
    it("onnistuu, jos myyjällä on tarpeeksi itemeitä, ja vähentää ne repusta", async () => {
      await createListing("seller", "PlayerOne", "wood", 10, 50);
      const store = useGameStore.getState();
      expect(store.inventory["wood"]).toBe(40);
    });

    it("heittää virheen, jos itemeitä ei ole tarpeeksi", async () => {
      await expect(
        createListing("seller", "PlayerOne", "wood", 150, 50),
      ).rejects.toThrow("Not enough items");
    });
  });

  describe("purchaseListing()", () => {
    it("onnistuu osto: vähentää ostajan rahat ja lisää itemit reppuun", async () => {
      // MOCK: Cloud Function returns success payload
      (httpsCallable as Mock).mockReturnValue(async () => ({
        data: { success: true, itemId: "wood", amount: 10, totalPrice: 500 },
      }));

      await purchaseListing("buyer", "listing_123");

      const store = useGameStore.getState();

      expect(store.coins).toBe(500);
      expect(store.inventory["wood"]).toBe(10);
    });

    it("estää oston, jos rahat eivät riitä", async () => {
      // MOCK: Cloud Function throws error to simulate backend validation failure
      (httpsCallable as Mock).mockReturnValue(async () => {
        throw new Error("Not enough coins");
      });

      await expect(purchaseListing("poorbuyer", "listing_123")).rejects.toThrow(
        "Not enough coins",
      );
    });
  });

  describe("cancelListing()", () => {
    it("palauttaa peruutetun ilmoituksen itemit takaisin myyjän reppuun", async () => {
      await cancelListing("listing_123", "seller");
      const store = useGameStore.getState();
      expect(store.inventory["wood"]).toBe(60);
    });

    it("estää peruutuksen, jos käyttäjä yrittää perua toisen pelaajan ilmoituksen", async () => {
      await expect(cancelListing("listing_123", "wrong_user")).rejects.toThrow(
        "Invalid",
      );
    });
  });
});
