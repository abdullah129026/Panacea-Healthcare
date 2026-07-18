import type { ISODateString, TenantScoped } from "./common";

export type InventoryCategory =
  | "Pharmaceuticals"
  | "Equipment"
  | "Supplies"
  | "Other";

export const INVENTORY_CATEGORIES: readonly InventoryCategory[] = [
  "Pharmaceuticals",
  "Equipment",
  "Supplies",
  "Other",
];

/** Derived stock health, mirroring the low-stock badges in the inventory UI. */
export type StockStatus = "In Stock" | "Low" | "Critical" | "Out of Stock";

export type InventoryItem = TenantScoped & {
  id: string;
  name: string;
  category: InventoryCategory;
  sku: string;
  vendor: string;
  quantity: number;
  reorderLevel: number;
  status: StockStatus;
  /** Unit cost in minor currency units (cents). */
  unitCost: number;
  currency: string;
  updatedAt: ISODateString;
};
