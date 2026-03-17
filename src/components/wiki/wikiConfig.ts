import BasicsArticle from "./articles/BasicsArticle";
import CombatArticle from "./articles/CombatArticle";
import EquipmentArticle from "./articles/EquipmentArticle";
import EnchantingArticle from "./articles/EnchantingArticle";
import VendorsArticle from "./articles/VendorsArticle";
import TreasuresArticle from "./articles/TreasuresArticle";
import ExpeditionsArticle from "./articles/ExpeditionsArticle";
import QuestsArticle from "./articles/QuestsArticle";
import EconomyArticle from "./articles/EconomyArticle";
import AutomationArticle from "./articles/AutomationArticle"; // UUSI

export type WikiTabId =
  | "basics"
  | "combat"
  | "equipment"
  | "enchanting"
  | "vendors"
  | "treasures"
  | "expeditions"
  | "quests"
  | "economy"
  | "automation"; // UUSI

export interface WikiTabDef {
  id: WikiTabId;
  label: string;
  icon: string;
  desc: string;
  component: React.FC;
}

export const WIKI_TABS: WikiTabDef[] = [
  {
    id: "basics",
    label: "Hero's Path",
    icon: "/assets/ui/icon_guide.png",
    desc: "The Journey Begins",
    component: BasicsArticle,
  },
  {
    id: "automation",
    label: "Automation",
    icon: "/assets/ui/icon_clock.png",
    desc: "Offline & Queue",
    component: AutomationArticle,
  }, // LISÄTTY TÄHÄN
  {
    id: "combat",
    label: "Art of War",
    icon: "/assets/skills/combat.png",
    desc: "Combat & Tactics",
    component: CombatArticle,
  },
  {
    id: "equipment",
    label: "The Armory",
    icon: "/assets/ui/icon_inventory.png",
    desc: "Weapons & Protection",
    component: EquipmentArticle,
  },
  {
    id: "enchanting",
    label: "The Forge",
    icon: "/assets/ui/icon_enchanting.png",
    desc: "Magical Augmentation",
    component: EnchantingArticle,
  },
  {
    id: "vendors",
    label: "World Vendors",
    icon: "/assets/ui/icon_market.png",
    desc: "Regional Trade Hubs",
    component: VendorsArticle,
  },
  {
    id: "treasures",
    label: "Spoils of War",
    icon: "/assets/ui/icon_quest.png",
    desc: "Drops & Rarities",
    component: TreasuresArticle,
  },
  {
    id: "expeditions",
    label: "Expeditions",
    icon: "/assets/skills/scavenging.png",
    desc: "Scavenging Missions",
    component: ExpeditionsArticle,
  },
  {
    id: "quests",
    label: "Daily Quests",
    icon: "/assets/ui/icon_quest.png",
    desc: "Bounties & Tasks",
    component: QuestsArticle,
  },
  {
    id: "economy",
    label: "Economy",
    icon: "/assets/ui/coins.png",
    desc: "Markets & Trade",
    component: EconomyArticle,
  },
];
