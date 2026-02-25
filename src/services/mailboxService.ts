import { db } from "../firebase";
// 1. KORJAUS: Poistettu 'where', koska sitä ei käytetä.
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
// 2. KORJAUS: Lisätty 'type' -sana importtiin.
import type { MailMessage } from "../types";

export const MailboxService = {
  // Hae lunastamattomat viestit
  async getMessages(userId: string): Promise<MailMessage[]> {
    try {
      const mailboxRef = collection(db, "users", userId, "mailbox");
      const q = query(mailboxRef);
      const snapshot = await getDocs(q);

      return snapshot.docs
        .map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as MailMessage)
        )
        .sort((a, b) => b.timestamp - a.timestamp); // Uusimmat ensin
    } catch (error) {
      console.error("Error fetching mail:", error);
      return [];
    }
  },

  // Poista viesti pysyvästi (lunastuksen jälkeen)
  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const msgRef = doc(db, "users", userId, "mailbox", messageId);
    await deleteDoc(msgRef);
  },
};
