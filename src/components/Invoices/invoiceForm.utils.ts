import type { Invoice } from "../../data/invoices.schema";

export const nextInvoiceNumber = (invoices: Invoice[], companyId: string) => {
  const maxNumber = invoices
    .filter((item) => item.companyId === companyId)
    .reduce((max, item) => {
      const value = Number(item.number.replace(/\D/g, ""));
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 1000);

  return `INV-${maxNumber + 1}`;
};
