import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useGameStore, DEFAULT_STATE } from '../store/useGameStore';
import { calculateOfflineProgress } from '../systems/offlineSystem';
// Tuodaan tyyppinä verbatimModuleSyntaxia varten
import type { OfflineSummary } from '../systems/offlineSystem'; 
import type { GameState } from '../types';
import type { User } from 'firebase/auth';

export const useGameInitialization = (user: User | null) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [offlineSummary, setOfflineSummary] = useState<OfflineSummary | null>(null);
  const { setState } = useGameStore();

  useEffect(() => {
    const initializeGame = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const savedData = userDocSnap.data() as GameState;
          
          // KORJAUS: Käytetään lastTimestampia, koska se on GameState-tyypissäsi
          const lastSave = savedData.lastTimestamp || Date.now();
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - lastSave) / 1000);

          // Jos pelaaja on ollut poissa yli 60 sekuntia
          if (elapsedSeconds > 60) {
            const { updatedState, summary } = calculateOfflineProgress(savedData, elapsedSeconds);
            
            // Päivitetään peli ja tallennetaan yhteenveto modalille
            setState(updatedState);
            setOfflineSummary(summary);
          } else {
            setState(savedData);
          }
        } else {
          // Uusi pelaaja
          await setDoc(userDocRef, DEFAULT_STATE);
          setState(DEFAULT_STATE);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); 

  return { isDataLoaded, offlineSummary, setOfflineSummary };
};