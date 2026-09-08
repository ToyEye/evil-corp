import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { dummyClients } from "../../data/clients.dummy";
import type { Client, ClientAddress } from "../../data/clients.schema";

type ClientsState = {
  items: Client[];
};

type AddClientAddressPayload = {
  clientId: string;
  address: ClientAddress;
};

const initialState: ClientsState = {
  items: dummyClients,
};

export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      state.items.unshift(action.payload);
    },
    addClientAddress: (state, action: PayloadAction<AddClientAddressPayload>) => {
      const client = state.items.find((item) => item.id === action.payload.clientId);

      if (!client) {
        return;
      }

      client.addresses.push(action.payload.address);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
  },
  selectors: {
    selectClients: (state) => state.items,
  },
});

export const { addClient, addClientAddress, updateClient } = clientsSlice.actions;

export const { selectClients } = clientsSlice.selectors;

export default clientsSlice.reducer;
