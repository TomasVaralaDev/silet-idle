import type { Resource } from "../types";

export const MAX_LEVEL = 99;

/**
 * calculateResourceXp
 * Dictates the base XP granted by an action.
 * Scales upward so higher-tier actions yield better progression.
 * Formula: 10 + (Level * 1.5)
 */
export const calculateResourceXp = (level: number): number => {
  return Math.floor(10 + level * 1.5);
};

/**
 * calculateResourceInterval
 * Determines how long an action takes to complete (in milliseconds) before multipliers are applied.
 * Formula: 3000ms + (Level * 100ms)
 */
export const calculateResourceInterval = (level: number): number => {
  return Math.floor(3000 + level * 100);
};

/**
 * calculateResourceValue
 * Computes the baseline monetary value of an item for marketplace or vendor trades.
 * Formula: 1 + (Level^1.2)
 */
export const calculateResourceValue = (level: number): number => {
  return Math.floor(1 + Math.pow(level, 1.2));
};

/**
 * autoScaleResource
 * Utility to programmatically populate missing properties on a resource definition
 * based on its assigned level, preventing the need to manually hardcode redundant stats.
 */
export const autoScaleResource = (resource: Resource): Resource => {
  const level = resource.level || 1;
  return {
    ...resource,
    xpReward: resource.xpReward ?? calculateResourceXp(level),
    interval: resource.interval ?? calculateResourceInterval(level),
    value: resource.value ?? calculateResourceValue(level),
  };
};
