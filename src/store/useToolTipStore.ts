import { create } from "zustand";

interface TooltipState {
  itemId: string | null;
  x: number;
  y: number;
  showTooltip: (itemId: string, x: number, y: number) => void;
  hideTooltip: () => void;
}

/**
 * useTooltipStore
 * An independent, lightweight Zustand store specifically managing the highly volatile
 * X/Y screen coordinates of the mouse-following UI tooltips.
 * Kept separate from the main GameStore to prevent heavy re-renders across the app.
 */
export const useTooltipStore = create<TooltipState>((set) => ({
  itemId: null,
  x: 0,
  y: 0,
  showTooltip: (itemId, x, y) => set({ itemId, x, y }),
  hideTooltip: () => set({ itemId: null }),
}));
