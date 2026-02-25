import { useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type { SkillType } from "../types";
import { getRequiredXpForLevel } from "../utils/gameUtils";

export default function DevManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("theme-neon");

  // Dev-tilat
  const [coinAmount, setCoinAmount] = useState<number>(10000);
  const [targetLevel, setTargetLevel] = useState<number>(99);
  const [itemAmount] = useState<number>(1);

  const setState = useGameStore((state) => state.setState);
  const emitEvent = useGameStore((state) => state.emitEvent);
  const currentCoins = useGameStore((state) => state.coins);

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

  // Avainten ID:t
  const bossKeys = Array.from({ length: 8 }, (_, i) => `bosskey_w${i + 1}`);

  useEffect(() => {
    document.body.classList.remove(...themes.map((t) => t.id));
    document.body.classList.add(currentTheme);
  }, [currentTheme]);

  // --- LOGIIKKA: ITEMIEN LISÄYS ---
  const addItems = (id: string, qty: number) => {
    setState((state) => ({
      inventory: {
        ...state.inventory,
        [id]: (state.inventory[id] || 0) + qty,
      },
    }));
    emitEvent(
      "success",
      `Injected ${qty}x ${id}`,
      `/assets/items/bosskey/${id}.png`
    );
  };

  const addAllKeys = () => {
    setState((state) => {
      const newInventory = { ...state.inventory };
      bossKeys.forEach((key) => {
        newInventory[key] = (newInventory[key] || 0) + itemAmount;
      });
      return { inventory: newInventory };
    });
    emitEvent("success", "Full Access Granted: All World Keys injected");
  };

  const modifyCoins = (amount: number) => {
    setState((state) => ({
      coins: Math.max(0, state.coins + amount),
    }));
    const type = amount > 0 ? "success" : "warning";
    emitEvent(
      type,
      `${amount > 0 ? "Injected" : "Extracted"} ${Math.abs(
        amount
      ).toLocaleString()} fragments`
    );
  };

  const setAllSkillLevels = (lvl: number) => {
    setState((state) => {
      const newSkills = { ...state.skills };
      Object.keys(newSkills).forEach((skill) => {
        const s = skill as SkillType;
        const xpForLevel = lvl > 1 ? getRequiredXpForLevel(lvl - 1) : 0;
        newSkills[s] = { level: lvl, xp: xpForLevel };
      });
      return { skills: newSkills };
    });
    emitEvent(
      "info",
      `Neural Link: All skills synchronized to level ${lvl}`,
      "/assets/ui/icon_level_up.png"
    );
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-[9999] flex flex-col items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/95 border-b border-x border-green-500/50 text-green-500 px-6 py-1 rounded-b-md hover:bg-green-900/30 text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 relative z-20"
      >
        <span>DEV CONSOLE</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden relative z-10 ${
          isOpen ? "max-h-[95vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/95 border-b border-x border-green-500/50 p-4 shadow-2xl w-64 font-mono text-xs rounded-b-md space-y-6 overflow-y-auto custom-scrollbar max-h-[85vh]">
          <h3 className="text-green-500 font-bold border-b border-green-500/30 pb-1 flex justify-between items-center uppercase italic text-[10px]">
            <span>Root@GGEZ_OS:~$</span>
            <span className="animate-pulse">_</span>
          </h3>

          {/* RESOURCE MANAGER */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest flex justify-between">
              <span>Resource Manager</span>
              <span className="text-green-500">
                {currentCoins.toLocaleString()} FRG
              </span>
            </div>
            <input
              type="number"
              value={coinAmount}
              onChange={(e) => setCoinAmount(parseInt(e.target.value) || 0)}
              className="w-full bg-green-950/20 border border-green-900 text-green-400 px-2 py-1.5 focus:outline-none focus:border-green-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => modifyCoins(coinAmount)}
                className="bg-green-900/40 border border-green-500/50 text-green-400 py-1 hover:bg-green-500 hover:text-black transition-all font-bold"
              >
                ADD
              </button>
              <button
                onClick={() => modifyCoins(-coinAmount)}
                className="bg-red-900/20 border border-red-500/30 text-red-500 py-1 hover:bg-red-500 hover:text-white transition-all font-bold"
              >
                REMOVE
              </button>
            </div>
          </section>

          {/* KEY ACCESS INJECTION */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest">
              Key Access Injection
            </div>
            <div className="grid grid-cols-4 gap-1">
              {bossKeys.map((id, index) => (
                <button
                  key={id}
                  onClick={() => addItems(id, itemAmount)}
                  className="bg-green-950/40 border border-green-900 text-green-500 py-1.5 hover:bg-green-500 hover:text-black transition-all font-bold text-[9px]"
                  title={`Add ${id}`}
                >
                  W{index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={addAllKeys}
              className="w-full mt-1 border border-green-500/30 text-green-500 py-1 text-[8px] uppercase font-black hover:bg-green-500/10"
            >
              Grant Full Access (All Keys)
            </button>
          </section>

          {/* NEURAL-LINK OVERWRITE */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest">
              Neural-Link Overwrite
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={targetLevel}
                onChange={(e) => setTargetLevel(parseInt(e.target.value) || 1)}
                className="flex-1 bg-green-950/20 border border-green-900 text-green-400 px-2 py-1.5 focus:outline-none"
              />
              <button
                onClick={() => setAllSkillLevels(targetLevel)}
                className="bg-green-500 text-black px-3 py-1.5 font-black uppercase text-[10px]"
              >
                Sync
              </button>
            </div>
          </section>

          {/* UI SUBSYSTEM */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest">
              UI_Subsystem
            </div>
            <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 pr-1 text-left">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme.id)}
                  className={`w-full text-left px-2 py-1 uppercase text-[9px] ${
                    currentTheme === theme.id
                      ? "bg-green-500 text-black"
                      : "text-green-700 hover:bg-green-900/10"
                  }`}
                >
                  &gt; {theme.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
