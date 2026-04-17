export type TowerTier = "easy" | "medium" | "hard";

export interface TowerReward {
  itemId: string;
  amount: number;
}

export interface TowerEnemy {
  id: string;
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  level: number;
  attack: number;
  defense: number;
  xpReward: number;
}

export interface TowerFloor {
  floorNumber: number;
  tier: TowerTier;
  enemy: TowerEnemy;
  firstClearRewards: TowerReward[];
  sweepRewards: TowerReward[];
}

const TOWER_ENEMY_POOL = [
  {
    name: "Verdant Ooze",
    icon: "./assets/enemies/world1_greenvale/enemy_slime_harmless.png",
  },
  {
    name: "Blighted Bloom",
    icon: "./assets/enemies/world1_greenvale/enemy_flower_deadly.png",
  },
  {
    name: "Bramble Creeper",
    icon: "./assets/enemies/world1_greenvale/enemy_crawler_thorn.png",
  },
  {
    name: "Vine Constrictor",
    icon: "./assets/enemies/world1_greenvale/enemy_serpent_grove.png",
  },
  {
    name: "Forest Phantom",
    icon: "./assets/enemies/world1_greenvale/enemy_stalker_woodland.png",
  },
  {
    name: "Elder Treant",
    icon: "./assets/enemies/world1_greenvale/enemy_boss_guardian_oakroot.png",
  },
  {
    name: "Cavern Screecher",
    icon: "./assets/enemies/world2_stonefall/enemy_bat_cave.png",
  },
  {
    name: "Granite Pincer",
    icon: "./assets/enemies/world2_stonefall/enemy_crab_rock.png",
  },
  {
    name: "Rubble Construct",
    icon: "./assets/enemies/world2_stonefall/enemy_golem_stone.png",
  },
  {
    name: "Ore Carapace",
    icon: "./assets/enemies/world2_stonefall/enemy_beetle_ironback.png",
  },
  {
    name: "Geode Ambusher",
    icon: "./assets/enemies/world2_stonefall/enemy_stalker_crystal.png",
  },
  {
    name: "Monolith Titan",
    icon: "./assets/enemies/world2_stonefall/enemy_boss_drake_stone.png",
  },
  {
    name: "Soot Fiend",
    icon: "./assets/enemies/world3_ashridge/enemy_imp_ash.png",
  },
  {
    name: "Ember Pudding",
    icon: "./assets/enemies/world3_ashridge/enemy_slime_scorchling.png",
  },
  {
    name: "Magma Shell",
    icon: "./assets/enemies/world3_ashridge/enemy_beetle_lava.png",
  },
  {
    name: "Igneous Viper",
    icon: "./assets/enemies/world3_ashridge/enemy_serpent_cinder.png",
  },
  {
    name: "Pyre Zealot",
    icon: "./assets/enemies/world3_ashridge/enemy_bandit_cultist.png",
  },
  {
    name: "Blaze Sentinel",
    icon: "./assets/enemies/world3_ashridge/enemy_boss_warden_inferno.png",
  },
  {
    name: "Glacial Weaver",
    icon: "./assets/enemies/world4_frostreach/enemy_spider_frost.png",
  },
  {
    name: "Tundra Howler",
    icon: "./assets/enemies/world4_frostreach/enemy_wolf_frost.png",
  },
  {
    name: "Chillguard Wight",
    icon: "./assets/enemies/world4_frostreach/enemy_bandit_frost.png",
  },
  {
    name: "Permafrost Hulk",
    icon: "./assets/enemies/world4_frostreach/enemy_golem_frost.png",
  },
  {
    name: "Whiteout Predator",
    icon: "./assets/enemies/world4_frostreach/enemy_stalker_frost.png",
  },
  {
    name: "Cryomancer Supreme",
    icon: "./assets/enemies/world4_frostreach/enemy_boss_mage_frost.png",
  },
  {
    name: "Gloom Vermin",
    icon: "./assets/enemies/world5_duskwood/enemy_rat_shadow.png",
  },
  {
    name: "Weeping Timber",
    icon: "./assets/enemies/world5_duskwood/enemy_flower_tree.png",
  },
  {
    name: "Rotwood Behemoth",
    icon: "./assets/enemies/world5_duskwood/enemy_beetle_shadow.png",
  },
  {
    name: "Plagued Hound",
    icon: "./assets/enemies/world5_duskwood/enemy_wolf_rotting.png",
  },
  {
    name: "Umbral Terror",
    icon: "./assets/enemies/world5_duskwood/enemy_brute_shadow.png",
  },
  {
    name: "Monarch of Decay",
    icon: "./assets/enemies/world5_duskwood/enemy_boss_king_shadow.png",
  },
  {
    name: "Surge Crab",
    icon: "./assets/enemies/world6_stormcoast/enemy_crab_lightning.png",
  },
  {
    name: "Gale Shrieker",
    icon: "./assets/enemies/world6_stormcoast/enemy_imp_lightning.png",
  },
  {
    name: "Tidal Thug",
    icon: "./assets/enemies/world6_stormcoast/enemy_brute_lightning.png",
  },
  {
    name: "Reef Sentinel",
    icon: "./assets/enemies/world6_stormcoast/enemy_golem_sea.png",
  },
  {
    name: "Abyssal Channeler",
    icon: "./assets/enemies/world6_stormcoast/enemy_mage_water.png",
  },
  {
    name: "Leviathan Prime",
    icon: "./assets/enemies/world6_stormcoast/enemy_boss_serpent.png",
  },
  {
    name: "Null Spawn",
    icon: "./assets/enemies/world7_voidexpanse/enemy_slime_void.png",
  },
  {
    name: "Rift Gremlin",
    icon: "./assets/enemies/world7_voidexpanse/enemy_imp_void_fire.png",
  },
  {
    name: "Event Horizon Strider",
    icon: "./assets/enemies/world7_voidexpanse/enemy_brute_void.png",
  },
  {
    name: "Oblivion Hound",
    icon: "./assets/enemies/world7_voidexpanse/enemy_golem_void_poison.png",
  },
  {
    name: "Darkmatter Assassin",
    icon: "./assets/enemies/world7_voidexpanse/enemy_stalker_void.png",
  },
  {
    name: "Singularity Vanguard",
    icon: "./assets/enemies/world7_voidexpanse/enemy_knight_void.png",
  },
  {
    name: "Creator of Nothing",
    icon: "./assets/enemies/world7_voidexpanse/enemy_boss_void.png",
  },
  {
    name: "Epoch Automaton",
    icon: "./assets/enemies/world8_eternalnexus/enemy_imp_fire.png",
  },
  {
    name: "Temporal Anomaly",
    icon: "./assets/enemies/world8_eternalnexus/enemy_wolf_fire.png",
  },
  {
    name: "Fabric Weaver",
    icon: "./assets/enemies/world8_eternalnexus/enemy_bandit_fire.png",
  },
  {
    name: "Celestial Templar",
    icon: "./assets/enemies/world8_eternalnexus/enemy_knight_fire.png",
  },
  {
    name: "Quantum Viper",
    icon: "./assets/enemies/world8_eternalnexus/enemy_serpent_fire.png",
  },
  {
    name: "Continuum Devourer",
    icon: "./assets/enemies/world8_eternalnexus/enemy_brute_fire.png",
  },
  {
    name: "The Eternal Sovereign",
    icon: "./assets/enemies/world8_eternalnexus/enemy_boss_final_nexus_lord.png",
  },
];

const generateTier = (
  tier: TowerTier,
  startLevel: number,
  baseHp: number,
  baseDmg: number,
  baseDef: number,
  baseCoins: number,
): TowerFloor[] => {
  const floors: TowerFloor[] = [];
  const totalFloors = 50;

  for (let i = 1; i <= totalFloors; i++) {
    const level = startLevel + i - 1;

    const hpMult = Math.pow(1.15, i - 1);
    const dmgMult = Math.pow(1.18, i - 1);
    const defMult = Math.pow(1.1, i - 1);
    const coinMult = Math.pow(1.2, i - 1);

    const enemyConfig = TOWER_ENEMY_POOL[i - 1];

    floors.push({
      floorNumber: i,
      tier: tier,
      enemy: {
        id: `tower_${tier}_enemy_${i}`,
        name: enemyConfig.name,
        icon: enemyConfig.icon,
        maxHp: Math.floor(baseHp * hpMult),
        currentHp: Math.floor(baseHp * hpMult),
        level: level,
        attack: Math.floor(baseDmg * dmgMult),
        defense: Math.floor(baseDef * defMult),
        xpReward: Math.floor(100 * hpMult),
      },
      firstClearRewards: [
        { itemId: "coins", amount: Math.floor(baseCoins * coinMult) },
      ],
      sweepRewards: [
        { itemId: "coins", amount: Math.floor(baseCoins * 0.5 * coinMult) },
      ],
    });
  }
  return floors;
};

export const TOWER_DATA: Record<TowerTier, TowerFloor[]> = {
  easy: generateTier("easy", 1, 100, 10, 2, 50),
  medium: generateTier("medium", 31, 5000, 250, 50, 500),
  hard: generateTier("hard", 61, 150000, 2000, 300, 5000),
};
