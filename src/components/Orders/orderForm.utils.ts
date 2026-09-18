import type { InventoryItem } from "../../data/inventory.schema";
import type { Order, OrderItem } from "../../data/orders.schema";

export type SplitOrderLine = OrderItem;

export const nextOrderNumber = (orders: Order[], companyId: string) => {
  const maxNumber = orders
    .filter((item) => item.companyId === companyId)
    .reduce((max, item) => {
      const match = item.number.match(/(\d+)$/);
      return Math.max(max, match ? Number(match[1]) : 0);
    }, 0);

  return `ORD-${String(maxNumber + 1).padStart(4, "0")}`;
};

export const splitOrderLines = (
  lines: { productId: string; quantity: number }[],
  inventory: InventoryItem[],
) => {
  const totals = new Map<string, number>();

  for (const line of lines) {
    if (!line.productId) {
      continue;
    }

    const qty = Number(line.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      continue;
    }

    totals.set(line.productId, (totals.get(line.productId) ?? 0) + qty);
  }

  const items: SplitOrderLine[] = [];
  const backorder: SplitOrderLine[] = [];

  for (const [productId, requested] of totals) {
    const product = inventory.find((item) => item.id === productId);

    if (!product) {
      continue;
    }

    const available = Math.max(0, product.quantity);
    const reservedQuantity = Math.min(requested, available);
    const shortageQty = requested - reservedQuantity;
    const item: SplitOrderLine = {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: requested,
      unitPrice: product.price,
      reservedQuantity,
      pickedQuantity: 0,
    };

    items.push(item);

    if (shortageQty > 0) {
      backorder.push({
        ...item,
        quantity: shortageQty,
        reservedQuantity: 0,
      });
    }
  }

  return { items, backorder };
};

export const getShortageSignature = (backorder: SplitOrderLine[]) =>
  backorder
    .map((item) => `${item.productId}:${item.quantity}`)
    .sort()
    .join("|");
