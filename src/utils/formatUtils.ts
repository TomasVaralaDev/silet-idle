// src/utils/formatUtils.ts

/**
 * Muotoilee suuret luvut luettavaan muotoon (k, M, B, T...) 
 * tai tieteelliseen muotoon eXX jos luku on massiivinen.
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();

  const suffixes = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];

  // Jos luku on yli 1000 biljoonaa (Quadrillion), käytetään tieteellistä muotoa
  if (num >= 1e15) {
    return num.toExponential(2).replace("+", "");
  }

  const suffix = suffixes.find((s) => num >= s.value);
  
  if (suffix) {
    const formatted = (num / suffix.value).toFixed(1);
    // Poistetaan turha .0 lopusta (esim 10.0k -> 10k)
    return formatted.endsWith(".0") 
      ? formatted.slice(0, -2) + suffix.symbol 
      : formatted + suffix.symbol;
  }

  return Math.floor(num).toString();
};