export interface GeneratedEnemyStats {
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
}

/**
 * WORLD BOSS CONFIGURATION (Manual Balancing)
 * Boss stats are entirely hardcoded here to allow for precise difficulty spikes
 * without disrupting the mathematical flow of standard enemies.
 */
const BOSS_STATS: Record<number, GeneratedEnemyStats> = {
  1: { enemyHp: 400, enemyAttack: 18, xpReward: 250 },
  2: { enemyHp: 900, enemyAttack: 75, xpReward: 1000 },
  3: { enemyHp: 1500, enemyAttack: 230, xpReward: 3500 },
  4: { enemyHp: 3000, enemyAttack: 700, xpReward: 10000 },
  5: { enemyHp: 6350, enemyAttack: 2500, xpReward: 26000 },
  6: { enemyHp: 14000, enemyAttack: 10000, xpReward: 70000 },
  7: { enemyHp: 45000, enemyAttack: 58000, xpReward: 180000 },
  8: { enemyHp: 100000, enemyAttack: 275000, xpReward: 450000 },
};

/**
 * calculateEnemyStats
 * Generates health, damage, and XP values for a given combat zone.
 * Standard enemies (Zones 1-9) scale exponentially.
 * Zone 10 triggers the hardcoded World Boss stats.
 */
export const calculateEnemyStats = (
  world: number,
  zone: number,
): GeneratedEnemyStats => {
  const isBoss = zone === 10;

  if (isBoss) {
    // Fallback block for future expansions beyond the currently mapped worlds
    return (
      BOSS_STATS[world] || {
        enemyHp: 200000,
        enemyAttack: 300000,
        xpReward: 1000000,
      }
    );
  }

  // --- STANDARD ENEMY SCALING (Zones 1-9) ---
  const HP_BASE = 100;
  const DMG_BASE = 10;
  const XP_BASE = 15;

  // HP scales moderately (2.2x per world)
  const worldBaseHp = HP_BASE * Math.pow(2.2, world - 1);

  // Damage scales aggressively (3.4x per world) to counter exponential player armor scaling
  const worldBaseDmg = DMG_BASE * Math.pow(3.4, world - 1);

  const worldBaseXp = XP_BASE * Math.pow(2.2, world - 1);

  // Zones 1-9 increase difficulty by a flat 8% per zone within the current world
  const zoneMultiplier = 1 + (zone - 1) * 0.08;

  return {
    enemyHp: Math.floor(worldBaseHp * zoneMultiplier),
    enemyAttack: Math.floor(worldBaseDmg * zoneMultiplier),
    xpReward: Math.floor(worldBaseXp * zoneMultiplier),
  };
};
