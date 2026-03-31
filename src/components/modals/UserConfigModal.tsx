import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import { CHAT_COLORS } from "../../data/chatColors";
import { wordFilter } from "../../utils/wordFilter";
import { ChevronDown } from "lucide-react"; // LISÄTTY IMPORT NUOLTA VARTEN

const AVAILABLE_AVATARS = [
  { id: 1, src: "./assets/profilepics/profile_pic_1.png", name: "Standard" },
  { id: 2, src: "./assets/profilepics/profile_pic_2.png", name: "Cyber" },
  { id: 3, src: "./assets/profilepics/profile_pic_3.png", name: "Rogue" },
  { id: 4, src: "./assets/profilepics/profile_pic_4.png", name: "Mage" },
  { id: 5, src: "./assets/profilepics/profile_pic_5.png", name: "Warrior" },
  { id: 6, src: "./assets/profilepics/profile_pic_6.png", name: "Construct" },
  { id: 7, src: "./assets/profilepics/profile_pic_7.png", name: "ninja" },
  { id: 8, src: "./assets/profilepics/profile_pic_8.png", name: "witch" },
  { id: 9, src: "./assets/profilepics/profile_pic_9.png", name: "ranger" },
  { id: 10, src: "./assets/profilepics/profile_pic_10.png", name: "herald" },
  { id: 11, src: "./assets/profilepics/profile_pic_11.png", name: "ranger2" },
  { id: 12, src: "./assets/profilepics/profile_pic_12.png", name: "mage2" },
  { id: 13, src: "./assets/profilepics/profile_pic_13.png", name: "witch2" },
  { id: 14, src: "./assets/profilepics/profile_pic_14.png", name: "yeehaw" },
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
  onSave: (
    name: string,
    avatar: string,
    theme: string,
    chatColor: string,
  ) => void | Promise<void>;
  onClose: () => void;
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 tuntia

export default function UserConfigModal({
  currentUsername,
  currentAvatar,
  onSave,
  onClose,
}: Props) {
  const settings = useGameStore((state) => state.settings);
  const social = useGameStore((state) => state.social);

  const [name, setName] = useState(currentUsername);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [selectedTheme, setSelectedTheme] = useState(
    settings?.theme || "theme-neon",
  );
  const [selectedChatColor, setSelectedChatColor] = useState(
    settings?.chatColor || "default",
  );
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // UUSI: Tila profiilikuvien näkyvyydelle (oletuksena kiinni)
  const [showAvatars, setShowAvatars] = useState(false);

  // --- COOLDOWN LOGIIKKA ---
  const lastNameChange = settings?.lastNameChange || 0;
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, COOLDOWN_MS - (Date.now() - lastNameChange)),
  );
  const isNameCooldown = timeLeft > 0;

  useEffect(() => {
    if (!isNameCooldown) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        COOLDOWN_MS - (Date.now() - lastNameChange),
      );
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [isNameCooldown, lastNameChange]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Identity required");
      return;
    }
    if (trimmedName.length > 12) {
      setError("Identity too long (max 12 chars)");
      return;
    }

    if (wordFilter.isProfane(trimmedName)) {
      setError("Inappropriate identity detected");
      return;
    }

    setIsProcessing(true);
    await onSave(trimmedName, selectedAvatar, selectedTheme, selectedChatColor);
    setIsProcessing(false);
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
          <img
            src="./assets/profile/user_settings.png"
            alt=""
            className="w-6 h-6 pixelated object-contain"
          />
          User Profile
        </h2>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          {/* Nimen esikatselu chatissa */}
          <div className="p-3 bg-app-base/50 rounded-xl border border-border/50 text-center">
            <p className="text-[9px] uppercase font-black text-tx-muted mb-1 tracking-widest">
              Chat Preview
            </p>
            <p className="text-sm font-bold uppercase tracking-tight">
              <span
                style={
                  CHAT_COLORS.find((c) => c.id === selectedChatColor)?.style
                }
              >
                {name || "Hero"}:
              </span>
              <span className="text-tx-main ml-2 font-medium normal-case">
                Greetings, traveler!
              </span>
            </p>
          </div>

          {/* AVATARS - NYT PIILOTETTAVISSA */}
          <div className="border border-border/50 bg-panel/30 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAvatars(!showAvatars)}
              className="w-full p-3 flex items-center justify-between hover:bg-panel-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={selectedAvatar}
                  className="w-6 h-6 rounded bg-app-base border border-border pixelated"
                  alt="Current"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-tx-muted">
                  Portrait Appearance
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-tx-muted transition-transform duration-300 ${showAvatars ? "rotate-180" : ""}`}
              />
            </button>

            {showAvatars && (
              <div className="p-3 pt-0 grid grid-cols-3 gap-3 border-t border-border/30 animate-in fade-in slide-in-from-top-2 duration-200">
                {AVAILABLE_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(avatar.src);
                      setShowAvatars(false); // Vapaaehtoinen: sulkee valikon kun kuva on valittu
                    }}
                    className={`
                      relative group rounded-xl overflow-hidden border-2 transition-all duration-200 p-1
                      ${selectedAvatar === avatar.src ? "border-accent bg-accent/20 shadow-[0_0_15px_rgb(var(--color-accent)/0.3)] scale-105" : "border-border bg-panel-hover hover:border-border-hover hover:bg-panel"}
                    `}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-app-base">
                      <img
                        src={avatar.src}
                        alt={avatar.name}
                        className="w-full h-full object-cover pixelated"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CHAT COLORS */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-tx-muted mb-3 text-center">
              Tavern Name Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CHAT_COLORS.map((color) => {
                const isUnlocked =
                  social?.unlockedChatColors?.includes(color.id) ||
                  color.id === "default";

                return (
                  <button
                    key={color.id}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => setSelectedChatColor(color.id)}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg border transition-all
                      ${selectedChatColor === color.id ? "bg-accent/10 border-accent shadow-inner" : "bg-panel border-border"}
                      ${!isUnlocked ? "opacity-30 grayscale cursor-not-allowed" : "hover:bg-panel-hover"}
                    `}
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={color.style}
                    ></div>
                    <span
                      className="text-[9px] font-black uppercase tracking-widest truncate"
                      style={color.style}
                    >
                      {color.name}
                    </span>
                    {!isUnlocked && (
                      <span className="ml-auto text-[8px]">🔒</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* THEMES */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-tx-muted mb-3 text-center">
              System Interface
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
                    className={`w-3 h-3 rounded-full ${theme.color} border border-black/50`}
                  ></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* NAME & SAVE */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 pt-2 border-t border-border/50"
          >
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-tx-muted">
                  Character Designation
                </label>
                {isNameCooldown && (
                  <span className="text-[10px] font-bold text-warning uppercase tracking-wider bg-warning/10 px-2 py-0.5 rounded">
                    Cooldown: {formatTime(timeLeft)}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={name}
                disabled={isNameCooldown || isProcessing}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className={`w-full border rounded-lg px-4 py-3 font-bold text-sm outline-none transition-all ${
                  isNameCooldown
                    ? "bg-panel border-border/30 text-tx-muted cursor-not-allowed opacity-70"
                    : "bg-app-base border-border text-tx-main focus:border-accent"
                }`}
              />
              {error && (
                <p className="text-danger text-xs mt-2 font-bold">{error}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-panel-hover hover:bg-panel text-tx-muted font-bold rounded-lg border border-border uppercase text-[10px] tracking-widest disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isProcessing || (isNameCooldown && name !== currentUsername)
                }
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-hover text-white font-black rounded-xl shadow-lg uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
