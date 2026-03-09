import { describe, it, expect } from "vitest";
import { processSkillTick } from "../../src/systems/skillSystem";
import { DEFAULT_STATE } from "../../src/store/useGameStore";
import { QUEST_DATABASE } from "../../src/data/quests";
import { GAME_DATA } from "../../src/data";
import type { GameState, ActiveQuest, Resource } from "../../src/types";

describe("Quest Tracking Diagnostics", () => {
  describe("1. Data Integrity (ID Mismatch Check)", () => {
    it("should verify that every quest targetId actually exists in GAME_DATA", () => {
      // Käydään läpi kaikki pelin questit
      QUEST_DATABASE.forEach((quest) => {
        // Taisteluquesteja ei tarkisteta tässä, koska ne käyttävät eri dataa (vihollisten ID:t)
        if (quest.type === "GATHER" || quest.type === "CRAFT") {
          const skillData = GAME_DATA[
            quest.requiredSkill as keyof typeof GAME_DATA
          ] as Resource[] | undefined;

          // Varmistetaan, että questin vaatima skilli (esim. 'mining') löytyy datasta
          expect(
            skillData,
            `Questin ${quest.id} vaatimaa skilliä '${quest.requiredSkill}' ei löydy GAME_DATA:sta!`,
          ).toBeDefined();

          // Etsitään resource, jonka ID vastaa questin targetId:tä
          const targetResource = skillData?.find(
            (r) => r.id === quest.targetId,
          );

          // Jos tätä ei löydy, testi kaatuu ja kertoo tarkalleen mikä ID on kirjoitettu väärin!
          expect(
            targetResource,
            `CRITICAL MISMATCH: Quest '${quest.id}' etsii kohdetta nimeltä '${quest.targetId}', mutta sitä ei löydy '${quest.requiredSkill}' datasta!`,
          ).toBeDefined();
        }
      });
    });
  });

  describe("2. Skill System Logic Check", () => {
    it("should increment quest progress when a skill action finishes", () => {
      // Luodaan manuaalinen testi-quest
      const testQuest: ActiveQuest = {
        id: "q_test_gather",
        title: "Test Gather",
        description: "Test",
        type: "GATHER",
        targetId: "test_item",
        targetAmount: 5,
        requiredLevel: 1,
        requiredSkill: "mining",
        reward: { coins: 100 },
        progress: 0,
        isCompleted: false,
        isClaimed: false,
      };

      // Injektoidaan testidata GAME_DATAan tilapäisesti tätä testiä varten
      const originalMiningData = GAME_DATA.mining;
      GAME_DATA.mining = [
        { id: "test_item", interval: 1000, xpReward: 10 } as Resource,
      ];

      const initialState: GameState = {
        ...DEFAULT_STATE,
        activeAction: {
          skill: "mining",
          resourceId: "test_item",
          progress: 999,
          targetTime: 1000,
        },
        quests: {
          dailyQuests: [testQuest],
          lastResetTime: Date.now(),
        },
      };

      const updates = processSkillTick(initialState, 10);

      const updatedQuest = updates.quests?.dailyQuests.find(
        (q) => q.id === "q_test_gather",
      );

      // Palautetaan alkuperäinen data
      GAME_DATA.mining = originalMiningData;

      expect(updates.quests).toBeDefined();
      expect(updatedQuest?.progress).toBe(1);
    });
  });
});
