import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Ajetaan joka yö klo 00:00 UTC.
 * Poistettu käyttämätön parametri kokonaan ESLint-virheen välttämiseksi.
 */
export const scheduledShopReset = onSchedule("0 0 * * *", async () => {
  const now = Date.now();

  try {
    await admin.firestore().doc("global/status").set(
      {
        lastWorldShopReset: now,
      },
      { merge: true },
    );

    console.log(`Global shop reset triggered at: ${now}`);
  } catch (error) {
    console.error("Error resetting shop:", error);
  }
});
