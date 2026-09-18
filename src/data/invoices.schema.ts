import { z } from "zod";

export const INVOICE_STATUSES = ["Paid"] as const;

export const invoiceStatusSchema = z.enum(INVOICE_STATUSES);

export const invoiceSchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1),
  orderId: z.string().min(1),
  orderNumber: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  status: invoiceStatusSchema,
  total: z.number().nonnegative(),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  createdAt: z.iso.datetime(),
  paidAt: z.iso.datetime(),
});

export const invoicesSchema = z.array(invoiceSchema);

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
