import { describe, it, expect, vi } from 'vitest';
import { createScavengerSlice } from '../../src/store/slices/scavengerSlice';
import { DEFAULT_STATE } from '../../src/store/useGameStore';
import type { FullStoreState } from '../../src/store/useGameStore';

describe('ScavengerSlice: Expedition Logic', () => {
  
  const setupTestStore = (initialOverrides = {}) => {
    const state = {
      ...DEFAULT_STATE,
      ...initialOverrides,
      emitEvent: vi.fn(),
      openRewardModal: vi.fn(),
    } as unknown as FullStoreState;

    // Luodaan mockattu tila
    let capturedState = state;
    const set = vi.fn((updater) => {
      const next = typeof updater === 'function' ? updater(capturedState) : updater;
      capturedState = { ...capturedState, ...next };
    });
    const get = () => capturedState;

    // KORJAUS: Poistettu beforeEach, any-tyypit ja ylimääräinen argumentti (nyt tasan 3 arg)
    const slice = createScavengerSlice(set, get, {} as never);
    
    return { slice, get, set, state };
  };

  it('should start an expedition and consume a slot', () => {
    const { slice, get } = setupTestStore();
    
    slice.startExpedition(1, 60); // World 1, 60 min

    expect(get().scavenger.activeExpeditions.length).toBe(1);
    expect(get().scavenger.activeExpeditions[0].mapId).toBe(1);
    expect(get().scavenger.activeExpeditions[0].duration).toBe(60 * 60 * 1000);
  });

  it('should prevent starting more expeditions than unlocked slots', () => {
    const { slice, get } = setupTestStore({
      scavenger: { activeExpeditions: [], unlockedSlots: 1 }
    });

    slice.startExpedition(1, 10);
    slice.startExpedition(1, 10); // Tämän pitäisi epäonnistua

    expect(get().scavenger.activeExpeditions.length).toBe(1);
  });

  it('should NOT allow claiming an expedition before it is finished', () => {
    const { slice, get } = setupTestStore({
      scavenger: {
        activeExpeditions: [{
          id: 'test_exp',
          mapId: 1,
          startTime: Date.now(),
          duration: 1000 * 60 * 60 // 1 tunti
        }],
        unlockedSlots: 1
      }
    });

    slice.claimExpedition('test_exp');

    expect(get().scavenger.activeExpeditions.length).toBe(1);
  });

  it('should successfully claim rewards and update inventory after completion', () => {
    const twoHoursAgo = Date.now() - (1000 * 60 * 120);
    const { slice, get, state } = setupTestStore({
      inventory: { 'existing_item': 10 },
      scavenger: {
        activeExpeditions: [{
          id: 'ready_exp',
          mapId: 1,
          startTime: twoHoursAgo,
          duration: 1000 * 60 * 60 // 1 tunti
        }],
        unlockedSlots: 1
      }
    });

    slice.claimExpedition('ready_exp');

    const finalState = get();
    expect(finalState.scavenger.activeExpeditions.length).toBe(0);

    const inventoryKeys = Object.keys(finalState.inventory);
    expect(inventoryKeys.length).toBeGreaterThan(1);
    
    expect(state.openRewardModal).toHaveBeenCalled();
  });

  it('should remove expedition when cancelled', () => {
    const { slice, get } = setupTestStore({
      scavenger: {
        activeExpeditions: [{
          id: 'cancel_me',
          mapId: 1,
          startTime: Date.now(),
          duration: 1000 * 60
        }],
        unlockedSlots: 1
      }
    });

    slice.cancelExpedition('cancel_me');
    expect(get().scavenger.activeExpeditions.length).toBe(0);
  });
});