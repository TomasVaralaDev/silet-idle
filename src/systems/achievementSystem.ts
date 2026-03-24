import { ACHIEVEMENTS } from "../data/achievements";
import type { GameState } from "../types";

/**
 * Käy läpi lukitut saavutukset ja palauttaa niiden ID:t,
 * joiden ehdot täyttyvät nykyisessä pelitilassa.
 * HUOM: Tämä vain "avaa" (unlock) ne, jotta pelaaja voi lunastaa (claim) palkinnot.
 */
export const checkNewAchievements = (state: GameState): string[] => {
  const unlocked = state.unlockedAchievements || [];

  // Suodatetaan pois jo avatut ja tarkistetaan ehto lopuille
  return ACHIEVEMENTS.filter((ach) => !unlocked.includes(ach.id))
    .filter((ach) => ach.condition(state))
    .map((ach) => ach.id);
};
