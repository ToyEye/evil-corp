import { getOrderTotal, type Order } from "../../data/orders.schema";
import type { User } from "../../data/users.schema";
import { nextInvoiceNumber } from "../../components/Invoices/invoiceForm.utils";
import { addInvoice } from "../invoices/invoices.slice";
import { logOpsEvent } from "../ops/logOpsEvent";
import { paths } from "../../routing/routes";
import type { AppDispatch, RootState } from "../types";

export const issueInvoiceForOrder =
  (order: Order, actor: User) => (dispatch: AppDispatch, getState: () => RootState) => {
    const existing = getState().invoices.items.find((item) => item.orderId === order.id);

    if (existing) {
      return existing;
    }

    const createdAt = new Date().toISOString();
    const invoice = {
      id: crypto.randomUUID(),
      number: nextInvoiceNumber(getState().invoices.items, order.companyId),
      orderId: order.id,
      orderNumber: order.number,
      clientId: order.clientId,
      clientName: order.clientName,
      status: "Paid" as const,
      total: getOrderTotal(order.items),
      companyId: order.companyId,
      companyName: order.companyName,
      createdAt,
      paidAt: createdAt,
    };

    dispatch(addInvoice(invoice));
    dispatch(
      logOpsEvent({
        companyId: order.companyId,
        entityType: "invoice",
        entityId: invoice.id,
        entityNumber: invoice.number,
        message: `Invoice issued from ${order.number}`,
        actorId: actor.id,
        actorName: actor.name,
        notify: [
          {
            role: "SEO",
            title: "Invoice issued",
            body: `${invoice.number} for ${order.clientName}`,
            href: paths.invoices(actor.companyName),
          },
        ],
      }),
    );

    return invoice;
  };
