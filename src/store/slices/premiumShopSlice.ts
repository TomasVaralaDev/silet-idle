import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import type { PremiumShopItem } from "../../types";
import { getFunctions, httpsCallable } from "firebase/functions";

export interface PremiumShopSlice {
  buyPremiumItem: (item: PremiumShopItem) => Promise<boolean>;
  startGemsPurchase: (packId: string) => void;
}

/**
 * createPremiumShopSlice
 * Interfaces with the external Stripe payment provider via Firebase Cloud Functions.
 * Handles the secure deduction of premium currency (Gems) and the application of upgrades.
 */
export const createPremiumShopSlice: StateCreator<
  FullStoreState,
  [],
  [],
  PremiumShopSlice
> = (set, get) => ({
  buyPremiumItem: async (item: PremiumShopItem) => {
    const { gems, upgrades, premiumPurchases, emitEvent } = get();

    // 1. Soft local validation (prevents unnecessary cloud function calls)
    if (gems < item.priceGems) {
      emitEvent("error", "Not enough Gems!", "./assets/ui/icon_gem.png");
      return false;
    }

    // "Unique" meaning it is an infinitely persisting account upgrade (e.g., ad-free, slot expansions)
    if (item.isOneTime && upgrades.includes(item.id)) {
      emitEvent("warning", "Already owned!", item.icon);
      return false;
    }

    // Validate custom purchase limits (e.g., "max 5 per account")
    const currentPurchases = premiumPurchases?.[item.id] || 0;
    if (item.maxPurchases && currentPurchases >= item.maxPurchases) {
      emitEvent("warning", "Maximum purchase limit reached!", item.icon);
      return false;
    }

    try {
      emitEvent(
        "info",
        "Processing transaction...",
        "./assets/ui/icon_gem.png",
      );

      // Invoke the secure backend transaction logic
      const functions = getFunctions();
      const purchaseBundle = httpsCallable<
        { bundleId: string },
        { success: boolean; message: string }
      >(functions, "purchasePremiumBundle");

      const result = await purchaseBundle({ bundleId: item.id });

      // If backend confirms, update local store state immediately
      if (result.data.success) {
        emitEvent("success", `Acquired: ${item.name}`, item.icon);

        set((state) => {
          // Deduct gems and refund any bonus gems provided by the package
          const newGems =
            state.gems - item.priceGems + (item.rewards?.rewardGems || 0);

          const newUpgrades =
            item.isOneTime && !state.upgrades.includes(item.id)
              ? [...state.upgrades, item.id]
              : state.upgrades;

          const newInventory = { ...state.inventory };
          if (item.rewards?.items) {
            for (const [itemId, amount] of Object.entries(item.rewards.items)) {
              newInventory[itemId] = (newInventory[itemId] || 0) + amount;
            }
          }

          const newScavenger = { ...state.scavenger };
          if (item.rewards?.stats?.expeditionSlotsIncrement) {
            newScavenger.unlockedSlots =
              (newScavenger.unlockedSlots || 1) +
              item.rewards.stats.expeditionSlotsIncrement;
          }

          let newQueueSlots = state.unlockedQueueSlots;
          if (item.rewards?.stats?.queueSlotsSet) {
            newQueueSlots = item.rewards.stats.queueSlotsSet;
          }

          let newOfflineHoursIncrement = state.maxOfflineHoursIncrement || 0;
          if (item.rewards?.stats?.offlineHoursIncrement) {
            newOfflineHoursIncrement +=
              item.rewards.stats.offlineHoursIncrement;
          }

          const newPremiumPurchases = { ...(state.premiumPurchases || {}) };
          if (item.maxPurchases) {
            newPremiumPurchases[item.id] =
              (newPremiumPurchases[item.id] || 0) + 1;
          }

          return {
            gems: newGems,
            upgrades: newUpgrades,
            inventory: newInventory,
            scavenger: newScavenger,
            unlockedQueueSlots: newQueueSlots,
            premiumPurchases: newPremiumPurchases,
            maxOfflineHoursIncrement: newOfflineHoursIncrement,
          } as Partial<FullStoreState>;
        });

        return true;
      }

      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Transaction failed.";
      console.error("[PREMIUM SHOP] Purchase error:", error);
      emitEvent("error", message, "./assets/ui/icon_warning.png");
      return false;
    }
  },

  startGemsPurchase: async (packId: string) => {
    const { emitEvent } = get();

    // Check if the game is running within the Steam Electron wrapper
    const isSteam = typeof window !== "undefined" && "SteamApi" in window;

    if (isSteam) {
      emitEvent("info", `Initiating Steam Purchase for ${packId}...`);
      // Future Steam Overlay integration goes here
    } else {
      try {
        emitEvent(
          "info",
          "Preparing secure checkout...",
          "./assets/ui/icon_lock.png",
        );

        // Fetch a secure, one-time Stripe checkout URL from the backend
        const functions = getFunctions();
        const createStripeCheckout = httpsCallable<
          { packId: string },
          { url: string }
        >(functions, "createStripeCheckout");

        const result = await createStripeCheckout({ packId });
        const checkoutUrl = result.data.url;

        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank");
          emitEvent(
            "info",
            "Checkout opened in a new tab.",
            "./assets/ui/icon_external.png",
          );
        } else {
          throw new Error("No checkout URL received from server.");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Payment failed.";
        console.error("[STRIPE] Error:", error);
        emitEvent("error", message, "./assets/ui/icon_warning.png");
      }
    }
  },
});
