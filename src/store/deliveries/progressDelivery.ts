import {
  canEditDeliveryAssignment,
  isDeliveryTerminal,
  type DeliveryProof,
  type DeliveryStatus,
  type FailureReason,
} from "../../data/deliveries.schema";
import { addNotification } from "../notifications/notifications.slice";
import { getStockLevel } from "../../theme/stockLevel";
import { paths } from "../../routing/routes";
import { updateDeliveryStatus } from "./deliveries.slice";
import { adjustInventoryQuantity } from "../inventory/inventory.slice";
import { releaseOrderReservation } from "../orders/orders.slice";
import { logOpsEvent } from "../ops/logOpsEvent";
import type { AppDispatch, RootState } from "../types";

type ProgressDeliveryInput = {
  deliveryId: string;
  status: DeliveryStatus;
  proof?: DeliveryProof;
  failureReason?: FailureReason;
};

const statusMessage = (status: DeliveryStatus, failureReason?: FailureReason) => {
  if (status === "In transit") {
    return "Departed, stock written off";
  }

  if (status === "Arrived") {
    return "Arrived on site";
  }

  if (status === "Done") {
    return "Delivered";
  }

  if (status === "Failed") {
    return failureReason ? `Could not deliver: ${failureReason}` : "Could not deliver";
  }

  if (status === "Canceled") {
    return "Delivery canceled, stock returned to warehouse";
  }

  return `Status changed to ${status}`;
};

export const progressDelivery =
  (input: ProgressDeliveryInput) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const user = state.auth.user;
    const delivery = state.deliveries.items.find((item) => item.id === input.deliveryId);

    if (!user || !delivery || isDeliveryTerminal(delivery.status)) {
      return;
    }

    const now = new Date().toISOString();
    const shipping =
      input.status === "In transit" || input.status === "Arrived" || input.status === "Done";
    const returning = input.status === "Canceled" || input.status === "Failed";
    let stockWrittenOff = delivery.stockWrittenOff;
    const linkedOrder = delivery.orderId
      ? state.orders.items.find((item) => item.id === delivery.orderId)
      : undefined;

    if (shipping && !stockWrittenOff) {
      if (!delivery.reservesStock && !delivery.orderId) {
        for (const line of delivery.items) {
          dispatch(adjustInventoryQuantity({ id: line.productId, delta: -line.quantity }));
        }
      }

      stockWrittenOff = true;
    }

    if (returning) {
      if (linkedOrder) {
        for (const line of linkedOrder.items) {
          if (line.reservedQuantity > 0) {
            dispatch(adjustInventoryQuantity({ id: line.productId, delta: line.reservedQuantity }));
          }
        }

        dispatch(releaseOrderReservation({ id: linkedOrder.id }));
        stockWrittenOff = false;
      } else if (
        stockWrittenOff ||
        delivery.reservesStock ||
        canEditDeliveryAssignment(delivery.status)
      ) {
        for (const line of delivery.items) {
          dispatch(adjustInventoryQuantity({ id: line.productId, delta: line.quantity }));
        }

        stockWrittenOff = false;
      }
    }

    dispatch(
      updateDeliveryStatus({
        id: delivery.id,
        status: input.status,
        proof: input.proof,
        failureReason: input.failureReason,
        shippedAt: input.status === "In transit" ? now : undefined,
        arrivedAt: input.status === "Arrived" ? now : undefined,
        completedAt: input.status === "Done" || input.status === "Failed" ? now : undefined,
        stockWrittenOff,
      }),
    );

    const href = paths.deliveries(user.companyName);
    const notify =
      input.status === "Failed"
        ? [
            {
              role: "SEO" as const,
              title: "Delivery failed",
              body: `${delivery.number}: ${input.failureReason ?? "Could not deliver"}`,
              href,
            },
            {
              role: "Staff" as const,
              title: "Delivery failed",
              body: `${delivery.number}: ${input.failureReason ?? "Could not deliver"}`,
              href,
            },
          ]
        : input.status === "In transit" &&
            delivery.deliverBy &&
            new Date(delivery.deliverBy).getTime() < Date.now()
          ? [
              {
                role: "SEO" as const,
                title: "Delivery is overdue",
                body: `${delivery.number} left after its planned ETA`,
                href,
              },
            ]
          : undefined;

    dispatch(
      logOpsEvent({
        companyId: delivery.companyId,
        entityType: "delivery",
        entityId: delivery.id,
        entityNumber: delivery.number,
        message: statusMessage(input.status, input.failureReason),
        actorId: user.id,
        actorName: user.name,
        notify,
      }),
    );

    if (shipping && !delivery.stockWrittenOff) {
      const inventory = getState().inventory.items;

      for (const line of delivery.items) {
        const product = inventory.find((item) => item.id === line.productId);

        if (!product || getStockLevel(product.quantity) !== "critical") {
          continue;
        }

        const createdAt = new Date().toISOString();

        dispatch(
          addNotification({
            id: crypto.randomUUID(),
            companyId: delivery.companyId,
            recipientRole: "SEO",
            title: "Critical stock",
            body: `${product.name} dropped below the safety level`,
            href: paths.warehouse(user.companyName),
            read: false,
            createdAt,
          }),
        );
        dispatch(
          addNotification({
            id: crypto.randomUUID(),
            companyId: delivery.companyId,
            recipientRole: "Storekeeper",
            title: "Critical stock",
            body: `${product.name} dropped below the safety level`,
            href: paths.warehouse(user.companyName),
            read: false,
            createdAt,
          }),
        );
      }
    }
  };
