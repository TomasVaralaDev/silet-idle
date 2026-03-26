import { formatAttackSpeed } from "../../utils/formatUtils";

interface StatComparisonProps {
  label: string;
  newValue: number | undefined;
  oldValue: number | undefined;
  isSpeed?: boolean; // Speed is inverse: lower numerical values are better
  isMultiplier?: boolean; // e.g. Crit DMG (1.5x)
  isPercentage?: boolean; // e.g. Crit Chance (15%)
}

export default function StatComparison({
  label,
  newValue = 0,
  oldValue = 0,
  isSpeed = false,
  isMultiplier = false,
  isPercentage = false,
}: StatComparisonProps) {
  // Hide component if neither value is provided or both are zero
  if (!newValue && !oldValue) return null;

  const diff = newValue - oldValue;

  // Determine if the change is beneficial (negative diff is positive for speed)
  const isPositiveChange = isSpeed ? diff < 0 : diff > 0;
  const isNegativeChange = isSpeed ? diff > 0 : diff < 0;

  let colorClass = "text-tx-muted"; // Default color for no change
  let sign = "";

  if (isPositiveChange) {
    colorClass = "text-success";
    sign = "+";
  } else if (isNegativeChange) {
    colorClass = "text-danger";
    // Negative values already include the minus sign, so no manual sign is added
  }

  // Formatters for display values based on stat type
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
        {
          // Always display the primary/new value
        }
        <span className="font-mono font-bold text-tx-main">
          {formatValue(newValue)}
        </span>

        {
          // Display the difference badge only if the value has changed
        }
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
