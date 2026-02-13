import { useState, useEffect } from 'react';
import { useGameStore, DEFAULT_STATE } from '../store/useGameStore';
import { loadGameData } from '../services/gameService';
import { calculateOfflineProgress, type OfflineResults } from '../systems/offlineSystem';
import type { User } from 'firebase/auth';

export const useGameInitialization = (user: User | null) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [offlineSummary, setOfflineSummary] = useState<OfflineResults | null>(null);
  const setState = useGameStore((s) => s.setState);

  useEffect(() => {
    const initGame = async () => {
      if (!user) return;
      setIsDataLoaded(false);
      
      const loadedState = await loadGameData(user.uid);
      
      if (loadedState && loadedState.lastTimestamp) {
        const { newState, results } = calculateOfflineProgress(loadedState);
        if (results.secondsPassed > 60) {
          setState(newState);
          setOfflineSummary(results);
        } else {
          setState(loadedState);
        }
      } else {
        setState(loadedState || DEFAULT_STATE);
      }
      setIsDataLoaded(true);
    };

    initGame();
  }, [user, setState]);

  return { isDataLoaded, offlineSummary, setOfflineSummary };
};