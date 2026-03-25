import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createListing,
  purchaseListing,
  cancelListing,
} from "../../src/services/marketService";
import { useGameStore, DEFAULT_STATE } from "../../src/store/useGameStore";

// ============================================================================
// 1. MOCKATAAN FIREBASE (Ei oikeita kanta-operaatioita testeissä)
// ============================================================================
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn((db, path, id) => `${path}/${id || "new_id"}`),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    getDocs: vi.fn(),
    runTransaction: vi.fn(async (db, cb) => {
      const mockTransaction = {
        get: vi.fn(async (refStr: string) => {
          const path = String(refStr);

          // HUOM! "poorbuyer" pitää tarkistaa ENNEN "buyer":ia,
          // koska "poorbuyer" sisältää sanan "buyer"!
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
              // Tietokannan mukaan myyjällä on aina tasan 50 puuta aluksi.
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

vi.mock("../../src/firebase", () => ({
  db: {},
}));

// ============================================================================
// 2. TESTIT
// ============================================================================
describe("Market Service Logic", () => {
  beforeEach(() => {
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

      // Mock-kannassa myyjällä on 50 puuta. Koodi varaa niistä 10.
      // 50 - 10 = 40.
      expect(store.inventory["wood"]).toBe(40);
    });

    it("heittää virheen, jos itemeitä ei ole tarpeeksi", async () => {
      // Yritetään myydä 150 puuta (pelaajalla vain 50 mock-tietokannassa)
      await expect(
        createListing("seller", "PlayerOne", "wood", 150, 50),
      ).rejects.toThrow("Not enough items");
    });
  });

  describe("purchaseListing()", () => {
    it("onnistuu osto: vähentää ostajan rahat ja lisää itemit reppuun", async () => {
      await purchaseListing("buyer", "listing_123");

      const store = useGameStore.getState();

      // Ostajalla oli 1000 kolikkoa kannassa. Tuote maksaa 500.
      expect(store.coins).toBe(500);
      // Ostaja sai 10 puuta
      expect(store.inventory["wood"]).toBe(10);
    });

    it("estää oston, jos rahat eivät riitä", async () => {
      // "poorbuyer" yrittää ostaa, hänellä on vain 10 kolikkoa kannassa.
      await expect(purchaseListing("poorbuyer", "listing_123")).rejects.toThrow(
        "Not enough coins",
      );
    });
  });

  describe("cancelListing()", () => {
    it("palauttaa peruutetun ilmoituksen itemit takaisin myyjän reppuun", async () => {
      await cancelListing("listing_123", "seller");

      const store = useGameStore.getState();

      // Mock-kannassa myyjällä on 50 puuta varastossa.
      // Peruutuksesta palautuu 10 puuta. 50 + 10 = 60.
      expect(store.inventory["wood"]).toBe(60);
    });

    it("estää peruutuksen, jos käyttäjä yrittää perua toisen pelaajan ilmoituksen", async () => {
      await expect(cancelListing("listing_123", "wrong_user")).rejects.toThrow(
        "Invalid",
      );
    });
  });
});
