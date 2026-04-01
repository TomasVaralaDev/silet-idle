export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

/**
 * Global styling configuration for Item Rarities.
 * Centralized mapping to ensure UI consistency across tooltips, inventory grids, and modals.
 */
export const RARITY_STYLES: Record<
  Rarity,
  {
    text: string;
    border: string;
    bg: string;
    shadow: string;
    glow: string;
    lightBg: string;
  }
> = {
  common: {
    text: "text-slate-300",
    border: "border-slate-700",
    bg: "bg-slate-900",
    shadow: "",
    glow: "shadow-none",
    lightBg: "bg-panel-hover",
  },
  uncommon: {
    text: "text-emerald-400",
    border: "border-emerald-700",
    bg: "bg-emerald-950/30",
    shadow: "shadow-emerald-900/10",
    glow: "shadow-emerald-500/20",
    lightBg: "bg-emerald-500/10",
  },
  rare: {
    text: "text-cyan-400",
    border: "border-cyan-700",
    bg: "bg-cyan-950/30",
    shadow: "shadow-cyan-900/20",
    glow: "shadow-cyan-500/20",
    lightBg: "bg-cyan-500/10",
  },
  epic: {
    text: "text-purple-400",
    border: "border-purple-600",
    bg: "bg-purple-950/30",
    shadow: "shadow-purple-900/20",
    glow: "shadow-purple-500/20",
    lightBg: "bg-purple-500/10",
  },
  legendary: {
    text: "text-orange-400",
    border: "border-orange-500",
    bg: "bg-orange-950/40",
    shadow: "shadow-orange-900/30",
    glow: "shadow-orange-500/20",
    lightBg: "bg-orange-500/10",
  },
};

// Safety wrapper to prevent UI crashes if an item lacks a defined rarity
export const getRarityStyle = (rarity?: string) => {
  const key = (rarity || "common") as Rarity;
  return RARITY_STYLES[key] || RARITY_STYLES.common;
};
