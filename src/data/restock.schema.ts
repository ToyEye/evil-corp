import { z } from "zod";

export const restockRequestSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  sku: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  note: z.string(),
  requestedById: z.string().min(1),
  requestedByName: z.string().min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const restockRequestsSchema = z.array(restockRequestSchema);

export type RestockRequest = z.infer<typeof restockRequestSchema>;
