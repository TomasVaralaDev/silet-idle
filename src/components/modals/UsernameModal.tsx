import { useState, useEffect } from "react";

const AVAILABLE_AVATARS = [
  { id: 1, src: "/assets/profilepics/profile_pic_1.png", name: "Standard" },
  { id: 2, src: "/assets/profilepics/profile_pic_2.png", name: "Cyber" },
  { id: 3, src: "/assets/profilepics/profile_pic_3.png", name: "Rogue" },
  { id: 4, src: "/assets/profilepics/profile_pic_4.png", name: "Mage" },
  { id: 5, src: "/assets/profilepics/profile_pic_5.png", name: "Warrior" },
  { id: 6, src: "/assets/profilepics/profile_pic_6.png", name: "Construct" },
];

const THEMES = [
  { id: "theme-neon", label: "Neon (Sci-Fi)", color: "bg-cyan-500" },
  { id: "theme-tavern", label: "Tavern", color: "bg-amber-700" },
  { id: "theme-abyss", label: "Abyss", color: "bg-purple-900" },
  { id: "theme-frost", label: "Frost", color: "bg-blue-300" },
  { id: "theme-arcane", label: "Arcane", color: "bg-indigo-500" },
  { id: "theme-sakura", label: "Sakura", color: "bg-pink-400" },
  { id: "theme-matte", label: "Matte Ash", color: "bg-slate-500" },
  { id: "theme-hc", label: "Contrast", color: "bg-yellow-400" },
];

interface Props {
  onConfirm: (name: string, avatar: string, theme: string) => void;
  onLogout: () => void;
}

export default function UsernameModal({ onConfirm, onLogout }: Props) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVAILABLE_AVATARS[0].src,
  );
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
  const [error, setError] = useState("");
  const [showNameHelp, setShowNameHelp] = useState(false);

  // Live preview for the selected theme
  useEffect(() => {
    document.body.classList.remove(...THEMES.map((t) => t.id));
    document.body.classList.add(selectedTheme);
  }, [selectedTheme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Hero name required");
      return;
    }
    if (name.length > 12) {
      setError("Name too long (max 12 chars)");
      return;
    }
    onConfirm(name.trim(), selectedAvatar, selectedTheme);
  };

  return (
    <div className="bg-panel/60 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* GLOW EFFECT */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-40"></div>

      <header className="text-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-tx-main mb-1">
          Begin Your Legend
        </h2>
        <p className="text-tx-muted text-[10px] font-bold uppercase tracking-widest opacity-60">
          Define your appearance and interface
        </p>
      </header>

      <div className="space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar pr-2">
        {/* AVATAR SELECTION */}
        <section>
          <label className="block text-[10px] font-black uppercase tracking-widest text-tx-muted mb-4 text-center">
            Select Portrait
          </label>
          <div className="grid grid-cols-3 gap-3">
            {AVAILABLE_AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.src)}
                className={`
                  relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 p-1
                  ${
                    selectedAvatar === avatar.src
                      ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(var(--color-accent),0.2)] scale-105"
                      : "border-border/40 bg-app-base/40 hover:border-border hover:bg-panel"
                  }
                `}
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-app-base">
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className={`w-full h-full object-cover pixelated transition-all duration-500 ${selectedAvatar === avatar.src ? "scale-110 opacity-100" : "opacity-40 group-hover:opacity-100"}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* THEME SELECTION */}
        <section>
          <label className="block text-[10px] font-black uppercase tracking-widest text-tx-muted mb-4 text-center">
            Interface Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`
                  flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200
                  ${
                    selectedTheme === theme.id
                      ? "bg-accent/10 border-accent text-tx-main shadow-inner"
                      : "bg-app-base/40 border-border/50 text-tx-muted hover:bg-panel hover:text-tx-main"
                  }
                `}
              >
                <div
                  className={`w-3 h-3 rounded-full shadow-sm ${theme.color} border border-black/20`}
                ></div>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {theme.label.replace(" (Sci-Fi)", "")}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* NAME INPUT */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 pt-4 border-t border-border/20"
        >
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-tx-muted">
                Hero Name
              </label>

              {/* HELP ICON */}
              <div
                className="relative flex items-center group cursor-help"
                onMouseEnter={() => setShowNameHelp(true)}
                onMouseLeave={() => setShowNameHelp(false)}
                onClick={() => setShowNameHelp(!showNameHelp)}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-border/60 flex items-center justify-center text-[8px] font-black text-tx-muted hover:text-accent hover:border-accent transition-colors">
                  ?
                </span>

                {/* TOOLTIP */}
                {showNameHelp && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-panel border border-border/80 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    <p className="text-[10px] leading-tight text-tx-main font-bold uppercase tracking-tight">
                      Names do not need to be unique and can be changed at any
                      time in settings.
                    </p>
                    <div className="absolute top-full left-4 border-8 border-transparent border-t-panel"></div>
                  </div>
                )}
              </div>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter name..."
              className="w-full bg-app-base/50 border border-border/50 rounded-xl px-4 py-4 text-tx-main placeholder:text-tx-muted/20 focus:outline-none focus:border-accent/50 transition-all font-bold text-sm"
              autoFocus
            />
            {error && (
              <p className="text-danger text-[10px] mt-2 ml-1 font-black uppercase tracking-tight animate-pulse">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex-1 px-4 py-4 bg-panel/40 hover:bg-danger/10 text-tx-muted hover:text-danger font-black rounded-xl border border-border/50 hover:border-danger/30 transition-all uppercase text-[10px] tracking-widest"
            >
              Abort
            </button>
            <button
              type="submit"
              className="flex-[2] px-4 py-4 bg-accent/20 hover:bg-accent text-accent hover:text-white font-black rounded-xl border border-accent/30 shadow-lg transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 group"
            >
              <span>Start Adventure</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
