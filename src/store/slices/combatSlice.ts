import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { COMBAT_DATA } from '../../data/combat';
import { processCombatTick as calculateCombatSystem } from '../../systems/combatSystem';
import type { GameState, Enemy, CombatSettings, CombatState } from '../../types';

export interface CombatSlice {
  startCombat: (mapId: number) => void;
  stopCombat: () => void;
  processCombatTick: () => void;
  addCombatLog: (message: string) => void;
  toggleAutoProgress: () => void;
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;
}

// Määritellään paikallinen laajennus, jos attackTimer puuttuu perustyypistä
type ExtendedCombatState = CombatState & { attackTimer?: number };

export const createCombatSlice: StateCreator<FullStoreState, [], [], CombatSlice> = (set, get) => ({
  
  startCombat: (mapId: number) => {
    const map = COMBAT_DATA.find(m => m.id === mapId);
    if (!map) return;

    const newEnemy: Enemy = {
      id: `enemy_${map.id}_${Date.now()}`,
      name: map.enemyName,
      icon: map.image || '',
      maxHp: map.enemyHp,
      currentHp: map.enemyHp,
      level: map.id,
      attack: map.enemyAttack,
      defense: Math.floor(map.enemyAttack * 0.1),
      xpReward: map.xpReward
    };

    // Luodaan uusi stats-objekti
    const currentStats = get().combatStats;
    const newStats: ExtendedCombatState = {
      ...currentStats,
      currentMapId: mapId,
      enemyCurrentHp: map.enemyHp,
      respawnTimer: 0,
      attackTimer: 1000,
      hp: currentStats.hp > 0 ? currentStats.hp : get().skills.hitpoints.level * 10
    };

    set({
      activeAction: { skill: 'combat', resourceId: mapId.toString(), progress: 0, targetTime: 0 },
      enemy: newEnemy,
      // KORJAUS: Käytetään 'as unknown as CombatState' jos ExtendedCombatState ei kelpaa suoraan,
      // mutta tämä on turvallinen tapa kiertää 'any'-kielto.
      combatStats: newStats as unknown as CombatState
    });
  },

  processCombatTick: () => {
    const currentState = get() as unknown as GameState;
    // Käytetään 100ms aikaleimaa
    const updates = calculateCombatSystem(currentState, 100);

    if (Object.keys(updates).length > 0) {
      const nextState: Partial<FullStoreState> = { ...updates };
      const nextStats = updates.combatStats || get().combatStats;

      if (nextStats.respawnTimer > 0) {
        nextState.enemy = null;
      } else if (nextStats.enemyCurrentHp > 0 && !get().enemy) {
        const map = COMBAT_DATA.find(m => m.id === nextStats.currentMapId);
        if (map) {
          nextState.enemy = {
            id: `enemy_${map.id}_${Date.now()}`,
            name: map.enemyName,
            icon: map.image || '',
            maxHp: map.enemyHp,
            currentHp: nextStats.enemyCurrentHp,
            level: map.id,
            attack: map.enemyAttack,
            defense: Math.floor(map.enemyAttack * 0.1),
            xpReward: map.xpReward
          };
        }
      }

      set(nextState);
    }
  },

  stopCombat: () => set({ 
    activeAction: null, 
    enemy: null, 
    combatStats: { ...get().combatStats, currentMapId: null, enemyCurrentHp: 0, respawnTimer: 0 }
  }),

  toggleAutoProgress: () => set({ 
    combatSettings: { ...get().combatSettings, autoProgress: !get().combatSettings.autoProgress }
  }),

  updateCombatSettings: (newSettings) => set((state) => ({
    combatSettings: { ...state.combatSettings, ...newSettings }
  })),

  addCombatLog: (message: string) => set({ 
    combatStats: { ...get().combatStats, combatLog: [message, ...get().combatStats.combatLog].slice(0, 20) }
  })
});