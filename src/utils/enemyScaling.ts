export interface GeneratedEnemyStats {
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
}

/**
 * HARDKOODATUT BOSSIT (Manuaalinen tasapainotus)
 * Täältä voit säätää jokaisen pomon statsit täysin vapaasti ilman,
 * että se vaikuttaa muihin maailmoihin tai perusvihollisiin.
 */
const BOSS_STATS: Record<number, GeneratedEnemyStats> = {
  1: { enemyHp: 400, enemyAttack: 18, xpReward: 250 },
  2: { enemyHp: 900, enemyAttack: 75, xpReward: 1000 },
  3: { enemyHp: 2000, enemyAttack: 280, xpReward: 3500 },
  4: { enemyHp: 4500, enemyAttack: 1100, xpReward: 10000 },
  5: { enemyHp: 9500, enemyAttack: 4000, xpReward: 26000 },
  6: { enemyHp: 21000, enemyAttack: 15000, xpReward: 70000 },
  7: { enemyHp: 45000, enemyAttack: 55000, xpReward: 180000 },
  8: { enemyHp: 100000, enemyAttack: 205000, xpReward: 450000 },
};

/**
 * Vihollisten skaalaus.
 * Perusviholliset (Zonet 1-9) käyttävät edelleen eksponentiaalista kaavaa,
 * mutta Bossit (Zone 10) haetaan yllä olevasta taulukosta.
 */
export const calculateEnemyStats = (
  world: number,
  zone: number,
): GeneratedEnemyStats => {
  const isBoss = zone === 10;

  // Jos vihollinen on pomo, palautetaan suoraan hardkoodatut statsit!
  if (isBoss) {
    // Fallback: Jos world on yli 8 (esim. tulevat päivitykset), luodaan placeholder
    return (
      BOSS_STATS[world] || {
        enemyHp: 200000,
        enemyAttack: 300000,
        xpReward: 1000000,
      }
    );
  }

  // --- PERUSVIHOLLISTEN (Zonet 1-9) LASKENTA ---
  const HP_BASE = 100;
  const DMG_BASE = 10;
  const XP_BASE = 15;

  // HP kasvaa maltillisesti 2.2x per maailma
  const worldBaseHp = HP_BASE * Math.pow(2.2, world - 1);

  // Damage kasvaa kovempaa (3.4x per maailma) vastatakseen pelaajan armoria
  const worldBaseDmg = DMG_BASE * Math.pow(3.4, world - 1);

  const worldBaseXp = XP_BASE * Math.pow(2.2, world - 1);

  // Zonet 1-9 vaikeutuvat maltilliset 8% kerrallaan maailman sisällä
  const zoneMultiplier = 1 + (zone - 1) * 0.08;

  return {
    enemyHp: Math.floor(worldBaseHp * zoneMultiplier),
    enemyAttack: Math.floor(worldBaseDmg * zoneMultiplier),
    xpReward: Math.floor(worldBaseXp * zoneMultiplier),
  };
};
