import { useState, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemDetails } from "../../data";
import type { InventoryItem } from "./InventoryGrid";

export type SortType = "rarity" | "level" | "amount" | "value";

// PÄIVITETTY: consumables -> potions
export type FilterType =
  | "all"
  | "weapons"
  | "armor"
  | "runes"
  | "pouches"
  | "potions"
  | "materials"
  | "misc";

const RARITY_WEIGHTS: Record<string, number> = {
  legendary: 4,
  epic: 3,
  rare: 2,
  uncommon: 1,
  common: 0,
};

export function useInventoryFiltering() {
  const inventory = useGameStore((state) => state.inventory);

  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("rarity");
  const [sortDesc, setSortDesc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const rawItems = useMemo(() => {
    return Object.entries(inventory)
      .map(([id, count]) => {
        const details = getItemDetails(id);
        if (!details) return null;
        return { ...details, count } as InventoryItem;
      })
      .filter(
        (item): item is InventoryItem =>
          item !== null && item.name !== undefined && item.count > 0,
      );
  }, [inventory]);

  const processedItems = useMemo(() => {
    let result = [...rawItems];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.description?.toLowerCase().includes(query),
      );
    }

    if (filter !== "all") {
      result = result.filter((i) => {
        // Tunnistuslogiikka kategorioille
        const isWeapon = i.slot === "weapon";
        const isArmor = [
          "head",
          "body",
          "legs",
          "shield",
          "necklace",
          "ring",
        ].includes(i.slot as string);
        const isRune = i.id.startsWith("rune_") || i.slot === "rune";
        const isPouch = i.id.startsWith("pouch_mystery_");
        // isConsumable kattaa edelleen ruoat ja potionit "Potions" välilehdelle
        const isConsumable =
          i.slot === "food" || i.category === "potion" || i.category === "Food";
        const isMaterial = [
          "ingot",
          "plank",
          "material",
          "ore",
          "log",
        ].includes(i.category as string);

        switch (filter) {
          case "weapons":
            return isWeapon;
          case "armor":
            return isArmor;
          case "runes":
            return isRune;
          case "pouches":
            return isPouch;
          case "potions": // Päivitetty case
            return isConsumable;
          case "materials":
            return isMaterial;
          case "misc":
            return (
              !isWeapon &&
              !isArmor &&
              !isRune &&
              !isPouch &&
              !isConsumable &&
              !isMaterial
            );
          default:
            return true;
        }
      });
    }

    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      switch (sortBy) {
        case "rarity":
          valA = RARITY_WEIGHTS[a.rarity] || 0;
          valB = RARITY_WEIGHTS[b.rarity] || 0;
          break;
        case "level":
          valA = a.level || 0;
          valB = b.level || 0;
          break;
        case "amount":
          valA = a.count;
          valB = b.count;
          break;
        case "value":
          valA = a.value;
          valB = b.value;
          break;
      }
      if (valA === valB) return a.name.localeCompare(b.name);
      return sortDesc ? valB - valA : valA - valB;
    });

    return result;
  }, [rawItems, filter, sortBy, sortDesc, searchQuery]);

  const toggleSort = (type: SortType) => {
    if (sortBy === type) setSortDesc(!sortDesc);
    else {
      setSortBy(type);
      setSortDesc(true);
    }
  };

  return {
    items: processedItems,
    filter,
    setFilter,
    sortBy,
    sortDesc,
    toggleSort,
    searchQuery,
    setSearchQuery,
  };
}
