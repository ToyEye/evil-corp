import { z } from "zod";

export const SUPPLIER_TYPES = [
  "Manufacturer",
  "Distributor",
  "Wholesaler",
  "Service",
  "Carrier",
] as const;

export const supplierTypeSchema = z.enum(SUPPLIER_TYPES);

export const supplierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: supplierTypeSchema,
  addedAt: z.iso.date(),
  description: z.string().min(1),
  doesNotSupply: z.string().min(1),
  notes: z.string(),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
});

export const suppliersSchema = z.array(supplierSchema).refine(
  (items) => {
    const keys = items.map((item) => `${item.companyId}:${item.name.toLowerCase()}`);
    return new Set(keys).size === keys.length;
  },
  { message: "Supplier name must be unique within a company" },
);

export type SupplierType = z.infer<typeof supplierTypeSchema>;
export type Supplier = z.infer<typeof supplierSchema>;
