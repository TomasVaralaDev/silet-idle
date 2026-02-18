import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_STATE } from '../store/useGameStore';
import type { GameState } from '../types';

// Avain LocalStorage-tallennukselle, jos pilveä ei käytetä tai se on alhaalla
const getLocalKey = (uid: string) => `melvor_clone_save_${uid}`;

/**
 * Lataa pelin tilan joko Firebasesta tai LocalStoragesta.
 */
export const loadGameData = async (userId: string): Promise<GameState> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cloudData = docSnap.data() as Partial<GameState>;

      // Yhdistetään cloudData ja DEFAULT_STATE, jotta uudet kentät eivät puutu
      // Tehdään myös equipment-tarkistukset (ammo/food cleanup)
      const safeEquipment = {
        ...DEFAULT_STATE.equipment,
        ...(cloudData.equipment || {}),
      };
      if ('ammo' in safeEquipment)
        delete (safeEquipment as { ammo?: unknown }).ammo;
      if ('food' in safeEquipment) delete safeEquipment.food;

      return {
        ...DEFAULT_STATE,
        ...cloudData,
        skills: { ...DEFAULT_STATE.skills, ...(cloudData.skills || {}) },
        equipment: safeEquipment,
        scavenger: {
          ...DEFAULT_STATE.scavenger,
          ...(cloudData.scavenger || {}),
        },
        equippedFood: cloudData.equippedFood || null,
        combatSettings: {
          ...DEFAULT_STATE.combatSettings,
          ...(cloudData.combatSettings || {}),
        },
        combatStats: {
          ...DEFAULT_STATE.combatStats,
          ...(cloudData.combatStats || {}),
        },
        unlockedAchievements: cloudData.unlockedAchievements || [],
        settings: { ...DEFAULT_STATE.settings, ...(cloudData.settings || {}) },
      };
    } else {
      // Jos ei löydy pilvestä, kokeillaan LocalStoragea
      const localSaved = localStorage.getItem(getLocalKey(userId));
      if (localSaved) {
        return JSON.parse(localSaved);
      }
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }

  // Jos mitään ei löydy tai tapahtuu virhe, palautetaan oletustila
  return DEFAULT_STATE;
};

/**
 * Tallentaa pelin tilan Firebaseen.
 */
export const saveGameData = async (
  userId: string,
  state: GameState,
): Promise<boolean> => {
  try {
    // Poistetaan turhat tiedot tallennuksesta (kuten funktiot tai logit, jos niitä ei haluta kantaan)
    // Tässä tapauksessa combatLog voi olla suuri, joten se saatetaan haluta jättää pois,
    // mutta pidetään logiikka samana kuin aiemmin App.tsx:ssä.

    const { combatStats, ...otherState } = state;

    // Poistetaan combatLog combatStatsista tilan säästämiseksi
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { combatLog, ...statsWithoutLog } = combatStats;

    const dataToSave = {
      ...otherState,
      combatStats: statsWithoutLog,
    };

    await setDoc(
      doc(db, 'users', userId),
      JSON.parse(JSON.stringify(dataToSave)),
    );

    // Varmuuskopio LocalStorageen
    localStorage.setItem(getLocalKey(userId), JSON.stringify(dataToSave));

    return true;
  } catch (e) {
    console.error('Save error:', e);
    return false;
  }
};

/**
 * Nollaa pelitilanteen (Hard Reset)
 */
export const resetGameData = async (userId: string) => {
  try {
    await setDoc(doc(db, 'users', userId), DEFAULT_STATE);
    localStorage.removeItem(getLocalKey(userId));
    return DEFAULT_STATE;
  } catch (e) {
    console.error('Reset error:', e);
    return null;
  }
};
