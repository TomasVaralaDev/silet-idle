import React from "react";
import IndexArticle from "./articles/IndexArticle";
import BasicsArticle from "./articles/BasicsArticle";
import CombatArticle from "./articles/CombatArticle";
import EquipmentArticle from "./articles/EquipmentArticle";
import EnchantingArticle from "./articles/EnchantingArticle";
import VendorsArticle from "./articles/VendorsArticle";
import TreasuresArticle from "./articles/TreasuresArticle";
import ExpeditionsArticle from "./articles/ExpeditionsArticle";
import QuestsArticle from "./articles/QuestsArticle";
import EconomyArticle from "./articles/EconomyArticle";
import AutomationArticle from "./articles/AutomationArticle";

export type WikiTabId =
  | "index"
  | "basics"
  | "automation"
  | "equipment"
  | "combat"
  | "enchanting"
  | "expeditions"
  | "quests"
  | "vendors"
  | "economy"
  | "treasures";

export interface WikiTabDef {
  id: WikiTabId;
  label: string;
  icon: string;
  desc: string;
  component: React.FC<{ setActiveTab: (id: WikiTabId) => void }>;
}

{
  // Wiki tabs ordered by game progression
}
export const WIKI_TABS: WikiTabDef[] = [
  {
    id: "index",
    label: "Index",
    icon: "./assets/ui/icon_guide.png",
    desc: "Table of Contents",
    component: IndexArticle,
  },
  {
    id: "basics",
    label: "Hero's Path",
    icon: "./assets/ui/icon_guide.png",
    desc: "The Journey Begins",
    component: BasicsArticle,
  },
  {
    id: "automation",
    label: "Automation",
    icon: "./assets/ui/icon_clock.png",
    desc: "Offline & Queue",
    component: AutomationArticle,
  },
  {
    id: "equipment",
    label: "Equiqment",
    icon: "./assets/ui/icon_inventory.png",
    desc: "Weapons & Protection",
    component: EquipmentArticle,
  },
  {
    id: "combat",
    label: "Combat",
    icon: "./assets/skills/combat.png",
    desc: "Combat & Tactics",
    component: CombatArticle,
  },
  {
    id: "enchanting",
    label: "Enchanting",
    icon: "./assets/ui/icon_enchanting.png",
    desc: "Magical Augmentation",
    component: EnchantingArticle,
  },
  {
    id: "expeditions",
    label: "Expeditions",
    icon: "./assets/skills/scavenging.png",
    desc: "Scavenging Missions",
    component: ExpeditionsArticle,
  },
  {
    id: "quests",
    label: "Daily Quests",
    icon: "./assets/ui/icon_quest.png",
    desc: "Bounties & Tasks",
    component: QuestsArticle,
  },
  {
    id: "vendors",
    label: "World Vendors",
    icon: "./assets/ui/icon_market.png",
    desc: "Regional Trade Hubs",
    component: VendorsArticle,
  },
  {
    id: "economy",
    label: "Economy",
    icon: "./assets/ui/coins.png",
    desc: "Markets & Trade",
    component: EconomyArticle,
  },
  {
    id: "treasures",
    label: "Enemy Drops",
    icon: "./assets/ui/icon_quest.png",
    desc: "Drops & Rarities",
    component: TreasuresArticle,
  },
];
