import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, SkillType, ViewType, ShopItem, EquipmentSlot } from './types';
import { GAME_DATA, SHOP_ITEMS, ACHIEVEMENTS, getItemDetails } from './data';

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

// --- CONSTANTS ---
const DEFAULT_STATE: GameState = {
  inventory: {},
  skills: {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 },
    fishing: { xp: 0, level: 1 },
    farming: { xp: 0, level: 1 },
    crafting: { xp: 0, level: 1 },
  },
  equipment: {
    head: null, body: null, legs: null, weapon: null, ammo: null, shield: null,
  },
  activeAction: null,
  coins: 0,
  upgrades: [],
  unlockedAchievements: [],
};

export default function App() {
  // --- AUTH & LOAD STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // --- GAME STATE ---
  const [currentView, setCurrentView] = useState<ViewType>('woodcutting');
  const [selectedItemForSale, setSelectedItemForSale] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, icon: string} | null>(null);
  
  // UUSI: Tila tallennuksen indikaattorille (idle, saving, saved, error)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [state, setState] = useState<GameState>(DEFAULT_STATE);

  // --- 1. AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setIsDataLoaded(false);
      const docRef = doc(db, 'users', user.uid);
      
      try {
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("Data loaded from Cloud 🔥");
          const cloudData = docSnap.data() as Partial<GameState>;
          setState({
            ...DEFAULT_STATE,
            ...cloudData,
            skills: { ...DEFAULT_STATE.skills, ...(cloudData.skills || {}) },
            equipment: { ...DEFAULT_STATE.equipment, ...(cloudData.equipment || {}) },
            unlockedAchievements: cloudData.unlockedAchievements || []
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
      } catch (err) {
        console.error("Error loading save:", err);
      } finally {
        setIsDataLoaded(true);
      }
    };

    if (!loadingAuth) {
        loadData();
    }
  }, [user, loadingAuth]);

  // --- 3. AUTO-SAVE LOGIC (KORJATTU) ---
  
  const stateRef = useRef(state);
  // Päivitetään ref aina kun tila muuttuu
  useEffect(() => { 
    stateRef.current = state;
    // LocalStorage backup (nopea)
    if (user) {
      const userSaveKey = `melvor_clone_save_${user.uid}`;
      localStorage.setItem(userSaveKey, JSON.stringify(state));
    }
  }, [state, user]);

  // Pilvitallennus-intervalli (ilman state-riippuvuutta)
  useEffect(() => {
    if (!user || !isDataLoaded) return;

    const cloudSaveInterval = setInterval(async () => {
      try {
        setSaveStatus('saving'); 
        
        const dataToSave = JSON.parse(JSON.stringify(stateRef.current));
        
        await setDoc(doc(db, 'users', user.uid), dataToSave);
        
        console.log("✅ Auto-saved to Cloud");
        setSaveStatus('saved');
        
        setTimeout(() => setSaveStatus('idle'), 2000);

      } catch (e) {
        console.error("Cloud save failed:", e);
        setSaveStatus('error');
      }
    }, 300000); // <-- MUUTETTU: 300 000 ms = 5 minuuttia

    return () => clearInterval(cloudSaveInterval);
  }, [user, isDataLoaded]);

  // --- HELPERS ---

  const getNextLevelXp = (level: number) => level * 150;

  const getSpeedMultiplier = useCallback((skill: SkillType) => {
    let multiplier = 1;
    const ownedUpgrades = SHOP_ITEMS.filter(item => 
      state.upgrades.includes(item.id) && item.skill === skill
    );
    if (ownedUpgrades.length > 0) {
      multiplier = Math.min(...ownedUpgrades.map(u => u.multiplier));
    }
    return multiplier;
  }, [state.upgrades]);

  // --- ACHIEVEMENT LOGIC ---
  useEffect(() => {
    if (!isDataLoaded) return;

    const newUnlocks: string[] = [];
    let notificationData: { message: string, icon: string } | null = null;
    
    ACHIEVEMENTS.forEach(ach => {
      if (!state.unlockedAchievements.includes(ach.id) && ach.condition(state)) {
        newUnlocks.push(ach.id);
        notificationData = { message: `Achievement Unlocked: ${ach.name}`, icon: ach.icon };
      }
    });

    if (newUnlocks.length > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocks]
        }));

        if (notificationData) {
          setNotification(notificationData);
          setTimeout(() => setNotification(null), 3000);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [state, isDataLoaded]); 

  // --- LEVEL UP LOGIC ---
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

  // --- GAME LOOP ---
  useEffect(() => {
    let intervalId: number | undefined;

    if (state.activeAction && isDataLoaded) {
      const { skill, resourceId } = state.activeAction;
      const resource = GAME_DATA[skill].find(r => r.id === resourceId);

      if (resource) {
        const multiplier = getSpeedMultiplier(skill);
        const actualInterval = resource.interval * multiplier;

        intervalId = window.setInterval(() => {
          setState(prev => {
            if (resource.inputs) {
              const canAfford = resource.inputs.every(req => (prev.inventory[req.id] || 0) >= req.count);
              if (!canAfford) {
                clearInterval(intervalId);
                return { ...prev, activeAction: null }; 
              }
              const newInventory = { ...prev.inventory };
              resource.inputs.forEach(req => {
                newInventory[req.id] -= req.count;
                if (newInventory[req.id] <= 0) delete newInventory[req.id];
              });
              newInventory[resourceId] = (newInventory[resourceId] || 0) + 1;
              const currentSkill = prev.skills[skill];
              const { level, xp } = calculateXpGain(currentSkill.level, currentSkill.xp, resource.xpReward);
              return { ...prev, inventory: newInventory, skills: { ...prev.skills, [skill]: { level, xp } } };
            }

            const currentSkill = prev.skills[skill];
            const { level, xp } = calculateXpGain(currentSkill.level, currentSkill.xp, resource.xpReward);
            return {
              ...prev,
              inventory: { ...prev.inventory, [resourceId]: (prev.inventory[resourceId] || 0) + 1 },
              skills: { ...prev.skills, [skill]: { level, xp } } 
            };
          });
        }, actualInterval);
      }
    }
    return () => clearInterval(intervalId);
  }, [state.activeAction, getSpeedMultiplier, isDataLoaded]);

  // --- HANDLERS ---
  const toggleAction = (skill: SkillType, resourceId: string) => {
    setState(prev => {
      if (prev.activeAction?.resourceId === resourceId) return { ...prev, activeAction: null };
      const resource = GAME_DATA[skill].find(r => r.id === resourceId);
      if (resource?.inputs) {
        const canAfford = resource.inputs.every(req => (prev.inventory[req.id] || 0) >= req.count);
        if (!canAfford) {
          alert("Not enough materials!");
          return prev;
        }
      }
      return { ...prev, activeAction: { skill, resourceId } };
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
      if (state.coins >= item.cost) {
        setState(prev => ({ ...prev, coins: prev.coins - item.cost + 1000 }));
      }
      return;
    }
    if (state.coins >= item.cost && !state.upgrades.includes(item.id)) {
      setState(prev => ({
        ...prev,
        coins: prev.coins - item.cost,
        upgrades: [...prev.upgrades, item.id]
      }));
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
    const item = getItemDetails(itemId);
    if (item?.slot !== targetSlot) return;
    setState(prev => {
      const newInventory = { ...prev.inventory };
      const newEquipment = { ...prev.equipment };
      const currentEquipped = newEquipment[targetSlot];
      newInventory[itemId] -= 1;
      if (newInventory[itemId] <= 0) delete newInventory[itemId];
      if (currentEquipped) {
        newInventory[currentEquipped] = (newInventory[currentEquipped] || 0) + 1;
      }
      newEquipment[targetSlot] = itemId;
      return { ...prev, inventory: newInventory, equipment: newEquipment };
    });
  };

  const handleUnequip = (slot: string) => {
    setState(prev => {
      const itemId = prev.equipment[slot];
      if (!itemId) return prev;
      const newEquipment = { ...prev.equipment, [slot]: null };
      const newInventory = { ...prev.inventory, [itemId]: (prev.inventory[itemId] || 0) + 1 };
      return { ...prev, equipment: newEquipment, inventory: newInventory };
    });
  };

  // --- RENDER ---

  if (loadingAuth) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading User...</div>;
  if (!user) return <Auth />;
  if (!isDataLoaded) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Save Data from Cloud...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden relative">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        coins={state.coins} 
        skills={state.skills} 
        onReset={hardReset}
        onLogout={() => signOut(auth)} 
      />

      <main className="flex-1 bg-slate-950 relative overflow-y-auto h-screen">
        
        {/* UUSI: Tyylikäs ja huomaamaton tallennusindikaattori */}
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2 pointer-events-none">
           {saveStatus === 'saving' && (
             <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300 animate-pulse">
               <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
               Saving to Cloud...
             </div>
           )}
           {saveStatus === 'saved' && (
             <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-emerald-900/50 text-xs text-emerald-400 transition-opacity duration-500">
               <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
               Cloud Saved
             </div>
           )}
           {saveStatus === 'error' && (
             <div className="flex items-center gap-2 bg-red-900/80 px-3 py-1 rounded-full border border-red-700 text-xs text-red-200">
               ⚠️ Save Failed
             </div>
           )}
        </div>

        {notification && (
          <div className="fixed bottom-6 right-6 bg-slate-800 border-l-4 border-yellow-400 p-4 rounded shadow-2xl flex items-center gap-4 animate-bounce z-50">
            <span className="text-4xl">{notification.icon}</span>
            <div>
              <p className="font-bold text-yellow-400 text-sm uppercase">Achievement Unlocked!</p>
              <p className="font-bold">{notification.message}</p>
            </div>
          </div>
        )}

        <SellModal 
          itemId={selectedItemForSale} 
          inventory={state.inventory} 
          onClose={() => setSelectedItemForSale(null)} 
          onSell={sellItem} 
        />

        {['woodcutting', 'mining', 'fishing', 'farming', 'crafting'].includes(currentView) && (
          <SkillView 
            skill={currentView as SkillType} 
            level={state.skills[currentView as SkillType].level}
            xp={state.skills[currentView as SkillType].xp}
            activeAction={state.activeAction}
            inventory={state.inventory}
            onToggleAction={toggleAction}
            speedMultiplier={getSpeedMultiplier(currentView as SkillType)}
            nextLevelXp={getNextLevelXp(state.skills[currentView as SkillType].level)}
          />
        )}

        {currentView === 'inventory' && (
          <Inventory 
            inventory={state.inventory} 
            equipment={state.equipment}
            onSellClick={setSelectedItemForSale}
            onEquip={handleEquip}
            onUnequip={handleUnequip}
          />
        )}

        {currentView === 'shop' && (
          <Shop 
            items={SHOP_ITEMS} 
            coins={state.coins} 
            upgrades={state.upgrades} 
            onBuy={buyUpgrade} 
          />
        )}

        {currentView === 'gamble' && (
          <Gamble 
            coins={state.coins} 
            onGamble={handleGamble} 
          />
        )}

        {currentView === 'achievements' && (
          <AchievementsView 
            achievements={ACHIEVEMENTS} 
            unlockedIds={state.unlockedAchievements} 
          />
        )}
      </main>

      <style>{`@keyframes flip { 0% { transform: rotateY(0); } 100% { transform: rotateY(720deg); } } .animate-flip { animation: flip 1s ease-out; }`}</style>
    </div>
  );
}