// src/utils/rarity.ts

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

// Määritellään värit (Tailwind luokat)
export const RARITY_STYLES: Record<Rarity, { text: string; border: string; bg: string; shadow: string }> = {
  common: {
    text: 'text-slate-300',
    border: 'border-slate-800',
    bg: 'bg-slate-900',
    shadow: ''
  },
  uncommon: {
    text: 'text-green-400',
    border: 'border-green-800',
    bg: 'bg-green-950/30',
    shadow: 'shadow-green-900/10'
  },
  rare: {
    text: 'text-blue-400',
    border: 'border-blue-700',
    bg: 'bg-blue-950/30',
    shadow: 'shadow-blue-900/20'
  },
  legendary: {
    text: 'text-amber-400',
    border: 'border-amber-600',
    bg: 'bg-amber-950/40',
    shadow: 'shadow-amber-900/30'
  }
};

// Apufunktio tyylien hakemiseen (oletuksena common)
export const getRarityStyle = (rarity?: string) => {
  const key = (rarity || 'common') as Rarity;
  return RARITY_STYLES[key] || RARITY_STYLES.common;
};