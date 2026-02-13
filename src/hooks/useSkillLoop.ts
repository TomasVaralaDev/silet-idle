import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { processSkillTick } from '../systems/skillSystem';
import { getSpeedMultiplier } from '../utils/gameUtils';
import { GAME_DATA } from '../data'; // Lisätty import
import type { GameState, SkillType, Resource } from '../types';

export const useSkillLoop = () => {
  const setState = useGameStore((s) => s.setState);
  const activeAction = useGameStore((s) => s.activeAction);
  const upgrades = useGameStore((s) => s.upgrades);

  const actionSkill = activeAction?.skill;
  const actionResourceId = activeAction?.resourceId;

  useEffect(() => {
    if (!actionSkill || actionSkill === 'combat' || !actionResourceId) {
      return;
    }

    const skill = actionSkill as SkillType;
    
    // Etsitään resurssin oma intervalli datasta (esim. 3000ms)
    const resourceData = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
      (r: Resource) => r.id === actionResourceId
    );
    const baseInterval = resourceData?.interval || 3000;

    // Lasketaan lopullinen aika: pohja-aika / kerroin
    const speedMult = getSpeedMultiplier(skill, upgrades);
    
    // Turvaraja: ei koskaan alle 200ms, vaikka olisi mikä kerroin
    const intervalTime = Math.max(200, baseInterval / speedMult);

    const intervalId = window.setInterval(() => {
      setState((prev: GameState) => {
        const updates = processSkillTick(prev);
        return { ...prev, ...updates };
      });
    }, intervalTime);

    return () => {
      clearInterval(intervalId);
    };
    
  }, [actionSkill, actionResourceId, setState, upgrades]);
};