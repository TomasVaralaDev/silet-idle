import { ACHIEVEMENTS } from "../data/achievements";
import type { GameState } from "../types";

/**
 * checkNewAchievements
 * Scans through all currently locked achievements and evaluates their unique unlock conditions
 * against the provided current GameState.
 *
 * NOTE: This function only identifies and "unlocks" achievements. The player must still
 * manually "claim" them via the UI to receive the associated rewards.
 *
 * @param state - The current active GameState
 * @returns Array of achievement IDs that have just met their unlock conditions
 */
export const checkNewAchievements = (state: GameState): string[] => {
  const unlocked = state.unlockedAchievements || [];

  // Filter out already unlocked achievements, then test the condition function of the remaining ones
  return ACHIEVEMENTS.filter((ach) => !unlocked.includes(ach.id))
    .filter((ach) => ach.condition(state))
    .map((ach) => ach.id);
};
