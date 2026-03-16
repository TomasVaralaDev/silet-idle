interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PouchRatesModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const rates = [
    { label: "Resources", minor: "87.7%", major: "77.7%", legendary: "68.0%" },
    { label: "Scrolls", minor: "9.6%", major: "9.7%", legendary: "11.6%" },
    { label: "Skill Runes", minor: "2.7%", major: "12.6%", legendary: "20.4%" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-app-base/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-panel border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center bg-panel/50">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-tx-main">
              Drop Probabilities
            </h2>
            <p className="text-[10px] text-tx-muted uppercase font-bold tracking-wider mt-1">
              Per individual roll
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-tx-muted hover:text-tx-main text-xl p-2"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-tx-muted border-b border-border">
                <th className="pb-3 font-black">Category</th>
                <th className="pb-3 font-black text-green-400">Minor</th>
                <th className="pb-3 font-black text-blue-400">Major</th>
                <th className="pb-3 font-black text-yellow-400">Legendary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rates.map((row) => (
                <tr
                  key={row.label}
                  className="group hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 text-xs font-bold text-tx-main">
                    {row.label}
                  </td>
                  <td className="py-4 text-xs font-mono text-green-400/80">
                    {row.minor}
                  </td>
                  <td className="py-4 text-xs font-mono text-blue-400/80">
                    {row.major}
                  </td>
                  <td className="py-4 text-xs font-mono text-yellow-400/80">
                    {row.legendary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 space-y-2 bg-app-base/40 p-4 rounded-xl border border-border/50">
            <p className="text-[10px] text-tx-muted leading-relaxed">
              <span className="text-accent font-bold">INFO:</span> Minor pouches
              roll <span className="text-tx-main">2x</span>, Major{" "}
              <span className="text-tx-main">3x</span>, and Legendary{" "}
              <span className="text-tx-main">5x</span>.
            </p>
            <p className="text-[10px] text-tx-muted leading-relaxed">
              Runes are selected randomly from all available types (Mining,
              Smithing, etc.) with equal weight within the Rune category.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-panel-hover hover:bg-accent hover:text-white text-tx-main font-black uppercase text-[10px] tracking-widest border-t border-border transition-all"
        >
          Understood
        </button>
      </div>
    </div>
  );
}
