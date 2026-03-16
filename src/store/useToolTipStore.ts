import { create } from "zustand";

interface TooltipState {
  itemId: string | null;
  x: number;
  y: number;
  showTooltip: (itemId: string, x: number, y: number) => void;
  hideTooltip: () => void;
}

export const useTooltipStore = create<TooltipState>((set) => ({
  itemId: null,
  x: 0,
  y: 0,
  showTooltip: (itemId, x, y) => set({ itemId, x, y }),
  hideTooltip: () => set({ itemId: null }),
}));
