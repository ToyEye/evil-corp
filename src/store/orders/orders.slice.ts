import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ClientAddress } from "../../data/clients.schema";
import { dummyOrders } from "../../data/orders.dummy";
import {
  isOrderFullyPicked,
  nextFulfillmentFromStock,
  type Order,
  type OrderStatus,
} from "../../data/orders.schema";

type OrdersState = {
  items: Order[];
};

type UpdateOrderStatusPayload = {
  id: string;
  status: OrderStatus;
};

type StartPickingPayload = {
  id: string;
};

type SetPickedQuantityPayload = {
  orderId: string;
  productId: string;
  quantity: number;
};

type CompletePickingPayload = {
  id: string;
};

type ReserveOrderItemsPayload = {
  orderId: string;
  productId: string;
  quantity: number;
};

type SyncOrderClientPayload = {
  clientId: string;
  clientName: string;
  addresses: ClientAddress[];
};

const initialState: OrdersState = {
  items: dummyOrders,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      const order = action.payload;
      order.fulfillmentStatus = nextFulfillmentFromStock(order);
      state.items.unshift(order);
    },
    updateOrderStatus: (state, action: PayloadAction<UpdateOrderStatusPayload>) => {
      const order = state.items.find((item) => item.id === action.payload.id);

      if (!order || order.status !== "New" || action.payload.status !== "Paid") {
        return;
      }

      order.status = action.payload.status;
    },
    reserveOrderItems: (state, action: PayloadAction<ReserveOrderItemsPayload>) => {
      const order = state.items.find((item) => item.id === action.payload.orderId);
      const line = order?.items.find((item) => item.productId === action.payload.productId);

      if (!order || !line) {
        return;
      }

      const remaining = Math.max(0, line.quantity - line.reservedQuantity);
      const toReserve = Math.min(remaining, Math.max(0, action.payload.quantity));
      line.reservedQuantity += toReserve;
      order.fulfillmentStatus = nextFulfillmentFromStock(order);
    },
    startPicking: (state, action: PayloadAction<StartPickingPayload>) => {
      const order = state.items.find((item) => item.id === action.payload.id);

      if (!order || order.fulfillmentStatus !== "Reserved") {
        return;
      }

      order.fulfillmentStatus = "Picking";
    },
    setPickedQuantity: (state, action: PayloadAction<SetPickedQuantityPayload>) => {
      const order = state.items.find((item) => item.id === action.payload.orderId);
      const line = order?.items.find((item) => item.productId === action.payload.productId);

      if (!order || !line || order.fulfillmentStatus !== "Picking") {
        return;
      }

      line.pickedQuantity = Math.min(line.quantity, Math.max(0, action.payload.quantity));
    },
    completePicking: (state, action: PayloadAction<CompletePickingPayload>) => {
      const order = state.items.find((item) => item.id === action.payload.id);

      if (!order || order.fulfillmentStatus !== "Picking" || !isOrderFullyPicked(order)) {
        return;
      }

      order.fulfillmentStatus = "Ready";
    },
    releaseOrderReservation: (state, action: PayloadAction<{ id: string }>) => {
      const order = state.items.find((item) => item.id === action.payload.id);

      if (!order) {
        return;
      }

      for (const line of order.items) {
        line.reservedQuantity = 0;
        line.pickedQuantity = 0;
      }

      order.fulfillmentStatus = "Waiting";
    },
    syncOrderClient: (state, action: PayloadAction<SyncOrderClientPayload>) => {
      for (const order of state.items) {
        if (order.clientId !== action.payload.clientId) {
          continue;
        }

        order.clientName = action.payload.clientName;
        const address = action.payload.addresses.find((item) => item.id === order.addressId);

        if (address) {
          order.destination = address.line;
        }
      }
    },
  },
  selectors: {
    selectOrders: (state) => state.items,
  },
});

export const {
  addOrder,
  updateOrderStatus,
  reserveOrderItems,
  startPicking,
  setPickedQuantity,
  completePicking,
  releaseOrderReservation,
  syncOrderClient,
} = ordersSlice.actions;

export const { selectOrders } = ordersSlice.selectors;

export default ordersSlice.reducer;
