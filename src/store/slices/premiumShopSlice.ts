import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import type { PremiumShopItem } from "../../types";
import { getFunctions, httpsCallable } from "firebase/functions";

export interface PremiumShopSlice {
  buyPremiumItem: (item: PremiumShopItem) => Promise<boolean>;
  startGemsPurchase: (packId: string) => void;
}

export const createPremiumShopSlice: StateCreator<
  FullStoreState,
  [],
  [],
  PremiumShopSlice
> = (set, get) => ({
  /**
   * OSTAMINEN TIMANTEILLA (CLOUD FUNCTION)
   * Kutsuu Firebase backendia, joka vähentää timantit ja lisää palkinnot (itemit, statsit).
   */
  buyPremiumItem: async (item: PremiumShopItem) => {
    const { gems, upgrades, emitEvent } = get();

    if (gems < item.priceGems) {
      emitEvent("error", "Not enough Gems!", "/assets/ui/icon_gem.png");
      return false; // Palautetaan false virheen sattuessa
    }

    if (item.isOneTime && upgrades.includes(item.id)) {
      emitEvent("warning", "Already owned!", item.icon);
      return false; // Palautetaan false, jos tuote on jo omistettu
    }

    try {
      emitEvent("info", "Processing transaction...", "/assets/ui/icon_gem.png");

      const functions = getFunctions();
      const purchaseBundle = httpsCallable<
        { bundleId: string },
        { success: boolean; message: string }
      >(functions, "purchasePremiumBundle");

      // 1. Odotetaan serverin vahvistusta
      const result = await purchaseBundle({ bundleId: item.id });

      if (result.data.success) {
        emitEvent("success", `Acquired: ${item.name}`, item.icon);

        // 2. Päivitetään Zustand-store HETI onnistumisen jälkeen
        set((state) => {
          // Lasketaan uusi saldo (Hinta miinustetaan, rewardGems lisätään)
          const newGems =
            state.gems - item.priceGems + (item.rewards?.rewardGems || 0);

          const newUpgrades = item.isOneTime
            ? [...state.upgrades, item.id]
            : state.upgrades;

          // Lisätään tavarat lokaaliin inventoryyn
          const newInventory = { ...state.inventory };
          if (item.rewards?.items) {
            for (const [itemId, amount] of Object.entries(item.rewards.items)) {
              newInventory[itemId] = (newInventory[itemId] || 0) + amount;
            }
          }

          // Lisätään statsit lokaaliin tilaan (esim. expeditionSlotsIncrement)
          const newScavenger = { ...state.scavenger };
          if (item.rewards?.stats?.expeditionSlotsIncrement) {
            newScavenger.unlockedSlots =
              (newScavenger.unlockedSlots || 1) +
              item.rewards.stats.expeditionSlotsIncrement;
          }

          // Asetetaan jonopaikat suoraan tiettyyn arvoon (queueSlotsSet)
          let newQueueSlots = state.unlockedQueueSlots;
          if (item.rewards?.stats?.queueSlotsSet) {
            newQueueSlots = item.rewards.stats.queueSlotsSet;
          }

          return {
            gems: newGems,
            upgrades: newUpgrades,
            inventory: newInventory,
            scavenger: newScavenger,
            unlockedQueueSlots: newQueueSlots, // Päivitetään päätilaan
          };
        });

        return true; // Palautetaan true, jotta UI osaa avata modaalin!
      }

      return false; // Jos backend palautti success: false
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Transaction failed.";
      console.error("[PREMIUM SHOP] Purchase error:", error);
      emitEvent("error", message, "/assets/ui/icon_warning.png");

      return false; // Palautetaan false catch-lohkossa
    }
  },

  /**
   * TIMANTTIEN OSTAMINEN (STRIPE)
   * Kutsuu Firebase Cloud Functionia ja avaa maksun uuteen välilehteen.
   */
  startGemsPurchase: async (packId: string) => {
    const { emitEvent } = get();

    const isSteam =
      typeof (window as unknown as Record<string, unknown>).SteamApi !==
      "undefined";

    if (isSteam) {
      emitEvent("info", `Initiating Steam Purchase for ${packId}...`);
    } else {
      try {
        emitEvent(
          "info",
          "Preparing secure checkout...",
          "/assets/ui/icon_lock.png",
        );

        const functions = getFunctions();
        const createStripeCheckout = httpsCallable<
          { packId: string },
          { url: string }
        >(functions, "createStripeCheckout");

        const result = await createStripeCheckout({ packId });
        const checkoutUrl = result.data.url;

        if (checkoutUrl) {
          console.log("[STRIPE] Opening checkout in new tab:", checkoutUrl);
          window.open(checkoutUrl, "_blank");
          emitEvent(
            "info",
            "Checkout opened in a new tab.",
            "/assets/ui/icon_external.png",
          );
        } else {
          throw new Error("No checkout URL received from server.");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Payment initialization failed.";

        console.error("[STRIPE] Error:", error);
        emitEvent("error", message, "/assets/ui/icon_warning.png");
      }
    }
  },
});
