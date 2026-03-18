import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();

// Korvaa sk_test_... omalla avaimellasi
// Poistettu 'as any' - Stripe SDK tunnistaa version oikein
const stripe = new Stripe(
  "sk_test_51TCNYcJhesqfOWsgmTBWfBuFAgt2NP5zoSqHGIy0jFKaB2T7pVqtO7subYtBkn0PZ7GnhTZX3zYsLYpRRM71BTrQ006INeir4I",
); // Käyttää tilin oletusversiota

const STRIPE_WEBHOOK_SECRET = "whsec_CZzsQHkpBoxBmtEoxoarxL5VLGv7C1UI";

const GEM_PACKS: Record<
  string,
  { gems: number; priceEur: number; name: string }
> = {
  gems_400: { gems: 400, priceEur: 5, name: "Gem Pouch" },
  gems_1000: { gems: 1000, priceEur: 10, name: "Gem Chest" },
  gems_2500: { gems: 2500, priceEur: 20, name: "Gem Vault" },
};

export const createStripeCheckout = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

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
      // PÄIVITETTY: Ohjataan staattisiin sivuille pelin sijaan
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

export const stripeWebhook = onRequest({ cors: true }, async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: unknown) {
    // Korjattu: Käytetään tyyppivarmistusta 'any' sijaan
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
