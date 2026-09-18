import { z } from "zod";

export const RESTOCK_STATUSES = ["New", "Confirmed", "Delivered", "Received"] as const;
export const RESTOCK_PURPOSES = ["order", "warehouse"] as const;

export const restockStatusSchema = z.enum(RESTOCK_STATUSES);
export const restockPurposeSchema = z.enum(RESTOCK_PURPOSES);

export const RESTOCK_STATUS_LABELS: Record<(typeof RESTOCK_STATUSES)[number], string> = {
  New: "New",
  Confirmed: "Confirmed",
  Delivered: "At dock",
  Received: "Received",
};

export const RESTOCK_PURPOSE_LABELS: Record<(typeof RESTOCK_PURPOSES)[number], string> = {
  order: "Addition to order",
  warehouse: "Warehouse restock",
};

export const restockRequestSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  sku: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  note: z.string(),
  status: restockStatusSchema,
  purposes: z.array(restockPurposeSchema).min(1),
  orderId: z.string().min(1).optional(),
  orderNumber: z.string().min(1).optional(),
  requestedById: z.string().min(1),
  requestedByName: z.string().min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const restockRequestsSchema = z.array(restockRequestSchema);

export type RestockStatus = z.infer<typeof restockStatusSchema>;
export type RestockPurpose = z.infer<typeof restockPurposeSchema>;
export type RestockRequest = z.infer<typeof restockRequestSchema>;

export const getRestockPurposeLabel = (request: RestockRequest) => {
  const parts: string[] = [];

  if (request.purposes.includes("order")) {
    parts.push(request.orderNumber || request.note.trim() || RESTOCK_PURPOSE_LABELS.order);
  }

  if (request.purposes.includes("warehouse")) {
    parts.push(RESTOCK_PURPOSE_LABELS.warehouse);
  }

  return parts.join(" · ") || "—";
};

export const getNextRestockStatus = (status: RestockStatus): RestockStatus | undefined => {
  if (status === "New") {
    return "Confirmed";
  }

  if (status === "Confirmed") {
    return "Delivered";
  }

  if (status === "Delivered") {
    return "Received";
  }

  return undefined;
};

export const canSupplyAdvanceRestock = (status: RestockStatus) =>
  status === "New" || status === "Confirmed";

export const canReceiveRestock = (status: RestockStatus) => status === "Delivered";
