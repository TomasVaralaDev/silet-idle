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
  useEffect(() => { stateRef.current = state; }, [state]);

  const handleForceSave = useCallback(async () => {
    if (!user || !isDataLoaded) return;
    setSaveStatus('saving');
    
    const now = Date.now();
    setState((prev: GameState) => ({ ...prev, lastTimestamp: now }));

    const currentState = {
      ...JSON.parse(JSON.stringify(stateRef.current)),
      lastTimestamp: now
    }; 
    
    const success = await saveGameData(user.uid, currentState);
    setSaveStatus(success ? 'saved' : 'error');
    if (success) setTimeout(() => setSaveStatus('idle'), 2000);
  }, [user, isDataLoaded, setState]);

  useEffect(() => {
    if (!user || !isDataLoaded) return;
    
    const autoSaveInterval = setInterval(() => handleForceSave(), 300000); // 5 min
    const timestampInterval = setInterval(() => {
      setState((prev: GameState) => ({ ...prev, lastTimestamp: Date.now() }));
    }, 30000); // 30s

    return () => {
      clearInterval(autoSaveInterval);
      clearInterval(timestampInterval);
    };
  }, [user, isDataLoaded, handleForceSave, setState]);

  return { saveStatus, handleForceSave };
};