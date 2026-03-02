import { describe, it, expect } from "vitest";
import {
  calculateXpGain,
  getRequiredXpForLevel,
} from "../../src/utils/gameUtils";

describe("GameUtils: Leveling & XP Logic", () => {
  it("should require exactly 40 XP for level 1 -> 2", () => {
    expect(getRequiredXpForLevel(1)).toBe(40);
  });

  it("should require exactly 392,040 XP for level 99", () => {
    // 40 * 99^2 = 392040
    expect(getRequiredXpForLevel(99)).toBe(392040);
  });

  it("should level up and keep remaining XP", () => {
    const result = calculateXpGain(1, 0, 100);
    expect(result.level).toBe(2);
    expect(result.xp).toBe(60);
  });

  it("should handle multi-level jumps correctly", () => {
    const result = calculateXpGain(1, 0, 500);
    expect(result.level).toBe(3);
    expect(result.xp).toBe(300);
  });

  it("should enforce the Level 99 Cap and not over-accumulate XP", () => {
    const result = calculateXpGain(98, 0, 1000000);
    expect(result.level).toBe(99);
    expect(result.xp).toBeLessThanOrEqual(392040);
  });

  it("should safely handle string and NaN inputs", () => {
    const result = calculateXpGain(
      "10" as unknown as number,
      "50" as unknown as number,
      "100" as unknown as number,
    );
    expect(typeof result.level).toBe("number");
    expect(result.level).toBe(10);
  });
});

describe("KRIITTINEN: Level 99+ Data Integrity & Performance", () => {
  it("EI SAA palauttaa NaN tai Infinity arvoja millään tasolla", () => {
    for (let lvl = 1; lvl <= 110; lvl++) {
      const req = getRequiredXpForLevel(lvl);
      const gain = calculateXpGain(lvl, 0, 1000);

      // Käytetään Number.isFinite() jotta vältytään TS-virheiltä
      expect(Number.isFinite(req), `Lvl ${lvl} vaatimus on viallinen`).toBe(
        true,
      );
      expect(
        req,
        `Lvl ${lvl} vaatimus on nolla tai negatiivinen`,
      ).toBeGreaterThan(0);

      expect(Number.isFinite(gain.level), `Lvl ${lvl} gain.level on NaN`).toBe(
        true,
      );
      expect(Number.isFinite(gain.xp), `Lvl ${lvl} gain.xp on NaN`).toBe(true);
    }
  });

  it("Suorituskykytesti: 10 000 laskentaa tasolla 99", () => {
    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      calculateXpGain(99, 0, 500);
    }

    const end = performance.now();
    const totalTime = end - start;
    const timePerOp = totalTime / iterations;

    console.log(`10k operaatiota tasolla 99 kesti: ${totalTime.toFixed(2)} ms`);

    // Testataan että suorituskyky on alle 0.1ms per operaatio
    expect(timePerOp).toBeLessThan(0.1);
  });

  it('Varmistetaan ettei XP "pompi" edestakaisin tasolla 99', () => {
    let current = { level: 99, xp: 0 };
    for (let i = 0; i < 10; i++) {
      current = calculateXpGain(current.level, current.xp, 1000);
      expect(current.level).toBe(99);
      expect(current.xp).toBeLessThanOrEqual(getRequiredXpForLevel(99));
    }
  });
});
