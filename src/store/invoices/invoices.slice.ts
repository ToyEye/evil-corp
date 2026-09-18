import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyInvoices } from "../../data/invoices.dummy";
import type { Invoice } from "../../data/invoices.schema";

type InvoicesState = {
  items: Invoice[];
};

const initialState: InvoicesState = {
  items: dummyInvoices,
};

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.items.unshift(action.payload);
    },
  },
  selectors: {
    selectInvoices: (state) => state.items,
  },
});

export const { addInvoice } = invoicesSlice.actions;

export const { selectInvoices } = invoicesSlice.selectors;

export default invoicesSlice.reducer;
