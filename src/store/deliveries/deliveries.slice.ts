import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ClientAddress } from "../../data/clients.schema";
import { dummyDeliveries } from "../../data/deliveries.dummy";
import type { Delivery, DeliveryStatus } from "../../data/deliveries.schema";

type DeliveriesState = {
  items: Delivery[];
};

type UpdateDeliveryStatusPayload = {
  id: string;
  status: DeliveryStatus;
};

type SyncDeliveryClientPayload = {
  clientId: string;
  clientName: string;
  addresses: ClientAddress[];
};

const initialState: DeliveriesState = {
  items: dummyDeliveries,
};

export const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    addDelivery: (state, action: PayloadAction<Delivery>) => {
      state.items.unshift(action.payload);
    },
    updateDeliveryStatus: (state, action: PayloadAction<UpdateDeliveryStatusPayload>) => {
      const delivery = state.items.find((item) => item.id === action.payload.id);

      if (!delivery || delivery.status === "Canceled" || delivery.status === "Done") {
        return;
      }

      delivery.status = action.payload.status;
    },
    syncDeliveryClient: (state, action: PayloadAction<SyncDeliveryClientPayload>) => {
      for (const delivery of state.items) {
        if (delivery.clientId !== action.payload.clientId) {
          continue;
        }

        delivery.clientName = action.payload.clientName;
        const address = action.payload.addresses.find((item) => item.id === delivery.addressId);

        if (address) {
          delivery.destination = address.line;
        }
      }
    },
  },
  selectors: {
    selectDeliveries: (state) => state.items,
  },
});

export const { addDelivery, updateDeliveryStatus, syncDeliveryClient } =
  deliveriesSlice.actions;

export const { selectDeliveries } = deliveriesSlice.selectors;

export default deliveriesSlice.reducer;
