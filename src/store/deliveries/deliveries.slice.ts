import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ClientAddress } from "../../data/clients.schema";
import { dummyDeliveries } from "../../data/deliveries.dummy";
import {
  canEditDeliveryAssignment,
  getDeliveryStatusFromSchedule,
  isDeliveryTerminal,
  type Delivery,
  type DeliveryProof,
  type DeliveryStatus,
  type FailureReason,
} from "../../data/deliveries.schema";

type DeliveriesState = {
  items: Delivery[];
};

type UpdateDeliveryStatusPayload = {
  id: string;
  status: DeliveryStatus;
  proof?: DeliveryProof;
  failureReason?: FailureReason;
  shippedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  stockWrittenOff?: boolean;
};

type UpdateDeliverySchedulePayload = {
  id: string;
  dispatchAt?: string;
  deliverBy?: string;
};

type UpdateDeliveryDriverPayload = {
  id: string;
  driverId?: string;
  driverName?: string;
};

type UpdateDeliveryAddressPayload = {
  id: string;
  addressId?: string;
  destination?: string;
  lat?: number;
  lng?: number;
};

type UpdateDeliveryVehiclePayload = {
  id: string;
  vehicleId?: string;
  vehicleName?: string;
};

type AssignRouteStopsPayload = {
  routeId: string;
  routeNumber: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  stops: Array<{ deliveryId: string; stopIndex: number }>;
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

      if (!delivery || isDeliveryTerminal(delivery.status)) {
        return;
      }

      delivery.status = action.payload.status;

      if (action.payload.proof) {
        delivery.proof = action.payload.proof;
      }

      if (action.payload.failureReason) {
        delivery.failureReason = action.payload.failureReason;
      }

      if (action.payload.shippedAt) {
        delivery.shippedAt = action.payload.shippedAt;
      }

      if (action.payload.arrivedAt) {
        delivery.arrivedAt = action.payload.arrivedAt;
      }

      if (action.payload.completedAt) {
        delivery.completedAt = action.payload.completedAt;
      }

      if (action.payload.stockWrittenOff !== undefined) {
        delivery.stockWrittenOff = action.payload.stockWrittenOff;
      }
    },
    updateDeliverySchedule: (state, action: PayloadAction<UpdateDeliverySchedulePayload>) => {
      const delivery = state.items.find((item) => item.id === action.payload.id);

      if (!delivery || !canEditDeliveryAssignment(delivery.status)) {
        return;
      }

      delivery.dispatchAt = action.payload.dispatchAt;
      delivery.deliverBy = action.payload.deliverBy;
      delivery.status = getDeliveryStatusFromSchedule(delivery.dispatchAt, delivery.deliverBy);
    },
    updateDeliveryDriver: (state, action: PayloadAction<UpdateDeliveryDriverPayload>) => {
      const delivery = state.items.find((item) => item.id === action.payload.id);

      if (!delivery || !canEditDeliveryAssignment(delivery.status)) {
        return;
      }

      delivery.driverId = action.payload.driverId;
      delivery.driverName = action.payload.driverName;
    },
    updateDeliveryAddress: (state, action: PayloadAction<UpdateDeliveryAddressPayload>) => {
      const delivery = state.items.find((item) => item.id === action.payload.id);

      if (!delivery || !canEditDeliveryAssignment(delivery.status)) {
        return;
      }

      delivery.addressId = action.payload.addressId;
      delivery.destination = action.payload.destination;
      delivery.lat = action.payload.lat;
      delivery.lng = action.payload.lng;
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
          delivery.lat = address.lat;
          delivery.lng = address.lng;
        }
      }
    },
    updateDeliveryVehicle: (state, action: PayloadAction<UpdateDeliveryVehiclePayload>) => {
      const delivery = state.items.find((item) => item.id === action.payload.id);

      if (!delivery || !canEditDeliveryAssignment(delivery.status)) {
        return;
      }

      delivery.vehicleId = action.payload.vehicleId;
      delivery.vehicleName = action.payload.vehicleName;
    },
    assignRouteStops: (state, action: PayloadAction<AssignRouteStopsPayload>) => {
      for (const stop of action.payload.stops) {
        const delivery = state.items.find((item) => item.id === stop.deliveryId);

        if (!delivery || !canEditDeliveryAssignment(delivery.status)) {
          continue;
        }

        delivery.routeId = action.payload.routeId;
        delivery.routeNumber = action.payload.routeNumber;
        delivery.stopIndex = stop.stopIndex;
        delivery.driverId = action.payload.driverId;
        delivery.driverName = action.payload.driverName;
        delivery.vehicleId = action.payload.vehicleId;
        delivery.vehicleName = action.payload.vehicleName;
        if (delivery.status === "New") {
          delivery.status = "Planned";
        }
      }
    },
  },
  selectors: {
    selectDeliveries: (state) => state.items,
  },
});

export const {
  addDelivery,
  updateDeliveryStatus,
  updateDeliverySchedule,
  updateDeliveryDriver,
  updateDeliveryAddress,
  updateDeliveryVehicle,
  assignRouteStops,
  syncDeliveryClient,
} = deliveriesSlice.actions;

export const { selectDeliveries } = deliveriesSlice.selectors;

export default deliveriesSlice.reducer;
