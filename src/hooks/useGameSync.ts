import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { saveGameData } from '../services/gameService';
import type { User } from 'firebase/auth';
import type { GameState } from '../types';

export const useGameSync = (user: User | null, isDataLoaded: boolean) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const state = useGameStore();
  const setState = useGameStore((s) => s.setState);
  
  const stateRef = useRef(state);
  useEffect(() => { 
    stateRef.current = state; 
  }, [state]);

  const handleForceSave = useCallback(async () => {
    if (!user || !isDataLoaded) return;
    
    setSaveStatus('saving');
    const now = Date.now();

    // Päivitetään aikaleima heti
    setState((prev: GameState) => ({ ...prev, lastTimestamp: now }));

    const currentState = {
      ...JSON.parse(JSON.stringify(stateRef.current)),
      lastTimestamp: now
    }; 
    
    const success = await saveGameData(user.uid, currentState);
    
    setSaveStatus(success ? 'saved' : 'error');
    if (success) {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [user, isDataLoaded, setState]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;

    // "pagehide" on usein luotettavampi kuin "beforeunload" nykyisissä selaimissa (erityisesti mobiili/Safari)
    const handleExit = () => {
      // Huom: async-kutsua ei voida "odottaa" tässä, mutta 
      // triggeröiminen antaa selaimelle mahdollisuuden viedä pyyntö loppuun.
      handleForceSave();
    };

    // Myös "visibilitychange" auttaa tallentamaan, kun vaihdat välilehteä
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        handleForceSave();
      }
    };

    window.addEventListener('beforeunload', handleExit);
    window.addEventListener('pagehide', handleExit);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleExit);
      window.removeEventListener('pagehide', handleExit);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user, isDataLoaded, handleForceSave]);

  // TIHENNÄTÄÄN AUTOMAATTISTA TALLENNUSTA
  useEffect(() => {
    if (!user || !isDataLoaded) return;
    
    // Tallennetaan 2 minuutin välein (aiemman 5 min sijaan)
    const autoSaveInterval = setInterval(() => {
      handleForceSave();
    }, 120000); 

    // Päivitetään aikaleima 10 sekunnin välein (aiemman 30s sijaan)
    // Tämä varmistaa, että vaikka F5 tapahtuisi, offline-laskenta on tarkka
    const timestampInterval = setInterval(() => {
      setState((prev: GameState) => ({ ...prev, lastTimestamp: Date.now() }));
    }, 10000);

    return () => {
      clearInterval(autoSaveInterval);
      clearInterval(timestampInterval);
    };
  }, [user, isDataLoaded, handleForceSave, setState]);

  return { saveStatus, handleForceSave };
};