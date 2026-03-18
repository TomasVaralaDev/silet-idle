import { describe, it, expect } from "vitest";
import { checkNewAchievements } from "../../src/systems/achievementSystem";
import type { GameState, SkillType, SkillData } from "../../src/types";

describe("AchievementSystem: Trigger Logic", () => {
  // Apufunktio täydellisen mock-tilan luomiseen
  const getMockState = (overrides: Partial<GameState> = {}): GameState => {
    const defaultSkills: Record<SkillType, SkillData> = {
      woodcutting: { level: 1, xp: 0 },
      mining: { level: 1, xp: 0 },
      fishing: { level: 1, xp: 0 },
      foraging: { level: 1, xp: 0 },
      crafting: { level: 1, xp: 0 },
      smithing: { level: 1, xp: 0 },
      alchemy: { level: 1, xp: 0 },
      hitpoints: { level: 10, xp: 0 },
      attack: { level: 1, xp: 0 },
      defense: { level: 1, xp: 0 },
      melee: { level: 1, xp: 0 },
      ranged: { level: 1, xp: 0 },
      magic: { level: 1, xp: 0 },
      combat: { level: 1, xp: 0 },
      scavenging: { level: 1, xp: 0 },
    };

    return {
      username: "TestPlayer",
      avatar: "",
      settings: {
        notifications: true,
        sound: true,
        music: true,
        particles: true,
        theme: "theme-neon",
      },
      inventory: {},
      skills: defaultSkills,
      equipment: {
        head: null,
        body: null,
        legs: null,
        weapon: null,
        shield: null,
        necklace: null,
        ring: null,
        rune: null,
        skill: null,
      },
      equippedFood: null,
      combatSettings: { autoEatThreshold: 50, autoProgress: false },
      scavenger: { activeExpeditions: [], unlockedSlots: 1 },
      activeAction: null,
      coins: 0,
      gems: 0,
      unlockedQueueSlots: 2,
      upgrades: [],
      unlockedAchievements: [],
      combatStats: {
        hp: 100,
        currentMapId: null,
        maxMapCompleted: 0,
        enemyCurrentHp: 0,
        respawnTimer: 0,
        foodTimer: 0,
        combatLog: [],
        cooldownUntil: 0,
        playerAttackTimer: 0,
        enemyAttackTimer: 0,
        damagePopUps: [],
      },
      enemy: null,
      lastTimestamp: Date.now(),
      events: [],
      social: {
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
        globalMessages: [],
        activeChatFriendId: null,
        unreadMessages: {},
      },
      quests: { dailyQuests: [], lastResetTime: 0 },
      queue: [],
      ...overrides,
    } as GameState;
  };

  it("should detect a wealth achievement (Pocket Change)", () => {
    const state = getMockState({ coins: 1500 });
    const newAchievements = checkNewAchievements(state);

    expect(newAchievements).toContain("wealth_1");
    // Ei pitäisi vielä saada Data Hoarder (100k) saavutusta
    expect(newAchievements).not.toContain("wealth_3");
  });

  it("should detect an XP-based achievement (First Chop)", () => {
    // KORJATTU: First chop katsoo nyt Woodcutting XP:tä, ei logeja!
    const state = getMockState();
    state.skills.woodcutting.xp = 15;

    const newAchievements = checkNewAchievements(state);
    expect(newAchievements).toContain("wc_1");
  });

  it("should detect a skill-level achievement (Novice Lumberjack)", () => {
    const state = getMockState();
    state.skills.woodcutting.level = 10;

    const newAchievements = checkNewAchievements(state);
    expect(newAchievements).toContain("wc_10");
  });

  it("should detect combat progress (First Blood)", () => {
    const state = getMockState();
    state.combatStats.maxMapCompleted = 1;

    const newAchievements = checkNewAchievements(state);
    expect(newAchievements).toContain("combat_map_1");
  });

  it("should NOT return achievements that are already unlocked", () => {
    const state = getMockState({
      coins: 2000,
      unlockedAchievements: ["wealth_1"], // wealth_1 on jo avattu
    });

    const newAchievements = checkNewAchievements(state);

    expect(newAchievements).not.toContain("wealth_1");
  });

  it("should detect multiple achievements at once", () => {
    const state = getMockState({
      coins: 1000,
    });
    state.skills.woodcutting.xp = 25; // Antaa wc_1 saavutuksen

    const newAchievements = checkNewAchievements(state);

    expect(newAchievements).toContain("wealth_1");
    expect(newAchievements).toContain("wc_1");

    // Tarkistaa, että tuli vähintään kaksi (voi tulla enemmänkin riippuen muiden skillien oletustiloista, mutta nämä 2 pitää löytyä)
    expect(newAchievements.length).toBeGreaterThanOrEqual(2);
  });
});
