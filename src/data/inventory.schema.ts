import { z } from "zod";

export const INVENTORY_CATEGORIES = [
  "Packaging",
  "Spare parts",
  "Consumables",
  "Equipment",
  "Safety",
] as const;

export const inventoryCategorySchema = z.enum(INVENTORY_CATEGORIES);

export const WAREHOUSE_ZONES = ["Dock", "Chill", "Bulk", "Pick", "Safety"] as const;

export const warehouseZoneSchema = z.enum(WAREHOUSE_ZONES);

export const inventoryItemSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  category: inventoryCategorySchema,
  zone: warehouseZoneSchema,
  bin: z.string().min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
});

export const inventoryItemsSchema = z.array(inventoryItemSchema).refine(
  (items) => {
    const keys = items.map((item) => `${item.companyId}:${item.sku.toLowerCase()}`);
    return new Set(keys).size === keys.length;
  },
  { message: "SKU must be unique within a company" },
);

export type InventoryCategory = z.infer<typeof inventoryCategorySchema>;
export type WarehouseZone = z.infer<typeof warehouseZoneSchema>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const ZONE_BY_CATEGORY: Record<InventoryCategory, WarehouseZone> = {
  Packaging: "Bulk",
  "Spare parts": "Pick",
  Consumables: "Chill",
  Equipment: "Dock",
  Safety: "Safety",
};
