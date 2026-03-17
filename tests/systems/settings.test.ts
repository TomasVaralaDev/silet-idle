import { describe, it, expect } from "vitest";
import { customMerge, DEFAULT_STATE } from "../../src/store/useGameStore";
import type { FullStoreState } from "../../src/store/useGameStore";

describe("GameSettings & State Merging", () => {
  it("should preserve default theme if old save has no theme", () => {
    // Simuloidaan vanha tallennus, jossa settings oli olemassa mutta ilman teemaa
    const oldSaveData = {
      settings: {
        notifications: false, // Pelaaja oli laittanut nämä pois
        sound: false,
      },
    };

    // Ajetaan merge
    const mergedState = customMerge(
      oldSaveData,
      DEFAULT_STATE as FullStoreState,
    );

    // Varmistetaan että vanhat asetukset säilyivät
    expect(mergedState.settings.notifications).toBe(false);
    expect(mergedState.settings.sound).toBe(false);

    // VARMISTETAAN ETTÄ TEEMA EI OLE UNDEFINED VAAN DEFAULTTI
    expect(mergedState.settings.theme).toBe("theme-neon");
    expect(mergedState.settings.particles).toBe(true); // default arvo
  });

  it("should load custom theme if save has it", () => {
    const validSaveData = {
      settings: {
        theme: "theme-sakura",
        sound: true,
      },
    };

    const mergedState = customMerge(
      validSaveData,
      DEFAULT_STATE as FullStoreState,
    );

    // Teeman pitää latautua oikein
    expect(mergedState.settings.theme).toBe("theme-sakura");
  });
});
