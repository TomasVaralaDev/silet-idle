import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import { DEFAULT_STATE } from "../useGameStore";
import { GAME_DATA } from "../../data";
import { getSpeedMultiplier } from "../../utils/gameUtils";
import type {
  SkillType,
  Resource,
  Ingredient,
  SkillData,
  ActiveAction,
  QueueItem,
} from "../../types";

export interface SkillSlice {
  skills: Record<SkillType, SkillData>;
  activeAction: ActiveAction | null;
  queue: QueueItem[];
  toggleAction: (skill: SkillType, resourceId: string) => void;
  addToQueue: (skill: SkillType, resourceId: string, amount: number) => void;
  removeFromQueue: (queueId: string) => void;
  cancelResourceFromQueue: (resourceId: string) => void; // UUSI FUNKTIO
  clearQueue: () => void;
}

export const createSkillSlice: StateCreator<
  FullStoreState,
  [],
  [],
  SkillSlice
> = (set) => ({
  skills: DEFAULT_STATE.skills,
  activeAction: DEFAULT_STATE.activeAction,
  queue: DEFAULT_STATE.queue,

  toggleAction: (skill, resourceId) =>
    set((state: FullStoreState) => {
      if (state.activeAction?.resourceId === resourceId) {
        return { activeAction: null };
      }

      const resource = GAME_DATA[skill as keyof typeof GAME_DATA]?.find(
        (r: Resource) => r.id === resourceId,
      );

      if (!resource) return {};

      if (resource.inputs) {
        const canAfford = resource.inputs.every(
          (req: Ingredient) => (state.inventory[req.id] || 0) >= req.count,
        );

        if (!canAfford) {
          state.emitEvent(
            "warning",
            `Missing materials for ${resource.name}`,
            "./assets/ui/icon_warning.png",
          );
          return {};
        }
      }

      const speedMult = getSpeedMultiplier(skill, state.upgrades);
      const baseInterval = resource.interval || 3000;
      const finalTargetTime = Math.max(200, baseInterval / speedMult);

      return {
        activeAction: {
          skill,
          resourceId,
          progress: 0,
          targetTime: finalTargetTime,
        },
      } as Partial<FullStoreState>;
    }),

  addToQueue: (skill, resourceId, amount) =>
    set((state) => {
      const maxSlots = state.unlockedQueueSlots;

      if (state.queue.length >= maxSlots) {
        state.emitEvent(
          "error",
          `Queue full! You only have ${maxSlots} slots available.`,
          "./assets/ui/icon_warning.png",
        );
        return {};
      }

      const newItem: QueueItem = {
        id: Math.random().toString(36).substring(2, 9),
        skill,
        resourceId,
        amount,
        completed: 0,
      };
      return { queue: [...state.queue, newItem] };
    }),

  removeFromQueue: (queueId) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== queueId),
    })),

  // UUSI FUNKTIO: Poistaa kaikki tietyt resurssit jonosta kerralla
  cancelResourceFromQueue: (resourceId) =>
    set((state) => {
      const newQueue = state.queue.filter(
        (item) => item.resourceId !== resourceId,
      );

      // Jos aktiivinen toiminto on tämä poistettava resurssi, nollataan myös se
      const newActiveAction =
        state.activeAction?.resourceId === resourceId
          ? null
          : state.activeAction;

      return {
        queue: newQueue,
        activeAction: newActiveAction,
      };
    }),

  clearQueue: () => set({ queue: [] }),
});
