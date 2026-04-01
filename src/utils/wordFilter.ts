// Importing the raw banned word dictionary
import enWordsRaw from "../../banWords/en.txt?raw";

const bannedWords = enWordsRaw
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => word.length > 0);

/**
 * wordFilter
 * Subsystem handling chat and username sanitization to maintain a safe environment.
 */
export const wordFilter = {
  /**
   * isProfane
   * Checks if an input string contains any blacklisted sequences.
   * Primarily used to block inappropriate username creation.
   *
   * @param text - The string to evaluate
   * @returns Boolean indicating if the text contains profanity
   */
  isProfane: (text: string): boolean => {
    const lowerInput = text.toLowerCase();
    return bannedWords.some((banned) => lowerInput.includes(banned));
  },

  /**
   * censor
   * Replaces offensive words with asterisk characters (*).
   * Ensures that regular words containing banned substrings are not accidentally censored.
   * Used heavily in processing the Global Chat feed.
   *
   * @param text - The raw chat message
   * @returns Cleaned string suitable for public display
   */
  censor: (text: string): string => {
    let filteredText = text;
    bannedWords.forEach((word) => {
      // The \b boundaries ensure we only match standalone whole words
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      filteredText = filteredText.replace(regex, "*".repeat(word.length));
    });
    return filteredText;
  },
};
