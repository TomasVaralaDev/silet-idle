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
    id: "gold",
    name: "Golden Hero",
    style: {
      background:
        "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
      webkitBackgroundClip: "text",
      webkitTextFillColor: "transparent",
    },
    rarity: "epic",
  },
  {
    id: "void",
    name: "Void Walker",
    style: {
      background: "linear-gradient(45deg, #2c3e50, #000000, #4a00e0)",
      webkitBackgroundClip: "text",
      webkitTextFillColor: "transparent",
    },
    rarity: "legendary",
  },
  {
    id: "emerald",
    name: "Emerald Knight",
    style: { color: "#2ecc71" },
    rarity: "rare",
  },
];
