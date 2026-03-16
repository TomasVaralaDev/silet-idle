export interface GeneratedEnemyStats {
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
}

/**
 * LOPULLINEN BALANSSIPÄIVITYS v3
 * Korjattu "Potion Outscaling" -ongelma. Vihollisten damage kasvaa nyt loppupeliä kohti
 * eksponentiaalisesti nopeammin, jotta se läpäisee pelaajan valtavan armorin ja haastaa Divine Potionien 10 000 HP healin.
 * Alkupeli (W1 & W2) on puolestaan tehty anteeksiantavammaksi.
 */
export const calculateEnemyStats = (
  world: number,
  zone: number,
): GeneratedEnemyStats => {
  const isBoss = zone === 10;

  const HP_BASE = 100;
  const DMG_BASE = 10;
  const XP_BASE = 15;

  // HP kasvaa maltillisesti 2.2x per maailma (pitää W8 Bossin TTK:n parissa minuutissa)
  const worldBaseHp = HP_BASE * Math.pow(2.2, world - 1);

  // DAMAGE KASVAA NYT 3.4x PER MAAILMA. (Aiemmin 2.6x).
  // Tämä kompensoi pelaajan 500x kasvanutta potion-healiä ja 300x kasvanutta armoria.
  const worldBaseDmg = DMG_BASE * Math.pow(3.4, world - 1);

  const worldBaseXp = XP_BASE * Math.pow(2.2, world - 1);

  if (isBoss) {
    return {
      // W1 Boss: ~400 HP. W8 Boss: ~125 000 HP.
      enemyHp: Math.floor(worldBaseHp * 4),

      // Dynaaminen Boss-kerroin: Kasvaa hitaasti maailmojen mukana.
      // W1 Boss: 10 * 1.8 = 18 Attack (Helppo selvitä pronssikamoilla ja Weak Potionilla!)
      // W8 Boss: ~52 000 * 3.9 = ~204 000 Attack (Puhkoo Starfallin armoria n. 1700 dmg/isku!)
      enemyAttack: Math.floor(worldBaseDmg * (1.5 + 0.3 * world)),

      xpReward: Math.floor(worldBaseXp * 15 * world),
    };
  }

  // Zonet 1-9 vaikeutuvat maltilliset 8% kerrallaan maailman sisällä
  const zoneMultiplier = 1 + (zone - 1) * 0.08;

  return {
    enemyHp: Math.floor(worldBaseHp * zoneMultiplier),
    enemyAttack: Math.floor(worldBaseDmg * zoneMultiplier),
    xpReward: Math.floor(worldBaseXp * zoneMultiplier),
  };
};
