import { z } from "zod";

export const DELIVERY_STATUSES = [
  "New",
  "Planned",
  "In transit",
  "Canceled",
  "Done",
] as const;

export const deliveryStatusSchema = z.enum(DELIVERY_STATUSES);

export const deliveryItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const deliverySchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  driverId: z.string().min(1).optional(),
  driverName: z.string().min(1).optional(),
  addressId: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  dispatchAt: z.string().optional(),
  deliverBy: z.string().optional(),
  notes: z.string(),
  status: deliveryStatusSchema,
  items: z.array(deliveryItemSchema).min(1),
  reservesStock: z.boolean(),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const deliveriesSchema = z.array(deliverySchema);

export type DeliveryStatus = z.infer<typeof deliveryStatusSchema>;
export type DeliveryItem = z.infer<typeof deliveryItemSchema>;
export type Delivery = z.infer<typeof deliverySchema>;

export const getDeliveryStatusFromSchedule = (dispatchAt?: string, deliverBy?: string): DeliveryStatus =>
  dispatchAt || deliverBy ? "Planned" : "New";
