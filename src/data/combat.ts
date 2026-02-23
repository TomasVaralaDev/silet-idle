import { WORLD_LOOT } from './worlds';
import { calculateEnemyStats } from '../utils/enemyScaling';
import type { CombatMap } from '../types';

interface EnemyAesthetic {
  world: number;
  zone: number; // 1-10 (10 on aina bossi)
  name: string;
  enemyName: string;
  image: string;
}

// Apufunktio, joka kytkee maailman lootit mappiin automaattisesti
const getDropsForWorld = (worldId: number) => WORLD_LOOT[worldId] || [];

// OCP: Määrittelemme vain vihollisten ulkonäön. 
// Numeeriset arvot lasketaan automaattisesti, joten voimme muuttaa pelin tasapainoa koskematta tähän listaan.
const ENEMY_AESTHETICS: EnemyAesthetic[] = [
  // --- WORLD 1: GREENVALE ---
  { world: 1, zone: 1, name: "Greenvale Plains", enemyName: "Harmless Slime", image: '/assets/enemies/world1_greenvale/enemy_slime_harmless.png' },
  { world: 1, zone: 2, name: "Tall Grass", enemyName: "Blue Slime", image: '/assets/enemies/world1_greenvale/enemy_slime_blue.png' },
  { world: 1, zone: 3, name: "Forest Edge", enemyName: "Cube Slime", image: '/assets/enemies/world1_greenvale/enemy_slime_cube.png' },
  { world: 1, zone: 4, name: "Woodland Path", enemyName: "Deadly Flower", image: '/assets/enemies/world1_greenvale/enemy_flower_deadly.png' },
  { world: 1, zone: 5, name: "Thorn Grove", enemyName: "Thorn Crawler", image: '/assets/enemies/world1_greenvale/enemy_crawler_thorn.png' },
  { world: 1, zone: 6, name: "Mossy Clearing", enemyName: "Moss Beetle", image: '/assets/enemies/world1_greenvale/enemy_beetle_moss.png' },
  { world: 1, zone: 7, name: "Serpent Hollow", enemyName: "Grove Serpent", image: '/assets/enemies/world1_greenvale/enemy_serpent_grove.png' },
  { world: 1, zone: 8, name: "Bandit Trail", enemyName: "Melee Bandit", image: '/assets/enemies/world1_greenvale/enemy_bandit_melee.png' },
  { world: 1, zone: 9, name: "Deep Woods", enemyName: "Woodland Stalker", image: '/assets/enemies/world1_greenvale/enemy_stalker_woodland.png' },
  { world: 1, zone: 10, name: "Ancient Grove (BOSS)", enemyName: "Oakroot Guardian", image: '/assets/enemies/world1_greenvale/enemy_boss_guardian_oakroot.png' },

  // --- WORLD 2: STONEFALL ---
  { world: 2, zone: 1, name: "Rocky Pass", enemyName: "Cave Bat", image: '/assets/enemies/world2_stonefall/enemy_bat_cave.png' },
  { world: 2, zone: 2, name: "Stone Tunnels", enemyName: "Rock Crab", image: '/assets/enemies/world2_stonefall/enemy_crab_rock.png' },
  { world: 2, zone: 3, name: "Collapsed Mine", enemyName: "Tunnel Rat", image: '/assets/enemies/world2_stonefall/enemy_rat_tunnel.png' },
  { world: 2, zone: 4, name: "Stoneworks", enemyName: "Stone Golem", image: '/assets/enemies/world2_stonefall/enemy_golem_stone.png' },
  { world: 2, zone: 5, name: "Crystal Vein", enemyName: "Ironback Beetle", image: '/assets/enemies/world2_stonefall/enemy_beetle_ironback.png' },
  { world: 2, zone: 6, name: "Mine Depths", enemyName: "Mine Crawler", image: '/assets/enemies/world2_stonefall/enemy_crawler_mine.png' },
  { world: 2, zone: 7, name: "Gravel Fields", enemyName: "Gravel Hound", image: '/assets/enemies/world2_stonefall/enemy_wolf_gravel.png' },
  { world: 2, zone: 8, name: "Crystal Cavern", enemyName: "Crystal Lurker", image: '/assets/enemies/world2_stonefall/enemy_stalker_crystal.png' },
  { world: 2, zone: 9, name: "Abandoned Shaft", enemyName: "Rogue Miner", image: '/assets/enemies/world2_stonefall/enemy_bandit_miner.png' },
  { world: 2, zone: 10, name: "Stonefall Core (BOSS)", enemyName: "The Stone Colossus", image: '/assets/enemies/world2_stonefall/enemy_boss_drake_stone.png' },

  // --- WORLD 3: ASHRIDGE ---
  { world: 3, zone: 1, name: "Ash Plains", enemyName: "Ash Imp", image: '/assets/enemies/world3_ashridge/enemy_imp_ash.png' },
  { world: 3, zone: 2, name: "Cinder Path", enemyName: "Scorchling Slime", image: '/assets/enemies/world3_ashridge/enemy_slime_scorchling.png' },
  { world: 3, zone: 3, name: "Burned Ridge", enemyName: "Ember Wolf", image: '/assets/enemies/world3_ashridge/enemy_wolf_ember.png' },
  { world: 3, zone: 4, name: "Lava Fields", enemyName: "Lava Beetle", image: '/assets/enemies/world3_ashridge/enemy_beetle_lava.png' },
  { world: 3, zone: 5, name: "Molten Gorge", enemyName: "Cinder Serpent", image: '/assets/enemies/world3_ashridge/enemy_serpent_cinder.png' },
  { world: 3, zone: 6, name: "Ash Crypt", enemyName: "Firebound Skeleton", image: '/assets/enemies/world3_ashridge/enemy_bandit_firebound.png' },
  { world: 3, zone: 7, name: "Smolder Pits", enemyName: "Magma Slime", image: '/assets/enemies/world3_ashridge/enemy_slime_magma.png' },
  { world: 3, zone: 8, name: "Lava Rise", enemyName: "Smoldering Stalker", image: '/assets/enemies/world3_ashridge/enemy_stalker_smoldering.png' },
  { world: 3, zone: 9, name: "Cult Grounds", enemyName: "Flame Cultist", image: '/assets/enemies/world3_ashridge/enemy_bandit_cultist.png' },
  { world: 3, zone: 10, name: "Ashridge Core (BOSS)", enemyName: "Inferno Warden", image: '/assets/enemies/world3_ashridge/enemy_boss_warden_inferno.png' },

  // --- WORLD 4: FROSTREACH ---
  { world: 4, zone: 1, name: "Frozen Flats", enemyName: "Frost Rat", image: '/assets/enemies/world4_frostreach/enemy_imp_frost.png' },
  { world: 4, zone: 2, name: "Ice Caves", enemyName: "Ice Spider", image: '/assets/enemies/world4_frostreach/enemy_spider_frost.png' },
  { world: 4, zone: 3, name: "Snow Fields", enemyName: "Snow Wolf", image: '/assets/enemies/world4_frostreach/enemy_wolf_frost.png' },
  { world: 4, zone: 4, name: "Frozen Battlefield", enemyName: "Frozen Soldier", image: '/assets/enemies/world4_frostreach/enemy_bandit_frost.png' },
  { world: 4, zone: 5, name: "Glacier Pass", enemyName: "Glacier Beetle", image: '/assets/enemies/world4_frostreach/enemy_beetle_frost.png' },
  { world: 4, zone: 6, name: "Icebound Ruins", enemyName: "Frost Imp", image: '/assets/enemies/world4_frostreach/enemy_imp_frost.png' },
  { world: 4, zone: 7, name: "Frozen Depths", enemyName: "Icebound Golem", image: '/assets/enemies/world4_frostreach/enemy_golem_frost.png' },
  { world: 4, zone: 8, name: "Blizzard Ridge", enemyName: "Blizzard Stalker", image: '/assets/enemies/world4_frostreach/enemy_stalker_frost.png' },
  { world: 4, zone: 9, name: "Tundra Arena", enemyName: "Tundra Brute", image: '/assets/enemies/world4_frostreach/enemy_brute_frost.png' },
  { world: 4, zone: 10, name: "Frozen Throne (BOSS)", enemyName: "The Icebound Sorcerer", image: '/assets/enemies/world4_frostreach/enemy_boss_mage_frost.png' },

  // --- WORLD 5: DUSKWOOD ---
  { world: 5, zone: 1, name: "Twilight Edge", enemyName: "Shadow Rat", image: '/assets/enemies/world5_duskwood/enemy_rat_shadow.png' },
  { world: 5, zone: 2, name: "Rot Grove", enemyName: "Night Stalker", image: '/assets/enemies/world5_duskwood/enemy_stalker_shadow.png' },
  { world: 5, zone: 3, name: "Blight Nest", enemyName: "Blight Shroom", image: '/assets/enemies/world5_duskwood/enemy_flower_shroom.png' },
  { world: 5, zone: 4, name: "Cursed Clearing", enemyName: "Cursed Tree", image: '/assets/enemies/world5_duskwood/enemy_flower_tree.png' },
  { world: 5, zone: 5, name: "Night Paths", enemyName: "Withered Treant", image: '/assets/enemies/world5_duskwood/enemy_beetle_shadow.png' },
  { world: 5, zone: 6, name: "Gravewood", enemyName: "Grave Hound", image: '/assets/enemies/world5_duskwood/enemy_wolf_shadow.png' },
  { world: 5, zone: 7, name: "Withered Hollow", enemyName: "Rotting Wolf", image: '/assets/enemies/world5_duskwood/enemy_wolf_rotting.png' },
  { world: 5, zone: 8, name: "Dark Shrine", enemyName: "Dark Ritualist", image: '/assets/enemies/world5_duskwood/enemy_bandit_ritualist_shadow.png' },
  { world: 5, zone: 9, name: "Shadow Vale", enemyName: "Shade Horror", image: '/assets/enemies/world5_duskwood/enemy_brute_shadow.png' },
  { world: 5, zone: 10, name: "Dreadwood Heart (BOSS)", enemyName: "The Dreadwood King", image: '/assets/enemies/world5_duskwood/enemy_boss_king_shadow.png' },

  // --- WORLD 6: STORMCOAST ---
  { world: 6, zone: 1, name: "Shoreline", enemyName: "Tide Crawler", image: '/assets/enemies/world6_stormcoast/enemy_crab_lightning.png' },
  { world: 6, zone: 2, name: "Reef Break", enemyName: "Reef Shark", image: '/assets/enemies/world6_stormcoast/enemy_shark_reef.png' },
  { world: 6, zone: 3, name: "Cliff Winds", enemyName: "Storm Gull", image: '/assets/enemies/world6_stormcoast/enemy_imp_lightning.png' },
  { world: 6, zone: 4, name: "Deep Waters", enemyName: "Sea Serpent", image: '/assets/enemies/world6_stormcoast/enemy_serpent_sea.png' },
  { world: 6, zone: 5, name: "Brine Flats", enemyName: "Brine Brute", image: '/assets/enemies/world6_stormcoast/enemy_brute_lightning.png' },
  { world: 6, zone: 6, name: "Storm Surge", enemyName: "Thunder Eel", image: '/assets/enemies/world6_stormcoast/enemy_slime_lightning.png' },
  { world: 6, zone: 7, name: "Coral Reach", enemyName: "Coral Golem", image: '/assets/enemies/world6_stormcoast/enemy_golem_sea.png' },
  { world: 6, zone: 8, name: "Raider Coast", enemyName: "Deepwater Sorcerer", image: '/assets/enemies/world6_stormcoast/enemy_mage_water.png' },
  { world: 6, zone: 9, name: "Tempest Skies", enemyName: "Tempest Drake", image: '/assets/enemies/world6_stormcoast/enemy_drage_lightning_poison.png' },
  { world: 6, zone: 10, name: "Maelstrom Eye (BOSS)", enemyName: "Ruler of the Sea", image: '/assets/enemies/world6_stormcoast/enemy_boss_serpent.png' },

  // --- WORLD 7: VOID EXPANSE ---
  { world: 7, zone: 1, name: "Rift Edge", enemyName: "Voidling", image: '/assets/enemies/world7_voidexpanse/enemy_slime_void.png' },
  { world: 7, zone: 2, name: "Abyss Pools", enemyName: "Void Imp", image: '/assets/enemies/world7_voidexpanse/enemy_imp_void_fire.png' },
  { world: 7, zone: 3, name: "Shadow Flats", enemyName: "Void Eel", image: '/assets/enemies/world7_voidexpanse/enemy_serpent_void.png' },
  { world: 7, zone: 4, name: "Void March", enemyName: "Abyss Walker", image: '/assets/enemies/world7_voidexpanse/enemy_brute_void.png' },
  { world: 7, zone: 5, name: "Null Zone", enemyName: "Null Beast", image: '/assets/enemies/world7_voidexpanse/enemy_golem_void_poison.png' },
  { world: 7, zone: 6, name: "Rift Paths", enemyName: "Void Stalker", image: '/assets/enemies/world7_voidexpanse/enemy_stalker_void.png' },
  { world: 7, zone: 7, name: "Entropy Fields", enemyName: "Entropy Wraith", image: '/assets/enemies/world7_voidexpanse/enemy_mage_void.png' },
  { world: 7, zone: 8, name: "Rift Citadel", enemyName: "Riftbound Knight", image: '/assets/enemies/world7_voidexpanse/enemy_knight_void.png' },
  { world: 7, zone: 9, name: "Starless Depths", enemyName: "Starless Succubus", image: '/assets/enemies/world7_voidexpanse/enemy_bandit_succubus.png' },
  { world: 7, zone: 10, name: "Void Core (BOSS)", enemyName: "The Void Architect", image: '/assets/enemies/world7_voidexpanse/enemy_boss_void.png' },

  // --- WORLD 8: ETERNAL NEXUS ---
  { world: 8, zone: 1, name: "Timeless Gate", enemyName: "Timeless Construct", image: '/assets/enemies/world8_eternalnexus/enemy_imp_fire.png' },
  { world: 8, zone: 2, name: "Aether Halls", enemyName: "Aether Sentinel", image: '/assets/enemies/world8_eternalnexus/enemy_slime_fire.png' },
  { world: 8, zone: 3, name: "Chrono Rift", enemyName: "Chrono Wisp", image: '/assets/enemies/world8_eternalnexus/enemy_wolf_fire.png' },
  { world: 8, zone: 4, name: "Reality Span", enemyName: "Reality Shaper", image: '/assets/enemies/world8_eternalnexus/enemy_bandit_fire.png' },
  { world: 8, zone: 5, name: "Astral Ring", enemyName: "Astral Knight", image: '/assets/enemies/world8_eternalnexus/enemy_knight_fire.png' },
  { world: 8, zone: 6, name: "Phase Reach", enemyName: "Phase Serpent", image: '/assets/enemies/world8_eternalnexus/enemy_serpent_fire.png' },
  { world: 8, zone: 7, name: "Paradox Loop", enemyName: "Paradox Beast", image: '/assets/enemies/world8_eternalnexus/enemy_brute_fire.png' },
  { world: 8, zone: 8, name: "Nexus Watch", enemyName: "Nexus Guardian", image: '/assets/enemies/world8_eternalnexus/enemy_golem_fire.png' },
  { world: 8, zone: 9, name: "Creation Echo", enemyName: "Echo of Creation", image: '/assets/enemies/world8_eternalnexus/enemy_mage_fire.png' },
  { world: 8, zone: 10, name: "Eternal Core (BOSS)", enemyName: "Nexus Lord", image: '/assets/enemies/world8_eternalnexus/enemy_boss_final_nexus_lord.png' }
];

// Yhdistetään staattinen data ja matemaattinen skaalaus. 
// Tästä syntyy lopullinen COMBAT_DATA-taulukko, jota peli käyttää.
export const COMBAT_DATA: CombatMap[] = ENEMY_AESTHETICS.map((mob, index) => {
  const isBoss = mob.zone === 10;
  const generatedStats = calculateEnemyStats(mob.world, mob.zone);

  return {
    id: index + 1, // 1-80
    world: mob.world,
    name: mob.name,
    enemyName: mob.enemyName,
    image: mob.image,
    isBoss: isBoss,
    keyRequired: isBoss ? `bosskey_w${mob.world}` : undefined,
    drops: getDropsForWorld(mob.world),
    
    // Tuodaan lasketut statsit (enemyHp, enemyAttack, xpReward)
    ...generatedStats
  };
});