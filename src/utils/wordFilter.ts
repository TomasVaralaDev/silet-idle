// src/utils/wordFilter.ts

// Tuodaan lista. Jos käytät Viteä, voit käyttää ?raw importtia.
// Jos tiedosto on public-kansiossa, se pitäisi ladata asyncronisesti.
// Tässä esimerkissä oletetaan, että lista on tuotu koodiin:
import enWordsRaw from "../../banWords/en.txt?raw";

const bannedWords = enWordsRaw
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => word.length > 0);

export const wordFilter = {
  /**
   * Tarkistaa sisältääkö teksti kiellettyjä sanoja.
   * Palauttaa true, jos teksti on kielletty.
   */
  isProfane: (text: string): boolean => {
    const lowerInput = text.toLowerCase();
    // Tarkistetaan sisältääkö syöte jonkin kielletyn sanan
    return bannedWords.some((banned) => lowerInput.includes(banned));
  },

  /**
   * Vaihtaa kielletyt sanat tähdiksi.
   * Käytettäväksi myöhemmin chatissa.
   */
  censor: (text: string): string => {
    let filteredText = text;
    bannedWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi"); // \b hakee vain kokonaisia sanoja
      filteredText = filteredText.replace(regex, "*".repeat(word.length));
    });
    return filteredText;
  },
};
