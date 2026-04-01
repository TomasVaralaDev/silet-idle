import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { processSkillTick } from "../systems/skillSystem";
import { getSpeedMultiplier } from "../utils/gameUtils";
import { GAME_DATA } from "../data";
import type { GameState, SkillType, Resource } from "../types";

/**
 * useSkillLoop Hook
 * A deprecated/alternative hook for processing skill actions.
 * NOTE: The primary implementation has been merged into useGameEngine.ts.
 * This remains as an architectural reference or for isolated testing.
 */
export const useSkillLoop = () => {
  const setState = useGameStore((s) => s.setState);
  const activeAction = useGameStore((s) => s.activeAction);
  const upgrades = useGameStore((s) => s.upgrades);

  const actionSkill = activeAction?.skill;
  const actionResourceId = activeAction?.resourceId;

  useEffect(() => {
    // Ignore if idle or if the action belongs to the combat subsystem
    if (!actionSkill || actionSkill === "combat" || !actionResourceId) {
      return;
    }

    const skill = actionSkill as SkillType;
    const resourceData = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
      (r: Resource) => r.id === actionResourceId,
    );

    // Calculate final action interval using speed modifiers
    const baseInterval = resourceData?.interval || 3000;
    const speedMult = getSpeedMultiplier(skill, upgrades);
    const intervalTime = Math.max(200, baseInterval / speedMult);

    const intervalId = window.setInterval(() => {
      setState((prev: GameState) => {
        // Execute a single completion tick
        const updates = processSkillTick(prev, intervalTime);
        return { ...prev, ...updates };
      });
    }, intervalTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [actionSkill, actionResourceId, setState, upgrades]);
};
