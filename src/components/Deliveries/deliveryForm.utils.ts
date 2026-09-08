import type { Delivery, DeliveryItem } from "../../data/deliveries.schema";
import type { InventoryItem } from "../../data/inventory.schema";

export type SplitDeliveryLine = DeliveryItem;

export const nextDeliveryNumber = (
  deliveries: Delivery[],
  companyId: string,
  offset = 0,
) => {
  const maxNumber = deliveries
    .filter((item) => item.companyId === companyId)
    .reduce((max, item) => {
      const match = item.number.match(/(\d+)$/);
      return Math.max(max, match ? Number(match[1]) : 0);
    }, 0);

  return `DLV-${String(maxNumber + 1 + offset).padStart(4, "0")}`;
};

export const splitDeliveryLines = (
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

  const inStock: SplitDeliveryLine[] = [];
  const backorder: SplitDeliveryLine[] = [];

  for (const [productId, requested] of totals) {
    const product = inventory.find((item) => item.id === productId);

    if (!product) {
      continue;
    }

    const available = Math.max(0, product.quantity);
    const stockQty = Math.min(requested, available);
    const shortageQty = requested - stockQty;

    if (stockQty > 0) {
      inStock.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: stockQty,
      });
    }

    if (shortageQty > 0) {
      backorder.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: shortageQty,
      });
    }
  }

  return { inStock, backorder };
};

export const getShortageSignature = (backorder: SplitDeliveryLine[]) =>
  backorder
    .map((item) => `${item.productId}:${item.quantity}`)
    .sort()
    .join("|");
