import type { Delivery } from "../../data/deliveries.schema";

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
