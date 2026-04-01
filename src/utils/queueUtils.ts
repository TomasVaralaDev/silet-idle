import { getSpeedMultiplier } from "./gameUtils";
import type { QueueItem, ActiveAction, GameState, Resource } from "../types";

/**
 * calculateQueueTimeLeft
 * Parses the entire action queue and calculates the total estimated real-world time (in MS)
 * required to complete all pending tasks. Accounts for dynamic speed multipliers from gear and upgrades.
 */
export const calculateQueueTimeLeft = (
  queue: QueueItem[],
  activeAction: ActiveAction | null,
  upgrades: string[],
  equipment: GameState["equipment"],
  gameData: Record<string, Resource[] | undefined>,
  getItemDetailsData: (id: string) => Resource | null | undefined,
): number => {
  if (!queue || queue.length === 0) return 0;

  let totalMs = 0;

  queue.forEach((item, index) => {
    const skillData = gameData[item.skill];
    const resource = skillData?.find((r: Resource) => r.id === item.resourceId);

    if (!resource) return;

    const baseInterval = resource.interval || 3000;
    const upgradeMultiplier = getSpeedMultiplier(item.skill, upgrades);

    // Apply specific Rune speed bonuses
    let runeSpeedBonus = 0;
    if (equipment?.rune) {
      const runeDetails = getItemDetailsData(equipment.rune);
      if (runeDetails?.skillModifiers) {
        const modKey = `${item.skill}Speed` as keyof NonNullable<
          Resource["skillModifiers"]
        >;
        runeSpeedBonus = runeDetails.skillModifiers[modKey] || 0;
      }
    }

    const totalMultiplier = upgradeMultiplier + runeSpeedBonus;
    const realIntervalMs = Math.max(200, baseInterval / totalMultiplier);

    const remainingCompletions = item.amount - item.completed;

    // Deduct time already spent processing the currently active task
    if (
      index === 0 &&
      activeAction &&
      activeAction.resourceId === item.resourceId
    ) {
      if (remainingCompletions > 0) {
        const timeForCurrentItem = Math.max(
          0,
          activeAction.targetTime - activeAction.progress,
        );
        totalMs +=
          timeForCurrentItem + (remainingCompletions - 1) * realIntervalMs;
      }
    } else {
      totalMs += remainingCompletions * realIntervalMs;
    }
  });

  return totalMs;
};
