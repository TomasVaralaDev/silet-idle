/**
 * formatNumber
 * Converts large integers into human-readable shorthand (k, M, B, T).
 * E.g., 1500000 -> "1.5M"
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();

  const suffixes = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];

  // Fallback to scientific notation for numbers beyond Trillions
  if (num >= 1e15) {
    return num.toExponential(2).replace("+", "");
  }

  const suffix = suffixes.find((s) => num >= s.value);

  if (suffix) {
    const formatted = (num / suffix.value).toFixed(1);
    // Remove trailing ".0" for cleaner UI
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + suffix.symbol
      : formatted + suffix.symbol;
  }

  return Math.floor(num).toString();
};

/**
 * formatAttackSpeed
 * Converts raw millisecond intervals into readable seconds.
 * E.g., 2400 -> "2.4s"
 */
export const formatAttackSpeed = (ms: number | undefined): string => {
  if (!ms) return "0s";
  return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * formatRemainingTime
 * Formats a millisecond duration into a clean, hierarchical string (h/m/s).
 * Adapts formatting based on the remaining duration length.
 */
export const formatRemainingTime = (ms: number): string => {
  if (ms <= 0) return "Ready";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};
