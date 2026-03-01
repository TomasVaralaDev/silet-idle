// src/utils/formatUtils.ts

/**
 * Muotoilee suuret luvut luettavaan muotoon (k, M, B, T...)
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();

  const suffixes = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];

  if (num >= 1e15) {
    return num.toExponential(2).replace("+", "");
  }

  const suffix = suffixes.find((s) => num >= s.value);

  if (suffix) {
    const formatted = (num / suffix.value).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + suffix.symbol
      : formatted + suffix.symbol;
  }

  return Math.floor(num).toString();
};

/**
 * Muotoilee taistelun hyökkäysnopeuden millisekunneista sekunneiksi.
 * Esim. 2400 -> "2.4s"
 */
export const formatAttackSpeed = (ms: number | undefined): string => {
  if (!ms) return "0s";
  return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * Muotoilee jäljellä olevan ajan:
 * - Yli 1h: "Xh Ym"
 * - Alle 1h: "Xm Ys"
 */
export const formatRemainingTime = (ms: number): string => {
  if (ms <= 0) return "Ready!";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    // Näytetään tunnit ja minuutit
    return `${hours}h ${minutes}m`;
  }

  // Näytetään minuutit ja sekunnit
  return `${minutes}m ${seconds}s`;
};
