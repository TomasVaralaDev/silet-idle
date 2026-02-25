import { useState, useEffect } from "react";

export default function DevManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("theme-neon");

  const themes = [
    { id: "theme-neon", label: "Neon (Sci-Fi)" },
    { id: "theme-tavern", label: "Tavern & Wood" },
    { id: "theme-abyss", label: "Abyss (OLED Dark)" },
    { id: "theme-frost", label: "Frost (Ice)" },
    { id: "theme-arcane", label: "Arcane (Magic)" },
    { id: "theme-sakura", label: "Sakura (Cute)" },
    { id: "theme-matte", label: "Matte Ash" },
    { id: "theme-hc", label: "High Contrast" },
  ];

  useEffect(() => {
    // Poistetaan kaikki mahdolliset teemaluokat ja lisätään valittu
    document.body.classList.remove(...themes.map((t) => t.id));
    document.body.classList.add(currentTheme);
  }, [currentTheme]);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-[9999] flex flex-col items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/95 border-b border-x border-green-500/50 text-green-500 px-6 py-1 rounded-b-md hover:bg-green-900/30 hover:text-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.15)] text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 relative z-20"
        title="Toggle Dev Manager"
      >
        <span>DEV</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden relative z-10 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/95 border-b border-x border-green-500/50 p-4 shadow-2xl w-56 font-mono text-xs rounded-b-md mt-0">
          <h3 className="text-green-500 font-bold mb-3 border-b border-green-500/30 pb-1 flex justify-between items-center">
            <span>[ DEV MENU ]</span>
            <span className="animate-pulse">_</span>
          </h3>

          <div className="space-y-2">
            <div className="text-green-800 font-bold text-[10px] mb-1 uppercase tracking-widest mt-2">
              Force Theme
            </div>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setCurrentTheme(theme.id)}
                className={`w-full text-left px-2 py-1.5 uppercase transition-colors ${
                  currentTheme === theme.id
                    ? "bg-green-900/50 text-green-300 border border-green-500/50"
                    : "text-green-600 hover:text-green-400 hover:bg-green-900/20 border border-transparent"
                }`}
              >
                &gt; {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
