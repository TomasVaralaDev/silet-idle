import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { SkillType } from "../types";
import { getRequiredXpForLevel } from "../utils/gameUtils";
import BattleSimView from "./battleSim/BattleSimView";

// --- DATA IMPORTS ---
import { weapons } from "../data/skills/crafting/weapons";
import { armor } from "../data/skills/smithing/armor";
import { jewelry } from "../data/skills/crafting/jewelry";
import { tools } from "../data/skills/smithing/tools";
import { alchemyResources } from "../data/skills/alchemy";
import { MYSTERY_POUCHES } from "../data/pouches";
import { WORLD_BOSS_DROPS } from "../data/bossLoot";

const THEMES = [
  { id: "theme-neon", label: "Neon (Sci-Fi)" },
  { id: "theme-tavern", label: "Tavern & Wood" },
  { id: "theme-abyss", label: "Abyss (OLED Dark)" },
  { id: "theme-frost", label: "Frost (Ice)" },
  { id: "theme-arcane", label: "Arcane (Magic)" },
  { id: "theme-sakura", label: "Sakura (Cute)" },
  { id: "theme-matte", label: "Matte Ash" },
  { id: "theme-hc", label: "High Contrast" },
];

export default function DevManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  const [coinAmount, setCoinAmount] = useState<number>(10000);
  const [targetLevel, setTargetLevel] = useState<number>(99);
  const [itemAmount] = useState<number>(1);

  const [selectedGear, setSelectedGear] = useState<string>(
    "pouch_mystery_minor",
  );
  const [gearAmount, setGearAmount] = useState<number>(1);

  const setState = useGameStore((state) => state.setState);
  const emitEvent = useGameStore((state) => state.emitEvent);
  const currentCoins = useGameStore((state) => state.coins);

  const bossKeys = Array.from({ length: 8 }, (_, i) => `bosskey_w${i + 1}`);

  // Yhdistetään bossi-aseet perusaseisiin
  const bossUniqueWeapons = Object.values(WORLD_BOSS_DROPS).flat();
  const allWeaponsCombined = [...weapons, ...bossUniqueWeapons];

  // --- LOGIIKKA: ITEMIEN LISÄYS ---
  const addItems = (id: string, qty: number) => {
    setState((state) => ({
      inventory: {
        ...state.inventory,
        [id]: (state.inventory[id] || 0) + qty,
      },
    }));

    const allItems = [
      ...allWeaponsCombined,
      ...armor,
      ...jewelry,
      ...tools,
      ...alchemyResources,
      ...MYSTERY_POUCHES,
    ];

    const foundItem = allItems.find((item) => item.id === id);
    const iconPath = foundItem?.icon || `./assets/items/bosskey/${id}.png`;

    emitEvent("success", `Injected ${qty}x ${foundItem?.name || id}`, iconPath);
  };

  const addAllGearWithEnchants = () => {
    setState((state) => {
      const newInventory = { ...state.inventory };
      const allGear = [...allWeaponsCombined, ...armor, ...jewelry, ...tools];

      allGear.forEach((item) => {
        newInventory[item.id] = (newInventory[item.id] || 0) + gearAmount;
        // Enchantit vain perusesineille (ei boss-aseille)
        if (!item.id.includes("boss")) {
          for (let i = 1; i <= 5; i++) {
            const enchantedId = `${item.id}_e${i}`;
            newInventory[enchantedId] =
              (newInventory[enchantedId] || 0) + gearAmount;
          }
        }
      });

      return { inventory: newInventory };
    });

    emitEvent(
      "success",
      "GOD MODE: All gear (Base + E1-E5) injected!",
      "./assets/ui/icon_level_up.png",
    );
  };

  const addAllPotions = () => {
    setState((state) => {
      const newInventory = { ...state.inventory };
      alchemyResources.forEach((potion) => {
        newInventory[potion.id] = (newInventory[potion.id] || 0) + 999;
      });
      return { inventory: newInventory };
    });
    emitEvent(
      "success",
      "MEDICAL RESUPPLY: 999x potions injected!",
      "./assets/items/alchemy/potion_tier8.png",
    );
  };

  const addAllPouches = () => {
    setState((state) => {
      const newInventory = { ...state.inventory };
      MYSTERY_POUCHES.forEach((p) => {
        newInventory[p.id] = (newInventory[p.id] || 0) + 10;
      });
      return { inventory: newInventory };
    });
    emitEvent(
      "success",
      "LOOT OVERFLOW: 10x Mystery Pouches injected!",
      "./assets/items/pouch_legendary.png",
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
    setState((state) => ({ coins: Math.max(0, state.coins + amount) }));
    const type = amount > 0 ? "success" : "warning";
    emitEvent(
      type,
      `${amount > 0 ? "Injected" : "Extracted"} ${Math.abs(amount).toLocaleString()} fragments`,
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
      "./assets/ui/icon_level_up.png",
    );
  };

  const unlockAllMaps = () => {
    setState((state) => ({
      combatStats: { ...state.combatStats, maxMapCompleted: 80 },
    }));
    emitEvent(
      "success",
      "MAP OVERRIDE: All 80 zones unlocked!",
      "./assets/ui/icon_maps.png",
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
        className={`transition-all duration-300 ease-in-out overflow-hidden relative z-10 ${isOpen ? "max-h-[95vh] opacity-100" : "max-h-0 opacity-0"}`}
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
                className="bg-green-900/40 border border-green-500/50 text-green-400 py-1 hover:bg-green-500 hover:text-black transition-all font-bold uppercase"
              >
                ADD
              </button>
              <button
                onClick={() => modifyCoins(-coinAmount)}
                className="bg-red-900/20 border border-red-500/30 text-red-500 py-1 hover:bg-red-500 hover:text-white transition-all font-bold uppercase"
              >
                REMOVE
              </button>
            </div>
          </section>

          {/* GEAR & ITEMS INJECTION */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest">
              Items & Gear Injection
            </div>
            <div className="flex gap-1 mb-1">
              <select
                value={selectedGear}
                onChange={(e) => setSelectedGear(e.target.value)}
                className="flex-1 bg-green-950/20 border border-green-900 text-green-400 px-1 py-1.5 focus:outline-none text-[9px] cursor-pointer"
              >
                <optgroup
                  label="MYSTERY POUCHES"
                  className="bg-black text-yellow-500"
                >
                  {MYSTERY_POUCHES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup
                  label="WEAPONS (INCL. BOSS)"
                  className="bg-black text-green-500 font-bold"
                >
                  {allWeaponsCombined.map((w) => (
                    <option
                      key={w.id}
                      value={w.id}
                      className={
                        w.id.includes("boss")
                          ? "text-purple-400 font-black"
                          : ""
                      }
                    >
                      {w.id.includes("boss") ? "[UNIQUE] " : `[Lv.${w.level}] `}{" "}
                      {w.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="ARMOR" className="bg-black text-green-500">
                  {armor.map((a) => (
                    <option key={a.id} value={a.id}>
                      [Lv.{a.level}] {a.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="JEWELRY" className="bg-black text-green-500">
                  {jewelry.map((j) => (
                    <option key={j.id} value={j.id}>
                      [Lv.{j.level}] {j.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="POTIONS" className="bg-black text-green-500">
                  {alchemyResources.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <input
                type="number"
                min="1"
                value={gearAmount}
                onChange={(e) => setGearAmount(parseInt(e.target.value) || 1)}
                className="w-10 bg-green-950/20 border border-green-900 text-green-400 px-1 py-1.5 text-center text-[9px]"
              />
              <button
                onClick={() => addItems(selectedGear, gearAmount)}
                className="bg-green-900/40 border border-green-500/50 text-green-400 px-2 py-1 hover:bg-green-500 hover:text-black font-bold text-[9px]"
              >
                ADD
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 mb-1">
              <button
                onClick={addAllPouches}
                className="border border-yellow-500/50 text-yellow-500 py-1 text-[8px] uppercase font-black hover:bg-yellow-500 hover:text-black transition-all"
              >
                Pouches (10x)
              </button>
              <button
                onClick={addAllPotions}
                className="border border-pink-500/50 text-pink-400 py-1 text-[8px] uppercase font-black hover:bg-pink-500 hover:text-black transition-all"
              >
                Potions (999x)
              </button>
            </div>
            <button
              onClick={addAllGearWithEnchants}
              className="w-full border border-purple-500/50 text-purple-400 py-1 text-[8px] uppercase font-black hover:bg-purple-500 hover:text-black transition-all mb-1"
            >
              Inject ALL Gear (Base + E1-E5)
            </button>
          </section>

          {/* PROGRESSION OVERRIDES */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest">
              Progression Overrides
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
            <button
              onClick={unlockAllMaps}
              className="w-full mt-1 border border-cyan-500/50 text-cyan-400 py-1 text-[8px] uppercase font-black hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)]"
            >
              Unlock All Maps (Max Level 80)
            </button>
          </section>

          {/* NEURAL-LINK / SKILLS */}
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

          {/* COMBAT SIMULATOR */}
          <section className="space-y-2 pt-2 border-t border-green-500/30">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSimModalOpen(true);
              }}
              className="w-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 py-2 text-[10px] uppercase font-black hover:bg-yellow-500 hover:text-black transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
              🚀 Launch Combat Simulator
            </button>
          </section>

          {/* UI SUBSYSTEM (THEMES) */}
          <section className="space-y-2">
            <div className="text-green-800 font-black text-[9px] uppercase tracking-widest">
              UI_Subsystem
            </div>
            <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 pr-1 text-left">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() =>
                    setState((state) => ({
                      settings: {
                        ...state.settings,
                        theme: theme.id,
                      },
                    }))
                  }
                  className={`w-full text-left px-2 py-1 uppercase text-[9px] text-green-700 hover:bg-green-900/10`}
                >
                  &gt; {theme.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <BattleSimView
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
      />
    </div>
  );
}
