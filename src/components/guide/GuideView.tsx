import { BookOpen, ChevronRight, Star, AlertTriangle } from "lucide-react";

export default function GuideView() {
  // Data structure containing all guide chapters and their descriptions
  const sections = [
    {
      id: "gathering",
      title: "01. The First Steps: Gathering",
      content: `Welcome to the World of Nexus Idle. To survive, you must first gather resources. Your gathering skills run continuously even while offline:
      
      • Woodcutting: Chop trees to gather logs. Logs are essential for crafting weapons.
      • Mining: Mine veins to gather raw ores. Ores are the foundation of your armor, weapons and accessories.
      • Foraging & Alchemy: Collect Potions. Never ignore this! Potions are the only way to restore Health (HP) during combat.`,
    },
    {
      id: "crafting",
      title: "02. Production & Smithing",
      content: `Raw materials are useless on their own. You need to process them into usable gear:
      
      1. Smelting: Take your mined ores to the furnace to create Ingots (e.g., Copper Ingots).
      2. Smithing: Use ingots at the anvil to forge Armor (increases Defense) and Weapons (increases Melee/Attack).
      3. Crafting: Turn logs into planks or craft accessories like rings and necklaces to boost your stats.`,
    },
    {
      id: "combat",
      title: "03. Combat & Survival",
      content: `Once you have armor, a weapon, and food, you are ready to fight.
      
      • Combat Styles: Melee relies on strength, Ranged on precision, and Magic on runes. Choose a weapon that fits your style.
      • Auto-Eat: In the Combat view, set your Auto-Eat threshold (e.g., 50%). If your HP drops below this, you will automatically consume equipped food.
      • Death Penalty: If your HP reaches 0, you will die, losing progress and a portion of your XP. Always Retreat if you run out of food!`,
    },
    {
      id: "automation",
      title: "04. The Action Queue",
      content: `TimeRing is an idle game, meaning automation is your best friend.
      
      • Queueing: You can queue multiple actions. For example, tell your character to mine 1,000 Copper, then smelt 500 Ingots.
      • Offline Progress: When you close the game, your character continues working on the Queue.
      • Upgrades: You start with limited Queue slots. You can buy more slots in the Gem Store or unlock them via achievements.`,
    },
    {
      id: "scavenging",
      title: "05. Scavenging Expeditions",
      content: `You don't have to do everything yourself. Scavenging allows you to send idle expeditions to gather rare loot.
      
      • Send your scouts to different locations for a set duration (e.g., 2 hours, 8 hours).
      • When they return, claim your loot, which can include rare artifacts, materials, and coins.
      • Expeditions run entirely in the background and do not interrupt your main Queue.`,
    },
    {
      id: "upgrades",
      title: "06. Enchanting & Magic",
      content: `When standard gear isn't enough to defeat a zone, it's time to use magic.
      
      • Enchanting Scrolls: Obtained from monster drops or crafting. Use them to upgrade your gear (e.g., Copper Sword +1).
      • Success Rates: Enchanting has a chance to fail. The higher the item's level, the harder it is to enchant.
      • Alchemy: Brew potions using foraged herbs to gain temporary combat or skilling buffs.`,
    },
    {
      id: "progression",
      title: "07. Bosses & World Progression",
      content: `Your ultimate goal is to restore the worlds.
      
      • Clearing Zones: Defeat a specific number of enemies to clear a zone and move to the next.
      • World Bosses: At the end of every world, a powerful Boss awaits. They hit hard and require high-tier food and enchanted gear.
      • Boss Keys: Defeating a world boss grants a Key, unlocking the next, more dangerous world.`,
    },
    {
      id: "economy",
      title: "08. Economy & Marketplace",
      content: `You are not alone in this universe. Use the economy to your advantage:
      
      • World Vendors: NPC shops that sell basic supplies, upgrade materials, and rare pouches.
      • Global Marketplace: Trade directly with other players. Sell your surplus materials or buy that one rare drop you've been grinding for.
      • Global Chat: Press the chat icon to talk, ask for advice, or negotiate trades with other Restorers.`,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-app-base text-tx-main font-sans animate-in fade-in duration-500 overflow-y-auto custom-scrollbar pb-24 text-left">
      {
        // View Header Section
      }
      <header className="p-8 border-b border-border/50 bg-panel/30 shrink-0">
        <div className="flex items-center gap-4 mb-2 text-accent">
          <BookOpen size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
            Official Manual
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-tx-main">
          Restorer's Guide
        </h1>
        <p className="text-tx-muted text-xs mt-2 font-medium leading-relaxed uppercase tracking-wider">
          Everything you need to survive the fractured worlds.
        </p>
      </header>

      {
        // Main Scrollable Content Area
      }
      <main className="p-6 md:p-10 space-y-12 max-w-2xl mx-auto">
        {sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <h2 className="text-accent text-xl font-black uppercase tracking-widest flex items-center gap-3 border-b border-border/50 pb-2">
              <ChevronRight size={20} className="text-tx-muted" />
              {section.title}
            </h2>

            <div className="bg-panel/50 border-l-2 border-accent/50 p-6 rounded-r-xl shadow-inner">
              <p className="text-tx-muted/90 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {section.content}
              </p>
            </div>
          </section>
        ))}

        {
          // Footer Notice for dynamic updates
        }
        <section className="bg-warning/10 border border-warning/30 p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">
              Important Notice
            </h3>
          </div>
          <p className="text-[11px] text-tx-muted/80 leading-relaxed italic font-medium">
            This guide is updated as the game evolves. If you run into issues,
            you can always ask for help from other Restorers in the Global Chat.
          </p>
        </section>

        {
          // Visual Footer Decoration
        }
        <div className="flex justify-center py-10 opacity-30 text-accent">
          <div className="flex gap-4">
            <Star size={12} />
            <Star size={12} />
            <Star size={12} />
          </div>
        </div>
      </main>
    </div>
  );
}
