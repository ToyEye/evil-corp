import { z } from "zod";

export const ORDER_STATUSES = ["New", "Paid"] as const;
export const FULFILLMENT_STATUSES = ["Waiting", "Reserved", "Picking", "Ready"] as const;

export const orderStatusSchema = z.enum(ORDER_STATUSES);
export const fulfillmentStatusSchema = z.enum(FULFILLMENT_STATUSES);

export const ORDER_STATUS_LABELS: Record<(typeof ORDER_STATUSES)[number], string> = {
  New: "New",
  Paid: "Paid",
};

export const FULFILLMENT_STATUS_LABELS: Record<(typeof FULFILLMENT_STATUSES)[number], string> = {
  Waiting: "Waiting for stock",
  Reserved: "Ready to pick",
  Picking: "Picking",
  Ready: "Ready to ship",
};

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  reservedQuantity: z.number().int().nonnegative(),
  pickedQuantity: z.number().int().nonnegative(),
});

export const orderSchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  addressId: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  notes: z.string(),
  status: orderStatusSchema,
  fulfillmentStatus: fulfillmentStatusSchema,
  items: z.array(orderItemSchema).min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const ordersSchema = z.array(orderSchema);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type FulfillmentStatus = z.infer<typeof fulfillmentStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;

export const getOrderLineTotal = (item: Pick<OrderItem, "quantity" | "unitPrice">) =>
  item.quantity * item.unitPrice;

export const getOrderTotal = (items: Pick<OrderItem, "quantity" | "unitPrice">[]) =>
  items.reduce((total, item) => total + getOrderLineTotal(item), 0);

export const isOrderFullyReserved = (order: Pick<Order, "items">) =>
  order.items.every((item) => item.reservedQuantity >= item.quantity);

export const isOrderFullyPicked = (order: Pick<Order, "items">) =>
  order.items.every((item) => item.pickedQuantity >= item.quantity);

export const isOrderReadyToShip = (order: Pick<Order, "fulfillmentStatus" | "items">) =>
  order.fulfillmentStatus === "Ready" && isOrderFullyReserved(order);

export const nextFulfillmentFromStock = (
  order: Pick<Order, "fulfillmentStatus" | "items">,
): FulfillmentStatus => {
  if (!isOrderFullyReserved(order)) {
    return order.fulfillmentStatus === "Picking" || order.fulfillmentStatus === "Ready"
      ? order.fulfillmentStatus
      : "Waiting";
  }

  if (order.fulfillmentStatus === "Waiting") {
    return "Reserved";
  }

  return order.fulfillmentStatus;
};

export const findOrderByNote = (
  note: string,
  orders: Order[],
  companyId: string,
) => {
  const haystack = note.toUpperCase();

  return orders.find(
    (order) => order.companyId === companyId && haystack.includes(order.number.toUpperCase()),
  );
};
