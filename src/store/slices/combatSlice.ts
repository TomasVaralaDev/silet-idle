import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { COMBAT_DATA } from '../../data/combat';
import { processCombatTick as calculateCombatSystem } from '../../systems/combatSystem';
import type { GameState, Enemy, CombatSettings } from '../../types'; // Lisätty CombatSettings import

export interface CombatSlice {
  startCombat: (mapId: number) => void;
  stopCombat: () => void;
  processCombatTick: () => void;
  addCombatLog: (message: string) => void;
  toggleAutoProgress: () => void;
  // KORJAUS: Lisätty puuttuva funktio rajapintaan
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;
}

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

    set({
      activeAction: { skill: 'combat', resourceId: mapId.toString(), progress: 0, targetTime: 0 },
      enemy: newEnemy,
      combatStats: { 
        ...get().combatStats, 
        currentMapId: mapId, 
        enemyCurrentHp: map.enemyHp, 
        respawnTimer: 0,
        hp: get().combatStats.hp > 0 ? get().combatStats.hp : get().skills.hitpoints.level * 10
      }
    });
  },

  processCombatTick: () => {
    const currentState = get() as unknown as GameState;
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

  // KORJAUS: Lisätty funktion toteutus
  updateCombatSettings: (newSettings) => set((state) => ({
    combatSettings: { ...state.combatSettings, ...newSettings }
  })),

  addCombatLog: (message: string) => set({ 
    combatStats: { ...get().combatStats, combatLog: [message, ...get().combatStats.combatLog].slice(0, 20) }
  })
});