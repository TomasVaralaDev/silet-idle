import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore, DEFAULT_STATE } from "../../src/store/useGameStore";

describe("Achievement Slice - claimAchievement", () => {
  // Nollataan store aina ennen jokaista testiä
  beforeEach(() => {
    useGameStore.setState({
      ...DEFAULT_STATE,
      coins: 100,
      inventory: { potion_tier1: 2 },
      skills: {
        ...DEFAULT_STATE.skills,
        melee: { level: 1, xp: 0 }, // Taso 1, 0 XP
      },
      unlockedAchievements: [],
      claimedAchievements: [],
    });
  });

  it("ei tee mitään, jos saavutusta ei ole avattu (unlocked)", () => {
    const store = useGameStore.getState();

    // Yritetään lunastaa oikea saavutus, mutta sitä ei ole avattu
    store.claimAchievement("wealth_1");

    const updatedStore = useGameStore.getState();
    expect(updatedStore.claimedAchievements).not.toContain("wealth_1");
    expect(updatedStore.coins).toBe(100); // Rahat eivät saaneet kasvaa
  });

  it("ei tee mitään, jos saavutus on jo lunastettu (claimed)", () => {
    useGameStore.setState({
      unlockedAchievements: ["wealth_1"],
      claimedAchievements: ["wealth_1"], // Jo haettu!
    });

    const store = useGameStore.getState();
    store.claimAchievement("wealth_1");

    const updatedStore = useGameStore.getState();
    expect(updatedStore.coins).toBe(100); // Palkintoa ei jaeta toista kertaa
  });

  it("jakaa kolikot ja esineet oikein (wealth_1)", () => {
    // "wealth_1" antaa (achievements.ts): 500 Coins, 5x potion_tier1
    useGameStore.setState({
      unlockedAchievements: ["wealth_1"],
      claimedAchievements: [],
    });

    const store = useGameStore.getState();
    store.claimAchievement("wealth_1");

    const updatedStore = useGameStore.getState();

    // 1. Lisätty lunastettujen listalle
    expect(updatedStore.claimedAchievements).toContain("wealth_1");

    // 2. Tarkistetaan kolikot: 100 (alkuperäinen) + 500 (palkinto) = 600
    expect(updatedStore.coins).toBe(600);

    // 3. Tarkistetaan esineet: 2 (alkuperäinen) + 5 (palkinto) = 7
    expect(updatedStore.inventory["potion_tier1"]).toBe(7);
  });

  it("laskee XP:n ja tasonnousun (level up) oikein (combat_map_1)", () => {
    useGameStore.setState({
      unlockedAchievements: ["combat_map_1"],
      claimedAchievements: [],
    });

    const store = useGameStore.getState();
    store.claimAchievement("combat_map_1");

    const updatedStore = useGameStore.getState();

    // 1. Lisätty lunastettujen listalle
    expect(updatedStore.claimedAchievements).toContain("combat_map_1");

    // 2. Tarkistetaan XP ja Level Up -logiikka ATTACK-taidosta!
    // Palkinto on 100 XP.
    // Taso 1 -> 2 vaatii 40 XP. Jäljelle jää 60 XP.
    // Taso 2 -> 3 vaatii 160 XP. Joten taso jää kakkoseen.

    // KORJATTU: Tarkistetaan attack, koska melee ei enää saa XP:tä tästä saavutuksesta
    expect(updatedStore.skills.attack.level).toBe(2);
    expect(updatedStore.skills.attack.xp).toBe(60);
  });
});
