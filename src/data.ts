import type { Resource, ShopItem, Achievement, CombatMap, WeightedDrop } from './types';
// --- WORLD LOOT TABLES (Weighted System) ---
// Avain on world ID. Arvot ovat WeightedDrop[].
// Esimerkki: Jos kokonaispaino on 2000:
// - Weight 1000 = 50% mahdollisuus (jos table aktivoituu)
// - Weight 10 = 0.5% mahdollisuus
export const WORLD_LOOT: Record<number, WeightedDrop[]> = {
  1: [ // Greenvale
    { itemId: 'greenvale_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'bosskey_w1', weight: 10, amount: [1, 1] }
  ],
  2: [ // Stonefall
    { itemId: 'stonefall_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'stonefall_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w2', weight: 10, amount: [1, 1] }
  ],
  3: [ // Ashridge
    { itemId: 'ashridge_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'ashridge_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w3', weight: 10, amount: [1, 1] }
  ],
  4: [ // Frostreach
    { itemId: 'frostreach_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'frostreach_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w4', weight: 10, amount: [1, 1] }
  ],
  5: [ // Duskwood
    { itemId: 'duskwood_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'duskwood_rare', weight: 300, amount: [1, 1] },
    { itemId: 'bosskey_w5', weight: 10, amount: [1, 1] }
  ],
  6: [ // Stormcoast
    { itemId: 'stormcoast_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'stormcoast_rare', weight: 300, amount: [1, 1] },
    { itemId: 'stormcoast_exotic', weight: 50, amount: [1, 1] },
    { itemId: 'bosskey_w6', weight: 10, amount: [1, 1] }
  ],
  7: [ // Void Expanse
    { itemId: 'voidexpanse_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'voidexpanse_rare', weight: 300, amount: [1, 1] },
    { itemId: 'voidexpanse_exotic', weight: 50, amount: [1, 1] },
    { itemId: 'bosskey_w7', weight: 10, amount: [1, 1] }
  ],
  8: [ // Eternal Nexus
    { itemId: 'eternalnexus_basic', weight: 1500, amount: [1, 3] },
    { itemId: 'eternalnexus_rare', weight: 300, amount: [1, 1] },
    { itemId: 'eternalnexus_exotic', weight: 50, amount: [1, 1] },
    { itemId: 'bosskey_w8', weight: 10, amount: [1, 1] }
  ]
};
// --- COMBAT DATA ---
export const COMBAT_DATA: CombatMap[] = [
  // --- WORLD 1: GREENVALE (1–10) ---
  { id: 1, world: 1, name: "Greenvale Plains", enemyName: "Harmless Slime", enemyHp: 25, enemyAttack: 3, xpReward: 10, image: '/assets/enemies/world1_greenvale/enemy_slime_harmless.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [3, 6] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 2, world: 1, name: "Tall Grass", enemyName: "Blue Slime", enemyHp: 40, enemyAttack: 5, xpReward: 15, image: '/assets/enemies/world1_greenvale/enemy_slime_blue.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [6, 12] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 3, world: 1, name: "Forest Edge", enemyName: "Cube Slime", enemyHp: 55, enemyAttack: 7, xpReward: 20, image: '/assets/enemies/world1_greenvale/enemy_slime_cube.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [10, 18] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 4, world: 1, name: "Woodland Path", enemyName: "Deadly Flower", enemyHp: 70, enemyAttack: 9, xpReward: 30, image: '/assets/enemies/world1_greenvale/enemy_flower_deadly.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [15, 25] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 5, world: 1, name: "Thorn Grove", enemyName: "Thorn Crawler", enemyHp: 90, enemyAttack: 12, xpReward: 40, image: '/assets/enemies/world1_greenvale/enemy_crawler_thorn.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [20, 35] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 6, world: 1, name: "Mossy Clearing", enemyName: "Moss Beetle", enemyHp: 110, enemyAttack: 14, xpReward: 50, image: '/assets/enemies/world1_greenvale/enemy_beetle_moss.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [25, 45] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 7, world: 1, name: "Serpent Hollow", enemyName: "Grove Serpent", enemyHp: 135, enemyAttack: 17, xpReward: 65, image: '/assets/enemies/world1_greenvale/enemy_serpent_grove.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [30, 55] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 8, world: 1, name: "Bandit Trail", enemyName: "Melee Bandit", enemyHp: 160, enemyAttack: 20, xpReward: 80, image: '/assets/enemies/world1_greenvale/enemy_bandit_melee.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [40, 70] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 9, world: 1, name: "Deep Woods", enemyName: "Woodland Stalker", enemyHp: 190, enemyAttack: 24, xpReward: 100, image: '/assets/enemies/world1_greenvale/enemy_stalker_woodland.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [60, 90] }, { itemId: 'bosskey_w1', chance: 0.01, amount: [1, 1] }] },
  { id: 10, world: 1, name: "Ancient Grove (BOSS)", enemyName: "Oakroot Guardian", enemyHp: 500, enemyAttack: 40, xpReward: 500, isBoss: true, keyRequired: 'bosskey_w1', image: '/assets/enemies/world1_greenvale/enemy_boss_guardian_oakroot.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [500, 800] }, { itemId: 'item_ice_heart', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 2: STONEFALL (11–20) ---
  { id: 11, world: 2, name: "Rocky Pass", enemyName: "Cave Bat", enemyHp: 220, enemyAttack: 26, xpReward: 120, image: '/assets/enemies/world2_stonefall/enemy_bat_cave.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [70, 110] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 12, world: 2, name: "Stone Tunnels", enemyName: "Rock Crab", enemyHp: 260, enemyAttack: 30, xpReward: 140, image: '/assets/enemies/world2_stonefall/enemy_crab_rock.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [80, 130] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 13, world: 2, name: "Collapsed Mine", enemyName: "Tunnel Rat", enemyHp: 300, enemyAttack: 34, xpReward: 170, image: '/assets/enemies/world2_stonefall/enemy_rat_tunnel.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [90, 150] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 14, world: 2, name: "Stoneworks", enemyName: "Stone Golem", enemyHp: 360, enemyAttack: 40, xpReward: 200, image: '/assets/enemies/world2_stonefall/enemy_golem_stone.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [120, 180] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 15, world: 2, name: "Crystal Vein", enemyName: "Ironback Beetle", enemyHp: 420, enemyAttack: 46, xpReward: 240, image: '/assets/enemies/world2_stonefall/enemy_beetle_ironback.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [150, 220] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 16, world: 2, name: "Mine Depths", enemyName: "Mine Crawler", enemyHp: 480, enemyAttack: 52, xpReward: 280, image: '/assets/enemies/world2_stonefall/enemy_crawler_mine.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [180, 260] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 17, world: 2, name: "Gravel Fields", enemyName: "Gravel Hound", enemyHp: 550, enemyAttack: 60, xpReward: 330, image: '/assets/enemies/world2_stonefall/enemy_wolf_gravel.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [220, 320] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 18, world: 2, name: "Crystal Cavern", enemyName: "Crystal Lurker", enemyHp: 620, enemyAttack: 68, xpReward: 380, image: '/assets/enemies/world2_stonefall/enemy_stalker_crystal.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [260, 380] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 19, world: 2, name: "Abandoned Shaft", enemyName: "Rogue Miner", enemyHp: 700, enemyAttack: 75, xpReward: 450, image: '/assets/enemies/world2_stonefall/enemy_bandit_miner.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [300, 450] }, { itemId: 'bosskey_w2', chance: 0.01, amount: [1, 1] }] },
  { id: 20, world: 2, name: "Stonefall Core (BOSS)", enemyName: "The Stone Colossus", enemyHp: 1500, enemyAttack: 120, xpReward: 1500, isBoss: true, keyRequired: 'bosskey_w2', image: '/assets/enemies/world2_stonefall/enemy_boss_drake_stone.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1200, 1800] }, { itemId: 'item_golden_ankh', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 3: ASHRIDGE (21–30) ---
  { id: 21, world: 3, name: "Ash Plains", enemyName: "Ash Imp", enemyHp: 780, enemyAttack: 85, xpReward: 520, image: '/assets/enemies/world3_ashridge/enemy_imp_ash.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [350, 520] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 22, world: 3, name: "Cinder Path", enemyName: "Scorchling Slime", enemyHp: 860, enemyAttack: 95, xpReward: 600, image: '/assets/enemies/world3_ashridge/enemy_slime_scorchling.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [400, 600] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 23, world: 3, name: "Burned Ridge", enemyName: "Ember Wolf", enemyHp: 950, enemyAttack: 105, xpReward: 700, image: '/assets/enemies/world3_ashridge/enemy_wolf_ember.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [480, 700] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 24, world: 3, name: "Lava Fields", enemyName: "Lava Beetle", enemyHp: 1050, enemyAttack: 120, xpReward: 820, image: '/assets/enemies/world3_ashridge/enemy_beetle_lava.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [560, 820] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 25, world: 3, name: "Molten Gorge", enemyName: "Cinder Serpent", enemyHp: 1180, enemyAttack: 135, xpReward: 960, image: '/assets/enemies/world3_ashridge/enemy_serpent_cinder.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [650, 960] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 26, world: 3, name: "Ash Crypt", enemyName: "Firebound Skeleton", enemyHp: 1320, enemyAttack: 150, xpReward: 1120, image: '/assets/enemies/world3_ashridge/enemy_bandit_firebound.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [750, 1120] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 27, world: 3, name: "Smolder Pits", enemyName: "Magma Slime", enemyHp: 1500, enemyAttack: 170, xpReward: 1300, image: '/assets/enemies/world3_ashridge/enemy_slime_magma.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [880, 1300] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 28, world: 3, name: "Lava Rise", enemyName: "Smoldering Stalker", enemyHp: 1700, enemyAttack: 190, xpReward: 1500, image: '/assets/enemies/world3_ashridge/enemy_stalker_smoldering.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1000, 1500] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 29, world: 3, name: "Cult Grounds", enemyName: "Flame Cultist", enemyHp: 1950, enemyAttack: 215, xpReward: 1800, image: '/assets/enemies/world3_ashridge/enemy_bandit_cultist.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1200, 1800] }, { itemId: 'bosskey_w3', chance: 0.01, amount: [1, 1] }] },
  { id: 30, world: 3, name: "Ashridge Core (BOSS)", enemyName: "Inferno Warden", enemyHp: 4000, enemyAttack: 350, xpReward: 4000, isBoss: true, keyRequired: 'bosskey_w3', image: '/assets/enemies/world3_ashridge/enemy_boss_warden_inferno.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [3000, 5000] }, { itemId: 'item_hydra_scale', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 4: FROSTREACH (31–40) ---
  { id: 31, world: 4, name: "Frozen Flats", enemyName: "Frost Rat", enemyHp: 2200, enemyAttack: 240, xpReward: 2100, image: '/assets/enemies/world4_frostreach/enemy_imp_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1400, 2100] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 32, world: 4, name: "Ice Caves", enemyName: "Ice Spider", enemyHp: 2450, enemyAttack: 270, xpReward: 2400, image: '/assets/enemies/world4_frostreach/enemy_spider_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1600, 2400] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 33, world: 4, name: "Snow Fields", enemyName: "Snow Wolf", enemyHp: 2750, enemyAttack: 300, xpReward: 2800, image: '/assets/enemies/world4_frostreach/enemy_wolf_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1900, 2800] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 34, world: 4, name: "Frozen Battlefield", enemyName: "Frozen Soldier", enemyHp: 3100, enemyAttack: 340, xpReward: 3300, image: '/assets/enemies/world4_frostreach/enemy_bandit_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [2200, 3300] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 35, world: 4, name: "Glacier Pass", enemyName: "Glacier Beetle", enemyHp: 3500, enemyAttack: 380, xpReward: 3900, image: '/assets/enemies/world4_frostreach/enemy_beetle_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [2600, 3900] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 36, world: 4, name: "Icebound Ruins", enemyName: "Frost Imp", enemyHp: 3950, enemyAttack: 420, xpReward: 4600, image: '/assets/enemies/world4_frostreach/enemy_imp_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [3000, 4600] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 37, world: 4, name: "Frozen Depths", enemyName: "Icebound Golem", enemyHp: 4500, enemyAttack: 470, xpReward: 5400, image: '/assets/enemies/world4_frostreach/enemy_golem_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [3600, 5400] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 38, world: 4, name: "Blizzard Ridge", enemyName: "Blizzard Stalker", enemyHp: 5100, enemyAttack: 520, xpReward: 6300, image: '/assets/enemies/world4_frostreach/enemy_stalker_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [4200, 6300] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 39, world: 4, name: "Tundra Arena", enemyName: "Tundra Brute", enemyHp: 5800, enemyAttack: 580, xpReward: 7400, image: '/assets/enemies/world4_frostreach/enemy_brute_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [5000, 7400] }, { itemId: 'bosskey_w4', chance: 0.01, amount: [1, 1] }] },
  { id: 40, world: 4, name: "Frozen Throne (BOSS)", enemyName: "The Icebound Sorcerer", enemyHp: 12000, enemyAttack: 950, xpReward: 12000, isBoss: true, keyRequired: 'bosskey_w4', image: '/assets/enemies/world4_frostreach/enemy_boss_mage_frost.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [9000, 14000] }, { itemId: 'item_crown_of_winter', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 5: DUSKWOOD (41–50) ---
  { id: 41, world: 5, name: "Twilight Edge", enemyName: "Shadow Rat", enemyHp: 6500, enemyAttack: 640, xpReward: 8500, image: '/assets/enemies/world5_duskwood/enemy_rat_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [6000, 8500] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 42, world: 5, name: "Rot Grove", enemyName: "Night Stalker", enemyHp: 7400, enemyAttack: 710, xpReward: 9800, image: '/assets/enemies/world5_duskwood/enemy_stalker_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [7000, 9800] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 43, world: 5, name: "Blight Nest", enemyName: "Blight Shroom", enemyHp: 8500, enemyAttack: 790, xpReward: 11500, image: '/assets/enemies/world5_duskwood/enemy_flower_shroom.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [8500, 11500] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 44, world: 5, name: "Cursed Clearing", enemyName: "Cursed Tree", enemyHp: 9800, enemyAttack: 880, xpReward: 13500, image: '/assets/enemies/world5_duskwood/enemy_flower_tree.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [10000, 13500] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 45, world: 5, name: "Night Paths", enemyName: "Withered Treant", enemyHp: 11300, enemyAttack: 980, xpReward: 16000, image: '/assets/enemies/world5_duskwood/enemy_beetle_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [12000, 16000] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 46, world: 5, name: "Gravewood", enemyName: "Grave Hound", enemyHp: 13000, enemyAttack: 1080, xpReward: 19000, image: '/assets/enemies/world5_duskwood/enemy_wolf_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [14500, 19000] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 47, world: 5, name: "Withered Hollow", enemyName: "Rotting Wolf", enemyHp: 15000, enemyAttack: 1200, xpReward: 22500, image: '/assets/enemies/world5_duskwood/enemy_wolf_rotting.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [17500, 22500] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 48, world: 5, name: "Dark Shrine", enemyName: "Dark Ritualist", enemyHp: 17300, enemyAttack: 1350, xpReward: 26500, image: '/assets/enemies/world5_duskwood/enemy_bandit_ritualist_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [21000, 26500] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 49, world: 5, name: "Shadow Vale", enemyName: "Shade Horror", enemyHp: 20000, enemyAttack: 1550, xpReward: 31000, image: '/assets/enemies/world5_duskwood/enemy_brute_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [25000, 31000] }, { itemId: 'bosskey_w5', chance: 0.01, amount: [1, 1] }] },
  { id: 50, world: 5, name: "Dreadwood Heart (BOSS)", enemyName: "The Dreadwood King", enemyHp: 42000, enemyAttack: 2600, xpReward: 60000, isBoss: true, keyRequired: 'bosskey_w5', image: '/assets/enemies/world5_duskwood/enemy_boss_king_shadow.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [45000, 70000] }, { itemId: 'item_fire_essence', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 6: STORMCOAST (51–60) ---
  { id: 51, world: 6, name: "Shoreline", enemyName: "Tide Crawler", enemyHp: 24000, enemyAttack: 1750, xpReward: 35000, image: '/assets/enemies/world6_stormcoast/enemy_crab_lightning.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [28000, 35000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 52, world: 6, name: "Reef Break", enemyName: "Reef Shark", enemyHp: 28000, enemyAttack: 1950, xpReward: 41000, image: '/assets/enemies/world6_stormcoast/enemy_shark_reef.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [33000, 41000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 53, world: 6, name: "Cliff Winds", enemyName: "Storm Gull", enemyHp: 32000, enemyAttack: 2150, xpReward: 48000, image: '/assets/enemies/world6_stormcoast/enemy_imp_lightning.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [38000, 48000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 54, world: 6, name: "Deep Waters", enemyName: "Sea Serpent", enemyHp: 37000, enemyAttack: 2400, xpReward: 56000, image: '/assets/enemies/world6_stormcoast/enemy_serpent_sea.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [45000, 56000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 55, world: 6, name: "Brine Flats", enemyName: "Brine Brute", enemyHp: 43000, enemyAttack: 2700, xpReward: 66000, image: '/assets/enemies/world6_stormcoast/enemy_brute_lightning.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [52000, 66000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 56, world: 6, name: "Storm Surge", enemyName: "Thunder Eel", enemyHp: 50000, enemyAttack: 3050, xpReward: 78000, image: '/assets/enemies/world6_stormcoast/enemy_slime_lightning.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [62000, 78000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 57, world: 6, name: "Coral Reach", enemyName: "Coral Golem", enemyHp: 58000, enemyAttack: 3450, xpReward: 92000, image: '/assets/enemies/world6_stormcoast/enemy_golem_sea.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [75000, 92000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 58, world: 6, name: "Raider Coast", enemyName: "Deepwater Sorcerer", enemyHp: 67000, enemyAttack: 3900, xpReward: 110000, image: '/assets/enemies/world6_stormcoast/enemy_mage_water.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [90000, 110000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 59, world: 6, name: "Tempest Skies", enemyName: "Tempest Drake", enemyHp: 78000, enemyAttack: 4400, xpReward: 130000, image: '/assets/enemies/world6_stormcoast/enemy_drage_lightning_poison.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [105000, 130000] }, { itemId: 'bosskey_w6', chance: 0.01, amount: [1, 1] }] },
  { id: 60, world: 6, name: "Maelstrom Eye (BOSS)", enemyName: "Ruler of the Sea", enemyHp: 160000, enemyAttack: 7200, xpReward: 250000, isBoss: true, keyRequired: 'bosskey_w6', image: '/assets/enemies/world6_stormcoast/enemy_boss_serpent.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [200000, 300000] }, { itemId: 'item_spellbook_of_eternity', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 7: VOID EXPANSE (61–70) ---
  { id: 61, world: 7, name: "Rift Edge", enemyName: "Voidling", enemyHp: 95000, enemyAttack: 5200, xpReward: 150000, image: '/assets/enemies/world7_voidexpanse/enemy_slime_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [120000, 150000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 62, world: 7, name: "Abyss Pools", enemyName: "Void Imp", enemyHp: 110000, enemyAttack: 5800, xpReward: 180000, image: '/assets/enemies/world7_voidexpanse/enemy_imp_void_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [145000, 180000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 63, world: 7, name: "Shadow Flats", enemyName: "Void Eel", enemyHp: 130000, enemyAttack: 6500, xpReward: 215000, image: '/assets/enemies/world7_voidexpanse/enemy_serpent_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [175000, 215000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 64, world: 7, name: "Void March", enemyName: "Abyss Walker", enemyHp: 155000, enemyAttack: 7300, xpReward: 255000, image: '/assets/enemies/world7_voidexpanse/enemy_brute_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [210000, 255000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 65, world: 7, name: "Null Zone", enemyName: "Null Beast", enemyHp: 185000, enemyAttack: 8200, xpReward: 300000, image: '/assets/enemies/world7_voidexpanse/enemy_golem_void_poison.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [250000, 300000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 66, world: 7, name: "Rift Paths", enemyName: "Void Stalker", enemyHp: 220000, enemyAttack: 9200, xpReward: 355000, image: '/assets/enemies/world7_voidexpanse/enemy_stalker_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [295000, 355000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 67, world: 7, name: "Entropy Fields", enemyName: "Entropy Wraith", enemyHp: 265000, enemyAttack: 10500, xpReward: 420000, image: '/assets/enemies/world7_voidexpanse/enemy_mage_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [350000, 420000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 68, world: 7, name: "Rift Citadel", enemyName: "Riftbound Knight", enemyHp: 320000, enemyAttack: 12000, xpReward: 500000, image: '/assets/enemies/world7_voidexpanse/enemy_knight_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [420000, 500000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 69, world: 7, name: "Starless Depths", enemyName: "Starless Succubus", enemyHp: 390000, enemyAttack: 14000, xpReward: 600000, image: '/assets/enemies/world7_voidexpanse/enemy_bandit_succubus.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [500000, 600000] }, { itemId: 'bosskey_w7', chance: 0.01, amount: [1, 1] }] },
  { id: 70, world: 7, name: "Void Core (BOSS)", enemyName: "The Void Architect", enemyHp: 800000, enemyAttack: 24000, xpReward: 1200000, isBoss: true, keyRequired: 'bosskey_w7', image: '/assets/enemies/world7_voidexpanse/enemy_boss_void.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [900000, 1400000] }, { itemId: 'item_scythe_fragment', chance: 1.0, amount: [1, 1] }] },

  // --- WORLD 8: ETERNAL NEXUS (71–80) ---
  { id: 71, world: 8, name: "Timeless Gate", enemyName: "Timeless Construct", enemyHp: 480000, enemyAttack: 16500, xpReward: 700000, image: '/assets/enemies/world8_eternalnexus/enemy_imp_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [600000, 700000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 72, world: 8, name: "Aether Halls", enemyName: "Aether Sentinel", enemyHp: 580000, enemyAttack: 19000, xpReward: 850000, image: '/assets/enemies/world8_eternalnexus/enemy_slime_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [750000, 850000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 73, world: 8, name: "Chrono Rift", enemyName: "Chrono Wisp", enemyHp: 700000, enemyAttack: 22000, xpReward: 1050000, image: '/assets/enemies/world8_eternalnexus/enemy_wolf_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [900000, 1050000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 74, world: 8, name: "Reality Span", enemyName: "Reality Shaper", enemyHp: 850000, enemyAttack: 26000, xpReward: 1300000, image: '/assets/enemies/world8_eternalnexus/enemy_bandit_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1100000, 1300000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 75, world: 8, name: "Astral Ring", enemyName: "Astral Knight", enemyHp: 1050000, enemyAttack: 30500, xpReward: 1600000, image: '/assets/enemies/world8_eternalnexus/enemy_knight_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1350000, 1600000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 76, world: 8, name: "Phase Reach", enemyName: "Phase Serpent", enemyHp: 1300000, enemyAttack: 36000, xpReward: 2000000, image: '/assets/enemies/world8_eternalnexus/enemy_serpent_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [1700000, 2000000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 77, world: 8, name: "Paradox Loop", enemyName: "Paradox Beast", enemyHp: 1650000, enemyAttack: 43000, xpReward: 2500000, image: '/assets/enemies/world8_eternalnexus/enemy_brute_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [2100000, 2500000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 78, world: 8, name: "Nexus Watch", enemyName: "Nexus Guardian", enemyHp: 2100000, enemyAttack: 52000, xpReward: 3100000, image: '/assets/enemies/world8_eternalnexus/enemy_golem_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [2600000, 3100000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 79, world: 8, name: "Creation Echo", enemyName: "Echo of Creation", enemyHp: 2700000, enemyAttack: 63000, xpReward: 3900000, image: '/assets/enemies/world8_eternalnexus/enemy_mage_fire.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [3300000, 3900000] }, { itemId: 'bosskey_w8', chance: 0.01, amount: [1, 1] }] },
  { id: 80, world: 8, name: "Eternal Core (BOSS)", enemyName: "Nexus Lord", enemyHp: 6000000, enemyAttack: 120000, xpReward: 10000000, isBoss: true, keyRequired: 'bosskey_w8', image: '/assets/enemies/world8_eternalnexus/enemy_boss_final_nexus_lord.png', drops: [{ itemId: 'coins', chance: 1.0, amount: [8000000, 12000000] }, { itemId: 'item_void_essence', chance: 1.0, amount: [1, 1] }] },
];

// --- GAME DATA ---
export const GAME_DATA: Record<string, Resource[]> = {
  // --- WOODCUTTING ---
  woodcutting: [
    { 
      id: 'pine_log', name: 'Pine Tree', levelRequired: 1, xpReward: 10, interval: 3000, value: 1, 
      icon: '/assets/resources/tree/pine_log.png', 
      actionImage: '/assets/resources/tree/pine_tree.png', 
      color: 'text-emerald-600', description: 'Common pine wood.', requiresMapCompletion: undefined 
    },
    { 
      id: 'oak_log', name: 'Oak Tree', levelRequired: 15, xpReward: 25, interval: 4500, value: 5, 
      icon: '/assets/resources/tree/oak_log.png', 
      actionImage: '/assets/resources/tree/oak_tree.png', 
      color: 'text-amber-700', description: 'Sturdy oak wood.', requiresMapCompletion: 2 
    },
    { 
      id: 'willow_log', name: 'Willow Tree', levelRequired: 30, xpReward: 45, interval: 6000, value: 10, 
      icon: '/assets/resources/tree/willow_log.png', 
      actionImage: '/assets/resources/tree/willow_tree.png', 
      color: 'text-emerald-800', description: 'Flexible willow wood.', requiresMapCompletion: 4 
    },
    { 
      id: 'yew_log', name: 'Yew Tree', levelRequired: 45, xpReward: 70, interval: 7500, value: 25, 
      icon: '/assets/resources/tree/yew_log.png', 
      actionImage: '/assets/resources/tree/yew_tree.png', 
      color: 'text-lime-900', description: 'Strong and dark wood.', requiresMapCompletion: 6 
    },
    { 
      id: 'sunwood_log', name: 'Sunwood Tree', levelRequired: 60, xpReward: 100, interval: 9000, value: 60, 
      icon: '/assets/resources/tree/sunwood_log.png', 
      actionImage: '/assets/resources/tree/sunwood_tree.png', 
      color: 'text-orange-500', description: 'Radiates a warm glow.', requiresMapCompletion: 7 
    },
    { 
      id: 'frostbark_log', name: 'Frostbark Tree', levelRequired: 75, xpReward: 150, interval: 11000, value: 120, 
      icon: '/assets/resources/tree/frostbark_log.png', 
      actionImage: '/assets/resources/tree/frostbark_tree.png', 
      color: 'text-cyan-300', description: 'Cold to the touch.', requiresMapCompletion: 8 
    },
    { 
      id: 'heartwood_log', name: 'Heartwood Tree', levelRequired: 85, xpReward: 220, interval: 13000, value: 250, 
      icon: '/assets/resources/tree/heartwood_log.png', 
      actionImage: '/assets/resources/tree/heartwood_tree.png', 
      color: 'text-purple-500', description: 'Pulsating with energy.', requiresMapCompletion: 9 
    },
    { 
      id: 'bloodwood_log', name: 'Bloodwood Tree', levelRequired: 99, xpReward: 350, interval: 16000, value: 500, 
      icon: '/assets/resources/tree/bloodwood_log.png', 
      actionImage: '/assets/resources/tree/bloodwood_tree.png', 
      color: 'text-red-700', description: 'Crimson red ancient wood.', requiresMapCompletion: 10 
    },
  ],
  
  // --- MINING ---
  mining: [
    { id: 'ore_copper', name: 'Copper Ore', levelRequired: 1, xpReward: 10, interval: 3000, value: 2, icon: '/assets/resources/ore/ore_copper.png', color: 'text-orange-500', description: 'Basic conductive metal.' },
    { id: 'ore_iron', name: 'Iron Ore', levelRequired: 10, xpReward: 20, interval: 4500, value: 5, icon: '/assets/resources/ore/ore_iron.png', color: 'text-slate-400', description: 'Strong structural metal.', requiresMapCompletion: 3 },
    { id: 'ore_gold', name: 'Gold Ore', levelRequired: 25, xpReward: 35, interval: 6000, value: 15, icon: '/assets/resources/ore/ore_gold.png', color: 'text-yellow-400', description: 'Highly conductive and valuable.', requiresMapCompletion: 5 },
    { id: 'ore_mithril', name: 'Mithril Ore', levelRequired: 40, xpReward: 55, interval: 8000, value: 30, icon: '/assets/resources/ore/ore_mithril.png', color: 'text-cyan-400', description: 'Lightweight and durable.', requiresMapCompletion: 7 },
    { id: 'ore_adamantite', name: 'Adamantite Ore', levelRequired: 55, xpReward: 80, interval: 10000, value: 60, icon: '/assets/resources/ore/ore_adamantite.png', color: 'text-purple-400', description: 'Extremely hard alloy source.', requiresMapCompletion: 8 },
    { id: 'ore_emerald', name: 'Emerald Ore', levelRequired: 70, xpReward: 110, interval: 12000, value: 100, icon: '/assets/resources/ore/ore_emerald.png', color: 'text-emerald-400', description: 'Crystalline metal structure.', requiresMapCompletion: 9 },
    { id: 'ore_eternium', name: 'Eternium Ore', levelRequired: 85, xpReward: 150, interval: 15000, value: 200, icon: '/assets/resources/ore/ore_eternium.png', color: 'text-red-500', description: 'Resonates with time.', requiresMapCompletion: 10 },
    { id: 'ore_starfallalloy', name: 'Starfall Ore', levelRequired: 99, xpReward: 250, interval: 20000, value: 500, icon: '/assets/resources/ore/ore_starfallalloy.png', color: 'text-indigo-400', description: 'Material from the cosmos.' }
  ],

  // --- SMITHING (FOUNDRY PROTOCOL) ---
  smithing: [
    // INGOTS
    { id: 'ore_copper_smelted', name: 'Copper Ingot', levelRequired: 1, xpReward: 5, interval: 2000, value: 5, icon: '/assets/resources/ore/ore_copper_smelted.png', color: 'text-orange-500', description: 'Smelted copper ingot.', inputs: [{ id: 'ore_copper', count: 1 }] },
    { id: 'ore_iron_smelted', name: 'Iron Ingot', levelRequired: 10, xpReward: 10, interval: 3000, value: 15, icon: '/assets/resources/ore/ore_iron_smelted.png', color: 'text-slate-400', description: 'Smelted iron ingot.', inputs: [{ id: 'ore_iron', count: 1 }] },
    { id: 'ore_gold_smelted', name: 'Gold Ingot', levelRequired: 25, xpReward: 20, interval: 4000, value: 45, icon: '/assets/resources/ore/ore_gold_smelted.png', color: 'text-yellow-400', description: 'Refined gold ingot.', inputs: [{ id: 'ore_gold', count: 1 }] },
    { id: 'ore_mithril_smelted', name: 'Mithril Ingot', levelRequired: 40, xpReward: 35, interval: 5000, value: 90, icon: '/assets/resources/ore/ore_mithril_smelted.png', color: 'text-cyan-400', description: 'Refined mithril alloy.', inputs: [{ id: 'ore_mithril', count: 1 }] },
    { id: 'ore_adamantite_smelted', name: 'Adamantite Ingot', levelRequired: 55, xpReward: 50, interval: 6000, value: 180, icon: '/assets/resources/ore/ore_adamantite_smelted.png', color: 'text-purple-400', description: 'Hardened adamantite ingot.', inputs: [{ id: 'ore_adamantite', count: 1 }] },
    { id: 'ore_emerald_smelted', name: 'Emerald Refined', levelRequired: 70, xpReward: 70, interval: 7000, value: 300, icon: '/assets/resources/ore/ore_emerald_smelted.png', color: 'text-emerald-400', description: 'Pure energy crystal.', inputs: [{ id: 'ore_emerald', count: 1 }] },
    { id: 'ore_eternium_smelted', name: 'Eternium Ingot', levelRequired: 85, xpReward: 100, interval: 8000, value: 600, icon: '/assets/resources/ore/ore_eternium_smelted.png', color: 'text-red-500', description: 'Temporal alloy ingot.', inputs: [{ id: 'ore_eternium', count: 1 }] },
    { id: 'ore_starfallalloy_smelted', name: 'Starfall Ingot', levelRequired: 99, xpReward: 150, interval: 10000, value: 1500, icon: '/assets/resources/ore/ore_starfallalloy_smelted.png', color: 'text-indigo-400', description: 'Cosmic alloy ingot.', inputs: [{ id: 'ore_starfallalloy', count: 1 }] },

    // ARMOR: BRONZE
    { id: 'armor_bronze_helm', name: 'Bronze Helm', levelRequired: 1, xpReward: 20, interval: 3000, value: 10, icon: '/assets/items/armor/armor_head_bronze.png', color: 'text-orange-700', description: 'Basic protection.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'head', stats: { defense: 2 }, category: 'armor' },
    { id: 'armor_bronze_body', name: 'Bronze Chestplate', levelRequired: 1, xpReward: 40, interval: 4000, value: 25, icon: '/assets/items/armor/armor_chest_bronze.png', color: 'text-orange-700', description: 'Covers the chest.', inputs: [{ id: 'ore_copper_smelted', count: 4 }], slot: 'body', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_bronze_legs', name: 'Bronze Greaves', levelRequired: 1, xpReward: 30, interval: 3500, value: 20, icon: '/assets/items/armor/armor_legs_bronze.png', color: 'text-orange-700', description: 'Protects legs.', inputs: [{ id: 'ore_copper_smelted', count: 3 }], slot: 'legs', stats: { defense: 4 }, category: 'armor' },

    // ARMOR: IRON
    { id: 'armor_iron_helm', name: 'Iron Helm', levelRequired: 15, xpReward: 50, interval: 4500, value: 40, icon: '/assets/items/armor/armor_head_iron.png', color: 'text-slate-400', description: 'Sturdy iron helm.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'head', stats: { defense: 5 }, category: 'armor' },
    { id: 'armor_iron_body', name: 'Iron Chestplate', levelRequired: 15, xpReward: 100, interval: 6000, value: 100, icon: '/assets/items/armor/armor_chest_iron.png', color: 'text-slate-400', description: 'Heavy iron armor.', inputs: [{ id: 'ore_iron_smelted', count: 5 }], slot: 'body', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_iron_legs', name: 'Iron Greaves', levelRequired: 15, xpReward: 80, interval: 5000, value: 80, icon: '/assets/items/armor/armor_legs_iron.png', color: 'text-slate-400', description: 'Iron leg guards.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'legs', stats: { defense: 9 }, category: 'armor' },

    // ARMOR: GOLD
    { id: 'armor_gold_helm', name: 'Gold Helm', levelRequired: 25, xpReward: 80, interval: 6000, value: 150, icon: '/assets/items/armor/armor_head_gold.png', color: 'text-yellow-400', description: 'Ornamental but soft.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'head', stats: { defense: 8 }, category: 'armor' },
    { id: 'armor_gold_body', name: 'Gold Chestplate', levelRequired: 25, xpReward: 160, interval: 8000, value: 350, icon: '/assets/items/armor/armor_chest_gold.png', color: 'text-yellow-400', description: 'Status symbol.', inputs: [{ id: 'ore_gold_smelted', count: 5 }], slot: 'body', stats: { defense: 18 }, category: 'armor' },
    { id: 'armor_gold_legs', name: 'Gold Greaves', levelRequired: 25, xpReward: 120, interval: 7000, value: 250, icon: '/assets/items/armor/armor_legs_gold.png', color: 'text-yellow-400', description: 'Shiny leg guards.', inputs: [{ id: 'ore_gold_smelted', count: 3 }], slot: 'legs', stats: { defense: 14 }, category: 'armor' },

    // ARMOR: MITHRIL
    { id: 'armor_mithril_helm', name: 'Mithril Helm', levelRequired: 40, xpReward: 150, interval: 7500, value: 300, icon: '/assets/items/armor/armor_head_mithril.png', color: 'text-cyan-400', description: 'Lightweight protection.', inputs: [{ id: 'ore_mithril_smelted', count: 2 }], slot: 'head', stats: { defense: 12 }, category: 'armor' },
    { id: 'armor_mithril_body', name: 'Mithril Chestplate', levelRequired: 40, xpReward: 300, interval: 10000, value: 750, icon: '/assets/items/armor/armor_chest_mithril.png', color: 'text-cyan-400', description: 'Durable mithril plate.', inputs: [{ id: 'ore_mithril_smelted', count: 5 }], slot: 'body', stats: { defense: 28 }, category: 'armor' },
    { id: 'armor_mithril_legs', name: 'Mithril Greaves', levelRequired: 40, xpReward: 220, interval: 8500, value: 500, icon: '/assets/items/armor/armor_legs_mithril.png', color: 'text-cyan-400', description: 'Mithril leg plates.', inputs: [{ id: 'ore_mithril_smelted', count: 3 }], slot: 'legs', stats: { defense: 22 }, category: 'armor' },

    // ARMOR: ADAMANTITE
    { id: 'armor_adamantite_helm', name: 'Adamantite Helm', levelRequired: 55, xpReward: 250, interval: 9000, value: 600, icon: '/assets/items/armor/armor_head_adamantite.png', color: 'text-purple-400', description: 'Hardened alloy helm.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'head', stats: { defense: 18 }, category: 'armor' },
    { id: 'armor_adamantite_body', name: 'Adamantite Chest', levelRequired: 55, xpReward: 500, interval: 12000, value: 1500, icon: '/assets/items/armor/armor_chest_adamantite.png', color: 'text-purple-400', description: 'Superior protection.', inputs: [{ id: 'ore_adamantite_smelted', count: 5 }], slot: 'body', stats: { defense: 42 }, category: 'armor' },
    { id: 'armor_adamantite_legs', name: 'Adamantite Greaves', levelRequired: 55, xpReward: 375, interval: 10500, value: 1000, icon: '/assets/items/armor/armor_legs_adamantite.png', color: 'text-purple-400', description: 'Heavy leg guards.', inputs: [{ id: 'ore_adamantite_smelted', count: 3 }], slot: 'legs', stats: { defense: 32 }, category: 'armor' },

    // ARMOR: EMERALD
    { id: 'armor_emerald_helm', name: 'Emerald Helm', levelRequired: 70, xpReward: 400, interval: 11000, value: 1200, icon: '/assets/items/armor/armor_head_emerald.png', color: 'text-emerald-400', description: 'Crystalline helm.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'head', stats: { defense: 28 }, category: 'armor' },
    { id: 'armor_emerald_body', name: 'Emerald Chestplate', levelRequired: 70, xpReward: 800, interval: 15000, value: 3000, icon: '/assets/items/armor/armor_chest_emerald.png', color: 'text-emerald-400', description: 'Resonates energy.', inputs: [{ id: 'ore_emerald_smelted', count: 5 }], slot: 'body', stats: { defense: 65 }, category: 'armor' },
    { id: 'armor_emerald_legs', name: 'Emerald Greaves', levelRequired: 70, xpReward: 600, interval: 13000, value: 2000, icon: '/assets/items/armor/armor_legs_emerald.png', color: 'text-emerald-400', description: 'Crystal leg guards.', inputs: [{ id: 'ore_emerald_smelted', count: 3 }], slot: 'legs', stats: { defense: 48 }, category: 'armor' },

    // ARMOR: ETERNIUM
    { id: 'armor_eternium_helm', name: 'Eternium Helm', levelRequired: 85, xpReward: 600, interval: 14000, value: 2500, icon: '/assets/items/armor/armor_head_eternium.png', color: 'text-red-500', description: 'Forged from time.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'head', stats: { defense: 40 }, category: 'armor' },
    { id: 'armor_eternium_body', name: 'Eternium Chestplate', levelRequired: 85, xpReward: 1200, interval: 18000, value: 6000, icon: '/assets/items/armor/armor_chest_eternium.png', color: 'text-red-500', description: 'Temporal defense.', inputs: [{ id: 'ore_eternium_smelted', count: 5 }], slot: 'body', stats: { defense: 95 }, category: 'armor' },
    { id: 'armor_eternium_legs', name: 'Eternium Greaves', levelRequired: 85, xpReward: 900, interval: 16000, value: 4000, icon: '/assets/items/armor/armor_legs_eternium.png', color: 'text-red-500', description: 'Timeless durability.', inputs: [{ id: 'ore_eternium_smelted', count: 3 }], slot: 'legs', stats: { defense: 70 }, category: 'armor' },

    // ARMOR: STARFALL
    { id: 'armor_starfall_helm', name: 'Starfall Helm', levelRequired: 99, xpReward: 1000, interval: 20000, value: 5000, icon: '/assets/items/armor/armor_head_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic power.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'head', stats: { defense: 60 }, category: 'armor' },
    { id: 'armor_starfall_body', name: 'Starfall Chestplate', levelRequired: 99, xpReward: 2000, interval: 25000, value: 12000, icon: '/assets/items/armor/armor_chest_starfallalloy.png', color: 'text-indigo-400', description: 'Starlight forged.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 5 }], slot: 'body', stats: { defense: 140 }, category: 'armor' },
    { id: 'armor_starfall_legs', name: 'Starfall Greaves', levelRequired: 99, xpReward: 1500, interval: 22000, value: 8000, icon: '/assets/items/armor/armor_legs_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic protection.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }], slot: 'legs', stats: { defense: 100 }, category: 'armor' },
  
    // --- RINGS (FOUNDRY JEWELRY) ---
    { id: 'ring_iron', name: 'Iron Ring', levelRequired: 15, xpReward: 35, interval: 4000, value: 50, icon: '/assets/items/ring/ring_iron.png', color: 'text-slate-400', description: 'Simple iron band.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'ring', stats: { attack: 1, defense: 1 }, category: 'rings' },
    { id: 'ring_gold', name: 'Gold Ring', levelRequired: 25, xpReward: 55, interval: 5000, value: 120, icon: '/assets/items/ring/ring_gold.png', color: 'text-yellow-400', description: 'Precious gold band.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'ring', stats: { attack: 3, defense: 3 }, category: 'rings' },
    { id: 'ring_adamantite', name: 'Adamantite Ring', levelRequired: 55, xpReward: 110, interval: 7000, value: 500, icon: '/assets/items/ring/ring_adamantite.png', color: 'text-purple-400', description: 'Hardened alloy ring.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'ring', stats: { attack: 6, defense: 6 }, category: 'rings' },
    { id: 'ring_emerald', name: 'Emerald Ring', levelRequired: 70, xpReward: 160, interval: 9000, value: 1000, icon: '/assets/items/ring/ring_emerald.png', color: 'text-emerald-400', description: 'Infused with energy.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'ring', stats: { attack: 10, defense: 10 }, category: 'rings' },
    { id: 'ring_eternium', name: 'Eternium Ring', levelRequired: 85, xpReward: 230, interval: 12000, value: 2500, icon: '/assets/items/ring/ring_eternium.png', color: 'text-red-500', description: 'Vibrates with power.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'ring', stats: { attack: 15, defense: 15 }, category: 'rings' },
    { id: 'ring_starfallalloy', name: 'Starfall Ring', levelRequired: 99, xpReward: 380, interval: 15000, value: 5000, icon: '/assets/items/ring/ring_starfallalloy.png', color: 'text-indigo-400', description: 'Forged from stars.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'ring', stats: { attack: 20, defense: 20 }, category: 'rings' },
  ],

  // --- CRAFTING (ASSEMBLY PROTOCOL) ---
  crafting: [
    // WOOD REFINING (Planks)
    { id: 'pine_plank', name: 'Pine Plank', levelRequired: 1, xpReward: 5, interval: 1500, value: 2, icon: '/assets/resources/tree/pine_plank.png', color: 'text-amber-200', description: 'Refined pine wood.', inputs: [{ id: 'pine_log', count: 1 }], category: 'wood_refining' },
    { id: 'oak_plank', name: 'Oak Plank', levelRequired: 15, xpReward: 12, interval: 2200, value: 10, icon: '/assets/resources/tree/oak_plank.png', color: 'text-amber-600', description: 'Refined oak wood.', inputs: [{ id: 'oak_log', count: 1 }], category: 'wood_refining' },
    { id: 'willow_plank', name: 'Willow Plank', levelRequired: 30, xpReward: 22, interval: 3000, value: 20, icon: '/assets/resources/tree/willow_plank.png', color: 'text-emerald-700', description: 'Refined willow wood.', inputs: [{ id: 'willow_log', count: 1 }], category: 'wood_refining' },
    { id: 'yew_plank', name: 'Yew Plank', levelRequired: 45, xpReward: 35, interval: 4000, value: 50, icon: '/assets/resources/tree/yew_plank.png', color: 'text-lime-800', description: 'Refined yew wood.', inputs: [{ id: 'yew_log', count: 1 }], category: 'wood_refining' },
    { id: 'sunwood_plank', name: 'Sunwood Plank', levelRequired: 60, xpReward: 50, interval: 5000, value: 120, icon: '/assets/resources/tree/sunwood_plank.png', color: 'text-orange-400', description: 'Refined sunwood.', inputs: [{ id: 'sunwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'frostbark_plank', name: 'Frostbark Plank', levelRequired: 75, xpReward: 75, interval: 6500, value: 240, icon: '/assets/resources/tree/frostbark_plank.png', color: 'text-cyan-200', description: 'Refined frostbark.', inputs: [{ id: 'frostbark_log', count: 1 }], category: 'wood_refining' },
    { id: 'heartwood_plank', name: 'Heartwood Plank', levelRequired: 85, xpReward: 110, interval: 8000, value: 500, icon: '/assets/resources/tree/heartwood_plank.png', color: 'text-purple-400', description: 'Refined heartwood.', inputs: [{ id: 'heartwood_log', count: 1 }], category: 'wood_refining' },
    { id: 'bloodwood_plank', name: 'Bloodwood Plank', levelRequired: 99, xpReward: 175, interval: 10000, value: 1000, icon: '/assets/resources/tree/bloodwood_plank.png', color: 'text-red-600', description: 'Refined bloodwood.', inputs: [{ id: 'bloodwood_log', count: 1 }], category: 'wood_refining' },

    // WEAPONS (Updated with Swords)
    { id: 'weapon_sword_bronze', name: 'Bronze Sword', levelRequired: 1, xpReward: 20, interval: 3000, value: 15, icon: '/assets/items/weapons/weapon_sword_bronze.png', color: 'text-orange-600', description: 'Basic sword.', inputs: [{ id: 'ore_copper_smelted', count: 2 }], slot: 'weapon', stats: { attack: 100000000000000000 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_iron', name: 'Iron Sword', levelRequired: 15, xpReward: 50, interval: 5000, value: 50, icon: '/assets/items/weapons/weapon_sword_iron.png', color: 'text-slate-400', description: 'Sharp and reliable.', inputs: [{ id: 'ore_iron_smelted', count: 3 }], slot: 'weapon', stats: { attack: 18 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_gold', name: 'Gold Sword', levelRequired: 25, xpReward: 70, interval: 6500, value: 120, icon: '/assets/items/weapons/weapon_sword_gold.png', color: 'text-yellow-400', description: 'Shiny and heavy.', inputs: [{ id: 'ore_gold_smelted', count: 3 }], slot: 'weapon', stats: { attack: 30 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_mithril', name: 'Mithril Sword', levelRequired: 40, xpReward: 100, interval: 8000, value: 250, icon: '/assets/items/weapons/weapon_sword_mithril.png', color: 'text-cyan-400', description: 'Lightweight blade.', inputs: [{ id: 'ore_mithril_smelted', count: 3 }], slot: 'weapon', stats: { attack: 50 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_adamantite', name: 'Adamantite Sword', levelRequired: 55, xpReward: 150, interval: 9500, value: 500, icon: '/assets/items/weapons/weapon_sword_adamantite.png', color: 'text-purple-400', description: 'Extremely hard edge.', inputs: [{ id: 'ore_adamantite_smelted', count: 3 }], slot: 'weapon', stats: { attack: 80 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_emerald', name: 'Emerald Sword', levelRequired: 70, xpReward: 220, interval: 11000, value: 1000, icon: '/assets/items/weapons/weapon_sword_emerald.png', color: 'text-emerald-400', description: 'Crystalline power.', inputs: [{ id: 'ore_emerald_smelted', count: 3 }], slot: 'weapon', stats: { attack: 120 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_eternium', name: 'Eternium Sword', levelRequired: 85, xpReward: 350, interval: 13000, value: 2500, icon: '/assets/items/weapons/weapon_sword_eternium.png', color: 'text-red-500', description: 'Blade out of time.', inputs: [{ id: 'ore_eternium_smelted', count: 3 }], slot: 'weapon', stats: { attack: 180 }, category: 'weapons', combatStyle: 'melee' },
    { id: 'weapon_sword_starfallalloy', name: 'Starfall Sword', levelRequired: 99, xpReward: 500, interval: 16000, value: 5000, icon: '/assets/items/weapons/weapon_sword_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic destruction.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 3 }], slot: 'weapon', stats: { attack: 250 }, category: 'weapons', combatStyle: 'melee' },
    
    // Bows now use new logs
    { id: 'weapon_shortbow_normal', name: 'Pine Shortbow', levelRequired: 1, xpReward: 20, interval: 2000, value: 10, icon: '/assets/items/bow_normal.png', color: 'text-amber-600', description: 'Simple pine bow.', inputs: [{ id: 'pine_log', count: 2 }], slot: 'weapon', stats: { attack: 6 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_shortbow_oak', name: 'Oak Shortbow', levelRequired: 15, xpReward: 40, interval: 3000, value: 30, icon: '/assets/items/bow_oak.png', color: 'text-amber-700', description: 'Sturdy oak bow.', inputs: [{ id: 'oak_log', count: 2 }], slot: 'weapon', stats: { attack: 14 }, category: 'weapons', combatStyle: 'ranged' },
    { id: 'weapon_shortbow_willow', name: 'Willow Shortbow', levelRequired: 30, xpReward: 80, interval: 4000, value: 80, icon: '/assets/items/bow_willow.png', color: 'text-emerald-800', description: 'High quality bow.', inputs: [{ id: 'willow_log', count: 3 }], slot: 'weapon', stats: { attack: 24 }, category: 'weapons', combatStyle: 'ranged' },
    
    // Wands now use new logs
    { id: 'weapon_wand_basic', name: 'Pine Wand', levelRequired: 1, xpReward: 25, interval: 2500, value: 20, icon: '/assets/items/wand_basic.png', color: 'text-blue-300', description: 'Channels weak magic.', inputs: [{ id: 'pine_log', count: 3 }], slot: 'weapon', stats: { attack: 5 }, category: 'weapons', combatStyle: 'magic' },
    { id: 'weapon_wand_oak', name: 'Oak Wand', levelRequired: 15, xpReward: 50, interval: 3500, value: 45, icon: '/assets/items/wand_oak.png', color: 'text-amber-600', description: 'Focused magic power.', inputs: [{ id: 'oak_log', count: 3 }], slot: 'weapon', stats: { attack: 12 }, category: 'weapons', combatStyle: 'magic' },
    { id: 'weapon_staff_willow', name: 'Willow Staff', levelRequired: 30, xpReward: 90, interval: 5000, value: 100, icon: '/assets/items/staff_willow.png', color: 'text-emerald-600', description: 'Powerful magical staff.', inputs: [{ id: 'willow_log', count: 4 }], slot: 'weapon', stats: { attack: 22 }, category: 'weapons', combatStyle: 'magic' },
  
    // --- JEWELRY (NECKLACES) ---
    { id: 'necklace_iron', name: 'Iron Necklace', levelRequired: 15, xpReward: 40, interval: 4000, value: 60, icon: '/assets/items/necklace/necklace_iron.png', color: 'text-slate-400', description: 'Basic iron chain.', inputs: [{ id: 'ore_iron_smelted', count: 2 }], slot: 'necklace', stats: { attack: 2, defense: 2 }, category: 'jewelry' },
    { id: 'necklace_gold', name: 'Gold Necklace', levelRequired: 25, xpReward: 60, interval: 5000, value: 150, icon: '/assets/items/necklace/necklace_gold.png', color: 'text-yellow-400', description: 'Shiny gold chain.', inputs: [{ id: 'ore_gold_smelted', count: 2 }], slot: 'necklace', stats: { attack: 4, defense: 4 }, category: 'jewelry' },
    { id: 'necklace_adamantite', name: 'Adamantite Necklace', levelRequired: 55, xpReward: 120, interval: 7000, value: 600, icon: '/assets/items/necklace/necklace_adamantite.png', color: 'text-purple-400', description: 'Strong adamantite link.', inputs: [{ id: 'ore_adamantite_smelted', count: 2 }], slot: 'necklace', stats: { attack: 8, defense: 8 }, category: 'jewelry' },
    { id: 'necklace_emerald', name: 'Emerald Necklace', levelRequired: 70, xpReward: 180, interval: 9000, value: 1200, icon: '/assets/items/necklace/necklace_emerald.png', color: 'text-emerald-400', description: 'Glowing emerald pendant.', inputs: [{ id: 'ore_emerald_smelted', count: 2 }], slot: 'necklace', stats: { attack: 12, defense: 12 }, category: 'jewelry' },
    { id: 'necklace_eternium', name: 'Eternium Necklace', levelRequired: 85, xpReward: 250, interval: 12000, value: 3000, icon: '/assets/items/necklace/necklace_eternium.png', color: 'text-red-500', description: 'Timeless eternium charm.', inputs: [{ id: 'ore_eternium_smelted', count: 2 }], slot: 'necklace', stats: { attack: 18, defense: 18 }, category: 'jewelry' },
    { id: 'necklace_starfallalloy', name: 'Starfall Necklace', levelRequired: 99, xpReward: 400, interval: 15000, value: 6000, icon: '/assets/items/necklace/necklace_starfallalloy.png', color: 'text-indigo-400', description: 'Cosmic starfall relic.', inputs: [{ id: 'ore_starfallalloy_smelted', count: 2 }], slot: 'necklace', stats: { attack: 25, defense: 25 }, category: 'jewelry' },
  ],

  // --- FISHING: Updated Fish List ---
  fishing: [
    { 
      id: 'fish_riverminnow', name: 'River Minnow', levelRequired: 1, xpReward: 10, interval: 2500, value: 2, 
      icon: '/assets/resources/fish/fish_riverminnow.png', 
      color: 'text-blue-300', description: 'Small freshwater fish.', requiresMapCompletion: undefined 
    },
    { 
      id: 'fish_redfinsalmon', name: 'Redfin Salmon', levelRequired: 15, xpReward: 25, interval: 4000, value: 5, 
      icon: '/assets/resources/fish/fish_redfinsalmon.png', 
      color: 'text-red-400', description: 'Strong swimmer.', requiresMapCompletion: 2 
    },
    { 
      id: 'fish_silvercarp', name: 'Silver Carp', levelRequired: 30, xpReward: 45, interval: 5500, value: 12, 
      icon: '/assets/resources/fish/fish_silvercarp.png', 
      color: 'text-slate-300', description: 'Shimmers in the light.', requiresMapCompletion: 4 
    },
    { 
      id: 'fish_brineshrimp', name: 'Brine Shrimp', levelRequired: 45, xpReward: 70, interval: 7000, value: 25, 
      icon: '/assets/resources/fish/fish_brineshrimp.png', 
      color: 'text-pink-400', description: 'Salty crustacean.', requiresMapCompletion: 5 
    },
    { 
      id: 'fish_sandstar', name: 'Sand Star', levelRequired: 60, xpReward: 100, interval: 8500, value: 50, 
      icon: '/assets/resources/fish/fish_sandstar.png', 
      color: 'text-amber-200', description: 'Found on the ocean floor.', requiresMapCompletion: 7 
    },
    { 
      id: 'fish_stormcrab', name: 'Storm Crab', levelRequired: 75, xpReward: 150, interval: 10000, value: 100, 
      icon: '/assets/resources/fish/fish_stormcrab.png', 
      color: 'text-indigo-400', description: 'Crackling with energy.', requiresMapCompletion: 8 
    },
    { 
      id: 'fish_deepwatereel', name: 'Deepwater Eel', levelRequired: 85, xpReward: 220, interval: 12000, value: 200, 
      icon: '/assets/resources/fish/fish_deepwatereel.png', 
      color: 'text-cyan-600', description: 'Lurks in the abyss.', requiresMapCompletion: 9 
    },
    { 
      id: 'fish_eternalcthulhu', name: 'Eternal Cthulhu', levelRequired: 99, xpReward: 350, interval: 15000, value: 500, 
      icon: '/assets/resources/fish/fish_eternalcthulhu.png', 
      color: 'text-purple-600', description: 'The old one sleeps no more.', requiresMapCompletion: 10 
    },
  ],

  farming: [
    { id: 'crop_potato', name: 'Raw Potato', levelRequired: 1, xpReward: 10, interval: 10000, value: 3, icon: '/assets/resources/crop_potato.png', color: 'text-yellow-600', description: 'Basic raw food.', requiresMapCompletion: undefined }
  ],

  // --- COOKING: Updated to use new fish ---
  cooking: [
    { 
      id: 'food_minnow_cooked', name: 'Cooked Minnow', levelRequired: 1, xpReward: 15, interval: 2000, value: 5, 
      icon: '/assets/items/food_minnow.png', 
      color: 'text-blue-200', description: 'Heals 10 HP.', healing: 10, slot: 'food',
      inputs: [{ id: 'fish_riverminnow', count: 1 }] 
    },
    { 
      id: 'food_potato_baked', name: 'Baked Potato', levelRequired: 5, xpReward: 20, interval: 3000, value: 8, 
      icon: '/assets/items/food_potato.png', 
      color: 'text-yellow-500', description: 'Heals 15 HP.', healing: 15, slot: 'food',
      inputs: [{ id: 'crop_potato', count: 1 }] 
    },
    { 
      id: 'food_salmon_cooked', name: 'Smoked Salmon', levelRequired: 15, xpReward: 35, interval: 3500, value: 15, 
      icon: '/assets/items/food_salmon.png', 
      color: 'text-red-300', description: 'Heals 30 HP.', healing: 30, slot: 'food',
      inputs: [{ id: 'fish_redfinsalmon', count: 1 }] 
    },
    { 
      id: 'food_carp_cooked', name: 'Roasted Carp', levelRequired: 30, xpReward: 60, interval: 4500, value: 30, 
      icon: '/assets/items/food_carp.png', 
      color: 'text-slate-200', description: 'Heals 50 HP.', healing: 50, slot: 'food',
      inputs: [{ id: 'fish_silvercarp', count: 1 }] 
    },
    { 
      id: 'food_shrimp_cooked', name: 'Grilled Shrimp', levelRequired: 45, xpReward: 90, interval: 5500, value: 60, 
      icon: '/assets/items/food_shrimp.png', 
      color: 'text-pink-300', description: 'Heals 80 HP.', healing: 80, slot: 'food',
      inputs: [{ id: 'fish_brineshrimp', count: 1 }] 
    },
    { 
      id: 'food_crab_cooked', name: 'Steamed Crab', levelRequired: 60, xpReward: 130, interval: 6500, value: 120, 
      icon: '/assets/items/food_crab.png', 
      color: 'text-indigo-300', description: 'Heals 120 HP.', healing: 120, slot: 'food',
      inputs: [{ id: 'fish_stormcrab', count: 1 }] 
    },
    { 
      id: 'food_eel_cooked', name: 'Eel Stew', levelRequired: 75, xpReward: 180, interval: 8000, value: 250, 
      icon: '/assets/items/food_eel.png', 
      color: 'text-cyan-400', description: 'Heals 200 HP.', healing: 200, slot: 'food',
      inputs: [{ id: 'fish_deepwatereel', count: 1 }] 
    },
    { 
      id: 'food_cthulhu_cooked', name: 'Cosmic Soup', levelRequired: 90, xpReward: 300, interval: 10000, value: 600, 
      icon: '/assets/items/food_cthulhu.png', 
      color: 'text-purple-400', description: 'Heals 500 HP.', healing: 500, slot: 'food',
      inputs: [{ id: 'fish_eternalcthulhu', count: 1 }] 
    },
  ],
};

// --- SHOP ITEMS ---
export const SHOP_ITEMS: ShopItem[] = [
  // ... (Säilytä aiemmat esineet)

  // --- GOD TIER UPGRADES (99% Speed Boost) ---
  { 
    id: 'god_axe', 
    name: 'God Axe', 
    cost: 100000, // Tai 0 jos haluat ne ilmaiseksi testiin
    multiplier: 0.01, // 0.01 = 1% alkuperäisestä ajasta = 99% nopeutus
    skill: 'woodcutting', 
    icon: '/assets/items/axe_mithril.png', // Käytetään mithril-ikonia placeholderina tai vaihda uuteen
    description: 'Chops trees at godlike speed (99% faster).' 
  },
  { 
    id: 'god_pickaxe', 
    name: 'God Pickaxe', 
    cost: 100000, 
    multiplier: 0.01, 
    skill: 'mining', 
    icon: '/assets/items/pickaxe_mithril.png', 
    description: 'Mines rocks instantly (99% faster).' 
  },
  { 
    id: 'god_rod', 
    name: 'God Rod', 
    cost: 100000, 
    multiplier: 0.01, 
    skill: 'fishing', 
    icon: '/assets/items/rod_master.png', 
    description: 'Catches fish instantly (99% faster).' 
  },
  { 
    id: 'god_rake', 
    name: 'God Rake', 
    cost: 100000, 
    multiplier: 0.01, 
    skill: 'farming', 
    icon: '/assets/ui/icon_leaf.png', 
    description: 'Grows crops instantly (99% faster).' 
  },
  { 
    id: 'god_hammer', 
    name: 'God Hammer', 
    cost: 100000, 
    multiplier: 0.01, 
    skill: 'smithing', 
    icon: '/assets/items/hammer_steel.png', 
    description: 'Smelts and forges instantly (99% faster).' 
  },
  { 
    id: 'god_chisel', 
    name: 'God Chisel', 
    cost: 100000, 
    multiplier: 0.01, 
    skill: 'crafting', 
    icon: '/assets/items/chisel_steel.png', 
    description: 'Crafts items instantly (99% faster).' 
  },
  { 
    id: 'god_pot', 
    name: 'God Pot', 
    cost: 100000, 
    multiplier: 0.01, 
    skill: 'cooking', 
    icon: '/assets/items/pot_steel.png', 
    description: 'Cooks food instantly (99% faster).' 
  },
];

// --- ACHIEVEMENTS ---
export const ACHIEVEMENTS: Achievement[] = [
  // Updated condition to check for 'pine_log' since 'log_normal' no longer exists
  { id: 'first_log', name: 'First Chop', icon: '/assets/resources/tree/pine_log.png', description: 'Chop your first pine log.', condition: (state) => (state.inventory['pine_log'] || 0) >= 1 },
  { id: 'rich_noob', name: 'Rich Noob', icon: '/assets/ui/coins.png', description: 'Accumulate 1000 coins.', condition: (state) => state.coins >= 1000 },
  { id: 'novice_woodcutter', name: 'Novice Woodcutter', icon: '/assets/skills/woodcutting.png', description: 'Reach Woodcutting Level 10.', condition: (state) => state.skills.woodcutting.level >= 10 },
  { id: 'combat_initiate', name: 'First Blood', icon: '/assets/skills/attack.png', description: 'Complete the first combat map.', condition: (state) => state.combatStats.maxMapCompleted >= 1 }
];

export const getItemDetails = (id: string) => {
  if (id === 'coins') return { name: 'Coins', value: 1, icon: '/assets/ui/coins.png' };

  // Tarkistetaan onko kyseessä dynaaminen world loot (basic, rare, exotic)
  if (id.includes('_basic') || id.includes('_rare') || id.includes('_exotic')) {
    const parts = id.split('_');
    const worldNameRaw = parts[0]; // esim. "greenvale"
    const worldNameDisplay = worldNameRaw.charAt(0).toUpperCase() + worldNameRaw.slice(1);
    const type = parts[1]; // basic, rare tai exotic

    // Määritetään tiedot tyypin perusteella
    if (type === 'basic') return { 
      name: `${worldNameDisplay} Dust`, 
      value: 10, 
      color: 'text-slate-400', 
      icon: `/assets/lootpoolszones/${id}.png`, // Hakee esim. greenvale_basic.png
      description: 'Common essence from this region.' 
    };
    if (type === 'rare') return { 
      name: `${worldNameDisplay} Gem`, 
      value: 100, 
      color: 'text-cyan-400', 
      icon: `/assets/lootpoolszones/${id}.png`, 
      description: 'A rare and valuable gem.' 
    };
    if (type === 'exotic') return { 
      name: `${worldNameDisplay} Elite`, 
      value: 1000, 
      color: 'text-orange-500', 
      icon: `/assets/lootpoolszones/${id}.png`, 
      description: 'A very rare exotic fragment.' 
    };
  }

  // Boss-avaimet
  if (id.startsWith('bosskey_w')) {
    const worldNum = id.replace('bosskey_w', '');
    return {
      name: `World ${worldNum} Key`,
      value: 500,
      color: 'text-yellow-500',
      icon: `/assets/items/bosskey/${id}.png`,
      description: 'Allows access to the world boss.'
    };
  }

  // Muut skill-kohtaiset itemit
  for (const skill of Object.keys(GAME_DATA)) {
    const item = GAME_DATA[skill].find(i => i.id === id);
    if (item) return item;
  }
  return null;
};