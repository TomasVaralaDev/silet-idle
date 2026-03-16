import { useTooltipStore } from "../../store/useToolTipStore";
import { getItemDetails } from "../../data/index.ts";
import { getRarityStyle } from "../../utils/rarity.ts";

export default function ItemTooltip() {
  const { itemId, x, y } = useTooltipStore();

  if (!itemId) return null;

  const item = getItemDetails(itemId);
  if (!item) return null;

  const theme = getRarityStyle(item.rarity);

  // Oletetaan, että item.rarity on esim. "Arcane", jolloin luodaan luokka "theme-arcane".
  // Tämä vaaditaan, jotta div osaa lukea CSS-tiedostosi muuttujat.
  const themeClass = `theme-${item.rarity.toLowerCase()}`;

  // Offset, jotta hiiri ei peitä tooltipin kulmaa
  const tooltipX = x + 15;
  const tooltipY = y + 15;

  return (
    <div
      // Lisätty themeClass ja vaihdettu taustaväriksi bg-[rgb(var(--color-panel)/0.95)]
      className={`fixed z-[9999] pointer-events-none w-64 ${themeClass} bg-[rgb(var(--color-panel)/0.95)] backdrop-blur-sm border ${theme.border} rounded-lg shadow-2xl p-3 flex flex-col gap-2`}
      style={{
        left: tooltipX,
        top: tooltipY,
        // Voit lisätä myöhemmin logiikan, joka siirtää tooltipin vasemmalle/ylös, jos se menee ruudun ulkopuolelle
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <img src={item.icon} alt={item.name} className="w-8 h-8 pixelated" />
        <div>
          <h4 className={`font-bold text-sm leading-tight ${theme.text}`}>
            {item.name}
          </h4>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
            <span className={theme.text}>{item.rarity}</span> •{" "}
            {item.category || "Item"}
          </span>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-[10px] text-slate-400 italic">
          "{item.description}"
        </p>
      )}

      {/* Level Cap Varoitus (Nyt suoraan tooltipissä!) */}
      {item.level && item.level > 1 && (
        <div className="text-[10px] font-bold text-amber-500/80 uppercase">
          Requires Lv. {item.level}
        </div>
      )}

      {/* Stats - Näytetään lennosta */}
      {(item.stats || item.healing) && (
        <div className="grid grid-cols-2 gap-1 mt-1">
          {item.stats?.attack && (
            <div className="text-[10px]">
              <span className="text-slate-500">ATK:</span>{" "}
              <span className="text-white">+{item.stats.attack}</span>
            </div>
          )}
          {item.stats?.defense && (
            <div className="text-[10px]">
              <span className="text-slate-500">DEF:</span>{" "}
              <span className="text-white">+{item.stats.defense}</span>
            </div>
          )}
          {item.stats?.attackSpeed && (
            <div className="text-[10px]">
              <span className="text-slate-500">SPD:</span>{" "}
              {/* Muunnos sekunneiksi lisätty tähän! */}
              <span className="text-white">
                {(item.stats.attackSpeed / 1000).toFixed(1)}s
              </span>
            </div>
          )}
          {item.healing && (
            <div className="text-[10px] col-span-2 text-success">
              <span className="text-slate-500">HEALS:</span> +{item.healing} HP
            </div>
          )}
        </div>
      )}

      {/* Value */}
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className="text-[10px] font-mono text-warning font-bold">
          {item.value}
        </span>
        <img src="/assets/ui/coins.png" className="w-3 h-3 pixelated" alt="g" />
      </div>
    </div>
  );
}
