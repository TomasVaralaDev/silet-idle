import { db } from "../firebase";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import type { MailMessage } from "../types";

/**
 * MailboxService
 * Handles the retrieval and deletion of system messages and market payouts
 * delivered to the user's private mailbox subcollection.
 */
export const MailboxService = {
  /**
   * getMessages
   * Fetches all unread mail for the specified user, sorted newest first.
   *
   * @param userId - The Firebase UID of the player
   * @returns Promise resolving to an array of MailMessage objects
   */
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
            }) as MailMessage,
        )
        .sort((a, b) => b.timestamp - a.timestamp); // Sort descending
    } catch (error) {
      console.error("Error fetching mail:", error);
      return [];
    }
  },

  /**
   * deleteMessage
   * Permanently removes a message from the Firestore subcollection.
   * Called automatically after the user claims attached rewards.
   *
   * @param userId - The Firebase UID of the player
   * @param messageId - The specific document ID of the mail piece
   */
  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const msgRef = doc(db, "users", userId, "mailbox", messageId);
    await deleteDoc(msgRef);
  },
};
