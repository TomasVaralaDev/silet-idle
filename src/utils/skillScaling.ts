// src/utils/skillScaling.ts

import type { Resource } from '../types';

/**
 * Laskee resurssin perus-XP:n sen vaatiman tason perusteella.
 * Tavoite: Kun tason nousu hidastuu (40 * L^2), resurssien antama XP kasvaa.
 * Kaava: 10 + (Level * 1.5) -> Lvl 1 = 11 XP | Lvl 50 = 85 XP | Lvl 99 = 158 XP
 */
export const calculateResourceXp = (level: number): number => {
  return Math.floor(10 + (level * 1.5));
};

/**
 * Laskee toiminnon oletusajan (ms) tason perusteella.
 * Kaava: 3000ms + (Level * 100ms) -> Lvl 1 = 3.1s | Lvl 99 = ~13s
 */
export const calculateResourceInterval = (level: number): number => {
  return Math.floor(3000 + (level * 100));
};

/**
 * Laskee raaka-aineen oletusarvon (myyntihinta) tason perusteella.
 * Kaava: 1 + (Level^1.2) -> Lvl 1 = 2g | Lvl 50 = ~110g | Lvl 99 = ~249g
 */
export const calculateResourceValue = (level: number): number => {
  return Math.floor(1 + Math.pow(level, 1.2));
};

/**
 * APUFUNKTIO: Automaattisesti täyttää puuttuvat statsit resurssille sen tason perusteella.
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