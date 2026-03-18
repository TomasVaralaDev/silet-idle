export interface GemPack {
  id: string;
  name: string;
  gems: number;
  price: number;
  description: string;
  color: string; // Käytetään UI-tehosteisiin
}

export const GEM_PACKS: GemPack[] = [
  {
    id: "gems_400",
    name: "Gem Pouch",
    gems: 400,
    price: 5,
    description: "A small pouch of gems to get you started.",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "gems_1000",
    name: "Gem Chest",
    gems: 1000,
    price: 10,
    description: "Best for casual adventurers. 25% extra value!",
    color: "from-cyan-500 to-cyan-700",
  },
  {
    id: "gems_2500",
    name: "Gem Vault",
    gems: 2500,
    price: 20,
    description: "Massive hoard of gems. 56% extra value!",
    color: "from-purple-500 to-purple-700",
  },
];
