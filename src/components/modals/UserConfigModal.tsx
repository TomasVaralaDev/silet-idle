import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";

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
  currentUsername: string;
  currentAvatar: string;
  onSave: (name: string, avatar: string, theme: string) => void;
  onClose: () => void;
}

export default function UserConfigModal({
  currentUsername,
  currentAvatar,
  onSave,
  onClose,
}: Props) {
  const settings = useGameStore((state) => state.settings);

  const [name, setName] = useState(currentUsername);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [selectedTheme, setSelectedTheme] = useState(
    settings?.theme || "theme-neon",
  );
  const [error, setError] = useState("");

  // Live preview teemalle
  useEffect(() => {
    document.body.classList.remove(...THEMES.map((t) => t.id));
    document.body.classList.add(selectedTheme);
  }, [selectedTheme]);

  const handleCancel = () => {
    document.body.classList.remove(...THEMES.map((t) => t.id));
    document.body.classList.add(settings?.theme || "theme-neon");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Identity required");
      return;
    }
    if (name.length > 12) {
      setError("Identity too long (max 12 chars)");
      return;
    }

    // Lähetetään kaikki tiedot kerralla App.tsx:lle
    onSave(name.trim(), selectedAvatar, selectedTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      <div className="bg-panel p-8 rounded-2xl border border-border shadow-2xl w-full max-w-md relative overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

        <h2 className="text-xl font-black uppercase tracking-widest text-center mb-6 text-tx-main flex items-center justify-center gap-3">
          <span className="text-2xl">👤</span> User Profile
        </h2>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          {/* AVATARS */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-tx-muted mb-3 text-center">
              Neural Interface Appearance
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.src)}
                  className={`
                    relative group rounded-xl overflow-hidden border-2 transition-all duration-200 p-1
                    ${selectedAvatar === avatar.src ? "border-accent bg-accent/20 shadow-[0_0_15px_rgb(var(--color-accent)/0.3)] scale-105" : "border-border bg-panel-hover hover:border-border-hover hover:bg-panel"}
                  `}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-app-base">
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className={`w-full h-full object-cover pixelated transition-opacity duration-300 ${selectedAvatar === avatar.src ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=?&background=0f172a&color=fff";
                      }}
                    />
                  </div>
                  {selectedAvatar === avatar.src && (
                    <div className="absolute inset-0 border-2 border-accent/50 rounded-xl pointer-events-none animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* THEMES */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-tx-muted mb-3 text-center">
              System Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg border transition-all
                    ${selectedTheme === theme.id ? "bg-accent/10 border-accent text-tx-main shadow-inner" : "bg-panel border-border text-tx-muted hover:bg-panel-hover hover:text-tx-main"}
                  `}
                >
                  <div
                    className={`w-4 h-4 rounded-full shadow-sm ${theme.color} border border-black/50`}
                  ></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* NAME */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 pt-2 border-t border-border/50"
          >
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-tx-muted mb-2">
                Designation
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full bg-app-base border border-border rounded-lg px-4 py-3 text-tx-main focus:border-accent focus:ring-1 focus:ring-accent/50 outline-none font-mono text-sm"
              />
              {error && (
                <p className="text-danger text-xs mt-2 font-bold">{error}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 bg-panel-hover hover:bg-panel text-tx-muted font-bold rounded-lg border border-border uppercase text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-4 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg shadow-[0_0_15px_rgb(var(--color-accent)/0.3)] uppercase text-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
