import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();

// HUOM: Globaalit Stripe-alustukset on poistettu tästä.
// Ne on siirretty funktioiden sisään (Lazy Initialization),
// jotta deploy ei kaadu puuttuviin ympäristömuuttujiin.

const GEM_PACKS: Record<
  string,
  { gems: number; priceEur: number; name: string }
> = {
  gems_400: { gems: 400, priceEur: 5, name: "Gem Pouch" },
  gems_1000: { gems: 1000, priceEur: 10, name: "Gem Chest" },
  gems_2500: { gems: 2500, priceEur: 20, name: "Gem Vault" },
};

const MAX_EXPEDITION_SLOTS = 10;

// Kaupan sisältö ja hinnasto palvelimella (Turvallisuuden takia)
interface PremiumBundleConfig {
  priceGems: number;
  isOneTime?: boolean; // LISÄTTY
  rewardGems?: number; // Palautettavat gemit oston jälkeen
  stats?: {
    expeditionSlotsIncrement?: number; // Lisää tilaa nykyiseen
    queueSlotsSet?: number; // Asettaa tarkan määrän
    inventorySlots?: number; // Lisää tilaa nykyiseen
  };
  items?: Record<string, number>;
}

const PREMIUM_BUNDLES: Record<string, PremiumBundleConfig> = {
  bundle_starter: {
    priceGems: 800,
    rewardGems: 800, // Palauttaa heti rahat takaisin!
    stats: {
      expeditionSlotsIncrement: 2, // Antaa 2 lisäpaikkaa
      queueSlotsSet: 5, // Asettaa jonopaikat tasan viiteen
    },
    items: { scroll_enchant_4: 15 },
  },
  bundle_explorer_pack: {
    priceGems: 200,
    isOneTime: false,
    stats: { expeditionSlotsIncrement: 1 },
  },
  utility_bag_slot: {
    priceGems: 250,
    stats: { inventorySlots: 20 },
  },
  cosmetic_crown: {
    priceGems: 500,
    items: { cosmetic_crown: 1 },
  },
  bundle_legendary_runes: {
    priceGems: 800, // Aseta hinta esim. 3000 gemiä (Legendary-arvon mukaan)
    items: {
      rune_mining_speed_legendary: 1,
      rune_woodcutting_speed_legendary: 1,
      rune_foraging_speed_legendary: 1,
      rune_smithing_speed_legendary: 1,
      rune_crafting_speed_legendary: 1,
      rune_alchemy_speed_legendary: 1,
    },
  },
};

export const createStripeCheckout = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  // Alustetaan Stripe vasta kun funktiota oikeasti kutsutaan
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const { packId } = request.data;
  const pack = GEM_PACKS[packId];

  if (!pack) {
    throw new HttpsError("invalid-argument", "Invalid gem pack ID.");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: pack.name,
              description: `Purchase ${pack.gems} Gems`,
            },
            unit_amount: pack.priceEur * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: request.auth.uid,
        gemAmount: pack.gems.toString(),
        packId: packId,
      },
      // Ohjataan staattisiin sivuille pelin sijaan
      success_url: "http://localhost:5173/success.html",
      cancel_url: "http://localhost:5173/cancel.html",

      // Kun julkaiset (Production), vaihda nämä Hosting-osoitteisiisi:
      // success_url: "https://idle-a35ee.web.app/success.html",
      // cancel_url: "https://idle-a35ee.web.app/cancel.html",
    });

    return { url: session.url };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe Session Error:", message);
    throw new HttpsError("internal", message);
  }
});

// Turvallinen osto-funktio timanteille
export const purchasePremiumBundle = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in.");
  }

  const uid = request.auth.uid;
  const { bundleId } = request.data;
  const bundle = PREMIUM_BUNDLES[bundleId];

  if (!bundle) {
    throw new HttpsError(
      "invalid-argument",
      "Bundle not found in server config.",
    );
  }

  const userRef = admin.firestore().collection("users").doc(uid);

  try {
    await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new HttpsError("not-found", "User missing.");
      }

      const userData = userDoc.data() || {};
      const currentGems = userData.gems || 0;
      const upgrades = userData.upgrades || [];
      const currentExpeditionSlots = userData.scavenger?.unlockedSlots || 1;
      // Tarkistukset
      if (currentGems < bundle.priceGems) {
        throw new HttpsError("failed-precondition", "Not enough gems.");
      }
      if (bundle.isOneTime && upgrades.includes(bundleId)) {
        throw new HttpsError(
          "already-exists",
          "This bundle is limited to one purchase.",
        );
      }
      // 2. Kapasiteettitarkistus (Expedition Slots)
      if (bundle.stats?.expeditionSlotsIncrement) {
        if (
          currentExpeditionSlots + bundle.stats.expeditionSlotsIncrement >
          MAX_EXPEDITION_SLOTS
        ) {
          throw new HttpsError(
            "out-of-range",
            `Purchase failed. Max expedition slots is ${MAX_EXPEDITION_SLOTS}.`,
          );
        }
      }

      // Kootaan päivitykset (Tyyppivarmistettu)
      // Lasketaan uusi gem-saldo ottamalla huomioon sekä hinta että mahdolliset palautus-gemit
      const updates: Record<string, number | admin.firestore.FieldValue> = {
        gems: currentGems - bundle.priceGems + (bundle.rewardGems || 0),
        upgrades: admin.firestore.FieldValue.arrayUnion(bundleId),
      };

      // 1. Statsit
      if (bundle.stats?.expeditionSlotsIncrement) {
        updates["scavenger.unlockedSlots"] =
          admin.firestore.FieldValue.increment(
            bundle.stats.expeditionSlotsIncrement,
          );
      }

      // HUOM: Asetetaan suoraan tarkka arvo (esim. 5), ei käytetä incrementtiä
      if (bundle.stats?.queueSlotsSet) {
        updates["unlockedQueueSlots"] = bundle.stats.queueSlotsSet;
      }

      if (bundle.stats?.inventorySlots) {
        updates["maxInventorySlots"] = admin.firestore.FieldValue.increment(
          bundle.stats.inventorySlots,
        );
      }

      // 2. Itemit ja valuutat
      if (bundle.items) {
        for (const [itemId, amount] of Object.entries(bundle.items)) {
          if (itemId === "coins") {
            // Jos coins on tallennettu juuritasolle:
            updates["coins"] = admin.firestore.FieldValue.increment(
              Number(amount),
            );
          } else {
            // Normaalit tavarat inventoryyn
            updates[`inventory.${itemId}`] =
              admin.firestore.FieldValue.increment(Number(amount));
          }
        }
      }

      transaction.update(userRef, updates);
    });

    return { success: true, message: "Purchase successful!" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Transaction failed.";
    console.error("Purchase Error:", message);
    throw new HttpsError("internal", message);
  }
});

export const stripeWebhook = onRequest({ cors: true }, async (req, res) => {
  // Alustetaan Stripe vasta täällä
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook signature failed";
    console.error("Webhook Signature Error:", message);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const gemAmount = parseInt(session.metadata?.gemAmount || "0");

    if (userId && gemAmount > 0) {
      const userRef = admin.firestore().collection("users").doc(userId);

      try {
        await userRef.update({
          gems: admin.firestore.FieldValue.increment(gemAmount),
        });
        console.log(`✅ Added ${gemAmount} gems to user ${userId}`);
      } catch (error: unknown) {
        console.error(
          "Error updating user gems:",
          error instanceof Error ? error.message : error,
        );
      }
    }
  }

  res.json({ received: true });
});

export const scheduledShopReset = onSchedule("0 0 * * *", async () => {
  const now = Date.now();
  try {
    await admin
      .firestore()
      .doc("global/status")
      .set({ lastWorldShopReset: now }, { merge: true });
    console.log(`Global shop reset triggered at: ${now}`);
  } catch (error: unknown) {
    console.error(
      "Error resetting shop:",
      error instanceof Error ? error.message : error,
    );
  }
});
