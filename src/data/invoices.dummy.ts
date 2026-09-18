import { dummyOrders } from "./orders.dummy";
import { getOrderTotal } from "./orders.schema";
import { invoicesSchema, type Invoice } from "./invoices.schema";

const paidOrders = dummyOrders.filter((order) => order.status === "Paid");

const dummyInvoicesData: Invoice[] = paidOrders.map((order, index) => ({
  id: `invoice-${index + 1}`,
  number: `INV-${1000 + index + 1}`,
  orderId: order.id,
  orderNumber: order.number,
  clientId: order.clientId,
  clientName: order.clientName,
  status: "Paid",
  total: getOrderTotal(order.items),
  companyId: order.companyId,
  companyName: order.companyName,
  createdAt: order.createdAt,
  paidAt: order.createdAt,
}));

export const dummyInvoices = invoicesSchema.parse(dummyInvoicesData);
