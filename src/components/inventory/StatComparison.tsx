// src/components/inventory/StatComparison.tsx
import { formatAttackSpeed } from "../../utils/formatUtils";

interface StatComparisonProps {
  label: string;
  newValue: number | undefined;
  oldValue: number | undefined;
  isSpeed?: boolean; // Nopeus on käänteinen: pienempi luku on parempi
  isMultiplier?: boolean; // Esim. Crit DMG (1.5x)
  isPercentage?: boolean; // Esim. Crit Chance (15%)
}

export default function StatComparison({
  label,
  newValue = 0,
  oldValue = 0,
  isSpeed = false,
  isMultiplier = false,
  isPercentage = false,
}: StatComparisonProps) {
  if (!newValue && !oldValue) return null; // Jos kummallakaan ei ole tätä statsia, ei näytetä mitään

  const diff = newValue - oldValue;

  // Logiikka väritykselle (nopeudessa miinus on vihreä!)
  const isPositiveChange = isSpeed ? diff < 0 : diff > 0;
  const isNegativeChange = isSpeed ? diff > 0 : diff < 0;

  let colorClass = "text-tx-muted"; // Ei muutosta
  let sign = "";

  if (isPositiveChange) {
    colorClass = "text-success";
    sign = "+";
  } else if (isNegativeChange) {
    colorClass = "text-danger";
    // diff on jo negatiivinen, joten emme tarvitse "sign" muuttujaa miinukselle
  }

  // Muotoilijat arvoille
  const formatValue = (val: number) => {
    if (isSpeed) return formatAttackSpeed(val);
    if (isMultiplier) return `${val.toFixed(1)}x`;
    if (isPercentage) return `${(val * 100).toFixed(0)}%`;
    return val > 0 && !isSpeed ? `+${val}` : `${val}`;
  };

  const formatDiff = (val: number) => {
    if (isSpeed) return `${val > 0 ? "+" : ""}${(val / 1000).toFixed(1)}s`;
    if (isMultiplier) return `${sign}${val.toFixed(1)}`;
    if (isPercentage) return `${sign}${(val * 100).toFixed(0)}%`;
    return `${sign}${val}`;
  };

  return (
    <div className="bg-app-base px-3 py-2 rounded border border-border flex justify-between items-center text-xs group">
      <span className="text-tx-muted font-bold uppercase text-[10px]">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {/* Uusi arvo (aina näkyvissä) */}
        <span className="font-mono font-bold text-tx-main">
          {formatValue(newValue)}
        </span>

        {/* Vain jos arvo on muuttunut, näytetään ero */}
        {diff !== 0 && (
          <span
            className={`font-mono font-bold text-[10px] ${colorClass} bg-panel px-1.5 py-0.5 rounded opacity-80 group-hover:opacity-100 transition-opacity`}
          >
            ({formatDiff(diff)})
          </span>
        )}
      </div>
    </div>
  );
}
