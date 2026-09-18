import { z } from "zod";

export const DELIVERY_STATUSES = [
  "New",
  "Planned",
  "In transit",
  "Arrived",
  "Failed",
  "Canceled",
  "Done",
] as const;

export const deliveryStatusSchema = z.enum(DELIVERY_STATUSES);

export const FAILURE_REASONS = [
  "Customer absent",
  "Refused",
  "Wrong address",
  "Damaged goods",
  "Could not access site",
  "Other",
] as const;

export const failureReasonSchema = z.enum(FAILURE_REASONS);

export const deliveryItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const deliveryProofSchema = z.object({
  photoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  capturedAt: z.iso.datetime().optional(),
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
  stockWrittenOff: z.boolean(),
  vehicleId: z.string().min(1).optional(),
  vehicleName: z.string().min(1).optional(),
  routeId: z.string().min(1).optional(),
  routeNumber: z.string().min(1).optional(),
  stopIndex: z.number().int().nonnegative().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  orderId: z.string().min(1).optional(),
  orderNumber: z.string().min(1).optional(),
  shippedAt: z.iso.datetime().optional(),
  arrivedAt: z.iso.datetime().optional(),
  completedAt: z.iso.datetime().optional(),
  failureReason: failureReasonSchema.optional(),
  proof: deliveryProofSchema.optional(),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const deliveriesSchema = z.array(deliverySchema);

export type DeliveryStatus = z.infer<typeof deliveryStatusSchema>;
export type FailureReason = z.infer<typeof failureReasonSchema>;
export type DeliveryItem = z.infer<typeof deliveryItemSchema>;
export type DeliveryProof = z.infer<typeof deliveryProofSchema>;
export type Delivery = z.infer<typeof deliverySchema>;

export const TERMINAL_DELIVERY_STATUSES: DeliveryStatus[] = ["Canceled", "Done", "Failed"];

export const isDeliveryTerminal = (status: DeliveryStatus) =>
  TERMINAL_DELIVERY_STATUSES.includes(status);

export const hasDeliverySchedule = (dispatchAt?: string, deliverBy?: string) =>
  Boolean(dispatchAt || deliverBy);

export const canEditDeliveryAssignment = (status: DeliveryStatus) =>
  status === "New" || status === "Planned";

export const getDeliveryStatusFromSchedule = (dispatchAt?: string, deliverBy?: string): DeliveryStatus =>
  hasDeliverySchedule(dispatchAt, deliverBy) ? "Planned" : "New";

export const getDeliveryLoad = (delivery: Pick<Delivery, "items">) =>
  delivery.items.reduce((total, item) => total + item.quantity, 0);
