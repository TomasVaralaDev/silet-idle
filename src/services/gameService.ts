import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_STATE } from "../store/useGameStore";
import type { GameState } from "../types";

// Key used for LocalStorage backup when offline or cloud is unavailable
const getLocalKey = (uid: string) => `melvor_clone_save_${uid}`;

/**
 * loadGameData
 * Retrieves the user's game state from Firestore.
 * If the cloud fetch fails or no document exists, it attempts to load from LocalStorage.
 * Validates and sanitizes loaded data against the DEFAULT_STATE to prevent crashes from missing keys.
 *
 * @param userId - The Firebase UID of the player
 * @returns Promise resolving to the validated GameState
 */
export const loadGameData = async (userId: string): Promise<GameState> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cloudData = docSnap.data() as Partial<GameState>;

      // Merge cloudData with DEFAULT_STATE to ensure structural integrity.
      // Legacy cleanup: remove deprecated 'ammo' and 'food' keys from equipment.
      const safeEquipment = {
        ...DEFAULT_STATE.equipment,
        ...(cloudData.equipment || {}),
      };
      if ("ammo" in safeEquipment)
        delete (safeEquipment as { ammo?: unknown }).ammo;
      if ("food" in safeEquipment) delete safeEquipment.food;

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
      // Cloud document missing, attempt to restore from local backup
      const localSaved = localStorage.getItem(getLocalKey(userId));
      if (localSaved) {
        return JSON.parse(localSaved);
      }
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }

  // Fallback to fresh state if all loading methods fail
  return DEFAULT_STATE;
};

/**
 * saveGameData
 * Persists the current game state to both Firestore and LocalStorage.
 * Strips out large, transient data (like combat logs) to save database space and bandwidth.
 *
 * @param userId - The Firebase UID of the player
 * @param state - The current GameState to save
 * @returns Promise resolving to a boolean indicating success
 */
export const saveGameData = async (
  userId: string,
  state: GameState,
): Promise<boolean> => {
  try {
    // Separate transient UI states that do not need cloud persistence
    const { combatStats, ...otherState } = state;

    // Strip out the massive combatLog array to save database capacity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { combatLog, ...statsWithoutLog } = combatStats;

    const dataToSave = {
      ...otherState,
      combatStats: statsWithoutLog,
    };

    // Commit to Firestore (JSON parsing ensures no undefined/function values crash the SDK)
    await setDoc(
      doc(db, "users", userId),
      JSON.parse(JSON.stringify(dataToSave)),
    );

    // Commit to LocalStorage as a fallback mechanism
    localStorage.setItem(getLocalKey(userId), JSON.stringify(dataToSave));

    return true;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
};

/**
 * resetGameData
 * Performs a hard reset on the player's account, wiping Firestore and LocalStorage
 * and returning them to the default starting state.
 *
 * @param userId - The Firebase UID of the player
 * @returns Promise resolving to the DEFAULT_STATE
 */
export const resetGameData = async (userId: string) => {
  try {
    await setDoc(doc(db, "users", userId), DEFAULT_STATE);
    localStorage.removeItem(getLocalKey(userId));
    return DEFAULT_STATE;
  } catch (e) {
    console.error("Reset error:", e);
    return null;
  }
};
