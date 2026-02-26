import { describe, it, expect } from 'vitest';
import { processCombatTick } from '../../src/systems/combatSystem';
import type { GameState } from '../../src/types';

describe('CombatSystem: Battle & Death Logic', () => {

  // Apufunktio, joka luo pelin alkutilan testiä varten
  const getMockState = (hp: number): GameState => ({
    combatStats: { 
      hp, 
      currentMapId: 1, // Combat map ID 1 (Greenvale Plains)
      enemyCurrentHp: 100, 
      respawnTimer: 0, 
      combatLog: [],
      cooldownUntil: 0,
      maxMapCompleted: 0,
      foodTimer: 0,
      attackTimer: 0 // Varmistetaan ettei attackTimer blokkaa iskua
    },
    activeAction: { skill: 'combat', resourceId: '1', progress: 0, targetTime: 0 },
    skills: { 
      hitpoints: { level: 10, xp: 0 },
      attack: { level: 1, xp: 0 },
      defense: { level: 1, xp: 0 },
      melee: { level: 1, xp: 0 },
    },
    inventory: {},
    equipment: { weapon: null, shield: null, body: null, head: null, legs: null, necklace: null, ring: null, rune: null, skill: null },
    equippedFood: null,
    combatSettings: { autoEatThreshold: 0, autoProgress: false },
    upgrades: [],
  } as unknown as GameState); // Käytetään as unknown as, koska emme mockaa KAIKKIA sliceja kuten sosiaalista mediaa

  it('should apply 60 second cooldown when player dies', () => {
    // 1. Luodaan tila, jossa pelaajalla on 1 HP (hän kuolee taatusti seuraavasta iskusta)
    const state = getMockState(1);

    // 2. Ajetaan combat tick (100ms)
    // Koska pelaaja on heikko ja vihollinen elossa, vihollinen lyö ja tappaa pelaajan.
    const updates = processCombatTick(state, 100);

    // 3. Tarkistetaan tulokset
    // Toiminnon pitäisi keskeytyä (null)
    expect(updates.activeAction).toBeNull();
    // Vihollisen pitäisi kadota
    expect(updates.enemy).toBeNull();
    // Cooldownin pitäisi olla tulevaisuudessa (noin 60 000 ms päässä)
    expect(updates.combatStats?.cooldownUntil).toBeGreaterThan(Date.now() + 59000);
    // HP:n pitäisi olla 0
    expect(updates.combatStats?.hp).toBe(0);
  });

  it('should not process combat if activeAction is not combat', () => {
    const state = getMockState(100);
    state.activeAction = { skill: 'woodcutting', resourceId: '1', progress: 0, targetTime: 1000 };
    
    const updates = processCombatTick(state, 100);
    // Koska ei olla taistelussa, funktion pitäisi palauttaa tyhjä objekti
    expect(Object.keys(updates).length).toBe(0);
  });

});