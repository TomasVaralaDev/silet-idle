import { useState } from "react";

type WikiTab =
  | "basics"
  | "combat"
  | "equipment"
  | "enchanting"
  | "vendors"
  | "treasures";

export default function WikiView() {
  const [activeTab, setActiveTab] = useState<WikiTab>("basics");

  // Persistent Navigation Items
  const navItems: { id: WikiTab; label: string; icon: string; desc: string }[] =
    [
      {
        id: "basics",
        label: "Hero's Path",
        icon: "/assets/ui/icon_guide.png",
        desc: "The Journey Begins",
      },
      {
        id: "combat",
        label: "Art of War",
        icon: "/assets/skills/combat.png",
        desc: "Combat & Tactics",
      },
      {
        id: "equipment",
        label: "The Armory",
        icon: "/assets/ui/icon_inventory.png",
        desc: "Weapons & Protection",
      },
      {
        id: "enchanting",
        label: "The Forge",
        icon: "/assets/ui/icon_enchanting.png",
        desc: "Magical Augmentation",
      },
      {
        id: "vendors",
        label: "World Vendors",
        icon: "/assets/ui/icon_market.png",
        desc: "Regional Trade Hubs",
      },
      {
        id: "treasures",
        label: "Spoils of War",
        icon: "/assets/ui/icon_quest.png",
        desc: "Drops & Rarities",
      },
    ];

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden">
      {/* HEADER - Matches Achievement style */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-warning/20 border border-warning/30 shadow-lg shrink-0">
          <img
            src="/assets/ui/icon_guide.png"
            className="w-10 h-10 pixelated object-contain"
            alt="Guide"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black uppercase tracking-widest text-warning mb-1">
            Adventurer's Guide
          </h1>
          <p className="text-tx-muted text-sm font-medium italic">
            "Knowledge is the sharpest blade in a hero's arsenal."
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
            Volume I
          </div>
          <div className="text-xs font-mono text-tx-muted mt-1 uppercase tracking-widest">
            Chronicles: <span className="text-warning">Active</span>
          </div>
        </div>
      </div>

      {/* GOLD ACCENT LINE */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-warning shadow-[0_0_10px_rgb(var(--color-warning)/0.5)] w-full"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PERSISTENT SIDEBAR */}
        <div className="w-72 bg-panel/20 border-r border-border/50 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all border group
                ${
                  activeTab === item.id
                    ? "bg-warning/15 border-warning/40 shadow-inner"
                    : "bg-transparent border-transparent hover:bg-panel-hover hover:border-border-hover"
                }
              `}
            >
              <div
                className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 transition-all
                ${activeTab === item.id ? "bg-warning/20 border-warning/50 scale-105" : "bg-panel border-border"}
              `}
              >
                <img src={item.icon} className="w-8 h-8 pixelated" alt="" />
              </div>
              <div className="text-left overflow-hidden">
                <div
                  className={`text-[10px] font-black uppercase tracking-widest leading-none
                  ${activeTab === item.id ? "text-warning" : "text-tx-main"}
                `}
                >
                  {item.label}
                </div>
                <div className="text-[9px] text-tx-muted mt-1 truncate uppercase font-bold opacity-60">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}

          <div className="mt-auto p-4 bg-warning/5 border border-warning/10 rounded-xl">
            <p className="text-[8px] text-tx-muted uppercase font-bold text-center leading-relaxed">
              May your steel never dull and your courage never falter.
            </p>
          </div>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-app-base/30">
          <div className="max-w-3xl">
            {activeTab === "basics" && <BasicsArticle />}
            {activeTab === "combat" && <CombatArticle />}
            {activeTab === "enchanting" && <EnchantingArticle />}
            {activeTab === "treasures" && <TreasuresArticle />}
            {activeTab === "vendors" && <VendorsArticle />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ARTICLES ---

function BasicsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      {/* SECTION 1: CORE LOOP */}
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          Hero's Path
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          The fundamental progression of the game revolves around a continuous
          cycle of gathering, crafting, and conquering. To advance through the
          worlds, you must constantly optimize your efficiency in both resource
          management and combat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2 tracking-widest">
              01. Gather
            </h4>
            <p className="text-[11px] text-tx-muted">
              Collect raw materials like ores, wood, and herbs using gathering
              skills.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2 tracking-widest">
              02. Craft
            </h4>
            <p className="text-[11px] text-tx-muted">
              Refine materials and forge the highest tier of equipment available
              to you.
            </p>
          </div>
          <div className="p-4 bg-panel border border-border rounded-xl">
            <h4 className="text-warning font-black text-[10px] uppercase mb-2 tracking-widest">
              03. Conquer
            </h4>
            <p className="text-[11px] text-tx-muted">
              Defeat enemies in your current zone to unlock the path to the next
              area.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: DIFFICULTY SCALING */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-tx-main uppercase tracking-widest border-l-4 border-warning pl-4">
          Scaling & Difficulty
        </h3>
        <p className="text-sm text-tx-muted leading-relaxed">
          The game is divided into{" "}
          <span className="text-tx-main font-bold">Worlds</span>, each
          containing{" "}
          <span className="text-tx-main font-bold">10 Combat Zones</span>. As
          you progress, enemies become significantly stronger:
        </p>
        <div className="bg-panel/30 border border-border p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs border-b border-border/50 pb-2">
            <span className="text-tx-muted">Zone 1-9</span>
            <span className="text-tx-main font-mono">Standard Progression</span>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="text-tx-muted">Zone 10</span>
            <span className="text-warning font-bold">World Boss Encounter</span>
          </div>
        </div>
        <p className="text-xs text-tx-muted italic">
          New areas introduce enemies with higher HP and Attack power.
          Attempting to enter a new world without upgrading your equipment will
          result in rapid defeat.
        </p>
      </section>
    </div>
  );
}

function CombatArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10 text-left">
      {/* SECTION 1: WEAPON ARCHETYPES */}
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-6">
          Art of War
        </h2>
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Weapon Archetypes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SWORD */}
          <div className="bg-panel border border-border p-4 rounded-xl flex flex-col items-center text-center">
            <img
              src="/assets/items/weapons/weapon_sword_iron.png"
              className="w-12 h-12 pixelated mb-3"
              alt="Melee"
            />
            <h4 className="text-tx-main font-black uppercase text-xs">Sword</h4>
            <p className="text-[10px] text-tx-muted mt-2">
              Specializes in raw physical power and scales with your Melee
              skill.
            </p>
          </div>

          {/* BOW */}
          <div className="bg-panel border border-border p-4 rounded-xl flex flex-col items-center text-center">
            <img
              src="/assets/items/bows/bow_iron.png"
              className="w-12 h-12 pixelated mb-3"
              alt="Ranged"
            />
            <h4 className="text-tx-main font-black uppercase text-xs">Bow</h4>
            <p className="text-[10px] text-tx-muted mt-2">
              Favors high attack speed and critical strikes. Scales with Ranged
              skill.
            </p>
          </div>

          {/* STAFF - COMING SOON */}
          <div className="bg-panel/20 border border-border/30 p-4 rounded-xl flex flex-col items-center text-center opacity-40 grayscale">
            <div className="w-12 h-12 bg-app-base rounded-full flex items-center justify-center mb-3 border border-dashed border-border">
              <span className="text-xl">✨</span>
            </div>
            <h4 className="text-tx-muted font-black uppercase text-xs">
              Staff
            </h4>
            <p className="text-[10px] text-tx-muted mt-2 uppercase font-bold tracking-tighter">
              Coming Soon
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: EQUIPMENT ATTRIBUTES */}
      <section>
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Equipment Attributes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-panel/30 p-6 rounded-2xl border border-border/50">
          <StatDetail
            label="Attack"
            desc="Raw damage dealt per successful hit."
          />
          <StatDetail
            label="Defense"
            desc="Reduces incoming damage from hostile sources."
          />
          <StatDetail
            label="Attack Speed"
            desc="The delay (ms) between strikes. Lower is faster."
          />
          <StatDetail
            label="Crit Chance"
            desc="Percentage chance to deal a Critical Strike."
          />
          <StatDetail
            label="Crit Multi"
            desc="Multiplier applied to critical damage (Base: 1.5x)."
          />
          <StatDetail
            label="Strength"
            desc="Bonus physical power affecting melee effectiveness."
          />
          <StatDetail
            label="HP Bonus"
            desc="Increases your maximum life point capacity."
          />
        </div>
      </section>

      {/* SECTION 3: HERO SKILLS */}
      <section>
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Combat Proficiency
        </h3>
        <p className="text-xs text-tx-muted mb-6 leading-relaxed">
          Engaging in battle grants experience in several internal systems.
          Raising these levels is the only way to master higher-tier gear and
          survive late-game zones.
        </p>

        <div className="space-y-2">
          <SkillRow
            name="Combat"
            desc="Overall combat capability and power level."
          />
          <SkillRow
            name="Hitpoints"
            desc="Directly increases your Maximum Health."
          />
          <SkillRow
            name="Attack"
            desc="Increases your chance to land successful hits."
          />
          <SkillRow
            name="Defense"
            desc="Improves the efficiency of all equipped armor."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div className="bg-panel p-3 border border-border rounded-lg">
              <span className="text-[10px] font-black text-accent uppercase">
                Melee
              </span>
              <p className="text-[9px] text-tx-muted mt-1">
                Mastery of blades and physical force.
              </p>
            </div>
            <div className="bg-panel p-3 border border-border rounded-lg">
              <span className="text-[10px] font-black text-success uppercase">
                Ranged
              </span>
              <p className="text-[9px] text-tx-muted mt-1">
                Mastery of bows and precision strikes.
              </p>
            </div>
            <div className="bg-panel p-3 border border-border rounded-lg opacity-50">
              <span className="text-[10px] font-black text-purple-400 uppercase">
                Magic
              </span>
              <p className="text-[9px] text-tx-muted mt-1">
                Locked - Awaiting arcane update.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EnchantingArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter">
        The Great Forge
      </h2>
      <div className="p-6 bg-panel border border-border rounded-2xl relative overflow-hidden">
        <h4 className="text-xs font-black uppercase text-warning mb-4">
          Laws of Augmentation
        </h4>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="text-warning font-bold">I.</span>
            <span className="text-sm text-tx-muted">
              Every successful enchantment increases base power by{" "}
              <span className="text-success font-bold">+20%</span>.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="text-warning font-bold">II.</span>
            <span className="text-sm text-tx-muted">
              The forge can only stabilize an item up to{" "}
              <span className="text-warning font-bold">Level +5</span>.
            </span>
          </li>
          <li className="flex gap-4 p-3 bg-danger/10 border border-danger/20 rounded">
            <span className="text-xs text-danger font-black uppercase italic">
              Ancient artifacts (Boss Drops) cannot be enchanted; their power is
              absolute.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function TreasuresArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter">
        Spoils of War
      </h2>
      <p className="text-tx-muted text-sm">
        Every monster carries different loot. The quality of these treasures is
        determined by the stars.
      </p>
      <div className="space-y-2">
        <LootRow
          label="Common (Materials)"
          rate="Garanteed"
          color="text-slate-400"
        />
        <LootRow label="Rare (Gems)" rate="~10%" color="text-cyan-400" />
        <LootRow label="Boss Artifacts" rate="10%" color="text-purple-400" />
        <LootRow label="Legendary Loot" rate="~1%" color="text-warning" />
      </div>
    </div>
  );
}
function VendorsArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 text-left">
      <section>
        <h2 className="text-4xl font-black text-tx-main uppercase tracking-tighter mb-4">
          World Vendors
        </h2>
        <p className="text-tx-muted leading-relaxed mb-6">
          Regional Traders are the primary source for essential augmentation
          materials. These vendors require both{" "}
          <span className="text-tx-main font-bold">Coins</span> and{" "}
          <span className="text-tx-main font-bold">World Loot</span> extracted
          from the local wildlife.
        </p>
      </section>

      {/* SECTION: TRADING MECHANICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-panel border border-border rounded-xl">
          <h4 className="text-warning font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
            <img
              src="/assets/ui/coins.png"
              className="w-4 h-4 pixelated"
              alt=""
            />
            Exchange Protocol
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Purchasing items from World Vendors requires a combination of Gold
            and materials (Basic, Rare, or Exotic drops) from that specific
            world.
          </p>
        </div>
        <div className="p-5 bg-panel border border-border rounded-xl">
          <h4 className="text-warning font-black text-[10px] uppercase mb-3 tracking-widest flex items-center gap-2">
            <span>⏳</span>
            Daily Supply Limits
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Vendors have a{" "}
            <span className="text-danger font-bold">Strict Daily Limit</span> on
            their stock. This limit resets once every 24 hours.
          </p>
        </div>
      </div>

      {/* SECTION: ENCHANTMENT SCROLLS (THE FIX) */}
      <section className="bg-panel/30 border border-border/50 p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-warning uppercase tracking-[0.2em] mb-4">
          Enchantment Scroll Tiers (T1 - T4)
        </h3>
        <p className="text-xs text-tx-muted mb-4 leading-relaxed">
          Regional Merchants only stock scrolls ranging from{" "}
          <span className="text-tx-main font-bold">Tier 1 to Tier 4</span>. Each
          tier provides a different success probability when used to augment
          your equipment.
        </p>

        <div className="bg-app-base/40 p-4 border border-border/30 rounded-xl mb-4">
          <h4 className="text-[10px] font-black uppercase text-tx-main mb-2">
            Supply Scarcity Logic
          </h4>
          <p className="text-[11px] text-tx-muted leading-relaxed">
            As the Scroll Tier increases, the{" "}
            <span className="text-warning font-bold">
              Daily Cap decreases significantly
            </span>
            . While Tier 1 scrolls are abundant, Tier 4 scrolls are highly
            limited and should be purchased whenever available.
          </p>
        </div>

        <div className="space-y-2">
          <VendorTierRow
            world="World 1 (Greenvale)"
            item="Tier 1 Scroll"
            cost="Coins + World 1 Loot"
            cap="High Stock"
          />
          <VendorTierRow
            world="World 2 (Stonefall)"
            item="Tier 2 Scroll"
            cost="Coins + World 2 Loot"
            cap="Medium Stock"
          />
          <VendorTierRow
            world="World 3 (Ashridge)"
            item="Tier 3 Scroll"
            cost="Coins + World 3 Loot"
            cap="Low Stock"
          />
          <VendorTierRow
            world="World 4 (Frostreach)"
            item="Tier 4 Scroll"
            cost="Coins + World 4 Loot"
            cap="Minimal Stock"
          />
        </div>

        <p className="text-[10px] text-tx-muted mt-4 italic">
          *Note: No vendor currently stocks scrolls above Tier 4.
        </p>
      </section>

      {/* PRO TIP */}
      <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
        <p className="text-xs text-tx-muted">
          <span className="text-warning font-black uppercase mr-2">
            Pro Tip:
          </span>
          Do not hoard your world loot. Because of the daily limits, missing a
          day of purchases can delay your final{" "}
          <span className="text-tx-main font-bold">Enchantment +5</span>{" "}
          upgrades for weeks.
        </p>
      </div>
    </div>
  );
}

// Updated Helper for the table to include the CAP info
function VendorTierRow({
  world,
  item,
  cost,
  cap,
}: {
  world: string;
  item: string;
  cost: string;
  cap: string;
}) {
  return (
    <div className="flex justify-between items-center p-3 bg-app-base/50 border-b border-border/30 last:border-0">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-tx-main">
          {world}
        </span>
        <span className="text-[9px] text-tx-muted uppercase font-mono">
          {cost}
        </span>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-bold text-accent">{item}</div>
        <div
          className={`text-[9px] font-bold uppercase ${cap === "Minimal Stock" ? "text-danger" : "text-tx-muted opacity-60"}`}
        >
          {cap}
        </div>
      </div>
    </div>
  );
}

function LootRow({
  label,
  rate,
  color,
}: {
  label: string;
  rate: string;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center p-4 bg-panel border-b border-border">
      <span className={`text-xs font-black uppercase ${color}`}>{label}</span>
      <span className="text-[10px] font-mono font-bold text-tx-muted">
        {rate}
      </span>
    </div>
  );
}
function StatDetail({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/30 pb-2">
      <span className="text-[10px] font-black text-tx-main uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[10px] text-tx-muted leading-tight">{desc}</span>
    </div>
  );
}

function SkillRow({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-panel border border-border rounded-xl">
      <span className="text-xs font-black uppercase text-tx-main">{name}</span>
      <span className="text-[10px] text-tx-muted italic">{desc}</span>
    </div>
  );
}
