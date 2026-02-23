export interface GeneratedEnemyStats {
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
}

/**
 * SRP: Tämä funktio vastaa vain vihollisten numeerisesta skaalauksesta.
 * Kaavat perustuvat pelin suunnitteludokumenttiin (Base HP 100, 4^world).
 */
export const calculateEnemyStats = (world: number, zone: number): GeneratedEnemyStats => {
  const isBoss = zone === 10;
  
  // Perusarvot
  const HP_BASE = 100;
  const DMG_BASE = 10;
  const XP_BASE = 15;

  // Maailman pohjaskaalaus
  const worldBaseHp = HP_BASE * Math.pow(4, world - 1);
  const worldBaseDmg = DMG_BASE * Math.pow(3.2, world - 1);
  const worldBaseXp = XP_BASE * Math.pow(2.8, world - 1); // XP skaalautuu hieman hitaammin

  // Jos kyseessä on bossi, käytetään Boss-kertoimia
  if (isBoss) {
    return {
      enemyHp: Math.floor(worldBaseHp * (25 + 5 * world)),
      enemyAttack: Math.floor(worldBaseDmg * (2 + 0.4 * world)),
      xpReward: Math.floor(worldBaseXp * 20 * world) // Bossit antavat jättipotin XP:tä
    };
  }

  // Tavalliset viholliset (Zones 1-9) skaalautuvat tasaisesti maailman sisällä.
  // Zone 1 = 1.0x kertoimella, Zone 9 = 2.2x kertoimella
  const zoneMultiplier = 1 + (zone - 1) * 0.15;

  return {
    enemyHp: Math.floor(worldBaseHp * zoneMultiplier),
    enemyAttack: Math.floor(worldBaseDmg * zoneMultiplier),
    xpReward: Math.floor(worldBaseXp * zoneMultiplier)
  };
};