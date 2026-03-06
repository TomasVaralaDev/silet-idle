export interface GeneratedEnemyStats {
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
}

/**
 * SRP: Tämä funktio vastaa vain vihollisten numeerisesta skaalauksesta.
 * Kaavat perustuvat pelin suunnitteludokumenttiin (Base HP 100, 4^world).
 */
export const calculateEnemyStats = (
  world: number,
  zone: number,
): GeneratedEnemyStats => {
  const isBoss = zone === 10;

  // Perusarvot
  const HP_BASE = 100;
  const DMG_BASE = 10;
  const XP_BASE = 15;

  // Maailman pohjaskaalaus
  const worldBaseHp = HP_BASE * Math.pow(4, world - 1);
  const worldBaseDmg = DMG_BASE * Math.pow(3.2, world - 1);
  const worldBaseXp = XP_BASE * Math.pow(2.8, world - 1);

  if (isBoss) {
    return {
      // W1 Boss: 100 * (6 + 2 * 1) = 800 HP
      enemyHp: Math.floor(worldBaseHp * (6 + 2 * world)),

      // W1 Boss: 10 * (1.5 + 0.3 * 1) = 18 DMG
      enemyAttack: Math.floor(worldBaseDmg * (1.5 + 0.3 * world)),

      xpReward: Math.floor(worldBaseXp * 20 * world),
    };
  }

  const zoneMultiplier = 1 + (zone - 1) * 0.15;

  return {
    enemyHp: Math.floor(worldBaseHp * zoneMultiplier),
    enemyAttack: Math.floor(worldBaseDmg * zoneMultiplier),
    xpReward: Math.floor(worldBaseXp * zoneMultiplier),
  };
};
