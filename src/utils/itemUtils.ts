import { getItemDetails } from "../data";
import type { Resource } from "../types";

/**
 * getItemById
 * Serves as a wrapper around the dynamic central factory (getItemDetails).
 * Ensures that generated items (like enchanted gear or randomized keys) are
 * resolved correctly, converting nulls to undefined to maintain type safety.
 */
export const getItemById = (id: string): Resource | undefined => {
  const item = getItemDetails(id);
  return item !== null ? item : undefined;
};
