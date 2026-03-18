import type { StateCreator } from "zustand";
import type { FullStoreState } from "../useGameStore";
import type { PremiumShopItem } from "../../types";
import { getFunctions, httpsCallable } from "firebase/functions";

export interface PremiumShopSlice {
  buyPremiumItem: (item: PremiumShopItem) => void;
  startGemsPurchase: (packId: string) => void;
}

export const createPremiumShopSlice: StateCreator<
  FullStoreState,
  [],
  [],
  PremiumShopSlice
> = (set, get) => ({
  /**
   * OSTAMINEN TIMANTEILLA
   * Käytetään pelin sisäisiä timantteja päivitysten ostamiseen.
   */
  buyPremiumItem: (item: PremiumShopItem) => {
    const { gems, upgrades, emitEvent } = get();

    if (gems < item.priceGems) {
      emitEvent("error", "Not enough Gems!", "/assets/ui/icon_gem.png");
      return;
    }

    if (item.isOneTime && upgrades.includes(item.id)) {
      emitEvent("warning", "Already owned!", item.icon);
      return;
    }

    set((state) => ({
      gems: state.gems - item.priceGems,
      upgrades: item.isOneTime ? [...state.upgrades, item.id] : state.upgrades,
    }));

    emitEvent("success", `Unlocked: ${item.name}`, item.icon);
  },

  /**
   * TIMANTTIEN OSTAMINEN (STRIPE)
   * Kutsuu Firebase Cloud Functionia ja avaa maksun uuteen välilehteen.
   */
  startGemsPurchase: async (packId: string) => {
    const { emitEvent } = get();

    // Tarkistetaan onko kyseessä Steam-ympäristö (tulevaisuutta varten)
    const isSteam =
      typeof (window as unknown as Record<string, unknown>).SteamApi !==
      "undefined";

    if (isSteam) {
      emitEvent("info", `Initiating Steam Purchase for ${packId}...`);
      // Steam-integraatio tulisi tähän
    } else {
      try {
        emitEvent(
          "info",
          "Preparing secure checkout...",
          "/assets/ui/icon_lock.png",
        );

        // 1. Alustetaan Firebase Functions yhteys
        const functions = getFunctions();
        const createStripeCheckout = httpsCallable<
          { packId: string },
          { url: string }
        >(functions, "createStripeCheckout");

        // 2. Kutsutaan backendin funktiota
        const result = await createStripeCheckout({ packId });
        const checkoutUrl = result.data.url;

        if (checkoutUrl) {
          console.log("[STRIPE] Opening checkout in new tab:", checkoutUrl);

          // 3. AVATAAN UUSI VÄLILEHTI
          // '_blank' varmistaa, että peli ei sammu taustalla
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
        // Virheen käsittely ilman 'any'-tyyppiä
        const message =
          error instanceof Error
            ? error.message
            : "Payment initialization failed.";

        console.error("[STRIPE] Error:", error);
        emitEvent("error", message, "/assets/ui/icon_error.png");
      }
    }
  },
});
