// src/data/chatColors.ts
export interface ChatColor {
  id: string;
  name: string;
  style: {
    color?: string;
    background?: string;
    webkitBackgroundClip?: string;
    webkitTextFillColor?: string;
  };
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export const CHAT_COLORS: ChatColor[] = [
  {
    id: "default",
    name: "Standard White",
    style: { color: "#ffffff" },
    rarity: "common",
  },
  {
    id: "sky",
    name: "Sky Weaver",
    style: { color: "#3bd5ff" },
    rarity: "uncommon",
  },
  {
    id: "emerald",
    name: "Emerald Knight",
    style: { color: "#2ecc71" },
    rarity: "rare",
  },
  {
    id: "sakura",
    name: "Neon Sakura",
    style: { color: "#ff7eb3" },
    rarity: "rare",
  },
  {
    id: "Millionaire",
    name: "Millionaire",
    style: {
      background:
        "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
      webkitBackgroundClip: "text",
      webkitTextFillColor: "transparent",
    },
    rarity: "epic",
  },
  {
    id: "fisherking",
    name: "The Fisher",
    style: {
      background: "linear-gradient(to right, #00c6ff, #0072ff)",
      webkitBackgroundClip: "text",
      webkitTextFillColor: "transparent",
    },
    rarity: "epic",
  },
  {
    id: "nexuslord",
    name: "Nexus Lord",
    style: {
      background: "linear-gradient(to right, #f12711, #f5af19)",
      webkitBackgroundClip: "text",
      webkitTextFillColor: "transparent",
    },
    rarity: "legendary",
  },
  {
    id: "dev",
    name: "System Admin",
    style: {
      background: "linear-gradient(to right, #ff0844, #ffb199, #ff0844)",
      webkitBackgroundClip: "text",
      webkitTextFillColor: "transparent",
    },
    rarity: "legendary",
  },
];
