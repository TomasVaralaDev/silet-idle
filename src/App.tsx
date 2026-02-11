import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, SkillType, ViewType, ShopItem, EquipmentSlot, CombatStyle, Resource, Ingredient, Expedition, GameSettings, WeightedDrop, CombatStats } from './types';
import { GAME_DATA, SHOP_ITEMS, ACHIEVEMENTS, getItemDetails, COMBAT_DATA, WORLD_LOOT } from './data';
import { calculateHit, getPlayerStats, getEnemyStats } from './utils/combatMechanics';

// FIREBASE
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from './firebase'; 
import Auth from './components/Auth';

import Sidebar from './components/Sidebar';
import SkillView from './components/SkillView';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import Gamble from './components/Gamble';
import SellModal from './components/SellModal';
import AchievementsView from './components/AchievementsView';
import CombatView from './components/CombatView';
import ScavengerView from './components/ScavengerView';
import UsernameModal from './components/UsernameModal';
import SettingsModal from './components/SettingsModal';

// --- CONSTANTS ---
const WORLD_DROP_CHANCE = 0.3; // 30% chance for bonus world loot

const DEFAULT_STATE: GameState = {
  username: "", 
  settings: {
    notifications: true,
    sound: true,
    music: true,
    particles: true
  },
  inventory: {},
  skills: {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 },
    fishing: { xp: 0, level: 1 },
    farming: { xp: 0, level: 1 },
    crafting: { xp: 0, level: 1 },
    smithing: { xp: 0, level: 1 },
    cooking: { xp: 0, level: 1 },
    hitpoints: { xp: 0, level: 10 },
    attack: { xp: 0, level: 1 },
    defense: { xp: 0, level: 1 },
    melee: { xp: 0, level: 1 },
    ranged: { xp: 0, level: 1 },
    magic: { xp: 0, level: 1 },
    combat: { xp: 0, level: 1 },
    scavenging: { xp: 0, level: 1 },
  },
  equipment: {
    head: null, body: null, legs: null, weapon: null, shield: null,
    necklace: null, ring: null, rune: null, skill: null
  },
  equippedFood: null,
  combatSettings: {
    autoEatThreshold: 50,
    autoProgress: false
  },
  scavenger: {
    activeExpeditions: [],
    unlockedSlots: 1
  },
  activeAction: null,
  coins: 0,
  upgrades: [],
  unlockedAchievements: [],
  combatStats: {
    hp: 100,
    currentMapId: null,
    maxMapCompleted: 0,
    enemyCurrentHp: 0,
    respawnTimer: 0,
    foodTimer: 0,
    combatLog: [] // Alustetaan tyhjä loki
  }
};

type ResourceSkillType = Exclude<SkillType, 'hitpoints' | 'attack' | 'defense' | 'melee' | 'ranged' | 'magic' | 'combat' | 'scavenging'>;

function isEquipmentSlot(slot: string): slot is keyof GameState['equipment'] {
  return ['head', 'body', 'legs', 'weapon', 'shield', 'necklace', 'ring', 'rune', 'skill'].includes(slot);
}

// --- WEIGHTED DROP HELPER ---
const pickWeightedItem = (drops: WeightedDrop[]): WeightedDrop | null => {
  if (!drops || drops.length === 0) return null;

  const totalWeight = drops.reduce((sum, item) => sum + item.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const drop of drops) {
    if (randomWeight < drop.weight) {
      return drop;
    }
    randomWeight -= drop.weight;
  }
  return drops[0]; // Fallback
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('woodcutting');
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, icon: string} | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [state, setState] = useState<GameState>(DEFAULT_STATE);

  const getMaxHp = (hpLevel: number) => hpLevel * 10;
  const getNextLevelXp = (level: number) => level * 150;

  const getSpeedMultiplier = useCallback((skill: SkillType) => {
    if (['hitpoints', 'attack', 'defense', 'melee', 'ranged', 'magic', 'combat', 'scavenging'].includes(skill)) return 1;
    let multiplier = 1;
    const ownedUpgrades = SHOP_ITEMS.filter(item => 
      state.upgrades.includes(item.id) && item.skill === skill
    );
    if (ownedUpgrades.length > 0) {
      multiplier = Math.min(...ownedUpgrades.map(u => u.multiplier));
    }
    return multiplier;
  }, [state.upgrades]);

  const getXpMultiplier = useCallback((skill: SkillType) => {
    // Check if player owns "xp_tome_[skill]"
    const hasTome = state.upgrades.includes(`xp_tome_${skill}`);
    return hasTome ? 5 : 1;
  }, [state.upgrades]);

  const calculateXpGain = (currentLevel: number, currentXp: number, xpReward: number) => {
    let newXp = currentXp + xpReward;
    let newLevel = currentLevel;
    let nextLevelReq = newLevel * 150;
    while (newXp >= nextLevelReq) {
      newXp -= nextLevelReq;
      newLevel++;
      nextLevelReq = newLevel * 150;
    }
    return { level: newLevel, xp: newXp };
  };

  // AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsDataLoaded(false);
      const docRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as Partial<GameState>;
          const safeEquipment = { ...DEFAULT_STATE.equipment, ...(cloudData.equipment || {}) };
          
          if ('ammo' in safeEquipment) delete (safeEquipment as { ammo?: unknown }).ammo;
          if ('food' in safeEquipment) delete safeEquipment.food;

          setState({
            ...DEFAULT_STATE,
            ...cloudData,
            skills: { ...DEFAULT_STATE.skills, ...(cloudData.skills || {}) },
            equipment: safeEquipment,
            scavenger: { ...DEFAULT_STATE.scavenger, ...(cloudData.scavenger || {}) },
            equippedFood: cloudData.equippedFood || null,
            combatSettings: { ...DEFAULT_STATE.combatSettings, ...(cloudData.combatSettings || {}) },
            combatStats: { ...DEFAULT_STATE.combatStats, ...(cloudData.combatStats || {}) },
            unlockedAchievements: cloudData.unlockedAchievements || [],
            settings: { ...DEFAULT_STATE.settings, ...(cloudData.settings || {}) }
          });
        } else {
          const userSaveKey = `melvor_clone_save_${user.uid}`;
          const localSaved = localStorage.getItem(userSaveKey);
          if (localSaved) {
             setState(JSON.parse(localSaved));
          } else {
             setState(DEFAULT_STATE);
          }
        }
      } catch (err) { console.error(err); } 
      finally { setIsDataLoaded(true); }
    };
    if (!loadingAuth) loadData();
  }, [user, loadingAuth]);

  // AUTO SAVE
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const handleForceSave = useCallback(async () => {
    if (!user || !isDataLoaded) return;
    try {
      setSaveStatus('saving');
      await setDoc(doc(db, 'users', user.uid), JSON.parse(JSON.stringify(stateRef.current)));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [user, isDataLoaded]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;
    const interval = setInterval(() => {
       handleForceSave();
    }, 300000);
    return () => clearInterval(interval);
  }, [user, isDataLoaded, handleForceSave]);

  // --- SCAVENGER LOGIC LOOP ---
  useEffect(() => {
    if (!isDataLoaded) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        const now = Date.now();
        let hasChanges = false;
        
        const updatedExpeditions = prev.scavenger.activeExpeditions.map(exp => {
          if (!exp.completed && now >= exp.startTime + exp.duration) {
            hasChanges = true;
            return { ...exp, completed: true };
          }
          return exp;
        });

        if (hasChanges) {
          return {
            ...prev,
            scavenger: { ...prev.scavenger, activeExpeditions: updatedExpeditions }
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDataLoaded]);

  // --- COMBAT & SKILL LOOP ---
  useEffect(() => {
    let intervalId: number | undefined;

    // A) COMBAT LOOP
    if (state.activeAction?.skill === 'combat' && state.combatStats.currentMapId && isDataLoaded) {
      intervalId = window.setInterval(() => {
        setState(prev => {
          let map = COMBAT_DATA.find(m => m.id === prev.combatStats.currentMapId);
          if (!map) return prev;

          let { hp, enemyCurrentHp, maxMapCompleted, respawnTimer, foodTimer, currentMapId } = prev.combatStats;

          // --- LOGGING SYSTEM (CAP FIX) ---
          const MAX_LOG_ENTRIES = 50; // <-- TÄMÄ ESTÄÄ SIVUN KAATUMISEN (vaihda halutessasi esim. 100)
          
          // Otetaan kopio edellisestä logista
          let currentLog = prev.combatStats.combatLog ? [...prev.combatStats.combatLog] : [];
          
          const addLog = (msg: string) => {
             currentLog.unshift(msg); // Lisää uusi viesti alkuun
             // Jos lista on liian pitkä, leikkaa se määrättyyn pituuteen
             if (currentLog.length > MAX_LOG_ENTRIES) {
                currentLog = currentLog.slice(0, MAX_LOG_ENTRIES);
             }
          };
          // --------------------------------

          let equippedFood = prev.equippedFood ? { ...prev.equippedFood } : null;
          let notify = null;

          // --- 0. RESPAWN TIMER ---
          if (respawnTimer > 0) {
            respawnTimer -= 1;
            
            if (respawnTimer === 0) {
              if (prev.combatSettings.autoProgress) {
                const nextMap = COMBAT_DATA.find(m => m.id === (currentMapId || 0) + 1);
                
                if (nextMap) {
                  let canSwitch = true;
                  if (nextMap.keyRequired) {
                    const keyCount = prev.inventory[nextMap.keyRequired] || 0;
                    if (keyCount <= 0) canSwitch = false;
                  }
                  if (canSwitch) {
                    currentMapId = nextMap.id;
                    map = nextMap;
                    addLog(`>> MOVING TO: ${map.name} <<`);
                  }
                }
              }
              // Reset HP using mechanics
              const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
              enemyCurrentHp = enemyStats.hp;
              addLog(`Spawned: ${map.enemyName} (HP: ${enemyCurrentHp})`);
            }

            return { 
              ...prev, 
              combatStats: { 
                ...prev.combatStats, 
                respawnTimer, 
                enemyCurrentHp, 
                currentMapId, 
                foodTimer: Math.max(0, foodTimer - 1),
                combatLog: currentLog
              } 
            };
          }

          if (foodTimer > 0) foodTimer -= 1;

          // --- COMBAT LOGIC ---
          const newInventory = { ...prev.inventory };
          const newSkills = { ...prev.skills };

          // Stats Setup
          const weaponId = prev.equipment.weapon;
          const weaponItem = weaponId ? getItemDetails(weaponId) as Resource : null;
          const combatStyle: CombatStyle = weaponItem?.combatStyle || 'melee';
          
          const gearStats = Object.values(prev.equipment).reduce((acc: Partial<CombatStats>, itemId) => {
            if (!itemId) return acc;
            const item = getItemDetails(itemId) as Resource;
            if (item?.stats) {
              acc.attackDamage = (acc.attackDamage || 0) + (item.stats.attack || 0);
              acc.armor = (acc.armor || 0) + (item.stats.defense || 0);
            }
            return acc;
          }, { attackDamage: 0, armor: 0, hp: 0 });

          // Player base stats
          const playerStats = getPlayerStats(prev.skills[combatStyle].level, gearStats);
          playerStats.hp = hp; 
          
          // Enemy base stats
          const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
          enemyStats.hp = enemyCurrentHp;

          // Player Hits
          const playerHits = Math.floor(playerStats.attackSpeed);
          const playerExtraChance = playerStats.attackSpeed - playerHits;
          let totalPlayerDamage = 0;
          const actualPlayerHits = playerHits + (Math.random() < playerExtraChance ? 1 : 0);

          for (let i = 0; i < actualPlayerHits; i++) {
            const hitResult = calculateHit(playerStats, enemyStats);
            totalPlayerDamage += hitResult.finalDamage;
            
            // Log damage
            let hitMsg = `Player hit: ${hitResult.finalDamage}`;
            if (hitResult.isCrit) hitMsg += " (CRIT!)";
            addLog(hitMsg);
          }
          enemyCurrentHp -= totalPlayerDamage;

          // Enemy Hits
          if (enemyCurrentHp > 0) {
             const enemyHits = Math.floor(enemyStats.attackSpeed);
             const enemyExtraChance = enemyStats.attackSpeed - enemyHits;
             let totalEnemyDamage = 0;
             const actualEnemyHits = enemyHits + (Math.random() < enemyExtraChance ? 1 : 0);

             for (let i = 0; i < actualEnemyHits; i++) {
               const hitResult = calculateHit(enemyStats, playerStats);
               totalEnemyDamage += hitResult.finalDamage;
               
               let hitMsg = `Enemy hit: ${hitResult.finalDamage}`;
               if (hitResult.isCrit) hitMsg += " (CRIT!)";
               addLog(hitMsg);
             }
             hp -= totalEnemyDamage;

             // Auto Eat
             const maxHp = getMaxHp(prev.skills.hitpoints.level);
             const eatThresholdHp = maxHp * (prev.combatSettings.autoEatThreshold / 100);
             if (hp <= eatThresholdHp && equippedFood && equippedFood.count > 0 && foodTimer === 0 && hp < maxHp) {
               const foodItem = getItemDetails(equippedFood.itemId) as Resource;
               if (foodItem && foodItem.healing) {
                 equippedFood.count -= 1;
                 if (equippedFood.count <= 0) equippedFood = null;
                 hp = Math.min(maxHp, hp + foodItem.healing);
                 foodTimer = 10;
                 addLog(`Ate food: +${foodItem.healing} HP`);
               }
             }
          }

          // Death Handling
          if (enemyCurrentHp <= 0) {
            enemyCurrentHp = 0;
            respawnTimer = 2;
            let validKill = true;
            let stopCombatNow = false;

            if (map.keyRequired) {
              const currentKeys = newInventory[map.keyRequired] || 0;
              if (currentKeys > 0) {
                newInventory[map.keyRequired] = currentKeys - 1;
                if (newInventory[map.keyRequired] <= 0) {
                  delete newInventory[map.keyRequired];
                  if (prev.settings.notifications) notify = { message: "Last key used!", icon: "/assets/items/key_frozen.png" };
                }
              } else {
                validKill = false;
                stopCombatNow = true;
                if (prev.settings.notifications) notify = { message: "Out of keys!", icon: "/assets/items/key_frozen.png" };
              }
            }

            if (validKill) {
              addLog(`Enemy Defeated!`);

              // XP with Multipliers
              const styleXpMult = getXpMultiplier(combatStyle);
              const styleXpGain = calculateXpGain(newSkills[combatStyle].level, newSkills[combatStyle].xp, map.xpReward * styleXpMult);
              newSkills[combatStyle] = styleXpGain;

              const hpXpMult = getXpMultiplier('hitpoints');
              const hpXpGain = calculateXpGain(newSkills.hitpoints.level, newSkills.hitpoints.xp, Math.ceil(map.xpReward * 0.33) * hpXpMult);
              newSkills.hitpoints = hpXpGain;

              // Normal Loot
              map.drops.forEach(drop => {
                if (Math.random() <= drop.chance) {
                  const amount = Math.floor(Math.random() * (drop.amount[1] - drop.amount[0] + 1)) + drop.amount[0];
                  newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
                  const item = getItemDetails(drop.itemId);
                  addLog(`Loot: ${amount}x ${item?.name || drop.itemId}`);

                  if (drop.itemId.includes('bosskey') && prev.settings.notifications) {
                     notify = { message: "Boss Key Found!", icon: "/assets/items/bosskey/bosskey_w1.png" };
                  }
                }
              });

              // World Loot (Weighted)
              const worldTable = WORLD_LOOT[map.world];
              if (worldTable && Math.random() <= WORLD_DROP_CHANCE) {
                const drop = pickWeightedItem(worldTable);
                if (drop) {
                  const amount = Math.floor(Math.random() * (drop.amount[1] - drop.amount[0] + 1)) + drop.amount[0];
                  newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
                  
                  const itemDet = getItemDetails(drop.itemId);
                  addLog(`** Rare Loot: ${amount}x ${itemDet?.name} **`);

                  if (prev.settings.notifications) {
                    if (drop.itemId.includes('key') || drop.weight <= 50) {
                       notify = { message: `Rare: ${itemDet?.name}`, icon: itemDet?.icon || "/assets/ui/icon_box.png" };
                    }
                  }
                }
              }

              if (map.id > maxMapCompleted) {
                maxMapCompleted = map.id;
                if (prev.settings.notifications) notify = { message: `Map ${map.id} Cleared!`, icon: "/assets/skills/combat.png" };
              }
            }

            if (stopCombatNow) {
               if (notify) { setNotification(notify); setTimeout(() => setNotification(null), 1500); }
               return { 
                 ...prev, 
                 combatStats: { ...prev.combatStats, hp, currentMapId: null, enemyCurrentHp: 0, combatLog: currentLog }, 
                 activeAction: null 
               };
            }
          }

          if (hp <= 0) {
            hp = 0;
            addLog("PLAYER DIED - Returning to base.");
            return { 
              ...prev, 
              activeAction: null, 
              combatStats: { ...prev.combatStats, hp, currentMapId: null, enemyCurrentHp: 0, respawnTimer: 0, foodTimer: 0, combatLog: currentLog } 
            };
          }

          if (notify) { setNotification(notify); setTimeout(() => setNotification(null), 1500); }

          return {
            ...prev,
            inventory: newInventory,
            skills: newSkills,
            equippedFood: equippedFood,
            combatStats: { ...prev.combatStats, hp, enemyCurrentHp, maxMapCompleted, respawnTimer, foodTimer, currentMapId, combatLog: currentLog }
          };
        });
      }, 1000);
    } 
    // B) SKILL LOOP
    else if (state.activeAction && state.activeAction.skill !== 'combat' && isDataLoaded) {
      const { skill, resourceId } = state.activeAction;
      
      if (!['hitpoints', 'attack', 'defense', 'melee', 'ranged', 'magic', 'combat', 'scavenging'].includes(skill)) {
        const resourceSkill = skill as ResourceSkillType;
        const skillData = GAME_DATA[resourceSkill];
        const resource = skillData?.find((r: Resource) => r.id === resourceId);

        if (resource) {
          const multiplier = getSpeedMultiplier(skill);
          const xpMult = getXpMultiplier(skill);
          const actualInterval = resource.interval * multiplier;

          intervalId = window.setInterval(() => {
            setState(prev => {
              if (resource.inputs) {
                const canAfford = resource.inputs.every((req: Ingredient) => (prev.inventory[req.id] || 0) >= req.count);
                if (!canAfford) {
                  clearInterval(intervalId);
                  return { ...prev, activeAction: null }; 
                }
                const newInventory = { ...prev.inventory };
                resource.inputs.forEach((req: Ingredient) => {
                  newInventory[req.id] -= req.count;
                  if (newInventory[req.id] <= 0) delete newInventory[req.id];
                });
                newInventory[resourceId] = (newInventory[resourceId] || 0) + 1;
                const currentSkill = prev.skills[resourceSkill];
                const { level, xp } = calculateXpGain(currentSkill.level, currentSkill.xp, resource.xpReward * xpMult);
                const newSkills = { ...prev.skills, [resourceSkill]: { level, xp } };
                return { ...prev, inventory: newInventory, skills: newSkills };
              }

              const currentSkill = prev.skills[resourceSkill];
              const { level, xp } = calculateXpGain(currentSkill.level, currentSkill.xp, resource.xpReward * xpMult);
              const newSkills = { ...prev.skills, [resourceSkill]: { level, xp } };

              return {
                ...prev,
                inventory: { ...prev.inventory, [resourceId]: (prev.inventory[resourceId] || 0) + 1 },
                skills: newSkills
              };
            });
          }, actualInterval);
        }
      }
    }
    return () => clearInterval(intervalId);
  }, [state.activeAction, getSpeedMultiplier, getXpMultiplier, isDataLoaded, state.combatStats.currentMapId]);

  const toggleAction = (skill: SkillType, resourceId: string) => {
    setState(prev => {
      if (prev.activeAction?.resourceId === resourceId) return { ...prev, activeAction: null };
      if (['hitpoints', 'melee', 'ranged', 'magic', 'defense', 'attack', 'combat', 'scavenging'].includes(skill)) return prev;

      const resourceSkill = skill as ResourceSkillType;
      const resource = GAME_DATA[resourceSkill].find((r: Resource) => r.id === resourceId);
      
      if (resource?.inputs) {
        const canAfford = resource.inputs.every((req: Ingredient) => (prev.inventory[req.id] || 0) >= req.count);
        if (!canAfford) {
          alert("Not enough materials!");
          return prev;
        }
      }
      return { ...prev, activeAction: { skill, resourceId } };
    });
  };

  const toggleAutoProgress = () => {
    setState(prev => ({
      ...prev,
      combatSettings: {
        ...prev.combatSettings,
        autoProgress: !prev.combatSettings.autoProgress
      }
    }));
  };

  // --- ACTIONS ---
  const startCombat = (mapId: number) => {
    const map = COMBAT_DATA.find(m => m.id === mapId);
    if (!map) return;
    
    if (map.keyRequired) {
      const keyCount = state.inventory[map.keyRequired] || 0;
      if (keyCount <= 0) {
        const keyItem = getItemDetails(map.keyRequired);
        if (state.settings.notifications) {
          setNotification({ 
            message: `Missing: ${keyItem?.name || 'Boss Key'}`, 
            icon: "/assets/items/key_frozen.png" 
          });
          setTimeout(() => setNotification(null), 1500); 
        }
        return; 
      }
    }

    setState(prev => {
      // Calculate scaled enemy HP for the start
      const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
      const currentMaxHp = getMaxHp(prev.skills.hitpoints.level);
      
      return {
        ...prev,
        activeAction: { skill: 'combat', resourceId: mapId.toString() },
        combatStats: { 
          ...prev.combatStats, 
          currentMapId: mapId, 
          enemyCurrentHp: enemyStats.hp,
          hp: prev.combatStats.hp > 0 ? prev.combatStats.hp : currentMaxHp,
          respawnTimer: 0,
          foodTimer: 0,
          combatLog: [] // Reset log
        }
      };
    });
  };

  const stopCombat = () => {
    setState(prev => ({
      ...prev,
      activeAction: null,
      combatStats: { ...prev.combatStats, currentMapId: null }
    }));
  };

  const handleSetUsername = async (name: string) => {
    const newState = { ...state, username: name };
    setState(newState);
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), JSON.parse(JSON.stringify(newState)), { merge: true });
        setNotification({ message: `Identity Confirmed: ${name}`, icon: "/assets/ui/icon_check.png" });
        setTimeout(() => setNotification(null), 3000);
      } catch (e) {
        console.error("Failed to save username", e);
      }
    }
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setState(prev => ({ ...prev, settings: newSettings }));
  };

  const handleStartExpedition = (mapId: number, durationMinutes: number) => {
    setState(prev => {
      if (prev.scavenger.activeExpeditions.length >= prev.scavenger.unlockedSlots) return prev;

      const newExpedition: Expedition = {
        id: Date.now().toString(),
        mapId,
        startTime: Date.now(),
        duration: durationMinutes * 60 * 1000,
        completed: false
      };

      return {
        ...prev,
        scavenger: {
          ...prev.scavenger,
          activeExpeditions: [...prev.scavenger.activeExpeditions, newExpedition]
        }
      };
    });
  };

  const handleCancelExpedition = (expeditionId: string) => {
    if (confirm("Cancel expedition? The team will return empty-handed.")) {
      setState(prev => ({
        ...prev,
        scavenger: {
          ...prev.scavenger,
          activeExpeditions: prev.scavenger.activeExpeditions.filter(e => e.id !== expeditionId)
        }
      }));
    }
  };

  const handleClaimExpedition = (expeditionId: string) => {
    setState(prev => {
      const expedition = prev.scavenger.activeExpeditions.find(e => e.id === expeditionId);
      if (!expedition || !expedition.completed) return prev;

      const map = COMBAT_DATA.find(m => m.id === expedition.mapId);
      if (!map) return prev;

      const minutesSpent = Math.floor(expedition.duration / 60000);
      const lootRolls = minutesSpent; 
      
      const newInventory = { ...prev.inventory };
      const gainedItems: Record<string, number> = {};

      for (let i = 0; i < lootRolls; i++) {
        map.drops.forEach(drop => {
          if (Math.random() <= drop.chance) {
            const amount = Math.max(1, Math.floor((Math.random() * (drop.amount[1] - drop.amount[0] + 1) + drop.amount[0]) * 0.5));
            newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + amount;
            gainedItems[drop.itemId] = (gainedItems[drop.itemId] || 0) + amount;
          }
        });
      }

      const remainingExpeditions = prev.scavenger.activeExpeditions.filter(e => e.id !== expeditionId);
      const itemNames = Object.keys(gainedItems).map(id => {
        const item = getItemDetails(id);
        return `${gainedItems[id]}x ${item?.name || id}`;
      }).join(', ');
      
      if (prev.settings.notifications) {
        if (itemNames) {
          setNotification({ message: `Expedition returned: ${itemNames.substring(0, 50)}`, icon: '/assets/skills/scavenging.png' });
        } else {
          setNotification({ message: `Expedition returned empty handed...`, icon: '/assets/skills/scavenging.png' });
        }
        setTimeout(() => setNotification(null), 1500); 
      }

      return {
        ...prev,
        inventory: newInventory,
        scavenger: { ...prev.scavenger, activeExpeditions: remainingExpeditions }
      };
    });
  };

  const sellItem = (itemId: string, amountToSell: number | 'all') => {
    const item = getItemDetails(itemId);
    const currentCount = state.inventory[itemId] || 0;
    if (!item || currentCount <= 0) return;
    const count = amountToSell === 'all' ? currentCount : Math.min(amountToSell, currentCount);
    const profit = count * item.value;
    setState(prev => {
      const newInventory = { ...prev.inventory };
      newInventory[itemId] -= count;
      if (newInventory[itemId] <= 0) {
        delete newInventory[itemId];
        if (selectedItemForSale === itemId) setSelectedItemForSale(null);
      }
      return { ...prev, coins: prev.coins + profit, inventory: newInventory };
    });
  };

  const buyUpgrade = (item: ShopItem) => {
    if (item.id === 'test_money') {
      if (state.coins >= item.cost) setState(prev => ({ ...prev, coins: prev.coins - item.cost + 1000 }));
      return;
    }
    if (state.coins >= item.cost && !state.upgrades.includes(item.id)) {
      setState(prev => ({ ...prev, coins: prev.coins - item.cost, upgrades: [...prev.upgrades, item.id] }));
    }
  };

  const handleGamble = (amount: number, callback: (isWin: boolean) => void) => {
    const isWin = Math.random() >= 0.5;
    setState(prev => ({ ...prev, coins: isWin ? prev.coins + amount : prev.coins - amount }));
    callback(isWin);
  };

  const hardReset = async () => {
    if (confirm("Are you sure? This deletes all progress permanently.")) {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), DEFAULT_STATE);
        const userSaveKey = `melvor_clone_save_${user.uid}`;
        localStorage.removeItem(userSaveKey);
      }
      setState(DEFAULT_STATE);
      setCurrentView('woodcutting');
    }
  };

  const handleEquip = (itemId: string, targetSlot: EquipmentSlot) => {
    if (targetSlot === 'food') return;
    if (!isEquipmentSlot(targetSlot)) return;
    const item = getItemDetails(itemId) as Resource;
    if (!item || !item.slot || item.slot !== targetSlot) return;
    setState(prev => {
      const newInventory = { ...prev.inventory };
      const newEquipment = { ...prev.equipment };
      const currentEquipped = newEquipment[targetSlot];
      newInventory[itemId] -= 1;
      if (newInventory[itemId] <= 0) delete newInventory[itemId];
      if (currentEquipped) newInventory[currentEquipped] = (newInventory[currentEquipped] || 0) + 1;
      newEquipment[targetSlot] = itemId;
      return { ...prev, inventory: newInventory, equipment: newEquipment };
    });
  };

  const handleEquipFood = (itemId: string, amount: number) => {
    const item = getItemDetails(itemId) as Resource;
    if (!item || !item.healing) return;
    setState(prev => {
      const newInventory = { ...prev.inventory };
      let newEquippedFood = prev.equippedFood ? { ...prev.equippedFood } : null;
      if (newEquippedFood) newInventory[newEquippedFood.itemId] = (newInventory[newEquippedFood.itemId] || 0) + newEquippedFood.count;
      if (newInventory[itemId] >= amount) {
        newInventory[itemId] -= amount;
        if (newInventory[itemId] <= 0) delete newInventory[itemId];
        newEquippedFood = { itemId, count: amount };
      }
      return { ...prev, inventory: newInventory, equippedFood: newEquippedFood };
    });
  };

  const handleUnequipFood = () => {
    setState(prev => {
      if (!prev.equippedFood) return prev;
      const newInventory = { ...prev.inventory };
      newInventory[prev.equippedFood.itemId] = (newInventory[prev.equippedFood.itemId] || 0) + prev.equippedFood.count;
      return { ...prev, inventory: newInventory, equippedFood: null };
    });
  };

  const handleUnequip = (slot: string) => {
    if (slot === 'food') return;
    if (!isEquipmentSlot(slot)) return;
    setState(prev => {
      const itemId = prev.equipment[slot];
      if (!itemId) return prev;
      const newEquipment = { ...prev.equipment, [slot]: null };
      const newInventory = { ...prev.inventory, [itemId]: (prev.inventory[itemId] || 0) + 1 };
      return { ...prev, equipment: newEquipment, inventory: newInventory };
    });
  };

  const handleUpdateAutoEat = (threshold: number) => {
    setState(prev => ({
      ...prev,
      combatSettings: { ...prev.combatSettings, autoEatThreshold: threshold }
    }));
  };

  if (loadingAuth) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading User...</div>;
  if (!user) return <Auth />;
  if (!isDataLoaded) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Save Data...</div>;

  const needsUsername = !state.username || state.username === 'Player';

  if (needsUsername) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/bg/combat_grid.png')] opacity-20 animate-pulse"></div>
        <UsernameModal onConfirm={handleSetUsername} onLogout={() => signOut(auth)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden relative">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        coins={state.coins} 
        skills={state.skills} 
        username={state.username}
        onReset={hardReset}
        onLogout={() => signOut(auth)} 
        onStopAction={() => setState(prev => ({ ...prev, activeAction: null }))}
        onForceSave={handleForceSave}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="flex-1 bg-slate-950 relative overflow-y-auto h-screen">
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2 pointer-events-none">
           {saveStatus === 'saving' && <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 animate-pulse">Saving...</div>}
           {saveStatus === 'saved' && <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-emerald-900/50 text-xs text-emerald-400">Cloud Saved</div>}
        </div>

        {showSettings && (
          <SettingsModal 
            settings={state.settings}
            username={state.username}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setShowSettings(false)}
            onForceSave={handleForceSave}
            onReset={hardReset}
            onLogout={() => signOut(auth)}
          />
        )}

        {notification && (
          <div className="fixed bottom-6 right-6 bg-slate-800 border-l-4 border-yellow-400 p-4 rounded shadow-2xl flex items-center gap-4 animate-bounce z-50">
            <img src={notification.icon} className="w-10 h-10 pixelated" alt="Notify" />
            <div>
              <p className="font-bold text-yellow-400 text-sm uppercase">Notice</p>
              <p className="font-bold text-sm">{notification.message}</p>
            </div>
          </div>
        )}

        <SellModal itemId={selectedItemForSale} inventory={state.inventory} onClose={() => setSelectedItemForSale(null)} onSell={sellItem} />

        {currentView === 'combat' && (
          <CombatView 
            combatState={{...state.combatStats, maxHp: getMaxHp(state.skills.hitpoints.level)}}
            inventory={state.inventory}
            equippedFood={state.equippedFood}
            skills={state.skills}
            equipment={state.equipment}
            autoProgress={state.combatSettings.autoProgress}
            onToggleAutoProgress={toggleAutoProgress}
            onEquipFood={handleEquipFood}
            onStartCombat={startCombat}
            onStopCombat={stopCombat}
          />
        )}

        {currentView === 'scavenger' && (
          <ScavengerView 
            scavengerState={state.scavenger}
            maxMapCompleted={state.combatStats.maxMapCompleted}
            onStart={handleStartExpedition}
            onCancel={handleCancelExpedition}
            onClaim={handleClaimExpedition}
          />
        )}

        {['woodcutting', 'mining', 'fishing', 'farming', 'crafting', 'smithing', 'cooking'].includes(currentView) && (
          <SkillView 
            skill={currentView as SkillType} 
            level={state.skills[currentView as SkillType].level}
            xp={state.skills[currentView as SkillType].xp}
            activeAction={state.activeAction}
            inventory={state.inventory}
            onToggleAction={toggleAction}
            speedMultiplier={getSpeedMultiplier(currentView as SkillType)}
            nextLevelXp={getNextLevelXp(state.skills[currentView as SkillType].level)}
            maxMapCompleted={state.combatStats.maxMapCompleted}
          />
        )}

        {currentView === 'inventory' && (
          <Inventory 
            inventory={state.inventory} 
            equipment={state.equipment} 
            equippedFood={state.equippedFood}
            combatSettings={state.combatSettings}
            onSellClick={setSelectedItemForSale} 
            onEquip={handleEquip} 
            onEquipFood={handleEquipFood}
            onUnequip={handleUnequip} 
            onUnequipFood={handleUnequipFood}
            onUpdateAutoEat={handleUpdateAutoEat}
          />
        )}

        {currentView === 'shop' && <Shop items={SHOP_ITEMS} coins={state.coins} upgrades={state.upgrades} onBuy={buyUpgrade} />}
        {currentView === 'gamble' && <Gamble coins={state.coins} onGamble={handleGamble} />}
        {currentView === 'achievements' && <AchievementsView achievements={ACHIEVEMENTS} unlockedIds={state.unlockedAchievements} />}
      </main>
    </div>
  );
}