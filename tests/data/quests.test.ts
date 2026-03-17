import { describe, it, expect } from "vitest";
import { QUEST_DATABASE } from "../../src/data/quests";
import { COMBAT_DATA } from "../../src/data/combat";
import { getItemDetails } from "../../src/data/index";

describe("Quest Database Validation", () => {
  it("should have exactly 55 quests", () => {
    expect(QUEST_DATABASE.length).toBe(55); // Vaihda 50 -> 55
  });

  it("should have strictly unique quest IDs", () => {
    const ids = QUEST_DATABASE.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid required levels and positive target amounts", () => {
    QUEST_DATABASE.forEach((quest) => {
      expect(quest.requiredLevel).toBeGreaterThan(0);
      expect(quest.targetAmount).toBeGreaterThan(0);
      expect(quest.title.length).toBeGreaterThan(0);
      expect(quest.description.length).toBeGreaterThan(0);
    });
  });

  it("should have valid target references for KILL quests", () => {
    const killQuests = QUEST_DATABASE.filter((q) => q.type === "KILL");

    killQuests.forEach((quest) => {
      // Varmistetaan, että vihollinen/map ID löytyy COMBAT_DATAsta
      const enemyExists = COMBAT_DATA.some(
        (map) => map.id.toString() === quest.targetId,
      );

      expect(
        enemyExists,
        `Quest '${quest.id}' has an invalid KILL targetId: '${quest.targetId}'. Enemy not found in COMBAT_DATA.`,
      ).toBe(true);
    });
  });

  it("should have valid target references for GATHER and CRAFT quests", () => {
    const itemQuests = QUEST_DATABASE.filter(
      (q) => q.type === "GATHER" || q.type === "CRAFT",
    );

    itemQuests.forEach((quest) => {
      // Varmistetaan, että kerättävä tai craftattava item löytyy getItemDetails-tehtaasta
      const item = getItemDetails(quest.targetId);

      expect(
        item,
        `Quest '${quest.id}' has an invalid ${quest.type} targetId: '${quest.targetId}'. Item not found.`,
      ).not.toBeNull();
    });
  });

  it("should have valid item rewards", () => {
    QUEST_DATABASE.forEach((quest) => {
      if (quest.reward.items) {
        quest.reward.items.forEach((rewardItem) => {
          // Varmistetaan, että palkintoesine on oikeasti olemassa
          const item = getItemDetails(rewardItem.itemId);

          expect(
            item,
            `Quest '${quest.id}' gives an invalid reward item: '${rewardItem.itemId}'. Item not found.`,
          ).not.toBeNull();

          // Varmistetaan, että määrä on looginen
          expect(rewardItem.amount).toBeGreaterThan(0);
        });
      }
    });
  });

  it("should provide valid coin or XP rewards", () => {
    QUEST_DATABASE.forEach((quest) => {
      // Tehtävän pitää antaa joko kolikoita, XP:tä tai esineitä (tai kaikkia näitä)
      const hasCoins = quest.reward.coins && quest.reward.coins > 0;
      const hasXp =
        quest.reward.xpMap && Object.keys(quest.reward.xpMap).length > 0;
      const hasItems = quest.reward.items && quest.reward.items.length > 0;

      expect(
        hasCoins || hasXp || hasItems,
        `Quest '${quest.id}' provides no meaningful reward.`,
      ).toBe(true);

      // Jos antaa XP:tä, arvon pitää olla positiivinen
      if (hasXp) {
        Object.values(quest.reward.xpMap!).forEach((xpValue) => {
          expect(xpValue).toBeGreaterThan(0);
        });
      }
    });
  });
});
