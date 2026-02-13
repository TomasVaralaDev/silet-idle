import type { StateCreator } from 'zustand';
import type { FullStoreState } from '../useGameStore';
import { DEFAULT_STATE } from '../useGameStore';
import { COMBAT_DATA } from '../../data';
import { getEnemyStats } from '../../utils/combatMechanics';
import type { CombatState, CombatSettings } from '../../types';

export interface CombatSlice {
  combatStats: CombatState;
  combatSettings: CombatSettings;
  updateCombatSettings: (settings: Partial<CombatSettings>) => void;
  toggleAutoProgress: () => void;
  startCombat: (mapId: number) => void;
  stopCombat: () => void;
}

export const createCombatSlice: StateCreator<FullStoreState, [], [], CombatSlice> = (set) => ({
  combatStats: DEFAULT_STATE.combatStats,
  combatSettings: DEFAULT_STATE.combatSettings,

  updateCombatSettings: (settings) => set((state: FullStoreState) => ({
    combatSettings: { ...state.combatSettings, ...settings }
  })),

  toggleAutoProgress: () => set((state: FullStoreState) => ({
    combatSettings: { ...state.combatSettings, autoProgress: !state.combatSettings.autoProgress }
  })),

  startCombat: (mapId) => set((state: FullStoreState) => {
    const map = COMBAT_DATA.find(m => m.id === mapId);
    if (!map) return {};
    
    // KORJAUS: Käytetään emitEventiä notification-olion sijaan
    if (map.keyRequired && (state.inventory[map.keyRequired] || 0) <= 0) {
      state.emitEvent('warning', `Access Denied: Requires ${map.keyRequired}`, "/assets/items/bosskey/bosskey_w1.png");
      return {};
    }

    const enemyStats = getEnemyStats({ hp: map.enemyHp, attack: map.enemyAttack }, map.id);
    
    // KORJAUS: Lisätty progress ja targetTime ActiveAction-tyyppiin sopivaksi
    return {
      activeAction: { 
        skill: 'combat', 
        resourceId: mapId.toString(),
        progress: 0,
        targetTime: 0 // Combat ei käytä tätä, mutta tyyppi vaatii sen
      },
      combatStats: { 
        ...state.combatStats, 
        currentMapId: mapId, 
        enemyCurrentHp: enemyStats.hp, 
        hp: state.combatStats.hp > 0 ? state.combatStats.hp : (state.skills.hitpoints.level * 10), 
        respawnTimer: 0, 
        foodTimer: 0, 
        combatLog: [] 
      }
    } as Partial<FullStoreState>;
  }),

  stopCombat: () => set(() => ({
    activeAction: null,
    combatStats: { ...DEFAULT_STATE.combatStats, currentMapId: null }
  })),
});